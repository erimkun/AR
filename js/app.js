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
        throttle
    };
}
