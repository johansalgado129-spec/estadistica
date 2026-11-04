(() => {
  const slides = [...document.querySelectorAll('.slide')];
  const progress = document.getElementById('progress-bar');
  const number = document.getElementById('slideNumber');
  const prev = document.getElementById('prevButton');
  const next = document.getElementById('nextButton');
  const menu = document.getElementById('menuButton');
  const close = document.getElementById('closeDrawer');
  const drawer = document.getElementById('drawer');
  const overlay = document.getElementById('drawerOverlay');
  const list = document.getElementById('drawerList');
  const fullscreen = document.getElementById('fullscreenButton');
  const tip = document.getElementById('helpTip');
  let current = 0;
  const pad = value => String(value).padStart(2, '0');
  slides.forEach((slide, i) => {
    const item = document.createElement('button');
    item.innerHTML = `<span>${pad(i + 1)}</span><div><strong>${slide.dataset.title}</strong><small>${slide.dataset.group}</small></div>`;
    item.addEventListener('click', () => { show(i); toggleDrawer(false); });
    list.appendChild(item);
  });
  const entries = [...list.querySelectorAll('button')];
  function show(index) {
    current = Math.max(0, Math.min(slides.length - 1, index));
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === current);
      slide.classList.toggle('previous', i < current);
      slide.setAttribute('aria-hidden', i !== current);
      if (i === current) slide.scrollTop = 0;
    });
    entries.forEach((entry, i) => entry.classList.toggle('selected', i === current));
    number.textContent = `${pad(current + 1)} / ${pad(slides.length)}`;
    progress.style.width = `${100 * (current + 1) / slides.length}%`;
    prev.disabled = current === 0;
    next.disabled = current === slides.length - 1;
    window.location.hash = `diapositiva-${current + 1}`;
  }
  function toggleDrawer(open) {
    drawer.classList.toggle('open', open);
    overlay.classList.toggle('visible', open);
    drawer.setAttribute('aria-hidden', !open);
    if (open) entries[current].scrollIntoView({block:'nearest'});
  }
  function toggleFullscreen() {
    if (document.fullscreenElement) document.exitFullscreen?.();
    else document.documentElement.requestFullscreen?.();
  }
  prev.addEventListener('click', () => show(current - 1));
  next.addEventListener('click', () => show(current + 1));
  menu.addEventListener('click', () => toggleDrawer(true));
  close.addEventListener('click', () => toggleDrawer(false));
  overlay.addEventListener('click', () => toggleDrawer(false));
  fullscreen.addEventListener('click', toggleFullscreen);
  document.getElementById('dismissTip').addEventListener('click', () => tip.classList.add('hide'));
  document.addEventListener('keydown', e => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {e.preventDefault();show(current + 1);}
    if (e.key === 'ArrowLeft' || e.key === 'PageUp') {e.preventDefault();show(current - 1);}
    if (e.key === 'Home') show(0);
    if (e.key === 'End') show(slides.length - 1);
    if (e.key.toLowerCase() === 'm') toggleDrawer(!drawer.classList.contains('open'));
    if (e.key.toLowerCase() === 'f') toggleFullscreen();
    if (e.key === 'Escape') toggleDrawer(false);
  });
  let startX = null;
  document.getElementById('slides').addEventListener('touchstart', e => {startX = e.changedTouches[0].screenX;},{passive:true});
  document.getElementById('slides').addEventListener('touchend', e => {
    if (startX === null) return;
    const delta = e.changedTouches[0].screenX - startX;
    if (Math.abs(delta) > 65) show(current + (delta < 0 ? 1 : -1));
    startX = null;
  },{passive:true});
  const initial = Number((location.hash.match(/diapositiva-(\d+)/) || [])[1]);
  show(Number.isFinite(initial) && initial > 0 ? initial - 1 : 0);
  window.addEventListener('hashchange', () => {
    const match = location.hash.match(/diapositiva-(\d+)/);
    if (match && Number(match[1]) - 1 !== current) show(Number(match[1]) - 1);
  });
})();
