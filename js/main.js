/* ============================================================
   BSU Malvar Spartan — Main JavaScript
   ============================================================ */

(function () {
  'use strict';

  /* ---- Navbar: scroll shadow + mobile toggle ---- */
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  window.addEventListener('scroll', function () {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.classList.toggle('active', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close nav when a link is clicked
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---- Footer year ---- */
  var yearEl = document.getElementById('footer-year');
  if (yearEl) { yearEl.textContent = new Date().getFullYear(); }

  /* ---- Animated counters in stats section ---- */
  var statsConfig = [
    { id: 'stat-members',  target: 20,   suffix: '+' },
    { id: 'stat-projects', target: 5,    suffix: '+' },
    { id: 'stat-commits',  target: 100,  suffix: '+' },
    { id: 'stat-stars',    target: 10,   suffix: '+' }
  ];

  function animateCounter(el, target, suffix, duration) {
    var start = 0;
    var startTime = null;
    function step(timestamp) {
      if (!startTime) { startTime = timestamp; }
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var value = Math.floor(progress * target);
      el.textContent = value + suffix;
      if (progress < 1) { requestAnimationFrame(step); }
    }
    requestAnimationFrame(step);
  }

  // Trigger counters once the stats section enters view
  var statsSection = document.querySelector('.stats');
  var countersStarted = false;
  if (statsSection) {
    var statsObserver = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting && !countersStarted) {
        countersStarted = true;
        statsConfig.forEach(function (cfg) {
          var el = document.getElementById(cfg.id);
          if (el) { animateCounter(el, cfg.target, cfg.suffix, 1200); }
        });
        statsObserver.disconnect();
      }
    }, { threshold: 0.4 });
    statsObserver.observe(statsSection);
  }

  /* ---- Scroll-reveal for sections ---- */
  var revealEls = document.querySelectorAll(
    '.pillar, .project-card, .member-card, .stat-card, .contact__item, ' +
    '.about__text, .about__pillars, .section__header, .contact__form, .contact__info'
  );

  revealEls.forEach(function (el) { el.setAttribute('data-reveal', ''); });

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    // Fallback: show all immediately
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---- Contact form (demo handler) ---- */
  var contactForm = document.getElementById('contact-form');
  var formStatus = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = contactForm.querySelector('#contact-name').value.trim();
      var email = contactForm.querySelector('#contact-email').value.trim();
      var message = contactForm.querySelector('#contact-message').value.trim();

      if (!name || !email || !message) {
        formStatus.textContent = 'Please fill in all fields.';
        formStatus.className = 'contact__form-note error';
        return;
      }

      var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(email)) {
        formStatus.textContent = 'Please enter a valid email address.';
        formStatus.className = 'contact__form-note error';
        return;
      }

      // In a real deployment, you would POST to a form backend or use a service
      // like Formspree (https://formspree.io) by updating the form action attribute.
      formStatus.textContent = 'Thanks, ' + name + '! We\'ll get back to you soon. ⚔️';
      formStatus.className = 'contact__form-note success';
      contactForm.reset();
    });
  }

})();
