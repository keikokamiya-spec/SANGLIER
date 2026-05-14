/* ============================================================
   SANGLIER — main.js
   ============================================================ */

(function () {
  'use strict';

  /* ---------- Header: scroll class ---------- */
  const header = document.getElementById('header');

  function onScroll() {
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

  hamburger.addEventListener('click', function () {
    const isOpen = nav.classList.toggle('is-open');
    hamburger.classList.toggle('is-open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close nav when link clicked
  nav.querySelectorAll('.header__nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      nav.classList.remove('is-open');
      hamburger.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  /* ---------- Smooth scroll for anchor links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const headerH = header.offsetHeight;
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
  if (hero) heroObserver.observe(hero);

  /* ---------- Menu tab switching ---------- */
  const tabs = document.querySelectorAll('.menu__tab');
  const panels = document.querySelectorAll('.menu__panel');

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      const target = this.dataset.tab;

      tabs.forEach(function (t) { t.classList.remove('is-active'); });
      panels.forEach(function (p) { p.classList.remove('is-active'); });

      this.classList.add('is-active');
      const panel = document.getElementById('tab-' + target);
      if (panel) {
        panel.classList.add('is-active');
        // Reset slider position to first slide when switching tabs
        const track = panel.querySelector('.menu__slider-track');
        if (track) track.style.transform = 'translateX(0)';
        const dots = panel.querySelectorAll('.menu__slider-dot');
        dots.forEach(function (d, i) {
          d.classList.toggle('is-active', i === 0);
        });
      }
    });
  });

  /* ---------- Menu slider (manual, one card at a time) ---------- */
  function initMenuSlider(panelId) {
    var panel = document.getElementById(panelId);
    if (!panel) return;

    var track = panel.querySelector('.menu__slider-track');
    var dots  = panel.querySelectorAll('.menu__slider-dot');
    var cards = panel.querySelectorAll('.menu-card');
    var total = cards.length;
    var current = 0;

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

  initMenuSlider('tab-tofa');
  initMenuSlider('tab-drink');

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
