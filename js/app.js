/**
 * WebXR Gayrimenkul Platformu - Ortak Fonksiyonlar
 * @version 1.0.0
 */

// Global State
window.appState = {
    projects: null,
    currentProject: null
};

/**
 * Get project ID from URL parameters
 * @returns {string|null} Project ID
 */
function getProjectId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

/**
 * Load projects data from JSON file
 * @returns {Promise<Object>} Projects data
 */
async function loadProjects() {
    if (window.appState.projects) {
        return window.appState.projects;
    }
    
    try {
        const response = await fetch('projects.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        window.appState.projects = await response.json();
        return window.appState.projects;
    } catch (error) {
        console.error('Projects JSON yüklenemedi:', error);
        alert('Veri yüklenirken hata oluştu. Lütfen internet bağlantınızı kontrol edin.');
        throw error;
    }
}

/**
 * Get specific project data by ID
 * @param {string} projectId - Project ID
 * @returns {Promise<Object|null>} Project data or null
 */
async function getProject(projectId) {
    const projects = await loadProjects();
    const project = projects[projectId];
    
    if (!project) {
        console.error(`Project not found: ${projectId}`);
        return null;
    }
    
    window.appState.currentProject = project;
    return project;
}

/**
 * Initialize common page requirements
 * Checks for Project ID and loads data
 * @returns {Promise<Object>} Project Data
 */
async function initPage() {
    const projectId = getProjectId();
    
    if (!projectId) {
        console.error('Proje ID bulunamadı! URL:', window.location.href);
        alert(`Hata: Proje ID bulunamadı.\nLütfen ana sayfadan tekrar deneyin.`);
        // Optional: Redirect to home
        // window.location.href = 'index.html';
        return null;
    }

    const project = await getProject(projectId);
    
    if (!project) {
        alert('Proje bulunamadı: ' + projectId);
        return null;
    }

    return project;
}

// Export functions to global scope
window.getProjectId = getProjectId;
window.loadProjects = loadProjects;
window.getProject = getProject;
window.initPage = initPage;

/**
 * Navigate to a page with project ID
 * @param {string} page - Page name (e.g., 'exterior.html')
 * @param {string} projectId - Project ID
 */
function navigateTo(page, projectId) {
    window.location.href = `${page}?id=${projectId}`;
}

/**
 * Detect if device is iOS
 * @returns {boolean}
 */
function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

/**
 * Detect if device is Android
 * @returns {boolean}
 */
function isAndroid() {
    return /Android/.test(navigator.userAgent);
}

/**
 * Check if device supports WebXR
 * @returns {Promise<boolean>}
 */
async function supportsWebXR() {
    if ('xr' in navigator) {
        try {
            return await navigator.xr.isSessionSupported('immersive-ar');
        } catch (e) {
            return false;
        }
    }
    return false;
}

/**
 * Request camera permission
 * @returns {Promise<boolean>} Whether permission was granted
 */
async function requestCameraPermission() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop());
        return true;
    } catch (error) {
        console.error('Kamera izni alınamadı:', error);
        return false;
    }
}

/**
 * Request device orientation permission (iOS 13+)
 * @returns {Promise<boolean>} Whether permission was granted
 */
async function requestOrientationPermission() {
    if (typeof DeviceOrientationEvent !== 'undefined' && 
        typeof DeviceOrientationEvent.requestPermission === 'function') {
        try {
            const permission = await DeviceOrientationEvent.requestPermission();
            return permission === 'granted';
        } catch (error) {
            console.error('Orientation izni alınamadı:', error);
            return false;
        }
    }
    // Non-iOS devices don't need explicit permission
    return true;
}

/**
 * Show a toast notification
 * @param {string} message - Message to show
 * @param {string} type - 'success', 'error', or 'info'
 * @param {number} duration - Duration in ms
 */
function showToast(message, type = 'info', duration = 3000) {
    // Remove existing toast
    const existingToast = document.getElementById('toast-notification');
    if (existingToast) {
        existingToast.remove();
    }

    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-primary'
    };

    const toast = document.createElement('div');
    toast.id = 'toast-notification';
    toast.className = `fixed top-4 left-1/2 -translate-x-1/2 ${colors[type]} text-white px-4 py-2 rounded-lg shadow-lg z-[9999] transition-all duration-300 opacity-0 transform -translate-y-2`;
    toast.textContent = message;

    document.body.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
        toast.classList.remove('opacity-0', '-translate-y-2');
    });

    // Animate out
    setTimeout(() => {
        toast.classList.add('opacity-0', '-translate-y-2');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

/**
 * Preload an image
 * @param {string} src - Image URL
 * @returns {Promise<HTMLImageElement>}
 */
function preloadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

/**
 * Format file size
 * @param {number} bytes 
 * @returns {string}
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Debounce function
 * @param {Function} func 
 * @param {number} wait 
 * @returns {Function}
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function
 * @param {Function} func 
 * @param {number} limit 
 * @returns {Function}
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

const AMBIENT_AUDIO_STORAGE_KEY = 'ambientSoundEnabled';
const AMBIENT_AUDIO_SRC = 'assets/Sound.mp3';
const AMBIENT_AUDIO_VOLUME = 0.06;
const AMBIENT_AUDIO_TIME_STORAGE_KEY = 'ambientSoundTime';

let ambientAudioInteractionCleanup = null;

function getAmbientAudioPreference() {
    try {
        return localStorage.getItem(AMBIENT_AUDIO_STORAGE_KEY) !== 'false';
    } catch (error) {
        return true;
    }
}

function setAmbientAudioPreference(enabled) {
    try {
        localStorage.setItem(AMBIENT_AUDIO_STORAGE_KEY, String(enabled));
    } catch (error) {
        console.warn('Ambient ses tercihi kaydedilemedi:', error);
    }
}

function getAmbientAudioTime() {
    try {
        const raw = localStorage.getItem(AMBIENT_AUDIO_TIME_STORAGE_KEY);
        const parsed = Number(raw);
        if (!Number.isFinite(parsed) || parsed < 0) {
            return 0;
        }
        return parsed;
    } catch (error) {
        return 0;
    }
}

function saveAmbientAudioTime(timeInSeconds) {
    if (!Number.isFinite(timeInSeconds) || timeInSeconds < 0) {
        return;
    }

    try {
        localStorage.setItem(AMBIENT_AUDIO_TIME_STORAGE_KEY, String(timeInSeconds));
    } catch (error) {
        // Ignore storage errors silently (e.g. private mode)
    }
}

function restoreAmbientAudioTime(audio) {
    if (!audio) {
        return;
    }

    const savedTime = getAmbientAudioTime();
    if (!savedTime) {
        return;
    }

    const applySavedTime = () => {
        const duration = Number.isFinite(audio.duration) && audio.duration > 0
            ? audio.duration
            : Infinity;
        const safeTime = duration === Infinity
            ? savedTime
            : Math.min(savedTime, Math.max(duration - 0.5, 0));

        if (safeTime > 0) {
            audio.currentTime = safeTime;
        }
    };

    if (audio.readyState >= 1) {
        applySavedTime();
        return;
    }

    audio.addEventListener('loadedmetadata', applySavedTime, { once: true });
}

function ensureAmbientAudioStyles() {
    if (document.getElementById('ambient-audio-styles')) {
        return;
    }

    const style = document.createElement('style');
    style.id = 'ambient-audio-styles';
    style.textContent = `
        #ambient-audio-toggle {
            position: fixed;
            left: 16px;
            bottom: calc(env(safe-area-inset-bottom, 0px) + 16px);
            width: 46px;
            height: 46px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border: 1px solid rgba(255, 255, 255, 0.12);
            border-radius: 9999px;
            background: rgba(29, 26, 21, 0.82);
            color: #f5f1e8;
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            box-shadow: 0 12px 28px rgba(0, 0, 0, 0.28);
            z-index: 80;
            cursor: pointer;
            transition: transform 0.2s ease, background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
        }

        #ambient-audio-toggle:hover {
            transform: translateY(-1px);
            background: rgba(42, 37, 32, 0.92);
        }

        #ambient-audio-toggle:active {
            transform: scale(0.96);
        }

        #ambient-audio-toggle.is-muted {
            color: rgba(245, 241, 232, 0.68);
            background: rgba(20, 18, 15, 0.76);
        }

        #ambient-audio-toggle .material-symbols-outlined {
            font-size: 22px;
        }

        @media (max-width: 640px) {
            #ambient-audio-toggle {
                left: 12px;
                bottom: calc(env(safe-area-inset-bottom, 0px) + 12px);
                width: 42px;
                height: 42px;
            }
        }
    `;

    document.head.appendChild(style);
}

function syncAmbientAudioButton(button, enabled) {
    if (!button) {
        return;
    }

    button.classList.toggle('is-muted', !enabled);
    button.setAttribute('aria-pressed', String(enabled));
    button.setAttribute('aria-label', enabled ? 'Ambiyans sesini kapat' : 'Ambiyans sesini ac');
    button.setAttribute('title', enabled ? 'Ambiyans sesini kapat' : 'Ambiyans sesini ac');
    button.innerHTML = `<span class="material-symbols-outlined">${enabled ? 'volume_up' : 'volume_off'}</span>`;
}

async function tryPlayAmbientAudio(audio) {
    if (!audio || !getAmbientAudioPreference()) {
        return false;
    }

    audio.volume = AMBIENT_AUDIO_VOLUME;
    audio.muted = false;

    try {
        await audio.play();
        return true;
    } catch (error) {
        return false;
    }
}

function registerAmbientAudioResume(audio) {
    if (ambientAudioInteractionCleanup) {
        return;
    }

    const eventOptions = { capture: true, passive: true };

    const cleanup = () => {
        document.removeEventListener('pointerdown', handleResume, eventOptions);
        document.removeEventListener('touchstart', handleResume, eventOptions);
        document.removeEventListener('keydown', handleResume, eventOptions);
        ambientAudioInteractionCleanup = null;
    };

    const handleResume = async () => {
        if (!getAmbientAudioPreference()) {
            cleanup();
            return;
        }

        const started = await tryPlayAmbientAudio(audio);
        if (started) {
            cleanup();
        }
    };

    ambientAudioInteractionCleanup = cleanup;

    document.addEventListener('pointerdown', handleResume, eventOptions);
    document.addEventListener('touchstart', handleResume, eventOptions);
    document.addEventListener('keydown', handleResume, eventOptions);
}

function initAmbientAudio() {
    if (!document.body || document.getElementById('ambient-audio-player')) {
        return;
    }

    ensureAmbientAudioStyles();

    const audio = document.createElement('audio');
    audio.id = 'ambient-audio-player';
    audio.src = AMBIENT_AUDIO_SRC;
    audio.loop = true;
    audio.preload = 'auto';
    audio.playsInline = true;
    audio.setAttribute('playsinline', '');
    audio.setAttribute('aria-hidden', 'true');
    audio.hidden = true;
    restoreAmbientAudioTime(audio);

    let lastPersistAt = 0;
    const persistCurrentTime = () => {
        const now = Date.now();
        if (now - lastPersistAt < 800) {
            return;
        }
        lastPersistAt = now;
        saveAmbientAudioTime(audio.currentTime);
    };

    const persistOnHide = () => {
        saveAmbientAudioTime(audio.currentTime);
    };

    audio.addEventListener('timeupdate', persistCurrentTime);
    audio.addEventListener('pause', persistOnHide);
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
            persistOnHide();
        }
    });
    window.addEventListener('pagehide', persistOnHide);
    window.addEventListener('beforeunload', persistOnHide);

    const toggleButton = document.createElement('button');
    toggleButton.id = 'ambient-audio-toggle';
    toggleButton.type = 'button';

    let isEnabled = getAmbientAudioPreference();
    syncAmbientAudioButton(toggleButton, isEnabled);

    toggleButton.addEventListener('click', async () => {
        isEnabled = !isEnabled;
        setAmbientAudioPreference(isEnabled);
        syncAmbientAudioButton(toggleButton, isEnabled);

        if (!isEnabled) {
            audio.pause();
            return;
        }

        const started = await tryPlayAmbientAudio(audio);
        if (!started) {
            registerAmbientAudioResume(audio);
        }
    });

    document.body.appendChild(audio);
    document.body.appendChild(toggleButton);

    if (isEnabled) {
        requestAnimationFrame(async () => {
            const started = await tryPlayAmbientAudio(audio);
            if (!started) {
                registerAmbientAudioResume(audio);
            }
        });
    }
}

window.initAmbientAudio = initAmbientAudio;

if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAmbientAudio, { once: true });
    } else {
        initAmbientAudio();
    }
}

// Export for ES modules if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getProjectId,
        loadProjects,
        getProject,
        navigateTo,
        isIOS,
        isAndroid,
        supportsWebXR,
        requestCameraPermission,
        requestOrientationPermission,
        showToast,
        preloadImage,
        formatFileSize,
        debounce,
        throttle,
        initAmbientAudio
    };
}
