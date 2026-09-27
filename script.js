/* ============================================================
   VERDANA STUDIO — script.js
   All interactivity: RTL/LTR, dark/light, nav, portfolio
   filter, testimonials carousel, scroll effects, form
   ============================================================ */

'use strict';

// ---- DOM References ----
const html        = document.documentElement;
const body        = document.body;
const navbar      = document.getElementById('navbar');
const hamburger   = document.getElementById('hamburger');
const navLinks    = document.getElementById('nav-links');
const mobileOverlay = document.getElementById('mobile-overlay');

// Toggles
const rtlToggle   = document.getElementById('rtl-toggle');
const dirLabel    = document.getElementById('dir-label');
const themeToggle = document.getElementById('theme-toggle');
const sunIcon     = document.getElementById('sun-icon');
const moonIcon    = document.getElementById('moon-icon');

// Dropdown
const homeDropdown = document.getElementById('home-dropdown');
const homeTrigger  = document.getElementById('home-trigger');

// Portfolio filter
const filterBtns   = document.querySelectorAll('.filter-btn');
const portfolioGrid = document.getElementById('portfolio-grid');

// Testimonials
const track      = document.getElementById('testimonials-track');
const dots       = document.querySelectorAll('.testi-dot');
const prevBtn    = document.getElementById('testi-prev');
const nextBtn    = document.getElementById('testi-next');
const cards      = document.querySelectorAll('.testimonial-card');

// Form
const form       = document.getElementById('consultation-form');
const formSuccess = document.getElementById('form-success');

// ============================================================
// 1. THEME TOGGLE (Dark / Light)
// ============================================================
let isDark = false;

function setTheme(dark) {
  isDark = dark;
  html.setAttribute('data-theme', dark ? 'dark' : 'light');
  if (dark) {
    sunIcon.classList.add('hidden');
    moonIcon.classList.remove('hidden');
  } else {
    sunIcon.classList.remove('hidden');
    moonIcon.classList.add('hidden');
  }
  localStorage.setItem('verdana-theme', dark ? 'dark' : 'light');
}

themeToggle.addEventListener('click', () => setTheme(!isDark));

// Load saved preference
const savedTheme = localStorage.getItem('verdana-theme');
if (savedTheme === 'dark') {
  setTheme(true);
} else if (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  setTheme(true);
}

// ============================================================
// 2. RTL / LTR TOGGLE
// ============================================================
let isRTL = false;

function setDirection(rtl) {
  isRTL = rtl;
  html.setAttribute('dir', rtl ? 'rtl' : 'ltr');

  // Show only the ACTIVE mode label
  dirLabel.textContent = rtl ? 'RTL' : 'LTR';

  localStorage.setItem('verdana-dir', rtl ? 'rtl' : 'ltr');
}

rtlToggle.addEventListener('click', () => setDirection(!isRTL));

// Load saved direction
const savedDir = localStorage.getItem('verdana-dir');
if (savedDir === 'rtl') {
  setDirection(true);
}

// ============================================================
// 3. NAVBAR SCROLL BEHAVIOR
// ============================================================
let lastScrollY = 0;

function handleScroll() {
  const scrollY = window.scrollY;

  // Add scrolled class for shadow
  navbar.classList.toggle('scrolled', scrollY > 40);

  // Active nav link based on section
  const sections = document.querySelectorAll('section[id]');
  sections.forEach(section => {
    const top = section.offsetTop - 100;
    const bottom = top + section.offsetHeight;
    if (scrollY >= top && scrollY < bottom) {
      document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + section.id) {
          link.classList.add('active');
        }
      });
    }
  });

  lastScrollY = scrollY;
}

window.addEventListener('scroll', handleScroll, { passive: true });
handleScroll(); // Initial call

// ============================================================
// 4. DROPDOWN MENU
// ============================================================
function openDropdown() {
  homeDropdown.classList.add('open');
  homeTrigger.setAttribute('aria-expanded', 'true');
}

function closeDropdown() {
  homeDropdown.classList.remove('open');
  homeTrigger.setAttribute('aria-expanded', 'false');
}

homeTrigger.addEventListener('click', (e) => {
  e.stopPropagation();
  homeDropdown.classList.contains('open') ? closeDropdown() : openDropdown();
});

// Close when clicking outside
document.addEventListener('click', (e) => {
  if (!homeDropdown.contains(e.target)) {
    closeDropdown();
  }
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeDropdown();
    closeMobileNav();
  }
});

// Hover behavior for desktop
homeDropdown.addEventListener('mouseenter', openDropdown);
homeDropdown.addEventListener('mouseleave', closeDropdown);

// Close dropdown on dropdown-item click
document.querySelectorAll('.dropdown-item').forEach(item => {
  item.addEventListener('click', () => {
    closeDropdown();
    closeMobileNav();
  });
});

// ============================================================
// 5. MOBILE NAV
// ============================================================
function openMobileNav() {
  navLinks.classList.add('open');
  hamburger.classList.add('open');
  mobileOverlay.classList.add('active');
  body.style.overflow = 'hidden';
}

function closeMobileNav() {
  navLinks.classList.remove('open');
  hamburger.classList.remove('open');
  mobileOverlay.classList.remove('active');
  body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  navLinks.classList.contains('open') ? closeMobileNav() : openMobileNav();
});

mobileOverlay.addEventListener('click', closeMobileNav);

// Close mobile nav on nav link click
document.querySelectorAll('.nav-link:not(.dropdown-trigger)').forEach(link => {
  link.addEventListener('click', closeMobileNav);
});

// ============================================================
// 6. PORTFOLIO FILTER
// ============================================================
const portfolioItems = document.querySelectorAll('.portfolio-item');

function filterPortfolio(filter) {
  portfolioItems.forEach(item => {
    const cat = item.getAttribute('data-cat');
    const show = filter === 'all' || cat === filter;

    item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';

    if (show) {
      item.style.opacity = '1';
      item.style.transform = 'scale(1)';
      item.style.pointerEvents = '';
      item.style.display = '';
    } else {
      item.style.opacity = '0';
      item.style.transform = 'scale(0.95)';
      item.style.pointerEvents = 'none';
      setTimeout(() => {
        if (item.getAttribute('data-cat') !== filter && filter !== 'all') {
          item.style.display = 'none';
        }
      }, 400);
    }
  });
}

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');

    // Re-show all first
    portfolioItems.forEach(item => {
      item.style.display = '';
      // Trigger reflow for animation
      item.offsetHeight;
    });

    requestAnimationFrame(() => filterPortfolio(filter));
  });
});

// ============================================================
// 7. TESTIMONIALS CAROUSEL
// ============================================================
let currentTesti = 0;
const totalTestis = cards.length;
let autoplayTimer = null;
let isMobile = window.innerWidth <= 768;

function goToTestimonial(idx) {
  currentTesti = ((idx % totalTestis) + totalTestis) % totalTestis;

  if (isMobile) {
    // Slide mode on mobile
    const offset = currentTesti * 100;
    track.style.transform = `translateX(-${offset}%)`;
  } else {
    // Highlight mode on desktop
    cards.forEach((c, i) => {
      c.style.opacity = i === currentTesti ? '1' : '0.6';
      c.style.transform = i === currentTesti ? 'scale(1.02)' : 'scale(1)';
    });
  }

  dots.forEach((d, i) => {
    d.classList.toggle('active', i === currentTesti);
  });
}

function nextTestimonial() { goToTestimonial(currentTesti + 1); }
function prevTestimonial() { goToTestimonial(currentTesti - 1); }

nextBtn.addEventListener('click', nextTestimonial);
prevBtn.addEventListener('click', prevTestimonial);

dots.forEach(dot => {
  dot.addEventListener('click', () => {
    goToTestimonial(parseInt(dot.getAttribute('data-idx')));
  });
});

// Autoplay
function startAutoplay() {
  clearInterval(autoplayTimer);
  autoplayTimer = setInterval(nextTestimonial, 5000);
}

function stopAutoplay() {
  clearInterval(autoplayTimer);
}

const testiSection = document.getElementById('testimonials');
if (testiSection) {
  testiSection.addEventListener('mouseenter', stopAutoplay);
  testiSection.addEventListener('mouseleave', startAutoplay);
}

// Touch/swipe support
let touchStartX = 0;
if (track) {
  track.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    stopAutoplay();
  }, { passive: true });

  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? nextTestimonial() : prevTestimonial();
    }
    startAutoplay();
  }, { passive: true });
}

// Handle resize
window.addEventListener('resize', () => {
  isMobile = window.innerWidth <= 768;
  goToTestimonial(currentTesti);
});

// Initialize
goToTestimonial(0);
startAutoplay();

// ============================================================
// 8. SCROLL REVEAL ANIMATIONS
// ============================================================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -60px 0px'
});

function setupReveal() {
  const elements = document.querySelectorAll(
    '.service-card, .portfolio-item, .process-step, .testimonial-card, ' +
    '.h2-feature-card, .value-item, .about-img, .contact-detail, ' +
    '.section-header, .hero-badge, .hero-stats .stat'
  );

  elements.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 4) * 0.1}s`;
    revealObserver.observe(el);
  });
}

// ============================================================
// 9. SMOOTH SCROLL FOR NAV LINKS
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navHeight = navbar.offsetHeight;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    }
  });
});

// ============================================================
// 10. CONTACT FORM SUBMISSION
// ============================================================
if (form) {
  form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Basic validation
    let valid = true;
    const requiredFields = form.querySelectorAll('[required]');

    requiredFields.forEach(field => {
      if (field.type === 'checkbox') {
        if (!field.checked) {
          valid = false;
          field.style.outline = '2px solid #e53e3e';
          setTimeout(() => field.style.outline = '', 3000);
        }
      } else if (!field.value.trim()) {
        valid = false;
        field.style.borderColor = '#e53e3e';
        field.style.boxShadow = '0 0 0 3px rgba(229, 62, 62, 0.1)';
        field.addEventListener('input', () => {
          field.style.borderColor = '';
          field.style.boxShadow = '';
        }, { once: true });
      }
    });

    if (!valid) return;

    // Simulate form submission
    const submitBtn = document.getElementById('form-submit');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Sending...</span>';
    submitBtn.style.opacity = '0.75';

    setTimeout(() => {
      submitBtn.style.display = 'none';
      formSuccess.style.display = 'block';
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
      form.reset();
    }, 1200);
  });
}

// ============================================================
// 11. PARTICLES / FLOATING DOTS FOR HERO
// ============================================================
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const count = 20;
  for (let i = 0; i < count; i++) {
    const dot = document.createElement('span');
    dot.style.cssText = `
      position: absolute;
      border-radius: 50%;
      pointer-events: none;
      animation: particleFloat ${4 + Math.random() * 6}s ease-in-out infinite;
      animation-delay: ${Math.random() * 5}s;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      width: ${2 + Math.random() * 4}px;
      height: ${2 + Math.random() * 4}px;
      background: ${Math.random() > 0.5 ? 'rgba(64, 145, 108, 0.3)' : 'rgba(184, 134, 11, 0.25)'};
      opacity: ${0.2 + Math.random() * 0.5};
    `;
    container.appendChild(dot);
  }
}

// Add particle float keyframe via JS
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes particleFloat {
    0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.3; }
    25% { transform: translate(${Math.random() > 0.5 ? '' : '-'}${10 + Math.random() * 20}px, -${10 + Math.random() * 20}px) rotate(90deg); opacity: 0.6; }
    50% { transform: translate(${Math.random() > 0.5 ? '' : '-'}${5 + Math.random() * 15}px, ${5 + Math.random() * 15}px) rotate(180deg); opacity: 0.4; }
    75% { transform: translate(${Math.random() > 0.5 ? '' : '-'}${8 + Math.random() * 18}px, -${3 + Math.random() * 12}px) rotate(270deg); opacity: 0.5; }
  }
`;
document.head.appendChild(styleSheet);

// ============================================================
// 12. HERO STATS COUNTER ANIMATION
// ============================================================
function animateCounter(el, target, duration) {
  const start = 0;
  const startTime = performance.now();
  const isPlus = el.textContent.includes('+');

  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);
    el.textContent = current + (isPlus ? '+' : '');
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const stats = entry.target.querySelectorAll('.stat strong');
      stats.forEach(stat => {
        const raw = stat.textContent.replace('+', '');
        const num = parseInt(raw);
        if (!isNaN(num)) {
          animateCounter(stat, num, 1500);
        }
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

// ============================================================
// 13. PROCESS STEP ANIMATIONS
// ============================================================
const processObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateX(0)';
      }, index * 150);
      processObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.process-step').forEach((step, i) => {
  step.style.opacity = '0';
  step.style.transform = 'translateX(-30px)';
  step.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
  processObserver.observe(step);
});

// ============================================================
// 14. INITIALIZATION
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  createParticles();
  setupReveal();

  // Set initial dir label (show active mode)
  dirLabel.textContent = isRTL ? 'RTL' : 'LTR';
});

// Also run on window load as fallback
window.addEventListener('load', () => {
  createParticles();
  setupReveal();
});
