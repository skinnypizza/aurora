#!/usr/bin/env node

/**
 * ══════════════════════════════════════════════════
 *  Scrumban App — CLI Tool (FR-31)
 *  Usage: node cli.js <command> [args]
 * ══════════════════════════════════════════════════
 */

require('dotenv').config();
const MongoRepository = require('./mongo-repo');
const FileRepository = require('./file-repo');
const path = require('path');

const command = process.argv[2];
const args = process.argv.slice(3);

let repo;
if (process.env.MONGO_URI) {
  repo = new MongoRepository(process.env.MONGO_URI, process.env.MONGO_DB);
} else {
  repo = new FileRepository(path.join(__dirname, 'proyectos'));
}

async function run() {
  if (repo.connect) {await repo.connect();}

  switch (command) {
    case 'list': {
      const { projects } = await repo.getIndex();
      console.log('\n[PROYECTOS]:');
      projects.forEach(p => console.log(` - [${p.id}] ${p.title} (${p.created})`));
      break;
    }
    case 'show': {
      if (!args[0]) {return console.log('Uso: node cli.js show <project-id>');}
      const stories = await repo.getStories(args[0]);
      console.log(`\n[HISTORIAS] [${args[0]}]:`);
      stories.forEach(s => console.log(` - [${s.id}] ${s.title} (${s.status})`));
      break;
    }
    case 'stats': {
      const stats = await repo.getProjectsWithStats();
      console.table(stats.map(p => ({ ID: p.id, Titulo: p.title, Historias: p.totalStories, Done: p.doneStories })));
      break;
    }
    case 'export': {
      if (!args[0]) {return console.log('Uso: node cli.js export <project-id>');}
      const md = await repo.exportToMarkdown(args[0]);
      console.log(md);
      break;
    }

    case 'add-member':
    case 'local-member-add': {
      const projectId = args[0];
      if (!projectId) {return console.log('Uso: node cli.js add-member <project-id> [--alias <alias>] [--name <name>] [--role <role>] [--color <#hex>]');}
      const opts = {};
      for (let i = 1; i < args.length; i += 2) {
        if (args[i] === '--alias') {opts.alias = args[i + 1];}
        else if (args[i] === '--name') {opts.name = args[i + 1];}
        else if (args[i] === '--role') {opts.role = args[i + 1];}
        else if (args[i] === '--color') {opts.color = args[i + 1];}
      }
      if (!opts.alias) {return console.log('--alias es requerido');}
      const project = await repo.getProject(projectId);
      if (!project) {return console.log('Proyecto no encontrado: ' + projectId);}
      const localMembers = project.localMembers || [];
      const id = 'local-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
      const member = { id, alias: opts.alias, name: opts.name || opts.alias, role: opts.role || 'AI Sub-Agent', color: opts.color || '#8b5cf6', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=' + id, isAI: true, created: new Date().toISOString() };
      localMembers.push(member);
      project.localMembers = localMembers;
      project.updated = new Date().toISOString();
      await repo.saveProject(projectId, project);
      console.log('[OK] Miembro local creado:');
      console.table(member);
      break;
    }
    case 'list-members': {
      const projectId = args[0];
      if (!projectId) {return console.log('Uso: node cli.js list-members <project-id>');}
      const project = await repo.getProject(projectId);
      if (!project) {return console.log('Proyecto no encontrado');}
      const local = project.localMembers || [];
      if (local.length === 0) { console.log('No hay miembros locales en este proyecto.'); break; }
      console.log('\n[IA] MIEMBROS LOCALES [' + projectId + ']:');
      console.table(local.map(m => ({ ID: m.id, Alias: m.alias, Nombre: m.name, Rol: m.role, Color: m.color, IA: m.isAI ? 'SI' : 'NO' })));
      break;
    }
    case 'update-member': {
      const [projectId, memberId, ...kvArgs] = args;
      if (!projectId || !memberId) {return console.log('Uso: node cli.js update-member <project-id> <member-id> [--field value]');}
      const project = await repo.getProject(projectId);
      if (!project) {return console.log('Proyecto no encontrado');}
      const local = project.localMembers || [];
      const idx = local.findIndex(m => m.id === memberId);
      if (idx === -1) {return console.log('Miembro no encontrado: ' + memberId);}
      const updates = {};
      for (let i = 0; i < kvArgs.length; i += 2) {
        if (kvArgs[i].startsWith('--')) {updates[kvArgs[i].substring(2)] = kvArgs[i + 1];}
      }
      Object.assign(local[idx], updates);
      project.localMembers = local;
      project.updated = new Date().toISOString();
      await repo.saveProject(projectId, project);
      console.log('[OK] Miembro actualizado:', local[idx]);
      break;
    }
    case 'remove-member': {
      const [projectId, memberId] = args;
      if (!projectId || !memberId) {return console.log('Uso: node cli.js remove-member <project-id> <member-id>');}
      const project = await repo.getProject(projectId);
      if (!project) {return console.log('Proyecto no encontrado');}
      project.localMembers = (project.localMembers || []).filter(m => m.id !== memberId);
      project.updated = new Date().toISOString();
      await repo.saveProject(projectId, project);
      console.log('[OK] Miembro local eliminado: ' + memberId);
      break;
    }
    default:
      console.log('\nSCRUMBAN CLI v1.0');
      console.log('Comandos:');
      console.log('  list                        Lista todos los proyectos');
      console.log('  show <id>                   Muestra historias de un proyecto');
      console.log('  stats                       Muestra estadísticas generales');
      console.log('  export <id>                 Genera reporte Markdown');
      console.log('  add-member <pid> --alias X  Agrega miembro local (IA)');
      console.log('  list-members <pid>          Lista miembros locales');
      console.log('  update-member <pid> <mid>  Actualiza miembro local');
      console.log('  remove-member <pid> <mid>  Elimina miembro local');
      break;
  }

  if (repo.disconnect) {await repo.disconnect();}
  process.exit(0);
}

run().catch(err => {
  console.error('[ERR] Error:', err.message);
  process.exit(1);
});
