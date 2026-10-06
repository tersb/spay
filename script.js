/* file: script.js */

// ---------- 1. Флаги устройства ----------
const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
const isNarrow = window.matchMedia('(max-width: 899px)').matches;
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isDesktop = !isTouch && !isNarrow;

// ---------- 2. Появление при скролле ----------
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      entry.target.style.setProperty('--delay', delay + 'ms');
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -30px 0px'
});

revealElements.forEach((el) => revealObserver.observe(el));

// ---------- 3. Параллакс — ТОЛЬКО на ПК ----------
if (isDesktop && !prefersReduced) {
  const orbs = document.querySelectorAll('.bg-orb');
  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;
  let rafId = null;

  window.addEventListener('mousemove', (e) => {
    targetX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    if (rafId === null) rafId = requestAnimationFrame(tick);
  }, { passive: true });

  function tick() {
    mouseX += (targetX - mouseX) * 0.05;
    mouseY += (targetY - mouseY) * 0.05;

    orbs.forEach((orb, i) => {
      const depth = (i + 1) * 14;
      orb.style.transform = `translate3d(${mouseX * depth}px, ${mouseY * depth}px, 0)`;
    });

    // останавливаем цикл когда почти достигли цели
    if (Math.abs(targetX - mouseX) > 0.001 || Math.abs(targetY - mouseY) > 0.001) {
      rafId = requestAnimationFrame(tick);
    } else {
      rafId = null;
    }
  }
}

// ---------- 4. Мягкое появление страницы ----------
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  requestAnimationFrame(() => {
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '1';
  });
});

// ---------- 5. Плавный скролл к якорям ----------
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href');
    if (id === '#' || id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.pageYOffset - 24;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ---------- 6. Пульсация бейджа Beta (только ПК) ----------
const beta = document.querySelector('.beta-badge');
if (beta && isDesktop && !prefersReduced) {
  let phase = 0;
  setInterval(() => {
    phase = (phase + 1) % 2;
    beta.style.transform = phase ? 'scale(1.05)' : 'scale(1)';
    beta.style.transition = 'transform 0.9s ease-in-out';
  }, 1400);
}