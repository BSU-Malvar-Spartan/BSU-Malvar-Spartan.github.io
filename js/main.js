/* ============================================================
   BSU Malvar Spartan — Main JavaScript
   ============================================================ */

(function () {
  'use strict';

  /* ---- Navbar: scroll shadow + mobile toggle ---- */
  var navbar    = document.getElementById('navbar');
  var navToggle = document.getElementById('nav-toggle');
  var navLinks  = document.getElementById('nav-links');

  window.addEventListener('scroll', function () {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('open');
      navToggle.classList.toggle('active', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
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
    { id: 'stat-members',      target: 20,  suffix: '+' },
    { id: 'stat-paths',        target: 15,  suffix: '+' },
    { id: 'stat-resources',    target: 30,  suffix: '+' },
    { id: 'stat-achievements', target: 25,  suffix: '+' }
  ];

  function animateCounter(el, target, suffix, duration) {
    var startTime = null;
    function step(timestamp) {
      if (!startTime) { startTime = timestamp; }
      var progress = Math.min((timestamp - startTime) / duration, 1);
      el.textContent = Math.floor(progress * target) + suffix;
      if (progress < 1) { requestAnimationFrame(step); }
    }
    requestAnimationFrame(step);
  }

  var statsSection   = document.querySelector('.stats');
  var countersStarted = false;
  if (statsSection) {
    new IntersectionObserver(function (entries, obs) {
      if (entries[0].isIntersecting && !countersStarted) {
        countersStarted = true;
        statsConfig.forEach(function (cfg) {
          var el = document.getElementById(cfg.id);
          if (el) { animateCounter(el, cfg.target, cfg.suffix, 1200); }
        });
        obs.disconnect();
      }
    }, { threshold: 0.4 }).observe(statsSection);
  }

  /* ---- Scroll-reveal for sections ---- */
  var revealEls = document.querySelectorAll(
    '.pillar, .resource-card, .path-card, .achievement-card, ' +
    '.stat-card, .contact__item, .about__text, .about__pillars, ' +
    '.section__header, .contact__form, .contact__info, .contribute__form'
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
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---- Contribute: tab switching ---- */
  var tabPath       = document.getElementById('tab-path');
  var tabAchievement = document.getElementById('tab-achievement');
  var pathForm      = document.getElementById('path-form');
  var achForm       = document.getElementById('achievement-form');

  function activateTab(activeTab, inactiveTab, showForm, hideForm) {
    activeTab.classList.add('contribute__tab--active');
    activeTab.setAttribute('aria-selected', 'true');
    inactiveTab.classList.remove('contribute__tab--active');
    inactiveTab.setAttribute('aria-selected', 'false');
    showForm.classList.remove('contribute__form--hidden');
    hideForm.classList.add('contribute__form--hidden');
  }

  if (tabPath && tabAchievement) {
    tabPath.addEventListener('click', function () {
      activateTab(tabPath, tabAchievement, pathForm, achForm);
    });
    tabAchievement.addEventListener('click', function () {
      activateTab(tabAchievement, tabPath, achForm, pathForm);
    });
  }

  /* ---- Safe text escape for localStorage-sourced HTML ---- */
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /* ---- localStorage helpers ---- */
  var LS_PATHS = 'bsu_spartan_paths';
  var LS_ACHS  = 'bsu_spartan_achievements';

  function loadJSON(key) {
    try { return JSON.parse(localStorage.getItem(key)) || []; }
    catch (e) { return []; }
  }

  function saveJSON(key, data) {
    try { localStorage.setItem(key, JSON.stringify(data)); }
    catch (e) { /* storage might be unavailable */ }
  }

  /* ---- Render a saved learning-path card ---- */
  function buildPathCard(entry) {
    var tags = (entry.tags || '')
      .split(',')
      .map(function (t) { return t.trim(); })
      .filter(Boolean)
      .map(function (t) { return '<span class="path-card__tag">' + escapeHtml(t) + '</span>'; })
      .join('');

    var card = document.createElement('div');
    card.className = 'path-card';
    card.innerHTML =
      '<div class="path-card__header">' +
        '<div class="path-card__avatar" aria-hidden="true">⚔️</div>' +
        '<div>' +
          '<h3 class="path-card__name">' + escapeHtml(entry.name) + '</h3>' +
          '<span class="path-card__track">' + escapeHtml(entry.track) + '</span>' +
        '</div>' +
      '</div>' +
      '<p class="path-card__description">' + escapeHtml(entry.description) + '</p>' +
      (tags ? '<div class="path-card__footer">' + tags + '</div>' : '');
    return card;
  }

  /* ---- Render a saved achievement card ---- */
  function buildAchievementCard(entry) {
    var badge = entry.badge && entry.badge.trim() ? entry.badge.trim() : '🌟';
    var card = document.createElement('div');
    card.className = 'achievement-card';
    card.innerHTML =
      '<div class="achievement-card__badge" aria-hidden="true">' + escapeHtml(badge) + '</div>' +
      '<div class="achievement-card__body">' +
        '<h3 class="achievement-card__name">' + escapeHtml(entry.name) + '</h3>' +
        '<p class="achievement-card__title">' + escapeHtml(entry.title) + '</p>' +
        '<p class="achievement-card__desc">' + escapeHtml(entry.desc) + '</p>' +
        '<span class="achievement-card__date">' + escapeHtml(String(entry.year)) + '</span>' +
      '</div>';
    return card;
  }

  /* ---- Load & display stored submissions on page load ---- */
  var pathsGrid   = document.getElementById('paths-grid');
  var achsGrid    = document.getElementById('accomplishments-grid');

  loadJSON(LS_PATHS).forEach(function (entry) {
    if (pathsGrid) { pathsGrid.insertBefore(buildPathCard(entry), pathsGrid.firstChild); }
  });

  loadJSON(LS_ACHS).forEach(function (entry) {
    if (achsGrid) { achsGrid.insertBefore(buildAchievementCard(entry), achsGrid.firstChild); }
  });

  /* ---- Learning Path form submission ---- */
  var pathFormEl  = document.getElementById('path-form');
  var pathStatus  = document.getElementById('path-form-status');

  if (pathFormEl) {
    pathFormEl.addEventListener('submit', function (e) {
      e.preventDefault();

      var name        = document.getElementById('path-name').value.trim();
      var track       = document.getElementById('path-track').value.trim();
      var description = document.getElementById('path-description').value.trim();
      var tags        = document.getElementById('path-tags').value.trim();

      if (!name || !track || !description) {
        pathStatus.textContent = 'Please fill in all required fields.';
        pathStatus.className = 'contribute__form-note error';
        return;
      }

      var entry = { name: name, track: track, description: description, tags: tags };
      var stored = loadJSON(LS_PATHS);
      stored.unshift(entry);
      saveJSON(LS_PATHS, stored);

      if (pathsGrid) { pathsGrid.insertBefore(buildPathCard(entry), pathsGrid.firstChild); }

      pathStatus.textContent = 'Thanks, ' + name + '! Your learning path is now live. ⚔️';
      pathStatus.className = 'contribute__form-note success';
      pathFormEl.reset();
    });
  }

  /* ---- Accomplishment form submission ---- */
  var achFormEl  = document.getElementById('achievement-form');
  var achStatus  = document.getElementById('ach-form-status');

  if (achFormEl) {
    achFormEl.addEventListener('submit', function (e) {
      e.preventDefault();

      var name  = document.getElementById('ach-name').value.trim();
      var title = document.getElementById('ach-title').value.trim();
      var year  = document.getElementById('ach-year').value.trim();
      var badge = document.getElementById('ach-badge').value.trim();
      var desc  = document.getElementById('ach-desc').value.trim();

      if (!name || !title || !year || !desc) {
        achStatus.textContent = 'Please fill in all required fields.';
        achStatus.className = 'contribute__form-note error';
        return;
      }

      var yearNum = parseInt(year, 10);
      if (isNaN(yearNum) || yearNum < 2020 || yearNum > 2099) {
        achStatus.textContent = 'Please enter a valid year (2020–2099).';
        achStatus.className = 'contribute__form-note error';
        return;
      }

      var entry = { name: name, title: title, year: yearNum, badge: badge, desc: desc };
      var stored = loadJSON(LS_ACHS);
      stored.unshift(entry);
      saveJSON(LS_ACHS, stored);

      if (achsGrid) { achsGrid.insertBefore(buildAchievementCard(entry), achsGrid.firstChild); }

      achStatus.textContent = 'Awesome, ' + name + '! Your accomplishment is now on display. 🏆';
      achStatus.className = 'contribute__form-note success';
      achFormEl.reset();
    });
  }

  /* ---- Contact form (demo handler) ---- */
  var contactForm = document.getElementById('contact-form');
  var formStatus  = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var name    = document.getElementById('contact-name').value.trim();
      var email   = document.getElementById('contact-email').value.trim();
      var message = document.getElementById('contact-message').value.trim();

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

      formStatus.textContent = 'Thanks, ' + name + '! We\'ll get back to you soon. ⚔️';
      formStatus.className = 'contact__form-note success';
      contactForm.reset();
    });
  }

})();
