/**
 * Select Page Logic
 */

document.addEventListener('DOMContentLoaded', async () => {
    // Initialize page and get project data
    const project = await window.initPage();
    if (!project) return;

    const projectId = window.getProjectId();

    // Update header with project name
    document.getElementById('header-title').textContent = project.projectName;

    // --- Build Exterior Stack ---
    const exteriorStackContainer = document.getElementById('exterior-stack');
    const exteriorItems = [];

    // 1. Main Exterior Card
    exteriorItems.push({
        title: "Dış Mekan",
        subtitle: "Maket Görünüm",
        desc: "Bina maketini gerçek ortamınızda görüntüleyin.",
        image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80",
        icon: "landscape",
        url: `exterior?id=${projectId}`
    });

    // 2. Variants
    if (project.exterior && project.exterior.variants) {
        project.exterior.variants.forEach((variant, index) => {
            exteriorItems.push({
                title: variant.name,
                subtitle: "Daire Tipi",
                desc: "Bu daire tipinin kat planını ve modelini inceleyin.",
                image: project.assetsPath + (variant.thumbnail || 'plan_default.png'),
                icon: "apartment",
                url: `exterior?id=${projectId}&variant=${index}`
            });
        });
    }

    renderStack(exteriorStackContainer, exteriorItems);

    // --- Build Interior Stack ---
    const interiorStackContainer = document.getElementById('interior-stack');
    const interiorItems = [];

    // 1. Main Interior Card
    interiorItems.push({
        title: "İç Mekan",
        subtitle: "Dahili Görünüm",
        desc: "Daire içini telefonunuzla keşfedin.",
        image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80",
        icon: "chair",
        url: `interior?id=${projectId}`
    });

    // 2. Rooms
    if (project.interior && project.interior.rooms) {
        project.interior.rooms.forEach((room) => {
            interiorItems.push({
                title: room.name,
                subtitle: "Oda Görünümü",
                desc: `${room.name} odasını 360 derece görüntüleyin.`,
                image: project.assetsPath + (room.thumbnail || room.tex),
                icon: "360",
                url: `interior?id=${projectId}&room=${room.id}`
            });
        });
    }

    renderStack(interiorStackContainer, interiorItems);

    // Hide loading overlay
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.add('hidden');
    }
});

/**
 * Renders a stack of cards into a container and attaches event listeners
 */
function renderStack(container, items) {
    container.innerHTML = ''; // Clear

    // Create cards in reverse order so first item is on top (z-index handled by CSS nth-child)
    // Actually, CSS nth-child(1) is top. So we append in normal order.
    items.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'stack-card group';
        card.innerHTML = `
            <div class="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style="background-image: url('${item.image}');"></div>
            <div class="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
            <div class="relative z-20 flex h-full flex-col justify-between p-5 pointer-events-none">
                <div class="self-end rounded-full bg-white/20 backdrop-blur-sm p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span class="material-symbols-outlined text-xl">arrow_outward</span>
                </div>
                <div>
                    <div class="flex items-center gap-2 mb-2">
                        <span class="material-symbols-outlined text-primary text-2xl">${item.icon}</span>
                        <span class="text-xs font-bold uppercase tracking-wider text-primary">${item.subtitle}</span>
                    </div>
                    <h3 class="text-2xl font-bold text-white font-display mb-1">${item.title}</h3>
                    <p class="text-sm text-slate-300 font-body line-clamp-2">${item.desc}</p>
                </div>
            </div>
        `;
        
        // Attach Drag/Swipe Logic
        attachSwipeLogic(card, item.url, container);
        
        container.appendChild(card);
    });
}

/**
 * Attaches touch/mouse events for swiping
 */
function attachSwipeLogic(card, url, container) {
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;
    let isDragging = false;
    let isScrolling = false; // New flag to track if user is scrolling vertically
    const threshold = 100; // px to trigger swipe

    const onStart = (e) => {
        isDragging = true;
        isScrolling = false;
        startX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        startY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
        card.style.transition = 'none'; // Disable transition for direct 1:1 movement
    };

    const onMove = (e) => {
        if (!isDragging || isScrolling) return;
        
        currentX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        currentY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
        
        const deltaX = currentX - startX;
        const deltaY = currentY - startY;

        // Determine if scrolling vertically
        if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 10) {
            isScrolling = true;
            // Reset card style
            card.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)';
            card.style.transform = '';
            return;
        }

        // If horizontal swipe detected, prevent default to stop browser nav gestures
        if (Math.abs(deltaX) > 10) {
            if (e.cancelable) e.preventDefault();
        }

        const rotation = deltaX * 0.1; // Slight rotation
        card.style.transform = `translateX(${deltaX}px) rotate(${rotation}deg)`;
    };

    const onEnd = (e) => {
        if (!isDragging) return;
        isDragging = false;
        
        if (isScrolling) {
            isScrolling = false;
            return;
        }
        
        // Use currentX from last move, or if click, it might be 0 if no move happened
        // If no move happened (click), currentX is 0.
        const deltaX = currentX !== 0 ? currentX - startX : 0;
        
        // If moved less than 5px, treat as click
        if (Math.abs(deltaX) < 5) { 
             window.location.href = url;
             // Reset vars
             startX = 0; startY = 0; currentX = 0; currentY = 0;
             return;
        }
        
        // If swiped far enough
        if (Math.abs(deltaX) > threshold) {
            const direction = deltaX > 0 ? 'right' : 'left';
            flyAway(card, direction, container);
        } else {
            // Reset
            card.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)';
            card.style.transform = '';
        }
        
        // Reset vars
        startX = 0; startY = 0; currentX = 0; currentY = 0;
    };

    // Touch Events
    card.addEventListener('touchstart', onStart, { passive: false }); // passive: false needed for preventDefault
    card.addEventListener('touchmove', onMove, { passive: false });
    card.addEventListener('touchend', onEnd);

    // Mouse Events (for desktop testing)
    card.addEventListener('mousedown', onStart);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);
}

function flyAway(card, direction, container) {
    card.style.transition = 'transform 0.4s ease-in, opacity 0.4s ease-in';
    
    if (direction === 'right') {
        card.classList.add('fly-out-right');
    } else {
        card.classList.add('fly-out-left');
    }

    // Remove from DOM after animation and append to back (infinite loop) or just remove?
    // User said "aşağıya kaydırdıkça diğer o tiplere kaydırılabilsin"
    // Let's move it to the bottom of the stack to create an infinite loop effect
    setTimeout(() => {
        card.classList.remove('fly-out-right', 'fly-out-left');
        card.style.transform = '';
        card.style.opacity = '';
        card.style.transition = '';
        
        // Move to end of container
        container.appendChild(card);
    }, 400); // Match CSS transition time
}
