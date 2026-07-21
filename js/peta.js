document.addEventListener("DOMContentLoaded", function() {

    // 1. INISIALISASI PETA
    const map = L.map('map-interaktif').setView([-7.752800, 110.548400], 16);

    // 2. LAYER BASE MAP (HTTPS DARI ESRI & OPENSTREETMAP)
    const satelitLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19,
        attribution: '© Esri — Dusun Cetok'
    });

    const jalanLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    });

    // Set Default ke Satelit
    satelitLayer.addTo(map);

    // 3. DEFINISI LOGO BERBEDA (FASILITAS & UMKM)
    const iconFasilitas = L.divIcon({
        className: 'custom-div-icon',
        html: "<div class='marker-fasilitas'><i class='fas fa-mosque'></i></div>",
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -18]
    });

    const iconUMKM = L.divIcon({
        className: 'custom-div-icon',
        html: "<div class='marker-umkm'><i class='fas fa-store'></i></div>",
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -18]
    });

    // 4. WADAH LAYER PETA
    const fasilitasGroup = L.layerGroup();
    const umkmGroup = L.layerGroup();

    // 5. DATA FASILITAS UMUM (Sesuai Excel)
    const dataFasilitas = [
        { nama: "Masjid Nurul Huda", lat: -7.754248550461454, lng: 110.54761860223867 },
        { nama: "Bangsal Dusun Cetok", lat: -7.753701872464028, lng: 110.54714126435482 },
        { nama: "TPA Nur Hidayah", lat: -7.7516393864289395, lng: 110.5492514401 }
    ];

    // 6. DATA UMKM (Sesuai Excel Lengkap)
    const dataUMKM = [
        { nama: "Gado-gado Busuji", lat: -7.752582, lng: 110.548936 },
        { nama: "Warung Sayur Bu Sunarni", lat: -7.751498, lng: 110.548334 },
        { nama: "Warung Seblak Clowy", lat: -7.751477, lng: 110.548531 },
        { nama: "Warung Kelontong Ibu Maryam", lat: -7.754786, lng: 110.547219 },
        { nama: "TB. Estu Berkah Keramik dan Granit", lat: -7.751181, lng: 110.54904 },
        { nama: "Toko Kelontong Bu Menik", lat: -7.751364, lng: 110.549233 },
        { nama: "KAPTEN PLASTIK 350 & FROZEN FOOD", lat: -7.752053, lng: 110.549202 },
        { nama: "Toko Semangat dan Agen Pos", lat: -7.752461, lng: 110.548537 },
        { nama: "GITO ROSO JENANG AYU", lat: -7.752697, lng: 110.548794 },
        { nama: "Jovanka Nicky Ramdhani", lat: -7.753054526, lng: 110.5480764 }, /* Diambil dari request sblmnya krn kosong di excel */
        { nama: "Angkringan Mbledos Mlebu Ndeso", lat: -7.75337, lng: 110.548383 },
        { nama: "Waroeng BENmoro Dan Catering", lat: -7.753197, lng: 110.549439 },
        { nama: "Angkringan Gembros", lat: -7.753684, lng: 110.549837 }
    ];

    // 7. FUNGSI PEMASANGAN MARKER & POP UP
    function pasangMarker(dataArray, grup, tipeIcon, kategoriTeks) {
        dataArray.forEach(item => {
            // SAFETY CHECK: Pastikan lat dan lng bukan data kosong / undefined
            if(item.lat && item.lng) {
                const marker = L.marker([item.lat, item.lng], { icon: tipeIcon });
                
                // Isi Pop Up
                const isiPopup = `
                    <div class="popup-title">${item.nama}</div>
                    <div style="font-size:0.85rem; color:#94a3b8;"><i class="fas fa-info-circle"></i> Klik marker ini untuk rute</div>
                `;
                marker.bindPopup(isiPopup);

                // Event Buka Sidebar
                marker.on('click', function() {
                    bukaSidebarRute(item.nama, kategoriTeks, item.lat, item.lng);
                });

                grup.addLayer(marker);
            }
        });
    }

    // Panggil fungsi pasang
    pasangMarker(dataFasilitas, fasilitasGroup, iconFasilitas, "Fasilitas Umum");
    pasangMarker(dataUMKM, umkmGroup, iconUMKM, "UMKM Warga");

    // Tampilkan ke peta
    fasilitasGroup.addTo(map);
    umkmGroup.addTo(map);

    // 8. MENU KONTROL DI POJOK PETA
    const baseMaps = {
        "🛰️ Citra Satelit": satelitLayer,
        "🗺️ Peta Jalan": jalanLayer
    };
    const overlayMaps = {
        "🏥 Fasilitas Umum": fasilitasGroup,
        "🏪 Titik UMKM": umkmGroup
    };
    L.control.layers(baseMaps, overlayMaps, { collapsed: false }).addTo(map);

    // 9. LOGIC BUKA/TUTUP SIDEBAR RUTE GOOGLE MAPS
    const sidebar = document.getElementById('sidebar-panel');
    
    // Jadikan fungsi global di Window (agar onclick HTML bisa jalan)
    window.bukaSidebarRute = function(nama, kategori, lat, lng) {
        document.getElementById('sb-title').innerText = nama;
        document.getElementById('sb-cat').innerHTML = `<i class="fas fa-tag"></i> ${kategori}`;
        document.getElementById('sb-lat').innerText = lat.toFixed(6);
        document.getElementById('sb-lng').innerText = lng.toFixed(6);

        // Membuat Link Navigasi Rute Langsung ke Google Maps dari HP / Lokasi Pengguna
        const linkGmaps = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
        document.getElementById('sb-link-gmaps').setAttribute('href', linkGmaps);

        sidebar.classList.add('active');
    };

    window.tutupSidebar = function() {
        sidebar.classList.remove('active');
    };

    // Otomatis tutup sidebar kalau klik peta di luar pop-up
    map.on('click', tutupSidebar);

});