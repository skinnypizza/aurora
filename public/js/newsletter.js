async function subscribeNewsletter(email) {
  try {
    const res = await fetch('/api/newsletter/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
    return await res.json();
  } catch (e) {
    throw e;
  }
}

function showNewsletterModal() {
  const html = `<div class="modal-title">${icon('mail')} ¿Quieres novedades?</div>
    <p style="color:var(--text3);margin-bottom:20px;line-height:1.6">
      Recibe actualizaciones, tips ágiles y anuncios de nuevas funciones.<br>
      Sin spam, sin compartir tu email, cancelas cuando quieras.
    </p>
    <form onsubmit="handleNewsletter(event)">
      <div class="form-group">
        <label class="form-label">Tu correo electrónico</label>
        <input type="email" name="email" class="form-input" placeholder="ejemplo@correo.com" required>
      </div>
      <button type="submit" class="btn btn-primary" style="width:100%">${icon('sparkle')} Suscribirme</button>
    </form>
    <p style="font-size:11px;color:var(--text3);margin-top:12px;text-align:center">
      Al suscribirte aceptas recibir correos de Scrumban App. Puedes darte de baja en cualquier momento.
    </p>`;
  showModal(html);
}

async function handleNewsletter(e) {
  e.preventDefault();
  const fd = new FormData(e.target);
  const email = fd.get('email');
  try {
    await subscribeNewsletter(email);
    document.getElementById('modalContent').innerHTML = `<div style="text-align:center;padding:30px 0">
      <div style="font-size:48px;margin-bottom:15px">${icon('check')}</div>
      <h3>¡Gracias por suscribirte!</h3>
      <p style="color:var(--text3);margin-top:8px">Te mantendremos al tanto de todo.</p>
      <button class="btn btn-primary" onclick="closeModal()" style="margin-top:20px">Cerrar</button>
    </div>`;
  } catch(e) {
    toast('Error: ' + e.message, 'error');
  }
}
