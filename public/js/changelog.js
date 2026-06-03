const CHANGELOG = [
  {
    version: 'v3.1.0',
    date: '2026-06-03',
    title: 'Lanzamiento Oficial',
    items: [
      'Modo local con almacenamiento en JSON (siempre gratis)',
      'Modo cloud con MongoDB y autenticación de usuarios',
      'Sistema de suscripciones Pro (Stripe + Mercado Pago)',
      'Landing page profesional con planes de precios',
      'App desktop con Electron',
      'Sugerencias IA para historias de usuario',
      'Métricas de velocidad, MoSCoW y lead time',
      'Tema oscuro/claro',
      'OpenCollective para donaciones de la comunidad',
      'SEO completo, PWA, sitemap',
    ]
  }
];

function showChangelog() {
  const items = CHANGELOG.map(v => `<div style="margin-bottom:24px">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
      <span style="background:var(--accent);color:#fff;padding:2px 10px;border-radius:6px;font-size:11px;font-weight:700;letter-spacing:0.5px">${v.version}</span>
      <span style="color:var(--text3);font-size:12px">${v.date}</span>
    </div>
    <div style="font-weight:600;font-size:15px;margin-bottom:6px">${v.title}</div>
    <ul style="margin:0;padding-left:20px;color:var(--text2);font-size:13px;line-height:1.8">
      ${v.items.map(i => `<li>${i}</li>`).join('')}
    </ul>
  </div>`).join('');

  showModal(`<div class="modal-title">${icon('sparkle')} ¿Qué hay de nuevo?</div>
    ${items}
    <div style="text-align:center;margin-top:16px;padding-top:16px;border-top:1px solid var(--border)">
      <button class="btn" onclick="closeModal()">Cerrar</button>
    </div>`);
}
