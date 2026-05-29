(function () {
  if (window.__retirementShieldTrafficTracked) return;
  window.__retirementShieldTrafficTracked = true;

  var path = window.location.pathname || '/';
  if (
    path.indexOf('/api/') === 0 ||
    path.indexOf('/portal') === 0 ||
    path.indexOf('/login') === 0 ||
    path.indexOf('/register') === 0
  ) {
    return;
  }

  function makeId(prefix) {
    var randomPart = window.crypto && window.crypto.randomUUID
      ? window.crypto.randomUUID()
      : String(Date.now()) + '-' + Math.random().toString(16).slice(2);
    return prefix + '-' + randomPart;
  }

  function getStoredId(key, prefix) {
    try {
      var existing = window.localStorage.getItem(key);
      if (existing) return existing;
      var created = makeId(prefix);
      window.localStorage.setItem(key, created);
      return created;
    } catch {
      return makeId(prefix);
    }
  }

  function getSessionId() {
    try {
      var existing = window.sessionStorage.getItem('rs_traffic_session_id');
      if (existing) return existing;
      var created = makeId('session');
      window.sessionStorage.setItem('rs_traffic_session_id', created);
      return created;
    } catch {
      return makeId('session');
    }
  }

  var payload = {
    page_path: path,
    search: window.location.search || '',
    page_title: document.title || '',
    referrer: document.referrer || '',
    visitor_id: getStoredId('rs_traffic_visitor_id', 'visitor'),
    session_id: getSessionId()
  };

  var body = JSON.stringify(payload);

  if (navigator.sendBeacon) {
    var blob = new Blob([body], { type: 'application/json' });
    navigator.sendBeacon('/api/traffic/track', blob);
    return;
  }

  fetch('/api/traffic/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body,
    keepalive: true
  }).catch(function () {});
})();
