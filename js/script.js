/* =====================================================================
   SOCCER STARS FOOTBALL ACADEMY — SCRIPT
   Plain vanilla JavaScript. No frameworks, no external libraries.
   Everything below is organised into small, independent functions that
   are each called once from the bottom of this file.
   ===================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* -------------------------------------------------------------
     1. Missing-image placeholders
     If an <img class="ph-img"> fails to load (because the real
     photo hasn't been added yet), mark its parent .img-frame as
     "missing" so the CSS placeholder pattern + label shows instead.
  ----------------------------------------------------------------*/
  function setupImagePlaceholders() {
    var images = document.querySelectorAll('.ph-img');
    images.forEach(function (img) {
      var frame = img.closest('.img-frame');
      if (frame) frame.classList.add('is-image-loading');

      function markImageLoaded() {
        if (frame) frame.classList.remove('is-image-loading');
      }

      img.addEventListener('load', markImageLoaded);
      img.addEventListener('error', function () {
        if (frame) frame.classList.add('img-frame--missing');
      });
      // Video poster images use the same pattern via a plain <img> check.
      if (img.complete) {
        if (img.naturalWidth === 0) {
          if (frame) frame.classList.add('img-frame--missing');
        } else {
          markImageLoaded();
        }
      }
    });
  }

  /* -------------------------------------------------------------
     2. Mobile hamburger navigation
  ----------------------------------------------------------------*/
  function setupMobileNav() {
    var hamburger = document.getElementById('hamburgerBtn');
    var nav = document.getElementById('mainNav');
    if (!hamburger || !nav) return;

    function closeMenu() {
      nav.classList.remove('is-open');
      hamburger.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
    }

    hamburger.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      hamburger.classList.toggle('is-open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    // Close the mobile menu whenever a nav link is chosen.
    nav.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    // Close if the window is resized back to desktop width.
    window.addEventListener('resize', function () {
      if (window.innerWidth > 960) closeMenu();
    });
  }

  /* -------------------------------------------------------------
     3. Automatic hero image slider
  ----------------------------------------------------------------*/
  function setupHeroSlider() {
    var slides = document.querySelectorAll('.hero__slide');
    if (!slides.length) return;

    var currentIndex = 0;

    function showSlide(index) {
      slides.forEach(function (slide, slideIndex) {
        var isActive = slideIndex === index;
        slide.classList.toggle('is-active', isActive);
        slide.setAttribute('aria-hidden', String(!isActive));
      });
    }

    showSlide(currentIndex);

    window.setInterval(function () {
      currentIndex = (currentIndex + 1) % slides.length;
      showSlide(currentIndex);
    }, 4000);
  }

  /* -------------------------------------------------------------
     4. Smooth scrolling for on-page anchor links
     (html { scroll-behavior: smooth } already handles most of this,
     this adds a small offset correction for older browsers.)
  ----------------------------------------------------------------*/
  function setupSmoothScroll() {
    var links = document.querySelectorAll('a[href^="#"]');
    links.forEach(function (link) {
      link.addEventListener('click', function (e) {
        var targetId = link.getAttribute('href');
        if (targetId.length < 2) return;
        var target = document.querySelector(targetId);
        if (!target) return;
        e.preventDefault();
        var headerHeight = document.getElementById('siteHeader').offsetHeight;
        var top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight + 1;
        window.scrollTo({ top: top, behavior: 'smooth' });
      });
    });
  }

  /* -------------------------------------------------------------
     4. Active navigation link on scroll
  ----------------------------------------------------------------*/
  function setupActiveNavLink() {
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.nav-link');
    if (!sections.length || !navLinks.length) return;

    var headerHeight = document.getElementById('siteHeader').offsetHeight;

    function onScroll() {
      var scrollPos = window.pageYOffset + headerHeight + 30;
      var currentId = sections[0].id;

      sections.forEach(function (section) {
        if (section.offsetTop <= scrollPos) {
          currentId = section.id;
        }
      });

      navLinks.forEach(function (link) {
        var isActive = link.getAttribute('href') === '#' + currentId;
        link.classList.toggle('is-active', isActive);
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* -------------------------------------------------------------
     5. Navbar appearance change on scroll
  ----------------------------------------------------------------*/
  function setupHeaderScrollState() {
    var header = document.getElementById('siteHeader');
    if (!header) return;

    function onScroll() {
      header.classList.toggle('is-scrolled', window.pageYOffset > 12);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* -------------------------------------------------------------
     6. Scroll reveal animations
     Adds .reveal to major content blocks, then reveals each one
     the first time it enters the viewport using IntersectionObserver.
  ----------------------------------------------------------------*/
  function setupScrollReveal() {
    var targets = document.querySelectorAll(
      '.about__media, .about__copy, .program-card, .training__item, ' +
      '.festival-card, .festivals__past-photo, .gallery__item, ' +
      '.why-card, .testimonial, .donate__copy, .donate__panel, .executive-card'
    );
    if (!targets.length) return;

    targets.forEach(function (el) { el.classList.add('reveal'); });

    if (!('IntersectionObserver' in window)) {
      targets.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    targets.forEach(function (el) { observer.observe(el); });
  }

  /* -------------------------------------------------------------
     7. Animated stat counters (about section)
  ----------------------------------------------------------------*/
  function setupStatCounters() {
    var stats = document.querySelectorAll('.stat__number');
    if (!stats.length) return;

    function animateCount(el) {
      var target = parseInt(el.getAttribute('data-count'), 10) || 0;
      var duration = 1200;
      var startTime = null;

      function step(timestamp) {
        if (startTime === null) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        el.textContent = Math.floor(progress * target);
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          el.textContent = target;
        }
      }
      window.requestAnimationFrame(step);
    }

    if (!('IntersectionObserver' in window)) {
      stats.forEach(animateCount);
      return;
    }

    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    stats.forEach(function (el) { observer.observe(el); });
  }

  /* -------------------------------------------------------------
     8. Gallery lightbox
  ----------------------------------------------------------------*/
  function setupGalleryLightbox() {
    var items = Array.prototype.slice.call(document.querySelectorAll('.gallery__item'));
    var lightbox = document.getElementById('lightbox');
    if (!items.length || !lightbox) return;

    var lightboxImage = document.getElementById('lightboxImage');
    var lightboxCaption = document.getElementById('lightboxCaption');
    var closeBtn = document.getElementById('lightboxClose');
    var prevBtn = document.getElementById('lightboxPrev');
    var nextBtn = document.getElementById('lightboxNext');
    var currentIndex = 0;

    function openLightbox(index) {
      currentIndex = index;
      var item = items[currentIndex];
      lightboxImage.src = item.getAttribute('data-full') || item.querySelector('img').src;
      lightboxImage.alt = item.querySelector('img').alt || '';
      lightboxCaption.textContent = item.getAttribute('data-caption') || '';
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    }

    function closeLightbox() {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    function showNext() {
      currentIndex = (currentIndex + 1) % items.length;
      openLightbox(currentIndex);
    }

    function showPrev() {
      currentIndex = (currentIndex - 1 + items.length) % items.length;
      openLightbox(currentIndex);
    }

    items.forEach(function (item, index) {
      item.addEventListener('click', function () { openLightbox(index); });
    });

    closeBtn.addEventListener('click', closeLightbox);
    nextBtn.addEventListener('click', showNext);
    prevBtn.addEventListener('click', showPrev);

    // Click outside the image (on the dark backdrop) closes the lightbox.
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    // Keyboard controls: Escape closes, arrow keys navigate.
    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
    });
  }

  /* -------------------------------------------------------------
     9. Contact form validation
  ----------------------------------------------------------------*/
  function setupContactForm() {
    var form = document.getElementById('contactForm');
    if (!form) return;

    var successMessage = document.getElementById('formSuccess');

    var validators = {
      fullName: function (value) {
        return value.trim().length >= 2 ? '' : 'Please enter your full name.';
      },
      email: function (value) {
        var pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(value.trim()) ? '' : 'Please enter a valid email address.';
      },
      phone: function (value) {
        var digits = value.replace(/[^0-9]/g, '');
        return digits.length >= 7 ? '' : 'Please enter a valid phone number.';
      },
      playerAge: function (value) {
        var age = Number(value);
        return value !== '' && age >= 3 && age <= 19 ? '' : 'Please enter an age between 3 and 19.';
      },
      message: function (value) {
        return value.trim().length >= 10 ? '' : 'Please add a short message (at least 10 characters).';
      }
    };

    function showError(fieldName, message) {
      var input = form.elements[fieldName];
      var errorEl = form.querySelector('[data-error-for="' + fieldName + '"]');
      if (input) input.classList.toggle('is-invalid', Boolean(message));
      if (errorEl) errorEl.textContent = message;
    }

    function validateField(fieldName) {
      var input = form.elements[fieldName];
      if (!input || !validators[fieldName]) return true;
      var message = validators[fieldName](input.value);
      showError(fieldName, message);
      return message === '';
    }

    // Validate a field as soon as the user leaves it.
    Object.keys(validators).forEach(function (fieldName) {
      var input = form.elements[fieldName];
      if (!input) return;
      input.addEventListener('blur', function () { validateField(fieldName); });
      input.addEventListener('input', function () {
        if (input.classList.contains('is-invalid')) validateField(fieldName);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      successMessage.textContent = '';

      var isFormValid = Object.keys(validators).every(function (fieldName) {
        return validateField(fieldName);
      });

      if (!isFormValid) {
        var firstInvalid = form.querySelector('.is-invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // No backend is connected yet — this simply confirms submission
      // and resets the form. Replace this block with a real request
      // (e.g. fetch()) once a server endpoint is available.
      successMessage.textContent = 'Thank you! Your message has been received — we will get back to you soon.';
      form.reset();
    });
  }

  /* -------------------------------------------------------------
     10. Back-to-top button
  ----------------------------------------------------------------*/
  function setupBackToTop() {
    var button = document.getElementById('backToTop');
    if (!button) return;

    function onScroll() {
      button.classList.toggle('is-visible', window.pageYOffset > 500);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    button.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* -------------------------------------------------------------
     11. Donate button placeholder behaviour
     Until real payment details / a payment processor are wired up,
     this simply scrolls to the "How to Donate" panel instead of
     linking to a dead "#" URL.
  ----------------------------------------------------------------*/
  function setupDonateButton() {
    var donateBtn = document.getElementById('donateBtn');
    var panel = document.querySelector('.donate__panel');
    if (!donateBtn || !panel) return;

    donateBtn.addEventListener('click', function (e) {
      e.preventDefault();
      var headerHeight = document.getElementById('siteHeader').offsetHeight;
      var top = panel.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  }

  /* -------------------------------------------------------------
     12. Footer year
  ----------------------------------------------------------------*/
  function setupFooterYear() {
    var yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  /* -------------------------------------------------------------
     Run everything
  ----------------------------------------------------------------*/
  setupImagePlaceholders();
  setupHeroSlider();
  setupMobileNav();
  setupSmoothScroll();
  setupActiveNavLink();
  setupHeaderScrollState();
  setupScrollReveal();
  setupStatCounters();
  setupGalleryLightbox();
  setupContactForm();
  setupBackToTop();
  setupDonateButton();
  setupFooterYear();

});
