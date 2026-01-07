/**
 * Interior 360 Page Logic
 */

let projectData = null;
let currentRoomIndex = 0;
let useGyroscope = false;

// Three.js variables
let scene, camera, renderer, sphere;
let isUserInteracting = false;
let onPointerDownMouseX = 0, onPointerDownMouseY = 0;
let lon = 0, lat = 0;
let onPointerDownLon = 0, onPointerDownLat = 0;
let compassHeading = 0;

// DOM Elements
const canvas = document.getElementById('panorama-canvas');
const loadingOverlay = document.getElementById('loading-overlay');
const permissionScreen = document.getElementById('permission-screen');
const roomSelector = document.getElementById('room-selector');
const currentRoomLabel = document.getElementById('current-room-label');
const compassNeedle = document.getElementById('compass-needle');
const userMarker = document.getElementById('user-marker');
const viewCone = document.getElementById('view-cone');
const floorplanImg = document.getElementById('floorplan-img');

// Initialize Three.js
function initThreeJS() {
    // Scene
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1100);

    // Renderer
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Sphere Geometry for 360 panorama
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1); // Invert the sphere

    // Material (will be updated with texture)
    const material = new THREE.MeshBasicMaterial();
    sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Event Listeners
    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    window.addEventListener('resize', onWindowResize);

    // Start animation
    animate();
}

// Load panorama texture
function loadPanorama(roomIndex) {
    const room = projectData.interior.rooms[roomIndex];
    const texturePath = projectData.assetsPath + room.tex;

    loadingOverlay.classList.remove('hidden');
    
    // Reset progress UI
    const loadingIcon = document.getElementById('loading-icon');
    const loadingProgress = document.getElementById('loading-progress');
    const progressBar = document.getElementById('progress-bar');
    
    if (progressBar) progressBar.style.width = '0%';
    if (loadingProgress) loadingProgress.textContent = '0%';
    if (loadingIcon) loadingIcon.textContent = 'home';

    const loader = new THREE.TextureLoader();
    loader.load(
        texturePath,
        (texture) => {
            sphere.material.map = texture;
            sphere.material.needsUpdate = true;
            loadingOverlay.classList.add('hidden');
            
            // Update UI
            currentRoomLabel.textContent = room.name;
            updateUserDot(room.mapCoords);
            currentRoomIndex = roomIndex;
            buildRoomSelector();
        },
        (xhr) => {
            // Progress callback
            if (xhr.lengthComputable) {
                const percentComplete = (xhr.loaded / xhr.total) * 100;
                
                if (progressBar) progressBar.style.width = `${percentComplete}%`;
                if (loadingProgress) loadingProgress.textContent = `${Math.round(percentComplete)}%`;
                
                if (loadingIcon) {
                    if (percentComplete < 33) {
                        loadingIcon.textContent = 'home';
                    } else if (percentComplete < 66) {
                        loadingIcon.textContent = 'view_in_ar';
                    } else {
                        loadingIcon.textContent = 'apartment';
                    }
                }
            }
        },
        (error) => {
            console.error('Panorama yüklenemedi:', error);
            loadingOverlay.classList.add('hidden');
            // Show placeholder
            currentRoomLabel.textContent = room.name + ' (Yüklenemedi)';
        }
    );
}

// Update user dot on mini map
function updateUserDot(coords) {
    if (userMarker) {
        userMarker.style.left = `${coords.x}%`;
        userMarker.style.top = `${coords.y}%`;
    }
}

// Build room selector UI
function buildRoomSelector() {
    const rooms = projectData.interior.rooms;
    roomSelector.innerHTML = '';

    rooms.forEach((room, index) => {
        const isActive = index === currentRoomIndex;
        
        const btn = document.createElement('button');
        btn.className = `room-btn shrink-0 group flex flex-col items-center gap-2 transition-transform active:scale-95 ${isActive ? 'active -translate-y-3 relative z-10' : ''}`;
        btn.onclick = () => {
            if (index !== currentRoomIndex) {
                loadPanorama(index);
            }
        };

        btn.innerHTML = `
            ${isActive ? '<div class="absolute -inset-4 bg-primary/20 blur-xl rounded-full opacity-60"></div>' : ''}
            <div class="${isActive ? 'w-24 h-24 border-2 border-primary' : 'w-16 h-16 border border-white/10'} rounded-2xl bg-[#2a2620] overflow-hidden relative group-hover:border-primary/60 transition-colors shadow-lg">
                <img class="w-full h-full object-cover ${isActive ? 'opacity-100 scale-110' : 'opacity-80 group-hover:opacity-100'} transition-opacity" 
                        src="${projectData.assetsPath}${room.thumbnail || room.tex}" 
                        alt="${room.name}"
                        onerror="this.src='https://via.placeholder.com/100x100/2a2620/D0BB95?text=${room.name}'"
                />
                <div class="floorplan-overlay absolute inset-0"></div>
                ${isActive ? `
                    <div class="check-icon absolute top-1 right-1 bg-primary text-background-dark rounded-full p-0.5 shadow-sm">
                        <span class="material-symbols-outlined text-[14px] font-bold block">check</span>
                    </div>
                ` : ''}
            </div>
            <div class="flex flex-col items-center">
                <span class="${isActive ? 'text-sm font-bold text-primary' : 'text-[11px] font-medium text-white/60 group-hover:text-white'} uppercase tracking-wider">${room.name}</span>
                ${isActive ? '<span class="text-[10px] text-white/50">Görüntüleniyor</span>' : ''}
            </div>
        `;

        roomSelector.appendChild(btn);
    });
}

// Pointer events for touch/mouse control
function onPointerDown(event) {
    isUserInteracting = true;
    onPointerDownMouseX = event.clientX;
    onPointerDownMouseY = event.clientY;
    onPointerDownLon = lon;
    onPointerDownLat = lat;
}

function onPointerMove(event) {
    if (isUserInteracting) {
        lon = (onPointerDownMouseX - event.clientX) * 0.1 + onPointerDownLon;
        lat = (event.clientY - onPointerDownMouseY) * 0.1 + onPointerDownLat;
    }
}

function onPointerUp() {
    isUserInteracting = false;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Device Orientation (Gyroscope)
function handleDeviceOrientation(event) {
    if (!useGyroscope) return;

    const lerpFactor = 0.1; // Balanced smoothing

    // Get heading (yaw)
    // iOS uses webkitCompassHeading (0-360, clockwise)
    // Android uses alpha (0-360, counter-clockwise usually)
    let heading = 0;
    if (event.webkitCompassHeading) {
        // iOS: Heading is clockwise
        heading = event.webkitCompassHeading;
    } else {
        // Android: Alpha is counter-clockwise
        heading = -event.alpha;
    }

    // Get tilt (pitch)
    const beta = event.beta || 0;
    
    // Target values
    const targetLon = heading; 
    
    // Tilt handling (Beta: 90 is upright)
    // We want to look up/down. 
    // Upright (90) -> 0 lat
    // Flat (0) -> -90 lat (looking down)
    // Tilted back (180) -> +90 lat (looking up)
    let tilt = beta - 90;
    
    // Clamp tilt to avoid flipping
    tilt = Math.max(-85, Math.min(85, tilt));
    const targetLat = -tilt; 

    // Longitude Interpolation (Shortest path)
    let deltaLon = targetLon - lon;
    
    // Normalize delta to -180 to 180
    while (deltaLon > 180) deltaLon -= 360;
    while (deltaLon < -180) deltaLon += 360;
    
    // Apply smoothing
    lon += deltaLon * lerpFactor;
    lat += (targetLat - lat) * lerpFactor;

    // Update compass
    compassHeading = event.webkitCompassHeading || (360 - event.alpha);
    updateCompass(compassHeading);
}

function updateCompass(heading) {
    // Rotate compass needle (opposite direction)
    compassNeedle.style.transform = `rotate(${-heading}deg)`;
}

// Request device orientation permission (iOS 13+)
async function requestOrientationPermission() {
    if (typeof DeviceOrientationEvent !== 'undefined' && 
        typeof DeviceOrientationEvent.requestPermission === 'function') {
        try {
            const permission = await DeviceOrientationEvent.requestPermission();
            if (permission === 'granted') {
                useGyroscope = true;
                window.addEventListener('deviceorientation', handleDeviceOrientation, true);
            }
        } catch (error) {
            console.error('Orientation permission denied:', error);
        }
    } else if ('DeviceOrientationEvent' in window) {
        // Non-iOS devices
        useGyroscope = true;
        window.addEventListener('deviceorientation', handleDeviceOrientation, true);
    }
    
    permissionScreen.classList.add('hidden');
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    update();
}

function update() {
    lat = Math.max(-85, Math.min(85, lat));
    
    const phi = THREE.MathUtils.degToRad(90 - lat);
    const theta = THREE.MathUtils.degToRad(lon);

    camera.position.x = 100 * Math.sin(phi) * Math.cos(theta);
    camera.position.y = 100 * Math.cos(phi);
    camera.position.z = 100 * Math.sin(phi) * Math.sin(theta);

    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);

    // Update view cone rotation
    if (viewCone) {
        // AYAR: Harita ile fotoğraf arasındaki açı farkı (Derece)
        // Burayı değiştirerek kalibre edebilirsin (örn: 90, 180, -90)
        const mapOffset = 90; 

        // lon is in degrees. 0 is North (Up).
        // If we rotate right (positive lon change?), wait.
        // In Three.js, usually +x is right, -z is forward.
        // Here we use spherical coords.
        // Let's assume -lon aligns with compass.
        viewCone.style.transform = `translate(-50%, -50%) rotate(${-lon + mapOffset}deg)`;
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    projectData = await window.initPage();
    if (!projectData) return;

    // Set floorplan image
    if (projectData.interior.floorplanImage) {
        floorplanImg.src = projectData.assetsPath + projectData.interior.floorplanImage;
    }

    // Initialize Three.js
    initThreeJS();

    // Load start room
    const roomParam = new URLSearchParams(window.location.search).get('room');
    const startRoomId = roomParam || projectData.interior.startRoom;
    const startRoomIndex = projectData.interior.rooms.findIndex(r => r.id === startRoomId);
    loadPanorama(startRoomIndex >= 0 ? startRoomIndex : 0);

    // Event Listeners
    document.getElementById('btn-start-experience').addEventListener('click', requestOrientationPermission);
    document.getElementById('btn-skip-gyro').addEventListener('click', () => {
        useGyroscope = false;
        permissionScreen.classList.add('hidden');
    });
});
