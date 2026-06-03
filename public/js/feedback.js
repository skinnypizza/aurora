async function sendFeedback(type, message, email) {
  try {
    const res = await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, message, email: email || null })
    });
    if (!res.ok) throw new Error('Error al enviar feedback');
    return await res.json();
  } catch(e) { throw e; }
}

function showFeedbackModal() {
  const html = `<div class="modal-title">${icon('messageSquare')} Tu opinión importa</div>
    <p style="color:var(--text3);margin-bottom:16px;line-height:1.5">
      ¿Qué te gusta de Scrumban? ¿Qué mejorarías? ¿Encontraste un error?
    </p>
    <form onsubmit="handleFeedback(event)">
      <div class="form-group">
        <label class="form-label">Tipo</label>
        <select name="type" class="form-input">
          <option value="feature">Sugerencia de funcionalidad</option>
          <option value="bug">Reportar error</option>
          <option value="testimonial">Testimonio / Me encanta</option>
          <option value="other">Otro</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Mensaje</label>
        <textarea name="message" class="form-textarea" rows="4" placeholder="Cuéntanos..." required></textarea>
      </div>
      <div class="form-group">
        <label class="form-label">Email (opcional, para responderte)</label>
        <input type="email" name="email" class="form-input" placeholder="tu@email.com">
      </div>
      <button type="submit" class="btn btn-primary" style="width:100%">${icon('send')} Enviar feedback</button>
    </form>`;
  showModal(html);
}

async function handleFeedback(e) {
  e.preventDefault();
  const fd = new FormData(e.target);
  try {
    await sendFeedback(fd.get('type'), fd.get('message'), fd.get('email'));
    document.getElementById('modalContent').innerHTML = `<div style="text-align:center;padding:30px 0">
      <div style="font-size:48px;margin-bottom:15px">${icon('heart')}</div>
      <h3>¡Gracias por tu feedback!</h3>
      <p style="color:var(--text3);margin-top:8px">Cada opinión nos ayuda a mejorar Scrumban.</p>
      <button class="btn btn-primary" onclick="closeModal()" style="margin-top:20px">Cerrar</button>
    </div>`;
  } catch(e) {
    toast('Error al enviar feedback', 'error');
  }
}
