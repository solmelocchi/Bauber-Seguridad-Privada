/* ═══════════════════════════════════════════
   BAUBER SEGURIDAD PRIVADA — script.js
   ═══════════════════════════════════════════ */

/* Si el usuario pidió menos movimiento en su sistema, se apagan
   las animaciones decorativas (parallax, rotación, contadores, etc.) */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


/* 1. BARRA DE PROGRESO */
const pb = document.getElementById('progress-bar');
window.addEventListener('scroll', () => {
  pb.style.width = ((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100) + '%';
}, { passive: true });


/* 2. HEADER — scroll + nav activo */
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


/* 3. MOBILE MENU */
function toggleMenu() {
  const h = document.getElementById('hamburger');
  const m = document.getElementById('mobileMenu');
  h.classList.toggle('open');
  m.classList.toggle('open');
  const open = m.classList.contains('open');
  h.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
}

function closeMenu() {
  const h = document.getElementById('hamburger');
  h.classList.remove('open');
  h.setAttribute('aria-expanded', 'false');
  document.getElementById('mobileMenu').classList.remove('open');
  document.body.style.overflow = '';
}


/* 4. PARALLAX HERO */
const heroBg = document.getElementById('heroBg');
if (!reduceMotion) {
  window.addEventListener('scroll', () => {
    if (window.scrollY < window.innerHeight * 1.5) {
      heroBg.style.transform = `translateY(${window.scrollY * .4}px)`;
    }
  }, { passive: true });
}


/* 5. FRASE QUE CAMBIA (la palabra sube y se reemplaza, sin saltos de tamaño) */
(function () {
  const words = document.querySelectorAll('.hero-rotator .rot-word');
  if (words.length < 2 || reduceMotion) return;

  let i = 0;
  setInterval(() => {
    const prev = words[i];
    i = (i + 1) % words.length;
    prev.classList.remove('is-active');
    prev.classList.add('is-leaving');
    words[i].classList.add('is-active');
    setTimeout(() => prev.classList.remove('is-leaving'), 700);
  }, 3000);
})();


/* 6. SCROLL REVEAL */
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
if ('IntersectionObserver' in window && !reduceMotion) {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: .1, rootMargin: '0px 0px -50px 0px' });
  revealEls.forEach(el => obs.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('visible'));
}


/* 7. CONTADORES (el HTML ya trae el número final; acá solo se anima) */
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

if ('IntersectionObserver' in window && !reduceMotion) {
  const cobs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && e.target.dataset.target) {
        animCount(e.target);
        cobs.unobserve(e.target);
      }
    });
  }, { threshold: .5 });
  document.querySelectorAll('.stat-num[data-target]').forEach(el => cobs.observe(el));
}


/* 8. CARRUSEL */
(function () {
  const track  = document.getElementById('carouselTrack');
  if (!track) return;

  const slides = track.querySelectorAll('.carousel-slide');
  const dotsEl = document.getElementById('carrDots');
  const total  = slides.length;
  let cur = 0, timer;

  for (let i = 0; i < total; i++) {
    const d = document.createElement('button');
    d.type = 'button';
    d.className = 'carr-dot' + (i === 0 ? ' active' : '');
    d.setAttribute('aria-label', 'Ver grupo ' + (i + 1) + ' de ' + total);
    d.addEventListener('click', () => go(i));
    dotsEl.appendChild(d);
  }

  function autoplay() {
    clearInterval(timer);
    if (!reduceMotion) timer = setInterval(() => go(cur + 1), 4500);
  }

  function go(n) {
    cur = (n + total) % total;
    track.style.transform = `translateX(-${cur * 100}%)`;
    dotsEl.querySelectorAll('.carr-dot').forEach((d, i) => {
      d.classList.toggle('active', i === cur);
      d.setAttribute('aria-current', i === cur ? 'true' : 'false');
    });
    autoplay();
  }

  document.getElementById('carrPrev').addEventListener('click', () => go(cur - 1));
  document.getElementById('carrNext').addEventListener('click', () => go(cur + 1));

  let tsx = 0;
  track.addEventListener('touchstart', e => { tsx = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend',   e => {
    const dx = tsx - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 50) go(dx > 0 ? cur + 1 : cur - 1);
  });

  autoplay();
})();


/* 9. FAQ ACCORDION */
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const body = item.querySelector('.faq-body');
  const isOpen = item.classList.contains('open');

  // Cerrar todos
  document.querySelectorAll('.faq-item.open').forEach(openItem => {
    openItem.classList.remove('open');
    openItem.querySelector('.faq-body').classList.remove('open');
    openItem.querySelector('.faq-btn').setAttribute('aria-expanded', 'false');
  });

  // Abrir el clickeado si estaba cerrado
  if (!isOpen) {
    item.classList.add('open');
    body.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
  }
}


/* 10. FORMULARIO → WhatsApp */
function handleSubmit(event) {
  event.preventDefault();
  const form     = event.target;
  const nombre   = form.nombre.value.trim();
  const empresa  = form.empresa.value.trim();
  const telefono = form.telefono.value.trim();
  const email    = form.email.value.trim();
  const servicio = form.servicio.value;
  const mensaje  = form.mensaje.value.trim();

  let texto = `Hola Bauber! 👋 Los contacto desde la web.\n\n`;
  texto += `*Nombre:* ${nombre}\n`;
  if (empresa)  texto += `*Empresa / Barrio:* ${empresa}\n`;
  texto += `*WhatsApp:* ${telefono}\n`;
  if (email)    texto += `*Email:* ${email}\n`;
  texto += `*Servicio:* ${servicio}\n`;
  if (mensaje)  texto += `\n*Mensaje:* ${mensaje}`;

  window.open(`https://wa.me/542613363121?text=${encodeURIComponent(texto)}`, '_blank');

  const btn = form.querySelector('.btn-submit span');
  const orig = btn.textContent;
  btn.textContent = '✓ Abriendo WhatsApp...';
  setTimeout(() => { btn.textContent = orig; }, 3000);
}


/* 11. AÑO DEL PIE DE PÁGINA */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
