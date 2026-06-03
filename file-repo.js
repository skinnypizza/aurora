const fs = require('fs');
const path = require('path');

class FileRepository {
  constructor(dataDir) {
    this.DATA_DIR = dataDir;
  }

  _read(filePath) {
    try { return JSON.parse(fs.readFileSync(filePath, 'utf8')); } catch { return null; }
  }
  _write(filePath, data) {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {fs.mkdirSync(dir, { recursive: true });}
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  }

  pDir(id) { return path.join(this.DATA_DIR, id); }
  sDir(id) { return path.join(this.DATA_DIR, id, 'backlog'); }
  sprDir(id) { return path.join(this.DATA_DIR, id, 'sprints'); }
  docsDir(id) { return path.join(this.DATA_DIR, id, 'docs'); }

  storyFile(projectId, storyId) {
    return path.join(this.sDir(projectId), storyId.replace(/\./g, '-') + '.json');
  }
  sprintFile(projectId, sprintNum) {
    return path.join(this.sprDir(projectId), `sprint-${String(sprintNum).padStart(2,'0')}.json`);
  }

  // ── Project ──
  async getIndex() {
    let idx = this._read(path.join(this.DATA_DIR, 'index.json'));
    if (!idx) { idx = { projects: [] }; this._write(path.join(this.DATA_DIR, 'index.json'), idx); }
    return idx;
  }
  async saveIndex(idx) { this._write(path.join(this.DATA_DIR, 'index.json'), idx); }

  async getProject(id) { return this._read(path.join(this.pDir(id), 'project.json')); }
  async saveProject(id, data) { this._write(path.join(this.pDir(id), 'project.json'), data); }
  async deleteProject(id) {
    const dir = this.pDir(id);
    if (fs.existsSync(dir)) {fs.rmSync(dir, { recursive: true, force: true });}
  }
  async createProjectDirs(id) {
    fs.mkdirSync(this.pDir(id), { recursive: true });
    fs.mkdirSync(this.sDir(id), { recursive: true });
    fs.mkdirSync(this.sprDir(id), { recursive: true });
    fs.mkdirSync(this.docsDir(id), { recursive: true });
  }

  async getProjectsWithStats() {
    const index = await this.getIndex();
    return index.projects.map(p => {
      const proj = this._read(path.join(this.pDir(p.id), 'project.json'));
      if (!proj) {return p;}
      const sDir = this.sDir(p.id);
      let totalStories = 0, doneStories = 0;
      if (fs.existsSync(sDir)) {
        const files = fs.readdirSync(sDir).filter(f => f.endsWith('.json'));
        totalStories = files.length;
        files.forEach(f => {
          const story = this._read(path.join(sDir, f));
          if (story && story.status === 'Done') {doneStories++;}
        });
      }
      return { ...p, ...proj, totalStories, doneStories };
    });
  }

  // ── Stories ──
  async getStories(projectId) {
    const sDir = this.sDir(projectId);
    if (!fs.existsSync(sDir)) {return [];}
    return fs.readdirSync(sDir).filter(f => f.endsWith('.json'))
      .map(f => this._read(path.join(sDir, f)))
      .filter(Boolean)
      .map(s => this._enrichStory(s));
  }
  async getStory(projectId, storyId) {
    const f = this.storyFile(projectId, storyId);
    if (!fs.existsSync(f)) {return null;}
    return this._enrichStory(this._read(f));
  }
  async saveStory(projectId, story) {
    this._write(this.storyFile(projectId, story.id), story);
  }
  async deleteStory(projectId, storyId) {
    const f = this.storyFile(projectId, storyId);
    if (fs.existsSync(f)) {fs.unlinkSync(f);}
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
    const sDir = this.sDir(projectId);
    if (!fs.existsSync(sDir)) { fs.mkdirSync(sDir, { recursive: true }); return null; }
    const prefix = projectId.toUpperCase();
    const existing = fs.readdirSync(sDir).filter(f => f.endsWith('.json'));
    let maxNum = 0;
    const pattern = new RegExp(`^${prefix}-${sprintNum}\\.(\\d+)$`);
    existing.forEach(f => {
      const s = this._read(path.join(sDir, f));
      if (s && s.id) {
        const m = s.id.match(pattern);
        if (m) { const n = parseInt(m[1]); if (n > maxNum) {maxNum = n;} }
      }
    });
    return `${prefix}-${sprintNum}.${maxNum + 1}`;
  }

  // ── Sprints ──
  async getSprints(projectId) {
    const d = this.sprDir(projectId);
    if (!fs.existsSync(d)) {return [];}
    return fs.readdirSync(d).filter(f => f.endsWith('.json'))
      .map(f => this._read(path.join(d, f)))
      .filter(Boolean);
  }
  async getSprint(projectId, sprintNum) {
    return this._read(this.sprintFile(projectId, sprintNum));
  }
  async saveSprint(projectId, sprint) {
    this._write(this.sprintFile(projectId, sprint.id), sprint);
  }
  async deleteSprint(projectId, sprintNum) {
    const f = this.sprintFile(projectId, sprintNum);
    if (fs.existsSync(f)) {fs.unlinkSync(f);}
  }

  // ── Team ──
  async getTeam(projectId) {
    return this._read(path.join(this.pDir(projectId), 'team.json')) || { members: [] };
  }
  async saveTeam(projectId, team) {
    this._write(path.join(this.pDir(projectId), 'team.json'), team);
  }

  // ── Context (para IA) ──
  async generateContext(projectId) {
    const project = await this.getProject(projectId);
    if (!project) {return null;}
    const stories = await this.getStories(projectId);
    const sprints = await this.getSprints(projectId);
    const team = await this.getTeam(projectId);
    const context = { project, stories, sprints, team };

    const md = this._generateContextMD(context);
    const docsDir = this.docsDir(projectId);
    if (!fs.existsSync(docsDir)) {fs.mkdirSync(docsDir, { recursive: true });}
    fs.writeFileSync(path.join(docsDir, 'context.md'), md, 'utf8');

    return context;
  }

  _generateContextMD(ctx) {
    const { project, stories, sprints, team } = ctx;
    let md = `# Contexto del Proyecto: ${project.title}\n\n`;
    md += `**Estado:** ${project.status} | **Sprint Actual:** ${project.currentSprint || '-'} | **Total Sprints:** ${project.totalSprints || '-'}\n\n`;
    md += `**Tech Stack:** ${(project.techStack||[]).join(', ')}\n\n`;
    md += '## Resumen\n\n';
    const total = stories.length;
    const done = stories.filter(s => s.status === 'Done').length;
    const inProg = stories.filter(s => s.status === 'InProgress').length;
    const totalSp = stories.reduce((a,s) => a + (s.sp||0), 0);
    const doneSp = stories.filter(s => s.status === 'Done').reduce((a,s) => a + (s.sp||0), 0);
    md += `- Historias: ${total} totales | ${done} completadas | ${inProg} en progreso\n`;
    md += `- Story Points: ${totalSp} totales | ${doneSp} completados (${totalSp ? Math.round(doneSp/totalSp*100) : 0}%)\n\n`;
    md += `## Equipo (${team.members.length})\n\n`;
    team.members.forEach(m => {
      const count = stories.filter(s => s.assignee === m.alias).length;
      md += `- **${m.alias}** (${m.role}): ${count} historias asignadas, ${m.spPerSprint||'?'} SP/sprint\n`;
    });
    md += '\n## Sprints\n\n';
    sprints.forEach(sp => {
      const ss = stories.filter(s => (sp.stories||[]).includes(s.id));
      const dd = ss.filter(s => s.status === 'Done');
      md += `### ${sp.name}: ${sp.objective || 'Sin objetivo'}\n`;
      md += `- Stories: ${ss.length} | Completadas: ${dd.length} | Velocidad: ${sp.velocity||'?'} SP\n\n`;
    });
    md += '\n## Historias en Progreso\n\n';
    stories.filter(s => s.status === 'InProgress').forEach(s => {
      md += `- **[${s.id}]** ${s.title} (${s.assignee||'Sin asignar'}, ${s.sp||'?'} SP)\n`;
    });
    md += '\n_Generado automáticamente por Scrumban App_\n';
    return md;
  }

  async getMetrics(projectId) {
    const stories = await this.getStories(projectId);
    const sprints = await this.getSprints(projectId);
    const totalSp = stories.reduce((a,s) => a + (s.sp||0), 0);
    const doneSp = stories.filter(s => s.status === 'Done').reduce((a,s) => a + (s.sp||0), 0);
    const byPriority = {};
    ['Must','Should','Could','Wont'].forEach(p => {
      const ss = stories.filter(s => s.priority === p);
      byPriority[p] = { total: ss.length, done: ss.filter(s => s.status === 'Done').length, sp: ss.reduce((a,s) => a + (s.sp||0), 0) };
    });
    return {
      totalStories: stories.length,
      doneStories: stories.filter(s => s.status === 'Done').length,
      totalSp, doneSp, pctComplete: totalSp ? Math.round(doneSp/totalSp*100) : 0,
      byPriority,
      sprints: sprints.map(sp => {
        const ss = stories.filter(s => (sp.stories||[]).includes(s.id));
        const dd = ss.filter(s => s.status === 'Done');
        const ds = dd.reduce((a,s) => a + (s.sp||0), 0);
        return {
          id: sp.id, name: sp.name, velocity: sp.velocity||0,
          totalStories: ss.length, doneStories: dd.length,
          totalSp: ss.reduce((a,s) => a + (s.sp||0), 0),
          doneSp: ds,
          pctComplete: ss.reduce((a,s) => a + (s.sp||0), 0) ? Math.round(ds / ss.reduce((a,s) => a + (s.sp||0), 0) * 100) : 0
        };
      }),
      avgVelocity: sprints.length ? Math.round(sprints.reduce((a,s) => a + (s.velocity||0), 0) / sprints.length) : 0,
      byMember: {},
    };
  }

  async exportToMarkdown(projectId) {
    const ctx = await this.generateContext(projectId);
    if (!ctx) {return null;}
    const { project, stories, sprints, team } = ctx;
    let md = `# ${project.title} — Reporte Completo\n\n`;
    md += `_Generado: ${new Date().toISOString()}_\n\n`;
    md += '## Metadata\n\n';
    md += `- ID: ${project.id}\n- Estado: ${project.status}\n- Sprint: ${project.currentSprint||'-'}/${project.totalSprints||'-'}\n- Stack: ${(project.techStack||[]).join(', ')}\n\n`;
    md += '## Equipo\n\n| Alias | Nombre | Rol | SP/Sprint |\n|-------|--------|-----|-----------|\n';
    team.members.forEach(m => { md += `| ${m.alias} | ${m.name} | ${m.role} | ${m.spPerSprint||'-'} |\n`; });
    md += '\n## Historias\n\n| ID | Título | Prio | SP | Estado | Asignado | Sprint |\n|----|--------|------|----|--------|----------|--------|\n';
    stories.sort((a,b) => a.id.localeCompare(b.id)).forEach(s => {
      md += `| ${s.id} | ${(s.title||'').replace(/\|/g,'\\|')} | ${s.priority||'-'} | ${s.sp||'-'} | ${s.status||'-'} | ${s.assignee||'-'} | ${s.sprint||'-'} |\n`;
    });
    md += '\n## Sprints\n\n';
    sprints.forEach(sp => {
      md += `### ${sp.name}\n- Objetivo: ${sp.objective||'—'}\n- Velocidad: ${sp.velocity||0} SP\n- Stories: ${(sp.stories||[]).length}\n\n`;
    });
    return md;
  }
}

module.exports = FileRepository;
