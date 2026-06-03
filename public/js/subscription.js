async function getSubscriptionStatus() {
  try {
    const res = await fetch('/api/subscription/status', { credentials: 'include' });
    if (!res.ok) return { plan: 'free', limits: {}, features: [] };
    return await res.json();
  } catch {
    return { plan: 'free', limits: {}, features: [] };
  }
}

async function upgradeToPro(priceId) {
  try {
    const res = await fetch('/api/subscription/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ priceId: priceId || undefined }),
    });
    if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  } catch (e) {
    toast('Error al iniciar pago: ' + e.message, 'error');
  }
}

async function openCustomerPortal() {
  try {
    const res = await fetch('/api/subscription/create-portal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  } catch (e) {
    toast('Error al abrir portal: ' + e.message, 'error');
  }
}

async function cancelSubscription() {
  if (!confirm('¿Estás seguro de cancelar tu suscripción? Volverás al plan Free al final del período de facturación.')) return;
  try {
    await fetch('/api/subscription/cancel', {
      method: 'POST',
      credentials: 'include',
    });
    toast('Suscripción cancelada', 'success');
  } catch (e) {
    toast('Error: ' + e.message, 'error');
  }
}

function showUpgradeModal(featureName) {
  const featureLabels = {
    cloud_sync: 'Sincronización en la Nube',
    custom_columns: 'Columnas Personalizadas',
    advanced_metrics: 'Métricas Avanzadas',
    exports: 'Exportación CSV/JSON',
    ai_suggestions: 'Sugerencias IA Ilimitadas',
    auto_backups: 'Backups Automáticos',
    white_label: 'White Label',
    api_exports: 'Exportación por API',
    sla: 'SLA',
  };
  const label = featureLabels[featureName] || featureName;
  showModal(`<div class="modal-title">${icon('sparkle')} Actualiza a Pro</div>
    <div style="text-align:center;padding:20px 0">
      <div style="font-size:48px;margin-bottom:15px;">${icon('star')}</div>
      <h3 style="margin-bottom:8px">${esc(label)}</h3>
      <p style="color:var(--text3);margin-bottom:20px;line-height:1.6">
        Esta función está disponible solo en el plan Pro.<br>
        Desbloquea todas las funciones avanzadas por solo<br>
        <strong style="font-size:24px;color:var(--accent);">$9 USD/mes</strong>
        <span style="color:var(--text3)"> o </span>
        <strong style="color:var(--accent);">$99 USD/año</strong>
      </p>
      <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
        <button class="btn btn-primary" onclick="upgradeToPro()" style="padding:12px 28px;font-size:15px">
          ${icon('sparkle')} Actualizar a Pro
        </button>
        <button class="btn" onclick="closeModal()" style="padding:12px 28px;font-size:15px">
          Quizás después
        </button>
      </div>
    </div>`);
}
