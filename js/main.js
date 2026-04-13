/* ============================================
   ANA CABALLERO COACH — JavaScript principal
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ------------------------------------------
     NAV — scroll + mobile toggle
  ------------------------------------------ */
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  // Scroll shadow
  window.addEventListener('scroll', function () {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  // Mobile toggle
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close nav on link click (mobile)
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target)) {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ------------------------------------------
     TABS — ¿Te reconoces?
  ------------------------------------------ */
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const target = btn.getAttribute('aria-controls');

      tabBtns.forEach(function (b) {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      tabPanels.forEach(function (p) {
        p.classList.remove('active');
      });

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const panel = document.getElementById(target);
      if (panel) panel.classList.add('active');
    });
  });

  /* ------------------------------------------
     TIMELINE — Cómo trabajo (Fases)
  ------------------------------------------ */
  const fases = document.querySelectorAll('.fase');
  const faseContents = document.querySelectorAll('.como__active-content');

  fases.forEach(function (fase, index) {
    fase.addEventListener('click', function () {
      fases.forEach(function (f) {
        f.classList.remove('active');
        f.setAttribute('aria-selected', 'false');
      });
      faseContents.forEach(function (c) {
        c.style.display = 'none';
      });

      fase.classList.add('active');
      fase.setAttribute('aria-selected', 'true');

      const contentId = fase.getAttribute('aria-controls');
      const content = document.getElementById(contentId);
      if (content) content.style.display = 'grid';
    });

    // Keyboard support
    fase.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        fase.click();
      }
    });
  });

  /* ------------------------------------------
     FAQ — Accordion
  ------------------------------------------ */
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const answer = btn.nextElementSibling;
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';
      const icon = btn.querySelector('.faq-icon');

      // Close all others
      faqQuestions.forEach(function (other) {
        if (other !== btn) {
          other.setAttribute('aria-expanded', 'false');
          other.nextElementSibling.classList.remove('open');
          const otherIcon = other.querySelector('.faq-icon');
          if (otherIcon) otherIcon.textContent = '+';
        }
      });

      // Toggle current
      btn.setAttribute('aria-expanded', !isExpanded);
      answer.classList.toggle('open', !isExpanded);
      if (icon) icon.textContent = isExpanded ? '+' : '×';
    });
  });

  /* ------------------------------------------
     COOKIE BANNER
  ------------------------------------------ */
  const cookieBanner = document.getElementById('cookieBanner');
  const cookieAccept = document.getElementById('cookieAccept');
  const cookieEssential = document.getElementById('cookieEssential');

  function getCookie(name) {
    const value = '; ' + document.cookie;
    const parts = value.split('; ' + name + '=');
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = name + '=' + value + '; expires=' + expires + '; path=/; SameSite=Lax';
  }

  // Show banner if no consent stored
  if (cookieBanner && !getCookie('cookie_consent')) {
    setTimeout(function () {
      cookieBanner.classList.add('visible');
    }, 1200);
  }

  function hideBanner() {
    if (cookieBanner) {
      cookieBanner.classList.remove('visible');
      setTimeout(function () { cookieBanner.classList.add('hidden'); }, 400);
    }
  }

  if (cookieAccept) {
    cookieAccept.addEventListener('click', function () {
      setCookie('cookie_consent', 'all', 365);
      hideBanner();
    });
  }

  if (cookieEssential) {
    cookieEssential.addEventListener('click', function () {
      setCookie('cookie_consent', 'essential', 365);
      hideBanner();
    });
  }

  /* ------------------------------------------
     LAZY LOADING (fallback for older browsers)
  ------------------------------------------ */
  if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('loaded');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '200px' });

    lazyImages.forEach(function (img) {
      observer.observe(img);
    });
  }

  /* ------------------------------------------
     SMOOTH SCROLL for anchor links
  ------------------------------------------ */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ------------------------------------------
     SERVICIOS — paneles expandibles
  ------------------------------------------ */
  document.querySelectorAll('.servicio-toggle').forEach(function(btn) {
    btn.dataset.originalText = btn.textContent.trim();
    btn.addEventListener('click', function(e) {
      var targetId = btn.getAttribute('data-target');
      if (!targetId) return;
      e.preventDefault();
      var panel = document.getElementById(targetId);
      if (panel) {
        var isHidden = panel.hidden;
        panel.hidden = !isHidden;
        btn.setAttribute('aria-expanded', isHidden);
        btn.textContent = isHidden ? 'Ocultar detalle' : btn.dataset.originalText;
      }
    });
  });

});
