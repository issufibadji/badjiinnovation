// Dark / light theme toggle
const themeToggle = document.getElementById('themeToggle');

if (themeToggle) {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  const currentTheme = () => {
    const saved = document.documentElement.getAttribute('data-theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return prefersDark.matches ? 'dark' : 'light';
  };

  themeToggle.addEventListener('click', () => {
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
  });
}

// Mobile menu toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('is-open');
    navMenu.classList.toggle('is-open');
  });

  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      // Defer to the next tick so the browser finishes the anchor's default
      // navigation before the menu (and the link itself) gets display:none —
      // closing it synchronously here cancels the jump in some browsers.
      setTimeout(() => {
        navToggle.classList.remove('is-open');
        navMenu.classList.remove('is-open');
      }, 0);
    });
  });
}

// Scroll reveal animation.
// Elements are visible by default (safe fallback); only elements that are
// confirmed to start below the fold get pre-hidden and animated in on scroll.
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll('.reveal').forEach((el) => {
    const rect = el.getBoundingClientRect();
    const startsBelowFold = rect.top > window.innerHeight * 0.9;
    if (startsBelowFold) {
      el.classList.add('reveal--pending');
      revealObserver.observe(el);
    }
  });
}

// Gallery filter
const galleryFilters = document.querySelectorAll('.gallery__filters button');
const galleryCards = document.querySelectorAll('.gallery__card');

galleryFilters.forEach((btn) => {
  btn.addEventListener('click', () => {
    galleryFilters.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    galleryCards.forEach((card) => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.style.display = show ? '' : 'none';
    });
  });
});

// WhatsApp chat widget
const waChat = document.getElementById('waChat');
const waChatToggle = document.getElementById('waChatToggle');
const waChatClose = document.getElementById('waChatClose');
const waChatBody = document.getElementById('waChatBody');
const waChatActions = document.getElementById('waChatActions');
const waChatCta = document.getElementById('waChatCta');
const WA_NUMBER = '16475022938';
const WA_FOLLOWUP = 'Entendido! Clique abaixo para continuar a conversa no WhatsApp. Respondemos em instantes! 😊';

if (waChat && waChatToggle) {
  const resetWaChat = () => {
    waChatBody.querySelectorAll('.wa-chat__sent, .wa-chat__reply').forEach((el) => el.remove());
    waChatActions.hidden = false;
    waChatCta.hidden = true;
  };

  const closeWaChat = () => {
    waChat.classList.remove('is-open');
    waChatToggle.classList.remove('is-open');
    waChatToggle.setAttribute('aria-expanded', 'false');
  };

  waChatToggle.addEventListener('click', () => {
    const isOpen = waChat.classList.toggle('is-open');
    waChatToggle.classList.toggle('is-open', isOpen);
    waChatToggle.setAttribute('aria-expanded', String(isOpen));
  });

  waChatClose?.addEventListener('click', () => {
    closeWaChat();
    setTimeout(resetWaChat, 250);
  });

  document.addEventListener('click', (e) => {
    if (!waChat.classList.contains('is-open')) return;
    if (!e.target.closest('.floating-actions')) {
      closeWaChat();
      setTimeout(resetWaChat, 250);
    }
  });

  waChatActions?.querySelectorAll('.wa-chat__action').forEach((btn) => {
    btn.addEventListener('click', () => {
      const waText = btn.dataset.waText || '';

      const sent = document.createElement('div');
      sent.className = 'wa-chat__sent';
      sent.innerHTML = btn.innerHTML;

      const reply = document.createElement('div');
      reply.className = 'wa-chat__bubble wa-chat__reply is-typed';
      reply.textContent = WA_FOLLOWUP;

      waChatActions.hidden = true;
      waChatActions.insertAdjacentElement('afterend', reply);
      waChatActions.insertAdjacentElement('afterend', sent);

      waChatCta.href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waText)}`;
      waChatCta.hidden = false;

      waChatBody.scrollTop = waChatBody.scrollHeight;
    });
  });
}

// Back-to-top button
const backToTop = document.getElementById('backToTop');

if (backToTop) {
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('is-visible', window.scrollY > 480);
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.navbar__nav a');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  },
  { rootMargin: '-45% 0px -50% 0px' }
);
sections.forEach((section) => sectionObserver.observe(section));
