// ==============================
//  Scrumban App AURORA - Server v3.1
// ==============================
require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const MongoRepository = require('./mongo-repo');
const FileRepository = require('./file-repo');
const AuthService = require('./auth-service');
const SubscriptionService = require('./subscription-service');

const app = express();
const PORT = process.env.PORT || 3737;

app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
app.use(compression());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'), { index: false }));

// Landing page at /
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'landing', 'index.html'));
});

// SPA at /app/*
app.get('/app', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('/app/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const COLUMNS = ['Backlog', 'Todo', 'InProgress', 'Review', 'Done'];
const USE_LOCAL_MODE = process.env.USE_LOCAL_MODE === 'true' || !process.env.MONGO_URI;
const DATA_DIR = path.join(__dirname, 'proyectos');
let repo;
let auth = null;

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: { error: 'Demasiados intentos. Intenta de nuevo en 15 minutos.' } });

const ALLOWED_PROJECT_FIELDS = ['title', 'description', 'techStack', 'status', 'currentSprint', 'totalSprints', 'wipLimits'];
const ALLOWED_STORY_FIELDS = ['title', 'priority', 'sp', 'status', 'assignee', 'sprint', 'story', 'subtasks', 'ac', 'deps'];

function filterBody(body, allowed) {
  const result = {};
  for (const key of allowed) {
    if (body[key] !== undefined) {result[key] = body[key];}
  }
  return result;
}

function validateString(val, maxLen = 500) {
  return typeof val === 'string' && val.length <= maxLen ? val : null;
}
function validateInt(val, min = 0, max = 9999) {
  const n = parseInt(val);
  return !isNaN(n) && n >= min && n <= max ? n : null;
}
function validateArray(val) {
  return Array.isArray(val) ? val : [];
}
function validateIn(val, options) {
  return options.includes(val) ? val : options[0];
}

async function initServer() {
  if (USE_LOCAL_MODE) {
    console.log('\n  LOCAL MODE (File-based, no auth)');
    console.log('  Data dir: ' + DATA_DIR);
    repo = new FileRepository(DATA_DIR);
  } else {
    console.log('\n  MODO CLOUD (MongoDB + Auth)');
    repo = new MongoRepository(process.env.MONGO_URI, process.env.MONGO_DB);
    try {
      await repo.connect();
      auth = new AuthService(repo.db);
      const subService = new SubscriptionService(repo.db, process.env.STRIPE_SECRET_KEY);
      app.set('subscriptionService', subService);
      console.log('  MongoDB: ' + process.env.MONGO_DB);
      if (subService.stripe) console.log('  Stripe: Configurado');
      else console.log('  Stripe: No configurado (pagos no disponibles)');
    } catch (_) {
      console.error('  Error de conexión MongoDB. Cambiando a MODO LOCAL...');
      repo = new FileRepository(DATA_DIR);
      auth = null;
    }
  }
}

const TOKEN_COOKIE = 'aurora_token';

function getToken(req) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {return authHeader.slice(7);}
  if (req.cookies && req.cookies[TOKEN_COOKIE]) {return req.cookies[TOKEN_COOKIE];}
  return null;
}

function setTokenCookie(res, token) {
  res.cookie(TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  });
}

function clearTokenCookie(res) {
  res.clearCookie(TOKEN_COOKIE, { path: '/' });
}

const protect = (req, res, next) => {
  if (USE_LOCAL_MODE || !auth) { req.user = { id: 'local-user', name: 'Local User' }; return next(); }
  const token = getToken(req);
  if (!token) {return res.status(401).json({ error: 'Token requerido' });}
  try {
    req.user = AuthService.verifyToken(token);
    next();
  } catch (e) {
    const msg = e.name === 'TokenExpiredError' ? 'Token expirado' : 'Token inválido';
    clearTokenCookie(res);
    res.status(401).json({ error: msg });
  }
};

const gate = (feature) => async (req, res, next) => {
  if (USE_LOCAL_MODE) return next();
  const subService = req.app.get('subscriptionService');
  if (!subService) return next();
  try {
    const hasAccess = await subService.hasFeature(req.user.id, feature);
    if (!hasAccess) return res.status(403).json({ error: 'Actualiza a Pro para acceder a esta función', upgrade: true, feature });
    next();
  } catch (_) { next(); }
};

const getPlan = async (req, res, next) => {
  if (USE_LOCAL_MODE || !req.user) { req.plan = 'free'; req.limits = {}; return next(); }
  const subService = req.app.get('subscriptionService');
  if (!subService) { req.plan = 'free'; req.limits = {}; return next(); }
  try {
    req.plan = await subService.getUserPlan(req.user.id);
    req.limits = await subService.getLimits(req.user.id);
  } catch (_) { req.plan = 'free'; req.limits = {}; }
  next();
};

app.get('/api/status', (req, res) => { res.json({ mode: USE_LOCAL_MODE ? 'local' : 'cloud', ready: true }); });

if (!USE_LOCAL_MODE && auth) {
  app.post('/api/auth/register', authLimiter, async (req, res) => { try { const result = await auth.register(req.body.email, req.body.password, req.body.name); res.json(result); } catch(e) { res.status(400).json({ error: e.message }); } });
  app.post('/api/auth/login', authLimiter, async (req, res) => { try { const result = await auth.login(req.body.email, req.body.password); setTokenCookie(res, result.token); const subService = req.app.get('subscriptionService'); let plan = 'free', limits = {}; if (subService) { try { plan = await subService.getUserPlan(result.user.id); limits = await subService.getLimits(result.user.id); } catch (_) { /* stripe no configurado */ } } res.json({ user: { ...result.user, plan, limits } }); } catch(e) { res.status(401).json({ error: e.message }); } });
  app.post('/api/auth/logout', (req, res) => { clearTokenCookie(res); res.json({ ok: true }); });
  app.get('/api/auth/me', protect, getPlan, async (req, res) => { const user = await repo.db.collection('users').findOne({ _id: new (require('mongodb').ObjectId)(req.user.id) }, { projection: { password: 0 } }); if (!user) {return res.status(404).json({ error: 'Usuario no encontrado' });} res.json({ id: user._id.toString(), email: user.email, name: user.name, plan: req.plan, limits: req.limits }); });
}

// ── Subscription / Payment Routes ──
if (!USE_LOCAL_MODE) {
  app.get('/api/subscription/plans', (req, res) => {
    res.json(SubscriptionService.PLANS);
  });

  app.get('/api/subscription/status', protect, getPlan, async (req, res) => {
    const subService = req.app.get('subscriptionService');
    if (!subService) return res.json({ plan: 'free', limits: {}, status: 'active', features: [] });
    try {
      const status = await subService.getSubscriptionStatus(req.user.id);
      res.json(status);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/subscription/create-checkout', protect, async (req, res) => {
    const subService = req.app.get('subscriptionService');
    if (!subService || !subService.stripe) return res.status(400).json({ error: 'Stripe no está configurado' });
    try {
      const priceId = req.body.priceId || process.env.STRIPE_PRO_PRICE_ID;
      const successUrl = req.body.successUrl || (process.env.BASE_URL || `http://localhost:${PORT}`) + '/?checkout=success';
      const cancelUrl = req.body.cancelUrl || (process.env.BASE_URL || `http://localhost:${PORT}`) + '/?checkout=canceled';
      const user = await repo.db.collection('users').findOne({ _id: new (require('mongodb').ObjectId)(req.user.id) });
      const result = await subService.createCheckoutSession(req.user.id, user.email, priceId, successUrl, cancelUrl);
      res.json(result);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/subscription/create-portal', protect, async (req, res) => {
    const subService = req.app.get('subscriptionService');
    if (!subService || !subService.stripe) return res.status(400).json({ error: 'Stripe no está configurado' });
    try {
      const returnUrl = req.body.returnUrl || (process.env.BASE_URL || `http://localhost:${PORT}`) + '/';
      const result = await subService.createCustomerPortal(req.user.id, returnUrl);
      res.json(result);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/subscription/cancel', protect, async (req, res) => {
    const subService = req.app.get('subscriptionService');
    if (!subService) return res.status(400).json({ error: 'Servicio no disponible' });
    try {
      await subService.cancelSubscription(req.user.id);
      res.json({ ok: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  // Stripe webhook — needs raw body
  app.post('/api/subscription/webhook/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
    const subService = req.app.get('subscriptionService');
    if (!subService || !subService.stripe) return res.status(400).json({ error: 'Stripe no configurado' });
    const sig = req.headers['stripe-signature'];
    let event;
    try {
      event = subService.stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (e) {
      return res.status(400).json({ error: 'Firma inválida' });
    }
    try {
      await subService.handleStripeWebhook(event);
      res.json({ received: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  // Mercado Pago webhook (placeholder)
  app.post('/api/subscription/webhook/mercadopago', express.raw({ type: 'application/json' }), async (req, res) => {
    res.json({ received: true });
  });
}

app.get('/api/projects', protect, async (req, res) => {
  if (USE_LOCAL_MODE) { res.json(await repo.getProjectsWithStats()); return; }
  res.json(await repo.getProjectsForUser(req.user.id));
});

app.post('/api/projects', protect, async (req, res) => {
  const { id, title, description, techStack } = req.body;
  if (!id || !title) {return res.status(400).json({ error: 'id y title requeridos' });}
  const slug = id.toLowerCase().replace(/[^a-z0-9-]/g, '-');
  const existing = await repo.getProject(slug);
  if (existing && existing.ownerId && existing.ownerId !== req.user.id) {return res.status(409).json({ error: 'Ya existe' });}
  if (USE_LOCAL_MODE && repo.createProjectDirs) {await repo.createProjectDirs(slug);}
  const project = { id: slug, title, ownerId: req.user.id, description: description || '', techStack: techStack || [], status: 'active', created: new Date().toISOString(), updated: new Date().toISOString(), currentSprint: 1, totalSprints: req.body.totalSprints || 4, wipLimits: req.body.wipLimits || { InProgress: 4, Review: 3 }, localMembers: existing?.localMembers || [] };
  await repo.saveProject(slug, project);
  if (USE_LOCAL_MODE) { const idx = await repo.getIndex(); if (!idx.projects.find(p => p.id === slug)) { idx.projects.push({ id: slug, title, created: project.created }); await repo.saveIndex(idx); } }
  res.json(project);
});

app.get('/api/projects/:id', protect, async (req, res) => {
  const project = USE_LOCAL_MODE ? await repo.getProject(req.params.id) : await repo.getProject(req.params.id, req.user.id);
  if (!project) {return res.status(404).json({ error: 'No encontrado' });}
  res.json(project);
});

app.put('/api/projects/:id', protect, async (req, res) => {
  const project = USE_LOCAL_MODE ? await repo.getProject(req.params.id) : await repo.getProject(req.params.id, req.user.id);
  if (!project) {return res.status(404).json({ error: 'No encontrado' });}
  Object.assign(project, filterBody(req.body, ALLOWED_PROJECT_FIELDS)); project.updated = new Date().toISOString();
  await repo.saveProject(req.params.id, project); res.json(project);
});

app.post('/api/import', protect, async (req, res) => {
  const { project, stories, sprints, team } = req.body;
  if (!project) {return res.status(400).json({ error: 'Formato invalido' });}
  project.ownerId = req.user.id;
  if (repo.createProjectDirs) {await repo.createProjectDirs(project.id);}
  await repo.saveProject(project.id, project);
  if (stories) {for (const s of stories) {await repo.saveStory(project.id, s);}}
  if (sprints) {for (const s of sprints) {await repo.saveSprint(project.id, s);}}
  if (team) {await repo.saveTeam(project.id, team);}
  if (USE_LOCAL_MODE) { const idx = await repo.getIndex(); if (!idx.projects.find(p => p.id === project.id)) { idx.projects.push({ id: project.id, title: project.title, created: project.created }); await repo.saveIndex(idx); } }
  res.json({ ok: true });
});

app.delete('/api/projects/:id', protect, async (req, res) => { await repo.deleteProject(req.params.id); res.json({ ok: true }); });

// Stories
app.get('/api/projects/:id/stories', protect, async (req, res) => { res.json(await repo.getStories(req.params.id)); });

app.post('/api/projects/:id/stories', protect, async (req, res) => {
  const project = await repo.getProject(req.params.id);
  if (!project) {return res.status(404).json({ error: 'Proyecto no encontrado' });}
  let newId = req.body.id;
  if (!newId) { const sprint = req.body.sprint || project.currentSprint || 1; newId = await repo.generateStoryId(req.params.id, sprint); }
  const story = {
    id: validateString(newId, 50) || 'STORY-' + Date.now(),
    title: validateString(req.body.title, 300) || 'Nueva historia',
    priority: validateIn(req.body.priority, ['Must', 'Should', 'Could', 'Wont']),
    sp: validateInt(req.body.sp, 0, 100) || 3,
    status: validateIn(req.body.status, COLUMNS),
    assignee: validateString(req.body.assignee, 100) || '',
    sprint: req.body.sprint || null,
    story: validateString(req.body.story, 5000) || '',
    subtasks: validateArray(req.body.subtasks),
    ac: validateArray(req.body.ac),
    deps: validateArray(req.body.deps),
    created: new Date().toISOString(), updated: new Date().toISOString()
  };
  await repo.saveStory(req.params.id, story); res.json(story);
});

app.put('/api/projects/:id/stories/:storyId', protect, async (req, res) => {
  let story = await repo.getStory(req.params.id, req.params.storyId);
  if (!story) {return res.status(404).json({ error: 'No encontrado' });}
  Object.assign(story, filterBody(req.body, ALLOWED_STORY_FIELDS)); story.updated = new Date().toISOString();
  await repo.saveStory(req.params.id, story); res.json(story);
});

app.delete('/api/projects/:id/stories/:storyId', protect, async (req, res) => { await repo.deleteStory(req.params.id, req.params.storyId); res.json({ ok: true }); });

app.patch('/api/projects/:id/stories/:storyId/move', protect, async (req, res) => {
  let story = await repo.getStory(req.params.id, req.params.storyId);
  if (!story) {return res.status(404).json({ error: 'No encontrado' });}
  story.status = req.body.status; story.updated = new Date().toISOString();
  await repo.saveStory(req.params.id, story); res.json(story);
});

// Team
app.get('/api/projects/:id/team', protect, async (req, res) => {
  const project = await repo.getProject(req.params.id);
  if (!project) {return res.status(404).json({ error: 'No encontrado' });}
  let team = await repo.getTeam(req.params.id); if (!team) {team = { members: [] };}
  res.json({ ...team, localMembers: project.localMembers || [] });
});

app.get('/api/projects/:id/members', protect, async (req, res) => { res.json(await repo.getTeam(req.params.id).then(t => t?.members || [])); });

app.put('/api/projects/:id/team', protect, async (req, res) => { await repo.saveTeam(req.params.id, req.body); res.json({ ok: true }); });

app.post('/api/projects/:id/invite', protect, async (req, res) => {
  if (USE_LOCAL_MODE) {return res.status(400).json({ error: 'No disponible en modo local' });}
  const project = await repo.getProject(req.params.id);
  if (!project || project.role !== 'Owner') {return res.status(403).json({ error: 'Solo el dueno' });}
  try { res.json(await repo.addMember(req.params.id, req.body.email, req.body.role)); } catch(e) { res.status(400).json({ error: e.message }); }
});

// Local Members (AI Sub-Agents)
app.get('/api/projects/:id/local-members', protect, async (req, res) => {
  const project = await repo.getProject(req.params.id);
  if (!project) {return res.status(404).json({ error: 'No encontrado' });}
  res.json(project.localMembers || []);
});

app.post('/api/projects/:id/local-members', protect, async (req, res) => {
  const project = await repo.getProject(req.params.id);
  if (!project) {return res.status(404).json({ error: 'No encontrado' });}
  const { alias, name, role, color } = req.body;
  const id = 'local-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
  const member = { id, alias: alias || id, name: name || alias || 'AI Agent', role: role || 'AI Sub-Agent', color: color || '#8b5cf6', isAI: true, created: new Date().toISOString() };
  const localMembers = project.localMembers || [];
  localMembers.push(member);
  project.localMembers = localMembers; project.updated = new Date().toISOString();
  await repo.saveProject(req.params.id, project); res.json(member);
});

app.put('/api/projects/:id/local-members/:memberId', protect, async (req, res) => {
  const project = await repo.getProject(req.params.id);
  if (!project) {return res.status(404).json({ error: 'No encontrado' });}
  const localMembers = project.localMembers || [];
  const idx = localMembers.findIndex(m => m.id === req.params.memberId);
  if (idx === -1) {return res.status(404).json({ error: 'No encontrado' });}
  Object.assign(localMembers[idx], req.body); project.localMembers = localMembers; project.updated = new Date().toISOString();
  await repo.saveProject(req.params.id, project); res.json(localMembers[idx]);
});

app.delete('/api/projects/:id/local-members/:memberId', protect, async (req, res) => {
  const project = await repo.getProject(req.params.id);
  if (!project) {return res.status(404).json({ error: 'No encontrado' });}
  project.localMembers = (project.localMembers || []).filter(m => m.id !== req.params.memberId);
  project.updated = new Date().toISOString();
  await repo.saveProject(req.params.id, project); res.json({ ok: true });
});

// Sprints
app.get('/api/projects/:id/sprints', protect, async (req, res) => { res.json(await repo.getSprints(req.params.id)); });

app.post('/api/projects/:id/sprints', protect, async (req, res) => {
  const sprint = req.body;
  if (!sprint.id) { const existing = await repo.getSprints(req.params.id); sprint.id = Number(existing.length) + 1; }
  sprint.id = Number(sprint.id);
  await repo.saveSprint(req.params.id, sprint); res.json(sprint);
});

app.post('/api/projects/:id/sprints/:num/close', protect, async (req, res) => {
  const project = await repo.getProject(req.params.id);
  if (!project) {return res.status(404).json({ error: 'No encontrado' });}
  const sprint = await repo.getSprint(req.params.id, parseInt(req.params.num));
  if (!sprint) {return res.status(404).json({ error: 'Sprint no encontrado' });}
  const stories = await repo.getStories(req.params.id);
  const sprintStories = stories.filter(s => (sprint.stories || []).includes(s.id));
  const doneStories = sprintStories.filter(s => s.status === 'Done');
  const velocity = doneStories.reduce((a, s) => a + (s.sp || 0), 0);
  for (const s of sprintStories.filter(s => s.status !== 'Done')) { s.sprint = null; await repo.saveStory(req.params.id, s); }
  sprint.velocity = velocity; sprint.status = 'closed';
  await repo.saveSprint(req.params.id, sprint);
  project.currentSprint = parseInt(req.params.num) + 1; project.updated = new Date().toISOString();
  await repo.saveProject(req.params.id, project); res.json({ ok: true, velocity });
});

// Context
app.get('/api/projects/:id/context', protect, async (req, res) => {
  const project = await repo.getProject(req.params.id);
  if (!project) {return res.status(404).json({ error: 'No encontrado' });}
  const stories = await repo.getStories(req.params.id);
  const sprints = await repo.getSprints(req.params.id);
  const team = await repo.getTeam(req.params.id);
  res.json({ project, stories, sprints, team, localMembers: project.localMembers || [] });
});

// Dashboard
app.get('/api/dashboard', protect, async (req, res) => {
  if (USE_LOCAL_MODE) {
    const projects = await repo.getProjectsWithStats();
    const results = [];
    for (const p of projects) {
      const teamData = await repo.getTeam(p.id).catch(() => ({ members: [] }));
      results.push({ ...p, storiesCount: p.totalStories || 0, doneCount: p.doneStories || 0, membersCount: (teamData?.members?.length || 0) + (p.localMembers?.length || 0), pct: p.totalStories > 0 ? Math.round((p.doneStories || 0) / p.totalStories * 100) : 0 });
    }
    res.json(results); return;
  }
  const projects = await repo.getProjectsForUser(req.user.id);
  const results = [];
  for (const p of projects) {
    const stories = await repo.getStories(p.id);
    const members = await repo.getProjectMembers(p.id);
    const done = stories.filter(s => s.status === 'Done').length;
    results.push({ ...p, storiesCount: stories.length, doneCount: done, membersCount: members.length, pct: stories.length > 0 ? Math.round(done / stories.length * 100) : 0 });
  }
  res.json(results);
});

app.get('/api/projects/:id/metrics', protect, async (req, res) => { res.json(await repo.getMetrics(req.params.id)); });

app.get('/api/projects/:id/export/markdown', protect, async (req, res) => {
  const md = await repo.exportToMarkdown(req.params.id);
  if (!md) {return res.status(404).json({ error: 'No encontrado' });}
  res.send(md);
});

process.on('unhandledRejection', (err) => {
  console.error('  Error no manejado (Promise):', err.message);
});
process.on('uncaughtException', (err) => {
  console.error('  Error no manejado (Exception):', err.message);
  process.exit(1);
});

const startServer = () => initServer().then(() => new Promise((resolve) => {
  const srv = app.listen(PORT, () => {
    console.log('\n  Scrumban App AURORA v3.1 (' + (USE_LOCAL_MODE ? 'LOCAL' : 'CLOUD') + ')');
    console.log('  http://localhost:' + PORT + '\n');
    resolve(srv);
  });

  process.on('SIGTERM', () => {
    console.log('  Cerrando servidor gracefulmente (SIGTERM)...');
    srv.close(() => {
      if (repo && repo.disconnect) {repo.disconnect().catch(() => {});}
      process.exit(0);
    });
  });
  process.on('SIGINT', () => {
    console.log('  Cerrando servidor gracefulmente (SIGINT)...');
    srv.close(() => {
      if (repo && repo.disconnect) {repo.disconnect().catch(() => {});}
      process.exit(0);
    });
  });
}));

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer, PORT }; 