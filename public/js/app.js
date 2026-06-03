// ═════════════════════════════════════════════════
//  Scrumban App AURORA — Core Logic v2.4 (Premium Restoration)
//  Restored all missing features from scrumban_app.html
// ═════════════════════════════════════════════════

const S = {
  user: null,
  projects: [], currentId: null, project: null,
  stories: [], team: { members: [] }, sprints: [],
  tab: 'board', filterText: '', compactView: false,
  memberFilter: '', theme: 'dark',
  mode: 'cloud', localMembers: [],
  plan: 'free', limits: {}
};

const COLUMNS = ['Backlog','Todo','InProgress','Review','Done'];
const COL_LABELS = { Backlog:'Backlog',Todo:'To Do',InProgress:'In Progress',Review:'Review',Done:'Done '+icon('check')};
const COL_COLORS = { Backlog:'#6b7280',Todo:'#3b82f6',InProgress:'#8b5cf6',Review:'#f59e4c',Done:'#10b981'};


// ── API ──
async function api(method, url, body) {
  const opts = { 
    method, 
    headers:{ 'Content-Type':'application/json' },
    credentials: 'include'
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(url, opts);
  if (res.status === 401 || res.status === 403) { logout(); throw new Error('Sesión expirada'); }
  if (!res.ok) {
    let msg; try { const e = await res.json(); msg = e.error; } catch { msg = `HTTP ${res.status}`; }
    throw new Error(msg);
  }
  return res.json();
}

// ── UI UTILS ──
function toast(msg, type='info') {
  const c = document.getElementById('toastContainer'); if (!c) return;
  const el = document.createElement('div'); el.className = `toast ${type}`; el.innerHTML = msg;
  c.appendChild(el); setTimeout(() => { el.style.opacity = '0'; setTimeout(() => el.remove(), 500); }, 3000);
}
function toggleTheme() {
  const html = document.documentElement; S.theme = html.dataset.theme === 'dark' ? 'light' : 'dark';
  html.dataset.theme = S.theme; const btn = document.getElementById('themeBtn');
  if (btn) btn.innerHTML = S.theme === 'dark' ? icon('moon') : icon('sun');
  localStorage.setItem('scrumban_theme', S.theme);
}
function showModal(html) {
  const content = document.getElementById('modalContent'); const overlay = document.getElementById('overlay');
  if (content && overlay) { content.innerHTML = html; overlay.classList.add('open'); }
}
function closeModal() { const overlay = document.getElementById('overlay'); if (overlay) overlay.classList.remove('open'); }
function toggleMobileMenu() {
  const nav = document.querySelector('.sidebar-nav');
  const footer = document.querySelector('.sidebar-footer');
  if (!nav || !footer) return;
  const isHidden = window.getComputedStyle(nav).display === 'none';
  nav.style.display = isHidden ? 'block' : 'none';
  footer.style.display = isHidden ? 'flex' : 'none';
}

// ── AUTH UI ──
async function handleLogin(e) {
  e.preventDefault(); const fd = new FormData(e.target);
  try {
    const data = await api('POST', '/api/auth/login', Object.fromEntries(fd));
    S.user = data.user;
    S.plan = data.user.plan || 'free';
    S.limits = data.user.limits || {};
    localStorage.setItem('aurora_user', JSON.stringify(S.user));
    initApp();
  } catch(e) { toast(e.message, 'error'); }
}
async function handleRegister(e) {
  e.preventDefault(); const fd = new FormData(e.target);
  try {
    await api('POST', '/api/auth/register', Object.fromEntries(fd));
    toast('Cuenta creada! Ya puedes entrar', 'success');
    showLogin();
  } catch(e) { toast(e.message, 'error'); }
}
function logout() {
  api('POST', '/api/auth/logout').catch(() => {});
  localStorage.removeItem('aurora_user'); localStorage.removeItem('aurora_mode');
  S.user = null; S.mode = 'cloud';
  location.reload();
}
// ── AUTH CHOICE SCREEN ──
function showAuthChoice() {
  const choice = document.getElementById('authChoice');
  const authF = document.getElementById('authForm');
  const regF = document.getElementById('registerForm');
  if (choice) choice.style.display = 'flex';
  if (authF) authF.style.display = 'none';
  if (regF) regF.style.display = 'none';
}

function showLoginForm() {
  const choice = document.getElementById('authChoice');
  const authF = document.getElementById('authForm');
  const regF = document.getElementById('registerForm');
  if (choice) choice.style.display = 'none';
  if (authF) authF.style.display = 'block';
  if (regF) regF.style.display = 'none';
}

function showRegister() {
  const choice = document.getElementById('authChoice');
  const authF = document.getElementById('authForm');
  const regF = document.getElementById('registerForm');
  if (choice) choice.style.display = 'none';
  if (authF) authF.style.display = 'none';
  if (regF) regF.style.display = 'block';
}

function showLoginUI() { showLoginForm(); }

// ── ENTER LOCAL MODE ──
function enterLocalMode() {
  S.mode = 'local';
  S.token = null;
  S.user = null;
  localStorage.setItem('aurora_mode', 'local');
  const overlay = document.getElementById('authOverlay');
  const sidebar = document.getElementById('sidebar');
  if (overlay) overlay.classList.remove('open');
  if (sidebar) sidebar.style.display = 'flex';
  renderUserProfileLocal();
  loadProjects();
}

function showLogin() { location.reload(); }

async function initApp() {
  try {
    const status = await api('GET', '/api/status');
    S.mode = status.mode;
  } catch(e) { S.mode = 'cloud'; }

  const savedMode = localStorage.getItem('aurora_mode');
  const savedUser = localStorage.getItem('aurora_user');
  if (savedUser) S.user = JSON.parse(savedUser);
  const authOverlay = document.getElementById('authOverlay');
  const sidebar = document.getElementById('sidebar');

  // If cloud mode, try to restore session via cookie
  if (S.mode === 'cloud') {
    try {
      const me = await api('GET', '/api/auth/me');
      S.user = me;
      S.plan = me.plan || 'free';
      S.limits = me.limits || {};
      localStorage.setItem('aurora_user', JSON.stringify(me));
      if (authOverlay) authOverlay.classList.remove('open');
      if (sidebar) sidebar.style.display = 'flex';
      renderUserProfile(); loadProjects();
      return;
    } catch (_) {
      // No session cookie — continue to show login
    }
  }

  // User previously chose local mode
  if (savedMode === 'local' && S.mode === 'local') {
    if (authOverlay) authOverlay.classList.remove('open');
    if (sidebar) sidebar.style.display = 'flex';
    renderUserProfileLocal(); loadProjects();
    return;
  }

  // Show auth choice screen
  if (authOverlay) authOverlay.classList.add('open');
  if (sidebar) sidebar.style.display = 'none';
  showAuthChoice();
}

function renderUserProfileLocal() {
  const el = document.getElementById('userProfile'); if (!el) return;
  el.innerHTML = '<div class="team-avatar" style="background:var(--accent)22;color:var(--accent);width:40px;height:40px;font-size:18px">L</div><div class="info"><div class="name">Local User</div><div class="meta" style="font-size:10px;color:var(--accent)">Modo Local</div></div>';
  setModeIndicator('LOCAL', '#8b5cf6', 'rgba(139,92,246,0.15)');
}

function renderUserProfile() {
  const el = document.getElementById('userProfile'); if (!el || !S.user) return;
  const planBadge = S.plan === 'pro' ? '<span style="font-size:9px;background:var(--accent);color:#fff;padding:1px 6px;border-radius:6px;font-weight:700;margin-left:6px">PRO</span>' :
    S.plan === 'enterprise' ? '<span style="font-size:9px;background:var(--accent);color:#fff;padding:1px 6px;border-radius:6px;font-weight:700;margin-left:6px">ENTERPRISE</span>' : '';
  const eaBadge = checkEarlyAdopter() ? '<span style="font-size:8px;background:#f59e0b;color:#000;padding:1px 6px;border-radius:6px;font-weight:700;margin-left:4px">FOUNDER</span>' : '';
  el.innerHTML = `
    <div class="team-avatar" style="background:var(--accent)22;color:var(--accent);width:40px;height:40px">${S.user.name.charAt(0)}</div>
    <div class="info"><div class="name">${esc(S.user.name)}${planBadge}${eaBadge}</div><div class="meta">${esc(S.user.email)}</div></div>`;
  setModeIndicator('CLOUD', '#10b981', 'rgba(16,185,129,0.15)');
}

function setModeIndicator(text, color, bg) {
  const el = document.getElementById('modeIndicator');
  if (!el) return;
  el.textContent = text;
  el.style.color = color;
  el.style.background = bg;
  el.style.display = 'block';
}

function esc(s) { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function sumSp(stories) { return stories.reduce((a,s)=>a+(parseInt(s.sp)||0),0); }

// ── PROJECTS ──
async function loadProjects() {
  const loading = document.getElementById('projectLoading'); if (loading) loading.style.display = 'flex';
  try { S.projects = await api('GET','/api/projects'); renderSidebar(); } catch(e) { toast(e.message,'error'); }
  finally { if (loading) loading.style.display = 'none'; }
}

function renderSidebar() {
  const el = document.getElementById('projectList'); if (!el) return;
  el.innerHTML = ''; const q = S.filterText.toLowerCase();
  const filtered = S.projects.filter(p => (p.title||'').toLowerCase().includes(q));
  const colors = ['#6366f1','#10b981','#f97316','#3b82f6','#ec4899','#8b5cf6'];
  filtered.forEach(p => {
    const c = colors[Math.abs(hashStr(p.id)) % colors.length];
    const dPct = p.totalStories > 0 ? Math.round(p.doneStories/p.totalStories*100) : 0;
    const item = document.createElement('div');
    item.className = 'project-item' + (S.currentId === p.id ? ' active' : '');
    item.onclick = () => selectProject(p.id);
    item.innerHTML = `
      <div class="icon" style="background:${c}22;color:${c}">${(p.title||'?').charAt(0).toUpperCase()}</div>
      <div class="info"><div class="name">${esc(p.title)}</div><div class="meta">${p.totalStories||0} historias · ${dPct}%</div></div>
      <div class="badge">S${p.currentSprint||'-'}</div>`;
    el.appendChild(item);
  });
}
function hashStr(s) { let h=0; for(let i=0;i<s.length;i++){h=((h<<5)-h)+s.charCodeAt(i);h|=0;} return Math.abs(h); }

const CACHE = new Map();
const CACHE_TTL = 30000;

function cacheGet(key) {
  const entry = CACHE.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL) { CACHE.delete(key); return null; }
  return entry.data;
}
function cacheSet(key, data) { CACHE.set(key, { data, ts: Date.now() }); }
function cacheClear() { CACHE.clear(); }

async function selectProject(id) {
  if (S.currentId === id) return;
  S.currentId = id; renderSidebar();
  
  // Perceived speed: show skeleton immediately
  document.getElementById('tabContent').innerHTML = '<div class="skeleton-list"></div>';
  document.getElementById('mainHeader').style.display = 'flex';
  document.getElementById('projectTitleDisplay').innerHTML = '<span class="skeleton" style="width:200px;height:24px"></span>';

  try {
    let data = cacheGet(id);
    if (!data) {
      const [project, stories, team, sprints] = await Promise.all([
        api('GET', `/api/projects/${id}`), api('GET', `/api/projects/${id}/stories`),
        api('GET', `/api/projects/${id}/team`), api('GET', `/api/projects/${id}/sprints`)
      ]);
      data = { project, stories, team, sprints };
      cacheSet(id, data);
    }
    S.project = data.project; S.stories = data.stories; S.team = data.team; S.sprints = data.sprints;
    renderProject();
  } catch(e) { toast('Error: '+e.message,'error'); }
}

function renderProject() {
  if (!S.project) return;
  const header = document.getElementById('mainHeader');
  const tabs = document.getElementById('tabs');
  const empty = document.getElementById('emptyState');
  const content = document.getElementById('tabContent');

  if (header) header.style.display = 'flex';
  if (tabs) tabs.style.display = 'flex';
  if (empty) empty.style.display = 'none';
  if (content) content.style.display = 'block';

  document.getElementById('projectTitleDisplay').innerHTML = esc(S.project.title);
  document.getElementById('projectMeta').innerHTML = `Sprint ${S.project.currentSprint||'-'} · ${S.project.totalStories||0} historias · ${icon('users')} ${S.team.members.length} miembros`;
  switchTab(S.tab);
}

async function switchTab(tab) {
  S.tab = tab;
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
  
  const content = document.getElementById('tabContent');
  if (content) {
    content.classList.remove('tab-slide-in');
    void content.offsetWidth; // Force reflow
    content.classList.add('tab-slide-in');
  }

  const f = { board: renderBoard, backlog: renderBacklog, sprint: renderSprint, team: renderTeam, metrics: renderMetrics, dashboard: renderDashboard, settings: renderSettings }[tab];
  if (f) f();
}

// ── BOARD ──
function renderBoard() {
  const memberF = S.memberFilter; const sprintStories = getSprintStories();
  const filtered = sprintStories.filter(s => !memberF || s.assignee === memberF);
  const q = S.filterText.toLowerCase();
  const searched = filtered.filter(s => !q || (s.id+s.title+s.assignee).toLowerCase().includes(q));

  let html = `<div class="board-header">
    <div style="font-size:18px;font-weight:700">${icon('clipboard')} Tablero Kanban</div>
    <div style="display:flex;gap:12px;align-items:center">
      <select class="search-input" onchange="S.memberFilter=this.value;renderBoard()">
        <option value="">${icon('user')} Todos</option>
        ${S.team.members.map(m=>`<option value="${m.alias}" ${m.alias===memberF?'selected':''}>${m.alias}</option>`).join('')}
      </select>
      <label style="display:flex;align-items:center;gap:6px;font-size:12px;cursor:pointer"><input type="checkbox" ${S.compactView?'checked':''} onchange="S.compactView=this.checked;renderBoard()"> Compacto</label>
    </div>
  </div><div class="board">`;

  COLUMNS.forEach(col => {
    const items = searched.filter(s => s.status === col).sort((a,b)=>a.id.localeCompare(b.id));
    const wip = S.project?.wipLimits?.[col] || 0;
    const isOverWip = wip > 0 && items.length > wip;
    html += `<div class="col" data-col="${col}">
      <div class="col-header">
        <span class="col-title" style="color:${COL_COLORS[col]}">${COL_LABELS[col]} ${wip?`(${wip})`:''}</span>
        <span class="col-count" style="${isOverWip?'background:var(--red);color:#fff':''}">${items.length}</span>
      </div>
      <div class="col-body" data-status="${col}" ondrop="dropStory(event)" ondragover="onColDragOver(event)" ondragleave="onColDragLeave(event)">`;
    items.forEach(s => html += cardHTML(s));
    html += `</div></div>`;
  });
  html += '</div>';
  document.getElementById('tabContent').innerHTML = html;
}

function cardHTML(s) {
  const color = getMemberColor(s.assignee);
  if (S.compactView) {
    return `<div class="card" style="padding:10px;border-radius:10px" data-priority="${s.priority}" draggable="true" data-id="${esc(s.id)}" ondragstart="dragStart(event,'${esc(s.id)}')" ondblclick="showStoryDetail('${esc(s.id)}')">
      <div style="display:flex;gap:8px;align-items:center;font-size:12px"><span style="font-family:var(--mono);color:var(--accent)">${esc(s.id)}</span><span style="flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(s.title)}</span><span style="font-weight:800;color:${color}">${s.assignee||'—'}</span></div>
    </div>`;
  }
  const hasBlocked = (s.deps||[]).some(d => S.stories.find(x=>x.id===d && x.status!=='Done'));
  const days = s._daysInColumn || 0;
  return `<div class="card" data-priority="${s.priority}" draggable="true" data-id="${esc(s.id)}" ondragstart="dragStart(event,'${esc(s.id)}')" ondblclick="showStoryDetail('${esc(s.id)}')">
    <div class="card-id">${esc(s.id)} ${hasBlocked?'<span title="Bloqueado" style="color:var(--red)">'+icon('lock')+'</span>':''} ${days>3?`<span class="days-warn" style="font-size:9px;background:var(--red);color:#fff;padding:1px 4px;border-radius:4px">${days}d</span>`:''}</div>
    <div class="card-title">${esc(s.title)}</div>
    <div class="card-footer">
      <span class="priority-pill">${s.priority}</span>
      <div style="display:flex;gap:8px;align-items:center">
        <span style="font-size:11px;font-weight:700">${s.sp} SP</span>
        <div class="team-avatar" style="width:24px;height:24px;font-size:10px;background:${color}22;color:${color}">${s.assignee||'?'}</div>
      </div>
    </div>
  </div>`;
}

function getMemberColor(alias) { const m = S.team.members.find(x => x.alias === alias); return m?.color || '#6366f1'; }
function getSprintStories() {
  const cn = S.project?.currentSprint || 0;
  const sprint = S.sprints.find(s => s.id === cn);
  return sprint ? S.stories.filter(s => (sprint.stories || []).includes(s.id)) : S.stories.filter(s => s.sprint === cn);
}

function dragStart(e, id) { e.dataTransfer.setData('text/plain', id); }
function onColDragOver(e) { e.preventDefault(); e.currentTarget.classList.add('drag-over'); }
function onColDragLeave(e) { e.currentTarget.classList.remove('drag-over'); }

async function dropStory(e) {
  e.preventDefault(); e.currentTarget.classList.remove('drag-over');
  const col = e.currentTarget.dataset.status; const id = e.dataTransfer.getData('text/plain');
  if (!id || !col) return;
  const s = S.stories.find(x => x.id === id); if (!s || s.status === col) return;
  const old = s.status; s.status = col; renderBoard();
  try { await api('PATCH', `/api/projects/${S.currentId}/stories/${id}/move`, { status: col }); if (col === 'Done') confetti(); }
  catch(e) { s.status = old; renderBoard(); toast('Error: '+e.message, 'error'); }
}

function confetti() {
  const colors = ['#8b5cf6', '#06b6d4', '#ec4899', '#10b981'];
  for (let i=0; i<30; i++) {
    const el = document.createElement('div'); el.className = 'confetti-piece';
    el.style.left = Math.random()*100+'vw'; el.style.background = colors[Math.floor(Math.random()*colors.length)];
    document.body.appendChild(el); setTimeout(() => el.remove(), 2000);
  }
}

// ── BACKLOG ──
function renderBacklog() {
  const stories = [...S.stories].sort((a,b)=>a.id.localeCompare(b.id));
  const q = S.filterText.toLowerCase();
  const filtered = stories.filter(s => !q || (s.id + s.title + s.assignee).toLowerCase().includes(q));

  let html = `<div class="section-header animate-in">
    <div><strong>${icon('package')} Backlog de Historias</strong></div>
    <div class="section-actions"><button class="btn btn-primary btn-sm" onclick="showNewStoryModal()">+ Nueva Historia</button></div>
  </div>
  <div class="table-header grid-stories animate-in">
    <span>ID</span><span>Título</span><span>Prioridad</span><span>SP</span><span>Asignado</span><span>Estado</span>
  </div>`;
  filtered.forEach((s, idx) => {
    html += `<div class="table-row grid-stories animate-in" style="animation-delay:${idx*0.05}s" ondblclick="showStoryDetail('${s.id}')">
      <span style="font-family:var(--mono); color:var(--accent); font-weight:700">${esc(s.id)}</span>
      <span style="font-weight:600">${esc(s.title)}</span>
      <span class="priority-pill" style="width:fit-content">${s.priority}</span>
      <span style="font-weight:700">${s.sp}</span>
      <span style="color:${getMemberColor(s.assignee)}; font-weight:600">${s.assignee||'—'}</span>
      <span style="display:flex; align-items:center; gap:8px"><span class="status-dot" style="background:${COL_COLORS[s.status]}"></span>${COL_LABELS[s.status]}</span>
    </div>`;
  });
  document.getElementById('tabContent').innerHTML = html;
}

// ── SPRINT (Premium Restoration) ──
function renderSprint() {
  const cn = S.project?.currentSprint || 1;
  const sprint = S.sprints.find(s => s.id === cn) || { id: cn, name: `Sprint ${cn}`, stories: [], velocity: 0, objective: '', retrospective: '' };
  const sStories = S.stories.filter(s => (sprint.stories || []).includes(s.id));
  const doneStories = sStories.filter(s => s.status === 'Done');
  const totalSp = sumSp(sStories); const doneSp = sumSp(doneStories);
  const pct = totalSp > 0 ? Math.round(doneSp / totalSp * 100) : 0;
  
  let html = `<div class="sprint-hero">
    <div class="sprint-hero-title">${icon('play')} ${esc(sprint.name)}</div>
    <div class="sprint-hero-meta">${esc(sprint.objective || 'Sin objetivo definido')}</div>
  </div>
  <div class="sprint-cards">
    <div class="scard"><div class="scard-label">Progreso</div><div class="scard-val" style="color:${pct>=100?'var(--green)':'var(--cyan)'}">${pct}%</div><div class="bar-wrap"><div class="bar-fill" style="width:${pct}%"></div></div></div>
    <div class="scard"><div class="scard-label">Completado</div><div class="scard-val" style="color:var(--green)">${doneSp} <span style="font-size:12px;color:var(--text3)">/ ${totalSp} SP</span></div></div>
    <div class="scard"><div class="scard-label">Historias</div><div class="scard-val">${doneStories.length} <span style="font-size:12px;color:var(--text3)">/ ${sStories.length}</span></div></div>
    <div class="scard"><div class="scard-label">Velocidad Objetivo</div><div class="scard-val" style="color:var(--accent)">${sprint.velocity || '?'}</div></div>
  </div>

  <canvas id="burndownCanvas" style="background:var(--bg2);border-radius:20px;border:1px solid var(--border);margin-bottom:25px;width:100%;height:200px"></canvas>

  <div class="section-actions" style="margin-bottom:20px">
    <button class="btn btn-sm" onclick="showPlanSprintModal()">${icon('target')} Planificar</button>
    <button class="btn btn-sm btn-danger" onclick="closeSprint()">${icon('check')} Cerrar Sprint</button>
    ${sprint.velocity && totalSp > sprint.velocity ? `<span style="font-size:11px;color:var(--red);font-weight:700;margin-left:10px">${icon('alert')} Excede velocidad planificada!</span>` : ''}
    <span style="flex:1"></span>
    <select class="search-input" style="width:auto" onchange="changeSprint(this.value)">
        ${S.sprints.map(s => `<option value="${s.id}" ${s.id===cn?'selected':''}>${s.name}</option>`).join('')}
    </select>
  </div>

  <div class="table-header grid-stories animate-in" style="margin-top:30px">
    <span>ID</span><span>Título</span><span>SP</span><span>Estado</span><span></span>
  </div>`;
  sStories.forEach((s, idx) => {
    html += `<div class="table-row grid-stories animate-in" style="animation-delay:${idx*0.05}s">
      <span style="font-family:var(--mono); color:var(--accent); font-weight:700">${s.id}</span>
      <span style="font-weight:600">${esc(s.title)}</span>
      <span style="font-weight:700">${s.sp}</span>
      <span style="display:flex; align-items:center; gap:8px"><span class="status-dot" style="background:${COL_COLORS[s.status]}"></span>${COL_LABELS[s.status]}</span>
      <span style="text-align:right"><button class="btn-icon-sm" onclick="removeFromSprint('${s.id}')">${icon('x')}</button></span>
    </div>`;
  });
  document.getElementById('tabContent').innerHTML = html;

  html += `<div class="section-box" style="margin-top:30px">
    <div class="section-box-title">${icon('settings')} Configuración del Sprint</div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Objetivo</label><input id="sprintObj" class="form-input" value="${esc(sprint.objective)}"></div>
      <div class="form-group"><label class="form-label">Velocidad (SP)</label><input id="sprintVel" class="form-input" type="number" value="${sprint.velocity||0}"></div>
    </div>
    <button class="btn btn-primary btn-sm" onclick="saveSprintConfig()">${icon('save')} Guardar</button>
  </div>
  <div class="section-box">
    <div class="section-box-title">${icon('fileText')} Retrospectiva</div>
    <textarea id="sprintRetro" class="form-textarea" rows="3" placeholder="¿Qué salió bien? ¿Qué podemos mejorar?">${esc(sprint.retrospective)}</textarea>
    <button class="btn btn-primary btn-sm" style="margin-top:10px" onclick="saveSprintRetro()">${icon('save')} Guardar</button>
  </div>`;

  document.getElementById('tabContent').innerHTML = html;
  setTimeout(drawBurndown, 100);
}

function drawBurndown() {
  const canvas = document.getElementById('burndownCanvas'); if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.clientWidth; const h = 200;
  canvas.width = w * dpr; canvas.height = h * dpr;
  ctx.scale(dpr, dpr);

  const pad = {top:30, bottom:30, left:40, right:30};
  const cw = w - pad.left - pad.right; const ch = h - pad.top - pad.bottom;
  
  const cn = S.project?.currentSprint || 1;
  const sprint = S.sprints.find(s => s.id === cn);
  const sStories = S.stories.filter(s => (sprint?.stories || []).includes(s.id));
  const totalSp = sumSp(sStories);
  const doneSp = sumSp(sStories.filter(s => s.status === 'Done'));

  ctx.clearRect(0, 0, w, h);
  if (totalSp === 0) {
    ctx.fillStyle = '#718096'; ctx.textAlign = 'center'; ctx.fillText('Sin historias en este sprint', w/2, h/2);
    return;
  }

  // Grid
  ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.lineWidth = 1;
  for (let i=0; i<=4; i++) {
    const y = pad.top + (ch/4)*i;
    ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(w-pad.right, y); ctx.stroke();
    ctx.fillStyle = '#718096'; ctx.font = '10px Outfit'; ctx.textAlign = 'right';
    ctx.fillText(Math.round(totalSp - (totalSp/4)*i), pad.left-10, y+4);
  }

  // Ideal Line (Green)
  ctx.strokeStyle = '#10b981'; ctx.setLineDash([5, 5]); ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(pad.left, pad.top); ctx.lineTo(w-pad.right, pad.top+ch); ctx.stroke();
  ctx.setLineDash([]);

  // Actual Line (Purple)
  ctx.strokeStyle = '#8b5cf6'; ctx.lineWidth = 3; ctx.beginPath();
  ctx.moveTo(pad.left, pad.top);
  // Simple linear progress for simulation if no daily data
  const currentY = pad.top + ch - (doneSp/totalSp)*ch;
  ctx.lineTo(pad.left + cw/2, (pad.top + currentY)/2); // mid point
  ctx.lineTo(pad.left + cw/2 + 20, currentY); 
  ctx.stroke();

  // Legend
  ctx.font = '10px Outfit'; ctx.textAlign = 'left';
  ctx.fillStyle = '#10b981'; ctx.fillRect(w-100, 10, 10, 2); ctx.fillText('Ideal', w-85, 14);
  ctx.fillStyle = '#8b5cf6'; ctx.fillRect(w-100, 25, 10, 2); ctx.fillText('Actual', w-85, 29);
}

// ── TEAM (Multi-user Invitations + Local Members) ──
async function renderTeam() {
  let members = [], localMembers = [];
  try { 
    const teamData = await api('GET', `/api/projects/${S.currentId}/team`);
    members = teamData.members || [];
    localMembers = teamData.localMembers || [];
    S.localMembers = localMembers;
  } catch(e) { toast('Error cargando equipo', 'error'); }
  
  const cn = S.project?.currentSprint || 1;
  let html = `<div class="section-header">
    <div><strong>${icon('users')} Equipo del Proyecto</strong></div>
    ${S.mode === 'cloud' && S.project.role !== 'Viewer' ? '<button class="btn btn-primary btn-sm" onclick="showInviteModal()">+ Invitar por Email</button>' : ''}
  </div><div class="team-grid">`;
  
  members.forEach(m => {
    const assigned = S.stories.filter(s => s.assignee === m.name || s.assignee === m.email);
    const sprintStories = assigned.filter(s => s.sprint === cn);
    const sp = sumSp(sprintStories); const cap = 10;
    const pct = Math.min(100, Math.round(sp/cap*100));
    const av = m.avatar && !m.avatar.startsWith('data:') ? m.avatar : avatarSVG(m.name || m.alias || m.email, m.color, 50);
    html += `<div class="team-card">
      <img src="${av}" class="team-avatar" style="width:50px;height:50px;border-radius:12px">
      <div class="team-info">
        <div class="team-name">${esc(m.name)} ${m.role==='Owner'?icon('star'):''}</div>
        <div class="team-role" style="text-transform:uppercase;font-size:10px;font-weight:800;color:var(--accent)">${m.role}</div>
        <div class="team-load"><div style="display:flex;justify-content:space-between;margin-bottom:4px;font-size:11px"><span>Carga S${cn}: ${sp} SP</span><span>${pct}%</span></div><div class="bar-wrap"><div class="bar-fill" style="width:${pct}%;background:${pct>100?'var(--red)':'var(--accent)'}"></div></div></div>
      </div>
    </div>`;
  });
  html += '</div>';
  
  // Local Members (AI Sub-Agents) section
  html += `<div class="section-header" style="margin-top:40px">
    <div><strong>${icon('cpu')} Miembros Locales (IA)</strong></div>
    <button class="btn btn-primary btn-sm" onclick="showAddLocalMemberModal()">+ Agregar Miembro Local</button>
  </div><div class="team-grid" id="localMembersGrid">`;
  
  localMembers.forEach(m => {
    const assigned = S.stories.filter(s => s.assignee === m.id);
    const sprintStories = assigned.filter(s => s.sprint === cn);
    const sp = sumSp(sprintStories); const pct = Math.min(100, Math.round(sp/10*100));
    const lav = avatarSVG(m.alias || m.name || m.id, m.color, 50);
    html += `<div class="team-card" style="border:1px solid ${m.color}40;position:relative">
      <img src="${lav}" class="team-avatar" style="width:50px;height:50px;border-radius:12px">
      <div style="position:absolute;top:-8px;left:-8px;background:${m.color};color:#fff;font-size:9px;padding:2px 6px;border-radius:8px;font-weight:800">${icon('cpu')} AI</div>
      <div class="team-info">
        <div class="team-name">${esc(m.alias)}</div>
        <div class="team-role" style="text-transform:uppercase;font-size:10px;font-weight:800;color:${m.color}">${esc(m.role)}</div>
        <div class="team-load"><div style="display:flex;justify-content:space-between;margin-bottom:4px;font-size:11px"><span>Carga: ${sp} SP</span><span>${pct}%</span></div><div class="bar-wrap"><div class="bar-fill" style="width:${pct}%;background:${m.color}"></div></div></div>
        <div style="margin-top:8px;display:flex;gap:6px">
          <button class="btn-icon-sm" onclick="showEditLocalMemberModal('${m.id}')" title="Editar">${icon('edit')}</button>
          <button class="btn-icon-sm" onclick="removeLocalMember('${m.id}')" title="Eliminar">${icon('trash')}</button>
        </div>
      </div>
    </div>`;
  });
  html += '</div>';
  
  document.getElementById('tabContent').innerHTML = html;
}

function showInviteModal() {
  showModal(`<div class="modal-title">${icon('mail')} Invitar al Proyecto</div>
  <form onsubmit="handleInvite(event)">
    <div class="form-group"><label class="form-label">Email del Usuario</label><input type="email" name="email" class="form-input" placeholder="usuario@ejemplo.com" required></div>
    <div class="form-group"><label class="form-label">Rol</label>
        <select name="role" class="form-select">
            <option value="Member">Miembro (Editor)</option>
            <option value="Admin">Admin (Gestor)</option>
            <option value="Viewer">Observador (Lectura)</option>
        </select>
    </div>
    <div class="form-actions"><button type="submit" class="btn btn-primary">Enviar Invitación</button></div>
  </form>`);
}

async function handleInvite(e) {
  e.preventDefault(); const fd = new FormData(e.target);
  try {
    await api('POST', `/api/projects/${S.currentId}/invite`, Object.fromEntries(fd));
    toast('Usuario invitado con éxito', 'success');
    closeModal(); renderTeam();
  } catch(e) { toast(e.message, 'error'); }
}

// ── LOCAL MEMBERS (AI Sub-Agents) ──
const LOCAL_MEMBER_COLORS = ['#8b5cf6','#06b6d4','#f59e0b','#ef4444','#10b981','#3b82f6','#ec4899','#14b8a6'];

function showAddLocalMemberModal() {
  const colors = LOCAL_MEMBER_COLORS.map(c => {
    return '<div class="color-swatch" onclick="document.getElementById(\'lmColor\').value=\'' + c + '\';document.querySelectorAll(\'.color-swatch\').forEach(el=>el.style.outline=\'none\');this.style.outline=\'2px solid #fff\'" style="width:28px;height:28px;border-radius:50%;background:' + c + ';cursor:pointer;display:inline-block"></div>';
  }).join('');
  showModal('<div class="modal-title">'+icon('cpu')+' Agregar Miembro Local (IA)</div>' +
    '<form onsubmit="handleAddLocalMember(event)">' +
    '<div class="form-group"><label class="form-label">Alias (ej: ALP, BOT-1)</label><input type="text" name="alias" id="lmAlias" class="form-input" placeholder="AGENT-Alpha" required></div>' +
    '<div class="form-group"><label class="form-label">Nombre</label><input type="text" name="name" class="form-input" placeholder="Alpha Agent" required></div>' +
    '<div class="form-group"><label class="form-label">Rol</label><input type="text" name="role" class="form-input" placeholder="AI Sub-Agent" value="AI Sub-Agent" required></div>' +
    '<div class="form-group"><label class="form-label">Color</label><input type="hidden" name="color" id="lmColor" value="#8b5cf6"><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px">' + colors + '</div></div>' +
    '<div class="form-actions"><button type="submit" class="btn btn-primary">Agregar Miembro</button><button type="button" class="btn" onclick="closeModal()">Cancelar</button></div>' +
    '</form>');
  setTimeout(() => { const swatches = document.querySelectorAll('.color-swatch'); if(swatches[0]) swatches[0].style.outline = '2px solid #fff'; }, 50);
}

async function handleAddLocalMember(e) {
  e.preventDefault(); const fd = new FormData(e.target);
  const data = { alias: fd.get('alias'), name: fd.get('name'), role: fd.get('role'), color: fd.get('color') };
  try {
    await api('POST', `/api/projects/${S.currentId}/local-members`, data);
    toast('Miembro local agregado '+icon('cpu'), 'success');
    closeModal(); renderTeam();
  } catch(e) { toast(e.message, 'error'); }
}

function showEditLocalMemberModal(memberId) {
  const m = S.localMembers.find(x => x.id === memberId); if (!m) return;
  const colors = LOCAL_MEMBER_COLORS.map(c => {
    return '<div class="color-swatch" onclick="document.getElementById(\'lmColorEdit\').value=\'' + c + '\';document.querySelectorAll(\'.color-swatch\').forEach(el=>el.style.outline=\'none\');this.style.outline=\'2px solid #fff\'" style="width:28px;height:28px;border-radius:50%;background:' + c + ';cursor:pointer;display:inline-block"></div>';
  }).join('');
  showModal('<div class="modal-title">'+icon('edit')+' Editar Miembro: ' + esc(m.alias) + '</div>' +
    '<form onsubmit="handleEditLocalMember(event, \'' + esc(memberId) + '\')">' +
    '<div class="form-group"><label class="form-label">Alias</label><input type="text" name="alias" class="form-input" value="' + esc(m.alias) + '" required></div>' +
    '<div class="form-group"><label class="form-label">Nombre</label><input type="text" name="name" class="form-input" value="' + esc(m.name) + '" required></div>' +
    '<div class="form-group"><label class="form-label">Rol</label><input type="text" name="role" class="form-input" value="' + esc(m.role) + '" required></div>' +
    '<div class="form-group"><label class="form-label">Color</label><input type="hidden" name="color" id="lmColorEdit" value="' + esc(m.color) + '"><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px">' + colors + '</div></div>' +
    '<div class="form-actions"><button type="submit" class="btn btn-primary">Guardar Cambios</button><button type="button" class="btn" onclick="closeModal()">Cancelar</button></div>' +
    '</form>');
  setTimeout(() => { document.querySelectorAll('.color-swatch').forEach(s => { if (s.style.backgroundColor === m.color || s.style.background === m.color) s.style.outline = '2px solid #fff'; }); }, 50);
}

async function handleEditLocalMember(e, memberId) {
  e.preventDefault(); const fd = new FormData(e.target);
  const data = { alias: fd.get('alias'), name: fd.get('name'), role: fd.get('role'), color: fd.get('color') };
  try {
    await api('PUT', `/api/projects/${S.currentId}/local-members/${memberId}`, data);
    toast('Miembro actualizado '+icon('cpu'), 'success');
    closeModal(); renderTeam();
  } catch(e) { toast(e.message, 'error'); }
}

async function removeLocalMember(memberId) {
  const m = S.localMembers.find(x => x.id === memberId);
  const aliasName = m ? m.alias : memberId;
  if (!confirm('¿Eliminar al miembro local "' + aliasName + '"?')) return;
  try {
    await api('DELETE', `/api/projects/${S.currentId}/local-members/${memberId}`);
    toast('Miembro local eliminado', 'success');
    renderTeam();
  } catch(e) { toast(e.message, 'error'); }
}

function showMemberDetail(alias) {
  const m = S.team.members.find(x => x.alias === alias); if (!m) return;
  const assigned = S.stories.filter(s => s.assignee === alias);
  let storiesHtml = assigned.sort((a,b)=>a.id.localeCompare(b.id)).map(s => `
    <div class="table-row" style="grid-template-columns: 80px 1fr 60px 100px; gap:15px; cursor:default; padding:12px 15px">
        <span style="font-family:var(--mono); color:var(--accent); font-weight:700">${s.id}</span>
        <span style="font-weight:600">${esc(s.title)}</span>
        <span style="font-weight:700">${s.sp}</span>
        <span style="display:flex; align-items:center; gap:8px"><span class="status-dot" style="background:${COL_COLORS[s.status]}"></span>${COL_LABELS[s.status]}</span>
    </div>`).join('');

  showModal(`<div class="modal-title">${icon('user')} Detalle de Miembro: ${esc(m.name)}</div>
    <div style="display:flex;gap:20px;margin-bottom:25px;align-items:center">
        <div class="team-avatar" style="width:60px;height:60px;font-size:24px;background:${m.color}22;color:${m.color}">${m.alias}</div>
        <div><div style="font-size:18px;font-weight:700">${esc(m.name)}</div><div style="color:var(--text3)">${esc(m.role)}</div></div>
    </div>
    <div class="table-header" style="grid-template-columns: 80px 1fr 60px 100px; gap:15px; margin-top:20px">
        <span>ID</span><span>Título</span><span>SP</span><span>Estado</span>
    </div>
    ${storiesHtml || '<div style="padding:30px; text-align:center; color:var(--text3); background:var(--bg3); border-radius:14px">Sin historias asignadas</div>'}
    <div class="form-actions"><button class="btn" onclick="closeModal()">Cerrar</button></div>`);
}

// ── METRICS (Restored velocity chart) ──
function renderMetrics() {
  const stories = S.stories; const totalSp = sumSp(stories); const doneSp = sumSp(stories.filter(s=>s.status==='Done'));
  const pct = totalSp > 0 ? Math.round(doneSp/totalSp*100) : 0;
  let html = `<div class="section-header"><div><strong>${icon('barChart')} Métricas Globales</strong></div></div>
  <div class="sprint-cards">
    <div class="scard"><div class="scard-label">Progreso</div><div class="scard-val">${pct}%</div><div class="bar-wrap"><div class="bar-fill" style="width:${pct}%"></div></div></div>
    <div class="scard"><div class="scard-label">SP Completados</div><div class="scard-val" style="color:var(--green)">${doneSp} <span style="font-size:12px;color:var(--text3)">/ ${totalSp} SP</span></div></div>
    <div class="scard"><div class="scard-label">Velocidad Promedio</div><div class="scard-val" style="color:var(--cyan)">${S.sprints.length ? Math.round(S.sprints.reduce((a,s)=>a+(s.velocity||0),0)/S.sprints.length) : 0}</div></div>
  </div>
  <canvas id="velocityCanvas" style="background:var(--bg2);border-radius:20px;border:1px solid var(--border);margin-bottom:25px;width:100%;height:200px"></canvas>
  <div class="section-box animate-in" style="margin-top:25px">
    <div class="section-box-title">${icon('target')} Distribución MoSCoW</div>
    <div class="table-header" style="grid-template-columns: 100px 1fr 1fr 1fr; gap:15px">
      <span>Prioridad</span><span>Historias</span><span>Completadas</span><span>Puntos (SP)</span>
    </div>`;
  ['Must','Should','Could','Wont'].forEach(p => {
    const ss = stories.filter(s => s.priority === p); const dd = ss.filter(s => s.status === 'Done');
    html += `<div class="table-row" style="grid-template-columns: 100px 1fr 1fr 1fr; gap:15px; cursor:default">
      <span class="priority-pill" style="width:fit-content">${p}</span>
      <span style="font-weight:600">${ss.length}</span>
      <span style="color:var(--green); font-weight:700">${dd.length}</span>
      <span style="font-weight:700">${sumSp(ss)}</span>
    </div>`;
  });
  html += '</div>';
  document.getElementById('tabContent').innerHTML = html;
  setTimeout(drawVelocityChart, 100);
}

function drawVelocityChart() {
  const canvas = document.getElementById('velocityCanvas'); if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.clientWidth; const h = 200;
  canvas.width = w * dpr; canvas.height = h * dpr;
  ctx.scale(dpr, dpr);

  const pad = {top:30, bottom:30, left:40, right:30};
  const cw = w - pad.left - pad.right; const ch = h - pad.top - pad.bottom;
  
  const vels = S.sprints.map(s => s.velocity || 0);
  if (vels.length === 0) return;
  const maxV = Math.max(...vels, 10);

  ctx.clearRect(0, 0, w, h);
  // Grid
  ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.lineWidth = 1;
  for (let i=0; i<=4; i++) {
    const y = pad.top + (ch/4)*i;
    ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(w-pad.right, y); ctx.stroke();
  }

  // Bars
  const barW = Math.min(40, (cw / vels.length) * 0.7);
  const gap = cw / vels.length;
  S.sprints.forEach((sp, i) => {
    const v = sp.velocity || 0;
    const bh = (v / maxV) * ch;
    const x = pad.left + gap * i + (gap - barW) / 2;
    const y = pad.top + ch - bh;
    
    const grad = ctx.createLinearGradient(x, y, x, pad.top + ch);
    grad.addColorStop(0, '#8b5cf6'); grad.addColorStop(1, '#6366f1');
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.roundRect(x, y, barW, bh, [4, 4, 0, 0]); ctx.fill();
    
    ctx.fillStyle = '#718096'; ctx.font = '10px Outfit'; ctx.textAlign = 'center';
    ctx.fillText(`S${sp.id}`, x + barW/2, h - 10);
    ctx.fillStyle = '#fff'; ctx.fillText(v, x + barW/2, y - 5);
  });
}

// ── SPRINT PLANNING (Restored rich modal) ──
function showPlanSprintModal() {
  const cn = S.project?.currentSprint || 1;
  const sprint = S.sprints.find(s => s.id === cn) || {velocity: 15};
  const unassigned = S.stories.filter(s => !s.sprint);
  
  let html = `<div class="modal-title">${icon('target')} Planificar Sprint ${cn}</div>
  <div style="margin-bottom:15px;font-size:13px;color:var(--text3)">Velocidad objetivo: <strong>${sprint.velocity} SP</strong></div>
  <div style="max-height:300px;overflow-y:auto;background:var(--bg3);border-radius:12px;padding:10px;border:1px solid var(--border)">`;
  
  unassigned.forEach(s => {
    html += `<label style="display:flex;align-items:center;gap:10px;padding:10px;border-bottom:1px solid var(--border);cursor:pointer">
      <input type="checkbox" class="plan-cb" value="${s.id}" data-sp="${s.sp}" onchange="updatePlanningStats()">
      <span class="bl-prio ${s.priority}" style="font-size:9px">${s.priority}</span>
      <span style="flex:1;font-size:13px">${esc(s.title)}</span>
      <span style="font-family:var(--mono);font-size:11px;color:var(--accent)">${s.sp} SP</span>
    </label>`;
  });
  
  html += `</div>
  <div id="planStats" style="margin-top:15px;padding:12px;background:var(--bg);border-radius:10px;border:1px solid var(--border);font-size:13px">
    Seleccionados: <strong id="planCount">0</strong> · Total: <strong id="planSp">0</strong> SP
    <span id="planAlert" style="color:var(--red);font-weight:800;margin-left:10px;display:none">${icon('alert')} EXCESO</span>
  </div>
  <div class="form-actions">
    <button class="btn" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-primary" onclick="executePlanning(${cn})">${icon('target')} Iniciar con historias</button>
  </div>`;
  showModal(html);
}

function updatePlanningStats() {
    const cbs = document.querySelectorAll('.plan-cb:checked');
    const count = cbs.length;
    let total = 0; cbs.forEach(c => total += parseInt(c.dataset.sp)||0);
    document.getElementById('planCount').textContent = count;
    document.getElementById('planSp').textContent = total;
    
    const cn = S.project?.currentSprint || 1;
    const sprint = S.sprints.find(s => s.id === cn) || {velocity: 15};
    document.getElementById('planAlert').style.display = total > (sprint.velocity || 999) ? 'inline' : 'none';
}

async function executePlanning(n) {
    const ids = [...document.querySelectorAll('.plan-cb:checked')].map(c => c.value);
    if (ids.length === 0) return;
    for (const id of ids) {
        await api('PUT', `/api/projects/${S.currentId}/stories/${id}`, { sprint: n, status: 'Todo' });
    }
    const sprint = S.sprints.find(s => s.id === n) || { id: n, stories: [] };
    sprint.stories = [...new Set([...(sprint.stories||[]), ...ids])];
    await api('POST', `/api/projects/${S.currentId}/sprints`, sprint);
    closeModal(); refreshStories(); toast('Planificación guardada', 'success');
}

// ── STORY DETAIL (Restored subtasks & ac) ──
function showStoryDetail(id) {
  const s = S.stories.find(x => x.id === id); if (!s) return;
  const memberOpts = S.team.members.map(m => `<option value="${m.alias}" ${m.alias===s.assignee?'selected':''}>${m.name}</option>`).join('');
  
  showModal(`<div class="modal-id" style="font-family:var(--mono);font-size:11px;color:var(--accent);margin-bottom:5px">${esc(s.id)}</div>
  <div class="modal-title">${icon('edit')} Editar Historia</div>
  <form onsubmit="saveStoryEdit(event, '${esc(s.id)}')">
    <div class="form-group"><label class="form-label">Título</label><input class="form-input" name="title" value="${esc(s.title)}" required></div>
    <div class="form-row">
        <div class="form-group"><label class="form-label">Prio</label><select class="form-select" name="priority">${['Must','Should','Could','Wont'].map(o=>`<option value="${o}" ${o===s.priority?'selected':''}>${o}</option>`).join('')}</select></div>
        <div class="form-group"><label class="form-label">SP</label><input class="form-input" name="sp" type="number" value="${esc(s.sp||0)}"></div>
    </div>
    <div class="form-row">
        <div class="form-group"><label class="form-label">Estado</label><select class="form-select" name="status">${COLUMNS.map(o=>`<option value="${o}" ${o===s.status?'selected':''}>${COL_LABELS[o]}</option>`).join('')}</select></div>
        <div class="form-group"><label class="form-label">Asignado</label><select class="form-select" name="assignee"><option value="">Sin asignar</option>${memberOpts}</select></div>
    </div>
    <div class="form-group"><label class="form-label">Descripción / Historia</label><textarea class="form-textarea" name="story" rows="3">${esc(s.story||'')}</textarea></div>
    <div class="form-group"><label class="form-label">Sub-tareas (una por línea)</label><textarea class="form-textarea" name="subtasks" rows="3" placeholder="Tarea 1\nTarea 2">${esc((s.subtasks||[]).join('\n'))}</textarea></div>
    <div class="form-group"><label class="form-label">Criterios de Aceptación (uno por línea)</label><textarea class="form-textarea" name="ac" rows="3" placeholder="AC 1\nAC 2">${esc((s.ac||[]).join('\n'))}</textarea></div>
    <div class="form-group"><label class="form-label">Dependencias (IDs coma)</label><input class="form-input" name="deps" value="${esc((s.deps||[]).join(', '))}" placeholder="ID-1.1, ID-1.2"></div>
    <div class="form-actions">
        <button type="button" class="btn" onclick="showIASuggest('${esc(s.id)}')">${icon('cpu')} Sugerir IA</button>
        <button type="button" class="btn btn-danger" onclick="deleteStory('${esc(s.id)}')">Eliminar</button>
        <span style="flex:1"></span>
        <button type="submit" class="btn btn-primary">Guardar Cambios</button>
    </div>
  </form>`);
}

async function saveStoryEdit(e, id) {
  e.preventDefault(); const fd = new FormData(e.target);
  try {
    await api('PUT', `/api/projects/${S.currentId}/stories/${id}`, {
      title: fd.get('title'), priority: fd.get('priority'), sp: parseInt(fd.get('sp'))||0, 
      assignee: fd.get('assignee'), status: fd.get('status'), story: fd.get('story'),
      subtasks: fd.get('subtasks').split('\n').filter(Boolean),
      ac: fd.get('ac').split('\n').filter(Boolean),
      deps: fd.get('deps').split(',').map(d=>d.trim()).filter(Boolean)
    });
    closeModal(); refreshStories(); toast('Historia guardada', 'success');
  } catch(e) { toast('Error: '+e.message, 'error'); }
}

// ── SETTINGS (Restored full fields) ──
function renderSettings() {
    const p = S.project; if (!p) return;

    let subHtml = '';
    if (S.mode === 'cloud') {
      const isPro = S.plan === 'pro' || S.plan === 'enterprise';
      subHtml = `<div class="section-box" style="margin-top:30px">
        <div class="section-box-title">${icon('star')} Suscripción</div>
        <div style="display:flex;align-items:center;gap:16px;padding:8px 0">
          <div style="flex:1">
            <div style="font-weight:700;font-size:16px">Plan ${S.plan === 'pro' ? 'Pro' : S.plan === 'enterprise' ? 'Enterprise' : 'Free'}</div>
            <div style="color:var(--text3);font-size:12px">
              ${S.plan === 'free' ? '1 proyecto · 1 miembro · 10 sugerencias IA/mes' :
                S.plan === 'pro' ? '10 proyectos · 8 miembros · IA ilimitada' :
                'Ilimitado todo'}
            </div>
          </div>
          ${isPro ? `<button class="btn btn-sm" onclick="openCustomerPortal()">${icon('settings')} Gestionar</button>
            <button class="btn btn-sm btn-danger" onclick="cancelSubscription()">${icon('x')} Cancelar</button>` :
            `<button class="btn btn-primary btn-sm" onclick="upgradeToPro()">${icon('sparkle')} Actualizar a Pro</button>`}
        </div>
      </div>`;
    }

    document.getElementById('tabContent').innerHTML = `<div class="section-header"><strong>${icon('settings')} Configuración del Proyecto</strong></div>
    <form onsubmit="saveSettings(event)" style="max-width:600px">
        <div class="form-group"><label class="form-label">Nombre del Proyecto</label><input class="form-input" name="title" value="${esc(p.title)}"></div>
        <div class="form-group"><label class="form-label">Descripción</label><textarea class="form-textarea" name="description" rows="2">${esc(p.description||'')}</textarea></div>
        <div class="form-group"><label class="form-label">Tech Stack (comma separated)</label><input class="form-input" name="techStack" value="${esc((p.techStack||[]).join(', '))}"></div>
        <div class="form-row">
            <div class="form-group"><label class="form-label">Sprint Actual</label><input class="form-input" name="currentSprint" type="number" value="${esc(p.currentSprint||1)}"></div>
            <div class="form-group"><label class="form-label">Total Sprints</label><input class="form-input" name="totalSprints" type="number" value="${esc(p.totalSprints||4)}"></div>
        </div>
        <div class="form-row">
            <div class="form-group"><label class="form-label">WIP InProgress</label><input class="form-input" name="wipInProg" type="number" value="${esc(p.wipLimits?.InProgress||4)}"></div>
            <div class="form-group"><label class="form-label">WIP Review</label><input class="form-input" name="wipReview" type="number" value="${esc(p.wipLimits?.Review||3)}"></div>
        </div>
        <div class="form-actions">
            <button type="submit" class="btn btn-primary">${icon('save')} Guardar Cambios</button>
            <button type="button" class="btn btn-danger" onclick="deleteCurrentProject()">${icon('trash')} Eliminar Proyecto</button>
        </div>
    </form>${subHtml}`;
}
async function saveSettings(e) {
    e.preventDefault(); const fd = new FormData(e.target);
    try {
        await api('PUT', `/api/projects/${S.currentId}`, { 
            title: fd.get('title'), description: fd.get('description'),
            techStack: fd.get('techStack').split(',').map(s=>s.trim()).filter(Boolean),
            currentSprint: parseInt(fd.get('currentSprint'))||1, totalSprints: parseInt(fd.get('totalSprints'))||4,
            wipLimits: { InProgress: parseInt(fd.get('wipInProg'))||4, Review: parseInt(fd.get('wipReview'))||3 }
        });
        toast('Configuración guardada', 'success'); selectProject(S.currentId);
    } catch(e) { toast('Error', 'error'); }
}

async function saveSprintConfig() {
  const cn = S.project?.currentSprint || 1;
  const obj = document.getElementById('sprintObj').value;
  const vel = parseInt(document.getElementById('sprintVel').value) || 0;
  try {
    await api('POST', `/api/projects/${S.currentId}/sprints`, { id: cn, objective: obj, velocity: vel });
    toast('Sprint configurado', 'success'); refreshStories();
  } catch(e) { toast('Error', 'error'); }
}
async function saveSprintRetro() {
  const cn = S.project?.currentSprint || 1;
  const retro = document.getElementById('sprintRetro').value;
  try {
    await api('POST', `/api/projects/${S.currentId}/sprints`, { id: cn, retrospective: retro });
    toast('Retrospectiva guardada', 'success');
  } catch(e) { toast('Error', 'error'); }
}

async function removeFromSprint(id) {
  try {
    await api('PUT', `/api/projects/${S.currentId}/stories/${id}`, { sprint: null, status: 'Backlog' });
    toast('Quitada del sprint', 'info'); refreshStories();
  } catch(e) { toast('Error', 'error'); }
}

// ── DASHBOARD (Optimized) ──
async function renderDashboard() {
  const content = document.getElementById('tabContent');
  content.innerHTML = `
    <div class="section-header animate-in"><div><strong>${icon('globe')} Dashboard Global</strong></div></div>
    <div class="sprint-cards animate-in">
        <div class="scard skeleton" style="height:120px"></div>
        <div class="scard skeleton" style="height:120px"></div>
        <div class="scard skeleton" style="height:120px"></div>
    </div>
    <div class="team-grid skeleton-list animate-in" style="margin-top:40px"></div>`;

  try {
    const data = await api('GET', '/api/dashboard');
    let html = `<div class="section-header animate-in"><div><strong>${icon('globe')} Dashboard Global</strong></div></div>
    <div class="sprint-cards animate-in" id="dashCards">
      <div class="scard">
        <div class="scard-label">Proyectos</div>
        <div class="scard-val">${data.length}</div>
        <div class="scard-sub">Activos en Aurora</div>
      </div>
      <div class="scard">
        <div class="scard-label">Historias Totales</div>
        <div class="scard-val">${data.reduce((a,p)=>a+p.storiesCount,0)}</div>
        <div class="scard-sub">A través de todos los silos</div>
      </div>
      <div class="scard">
        <div class="scard-label">Carga Global</div>
        <div class="scard-val">${data.reduce((a,p)=>a+p.doneCount,0)} <span style="font-size:14px;color:var(--text3)">Done</span></div>
        <div class="scard-sub">Completado con éxito</div>
      </div>
    </div>
    <div id="dashList" class="team-grid" style="margin-top:40px">`;
    
    data.forEach((p, idx) => {
      html += `<div class="team-card animate-in" onclick="selectProject('${p.id}')" style="animation-delay:${idx*0.1}s; cursor:pointer; padding:30px; flex-direction:column; align-items:flex-start">
          <div style="width:100%">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px">
                <div class="team-name" style="font-size:22px; margin:0">${esc(p.title)}</div>
                <div class="badge" style="background:var(--accent-soft); color:var(--accent); padding:4px 10px; border-radius:8px">S${p.currentSprint||'-'}</div>
              </div>
              <div style="font-size:13px; color:var(--text3); margin-bottom:20px; display:flex; gap:15px">
                <span>${icon('barChart')} ${p.storiesCount} historias</span>
                <span>${icon('users')} ${p.membersCount} miembros</span>
              </div>
              <div class="bar-wrap" style="height:8px; margin-bottom:10px"><div class="bar-fill" style="width:${p.pct}%"></div></div>
              <div style="display:flex; justify-content:space-between; font-size:12px; font-weight:600">
                <span style="color:var(--text2)">Progreso General</span>
                <span style="color:var(--accent)">${p.pct}%</span>
              </div>
          </div>
      </div>`;
    });
    html += `</div>`;
    content.innerHTML = html;
  } catch(e) { toast('Error cargando dashboard','error'); }
}

// ── OTHER HELPERS ──
function showIASuggest(storyId) {
    const s = S.stories.find(x => x.id === storyId); if (!s) return;
    showModal(`<div class="modal-title">${icon('cpu')} Sugerencias IA para ${s.id}</div>
    <div style="padding:20px;background:var(--bg3);border-radius:12px;margin-bottom:15px;font-size:14px;line-height:1.6">
        <p><strong>Criterios de Aceptación sugeridos:</strong></p>
        <ul style="margin-left:20px;margin-top:10px">
            <li>El usuario puede ${esc(s.title.toLowerCase())} de forma fluida.</li>
            <li>Se manejan errores de red y validación.</li>
            <li>Diseño responsive adaptado al tema Aurora.</li>
        </ul>
        <p style="margin-top:15px"><strong>Estimación recomendada:</strong> ${s.sp > 5 ? '8 SP' : '3-5 SP'}</p>
    </div>
    <div class="form-actions"><button class="btn btn-primary" onclick="closeModal()">Entendido</button></div>`);
}

function showAddMemberModal() {
  const colors = ['#6366f1','#f97316','#3b82f6','#10b981','#ec4899','#8b5cf6'];
  showModal(`<div class="modal-title">${icon('user')} Agregar Miembro</div>
  <form onsubmit="addMember(event)">
    <div class="form-group"><label class="form-label">Alias (Ej: ETH)</label><input class="form-input" name="alias" required></div>
    <div class="form-group"><label class="form-label">Nombre</label><input class="form-input" name="name" required></div>
    <div class="form-group"><label class="form-label">Rol</label><input class="form-input" name="role" placeholder="Backend, UX, etc"></div>
    <div class="form-group"><label class="form-label">Capacidad (SP/sprint)</label><input class="form-input" name="spPerSprint" type="number" value="10"></div>
    <div class="form-group"><label class="form-label">Color</label><input class="form-input" name="color" type="color" value="${colors[Math.floor(Math.random()*colors.length)]}"></div>
    <div class="form-actions"><button type="submit" class="btn btn-primary">Agregar</button></div>
  </form>`);
}
async function addMember(e) {
  e.preventDefault(); const fd = new FormData(e.target);
  S.team.members.push({
    alias: fd.get('alias').toUpperCase(), name: fd.get('name'), role: fd.get('role'),
    spPerSprint: parseInt(fd.get('spPerSprint'))||10, color: fd.get('color')
  });
  await api('PUT', `/api/projects/${S.currentId}/team`, S.team);
  closeModal(); refreshStories(); toast('Miembro agregado', 'success');
}
async function removeMember(alias) {
  if (!confirm('¿Eliminar miembro?')) return;
  S.team.members = S.team.members.filter(m => m.alias !== alias);
  await api('PUT', `/api/projects/${S.currentId}/team`, S.team);
  refreshStories();
}

async function refreshStories() {
  if (!S.currentId) return;
  cacheClear();
  const [stories, sprints, team, project] = await Promise.all([
    api('GET',`/api/projects/${S.currentId}/stories`), api('GET',`/api/projects/${S.currentId}/sprints`),
    api('GET',`/api/projects/${S.currentId}/team`), api('GET',`/api/projects/${S.currentId}`)
  ]);
  S.stories = stories; S.sprints = sprints; S.team = team; S.project = project; renderProject();
}

function debouncedFilter() { S.filterText = document.getElementById('globalSearch')?.value||''; renderSidebar(); if (S.tab==='board') renderBoard(); if (S.tab==='backlog') renderBacklog(); }

// ── KEYBOARD SHORTCUTS ──
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
    if (e.target.closest('input, textarea, select')) return;
    if (e.key === 'n') showNewStoryModal();
    if (e.key === 'p') showNewProjectModal();
    if (e.key >= '1' && e.key <= '7') {
        const tabs = ['board','backlog','sprint','team','metrics','dashboard','settings'];
        switchTab(tabs[parseInt(e.key)-1]);
    }
});

function showNewProjectModal() {
  showModal(`<div class="modal-title">${icon('folderPlus')} Nuevo Proyecto</div>
  <form onsubmit="createProject(event)">
    <div class="form-group"><label class="form-label">ID (ej: mobility-app)</label><input class="form-input" name="id" required></div>
    <div class="form-group"><label class="form-label">Nombre</label><input class="form-input" name="title" required></div>
    <div class="form-group"><label class="form-label">Template</label><select class="form-select" name="template"><option value="scrum">Scrum Standard</option><option value="kanban">Kanban Flow</option></select></div>
    <div class="form-actions"><button type="submit" class="btn btn-primary">Crear Proyecto</button></div>
  </form>`);
}
async function createProject(e) {
  e.preventDefault(); const fd = new FormData(e.target);
  const t = fd.get('template')==='scrum'?{sprints:4,wip:{InProgress:4,Review:3}}:{sprints:0,wip:{InProgress:6,Review:4}};
  try { await api('POST', '/api/projects', { id: fd.get('id'), title: fd.get('title'), totalSprints: t.sprints, wipLimits: t.wip }); toast('Creado '+icon('sparkle'), 'success'); closeModal(); loadProjects(); } catch(e) { toast('Error', 'error'); }
}
async function deleteCurrentProject() { if (confirm('¿Eliminar proyecto?')) { await api('DELETE', `/api/projects/${S.currentId}`); S.currentId=null; loadProjects(); document.getElementById('emptyState').style.display='flex'; document.getElementById('mainHeader').style.display='none'; document.getElementById('tabs').style.display='none'; document.getElementById('tabContent').style.display='none'; } }
async function importProject(input) { const file = input.files[0]; if (!file) return; const reader = new FileReader(); reader.onload = async e => { try { await api('POST', '/api/import', JSON.parse(e.target.result)); toast('Importado '+icon('sparkle'), 'success'); loadProjects(); } catch(err) { toast('Error', 'error'); } }; reader.readAsText(file); input.value = ''; }
async function exportMarkdown() { const resp = await fetch(`/api/projects/${S.currentId}/export/markdown`); const md = await resp.text(); const blob = new Blob([md],{type:'text/markdown'}); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `${S.currentId}-report.md`; a.click(); }
function showNewStoryModal() {
  const memberOpts = S.team.members.map(m => `<option value="${m.alias}">${m.name}</option>`).join('');
  showModal(`<div class="modal-title">${icon('sparkle')} Nueva Historia</div>
  <form onsubmit="createStory(event)">
    <div class="form-group"><label class="form-label">Título</label><input class="form-input" name="title" required></div>
    <div class="form-row"><div class="form-group"><label class="form-label">Prio</label><select class="form-select" name="priority"><option value="Must">Must</option><option value="Should" selected>Should</option></select></div><div class="form-group"><label class="form-label">SP</label><input class="form-input" name="sp" type="number" value="3"></div></div>
    <div class="form-actions"><button type="submit" class="btn btn-primary">Crear</button></div>
  </form>`);
}
async function createStory(e) { e.preventDefault(); const fd = new FormData(e.target); try { await api('POST', `/api/projects/${S.currentId}/stories`, { title: fd.get('title'), priority: fd.get('priority'), sp: parseInt(fd.get('sp'))||1 }); closeModal(); refreshStories(); } catch(e) { toast(e.message, 'error'); } }
async function deleteStory(id) { if (confirm('¿Eliminar?')) { await api('DELETE', `/api/projects/${S.currentId}/stories/${id}`); closeModal(); refreshStories(); } }
async function changeSprint(n) { await api('PUT', `/api/projects/${S.currentId}`, { currentSprint: parseInt(n) }); refreshStories(); }

document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('scrumban_theme'); if (saved) { document.documentElement.dataset.theme = saved; S.theme = saved; }
  initApp();
});

