/**
 * ARCA HOME PAGE - CONTROLLER
 * Página Principal de ARCA Radio Streaming Platform
 */

document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================================================
  // 1. STATE MANAGEMENT
  // ==========================================================================
  const homeState = {
    isPlaying: false,
    currentStation: 'arca-965',
    theme: 'dark'
  };

  // ==========================================================================
  // 2. DOM ELEMENTS REF
  // ==========================================================================
  
  // Hero Section
  const heroSection = document.getElementById('hero-arca');
  const heroPlayBtn = document.getElementById('hero-play-btn');
  const heroVideoBtn = document.getElementById('hero-video-btn');
  
  // Player Highlight
  const highlightPlayBtn = document.getElementById('highlight-play-btn');
  
  // CTA Button
  const ctaListenBtn = document.getElementById('cta-listen-btn');
  
  // Theme Toggle
  const navThemeToggle = document.getElementById('btn-nav-theme-toggle');

  // ==========================================================================
  // 3. PLAYBACK STATE MANAGER
  // ==========================================================================
  
  function setPlayingState(isPlaying) {
    homeState.isPlaying = isPlaying;
    
    if (heroSection) {
      if (isPlaying) {
        heroSection.classList.add('is-playing');
      } else {
        heroSection.classList.remove('is-playing');
      }
    }
    
    // Update all play buttons icons
    updatePlayButtons(isPlaying);
  }
  
  function togglePlayback() {
    setPlayingState(!homeState.isPlaying);
  }
  
  function updatePlayButtons(isPlaying) {
    const playButtons = [
      heroPlayBtn,
      highlightPlayBtn,
      ...document.querySelectorAll('.btn-play-station'),
      ...document.querySelectorAll('.btn-play-overlay'),
      ...document.querySelectorAll('.btn-play-podcast'),
      ...document.querySelectorAll('.btn-play-video')
    ];
    
    playButtons.forEach(btn => {
      if (!btn) return;
      
      const svg = btn.querySelector('svg');
      if (!svg) return;
      
      if (isPlaying && btn === heroPlayBtn) {
        // Change to pause icon
        svg.innerHTML = '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>';
      } else if (btn === heroPlayBtn) {
        // Change to play icon
        svg.innerHTML = '<polygon points="5 3 19 12 5 21 5 3"/>';
      }
    });
  }

  // ==========================================================================
  // 4. INTERACTION HANDLERS
  // ==========================================================================
  
  // Hero Play Button
  if (heroPlayBtn) {
    heroPlayBtn.addEventListener('click', () => {
      togglePlayback();
      
      // Show feedback animation
      heroPlayBtn.style.transform = 'scale(0.95)';
      setTimeout(() => {
        heroPlayBtn.style.transform = '';
      }, 150);
    });
  }
  
  // Hero Video Button
  if (heroVideoBtn) {
    heroVideoBtn.addEventListener('click', () => {
      // Navigate to player video mode or open modal
      console.log('Abrir video en vivo');
      // window.location.href = 'arca-player.html?mode=video';
    });
  }
  
  // Highlight Play Button
  if (highlightPlayBtn) {
    highlightPlayBtn.addEventListener('click', () => {
      togglePlayback();
    });
  }
  
  // CTA Listen Button
  if (ctaListenBtn) {
    ctaListenBtn.addEventListener('click', () => {
      setPlayingState(true);
      // Scroll to player or open player
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  
  // Station Cards Interaction
  const stationCards = document.querySelectorAll('.station-card');
  stationCards.forEach(card => {
    card.addEventListener('click', (e) => {
      // Don't trigger if clicking the play button directly
      if (e.target.closest('.btn-play-station') || e.target.closest('.btn-play-overlay')) {
        return;
      }
      
      // Set as active station
      stationCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      
      // Start playback
      setPlayingState(true);
    });
  });
  
  // Station Play Buttons
  const stationPlayBtns = document.querySelectorAll('.btn-play-station');
  stationPlayBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      setPlayingState(true);
      
      // Visual feedback
      btn.style.transform = 'scale(0.95)';
      setTimeout(() => {
        btn.style.transform = '';
      }, 150);
    });
  });
  
  // Podcast Play Buttons
  const podcastPlayBtns = document.querySelectorAll('.btn-play-podcast');
  podcastPlayBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      setPlayingState(true);
    });
  });
  
  // Video Play Button
  const videoPlayBtn = document.querySelector('.btn-play-video');
  if (videoPlayBtn) {
    videoPlayBtn.addEventListener('click', () => {
      console.log('Reproducir video');
      // Open video player modal or navigate
    });
  }
  
  // Enter Program Button
  const enterProgramBtn = document.querySelector('.btn-enter-program');
  if (enterProgramBtn) {
    enterProgramBtn.addEventListener('click', () => {
      console.log('Entrar al programa');
      // Navigate to program page
    });
  }

  // ==========================================================================
  // 5. SCROLL ANIMATIONS
  // ==========================================================================
  
  // Intersection Observer for fade-in animations
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };
  
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('section-visible');
        sectionObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observe all sections
  const sections = document.querySelectorAll(
    '.player-highlight-section, .stations-section, .now-on-arca-section, ' +
    '.schedule-section, .concepts-section, .discover-section, ' +
    '.video-section, .podcasts-section, .community-section, ' +
    '.mesh-section, .cta-section'
  );
  
  sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    sectionObserver.observe(section);
  });
  
  // Add CSS for visible state dynamically
  const style = document.createElement('style');
  style.textContent = `
    .section-visible {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);

  // ==========================================================================
  // 6. WAVEFORM ANIMATION CONTROL
  // ==========================================================================
  
  function updateWaveformAnimation() {
    const freqBars = document.querySelectorAll('.freq-bar');
    
    if (homeState.isPlaying) {
      freqBars.forEach(bar => {
        bar.style.animationPlayState = 'running';
        bar.style.opacity = '1';
      });
    } else {
      freqBars.forEach(bar => {
        bar.style.animationPlayState = 'paused';
        bar.style.opacity = '0.3';
        bar.style.height = '30%';
      });
    }
  }

  // ==========================================================================
  // 7. THEME SYNC (with existing navbar system)
  // ==========================================================================
  
  function syncTheme() {
    const htmlElement = document.documentElement;
    homeState.theme = htmlElement.getAttribute('data-theme') || 'dark';
  }
  
  // Listen for theme changes from navbar
  if (navThemeToggle) {
    navThemeToggle.addEventListener('click', () => {
      setTimeout(syncTheme, 100);
    });
  }
  
  // Initial theme sync
  syncTheme();

  // ==========================================================================
  // 8. KEYBOARD ACCESSIBILITY
  // ==========================================================================
  
  // Space/Enter to toggle play on focused buttons
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'Enter') {
      const focusedElement = document.activeElement;
      if (focusedElement && focusedElement.tagName === 'BUTTON') {
        // Let default behavior handle it
      }
    }
  });

  // ==========================================================================
  // 9. INITIALIZATION
  // ==========================================================================
  
  console.log('ARCA Home Page initialized');
  console.log('Theme:', homeState.theme);
  console.log('Station:', homeState.currentStation);
  
  // Initialize waveform state
  updateWaveformAnimation();
});
