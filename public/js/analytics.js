// ═══════════════════════════════════════════════════════
//  Scrumban App — Analytics (Privacy-First)
//  Soporta: Plausible, Umami, o endpoint personalizado
//  Solo se activa si ANALYTICS_ID está configurado
// ═══════════════════════════════════════════════════════

(function () {
  'use strict';

  var ANALYTICS_ID = window.__ANALYTICS_ID;
  var ANALYTICS_PROVIDER = window.__ANALYTICS_PROVIDER || 'plausible';
  var ANALYTICS_HOST = window.__ANALYTICS_HOST || 'https://plausible.io';

  // ── No trackear si no hay ID configurado ──
  if (!ANALYTICS_ID || ANALYTICS_ID === '') {
    return;
  }

  // ── Plausible ──
  if (ANALYTICS_PROVIDER === 'plausible') {
    (function () {
      var d = document,
        w = window;
      w.plausible =
        w.plausible ||
        function () {
          (w.plausible.q = w.plausible.q || []).push(arguments);
        };
      var s = d.createElement('script');
      s.defer = true;
      s.src = ANALYTICS_HOST + '/js/script.js';
      s.setAttribute('data-domain', ANALYTICS_ID);
      d.head.appendChild(s);
    })();
    return;
  }

  // ── Umami ──
  if (ANALYTICS_PROVIDER === 'umami') {
    (function () {
      var d = document,
        s = d.createElement('script');
      s.defer = true;
      s.src = ANALYTICS_HOST + '/script.js';
      s.setAttribute('data-website-id', ANALYTICS_ID);
      d.head.appendChild(s);
    })();
    return;
  }

  // ── Endpoint personalizado (fallback) ──
  // Envía un ping cada 30 segundos mientras la página está visible
  var ENDPOINT = ANALYTICS_HOST + '/api/event';

  function sendEvent(eventName, payload) {
    var data = {
      id: ANALYTICS_ID,
      event: eventName,
      url: window.location.href,
      referrer: document.referrer || '',
      screen: window.screen.width + 'x' + window.screen.height,
      lang: navigator.language,
      ts: new Date().toISOString(),
      ...(payload || {}),
    };

    try {
      var blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
      navigator.sendBeacon(ENDPOINT, blob);
    } catch (e) {
      // Fallback a fetch si sendBeacon falla
      fetch(ENDPOINT, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
      }).catch(function () {});
    }
  }

  // ── Eventos automáticos ──
  sendEvent('pageview');

  // SPA navigation tracking
  var lastUrl = window.location.href;
  var observer = new MutationObserver(function () {
    if (lastUrl !== window.location.href) {
      lastUrl = window.location.href;
      sendEvent('pageview');
    }
  });
  observer.observe(document.querySelector('title'), { childList: true });

  // Heartbeat cada 30s (sesión activa)
  setInterval(function () {
    sendEvent('heartbeat');
  }, 30000);
})();
