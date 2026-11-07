/* Regime Map Embeds: progressive enhancement only. Every page works without this file. */
(function () {
  "use strict";
  var d = document;
  /* copy buttons: <button class="copy" data-copy="#id"> copies the text of #id */
  d.addEventListener("click", function (e) {
    var b = e.target.closest("[data-copy]"); if (!b) return;
    var src = d.querySelector(b.getAttribute("data-copy")); if (!src) return;
    var text = src.textContent, done = function () {
      b.setAttribute("data-copied", ""); var live = b.querySelector(".sr-live"); if (live) live.textContent = b.getAttribute("data-copied-label") || "Copied";
      clearTimeout(b._t); b._t = setTimeout(function () { b.removeAttribute("data-copied"); if (live) live.textContent = ""; }, 2500);
    };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, function () { fallback(text); done(); });
    else { fallback(text); done(); }
  });
  function fallback(t) { var a = d.createElement("textarea"); a.value = t; a.setAttribute("readonly", ""); a.style.position = "fixed"; a.style.opacity = "0"; d.body.appendChild(a); a.select(); try { d.execCommand("copy"); } catch (x) {} a.remove(); }
  /* configurator: show the fields for the chosen kind (UI only; code generation is wired separately) */
  var form = d.getElementById("cfg-form");
  if (form) {
    var sync = function () {
      var k = (form.querySelector("input[name=kind]:checked") || {}).value || "map";
      [].forEach.call(form.querySelectorAll("[data-for]"), function (el) { el.hidden = el.getAttribute("data-for") !== k; });
      var st = d.getElementById("cfg-preview"); if (st) st.setAttribute("data-kind", k);
      var f = (form.querySelector("input[name=form]:checked") || {}).value; if (st && f) st.setAttribute("data-form", f);
    };
    form.addEventListener("change", sync); sync();
  }
  /* syntax colouring for HTML code blocks; call after replacing a block's text */
  function esc(s) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function highlight(el) {
    var s = el.textContent, o = "", i = 0;
    while (i < s.length) {
      if (s[i] === "<") {
        var k = s.indexOf(">", i), m = k > 0 && s.slice(i, k + 1).match(/^<(\/?)([\w-]+)([\s\S]*?)(\/?)>$/);
        if (m) {
          o += '<span class="t-pun">&lt;' + m[1] + '</span><span class="t-tag">' + m[2] + "</span>" + m[3].replace(/([\w:-]+)(?:(=)("[^"]*"))?|(\s+)/g, function (z, a, eq, v, ws) { return ws ? ws : '<span class="t-attr">' + a + "</span>" + (eq ? '<span class="t-pun">=</span><span class="t-str">' + esc(v) + "</span>" : ""); }) + '<span class="t-pun">' + m[4] + "&gt;</span>";
          i = k + 1; continue;
        }
      }
      var n = s.indexOf("<", i + 1); if (n < 0) n = s.length; o += esc(s.slice(i, n)); i = n;
    }
    el.innerHTML = o;
  }
  window.RegimeMapSite = { highlight: highlight };
  /* table of contents highlight */
  var links = [].slice.call(d.querySelectorAll(".toc a[href^='#']"));
  if (links.length && "IntersectionObserver" in window) {
    var secs = links.map(function (a) { return d.getElementById(a.getAttribute("href").slice(1)); }).filter(Boolean), vis = {};
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (x) { vis[x.target.id] = x.isIntersecting; });
      for (var i = 0; i < secs.length; i++) if (vis[secs[i].id]) { links.forEach(function (a) { if (a.getAttribute("href") === "#" + secs[i].id) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current"); }); return; }
    }, { rootMargin: "-15% 0px -75% 0px" });
    secs.forEach(function (s) { io.observe(s); });
  }
  /* menus close on Esc / outside click */
  d.addEventListener("click", function (e) { [].forEach.call(d.querySelectorAll("details.menu[open]"), function (m) { if (!m.contains(e.target)) m.open = false; }); });
  d.addEventListener("keydown", function (e) { if (e.key !== "Escape") return; var m = d.querySelector("details.menu[open]"); if (m) { m.open = false; m.querySelector("summary").focus(); } });
  /* #faq-N opens the answer */
  function openHash() { var t = location.hash && d.getElementById(location.hash.slice(1)); if (t && t.tagName === "DETAILS") t.open = true; }
  window.addEventListener("hashchange", openHash); openHash();
})();
