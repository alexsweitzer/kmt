document.addEventListener('DOMContentLoaded', function () {
  // Mobile menu
  var toggle = document.querySelector('.menu-toggle'), nav = document.getElementById('site-nav');
  if (toggle && nav) toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
    toggle.textContent = open ? 'Close' : 'Menu';
  });

  // Gallery lightbox
  var box = document.getElementById('lightbox');
  if (box) {
    var items = Array.prototype.slice.call(document.querySelectorAll('.gallery button'));
    var img = box.querySelector('img'), cur = 0;
    function show(i) { cur = (i + items.length) % items.length; img.src = items[cur].dataset.full; img.alt = items[cur].querySelector('img').alt; }
    items.forEach(function (b, i) { b.addEventListener('click', function () { show(i); box.showModal(); }); });
    box.querySelector('[data-prev]').addEventListener('click', function () { show(cur - 1); });
    box.querySelector('[data-next]').addEventListener('click', function () { show(cur + 1); });
    box.querySelector('[data-close]').addEventListener('click', function () { box.close(); });
    box.addEventListener('click', function (e) { if (e.target === box) box.close(); });
    document.addEventListener('keydown', function (e) {
      if (!box.open) return;
      if (e.key === 'ArrowLeft') show(cur - 1);
      if (e.key === 'ArrowRight') show(cur + 1);
    });
  }

  // Quote form: require at least one service, submit to Formspree without leaving the page
  var form = document.getElementById('quote-form');
  if (form) form.addEventListener('submit', function (e) {
    var err = form.querySelector('.form-error');
    if (!form.querySelector('input[name="services"]:checked')) {
      e.preventDefault(); err.textContent = 'Select at least one service.'; err.style.display = 'block'; return;
    }
    err.style.display = 'none';
    e.preventDefault();
    var btn = form.querySelector('button[type="submit"]');
    btn.disabled = true; btn.textContent = 'Sending…';
    fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
      .then(function (r) {
        if (!r.ok) throw new Error();
        form.innerHTML = '<div class="alert"><p><strong>Request sent.</strong></p><p>Thanks — we\u2019ll get back to you shortly. For emergencies, call us directly.</p></div>';
      })
      .catch(function () {
        btn.disabled = false; btn.textContent = 'Send request';
        err.textContent = 'Your request didn\u2019t go through. Call or email us using the details on this page.';
        err.style.display = 'block';
      });
  });
});
