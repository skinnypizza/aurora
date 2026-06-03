let pricingPlans = null;
let pricingBilling = 'monthly';

async function loadPricingPlans() {
  try {
    const res = await fetch('/api/subscription/plans');
    if (!res.ok) throw new Error('No se pudieron cargar los planes');
    pricingPlans = await res.json();
    renderPricing();
  } catch {
    document.getElementById('pricingContainer').innerHTML = '<p style="text-align:center;color:var(--text3);padding:40px">Planes no disponibles</p>';
  }
}

function toggleBilling(mode) {
  pricingBilling = mode;
  document.querySelectorAll('.billing-toggle .btn').forEach(b => b.classList.remove('btn-primary'));
  document.querySelectorAll('.billing-toggle .btn')[mode === 'monthly' ? 0 : 1].classList.add('btn-primary');
  renderPricing();
}

function renderPricing() {
  if (!pricingPlans) return;
  const isYearly = pricingBilling === 'yearly';
  const container = document.getElementById('pricingContainer');
  let html = '<div class="pricing-grid">';

  const plans = [pricingPlans.free, pricingPlans.pro, pricingPlans.enterprise];
  const prices = {
    free: { monthly: 0, yearly: 0 },
    pro: { monthly: 9, yearly: 99 },
    enterprise: { monthly: 29, yearly: 299 },
  };

  plans.forEach((plan, idx) => {
    const price = prices[plan.id] || { monthly: 0, yearly: 0 };
    const displayPrice = isYearly ? price.yearly : price.monthly;
    const periodLabel = isYearly ? '/año' : '/mes';
    const savings = isYearly && price.yearly > 0 ? Math.round((1 - price.yearly / (price.monthly * 12)) * 100) : 0;

    const features = [
      { label: 'Proyectos', val: plan.project_limit === -1 ? 'Ilimitados' : plan.project_limit },
      { label: 'Miembros equipo', val: plan.team_limit === -1 ? 'Ilimitados' : plan.team_limit },
      { label: 'Sugerencias IA', val: plan.ai_suggestions === -1 ? 'Ilimitadas' : plan.ai_suggestions + '/mes' },
      { label: 'Sincronización cloud', val: plan.cloud_sync ? '✅' : '❌' },
      { label: 'Columnas personalizadas', val: plan.custom_columns ? '✅' : '❌' },
      { label: 'Métricas avanzadas', val: plan.advanced_metrics ? '✅' : '❌' },
      { label: 'Exportación CSV/JSON', val: plan.exports ? '✅' : '❌' },
      { label: 'Backups automáticos', val: plan.auto_backups ? '✅' : '❌' },
    ];

    if (plan.white_label !== undefined) {
      features.push({ label: 'White Label', val: plan.white_label ? '✅' : '❌' });
    }
    if (plan.api_exports !== undefined) {
      features.push({ label: 'API Exportación', val: plan.api_exports ? '✅' : '❌' });
    }
    if (plan.sla !== undefined) {
      features.push({ label: 'SLA', val: plan.sla ? '✅' : '❌' });
    }

    const popular = plan.id === 'pro' ? 'popular' : '';
    html += `<div class="pricing-card ${popular}">
      ${plan.id === 'pro' ? '<div class="pricing-badge">MÁS POPULAR</div>' : ''}
      <div class="pricing-card-header">
        <div class="pricing-name">${plan.name}</div>
        <div class="pricing-price">
          ${displayPrice === 0 ? '<span style="font-size:16px;font-weight:400">Gratis</span>' : '<span class="pricing-currency">$</span>' + displayPrice + '<span class="pricing-period">' + periodLabel + '</span>'}
        </div>
        ${savings > 0 ? '<div class="pricing-savings">Ahorra ' + savings + '%</div>' : ''}
      </div>
      <div class="pricing-features">
        ${features.map(f => '<div class="pricing-feature"><span>' + f.val + '</span><span style="color:var(--text3);font-size:12px">' + f.label + '</span></div>').join('')}
      </div>
      <div class="pricing-actions">
        ${plan.id === 'free' ? '<button class="btn" disabled style="width:100%">Plan Actual</button>' :
          '<button class="btn ' + (plan.id === 'pro' ? 'btn-primary' : '') + '" onclick="upgradeToPro()" style="width:100%">' +
          (plan.id === 'enterprise' ? 'Contactar' : 'Actualizar a ' + plan.name) + '</button>'}
      </div>
    </div>`;
  });

  html += '</div>';
  container.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('pricingContainer');
  if (container) loadPricingPlans();
});
