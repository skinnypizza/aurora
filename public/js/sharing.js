const SHARE_TEXT = 'Scrumban Aurora — Gestión ágil de proyectos (Scrum + Kanban) en español. Gratis, open source, multiplataforma.';
const SHARE_URL = 'https://aurora-production-848a.up.railway.app/';
const SHARE_HASHTAGS = 'scrumban,agile,opensource,latam';

function shareTwitter() {
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXT)}&url=${encodeURIComponent(SHARE_URL)}&hashtags=${SHARE_HASHTAGS}`;
  window.open(url, '_blank', 'width=600,height=400');
}

function shareLinkedIn() {
  const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(SHARE_URL)}`;
  window.open(url, '_blank', 'width=600,height=400');
}

function shareFacebook() {
  const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SHARE_URL)}`;
  window.open(url, '_blank', 'width=600,height=400');
}

function shareWhatsApp() {
  const url = `https://wa.me/?text=${encodeURIComponent(SHARE_TEXT + ' ' + SHARE_URL)}`;
  window.open(url, '_blank', 'width=600,height=400');
}

function copyShareLink() {
  navigator.clipboard.writeText(SHARE_URL).then(() => {
    toast('Link copiado al portapapeles', 'success');
  }).catch(() => {
    toast('No se pudo copiar', 'error');
  });
}

function showShareModal() {
  const html = `<div class="modal-title">${icon('share')} Comparte Scrumban</div>
    <p style="color:var(--text3);margin-bottom:20px;text-align:center">
      Ayuda a que más personas conozcan la herramienta. Comparte con tu equipo.
    </p>
    <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
      <button class="btn" onclick="shareTwitter()" style="background:#1da1f2;color:#fff;border:none;padding:12px 18px">${icon('twitter')} Twitter</button>
      <button class="btn" onclick="shareLinkedIn()" style="background:#0a66c2;color:#fff;border:none;padding:12px 18px">${icon('linkedin')} LinkedIn</button>
      <button class="btn" onclick="shareWhatsApp()" style="background:#25d366;color:#fff;border:none;padding:12px 18px">${icon('whatsapp')} WhatsApp</button>
      <button class="btn" onclick="copyShareLink()" style="background:var(--bg3);padding:12px 18px">${icon('link')} Copiar link</button>
    </div>
    <p style="text-align:center;margin-top:20px;font-size:12px;color:var(--text3)">
      Cada vez que compartes, ayudas a que Scrumban crezca 💜
    </p>`;
  showModal(html);
}
