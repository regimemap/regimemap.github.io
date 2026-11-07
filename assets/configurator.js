/* Regime Map Embeds: the configurator's code generator and live preview.
 * The code it writes is the code https://regimemap.com/data-api/ writes: the functions
 * between "as on /data-api/" and "end of the copy" follow the tested generator of the
 * Hugging Face demo (regimemap-embed-kit/examples/huggingface-space). Don't change them
 * without checking the result against regimemap.com/data-api/.
 */
(function () {
  'use strict';
  var d = document, form = d.getElementById('cfg-form');
  if (!form || !window.fetch || !window.Promise) return;
  var PUB = 'https://regimemap.com', ORIGIN = PUB;
  var $ = function (id) { return d.getElementById(id); };
  var paths = {}, byIso = {}, byName = {}, measureSeq = 0;
  var s = { kind: 'map', country: 'FR', region: 'world', lang: 'en', theme: 'light', code: 'script', height: 340, product: 'online_casino' };
  function val(name) { var c = form.querySelector('input[name=' + name + ']:checked'); return c ? c.value : ''; }

  /* ---- as on /data-api/ ---- */
  var EN_CODE = { code_credit_map: 'Map:', code_credit_card: 'Source:', code_title_map: 'Gambling regulation map, Regime Map', code_title_card: '{country}: gambling regulation, Regime Map',
    code_fallback_map: 'Interactive map: gambling regulation by country.', code_fallback_card: '{country}: gambling regulation by product.' };
  function pathsFor(lang) {
    if (paths[lang]) return Promise.resolve(paths[lang]);
    return fetch(ORIGIN + '/embed/v1/data/' + lang + '.json', { credentials: 'omit', referrerPolicy: 'no-referrer' }).then(function (r) { return r.json(); }).then(function (j) {
      if (!j || !j.c) throw 0;
      var p = { hub: new URL(j.map).pathname, c: {}, n: {}, t: j.t || {} };
      j.c.forEach(function (r) { if (r[0].indexOf('-') < 0) { p.c[r[0]] = r[3]; p.n[r[0]] = r[1]; } });
      return (paths[lang] = p);
    })['catch'](function () {
      var p = { hub: '/gambling-regulation-map/', c: {}, n: {}, t: {} };
      Object.keys(byIso).forEach(function (k) { p.c[k] = byIso[k][2]; });
      return p;
    });
  }
  function esc(x) { return String(x == null ? '' : x).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function tx(p, k, v) { return String((p.t && p.t[k]) || EN_CODE[k]).replace(/\{(\w+)\}/g, function (m, x) { return v && v[x] != null ? v[x] : m; }); }
  function credit(pre, href) { return '<p>' + esc(pre) + (/[　-〿＀-￯]$/.test(pre) ? '' : ' ') + '<a href="' + href + '">Regime Map</a></p>'; }
  function code(p) {
    var c = byIso[s.country], name = p.n[s.country] || (c ? c[1] : s.country);
    var hub = PUB + p.hub, dossier = PUB + (p.c[s.country] || (c && c[2]) || '/gambling-regulation-map/');
    var pa = s.product !== 'online_casino' ? ' data-product="' + s.product + '"' : '', pq = s.product !== 'online_casino' ? '&product=' + s.product : '';
    if (s.kind === 'map') return s.code === 'script'
      ? '<div data-regimemap="map"' + pa + ' data-lang="' + s.lang + '" data-region="' + s.region + '" data-theme="' + s.theme + '">' + esc(tx(p, 'code_fallback_map')) + '</div>\n' + credit(tx(p, 'code_credit_map'), hub) + '\n<script async src="' + PUB + '/embed/v1/embed.js" referrerpolicy="no-referrer"></' + 'script>'
      : '<iframe src="' + PUB + '/embed/v1/frame/map/?lang=' + s.lang + '&region=' + s.region + '&theme=' + s.theme + pq + '" title="' + esc(tx(p, 'code_title_map')) + '" loading="lazy" referrerpolicy="origin" style="width:100%;aspect-ratio:16/10;min-height:420px;border:0"></iframe>\n' + credit(tx(p, 'code_credit_map'), hub);
    return s.code === 'script'
      ? '<div data-regimemap="country" data-country="' + s.country + '" data-lang="' + s.lang + '" data-theme="' + s.theme + '">' + esc(tx(p, 'code_fallback_card', { country: name })) + '</div>\n' + credit(tx(p, 'code_credit_card'), dossier) + '\n<script async src="' + PUB + '/embed/v1/embed.js" referrerpolicy="no-referrer"></' + 'script>'
      : '<iframe src="' + PUB + '/embed/v1/frame/country/' + s.country + '/?lang=' + s.lang + '&theme=' + s.theme + '" title="' + esc(tx(p, 'code_title_card', { country: name })) + '" loading="lazy" referrerpolicy="origin" style="width:100%;height:' + s.height + 'px;border:0"></iframe>\n' + credit(tx(p, 'code_credit_card'), dossier);
  }
  /* ---- end of the copy ---- */

  function scan() { if (window.RegimeMapEmbed) window.RegimeMapEmbed.scan(); }
  // The live preview: the same embed, with the credit line in the embed's language.
  function preview(p) {
    var pv = $('cfg-preview'); pv.innerHTML = '';
    pv.setAttribute('data-kind', s.kind); pv.setAttribute('data-form', s.code);
    var cr = d.createElement('p'), a = d.createElement('a'), pre = tx(p, s.kind === 'map' ? 'code_credit_map' : 'code_credit_card');
    a.href = s.kind === 'map' ? PUB + p.hub : PUB + (p.c[s.country] || '/gambling-regulation-map/'); a.textContent = 'Regime Map';
    cr.appendChild(d.createTextNode(pre + (/[　-〿＀-￯]$/.test(pre) ? '' : ' '))); cr.appendChild(a);
    var name = p.n[s.country] || (byIso[s.country] || [0, s.country])[1];
    if (s.code === 'iframe') {
      var f = d.createElement('iframe');
      f.src = ORIGIN + (s.kind === 'map'
        ? '/embed/v1/frame/map/?lang=' + s.lang + '&region=' + s.region + '&theme=' + s.theme + (s.product !== 'online_casino' ? '&product=' + s.product : '')
        : '/embed/v1/frame/country/' + s.country + '/?lang=' + s.lang + '&theme=' + s.theme);
      f.title = s.kind === 'map' ? tx(p, 'code_title_map') : tx(p, 'code_title_card', { country: name });
      f.loading = 'lazy'; f.referrerPolicy = 'origin'; f.style.width = '100%'; f.style.border = '0';
      if (s.kind === 'map') { f.style.aspectRatio = '16/10'; f.style.minHeight = '420px'; } else f.style.height = s.height + 'px';
      pv.appendChild(f);
    } else {
      var el = d.createElement('div');
      el.setAttribute('data-regimemap', s.kind); el.setAttribute('data-lang', s.lang); el.setAttribute('data-theme', s.theme);
      if (s.kind === 'map') { el.setAttribute('data-region', s.region); el.setAttribute('data-product', s.product); } else el.setAttribute('data-country', s.country);
      el.textContent = s.kind === 'map' ? tx(p, 'code_fallback_map') : tx(p, 'code_fallback_card', { country: name });
      pv.appendChild(el);
    }
    pv.appendChild(cr);
    scan();
  }
  // A card iframe has a fixed height: render the card at 360 px, hidden, and read it (as on /data-api/).
  function measure(p) {
    if (s.kind !== 'country' || s.code !== 'iframe') return;
    var seq = ++measureSeq, box = $('cfg-measure');
    if (!box) {
      box = d.createElement('div'); box.id = 'cfg-measure'; box.setAttribute('aria-hidden', 'true');
      // In the viewport (fixed, hidden, behind the page): the loader only renders embeds that intersect it.
      box.style.position = 'fixed'; box.style.left = '0'; box.style.top = '0'; box.style.width = '360px'; box.style.visibility = 'hidden';
      box.style.pointerEvents = 'none'; box.style.zIndex = '-1';
      d.body.appendChild(box);
    }
    box.innerHTML = '';
    var el = d.createElement('div');
    el.setAttribute('data-regimemap', 'country'); el.setAttribute('data-country', s.country); el.setAttribute('data-lang', s.lang); el.setAttribute('data-theme', s.theme);
    var cr = d.createElement('p'), a = d.createElement('a'); a.href = PUB + (p.c[s.country] || '/'); a.textContent = 'Regime Map'; cr.appendChild(a);
    box.appendChild(el); box.appendChild(cr); scan();
    var tries = 0;
    (function poll() {
      if (seq !== measureSeq) return;
      var r = el.shadowRoot, done = r && r.querySelector('.cf .go, .msg');
      if (done) {
        var h = Math.ceil(el.getBoundingClientRect().height);
        if (h > 100 && h !== s.height) { s.height = h; show(p); var f = $('cfg-preview').querySelector('iframe'); if (f) f.style.height = h + 'px'; }
        box.innerHTML = ''; return;
      }
      if (++tries < 60) setTimeout(poll, 100);
    })();
  }
  function label(sel) { var o = sel && sel.options[sel.selectedIndex]; return o ? o.textContent : ''; }
  function show(p) {
    var el = $('cfg-code'); el.textContent = code(p);
    if (window.RegimeMapSite) window.RegimeMapSite.highlight(el);
  }
  function status(p) {
    var st = $('cfg-status'); if (!st) return;
    var what = s.kind === 'map' ? label($('cfg-product')) + ' · ' + label($('cfg-region')) : (p.n[s.country] || (byIso[s.country] || [0, s.country])[1]);
    var th = (form.querySelector('input[name=theme]:checked') || {}).parentNode;
    st.textContent = what + ' · ' + label($('cfg-lang')) + ' · ' + (th ? th.textContent.trim() : s.theme) + ' · ' + (s.code === 'iframe' ? 'iframe' : 'script');
  }
  function countryIso() {
    var inp = $('cfg-country'), v = (inp.value || '').trim().toLowerCase();
    if (byName[v]) { inp.setAttribute('data-iso', byName[v]); return byName[v]; }
    return inp.getAttribute('data-iso') || 'FR';
  }
  function render() {
    s.kind = val('kind') || 'map'; s.theme = val('theme') || 'light'; s.code = val('form') || 'script';
    s.region = $('cfg-region').value; s.product = $('cfg-product').value; s.lang = $('cfg-lang').value; s.country = countryIso();
    pathsFor(s.lang).then(function (p) { show(p); status(p); preview(p); measure(p); });
  }
  // The country list: the English data file's rows (ISO, name, …, dossier path), A to Z.
  pathsFor('en').then(function (p) {
    var list = Object.keys(p.n).map(function (k) { return [k, p.n[k], p.c[k]]; }).sort(function (a, b) { return a[1].localeCompare(b[1], 'en'); });
    if (list.length) {
      byIso = {}; byName = {};
      list.forEach(function (r) { byIso[r[0]] = r; byName[r[1].toLowerCase()] = r[0]; });
      $('cfg-countries').innerHTML = list.map(function (r) { return '<option value="' + esc(r[1]) + '" data-iso="' + r[0] + '"></option>'; }).join('');
    }
    render();
  });
  // Before the data arrives, the static list in the page maps names to codes.
  [].forEach.call(d.querySelectorAll('#cfg-countries option'), function (o) { byName[o.value.toLowerCase()] = o.getAttribute('data-iso'); });
  form.addEventListener('change', render);
  $('cfg-country').addEventListener('input', function () { if (byName[(this.value || '').trim().toLowerCase()]) render(); });
})();
