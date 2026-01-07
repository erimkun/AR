/**
 * Exterior AR Page Logic
 */

let projectData = null;
let currentVariantIndex = 0;

// DOM Elements
const modelViewer = document.getElementById('model-viewer');
const loadingOverlay = document.getElementById('loading-overlay');
const scanningUI = document.getElementById('scanning-ui');
const statusBadge = document.getElementById('status-badge');
const variantSelector = document.getElementById('variant-selector');
const arButton = document.getElementById('ar-button');
const progressBar = document.getElementById('progress-bar');

// Load 3D model
function loadModel(variantIndex) {
    const exterior = projectData.exterior;
    const variant = exterior.variants[variantIndex];
    const basePath = projectData.assetsPath;
    
    // Build model filename with variant suffix
    let modelFile, iosModelFile;
    
    if (variant && variant.suffix) {
        const baseModelName = exterior.modelAndroid.replace('.glb', '');
        modelFile = `${baseModelName}${variant.suffix}.glb`;
        iosModelFile = `${exterior.modelIOS.replace('.usdz', '')}${variant.suffix}.usdz`;
    } else {
        modelFile = exterior.modelAndroid;
        iosModelFile = exterior.modelIOS;
    }
    
    // Set model sources
    modelViewer.src = basePath + modelFile;
    modelViewer.setAttribute('ios-src', basePath + iosModelFile);

    currentVariantIndex = variantIndex;
    updateVariantUI();
    
    // Preload AR assets to speed up transition
    preloadARAssets(basePath + iosModelFile);
}

// Preload AR assets (USDZ for iOS)
function preloadARAssets(url) {
    // Check if we are on an iOS device to avoid unnecessary data usage on Android
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    
    if (isIOS && url) {
        fetch(url, { mode: 'cors', cache: 'force-cache' })
            .then(response => {
                console.log('AR asset preloaded:', url);
            })
            .catch(err => {
                console.warn('AR asset preload failed:', err);
            });
    }
}

// Build variant selector UI
function buildVariantSelector() {
    const variants = projectData.exterior.variants;
    variantSelector.innerHTML = '';

    variants.forEach((variant, index) => {
        const isActive = index === currentVariantIndex;
        
        const btn = document.createElement('button');
        btn.className = `variant-btn shrink-0 group flex flex-col items-center gap-2 transition-transform active:scale-95 ${isActive ? 'active -translate-y-3 relative z-10' : ''}`;
        btn.onclick = () => {
            loadModel(index);
        };

        btn.innerHTML = `
            ${isActive ? '<div class="absolute -inset-4 bg-primary/20 blur-xl rounded-full opacity-60"></div>' : ''}
            <div class="${isActive ? 'w-24 h-24 border-2 border-primary' : 'w-16 h-16 border border-white/10'} rounded-2xl bg-[#2a2620] overflow-hidden relative group-hover:border-primary/60 transition-colors shadow-lg">
                <img class="w-full h-full object-cover ${isActive ? 'opacity-100 scale-110' : 'opacity-80 group-hover:opacity-100'} transition-opacity p-1" 
                        src="${projectData.assetsPath}${variant.thumbnail || 'plan_default.png'}" 
                        alt="${variant.name} Plan"
                        onerror="this.src='https://via.placeholder.com/100x100/2a2620/D0BB95?text=${variant.name}'"
                />
                <div class="floorplan-overlay absolute inset-0"></div>
                ${isActive ? `
                    <div class="check-icon absolute top-1 right-1 bg-primary text-background-dark rounded-full p-0.5 shadow-sm">
                        <span class="material-symbols-outlined text-[14px] font-bold block">check</span>
                    </div>
                ` : ''}
            </div>
            <div class="flex flex-col items-center">
                <span class="${isActive ? 'text-sm font-bold text-primary' : 'text-[11px] font-medium text-white/60 group-hover:text-white'} uppercase tracking-wider">${variant.name} Plan</span>
                ${isActive ? '<span class="text-[10px] text-white/50">Seçili</span>' : ''}
            </div>
        `;

        variantSelector.appendChild(btn);
    });
}

// Update variant selector UI
function updateVariantUI() {
    buildVariantSelector();
}

// Model Viewer Events
modelViewer.addEventListener('progress', (event) => {
    const progress = event.detail.totalProgress * 100;
    const loadingIcon = document.getElementById('loading-icon');
    const loadingProgress = document.getElementById('loading-progress');
    
    // Update progress bar and text
    if (progressBar) progressBar.style.width = `${progress}%`;
    if (loadingProgress) loadingProgress.textContent = `${Math.round(progress)}%`;
    
    // Update icon based on progress
    if (loadingIcon) {
        if (progress < 33) {
            loadingIcon.textContent = 'home';
        } else if (progress < 66) {
            loadingIcon.textContent = 'view_in_ar';
        } else {
            loadingIcon.textContent = 'apartment';
        }
    }
});

modelViewer.addEventListener('load', () => {
    loadingOverlay.classList.add('hidden');
    statusBadge.textContent = 'Model Hazır';
    statusBadge.classList.remove('bg-primary/90');
    statusBadge.classList.add('bg-green-500/90');
    
    // Show AR button
    arButton.classList.remove('hidden');
    arButton.onclick = () => {
        const arPopup = document.getElementById('ar-loading-popup');
        if (arPopup) arPopup.classList.remove('hidden');
        modelViewer.activateAR();
    };
    
    // Hide scanning UI after a delay
    setTimeout(() => {
        scanningUI.style.opacity = '0';
        scanningUI.style.transition = 'opacity 0.5s ease';
    }, 1500);
});

modelViewer.addEventListener('ar-status', (event) => {
    const arPopup = document.getElementById('ar-loading-popup');
    if (event.detail.status === 'session-started') {
        console.log('AR session started');
        if (arPopup) arPopup.classList.add('hidden');
    } else if (event.detail.status === 'not-presenting' || event.detail.status === 'failed') {
        if (arPopup) arPopup.classList.add('hidden');
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    if (!window.isSecureContext) {
        console.warn('HTTPS gerekli');
        const warning = document.createElement('div');
        warning.className = 'fixed top-4 left-4 right-4 bg-red-500/90 text-white p-4 rounded-xl z-50 text-sm text-center backdrop-blur-md shadow-lg';
        warning.innerHTML = '⚠️ <strong>Dikkat:</strong> Güvenli olmayan bağlantı (HTTP).<br>AR özellikleri çalışmayabilir. Lütfen HTTPS veya localhost kullanın.';
        document.body.appendChild(warning);
        setTimeout(() => warning.remove(), 5000);
    }

    projectData = await window.initPage();
    if (!projectData) return;

    // Check for variant param
    const urlParams = new URLSearchParams(window.location.search);
    const variantParam = urlParams.get('variant');
    const initialVariant = variantParam ? parseInt(variantParam) : 0;

    // Load the initial variant
    loadModel(initialVariant);
    
    // Build variant selector
    buildVariantSelector();
});
