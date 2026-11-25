/* Sip & Play GA4 bootstrap (G-6J443GNZ4J) — Basic Consent Mode.
   No request to googletagmanager.com is made until the visitor opts in. */
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  'ad_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied',
  'analytics_storage': 'denied'
});
window.__loadSipGA4 = function() {
  if (window.__sipGA4Loaded) return;
  var isLocal = /^(localhost|127\.0\.0\.1)$/.test(location.hostname) || location.protocol === 'file:';
  var isDebug = /[?&]ga_debug=1/.test(location.search);
  if (isLocal && !isDebug) return;
  window.__sipGA4Loaded = true;
  window['ga-disable-G-6J443GNZ4J'] = false;
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=G-6J443GNZ4J';
  document.head.appendChild(s);
  gtag('consent', 'update', {
    'analytics_storage': 'granted',
    'ad_storage': 'denied',
    'ad_user_data': 'denied',
    'ad_personalization': 'denied'
  });
  var cleanUrl = location.origin + location.pathname;
  try {
    var u = new URL(location.href);
    var kept = [];
    ['category', 'brand', 'item'].forEach(function(k) {
      var v = u.searchParams.get(k);
      if (v && /^[A-Za-z0-9\-_ ]{1,45}$/.test(v) && !/\d{7,}/.test(v)) {
        kept.push(encodeURIComponent(k) + '=' + encodeURIComponent(v.trim()));
      }
    });
    if (kept.length) cleanUrl += '?' + kept.join('&');
  } catch (e) {}
  var cleanRef = document.referrer ? document.referrer.split('?')[0] : '';
  gtag('js', new Date());
  gtag('config', 'G-6J443GNZ4J', {
    'anonymize_ip': true,
    'allow_google_signals': false,
    'allow_ad_personalization_signals': false,
    'page_location': cleanUrl,
    'page_referrer': cleanRef
  });
};
try {
  if (localStorage.getItem('sip_analytics_consent') === 'granted') {
    window.__loadSipGA4();
  }
} catch (e) {}
