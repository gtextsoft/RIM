/* Mobile hamburger menu toggle */
var navToggle = document.getElementById('navToggle');
var mainNav = document.getElementById('mainNav');

function closeNav() {
  if (!navToggle || !mainNav) return;
  navToggle.classList.remove('is-open');
  mainNav.classList.remove('is-open');
  navToggle.setAttribute('aria-expanded', 'false');
}

if (navToggle && mainNav) {
  navToggle.addEventListener('click', function () {
    var isOpen = mainNav.classList.toggle('is-open');
    navToggle.classList.toggle('is-open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  /* Close when a nav link is clicked */
  mainNav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeNav);
  });

  /* Close when clicking outside */
  document.addEventListener('click', function (e) {
    if (!mainNav.contains(e.target) && !navToggle.contains(e.target)) {
      closeNav();
    }
  });
}

/* Testimonials columns - duplicate content and set animation duration */
const columns = document.querySelectorAll('.testimonials-column');

columns.forEach(function (col) {
  const speed = col.dataset.speed || 20;
  col.style.animationDuration = speed + 's';
  col.innerHTML += col.innerHTML; /* duplicate for infinite scroll */
});

/* Retro grid angle */
const retroGrid = document.getElementById('retroGrid');

function setGridAngle(angle) {
  if (retroGrid) retroGrid.style.setProperty('--grid-angle', angle + 'deg');
}

setGridAngle(60);

/* Main navigation: smooth scroll and active state on click */
const navItems = document.getElementById('navItems');
const links = navItems ? [...navItems.querySelectorAll('a')] : [];

links.forEach(function (link) {
  link.addEventListener('click', function (e) {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      links.forEach(function (l) {
        l.classList.remove('active');
      });
      link.classList.add('active');
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
});

/* Scroll spy: set active nav link based on visible section */
const sectionIds = ['home', 'program', 'learn', 'contact'];
const sectionEls = sectionIds
  .map(function (id) {
    return document.getElementById(id);
  })
  .filter(Boolean);

function updateActiveNav() {
  const scrollY = window.scrollY;
  const viewportMid = scrollY + window.innerHeight * 0.35;

  let activeId = 'home';
  sectionEls.forEach(function (el) {
    const id = el.id;
    const top = el.offsetTop;
    const height = el.offsetHeight;
    if (viewportMid >= top && viewportMid < top + height) {
      activeId = id;
    }
  });

  links.forEach(function (link) {
    const href = link.getAttribute('href');
    const id = href ? href.slice(1) : '';
    if (id === activeId) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

window.addEventListener('scroll', function () {
  requestAnimationFrame(updateActiveNav);
});
updateActiveNav();

/* Scroll reveal: add .is-visible when section enters viewport */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  },
  { rootMargin: '0px 0px -60px 0px', threshold: 0.05 }
);

revealEls.forEach(function (el) {
  revealObserver.observe(el);
});

/* Hero in view on load: ensure entrance animation runs */
var heroSection = document.getElementById('home');
if (heroSection && heroSection.classList.contains('reveal')) {
  var rect = heroSection.getBoundingClientRect();
  if (rect.top < window.innerHeight * 0.9) {
    heroSection.classList.add('is-visible');
  }
}

/* Particle button effect for all .btn-particle */
var particleDuration = 600;
var particleCount = 6;

function createParticles(el) {
  var rect = el.getBoundingClientRect();
  var centerX = rect.left + rect.width / 2;
  var centerY = rect.top + rect.height / 2;

  for (var i = 0; i < particleCount; i++) {
    var particle = document.createElement('div');
    particle.className = 'btn-particle-burst';
    var tx = (i % 2 ? 1 : -1) * (Math.random() * 50 + 20);
    var ty = -Math.random() * 50 - 20;
    particle.style.left = centerX + 'px';
    particle.style.top = centerY + 'px';
    particle.style.setProperty('--px-tx', tx + 'px');
    particle.style.setProperty('--px-ty', ty + 'px');
    particle.style.background = el.classList.contains('btn-outline')
      ? 'var(--color-accent)'
      : 'var(--color-text)';
    particle.style.animationDelay = i * 0.05 + 's';
    document.body.appendChild(particle);
    setTimeout(function (p) {
      if (p.parentNode) p.parentNode.removeChild(p);
    }, particleDuration + (particleCount * 50) + 150, particle);
  }
}

document.querySelectorAll('.btn-particle').forEach(function (btn) {
  btn.addEventListener('click', function (e) {
    if (btn.getAttribute('href') === '#') e.preventDefault();
    btn.classList.add('is-clicked');
    createParticles(btn);
    setTimeout(function () {
      btn.classList.remove('is-clicked');
    }, 120);
  });
});

/* FAQ accordion */
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(function (item) {
  const btn = item.querySelector('.faq-question');
  if (!btn) return;

  btn.addEventListener('click', function () {
    item.classList.toggle('is-open');
    faqItems.forEach(function (other) {
      if (other !== item) {
        other.classList.remove('is-open');
        var otherBtn = other.querySelector('.faq-question');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
      }
    });
    btn.setAttribute('aria-expanded', item.classList.contains('is-open'));
  });
});
