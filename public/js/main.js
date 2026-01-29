/**
 * Main JavaScript - Tom Plumb Landing Page
 * Page interactions, smooth scrolling, FAQ accordion, lazy loading
 */

// Smooth Scroll to Form
function scrollToForm() {
  const formSection = document.getElementById('contact');
  if (formSection) {
    formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Focus on first form field after scroll
    setTimeout(() => {
      const nameField = document.getElementById('name');
      if (nameField) {
        nameField.focus();
      }
    }, 800);
  }
}

// Make scrollToForm available globally for inline onclick handlers
window.scrollToForm = scrollToForm;

// Smooth Scroll for Anchor Links
function initializeSmoothScroll() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');

      // Skip empty or just '#' links
      if (!href || href === '#') return;

      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// FAQ Accordion Toggle
function initializeFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');

    if (question) {
      question.addEventListener('click', function() {
        // Close other items
        faqItems.forEach(otherItem => {
          if (otherItem !== item && otherItem.classList.contains('active')) {
            otherItem.classList.remove('active');
          }
        });

        // Toggle current item
        item.classList.toggle('active');

        // Track FAQ interaction
        if (item.classList.contains('active') && window.gtag) {
          const questionText = question.querySelector('span')?.textContent || 'Unknown';
          window.gtag('event', 'faq_expand', {
            'event_category': 'Engagement',
            'event_label': questionText
          });
        }
      });
    }
  });
}

// Sticky Header on Scroll
function initializeStickyHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  let lastScrollTop = 0;
  let scrollThreshold = 100;

  window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > scrollThreshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    lastScrollTop = scrollTop;
  });
}

// Lazy Load Images
function initializeLazyLoading() {
  const lazyImages = document.querySelectorAll('img[data-src]');

  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.getAttribute('data-src');

          if (src) {
            img.src = src;
            img.removeAttribute('data-src');
            observer.unobserve(img);
          }
        }
      });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
  } else {
    // Fallback for browsers without IntersectionObserver
    lazyImages.forEach(img => {
      const src = img.getAttribute('data-src');
      if (src) {
        img.src = src;
        img.removeAttribute('data-src');
      }
    });
  }
}

// Animate on Scroll (Optional Enhancement)
function initializeScrollAnimations() {
  if (!('IntersectionObserver' in window)) return;

  const animatedElements = document.querySelectorAll(
    '.benefit-card, .testimonial-card, .education-card, .offer-card'
  );

  const animationObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '0';
          entry.target.style.transform = 'translateY(20px)';
          entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, 100);

          animationObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }
  );

  animatedElements.forEach(el => animationObserver.observe(el));
}

// Track Scroll Depth (for analytics)
function initializeScrollTracking() {
  if (!window.gtag) return;

  const scrollDepths = [25, 50, 75, 100];
  const tracked = new Set();

  window.addEventListener('scroll', function() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollPercentage = ((scrollTop + windowHeight) / documentHeight) * 100;

    scrollDepths.forEach(depth => {
      if (scrollPercentage >= depth && !tracked.has(depth)) {
        tracked.add(depth);
        window.gtag('event', 'scroll_depth', {
          'event_category': 'Engagement',
          'event_label': `${depth}%`,
          'value': depth
        });
      }
    });
  });
}

// Initialize CTA Button Tracking
function initializeCTATracking() {
  const ctaButtons = document.querySelectorAll('.cta-button');

  ctaButtons.forEach(button => {
    button.addEventListener('click', function() {
      const buttonText = this.textContent.trim();

      if (window.gtag) {
        window.gtag('event', 'cta_click', {
          'event_category': 'Engagement',
          'event_label': buttonText
        });
      }
    });
  });
}

// Check if user came from ad campaign
function checkCampaignSource() {
  const urlParams = new URLSearchParams(window.location.search);
  const utmSource = urlParams.get('utm_source');
  const utmMedium = urlParams.get('utm_medium');
  const utmCampaign = urlParams.get('utm_campaign');

  if (utmSource || utmMedium || utmCampaign) {
    // Store campaign data in sessionStorage for form submission
    sessionStorage.setItem('campaign_source', utmSource || '');
    sessionStorage.setItem('campaign_medium', utmMedium || '');
    sessionStorage.setItem('campaign_name', utmCampaign || '');

    // Track page view with campaign data
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        'campaign_source': utmSource,
        'campaign_medium': utmMedium,
        'campaign_name': utmCampaign
      });
    }
  }
}

// Add urgency countdown (optional enhancement)
function addUrgencyCountdown() {
  const urgencyBanner = document.querySelector('.urgency-banner');
  if (!urgencyBanner) return;

  // Calculate same-day cutoff (e.g., 3 PM)
  const now = new Date();
  const cutoffHour = 15; // 3 PM
  const cutoff = new Date(now.getFullYear(), now.getMonth(), now.getDate(), cutoffHour, 0, 0);

  if (now < cutoff) {
    const timeRemaining = cutoff - now;
    const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60));
    const minutesRemaining = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));

    if (hoursRemaining > 0) {
      const spanElement = urgencyBanner.querySelector('span');
      if (spanElement) {
        spanElement.textContent = `Call within ${hoursRemaining}h ${minutesRemaining}m for same-day installation!`;
      }
    }
  }
}

// Initialize all features when DOM is ready
function initializeApp() {
  // Core functionality
  initializeSmoothScroll();
  initializeFAQ();
  initializeStickyHeader();
  initializeLazyLoading();

  // Enhanced features
  initializeCTATracking();
  initializeScrollTracking();

  // Optional animations (disable if prefers-reduced-motion)
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion) {
    initializeScrollAnimations();
  }

  // Campaign tracking
  checkCampaignSource();

  // Urgency messaging
  addUrgencyCountdown();

  // Log initialization
  console.log('Tom Plumb Landing Page initialized successfully');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

// Handle page visibility changes (track time on page)
let pageStartTime = Date.now();

document.addEventListener('visibilitychange', function() {
  if (document.hidden) {
    const timeOnPage = Math.round((Date.now() - pageStartTime) / 1000);

    if (window.gtag && timeOnPage > 10) {
      window.gtag('event', 'time_on_page', {
        'event_category': 'Engagement',
        'event_label': 'Time Spent (seconds)',
        'value': timeOnPage
      });
    }
  } else {
    pageStartTime = Date.now();
  }
});
