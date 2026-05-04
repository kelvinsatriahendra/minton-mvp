document.addEventListener('DOMContentLoaded', function() {
    
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    
    const isInSubfolder = window.location.pathname.includes('/') && window.location.pathname.split('/').length > 2 && !window.location.pathname.endsWith('index.html');
    const basePath = isInSubfolder ? '../' : '';

    
    const navBtnContainer = document.getElementById('nav-btn') || document.querySelector('.nav-btn');
    if (navBtnContainer) {
        if (isLoggedIn) {
            const userName = localStorage.getItem('userName') || 'Bagus Saputra';
            const userInitial = userName.charAt(0).toUpperCase();
            
            navBtnContainer.innerHTML = `
                <div class="profile-menu" id="user-profile" style="display: block;">
                    <button class="profile-btn-ui" onclick="toggleDropdown()">
                        <div class="profile-avatar">${userInitial}</div>
                        <p class="profile-name">${userName}</p>
                        <i class="fa-solid fa-chevron-down" style="font-size: 12px; margin-left: 4px;"></i>
                    </button>
                    
                    <div class="profile-dropdown" id="profile-dropdown">
                        <a href="#" class="dropdown-item"><i class="fa-regular fa-user"></i> Profil Saya</a>
                        <a href="#" class="dropdown-item"><i class="fa-solid fa-ticket"></i> Riwayat Booking</a>
                        <a href="#" class="dropdown-item"><i class="fa-solid fa-gear"></i> Pengaturan</a>
                        <div class="dropdown-divider"></div>
                        <a href="#" class="dropdown-item" style="color: #ff4d4d;" onclick="simulateLogout()"><i class="fa-solid fa-arrow-right-from-bracket"></i> Logout</a>
                    </div>
                </div>
            `;
        } else {
            navBtnContainer.innerHTML = `
                <div id="auth-buttons" style="display: flex; gap: 16px;">
                    <button class="btn-outline" onclick="window.location.href='${basePath}buat akun/sign-up.html'">Sign-Up</button>
                    <button class="btn-primary" onclick="window.location.href='${basePath}buat akun/login.html'">Login</button>
                </div>
            `;
        }
    }

    
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navBtn = document.getElementById('nav-btn') || document.querySelector('.nav-btn');
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            if (navBtn) navBtn.classList.toggle('active');
        });
    }
    
    const flashMessage = sessionStorage.getItem('flashMessage');
    if (flashMessage) {
        try {
            const data = JSON.parse(flashMessage);
            showModal(data.title, data.message);
        } catch(e) {
            showModal('Informasi', flashMessage);
        }
        sessionStorage.removeItem('flashMessage');
    }
});

function showModal(title, message) {
    let overlay = document.getElementById('global-modal-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'global-modal-overlay';
        overlay.style = 'display: none; position: fixed; z-index: 9999; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.8); justify-content: center; align-items: center; opacity: 0; transition: opacity 0.3s ease;';
        document.body.appendChild(overlay);
    }

    overlay.innerHTML = `
        <div style="background-color: #1f1f1f; padding: 40px 30px; border-radius: 16px; width: 90%; max-width: 400px; position: relative; text-align: center; transform: translateY(-20px); transition: transform 0.3s ease; border: 1px solid #333;">
            <span onclick="closeGlobalModal()" style="position: absolute; top: 15px; right: 25px; color: #aaa; font-size: 28px; font-weight: bold; cursor: pointer;">&times;</span>
            <i class="fa-solid fa-circle-check" style="font-size: 64px; color: #bdd124; margin-bottom: 24px;"></i>
            <h2 style="font-size: 24px; margin-bottom: 12px; color: #fff; font-weight: 600;">${title}</h2>
            <p style="color: #aaa; margin-bottom: 32px; font-size: 15px; line-height: 1.6;">${message}</p>
            <button onclick="closeGlobalModal()" style="width: 100%; padding: 14px; border-radius: 12px; border: none; background-color: #bdd124; color: #000; font-size: 16px; font-weight: 600; cursor: pointer; transition: 0.3s; font-family: 'Plus Jakarta Sans', sans-serif;">Tutup</button>
        </div>
    `;

    overlay.style.display = 'flex';
    
    
    setTimeout(() => {
        overlay.style.opacity = '1';
        overlay.children[0].style.transform = 'translateY(0)';
    }, 10);
}

function closeGlobalModal() {
    const overlay = document.getElementById('global-modal-overlay');
    if (overlay) {
        overlay.style.opacity = '0';
        overlay.children[0].style.transform = 'translateY(-20px)';
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 300);
    }
}

function showAuthPromptModal(redirectUrl) {
    let overlay = document.getElementById('global-modal-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'global-modal-overlay';
        overlay.style = 'display: none; position: fixed; z-index: 9999; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.8); justify-content: center; align-items: center; opacity: 0; transition: opacity 0.3s ease;';
        document.body.appendChild(overlay);
    }

    const isInSubfolder = window.location.pathname.includes('/') && window.location.pathname.split('/').length > 2 && !window.location.pathname.endsWith('index.html');
    const basePath = isInSubfolder ? '../' : '';

    if (redirectUrl) {
        sessionStorage.setItem('postAuthRedirect', redirectUrl);
    }

    overlay.innerHTML = `
        <div style="background-color: #1f1f1f; padding: 40px 30px; border-radius: 16px; width: 90%; max-width: 400px; position: relative; text-align: center; transform: translateY(-20px); transition: transform 0.3s ease; border: 1px solid #333;">
            <span onclick="closeGlobalModal()" style="position: absolute; top: 15px; right: 25px; color: #aaa; font-size: 28px; font-weight: bold; cursor: pointer;">&times;</span>
            <i class="fa-solid fa-lock" style="font-size: 56px; color: #bdd124; margin-bottom: 24px;"></i>
            <h2 style="font-size: 24px; margin-bottom: 12px; color: #fff; font-weight: 600;">Akses Terbatas</h2>
            <p style="color: #aaa; margin-bottom: 32px; font-size: 15px; line-height: 1.6;">Anda harus masuk atau mendaftar akun terlebih dahulu untuk melanjutkan pemesanan.</p>
            <div style="display: flex; gap: 12px; justify-content: center;">
                <button onclick="window.location.href='${basePath}buat akun/sign-up.html'" style="flex: 1; padding: 14px; border-radius: 12px; border: 1px solid #fff; background-color: transparent; color: #fff; font-size: 16px; font-weight: 600; cursor: pointer; transition: 0.3s; font-family: 'Plus Jakarta Sans', sans-serif;">Daftar</button>
                <button onclick="window.location.href='${basePath}buat akun/login.html'" style="flex: 1; padding: 14px; border-radius: 12px; border: none; background-color: #bdd124; color: #000; font-size: 16px; font-weight: 600; cursor: pointer; transition: 0.3s; font-family: 'Plus Jakarta Sans', sans-serif;">Masuk</button>
            </div>
        </div>
    `;

    overlay.style.display = 'flex';
    
    
    setTimeout(() => {
        overlay.style.opacity = '1';
        overlay.children[0].style.transform = 'translateY(0)';
    }, 10);
}

function toggleDropdown() {
    const dropdown = document.getElementById('profile-dropdown');
    if (dropdown) dropdown.classList.toggle('active');
}

function simulateLogout() {
    localStorage.setItem('isLoggedIn', 'false');
    sessionStorage.setItem('flashMessage', JSON.stringify({
        title: 'Berhasil Keluar',
        message: 'Anda telah berhasil keluar dari akun. Sampai jumpa kembali!'
    }));
    window.location.reload();
}

window.addEventListener('click', function(e) {
    const profileMenu = document.getElementById('user-profile');
    const dropdown = document.getElementById('profile-dropdown');
    if (profileMenu && dropdown && !profileMenu.contains(e.target)) {
        dropdown.classList.remove('active');
    }
});


document.addEventListener('DOMContentLoaded', function() {
    
    const autoRevealSelectors = [
        '.card', '.venue-card', '.court-card', '.recommend-card',
        '.review-card', '.membership-card', '.feed-card', '.klub-card',
        '.feature-item', '.benefit-item', '.testimoni-header',
        '.section-image', '.features-banner', '.banner-img',
        '.section-label', '.lb-list', '.mabar-card'
    ];

    autoRevealSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach((el, i) => {
            if (!el.classList.contains('reveal')) {
                el.classList.add('reveal');
                
                const delay = (i % 3) * 0.1;
                el.style.transitionDelay = delay + 's';
            }
        });
    });

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
});
