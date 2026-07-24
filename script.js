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

/* Testimonials columns - legacy scroll removed; results grid is static */

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

/* ── Registration Modal ── */
(function () {
  const overlay     = document.getElementById('registerModal');
  const closeBtn    = document.getElementById('modalClose');
  const successPane = document.getElementById('modalSuccess');
  const bodyPane    = document.getElementById('modalBody');
  const form        = document.getElementById('registerForm');
  const submitBtn   = document.getElementById('formSubmitBtn');
  const successClose = document.getElementById('modalSuccessClose');

  function openModal() {
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    // Reset to form view each time
    bodyPane.hidden   = false;
    successPane.hidden = true;
  }

  function closeModal() {
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  // Open on any [data-register] click
  document.querySelectorAll('[data-register]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      openModal();
    });
  });

  // Close button & backdrop click
  closeBtn.addEventListener('click', closeModal);
  successClose.addEventListener('click', closeModal);
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeModal();
  });

  // Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) closeModal();
  });

  // Form submission via fetch (Formspree)
  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Basic required-field validation
    let valid = true;
    form.querySelectorAll('[required]').forEach(function (field) {
      field.classList.remove('is-error');
      if (!field.value.trim()) {
        field.classList.add('is-error');
        valid = false;
      }
    });
    if (!valid) return;

    // Loading state
    submitBtn.classList.add('is-loading');
    submitBtn.disabled = true;

    try {
      const data = new FormData(form);
      const res  = await fetch(form.action, {
        method:  'POST',
        body:    data,
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        bodyPane.hidden    = true;
        successPane.hidden = false;
        form.reset();
      } else {
        const json = await res.json().catch(() => ({}));
        alert(json.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      alert('Network error. Please check your connection and try again.');
    } finally {
      submitBtn.classList.remove('is-loading');
      submitBtn.disabled = false;
    }
  });

  // Clear error state on input
  form.querySelectorAll('input, select').forEach(function (field) {
    field.addEventListener('input', function () {
      field.classList.remove('is-error');
    });
  });
}());

/* USD checkout → on-page Naira fallback (failed / declined international cards) */
(function () {
  var fallback = document.getElementById('paymentFallback');
  var dismiss = document.getElementById('paymentFallbackDismiss');
  if (!fallback) return;

  function showFallback() {
    fallback.hidden = false;
    fallback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.querySelectorAll('[data-usd-checkout]').forEach(function (link) {
    link.addEventListener('click', function () {
      // Stripe opens in a new tab; keep this page and surface Naira recovery
      setTimeout(showFallback, 400);
    });
  });

  if (dismiss) {
    dismiss.addEventListener('click', function () {
      fallback.hidden = true;
    });
  }
}());

/* Video side-slider: muted autoplay, click to listen, auto-advance on end */
(function () {
  var slider = document.getElementById('videoSlider');
  var track = document.getElementById('videoTrack');
  var dotsWrap = document.getElementById('videoDots');
  var prevBtn = document.getElementById('videoPrev');
  var nextBtn = document.getElementById('videoNext');
  if (!slider || !track) return;

  var slides = Array.prototype.slice.call(track.querySelectorAll('.video-slide'));
  var viewport = slider.querySelector('.video-slider-viewport');
  var index = 0;
  var startX = 0;
  var deltaX = 0;
  var dragging = false;
  var player = null;
  var wantMuted = true;
  var advancing = false;
  var apiReady = false;
  var booted = false;
  var pendingStart = null;
  var useFallback = false;
  var started = false;

  function setUnmuteVisible(slide, visible) {
    var btn = slide.querySelector('.video-unmute');
    if (!btn) return;
    btn.classList.toggle('is-hidden', !visible);
    if (visible) {
      var label = btn.querySelector('span:last-child');
      if (label) label.textContent = 'Click to listen';
      var icon = btn.querySelector('.video-unmute-icon');
      if (icon) icon.textContent = '🔇';
    }
  }

  function markPlaying(slide, playing) {
    var embed = slide.querySelector('.video-embed');
    if (embed) embed.classList.toggle('is-playing', !!playing);
  }

  function destroyPlayer() {
    if (!player) return;
    try {
      if (typeof player.destroy === 'function') player.destroy();
    } catch (e) { /* ignore */ }
    player = null;
  }

  function clearMedia(slide) {
    var embed = slide.querySelector('.video-embed');
    if (!embed) return;
    Array.prototype.slice.call(embed.querySelectorAll('iframe, .video-host')).forEach(function (el) {
      el.remove();
    });
  }

  function remountHost(slide, i) {
    var embed = slide.querySelector('.video-embed');
    clearMedia(slide);
    var host = document.createElement('div');
    host.className = 'video-host';
    host.id = 'rbm-yt-' + i;
    var btn = slide.querySelector('.video-unmute');
    if (btn) embed.insertBefore(host, btn);
    else embed.appendChild(host);
    return host;
  }

  function embedUrl(id, muted) {
    var params = [
      'autoplay=1',
      'mute=' + (muted ? '1' : '0'),
      'playsinline=1',
      'rel=0',
      'modestbranding=1',
      'controls=1'
    ];
    var origin = window.location.origin;
    if (origin && /^https?:/.test(origin)) {
      params.push('origin=' + encodeURIComponent(origin));
      params.push('enablejsapi=1');
    }
    return 'https://www.youtube-nocookie.com/embed/' + id + '?' + params.join('&');
  }

  function createFallbackPlayer(slide, muted) {
    var id = slide.getAttribute('data-yt');
    var i = slides.indexOf(slide);
    if (!id || i < 0) return;

    destroyPlayer();
    slides.forEach(function (s, n) {
      if (n === i) return;
      markPlaying(s, false);
      setUnmuteVisible(s, true);
      clearMedia(s);
    });

    wantMuted = muted !== false;
    setUnmuteVisible(slide, wantMuted);
    clearMedia(slide);

    var iframe = document.createElement('iframe');
    iframe.id = 'rbm-yt-' + i;
    iframe.className = 'video-host';
    iframe.title = 'Testimony video';
    iframe.src = embedUrl(id, wantMuted);
    iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');

    var embed = slide.querySelector('.video-embed');
    var btn = slide.querySelector('.video-unmute');
    if (btn) embed.insertBefore(iframe, btn);
    else embed.appendChild(iframe);

    // Reveal as soon as the iframe is in the DOM
    markPlaying(slide, true);
  }

  function createApiPlayer(slide, muted) {
    var id = slide.getAttribute('data-yt');
    var i = slides.indexOf(slide);
    if (!id || i < 0 || !window.YT || !window.YT.Player) {
      createFallbackPlayer(slide, muted);
      return;
    }

    destroyPlayer();
    slides.forEach(function (s, n) {
      if (n === i) return;
      markPlaying(s, false);
      setUnmuteVisible(s, true);
      clearMedia(s);
    });

    remountHost(slide, i);
    markPlaying(slide, false);
    wantMuted = muted !== false;
    setUnmuteVisible(slide, wantMuted);

    var vars = {
      autoplay: 1,
      mute: wantMuted ? 1 : 0,
      controls: 1,
      playsinline: 1,
      rel: 0,
      modestbranding: 1
    };
    var origin = window.location.origin;
    if (origin && /^https?:/.test(origin)) {
      vars.origin = origin;
    }

    player = new YT.Player('rbm-yt-' + i, {
      videoId: id,
      width: '100%',
      height: '100%',
      playerVars: vars,
      events: {
        onReady: function (e) {
          markPlaying(slide, true);
          try {
            if (wantMuted) e.target.mute();
            else e.target.unMute();
            e.target.playVideo();
          } catch (err) { /* ignore */ }
        },
        onError: function () {
          useFallback = true;
          createFallbackPlayer(slide, wantMuted);
        },
        onStateChange: function (e) {
          if (e.data === YT.PlayerState.PLAYING) {
            markPlaying(slide, true);
          }
          if (e.data === YT.PlayerState.ENDED) {
            if (advancing) return;
            advancing = true;
            var keepSound = false;
            try {
              keepSound = player && typeof player.isMuted === 'function' ? !player.isMuted() : !wantMuted;
            } catch (err) {
              keepSound = !wantMuted;
            }
            setTimeout(function () {
              advancing = false;
              goTo(index + 1, keepSound);
            }, 350);
          }
        }
      }
    });
  }

  function createPlayer(slide, muted) {
    if (useFallback || !apiReady) {
      createFallbackPlayer(slide, muted);
      return;
    }
    createApiPlayer(slide, muted);
  }

  function loadPlayer(slide, muted) {
    if (!started) {
      pendingStart = { slide: slide, muted: muted };
      return;
    }
    if (!useFallback && !apiReady) {
      pendingStart = { slide: slide, muted: muted };
      return;
    }
    createPlayer(slide, muted);
  }

  function goTo(i, keepSound) {
    if (!started) startPlayback();
    index = (i + slides.length) % slides.length;
    track.style.transform = 'translateX(-' + (index * 100) + '%)';
    slides.forEach(function (s, n) {
      s.classList.toggle('is-active', n === index);
    });
    if (dotsWrap) {
      Array.prototype.forEach.call(dotsWrap.children, function (dot, n) {
        dot.classList.toggle('is-active', n === index);
        dot.setAttribute('aria-selected', n === index ? 'true' : 'false');
      });
    }
    slider.setAttribute('data-index', String(index));
    loadPlayer(slides[index], keepSound ? false : true);
  }

  if (dotsWrap) {
    slides.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'video-dot' + (i === 0 ? ' is-active' : '');
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', 'Go to video ' + (i + 1) + ' of ' + slides.length);
      dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      dot.addEventListener('click', function () { goTo(i); });
      dotsWrap.appendChild(dot);
    });
  }

  if (prevBtn) prevBtn.addEventListener('click', function () { goTo(index - 1); });
  if (nextBtn) nextBtn.addEventListener('click', function () { goTo(index + 1); });

  slides.forEach(function (slide, i) {
    var btn = slide.querySelector('.video-unmute');
    if (!btn) return;
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (!started) startPlayback();
      if (i !== index) {
        goTo(i, true);
        return;
      }
      wantMuted = false;
      setUnmuteVisible(slide, false);
      try {
        if (player && typeof player.unMute === 'function') {
          player.unMute();
          player.setVolume(100);
          player.playVideo();
          return;
        }
      } catch (err) { /* fall through */ }
      // Fallback iframes cannot unmute via API — reload with sound
      loadPlayer(slide, false);
    });
  });

  function onStart(x) {
    dragging = true;
    startX = x;
    deltaX = 0;
    track.style.transition = 'none';
  }

  function onMove(x) {
    if (!dragging) return;
    deltaX = x - startX;
    var base = -index * viewport.offsetWidth;
    track.style.transform = 'translateX(' + (base + deltaX) + 'px)';
  }

  function onEnd() {
    if (!dragging) return;
    dragging = false;
    track.style.transition = '';
    if (Math.abs(deltaX) > 50) {
      goTo(deltaX < 0 ? index + 1 : index - 1);
    } else {
      track.style.transform = 'translateX(-' + (index * 100) + '%)';
    }
  }

  viewport.addEventListener('touchstart', function (e) { onStart(e.touches[0].clientX); }, { passive: true });
  viewport.addEventListener('touchmove', function (e) { onMove(e.touches[0].clientX); }, { passive: true });
  viewport.addEventListener('touchend', onEnd);
  viewport.addEventListener('mousedown', function (e) {
    if (e.target.closest('.video-unmute')) return;
    onStart(e.clientX);
  });
  window.addEventListener('mousemove', function (e) { onMove(e.clientX); });
  window.addEventListener('mouseup', onEnd);

  slider.setAttribute('tabindex', '0');
  slider.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(index - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(index + 1); }
  });

  function flushPending() {
    if (pendingStart) {
      createPlayer(pendingStart.slide, pendingStart.muted);
      pendingStart = null;
    } else if (started) {
      goTo(index, !wantMuted);
    }
  }

  function bootApi() {
    if (booted) return;
    booted = true;
    apiReady = !!(window.YT && window.YT.Player);
    if (!apiReady) useFallback = true;
    flushPending();
  }

  function startPlayback() {
    if (started) return;
    started = true;
    if (!pendingStart) pendingStart = { slide: slides[index], muted: true };
    if (apiReady || useFallback) flushPending();
  }

  var prevReady = window.onYouTubeIframeAPIReady;
  window.onYouTubeIframeAPIReady = function () {
    if (typeof prevReady === 'function') prevReady();
    bootApi();
  };

  if (window.YT && window.YT.Player) {
    bootApi();
  } else if (!document.getElementById('rbm-youtube-api')) {
    var tag = document.createElement('script');
    tag.id = 'rbm-youtube-api';
    tag.src = 'https://www.youtube.com/iframe_api';
    tag.onerror = function () {
      useFallback = true;
      bootApi();
    };
    document.head.appendChild(tag);
  }

  // If API never arrives, fall back to plain embeds
  setTimeout(function () {
    if (!booted) {
      if (window.YT && window.YT.Player) bootApi();
      else {
        useFallback = true;
        bootApi();
      }
    }
  }, 2500);

  // Start when the testimonials section is near the viewport
  var section = document.getElementById('testimonials');
  if ('IntersectionObserver' in window && section) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          startPlayback();
          io.disconnect();
        }
      });
    }, { rootMargin: '200px 0px', threshold: 0.15 });
    io.observe(section);
  } else {
    startPlayback();
  }
}());

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

/* FOMO countdown: always counts down to next 12:00 PM, then loops.
   Fresh for every visitor — no shared/server deadline, so ads can run forever. */
(function () {
  var hoursEl = document.getElementById('fomoHours');
  var minsEl = document.getElementById('fomoMins');
  var secsEl = document.getElementById('fomoSecs');
  var banner = document.querySelector('.fomo-banner');
  if (!hoursEl || !minsEl || !secsEl) return;

  function syncBannerHeight() {
    if (!banner) return;
    var h = Math.ceil(banner.getBoundingClientRect().height);
    if (h > 0) {
      document.documentElement.style.setProperty('--fomo-banner-h', h + 'px');
    }
  }

  function pad(n) {
    return n < 10 ? '0' + n : String(n);
  }

  function nextNoon(from) {
    var d = new Date(from.getTime());
    d.setHours(12, 0, 0, 0);
    if (from.getTime() >= d.getTime()) {
      d.setDate(d.getDate() + 1);
    }
    return d;
  }

  function tick() {
    var now = new Date();
    var target = nextNoon(now);
    var diff = Math.max(0, target.getTime() - now.getTime());
    var totalSec = Math.floor(diff / 1000);
    var h = Math.floor(totalSec / 3600);
    var m = Math.floor((totalSec % 3600) / 60);
    var s = totalSec % 60;
    hoursEl.textContent = pad(h);
    minsEl.textContent = pad(m);
    secsEl.textContent = pad(s);
  }

  tick();
  syncBannerHeight();
  setInterval(tick, 1000);
  window.addEventListener('resize', syncBannerHeight);
}());
