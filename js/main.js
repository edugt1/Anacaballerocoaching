/* ============================================
   ANA CABALLERO · EXECUTIVE COACH — main.js
   ============================================ */

// --- Mobile navigation toggle ---
const navToggle = document.querySelector('.nav-toggle');
const navMobile = document.querySelector('.nav-mobile');

if (navToggle && navMobile) {
  navToggle.addEventListener('click', () => {
    const isOpen = navMobile.classList.toggle('is-open');
    navToggle.classList.toggle('is-open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  // Close menu when a link is clicked
  navMobile.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMobile.classList.remove('is-open');
      navToggle.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', false);
    });
  });
}

// --- Moments: card selector + detail panel ---
function initMoments() {
  const cards = document.querySelectorAll('.moment-card');
  const panels = document.querySelectorAll('.md-panel');
  if (!cards.length) return;

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const num = card.getAttribute('data-moment');

      // Update cards
      cards.forEach(c => {
        c.classList.remove('is-active');
        c.setAttribute('aria-selected', 'false');
      });
      card.classList.add('is-active');
      card.setAttribute('aria-selected', 'true');

      // Update panels
      panels.forEach(p => p.classList.remove('is-active'));
      const target = document.querySelector(`.md-panel[data-panel="${num}"]`);
      if (target) target.classList.add('is-active');

      // On mobile, scroll to detail panel
      if (window.innerWidth < 1024) {
        const detail = document.getElementById('moment-detail');
        if (detail) setTimeout(() => detail.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50);
      }
    });
  });
}
initMoments();

// --- FAQ accordion ---
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const answer = item.querySelector('.faq-answer');
    const isOpen = item.classList.contains('is-open');

    // Close all
    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('is-open');
      i.querySelector('.faq-answer').hidden = true;
      i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
    });

    // Open clicked (if it was closed)
    if (!isOpen) {
      item.classList.add('is-open');
      answer.hidden = false;
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

// --- Contact form (Formspree AJAX) ---
const form = document.getElementById('contact-form');
if (form) {
  // Sync _replyto with email field for auto-reply
  const emailInput = document.getElementById('email');
  const replytoField = document.getElementById('replyto-field');
  if (emailInput && replytoField) {
    emailInput.addEventListener('input', () => { replytoField.value = emailInput.value; });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = document.getElementById('submit-btn');
    const errorDiv = document.getElementById('form-error');
    const successDiv = document.getElementById('form-success');

    // Basic client-side validation
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    // Loading state
    btn.disabled = true;
    btn.textContent = 'Enviando…';
    if (errorDiv) errorDiv.style.display = 'none';

    try {
      const data = new FormData(form);
      const res = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        // Show success, hide form
        form.style.display = 'none';
        if (successDiv) successDiv.style.display = 'block';
      } else {
        throw new Error('Server error');
      }
    } catch {
      btn.disabled = false;
      btn.textContent = 'Enviar mensaje';
      if (errorDiv) errorDiv.style.display = 'block';
    }
  });
}

// --- Cookie banner ---
(function() {
  const banner = document.getElementById('cookie-banner');
  if (!banner) return;
  if (!localStorage.getItem('cookie-consent')) {
    banner.style.display = 'flex';
  }
  document.getElementById('cookie-accept')?.addEventListener('click', () => {
    localStorage.setItem('cookie-consent', 'all');
    banner.style.display = 'none';
    // TODO: activate analytics here if needed
  });
  document.getElementById('cookie-essential')?.addEventListener('click', () => {
    localStorage.setItem('cookie-consent', 'essential');
    banner.style.display = 'none';
  });
})();

// --- Scroll reveal (simple, no library) ---
const revealEls = document.querySelectorAll('.result-card, .service-card, .testimonial-card, .step');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
}
