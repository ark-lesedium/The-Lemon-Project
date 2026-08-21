/* ==========================================================================
   The Lemon Project — shared site behaviour
   Nav toggle, GSAP ScrollTrigger reveals, guide accordions.
   ========================================================================== */
(function () {
  // ---- mobile nav toggle ----
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
    navLinks.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => navLinks.classList.remove('open'))
    );
  }

  // ---- scroll reveal animations ----
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray('.reveal').forEach((el, i) => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
        delay: (i % 3) * 0.05,
        scrollTrigger: { trigger: el, start: 'top 88%' },
      });
    });

    gsap.utils.toArray('.reveal-scale').forEach((el, i) => {
      gsap.to(el, {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: 'back.out(1.6)',
        delay: (i % 6) * 0.06,
        scrollTrigger: { trigger: el, start: 'top 90%' },
      });
    });

    // stat number count-up
    gsap.utils.toArray('.stat-card .num').forEach((el) => {
      const raw = el.textContent.trim();
      const match = raw.match(/[\d,]+/);
      if (!match) return;
      const target = parseInt(match[0].replace(/,/g, ''), 10);
      const prefix = raw.slice(0, match.index);
      const suffix = raw.slice(match.index + match[0].length);
      const counter = { val: 0 };
      ScrollTrigger.create({
        trigger: el,
        start: 'top 90%',
        once: true,
        onEnter: () => {
          gsap.to(counter, {
            val: target,
            duration: 1.2,
            ease: 'power2.out',
            onUpdate: () => {
              el.textContent = prefix + Math.floor(counter.val).toLocaleString() + suffix;
            },
          });
        },
      });
    });
  } else {
    // fallback: just show everything if GSAP failed to load
    document.querySelectorAll('.reveal, .reveal-scale').forEach((el) => {
      el.style.opacity = 1;
      el.style.transform = 'none';
    });
  }

  // ---- guide accordions ----
  document.querySelectorAll('.guide-head').forEach((head) => {
    head.addEventListener('click', () => {
      const guide = head.closest('.guide');
      const body = guide.querySelector('.guide-body');
      const isOpen = guide.classList.contains('open');

      document.querySelectorAll('.guide.open').forEach((g) => {
        if (g !== guide) {
          g.classList.remove('open');
          g.querySelector('.guide-body').style.maxHeight = null;
        }
      });

      guide.classList.toggle('open', !isOpen);
      body.style.maxHeight = !isOpen ? body.scrollHeight + 'px' : null;
    });
  });

  // open guide from URL hash (e.g. guides.html#cleaning-spray)
  window.addEventListener('DOMContentLoaded', () => {
    if (!location.hash) return;
    const target = document.querySelector(location.hash);
    if (target && target.classList.contains('guide')) {
      const head = target.querySelector('.guide-head');
      head && head.click();
      setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), 200);
    }
  });
})();
