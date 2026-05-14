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

  /* ---------- Instagram grid items: stagger reveal ---------- */
  const igItems = document.querySelectorAll('.instagram__item');
  const igObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          igObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  igItems.forEach(function (item, i) {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'opacity .5s ease ' + (i * 0.07) + 's, transform .5s ease ' + (i * 0.07) + 's';
    igObserver.observe(item);
  });

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
        // Re-trigger reveal for newly shown cards
        panel.querySelectorAll('.reveal').forEach(function (el) {
          if (!el.classList.contains('is-visible')) {
            revealObserver.observe(el);
          }
        });
      }
    });
  });

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
