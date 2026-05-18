const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');
const navLinks = document.querySelectorAll('.site-nav a');
const revealElements = document.querySelectorAll('.reveal');
const accordion = document.querySelector('[data-accordion]');
const galleryTabs = document.querySelectorAll('[data-gallery-target]');
const galleryPanels = document.querySelectorAll('[data-gallery-panel]');

const closeMenu = () => {
  siteNav.classList.remove('is-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open menu');
};

const openMenu = () => {
  siteNav.classList.add('is-open');
  menuToggle.setAttribute('aria-expanded', 'true');
  menuToggle.setAttribute('aria-label', 'Close menu');
};

menuToggle.addEventListener('click', () => {
  const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
  if (expanded) {
    closeMenu();
  } else {
    openMenu();
  }
});

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    closeMenu();
  });
});

accordion.addEventListener('click', (event) => {
  const trigger = event.target.closest('.accordion-trigger');
  if (!trigger) {
    return;
  }

  const isOpen = trigger.getAttribute('aria-expanded') === 'true';
  const panel = trigger.nextElementSibling;

  accordion.querySelectorAll('.accordion-trigger').forEach((button) => {
    button.setAttribute('aria-expanded', 'false');
  });

  accordion.querySelectorAll('.accordion-panel').forEach((content) => {
    content.hidden = true;
  });

  if (!isOpen) {
    trigger.setAttribute('aria-expanded', 'true');
    panel.hidden = false;
  }
});

galleryTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.galleryTarget;

    galleryTabs.forEach((button) => {
      const isActive = button === tab;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-selected', String(isActive));
    });

    galleryPanels.forEach((panel) => {
      const isTarget = panel.dataset.galleryPanel === target;
      panel.classList.toggle('is-active', isTarget);
      panel.hidden = !isTarget;
    });
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.18
});

revealElements.forEach((element) => observer.observe(element));

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeMenu();
  }
});
