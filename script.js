/* ═══════════════════════════════════════════
   BAUBER SEGURIDAD PRIVADA — script.js
   ═══════════════════════════════════════════ */

/* 1. CURSOR */
const dot  = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  dot.style.left = mx + 'px';
  dot.style.top  = my + 'px';
});

(function animCursor() {
  rx += (mx - rx) * .12;
  ry += (my - ry) * .12;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(animCursor);
})();

document.querySelectorAll('a, button, .serv-card, .pilar, .client-card, .faq-item')
  .forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });


/* 2. BARRA DE PROGRESO */
const pb = document.getElementById('progress-bar');
window.addEventListener('scroll', () => {
  pb.style.width = ((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100) + '%';
}, { passive: true });


/* 3. HEADER — scroll + nav activo */
const hdr = document.getElementById('header');
window.addEventListener('scroll', () => {
  hdr.classList.toggle('scrolled', window.scrollY > 60);

  let cur = '';
  document.querySelectorAll('section[id]').forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) cur = s.id;
  });
  document.querySelectorAll('.nav a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + cur);
  });
}, { passive: true });


/* 4. MOBILE MENU */
function toggleMenu() {
  const h = document.getElementById('hamburger');
  const m = document.getElementById('mobileMenu');
  h.classList.toggle('open');
  m.classList.toggle('open');
  document.body.style.overflow = m.classList.contains('open') ? 'hidden' : '';
}

function closeMenu() {
  document.getElementById('hamburger').classList.remove('open');
  const m = document.getElementById('mobileMenu');
  m.classList.remove('open');
  document.body.style.overflow = '';
}


/* 5. PARALLAX HERO */
const heroBg = document.getElementById('heroBg');
window.addEventListener('scroll', () => {
  if (window.scrollY < window.innerHeight * 1.5) {
    heroBg.style.transform = `translateY(${window.scrollY * .4}px)`;
  }
}, { passive: true });


/* 6. PARTÍCULAS */
(function () {
  const c = document.getElementById('heroParticles');
  if (!c) return;
  for (let i = 0; i < 18; i++) {
    const s = document.createElement('span');
    s.style.cssText = `left:${Math.random() * 100}%;height:${40 + Math.random() * 120}px;animation-duration:${6 + Math.random() * 12}s;animation-delay:${Math.random() * 10}s;opacity:${.1 + Math.random() * .25}`;
    c.appendChild(s);
  }
})();


/* 7. TYPEWRITER */
(function () {
  const el = document.getElementById('typewriter-text');
  if (!el) return;

  const phrases = ['Excelencia en', 'Confianza en', 'Protección en', 'Profesionales en'];
  let pi = 0, ci = 0, del = false, pause = false;

  function tick() {
    const p = phrases[pi];
    if (!del) {
      el.textContent = p.slice(0, ci + 1);
      ci++;
      if (ci === p.length) {
        pause = true;
        setTimeout(() => { pause = false; del = true; tick(); }, 2200);
        return;
      }
    } else {
      el.textContent = p.slice(0, ci - 1);
      ci--;
      if (ci === 0) { del = false; pi = (pi + 1) % phrases.length; }
    }
    if (!pause) setTimeout(tick, del ? 60 : 110);
  }
  setTimeout(tick, 800);
})();


/* 8. SCROLL REVEAL */
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      obs.unobserve(e.target);
    }
  });
}, { threshold: .1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => obs.observe(el));


/* 9. CONTADORES */
function animCount(el) {
  const tgt = parseInt(el.dataset.target);
  const sfx = el.dataset.suffix || '';
  if (isNaN(tgt)) return;

  let start = 0;
  const step = ts => {
    if (!start) start = ts;
    const prog = Math.min((ts - start) / 1800, 1);
    const ease = 1 - Math.pow(1 - prog, 3);
    el.textContent = Math.floor(ease * tgt) + sfx;
    if (prog < 1) requestAnimationFrame(step);
    else el.textContent = tgt + sfx;
  };
  requestAnimationFrame(step);
}

const cobs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting && e.target.dataset.target) {
      animCount(e.target);
      cobs.unobserve(e.target);
    }
  });
}, { threshold: .5 });

document.querySelectorAll('.stat-num[data-target]').forEach(el => cobs.observe(el));


/* 10. CARRUSEL */
(function () {
  const track  = document.getElementById('carouselTrack');
  if (!track) return;

  const slides = track.querySelectorAll('.carousel-slide');
  const dotsEl = document.getElementById('carrDots');
  const total  = slides.length;
  let cur = 0, timer;

  for (let i = 0; i < total; i++) {
    const d = document.createElement('button');
    d.className = 'carr-dot' + (i === 0 ? ' active' : '');
    d.setAttribute('aria-label', 'Slide ' + (i + 1));
    d.addEventListener('click', () => go(i));
    dotsEl.appendChild(d);
  }

  function go(n) {
    cur = (n + total) % total;
    track.style.transform = `translateX(-${cur * 100}%)`;
    dotsEl.querySelectorAll('.carr-dot').forEach((d, i) => d.classList.toggle('active', i === cur));
    clearInterval(timer);
    timer = setInterval(() => go(cur + 1), 4500);
  }

  document.getElementById('carrPrev').addEventListener('click', () => go(cur - 1));
  document.getElementById('carrNext').addEventListener('click', () => go(cur + 1));

  let tsx = 0;
  track.addEventListener('touchstart', e => { tsx = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend',   e => {
    const dx = tsx - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 50) go(dx > 0 ? cur + 1 : cur - 1);
  });

  timer = setInterval(() => go(cur + 1), 4500);
})();


/* 11. FAQ ACCORDION */
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const body = item.querySelector('.faq-body');
  const isOpen = item.classList.contains('open');

  // Cerrar todos
  document.querySelectorAll('.faq-item.open').forEach(openItem => {
    openItem.classList.remove('open');
    openItem.querySelector('.faq-body').classList.remove('open');
  });

  // Abrir el clickeado si estaba cerrado
  if (!isOpen) {
    item.classList.add('open');
    body.classList.add('open');
  }
}


/* 12. FORMULARIO → WhatsApp */
function handleSubmit(e) {
  e.preventDefault();
  const d   = new FormData(e.target);
  const txt = `Hola! Me contacto desde el sitio web.\n\n*Nombre:* ${d.get('nombre')}\n*Servicio:* ${d.get('servicio')}\n*Teléfono:* ${d.get('telefono')}${d.get('mensaje') ? '\n*Mensaje:* ' + d.get('mensaje') : ''}`;
  window.open(`https://wa.me/542613363121?text=${encodeURIComponent(txt)}`, '_blank');

  const msg = document.getElementById('formMsg');
  msg.style.display = 'block';
  msg.textContent   = '¡Consulta enviada! Abriendo WhatsApp...';
  e.target.reset();
  setTimeout(() => { msg.style.display = 'none'; }, 4000);
}
