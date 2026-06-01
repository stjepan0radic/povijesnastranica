// =======================
// ERA NAVIGATION
// =======================
const eraButtons = document.querySelectorAll('.era-btn');
const contentSections = document.querySelectorAll('.content-section');

eraButtons.forEach(button => {
    button.addEventListener('click', () => {
        // makni active sa svih
        eraButtons.forEach(btn => btn.classList.remove('active'));
        contentSections.forEach(section => section.classList.remove('active'));

        // dodaj active na kliknuti
        button.classList.add('active');

        const era = button.getAttribute('data-era');
        const target = document.getElementById(era);
        target.classList.add('active');

        // 👉 FIXED SCROLL (da ne ide ispod headera)
        const offset = 100;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;

        window.scrollTo({
            top: top,
            behavior: 'smooth'
        });
    });
});

// =======================
// SEARCH (SMART + DEBOUNCE)
// =======================
const searchInput = document.getElementById('searchInput');
let timeout;

searchInput.addEventListener('input', (e) => {
    clearTimeout(timeout);

    timeout = setTimeout(() => {
        const searchTerm = e.target.value.toLowerCase();

        if (searchTerm.length < 2) {
            contentSections.forEach(section => {
                section.style.boxShadow = 'none';
                section.style.borderColor = '#2a4a6a';
            });
            return;
        }

        contentSections.forEach(section => {
            const text = section.textContent.toLowerCase();

            if (text.includes(searchTerm)) {
                section.style.boxShadow = '0 0 30px rgba(201, 162, 39, 0.4)';
                section.style.borderColor = '#c9a227';

                // 👉 aktiviraj sekciju
                eraButtons.forEach(btn => btn.classList.remove('active'));
                const id = section.id;
                const activeBtn = document.querySelector(`[data-era="${id}"]`);
                if (activeBtn) activeBtn.classList.add('active');

                contentSections.forEach(sec => sec.classList.remove('active'));
                section.classList.add('active');

                // scroll
                const offset = 100;
                const top = section.getBoundingClientRect().top + window.pageYOffset - offset;

                window.scrollTo({
                    top: top,
                    behavior: 'smooth'
                });
            } else {
                section.style.boxShadow = 'none';
                section.style.borderColor = '#2a4a6a';
            }
        });
    }, 300);
});

// reset kad makne fokus
searchInput.addEventListener('blur', () => {
    contentSections.forEach(section => {
        section.style.boxShadow = 'none';
        section.style.borderColor = '#2a4a6a';
    });
});

// =======================
// ACTIVE BUTTON ON SCROLL
// =======================
window.addEventListener('scroll', () => {
    let current = '';

    contentSections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.offsetHeight;

        if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    eraButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-era') === current) {
            btn.classList.add('active');
        }
    });
});

// =======================
// LEAFLET MAP
// =======================
document.addEventListener('DOMContentLoaded', function () {
    const mapContainer = document.getElementById('croatia-map');
    if (!mapContainer) return;

    const map = L.map('croatia-map').setView([45.1, 15.2], 7);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18
    }).addTo(map);

    const locations = [
        { name: "Čakovec", coords: [46.3892, 16.4383], info: "Glavni grad Međimurja", type: "city" },
        { name: "Zagreb", coords: [45.8150, 15.9819], info: "Glavni grad Hrvatske", type: "capital" },
        { name: "Split", coords: [43.5081, 16.4402], info: "Dioklecijanova palača", type: "city" },
        { name: "Dubrovnik", coords: [42.6507, 18.0944], info: "Stari grad - UNESCO", type: "city" },
        { name: "Rijeka", coords: [45.3271, 14.4422], info: "Najveća luka", type: "city" },
        { name: "Osijek", coords: [45.5550, 18.6955], info: "Najveći grad Slavonije", type: "city" },
        { name: "Zadar", coords: [44.1194, 15.2314], info: "Povijesni grad", type: "city" },
        { name: "Vukovar", coords: [45.3433, 19.0061], info: "Herojski grad", type: "border" },
        { name: "Knin", coords: [44.0392, 16.2981], info: "Kraljevski grad", type: "border" },
        { name: "Pula", coords: [44.8666, 13.8396], info: "Rimski amfiteatar", type: "city" },
        { name: "Slavonski Brod", coords: [45.1602, 18.0035], info: "Granični grad", type: "border" }
    ];

    const capitalIcon = L.divIcon({
        className: 'custom-marker',
        html: '<div style="background:#c9a227;width:20px;height:20px;border-radius:50%;border:3px solid #fff;"></div>',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
    });

    const cityIcon = L.divIcon({
        className: 'custom-marker',
        html: '<div style="background:#3a6ea5;width:16px;height:16px;border-radius:50%;border:2px solid #fff;"></div>',
        iconSize: [16, 16],
        iconAnchor: [8, 8]
    });

    const borderIcon = L.divIcon({
        className: 'custom-marker',
        html: '<div style="background:#2a4a6a;width:14px;height:14px;border-radius:50%;border:2px solid #fff;"></div>',
        iconSize: [14, 14],
        iconAnchor: [7, 7]
    });

    locations.forEach(loc => {
        let icon = cityIcon;
        if (loc.type === 'capital') icon = capitalIcon;
        if (loc.type === 'border') icon = borderIcon;

        const marker = L.marker(loc.coords, { icon }).addTo(map);

        marker.bindPopup(`
            <div style="text-align:center;">
                <strong style="color:#c9a227;">${loc.name}</strong><br>
                <span style="color:#a8c0d8;">${loc.info}</span>
            </div>
        `);

        // 👉 zoom animacija
        marker.on('click', () => {
            map.setView(loc.coords, 10, {
                animate: true,
                duration: 1
            });
        });
    });
});