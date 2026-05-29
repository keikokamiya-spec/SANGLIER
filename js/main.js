/* ============================================================
   SANGLIER — main.js
   ============================================================ */

(function () {
  'use strict';

  /* ---------- Header: scroll class ---------- */
  const header = document.getElementById('header');

  function onScroll() {
    if (!header) return;
    if (window.scrollY > 60) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Hamburger menu ---------- */
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');

  function closeNav() {
    if (!hamburger || !nav) return;
    nav.classList.remove('is-open');
    hamburger.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'メニューを開く');
    document.body.style.overflow = '';
  }

  if (hamburger && nav) {
    hamburger.addEventListener('click', function () {
      const isOpen = nav.classList.toggle('is-open');
      hamburger.classList.toggle('is-open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      hamburger.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close nav when link clicked
    nav.querySelectorAll('.header__nav-link').forEach(function (link) {
      link.addEventListener('click', closeNav);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });
  }

  /* ---------- Smooth scroll for anchor links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const headerH = header ? header.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ---------- Reveal on scroll (Intersection Observer) ---------- */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach(function (el) { revealObserver.observe(el); });

  /* ---------- Floating CTA: show after hero ---------- */
  const floatingCta = document.getElementById('floatingCta');
  const hero = document.getElementById('hero');

  if (floatingCta && hero) {
    const heroObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) {
            floatingCta.classList.add('is-visible');
          } else {
            floatingCta.classList.remove('is-visible');
          }
        });
      },
      { threshold: 0 }
    );
    heroObserver.observe(hero);
  }

  /* ---------- Menu slider (manual, one card at a time) ---------- */
  function initMenuSlider(panel) {
    if (!panel) return;

    var track = panel.querySelector('.menu__slider-track');
    var dots  = panel.querySelectorAll('.menu__slider-dot');
    var cards = panel.querySelectorAll('.menu-card');
    var total = cards.length;
    var current = 0;

    if (!track || !total) return;

    function goTo(index) {
      current = ((index % total) + total) % total;
      track.style.transform = 'translateX(-' + (current * 100) + '%)';
      dots.forEach(function (d, i) {
        d.classList.toggle('is-active', i === current);
      });
    }

    var btnPrev = panel.querySelector('.menu__slider-btn--prev');
    var btnNext = panel.querySelector('.menu__slider-btn--next');

    if (btnPrev) btnPrev.addEventListener('click', function () { goTo(current - 1); });
    if (btnNext) btnNext.addEventListener('click', function () { goTo(current + 1); });

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { goTo(i); });
    });

    // Touch / swipe support
    var touchStartX = 0;
    track.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });
    track.addEventListener('touchend', function (e) {
      var diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
    }, { passive: true });
  }

  document.querySelectorAll('.menu__panel').forEach(initMenuSlider);

  /* ---------- Instagram slider (auto, 3-second interval) ---------- */
  (function () {
    var slider = document.querySelector('.ig-slider');
    if (!slider) return;

    var track  = slider.querySelector('.ig-slider__track');
    var dots   = slider.querySelectorAll('.ig-slider__dot');
    var total  = dots.length;
    var current = 0;
    var timer;

    function goTo(index) {
      current = ((index % total) + total) % total;
      track.style.transform = 'translateX(-' + (current * 100) + '%)';
      dots.forEach(function (d, i) {
        d.classList.toggle('is-active', i === current);
      });
    }

    function startAuto() {
      timer = setInterval(function () { goTo(current + 1); }, 3000);
    }
    function stopAuto() { clearInterval(timer); }

    // Pause on hover
    slider.addEventListener('mouseenter', stopAuto);
    slider.addEventListener('mouseleave', startAuto);

    // Dot click
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        stopAuto();
        goTo(i);
        startAuto();
      });
    });

    // Touch / swipe support
    var touchStartX = 0;
    track.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].clientX;
      stopAuto();
    }, { passive: true });
    track.addEventListener('touchend', function (e) {
      var diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
      startAuto();
    }, { passive: true });

    startAuto();
  })();

  /* ---------- Active nav link on scroll ---------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.header__nav-link');

  const sectionObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navLinks.forEach(function (link) {
            link.style.color = '';
          });
          const activeLink = document.querySelector(
            '.header__nav-link[href="#' + entry.target.id + '"]'
          );
          if (activeLink && header.classList.contains('is-scrolled')) {
            activeLink.style.color = 'var(--sage)';
          }
        }
      });
    },
    { threshold: 0.4 }
  );
  sections.forEach(function (section) { sectionObserver.observe(section); });

})();
