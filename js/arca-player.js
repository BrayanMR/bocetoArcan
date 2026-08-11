/**
 * ARCA PLAYER — CONTROL COMPLETO
 * Funcionalidad: Play/Pause, Modos, Emisoras, Favoritos, Compartir,
 * Progreso, Volumen, Tema, Bottom Nav, Estados de transmisión.
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. ESTADO GLOBAL
  // =========================================================================
  const state = {
    isPlaying: true,
    isMuted: false,
    volume: 80,
    progress: 65,
    isFavorite: false,
    currentMode: 'audio',
    currentStationId: 'arca-965',
    currentTheme: 'dark',
    streamStatus: 'online'
  };

  const STATIONS = {
    'arca-965': {
      name: 'ARCA 96.5 FM',
      show: 'La Noche en ARCA',
      tagline: '"El sonido que te acompaña"',
      listeners: '1.250',
      genre: 'POP / ELECTRONIC / LIVE',
      track: 'Sintiendo el Ritmo de la Noche',
      artist: 'ARCA Live Sessions ft. DJ Electro',
      url: 'https://arca.radio/live/arca-965'
    },
    'arca-chill': {
      name: 'ARCA Chill Ambient',
      show: 'Deep Relax Hours',
      tagline: '"Desconéctate y concéntrate"',
      listeners: '840',
      genre: 'LO-FI / AMBIENT / CHILL',
      track: 'Midnight Rain & Smooth Beats',
      artist: 'Arca Chill Collective',
      url: 'https://arca.radio/live/arca-chill'
    },
    'arca-worship': {
      name: 'ARCA Worship',
      show: 'Tiempo de Adoración',
      tagline: '"Fe, esperanza y música"',
      listeners: '2.100',
      genre: 'WORSHIP / PRAISE / LIVE',
      track: 'Luz en la Oscuridad (En vivo)',
      artist: 'Banda ARCA Worship',
      url: 'https://arca.radio/live/arca-worship'
    },
    'arca-news': {
      name: 'ARCA News 24/7',
      show: 'Resumen Informativo Global',
      tagline: '"La verdad en tiempo real"',
      listeners: '620',
      genre: 'NOTICIAS / TALK / PODCAST',
      track: 'Titulares de la Hora',
      artist: 'Equipo Periodístico ARCA',
      url: 'https://arca.radio/live/arca-news'
    }
  };

  const stationKeys = Object.keys(STATIONS);

  // =========================================================================
  // 2. REFERENCIAS DOM
  // =========================================================================
  const $ = (id) => document.getElementById(id);
  const $$ = (sel) => document.querySelectorAll(sel);

  const htmlEl = document.documentElement;

  // Visualizador
  const waveformVisualizer = $('waveform-visualizer');

  // Escenarios
  const stageAudio = $('stage-audio');
  const stageVideo = $('stage-video');
  const stageLyrics = $('stage-lyrics');

  // Botones de modo
  const modeAudioBtn = $('mode-audio-btn');
  const modeVideoBtn = $('mode-video-btn');
  const modeLyricsBtn = $('mode-lyrics-btn');

  // Meta
  const stationTitleDom = $('station-title');
  const showTitleDom = $('show-title');
  const listenersCountDom = $('listeners-count');
  const stationGenreDom = $('station-genre');
  const currentTrackNameDom = $('current-track-name');
  const currentArtistNameDom = $('current-artist-name');
  const stationSelectDropdown = $('station-select-dropdown');
  const artLiveBadge = $('art-live-badge');

  // Play/Pause
  const btnMainPlay = $('btn-main-play');
  const miniBtnPlay = $('mini-btn-play');
  const vPlayBtn = $('v-play-btn');

  const playIconMain = document.querySelector('#btn-main-play .icon-play');
  const pauseIconMain = document.querySelector('#btn-main-play .icon-pause');
  const playIconMini = document.querySelector('#mini-btn-play .mini-icon-play');
  const pauseIconMini = document.querySelector('#mini-btn-play .mini-icon-pause');
  const vIconPlay = document.querySelector('#v-play-btn .v-icon-play');
  const vIconPause = document.querySelector('#v-play-btn .v-icon-pause');

  // Favoritos & Compartir
  const btnFavTrack = $('btn-fav-track');
  const btnShareTrack = $('btn-share-track');
  const favoriteToast = $('favorite-toast');
  const toastMessage = $('toast-message');

  const shareModal = $('share-modal');
  const shareModalClose = $('share-modal-close');
  const shareUrlInput = $('share-url-input');
  const btnCopyUrl = $('btn-copy-url');
  const copySuccessMsg = $('copy-success-msg');
  const shareOptBtns = $$('.share-opt-btn');

  // Volumen & Progreso
  const volumeBarClick = $('volume-bar-click');
  const volumeFill = $('volume-fill');
  const btnVolumeToggle = $('btn-volume-toggle');
  const progressBarClick = $('progress-bar-click');
  const progressFillBar = $('progress-fill-bar');
  const progressThumb = $('progress-thumb');

  // Overlay de estados
  const streamStatusOverlay = $('stream-status-overlay');
  const statusSpinner = $('status-spinner');
  const statusSignalIcon = $('status-signal-icon');
  const statusEndedIcon = $('status-ended-icon');
  const statusOverlayTitle = $('status-overlay-title');
  const statusOverlayDesc = $('status-overlay-desc');
  const statusRetryBtn = $('status-retry-btn');

  // Tema & Mini player
  const playerThemeToggleBtn = $('btn-player-theme-toggle');
  const miniBtnExpand = $('mini-btn-expand');
  const miniTitleDom = $('mini-title');
  const miniSubtitleDom = $('mini-subtitle');
  const vFullscreenBtn = $('v-fullscreen-btn');
  const videoCanvasElement = $('video-canvas-element');

  // Mobile
  const mobileStationName = $('mobile-station-name');
  const mobileBackBtn = $('mobile-back-btn');
  const mobileSearchBtn = $('mobile-search-btn');

  // Prev/Next
  const btnPrevTrack = $('btn-prev-track');
  const btnNextTrack = $('btn-next-track');
  const miniBtnPrev = $('mini-btn-prev');
  const miniBtnNext = $('mini-btn-next');

  // Bottom nav
  const bottomNavItems = $$('.bottom-nav-item');

  // =========================================================================
  // 3. PLAY / PAUSE
  // =========================================================================
  function setPlayState(playing) {
    state.isPlaying = playing;

    if (playing) {
      if (waveformVisualizer) waveformVisualizer.classList.remove('paused');
    } else {
      if (waveformVisualizer) waveformVisualizer.classList.add('paused');
    }

    // Iconos main
    if (playIconMain && pauseIconMain) {
      playIconMain.classList.toggle('hidden', playing);
      pauseIconMain.classList.toggle('hidden', !playing);
    }
    // Iconos mini
    if (playIconMini && pauseIconMini) {
      playIconMini.classList.toggle('hidden', playing);
      pauseIconMini.classList.toggle('hidden', !playing);
    }
    // Iconos video
    if (vIconPlay && vIconPause) {
      vIconPlay.classList.toggle('hidden', playing);
      vIconPause.classList.toggle('hidden', !playing);
    }
  }

  function togglePlayPause() {
    if (state.streamStatus !== 'online') {
      simulateStreamStatus('buffering');
      setTimeout(() => simulateStreamStatus('online'), 1500);
      return;
    }
    setPlayState(!state.isPlaying);
  }

  if (btnMainPlay) btnMainPlay.addEventListener('click', togglePlayPause);
  if (miniBtnPlay) miniBtnPlay.addEventListener('click', togglePlayPause);
  if (vPlayBtn) vPlayBtn.addEventListener('click', togglePlayPause);

  // =========================================================================
  // 4. ESTADOS DE TRANSMISIÓN
  // =========================================================================
  function simulateStreamStatus(status) {
    state.streamStatus = status;
    if (!streamStatusOverlay) return;

    [statusSpinner, statusSignalIcon, statusEndedIcon, statusRetryBtn]
      .forEach(el => { if (el) el.classList.add('hidden'); });

    if (status === 'online') {
      streamStatusOverlay.classList.add('hidden');
      setPlayState(true);
      if (artLiveBadge) {
        artLiveBadge.textContent = 'LIVE HD';
        artLiveBadge.style.background = 'var(--arca-live)';
      }
    } else if (status === 'buffering') {
      streamStatusOverlay.classList.remove('hidden');
      if (statusSpinner) statusSpinner.classList.remove('hidden');
      if (statusOverlayTitle) statusOverlayTitle.textContent = 'Cargando Transmisión HD...';
      if (statusOverlayDesc) statusOverlayDesc.textContent = 'Optimizando el búfer de audio y video de alta fidelidad.';
      setPlayState(false);
    } else if (status === 'no-signal') {
      streamStatusOverlay.classList.remove('hidden');
      if (statusSignalIcon) statusSignalIcon.classList.remove('hidden');
      if (statusRetryBtn) statusRetryBtn.classList.remove('hidden');
      if (statusOverlayTitle) statusOverlayTitle.textContent = 'Buscando Señal de la Estación...';
      if (statusOverlayDesc) statusOverlayDesc.textContent = 'No se ha detectado el flujo de audio en vivo.';
      setPlayState(false);
    } else if (status === 'ended') {
      streamStatusOverlay.classList.remove('hidden');
      if (statusEndedIcon) statusEndedIcon.classList.remove('hidden');
      if (statusRetryBtn) statusRetryBtn.classList.remove('hidden');
      if (statusOverlayTitle) statusOverlayTitle.textContent = 'La Emisión en Vivo ha Finalizado';
      if (statusOverlayDesc) statusOverlayDesc.textContent = 'El programa actual ha terminado.';
      setPlayState(false);
      if (artLiveBadge) {
        artLiveBadge.textContent = 'FINALIZADO';
        artLiveBadge.style.background = '#6B7280';
      }
    }
  }

  if (statusRetryBtn) {
    statusRetryBtn.addEventListener('click', () => {
      simulateStreamStatus('buffering');
      setTimeout(() => simulateStreamStatus('online'), 1500);
    });
  }

  // =========================================================================
  // 5. FAVORITOS
  // =========================================================================
  function toggleFavorite() {
    state.isFavorite = !state.isFavorite;
    if (btnFavTrack) btnFavTrack.classList.toggle('active-fav', state.isFavorite);

    if (favoriteToast && toastMessage) {
      toastMessage.textContent = state.isFavorite
        ? `¡${STATIONS[state.currentStationId].name} añadida a tus Favoritos!`
        : `Eliminada de tus Favoritos`;
      favoriteToast.classList.remove('hidden');
      setTimeout(() => favoriteToast.classList.add('hidden'), 3000);
    }
  }

  if (btnFavTrack) btnFavTrack.addEventListener('click', toggleFavorite);

  // =========================================================================
  // 6. COMPARTIR
  // =========================================================================
  function openShareModal() {
    if (!shareModal) return;
    if (shareUrlInput) shareUrlInput.value = STATIONS[state.currentStationId].url;
    shareModal.classList.remove('hidden');
  }

  function closeShareModal() {
    if (!shareModal) return;
    shareModal.classList.add('hidden');
    if (copySuccessMsg) copySuccessMsg.classList.add('hidden');
  }

  if (btnShareTrack) btnShareTrack.addEventListener('click', openShareModal);
  if (shareModalClose) shareModalClose.addEventListener('click', closeShareModal);
  if (shareModal) {
    shareModal.addEventListener('click', (e) => {
      if (e.target === shareModal) closeShareModal();
    });
  }

  if (btnCopyUrl && shareUrlInput) {
    btnCopyUrl.addEventListener('click', () => {
      navigator.clipboard.writeText(shareUrlInput.value).then(() => {
        if (copySuccessMsg) copySuccessMsg.classList.remove('hidden');
        setTimeout(() => { if (copySuccessMsg) copySuccessMsg.classList.add('hidden'); }, 2500);
      }).catch(() => {
        shareUrlInput.select();
        document.execCommand('copy');
        if (copySuccessMsg) copySuccessMsg.classList.remove('hidden');
        setTimeout(() => { if (copySuccessMsg) copySuccessMsg.classList.add('hidden'); }, 2500);
      });
    });
  }

  shareOptBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-share');
      const url = encodeURIComponent(STATIONS[state.currentStationId].url);
      const text = encodeURIComponent(`¡Estoy escuchando ${STATIONS[state.currentStationId].name} en ARCA Streaming! 🎧`);
      let target = '';
      if (type === 'whatsapp') target = `https://api.whatsapp.com/send?text=${text}%20${url}`;
      if (type === 'twitter') target = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
      if (type === 'facebook') target = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
      if (type === 'telegram') target = `https://t.me/share/url?url=${url}&text=${text}`;
      if (target) window.open(target, '_blank');
    });
  });

  // =========================================================================
  // 7. VOLUMEN Y PROGRESO
  // =========================================================================
  if (volumeBarClick && volumeFill) {
    volumeBarClick.addEventListener('click', (e) => {
      const rect = volumeBarClick.getBoundingClientRect();
      const pct = Math.max(0, Math.min(100, Math.round(((e.clientX - rect.left) / rect.width) * 100)));
      state.volume = pct;
      state.isMuted = pct === 0;
      volumeFill.style.width = `${pct}%`;
    });
  }

  if (btnVolumeToggle && volumeFill) {
    btnVolumeToggle.addEventListener('click', () => {
      state.isMuted = !state.isMuted;
      volumeFill.style.width = state.isMuted ? '0%' : `${state.volume}%`;
    });
  }

  if (progressBarClick && progressFillBar && progressThumb) {
    progressBarClick.addEventListener('click', (e) => {
      const rect = progressBarClick.getBoundingClientRect();
      const pct = Math.max(0, Math.min(100, Math.round(((e.clientX - rect.left) / rect.width) * 100)));
      state.progress = pct;
      progressFillBar.style.width = `${pct}%`;
      progressThumb.style.left = `${pct}%`;
    });
  }

  // =========================================================================
  // 8. MODO SWITCHER
  // =========================================================================
  function setMode(mode) {
    state.currentMode = mode;
    if (modeAudioBtn) modeAudioBtn.classList.toggle('active', mode === 'audio');
    if (modeVideoBtn) modeVideoBtn.classList.toggle('active', mode === 'video');
    if (modeLyricsBtn) modeLyricsBtn.classList.toggle('active', mode === 'lyrics');
    if (stageAudio) stageAudio.classList.toggle('active', mode === 'audio');
    if (stageVideo) stageVideo.classList.toggle('active', mode === 'video');
    if (stageLyrics) stageLyrics.classList.toggle('active', mode === 'lyrics');
  }

  if (modeAudioBtn) modeAudioBtn.addEventListener('click', () => setMode('audio'));
  if (modeVideoBtn) modeVideoBtn.addEventListener('click', () => setMode('video'));
  if (modeLyricsBtn) modeLyricsBtn.addEventListener('click', () => setMode('lyrics'));

  // =========================================================================
  // 9. CAMBIO DE EMISORA
  // =========================================================================
  function setStation(stationId) {
    const data = STATIONS[stationId];
    if (!data) return;

    simulateStreamStatus('buffering');

    setTimeout(() => {
      state.currentStationId = stationId;

      // Desktop meta
      if (stationTitleDom) stationTitleDom.textContent = data.name;
      if (showTitleDom) showTitleDom.innerHTML = `${data.show} — <span>${data.tagline}</span>`;
      if (listenersCountDom) listenersCountDom.textContent = data.listeners;
      if (stationGenreDom) stationGenreDom.textContent = data.genre;
      if (currentTrackNameDom) currentTrackNameDom.textContent = data.track;
      if (currentArtistNameDom) currentArtistNameDom.textContent = data.artist;

      // Mini player
      if (miniTitleDom) miniTitleDom.textContent = data.name;
      if (miniSubtitleDom) miniSubtitleDom.textContent = data.show;

      // Mobile header
      if (mobileStationName) mobileStationName.textContent = data.name;

      simulateStreamStatus('online');
    }, 600);
  }

  if (stationSelectDropdown) {
    stationSelectDropdown.addEventListener('change', (e) => setStation(e.target.value));
  }

  function prevStation() {
    const idx = stationKeys.indexOf(state.currentStationId);
    const next = stationKeys[(idx - 1 + stationKeys.length) % stationKeys.length];
    if (stationSelectDropdown) stationSelectDropdown.value = next;
    setStation(next);
  }

  function nextStation() {
    const idx = stationKeys.indexOf(state.currentStationId);
    const next = stationKeys[(idx + 1) % stationKeys.length];
    if (stationSelectDropdown) stationSelectDropdown.value = next;
    setStation(next);
  }

  if (btnPrevTrack) btnPrevTrack.addEventListener('click', prevStation);
  if (btnNextTrack) btnNextTrack.addEventListener('click', nextStation);
  if (miniBtnPrev) miniBtnPrev.addEventListener('click', prevStation);
  if (miniBtnNext) miniBtnNext.addEventListener('click', nextStation);

  // =========================================================================
  // 10. FULLSCREEN VIDEO
  // =========================================================================
  if (vFullscreenBtn && videoCanvasElement) {
    vFullscreenBtn.addEventListener('click', () => {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoCanvasElement.requestFullscreen().catch(() => {});
      }
    });
  }

  // =========================================================================
  // 11. TEMA OSCURO / CLARO
  // =========================================================================
  function toggleTheme() {
    state.currentTheme = state.currentTheme === 'dark' ? 'light' : 'dark';
    htmlEl.setAttribute('data-theme', state.currentTheme);
  }

  if (playerThemeToggleBtn) playerThemeToggleBtn.addEventListener('click', toggleTheme);

  // =========================================================================
  // 12. MINI PLAYER — SCROLL TO TOP
  // =========================================================================
  if (miniBtnExpand) {
    miniBtnExpand.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // =========================================================================
  // 13. MOBILE — HEADER Y BOTTOM NAV
  // =========================================================================
  if (mobileBackBtn) {
    mobileBackBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  if (mobileSearchBtn) {
    mobileSearchBtn.addEventListener('click', () => {
      const q = prompt('Buscar emisora, artista o canción:');
      if (q) alert(`Buscando: "${q}"\n\n(En producción real, aquí se abriría el panel de búsqueda)`);
    });
  }

  bottomNavItems.forEach(item => {
    item.addEventListener('click', () => {
      bottomNavItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      const nav = item.getAttribute('data-nav');
      if (nav === 'inicio') {
        window.location.href = 'index.html';
      } else if (nav === 'live') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (nav === 'stations') {
        alert('Estaciones ARCA:\n\n• ARCA 96.5 FM — Pop & Electronic\n• ARCA Chill — Lo-Fi Ambient\n• ARCA Worship — Fe & Esperanza\n• ARCA News — Noticias 24/7');
      } else if (nav === 'favorites') {
        if (state.isFavorite) {
          alert(`Favoritos:\n\n♥ ${STATIONS[state.currentStationId].name}`);
        } else {
          alert('No tienes emisoras favoritas aún.\n\nToca el corazón ♡ para añadir una.');
        }
      }
    });
  });

  // =========================================================================
  // 14. INICIALIZACIÓN
  // =========================================================================
  setStation('arca-965');
  setPlayState(true);
});
