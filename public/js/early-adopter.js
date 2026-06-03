const EA_STORAGE_KEY = 'scrumban_early_adopter';

function checkEarlyAdopter() {
  const stored = localStorage.getItem(EA_STORAGE_KEY);
  if (stored) return JSON.parse(stored);
  return null;
}

function claimEarlyAdopter() {
  if (checkEarlyAdopter()) {
    toast('Ya eres Early Adopter', 'info');
    return;
  }
  // Early adopter = primeros 1000 registros o primera semana
  // Se verifica contra el servidor
  fetch('/api/early-adopter/claim', {
    method: 'POST',
    credentials: 'include'
  })
  .then(r => r.json())
  .then(data => {
    if (data.claimed) {
      localStorage.setItem(EA_STORAGE_KEY, JSON.stringify(data));
      toast('¡Eres Early Adopter! Precio congelado de por vida', 'success');
      renderSettings();
    } else {
      toast('Ya pasó el período de Early Adopter', 'info');
    }
  })
  .catch(() => {});
}

function showEarlyAdopterModal() {
  const html = `<div class="modal-title">${icon('star')} Programa Early Adopter</div>
    <div style="text-align:center;padding:16px 0;line-height:1.7">
      <div style="font-size:48px;margin-bottom:12px">${icon('sparkle')}</div>
      <h3 style="margin-bottom:8px">Sé de los primeros</h3>
      <p style="color:var(--text3)">
        Los primeros <strong>1,000 usuarios</strong> en registrarse obtienen:
      </p>
      <ul style="text-align:left;display:inline-block;margin:12px 0;padding:0;list-style:none">
        <li style="margin:6px 0">${icon('check')} Plan Pro gratis por <strong>6 meses</strong></li>
        <li style="margin:6px 0">${icon('check')} Precio congelado de <strong>$4.99 USD/mes</strong> de por vida</li>
        <li style="margin:6px 0">${icon('check')} Badge "Founder Edition" en tu perfil</li>
        <li style="margin:6px 0">${icon('check')} Acceso anticipado a nuevas funciones</li>
      </ul>
      <p style="color:var(--text3);font-size:13px">
        Sin trampas. Sin tarjeta ahora. Regístrate y lo aseguras.
      </p>
    </div>`;
  showModal(html);
}
