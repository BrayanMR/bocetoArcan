/**
 * ARCA STREAMING PLATFORM - SYSTEM CONTROLLER (NAVBAR + FOOTER)
 * Arquitectura modular ES6+ (Angular Component Integration Ready)
 */

document.addEventListener('DOMContentLoaded', () => {
  
  // --------------------------------------------------------------------------
  // 1. STATE MANAGEMENT
  // --------------------------------------------------------------------------
  const state = {
    activeItem: 'inicio', // 'inicio' | 'live' | 'stations' | 'programs' | 'podcasts'
    currentTheme: 'dark', // 'dark' | 'light'
    viewMode: 'interactive' // 'interactive' | 'sheet'
  };

  // --------------------------------------------------------------------------
  // 2. DOM ELEMENTS REF
  // --------------------------------------------------------------------------
  const htmlElement = document.documentElement;

  // Desktop Nav & Lamp
  const desktopNavList = document.getElementById('desktop-nav-list');
  const desktopNavLinks = document.querySelectorAll('#desktop-nav-list .arca-nav-link');
  const lampDesktop = document.getElementById('lamp-desktop');

  // Mobile Nav & Lamp
  const mobileNavCapsule = document.querySelector('.arca-mobile-capsule');
  const mobileNavItems = document.querySelectorAll('.arca-mobile-item');
  const lampMobile = document.getElementById('lamp-mobile');

  // Footer Links
  const footerLinks = document.querySelectorAll('.footer-link[data-nav]');

  // Display Cards & Controls
  const activeItemNameDisplay = document.getElementById('active-item-name');
  const pillBtns = document.querySelectorAll('#active-item-pills .pill-btn');
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const navThemeToggleBtn = document.getElementById('btn-nav-theme-toggle');
  const themeLabelText = document.getElementById('theme-label-text');

  // Views Toggle
  const viewInteractiveBtn = document.getElementById('view-interactive-btn');
  const viewSheetBtn = document.getElementById('view-sheet-btn');
  const interactiveWorkspace = document.getElementById('interactive-workspace');
  const sheetWorkspace = document.getElementById('sheet-workspace');

  // --------------------------------------------------------------------------
  // 3. LAMP EFFECT SPOTLIGHT CALCULATOR
  // --------------------------------------------------------------------------
  
  function updateDesktopLampPosition() {
    if (!desktopNavList || !lampDesktop) return;

    const activeNavBtn = document.querySelector(`#desktop-nav-list .arca-nav-link[data-nav="${state.activeItem}"]`);
    if (!activeNavBtn) return;

    const navListRect = desktopNavList.getBoundingClientRect();
    const activeBtnRect = activeNavBtn.getBoundingClientRect();

    const relativeLeft = activeBtnRect.left - navListRect.left;
    const btnWidth = activeBtnRect.width;

    lampDesktop.style.transform = `translateX(${relativeLeft}px)`;
    lampDesktop.style.width = `${btnWidth}px`;
    lampDesktop.style.opacity = '1';
  }

  function updateMobileLampPosition() {
    if (!mobileNavCapsule || !lampMobile) return;

    const activeMobileBtn = document.querySelector(`.arca-mobile-item[data-nav="${state.activeItem}"]`);
    if (!activeMobileBtn) return;

    const capsuleRect = mobileNavCapsule.getBoundingClientRect();
    const activeBtnRect = activeMobileBtn.getBoundingClientRect();

    const relativeLeft = activeBtnRect.left - capsuleRect.left;
    const btnWidth = activeBtnRect.width;

    lampMobile.style.transform = `translateX(${relativeLeft}px)`;
    lampMobile.style.width = `${btnWidth}px`;
    lampMobile.style.opacity = '1';
  }

  function updateLampPositions() {
    updateDesktopLampPosition();
    updateMobileLampPosition();
  }

  // --------------------------------------------------------------------------
  // 4. ACTIVE STATE DISPATCHER
  // --------------------------------------------------------------------------
  
  function setActiveNav(navId) {
    if (!navId) return;
    state.activeItem = navId;

    // A. Actualizar Links Desktop
    desktopNavLinks.forEach(link => {
      const isSelected = link.getAttribute('data-nav') === navId;
      link.classList.toggle('active', isSelected);
      link.setAttribute('aria-selected', isSelected ? 'true' : 'false');
    });

    // B. Actualizar Items Mobile
    mobileNavItems.forEach(item => {
      const isSelected = item.getAttribute('data-nav') === navId;
      item.classList.toggle('active', isSelected);
      item.setAttribute('aria-selected', isSelected ? 'true' : 'false');
    });

    // C. Actualizar Botones Showcase Studio
    pillBtns.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-item') === navId);
    });

    // D. Actualizar Nombre de la sección en la tarjeta de demostración
    if (activeItemNameDisplay) {
      const labelMap = {
        'inicio': 'INICIO',
        'live': 'EN VIVO',
        'stations': 'ESTACIONES',
        'programs': 'PROGRAMAS',
        'podcasts': 'PODCASTS'
      };
      activeItemNameDisplay.textContent = labelMap[navId] || navId.toUpperCase();
    }

    // E. Animar Desplazamiento de la Lámpara
    updateLampPositions();
  }

  // --------------------------------------------------------------------------
  // 5. THEME SWITCHER SYSTEM (DARK / LIGHT MODE)
  // --------------------------------------------------------------------------
  
  function setTheme(theme) {
    state.currentTheme = theme;
    htmlElement.setAttribute('data-theme', theme);
    
    if (themeLabelText) {
      themeLabelText.textContent = theme === 'dark' ? 'Dark Mode' : 'Light Mode';
    }

    setTimeout(updateLampPositions, 50);
  }

  function toggleTheme() {
    const nextTheme = state.currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  }

  // --------------------------------------------------------------------------
  // 6. EVENT LISTENERS & INTERACTION BINDINGS
  // --------------------------------------------------------------------------

  // Clics en Desktop Navigation Links
  desktopNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const navTarget = link.getAttribute('data-nav');
      setActiveNav(navTarget);
    });
  });

  // Clics en Mobile Bottom Navigation Items
  mobileNavItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const navTarget = item.getAttribute('data-nav');
      setActiveNav(navTarget);
    });
  });

  // Clics en Footer Links con data-nav
  footerLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const navTarget = link.getAttribute('data-nav');
      setActiveNav(navTarget);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // Clics en los Pills del Showcase Bar
  pillBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.getAttribute('data-item');
      setActiveNav(item);
    });
  });

  // Eventos de Cambio de Tema
  if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);
  if (navThemeToggleBtn) navThemeToggleBtn.addEventListener('click', toggleTheme);

  // Selector de Vistas
  if (viewInteractiveBtn && viewSheetBtn) {
    viewInteractiveBtn.addEventListener('click', () => {
      viewInteractiveBtn.classList.add('active');
      viewSheetBtn.classList.remove('active');
      interactiveWorkspace.classList.remove('hidden');
      sheetWorkspace.classList.add('hidden');
      setTimeout(updateLampPositions, 100);
    });

    viewSheetBtn.addEventListener('click', () => {
      viewSheetBtn.classList.add('active');
      viewInteractiveBtn.classList.remove('active');
      sheetWorkspace.classList.remove('hidden');
      interactiveWorkspace.classList.add('hidden');
    });
  }

  // --------------------------------------------------------------------------
  // 7. KEYBOARD ACCESSIBILITY & WINDOW RESIZE ADAPTABILITY
  // --------------------------------------------------------------------------

  desktopNavList.addEventListener('keydown', (e) => {
    const items = Array.from(desktopNavLinks);
    const currentIndex = items.indexOf(document.activeElement);

    if (currentIndex !== -1) {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % items.length;
        items[nextIndex].focus();
        setActiveNav(items[nextIndex].getAttribute('data-nav'));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prevIndex = (currentIndex - 1 + items.length) % items.length;
        items[prevIndex].focus();
        setActiveNav(items[prevIndex].getAttribute('data-nav'));
      }
    }
  });

  window.addEventListener('resize', () => {
    updateLampPositions();
  });

  // --------------------------------------------------------------------------
  // 8. INITIALIZATION
  // --------------------------------------------------------------------------
  setActiveNav('inicio');
  setTimeout(updateLampPositions, 150);
});
