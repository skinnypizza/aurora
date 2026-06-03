// ══════════════════════════════════════════════════
//  Scrumban App — Migration Script
//  Migrates local JSON data to MongoDB Atlas
// ══════════════════════════════════════════════════

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const MongoRepository = require('./mongo-repo');

const DATA_DIR = path.join(__dirname, 'proyectos');

async function migrate() {
  if (!process.env.MONGO_URI) {
    console.error('[ERR] MONGO_URI not found in .env');
    return;
  }

  const repo = new MongoRepository(process.env.MONGO_URI, process.env.MONGO_DB);
  await repo.connect();

  console.log('>> Starting migration...');

  // 1. Read index.json
  const indexPath = path.join(DATA_DIR, 'index.json');
  if (!fs.existsSync(indexPath)) {
    console.log('[WARN] index.json not found. Nothing to migrate.');
    await repo.disconnect();
    return;
  }

  const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
  console.log(`Found ${index.projects.length} projects in local index.`);

  for (const p of index.projects) {
    const projectId = p.id;
    console.log(`\n[Migrating] project: ${projectId}...`);

    // Migrate project.json
    const projPath = path.join(DATA_DIR, projectId, 'project.json');
    if (fs.existsSync(projPath)) {
      const projData = JSON.parse(fs.readFileSync(projPath, 'utf8'));
      await repo.saveProject(projectId, projData);
      console.log(' [OK] project.json migrated');
    }

    // Migrate team.json
    const teamPath = path.join(DATA_DIR, projectId, 'team.json');
    if (fs.existsSync(teamPath)) {
      const teamData = JSON.parse(fs.readFileSync(teamPath, 'utf8'));
      await repo.saveTeam(projectId, teamData);
      console.log(' [OK] team.json migrated');
    }

    // Migrate stories
    const storiesDir = path.join(DATA_DIR, projectId, 'backlog');
    if (fs.existsSync(storiesDir)) {
      const files = fs.readdirSync(storiesDir).filter(f => f.endsWith('.json'));
      for (const f of files) {
        const story = JSON.parse(fs.readFileSync(path.join(storiesDir, f), 'utf8'));
        await repo.saveStory(projectId, story);
      }
      console.log(` [OK] ${files.length} stories migrated`);
    }

    // Migrate sprints
    const sprintsDir = path.join(DATA_DIR, projectId, 'sprints');
    if (fs.existsSync(sprintsDir)) {
      const files = fs.readdirSync(sprintsDir).filter(f => f.endsWith('.json'));
      for (const f of files) {
        const sprint = JSON.parse(fs.readFileSync(path.join(sprintsDir, f), 'utf8'));
        await repo.saveSprint(projectId, sprint);
      }
      console.log(` [OK] ${files.length} sprints migrated`);
    }
  }

  console.log('\nMigration completed successfully!');
  await repo.disconnect();
}

migrate().catch(err => {
  console.error('\n[ERR] Migration failed:', err);
  process.exit(1);
});
