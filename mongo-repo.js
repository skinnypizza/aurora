// ══════════════════════════════════════════════════
//  Scrumban App — MongoRepository
//  Drop-in replacement for FileRepository
//  Uses MongoDB Atlas for data persistence
// ══════════════════════════════════════════════════

const { MongoClient, ObjectId } = require('mongodb');

class MongoRepository {
  constructor(uri, dbName = 'scrumban') {
    this.uri = uri;
    this.dbName = dbName;
    this.client = null;
    this.db = null;
  }

  async connect() {
    if (this.client) {return;}
    this.client = new MongoClient(this.uri);
    await this.client.connect();
    this.db = this.client.db(this.dbName);
    console.log('  MongoDB conectado → ' + this.dbName);

    // Ensure indexes
    await this.db.collection('projects').createIndex({ id: 1 }, { unique: true });
    await this.db.collection('projects').createIndex({ ownerId: 1 });
    await this.db.collection('memberships').createIndex({ projectId: 1, userId: 1 }, { unique: true });
    await this.db.collection('stories').createIndex({ projectId: 1 });
    await this.db.collection('stories').createIndex({ projectId: 1, id: 1 }, { unique: true });
    await this.db.collection('sprints').createIndex({ projectId: 1, id: 1 }, { unique: true });
    await this.db.collection('teams').createIndex({ projectId: 1 }, { unique: true });
    await this.db.collection('users').createIndex({ email: 1 }, { unique: true });
  }

  async disconnect() {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.db = null;
    }
  }

  // ── Project ──
  async getProjectsForUser(userId) {
    const memberships = await this.db.collection('memberships').find({ userId: new ObjectId(userId) }).toArray();
    const projectIds = memberships.map(m => m.projectId);
    
    // Also include owned projects
    const owned = await this.db.collection('projects').find({ ownerId: new ObjectId(userId) }).toArray();
    const ownedIds = owned.map(p => p.id);

    const allIds = [...new Set([...projectIds, ...ownedIds])];
    
    const projects = await this.db.collection('projects')
      .find({ id: { $in: allIds } }, { projection: { _id: 0 } })
      .toArray();

    const results = [];
    for (const proj of projects) {
      const stories = await this.db.collection('stories').find({ projectId: proj.id }).toArray();
      const membership = memberships.find(m => m.projectId === proj.id);
      const role = proj.ownerId?.toString() === userId.toString() ? 'Owner' : (membership?.role || 'Member');
      results.push({ 
        ...proj, 
        totalStories: stories.length, 
        doneStories: stories.filter(s => s.status === 'Done').length,
        role
      });
    }
    return results;
  }

  async getProject(id, userId) {
    const doc = await this.db.collection('projects').findOne({ id }, { projection: { _id: 0 } });
    if (!doc) {return null;}

    // Check access
    const isOwner = doc.ownerId?.toString() === userId.toString();
    const membership = await this.db.collection('memberships').findOne({ projectId: id, userId: new ObjectId(userId) });
    
    if (!isOwner && !membership) {return null;} // No access
    
    return { ...doc, role: isOwner ? 'Owner' : membership.role };
  }

  async saveProject(id, data, userId) {
    data.ownerId = new ObjectId(data.ownerId || userId);
    await this.db.collection('projects').updateOne(
      { id },
      { $set: { ...data, id } },
      { upsert: true }
    );
  }

  async deleteProject(id, userId) {
    const project = await this.getProject(id, userId);
    if (!project || project.role !== 'Owner') {throw new Error('Solo el dueño puede eliminar el proyecto');}
    
    await this.db.collection('projects').deleteOne({ id });
    await this.db.collection('stories').deleteMany({ projectId: id });
    await this.db.collection('sprints').deleteMany({ projectId: id });
    await this.db.collection('teams').deleteOne({ projectId: id });
    await this.db.collection('memberships').deleteMany({ projectId: id });
  }

  // ── Memberships ──
  async addMember(projectId, email, role = 'Member') {
    const user = await this.db.collection('users').findOne({ email: email.toLowerCase() });
    if (!user) {throw new Error('El usuario no está registrado en Scrumban');}
    
    await this.db.collection('memberships').updateOne(
      { projectId, userId: user._id },
      { $set: { projectId, userId: user._id, role, joinedAt: new Date().toISOString() } },
      { upsert: true }
    );
    return { id: user._id, name: user.name, email: user.email, role };
  }

  async getProjectMembers(projectId) {
    const memberships = await this.db.collection('memberships').find({ projectId }).toArray();
    const userIds = memberships.map(m => m.userId);
    const users = await this.db.collection('users').find({ _id: { $in: userIds } }).toArray();
    
    return users.map(u => {
      const m = memberships.find(ms => ms.userId.toString() === u._id.toString());
      return { id: u._id, name: u.name, email: u.email, role: m.role, avatar: u.avatar };
    });
  }

  // ── Stories (Filtering by access handled by server calling getProject first) ──
  async getStories(projectId) {
    const stories = await this.db.collection('stories')
      .find({ projectId }, { projection: { _id: 0, projectId: 0 } })
      .toArray();
    return stories.map(s => this._enrichStory(s));
  }

  async getStory(projectId, storyId) {
    const doc = await this.db.collection('stories')
      .findOne({ projectId, id: storyId }, { projection: { _id: 0, projectId: 0 } });
    return doc ? this._enrichStory(doc) : null;
  }

  async saveStory(projectId, story) {
    const doc = { ...story, projectId };
    await this.db.collection('stories').updateOne(
      { projectId, id: story.id },
      { $set: doc },
      { upsert: true }
    );
  }

  async deleteStory(projectId, storyId) {
    await this.db.collection('stories').deleteOne({ projectId, id: storyId });
  }

  _enrichStory(s) {
    if (!s) {return s;}
    if (s.updated) {
      s._daysInColumn = Math.floor((Date.now() - new Date(s.updated).getTime()) / 86400000);
    }
    s._blocked = false;
    return s;
  }

  async generateStoryId(projectId, sprintNum) {
    const prefix = projectId.toUpperCase();
    const pattern = new RegExp(`^${prefix}-${sprintNum}\\.(\\d+)$`);
    const stories = await this.db.collection('stories')
      .find({ projectId }, { projection: { id: 1 } })
      .toArray();
    let maxNum = 0;
    stories.forEach(s => {
      if (s.id) {
        const m = s.id.match(pattern);
        if (m) { const n = parseInt(m[1]); if (n > maxNum) {maxNum = n;} }
      }
    });
    return `${prefix}-${sprintNum}.${maxNum + 1}`;
  }

  // ── Sprints ──
  async getSprints(projectId) {
    return this.db.collection('sprints')
      .find({ projectId }, { projection: { _id: 0, projectId: 0 } })
      .sort({ id: 1 })
      .toArray();
  }

  async getSprint(projectId, sprintNum) {
    return this.db.collection('sprints')
      .findOne({ projectId, id: Number(sprintNum) }, { projection: { _id: 0, projectId: 0 } });
  }

  async saveSprint(projectId, sprint) {
    const doc = { ...sprint, projectId, id: Number(sprint.id) };
    await this.db.collection('sprints').updateOne(
      { projectId, id: Number(sprint.id) },
      { $set: doc },
      { upsert: true }
    );
  }

  async deleteSprint(projectId, sprintNum) {
    await this.db.collection('sprints').deleteOne({ projectId, id: Number(sprintNum) });
  }

  // ── Team ──
  async getTeam(projectId) {
    const doc = await this.db.collection('teams')
      .findOne({ projectId }, { projection: { _id: 0, projectId: 0 } });
    return doc || { members: [] };
  }

  async saveTeam(projectId, team) {
    const doc = { ...team, projectId };
    await this.db.collection('teams').updateOne(
      { projectId },
      { $set: doc },
      { upsert: true }
    );
  }

  // ── Context ──
  async generateContext(projectId) {
    const project = await this.db.collection('projects').findOne({ id: projectId });
    if (!project) {return null;}
    const stories = await this.getStories(projectId);
    const sprints = await this.getSprints(projectId);
    const team = await this.getTeam(projectId);
    return { project, stories, sprints, team };
  }

  // ── Métricas ──
  async getMetrics(projectId) {
    const stories = await this.getStories(projectId);
    const sprints = await this.getSprints(projectId);
    const totalSp = stories.reduce((a, s) => a + (s.sp || 0), 0);
    const doneSp = stories.filter(s => s.status === 'Done').reduce((a, s) => a + (s.sp || 0), 0);
    const byPriority = {};
    ['Must', 'Should', 'Could', 'Wont'].forEach(p => {
      const ss = stories.filter(s => s.priority === p);
      byPriority[p] = {
        total: ss.length,
        done: ss.filter(s => s.status === 'Done').length,
        sp: ss.reduce((a, s) => a + (s.sp || 0), 0)
      };
    });
    return {
      totalStories: stories.length,
      doneStories: stories.filter(s => s.status === 'Done').length,
      totalSp, doneSp,
      pctComplete: totalSp ? Math.round(doneSp / totalSp * 100) : 0,
      byPriority,
      sprints: sprints.map(sp => {
        const ss = stories.filter(s => (sp.stories || []).includes(s.id));
        const dd = ss.filter(s => s.status === 'Done');
        const ds = dd.reduce((a, s) => a + (s.sp || 0), 0);
        const tsp = ss.reduce((a, s) => a + (s.sp || 0), 0);
        return {
          id: sp.id, name: sp.name, velocity: sp.velocity || 0,
          totalStories: ss.length, doneStories: dd.length,
          totalSp: tsp, doneSp: ds,
          pctComplete: tsp ? Math.round(ds / tsp * 100) : 0
        };
      }),
      avgVelocity: sprints.length ? Math.round(sprints.reduce((a, s) => a + (s.velocity || 0), 0) / sprints.length) : 0,
      byMember: {},
    };
  }

  // ── Reportes exportables ──
  async exportToMarkdown(projectId) {
    const ctx = await this.generateContext(projectId);
    if (!ctx) {return null;}
    const { project, stories, sprints, team } = ctx;
    let md = `# ${project.title} — Reporte Completo\n\n`;
    md += `_Generado: ${new Date().toISOString()}_\n\n`;
    md += '## Metadata\n\n';
    md += `- ID: ${project.id}\n- Estado: ${project.status}\n- Sprint: ${project.currentSprint || '-'}/${project.totalSprints || '-'}\n- Stack: ${(project.techStack || []).join(', ')}\n\n`;
    md += '## Equipo\n\n| Alias | Nombre | Rol | SP/Sprint |\n|-------|--------|-----|----------|\n';
    team.members.forEach(m => { md += `| ${m.alias} | ${m.name} | ${m.role} | ${m.spPerSprint || '-'} |\n`; });
    md += '\n## Historias\n\n| ID | Título | Prio | SP | Estado | Asignado | Sprint |\n|----|--------|------|----|--------|----------|--------|\n';
    stories.sort((a, b) => a.id.localeCompare(b.id)).forEach(s => {
      md += `| ${s.id} | ${(s.title || '').replace(/\|/g, '\\|')} | ${s.priority || '-'} | ${s.sp || '-'} | ${s.status || '-'} | ${s.assignee || '-'} | ${s.sprint || '-'} |\n`;
    });
    md += '\n## Sprints\n\n';
    sprints.forEach(sp => {
      md += `### ${sp.name}\n- Objetivo: ${sp.objective || '—'}\n- Velocidad: ${sp.velocity || 0} SP\n- Stories: ${(sp.stories || []).length}\n\n`;
    });
    return md;
  }
}

module.exports = MongoRepository;
