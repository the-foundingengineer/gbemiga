/* ═══════════════════════════════════════════════
   GBEMIGA PORTFOLIO — SHARED JS
   ═══════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Hamburger / mobile drawer ── */
  const hamburger = document.getElementById('hamburger');
  const drawer    = document.getElementById('nav-drawer');

  function openDrawer() {
    drawer.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    // animate spans → X
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity   = '';
    spans[2].style.transform = '';
  }

  if (hamburger && drawer) {
    hamburger.addEventListener('click', () => {
      drawer.classList.contains('open') ? closeDrawer() : openDrawer();
    });

    // close on drawer link click
    drawer.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', closeDrawer);
    });

    // close on Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) closeDrawer();
    });

    // close on backdrop click (outside drawer content)
    drawer.addEventListener('click', e => {
      if (e.target === drawer) closeDrawer();
    });
  }

  /* ── Sticky nav background on scroll ── */
  const nav = document.getElementById('site-nav');
  if (nav) {
    let lastY = 0;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      // hide nav when scrolling down fast, show when going up
      if (y > lastY + 10 && y > 80) {
        nav.style.top = '-80px';
      } else if (y < lastY - 4 || y < 80) {
        nav.style.top = '24px';
      }
      lastY = y;
    }, { passive: true });
  }

  /* ── Project filter tabs ── */
  const filterTabs = document.querySelectorAll('.filter-tab');
  const projectGrid = document.getElementById('project-grid');

  if (filterTabs.length && projectGrid) {
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const filter = tab.dataset.filter;

        // update tab active state
        filterTabs.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        // show / hide cards with a quick fade
        const cards = projectGrid.querySelectorAll('.project-card');
        cards.forEach(card => {
          const match = filter === 'all' || card.dataset.category === filter;
          if (match) {
            card.style.display = '';
            // trigger reflow then fade in
            requestAnimationFrame(() => {
              card.style.opacity  = '0';
              card.style.transform = 'translateY(8px)';
              requestAnimationFrame(() => {
                card.style.transition = 'opacity .25s, transform .25s';
                card.style.opacity    = '1';
                card.style.transform  = '';
              });
            });
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /* ── Smooth scroll for same-page anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80; // nav height clearance
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── Active nav link highlighting (index.html only — section observer) ── */
  const sections = document.querySelectorAll('section[id]');
  if (sections.length) {
    const navLinks = document.querySelectorAll('.nav-links .nav-link, .nav-drawer .nav-link');

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            // only manage links that point to same-page anchors
            if (link.getAttribute('href').startsWith('#')) {
              link.classList.toggle('active', link.getAttribute('href') === '#' + id);
            }
          });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });

    sections.forEach(s => observer.observe(s));
  }
})();
