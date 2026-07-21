document.addEventListener("DOMContentLoaded", function() {
    
    // Memilih semua elemen yang memiliki class 'scroll-reveal'
    const revealElements = document.querySelectorAll('.scroll-reveal');

    // Mengatur observer untuk mendeteksi elemen saat di-scroll
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // Jika elemen sudah terlihat di layar (minimal 15%)
            if (entry.isIntersecting) {
                // Tambahkan class 'active' untuk menjalankan animasi CSS
                entry.target.classList.add('active');
                
                // Hentikan observasi pada elemen ini agar animasi tidak berulang
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Elemen akan muncul saat 15% bagiannya masuk ke layar
    });

    // Menerapkan observer ke setiap elemen
    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // Fitur tambahan: Alert jika tombol peta diklik sebelum peta jadi
    const btnPeta = document.querySelector('.btn-nav-peta');
    if (btnPeta) {
        btnPeta.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#peta') {
                e.preventDefault();
                alert("Peta WebGIS Interaktif Dusun Cetok sedang dipersiapkan oleh Tim KKN. Silakan tunggu pembaruannya!");
            }
        });
    }
});
// Logika Auto Slider Foto Tim KKN
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

if(totalSlides > 0) {
    setInterval(() => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % totalSlides;
        slides[currentSlide].classList.add('active');
    }, 4000); // Berganti otomatis tiap 4 detik
}