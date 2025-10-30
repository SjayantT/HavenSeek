document.addEventListener("DOMContentLoaded", () => {
    const revealElements = document.querySelectorAll(".scroll-reveal");

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        } else {
          entry.target.classList.remove("visible");
        }
      });
    }, { threshold: 0.2 });

    revealElements.forEach(el => observer.observe(el));

    // 👇 Force hero section to animate on load
    const heroTexts = document.querySelectorAll(".hero .scroll-reveal");
    heroTexts.forEach(el => setTimeout(() => el.classList.add("visible"), 300));
  });

  document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById('menu-btn');
    const iconOpen = document.getElementById('icon-open');
    const iconClose = document.getElementById('icon-close');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeBtn = document.getElementById('close-btn');

    if (!menuBtn || !iconOpen || !iconClose || !mobileMenu || !closeBtn) {
      console.warn('Navbar toggle: missing element(s)', { menuBtn, iconOpen, iconClose, mobileMenu, closeBtn });
      return;
    }

    const openMenu = () => {
      mobileMenu.classList.remove('translate-x-full');
      mobileMenu.classList.add('translate-x-0');
      iconOpen.classList.add('hidden');
      iconClose.classList.remove('hidden');
      menuBtn.setAttribute('aria-expanded', 'true');
      mobileMenu.setAttribute('aria-hidden', 'false');
      // prevent background scrolling
      document.documentElement.classList.add('overflow-hidden');
      document.body.classList.add('overflow-hidden');
    };

    const closeMenu = () => {
      mobileMenu.classList.remove('translate-x-0');
      mobileMenu.classList.add('translate-x-full');
      iconOpen.classList.remove('hidden');
      iconClose.classList.add('hidden');
      menuBtn.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.documentElement.classList.remove('overflow-hidden');
      document.body.classList.remove('overflow-hidden');
    };

    menuBtn.addEventListener('click', (e) => {
      const isOpen = menuBtn.getAttribute('aria-expanded') === 'true';
      if (isOpen) closeMenu(); else openMenu();
    });

    closeBtn.addEventListener('click', closeMenu);

    // Close when any mobile link is clicked
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });

    // Close when clicking outside the drawer
    document.addEventListener('click', (e) => {
      if (mobileMenu.classList.contains('translate-x-0')) {
        // if click target is outside mobileMenu and not the menuBtn
        if (!mobileMenu.contains(e.target) && !menuBtn.contains(e.target)) {
          closeMenu();
        }
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('translate-x-0')) {
        closeMenu();
      }
    });
  });