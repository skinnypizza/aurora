// Script para importar datos del proyecto SGE
const http = require('http');

const API = 'http://localhost:3737';

function api(method, path, body) {
  return new Promise((resolve, reject) => {
    const opts = {
      hostname: 'localhost',
      port: 3737,
      path,
      method,
      headers: { 'Content-Type': 'application/json' }
    };
    const req = http.request(opts, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch { reject(new Error(data)); }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function main() {
  console.log('>> Importando proyecto SGE...\n');

  // 1. Crear proyecto
  console.log('Creando proyecto...');
  await api('POST', '/api/projects', {
    id: 'sge',
    title: 'SGE — Sistema de Geolocalización de Empleados',
    description: 'Sistema de monitoreo en tiempo real de empleados con geocercas, notificaciones y app móvil. Proyecto universitario de 4 sprints.',
    techStack: ['.NET 9', 'PostgreSQL', 'PostGIS', 'Flutter', 'Vue 3', 'Mapbox']
  });
  console.log('[OK] Proyecto creado\n');
...
  console.log('Importando historias...');
  for (const s of allStories) {
    await api('POST', '/api/projects/sge/stories', s);
  }
  console.log(`[OK] ${allStories.length} historias importadas\n`);

  // 3. Crear sprints
  console.log('Creando sprints...');
  await api('POST', '/api/projects/sge/sprints', {
    name: 'Sprint 1', objective: 'API + BD Foundation', velocity: 40,
    stories: sprint1.map(s => s.id)
  });
  await api('POST', '/api/projects/sge/sprints', {
    name: 'Sprint 2', objective: 'Frontend-Backend + Flutter Start', velocity: 45,
    stories: sprint2.map(s => s.id)
  });
  await api('POST', '/api/projects/sge/sprints', {
    name: 'Sprint 3', objective: 'App Móvil Completa + Features Avanzados', velocity: 48,
    stories: sprint3.map(s => s.id)
  });
  console.log('[OK] 3 sprints creados\n');

  // 4. Team
  console.log('Configurando equipo...');
  await api('PUT', '/api/projects/sge/team', {
    members: [
      { alias: 'GER', name: 'Gerald Aquise Illanes', role: 'Jefe de Proyecto / Backend Lead', spPerSprint: 10 },
      { alias: 'JOS', name: 'Josue Ramos Zeballos', role: 'DBA / DevOps', spPerSprint: 8 },
      { alias: 'ALA', name: 'Alan Aguilar Morales', role: 'Desarrollador Mobile (Flutter)', spPerSprint: 12 },
      { alias: 'ETH', name: 'Eithan Cardenas Luna', role: 'Frontend Developer (Vue)', spPerSprint: 15 }
    ]
  });
  console.log('[OK] Equipo configurado\n');

  // 5. Actualizar sprint actual
  await api('PUT', '/api/projects/sge', { currentSprint: 3, totalSprints: 4 });
  console.log('[OK] Sprint actual: 3\n');

  console.log('Importación completada!');
  console.log(`   http://localhost:3737`);
}

main().catch(console.error);
