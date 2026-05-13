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
                        <a href="${basePath}dashboard_pemain.html" class="dropdown-item"><i class="fa-solid fa-house"></i> Dashboard</a>
                        <a href="${basePath}profil.html" class="dropdown-item"><i class="fa-regular fa-user"></i> Profil Saya</a>
                        <a href="${basePath}booking_saya.html" class="dropdown-item"><i class="fa-solid fa-calendar-days"></i> Booking Saya</a>
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

function showArticleModal(title, content, author, date, img) {
    let overlay = document.getElementById('global-modal-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'global-modal-overlay';
        overlay.style = 'display: none; position: fixed; z-index: 9999; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.8); justify-content: center; align-items: center; opacity: 0; transition: opacity 0.3s ease;';
        document.body.appendChild(overlay);
    }

    overlay.innerHTML = `
        <div style="background-color: #1f1f1f; padding: 0; border-radius: 16px; width: 90%; max-width: 700px; position: relative; text-align: left; transform: translateY(-20px); transition: transform 0.3s ease; border: 1px solid #333; overflow: hidden;">
            <span onclick="closeGlobalModal()" style="position: absolute; top: 15px; right: 25px; color: #fff; font-size: 28px; font-weight: bold; cursor: pointer; z-index: 10; text-shadow: 0 0 10px rgba(0,0,0,0.5);">&times;</span>
            <img src="${img}" style="width: 100%; height: 250px; object-fit: cover; border-bottom: 1px solid #333;">
            <div style="padding: 40px;">
                <div style="display: flex; gap: 16px; margin-bottom: 12px; font-size: 14px; color: #bdd124;">
                    <span><i class="fa-regular fa-user"></i> ${author}</span>
                    <span><i class="fa-regular fa-calendar"></i> ${date}</span>
                </div>
                <h2 style="font-size: 32px; margin-bottom: 24px; color: #fff; font-weight: 700; line-height: 1.2;">${title}</h2>
                <div style="color: #ccc; margin-bottom: 40px; font-size: 16px; line-height: 1.8; max-height: 300px; overflow-y: auto; padding-right: 10px;">
                    ${content}
                </div>
                <button onclick="closeGlobalModal()" style="width: 100%; padding: 14px; border-radius: 12px; border: none; background-color: #bdd124; color: #000; font-size: 16px; font-weight: 600; cursor: pointer; transition: 0.3s; font-family: 'Plus Jakarta Sans', sans-serif;">Selesai Membaca</button>
            </div>
        </div>
    `;

    overlay.style.display = 'flex';
    setTimeout(() => {
        overlay.style.opacity = '1';
        overlay.children[0].style.transform = 'translateY(0)';
    }, 10);
}

function showClubModal(clubName, type, details) {
    let overlay = document.getElementById('global-modal-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'global-modal-overlay';
        overlay.style = 'display: none; position: fixed; z-index: 9999; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.8); justify-content: center; align-items: center; opacity: 0; transition: opacity 0.3s ease;';
        document.body.appendChild(overlay);
    }

    const title = type === 'join' ? 'Konfirmasi Gabung' : 'Konfirmasi Mabar';
    const btnText = type === 'join' ? 'Kirim Permintaan' : 'Booking Sesi Mabar';
    const icon = type === 'join' ? 'fa-user-plus' : 'fa-handshake';
    
    const subMsg = type === 'join'
        ? `Anda akan mengirimkan permintaan bergabung ke komunitas <b>${clubName}</b>. Admin akan meninjau profil Anda.`
        : `Anda akan memesan sesi mabar bersama <b>${clubName}</b>. Detail koordinasi akan dikirim setelah konfirmasi.`;

    overlay.innerHTML = `
        <div style="background-color: #1f1f1f; padding: 40px; border-radius: 20px; width: 90%; max-width: 450px; position: relative; text-align: center; transform: translateY(-20px); transition: transform 0.3s ease; border: 1px solid #333; box-shadow: 0 20px 50px rgba(0,0,0,0.5);">
            <span onclick="closeGlobalModal()" style="position: absolute; top: 20px; right: 25px; color: #555; font-size: 24px; cursor: pointer;">&times;</span>
            <div style="width: 80px; height: 80px; background: rgba(189, 209, 36, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px;">
                <i class="fa-solid ${icon}" style="font-size: 32px; color: #bdd124;"></i>
            </div>
            <h2 style="font-size: 24px; margin-bottom: 12px; color: #fff; font-weight: 700;">${title}</h2>
            <p style="color: #888; margin-bottom: 32px; font-size: 14px; line-height: 1.6;">${subMsg}</p>
            
            <div style="background: #111; border-radius: 12px; padding: 20px; text-align: left; margin-bottom: 32px; border: 1px solid #222;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="color: #666; font-size: 13px;">Klub:</span>
                    <span style="color: #fff; font-size: 13px; font-weight: 600;">${clubName}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="color: #666; font-size: 13px;">Level:</span>
                    <span style="color: #fff; font-size: 13px; font-weight: 600;">${details.level}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="color: #666; font-size: 13px;">Jadwal:</span>
                    <span style="color: #fff; font-size: 13px; font-weight: 600;">${details.schedule}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span style="color: #666; font-size: 13px;">Biaya:</span>
                    <span style="color: #fff; font-size: 13px; font-weight: 600;">${details.fee}</span>
                </div>
            </div>

            <div style="display: flex; gap: 12px;">
                <button onclick="closeGlobalModal()" 
                        onmouseenter="this.style.backgroundColor='#ff4444'; this.style.borderColor='#ff4444';" 
                        onmouseleave="this.style.backgroundColor='transparent'; this.style.borderColor='#333';"
                        style="flex: 1; padding: 14px; border-radius: 12px; border: 1px solid #333; background-color: transparent; color: #fff; font-size: 16px; font-weight: 600; cursor: pointer; transition: 0.3s;">Batal</button>
                <button onclick="showClubSuccessModal('${clubName}', '${type}')" 
                        onmouseenter="this.style.backgroundColor='#d4e82a';" 
                        onmouseleave="this.style.backgroundColor='#bdd124';"
                        style="flex: 2; padding: 14px; border-radius: 12px; border: none; background-color: #bdd124; color: #000; font-size: 16px; font-weight: 600; cursor: pointer; transition: 0.3s;">${btnText}</button>
            </div>
        </div>
    `;

    overlay.style.display = 'flex';
    setTimeout(() => {
        overlay.style.opacity = '1';
        overlay.children[0].style.transform = 'translateY(0)';
    }, 10);
}

function showClubSuccessModal(clubName, type) {
    const overlay = document.getElementById('global-modal-overlay');
    const title = type === 'join' ? 'Permintaan Terkirim' : 'Permintaan Mabar Terkirim';
    const icon = 'fa-circle-check';
    const message = type === 'join'
        ? `Permintaan Anda untuk bergabung ke <b>${clubName}</b> telah berhasil dikirim. Admin akan segera menghubungi Anda.`
        : `Permintaan untuk Main Bareng (Mabar) bersama <b>${clubName}</b> telah terkirim. Mohon tunggu persetujuan dari pihak komunitas melalui notifikasi.`;

    overlay.children[0].style.transform = 'scale(0.8)';
    overlay.children[0].style.opacity = '0';

    setTimeout(() => {
        overlay.innerHTML = `
            <div style="background-color: #1f1f1f; padding: 40px; border-radius: 20px; width: 90%; max-width: 400px; position: relative; text-align: center; transform: scale(0.8); transition: all 0.3s ease; border: 1px solid #333; box-shadow: 0 20px 50px rgba(0,0,0,0.5);">
                <i class="fa-solid ${icon}" style="font-size: 64px; color: #bdd124; margin-bottom: 24px;"></i>
                <h2 style="font-size: 24px; margin-bottom: 12px; color: #fff; font-weight: 700;">${title}</h2>
                <p style="color: #aaa; margin-bottom: 32px; font-size: 15px; line-height: 1.6;">${message}</p>
                <button onclick="closeGlobalModal()" style="width: 100%; padding: 14px; border-radius: 12px; border: none; background-color: #bdd124; color: #000; font-size: 16px; font-weight: 600; cursor: pointer; transition: 0.3s; font-family: 'Plus Jakarta Sans', sans-serif;">Tutup</button>
            </div>
        `;
        setTimeout(() => {
            overlay.children[0].style.transform = 'scale(1)';
            overlay.children[0].style.opacity = '1';
        }, 10);
    }, 300);
}

function showTournamentModal() {
    let overlay = document.getElementById('global-modal-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'global-modal-overlay';
        overlay.style = 'display: none; position: fixed; z-index: 9999; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.8); justify-content: center; align-items: center; opacity: 0; transition: opacity 0.3s ease;';
        document.body.appendChild(overlay);
    }

    overlay.innerHTML = `
        <div style="background-color: #1f1f1f; padding: 0; border-radius: 24px; width: 90%; max-width: 500px; position: relative; text-align: left; transform: translateY(-20px); transition: transform 0.3s ease; border: 1px solid #333; overflow: hidden; box-shadow: 0 25px 60px rgba(0,0,0,0.6);">
            <span onclick="closeGlobalModal()" style="position: absolute; top: 20px; right: 25px; color: #fff; font-size: 28px; cursor: pointer; z-index: 10;">&times;</span>
            <div style="height: 180px; background: url('../asset/turnamen.png') center/cover; position: relative;">
                <div style="position: absolute; inset: 0; background: linear-gradient(to top, #1f1f1f, transparent);"></div>
            </div>
            <div style="padding: 32px;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px;">
                    <div>
                        <h2 style="font-size: 28px; color: #fff; font-weight: 800; margin-bottom: 4px;">Minton Cup 2026</h2>
                        <p style="color: #bdd124; font-weight: 600; font-size: 14px;">Tournament Regional Surabaya</p>
                    </div>
                    <div style="background: rgba(189, 209, 36, 0.1); padding: 8px 12px; border-radius: 8px; border: 1px solid #bdd124;">
                        <span style="color: #bdd124; font-weight: 700; font-size: 18px;">Rp 150K</span>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 32px;">
                    <div style="background: #111; padding: 16px; border-radius: 12px; border: 1px solid #222;">
                        <p style="color: #666; font-size: 12px; margin-bottom: 4px;">Tanggal</p>
                        <p style="color: #fff; font-size: 14px; font-weight: 600;">12 - 15 Juni 2026</p>
                    </div>
                    <div style="background: #111; padding: 16px; border-radius: 12px; border: 1px solid #222;">
                        <p style="color: #666; font-size: 12px; margin-bottom: 4px;">Lokasi</p>
                        <p style="color: #fff; font-size: 14px; font-weight: 600;">GOR Sudirman</p>
                    </div>
                </div>

                <div style="color: #aaa; font-size: 14px; line-height: 1.6; margin-bottom: 32px;">
                    Ikuti turnamen badminton paling bergengsi tahun ini! Daftarkan tim ganda atau tunggal Anda dan perebutkan total hadiah senilai <b>Rp 50.000.000</b> serta trofi eksklusif Minton.
                </div>

                <div style="display: flex; gap: 12px;">
                    <button onclick="closeGlobalModal()" 
                            onmouseenter="this.style.backgroundColor='#ff4444'; this.style.borderColor='#ff4444';" 
                            onmouseleave="this.style.backgroundColor='transparent'; this.style.borderColor='#333';"
                            style="flex: 1; padding: 14px; border-radius: 12px; border: 1px solid #333; background-color: transparent; color: #fff; font-size: 16px; font-weight: 600; cursor: pointer; transition: 0.3s;">Tutup</button>
                    <button onclick="confirmTournament()" style="flex: 2; padding: 14px; border-radius: 12px; border: none; background-color: #bdd124; color: #000; font-size: 16px; font-weight: 600; cursor: pointer; transition: 0.3s;">Daftar Sekarang</button>
                </div>
            </div>
        </div>
    `;

    overlay.style.display = 'flex';
    setTimeout(() => {
        overlay.style.opacity = '1';
        overlay.children[0].style.transform = 'translateY(0)';
    }, 10);
}

function confirmTournament() {
    const overlay = document.getElementById('global-modal-overlay');
    overlay.children[0].style.transform = 'scale(0.8)';
    overlay.children[0].style.opacity = '0';

    setTimeout(() => {
        overlay.innerHTML = `
            <div style="background-color: #1f1f1f; padding: 40px; border-radius: 24px; width: 90%; max-width: 400px; position: relative; text-align: center; border: 1px solid #333; box-shadow: 0 20px 50px rgba(0,0,0,0.5);">
                <div style="width: 80px; height: 80px; background: rgba(189, 209, 36, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px;">
                    <i class="fa-solid fa-trophy" style="font-size: 32px; color: #bdd124;"></i>
                </div>
                <h2 style="font-size: 24px; margin-bottom: 12px; color: #fff; font-weight: 700;">Pendaftaran Berhasil!</h2>
                <p style="color: #aaa; margin-bottom: 32px; font-size: 15px; line-height: 1.6;">Selamat! Anda telah terdaftar di <b>Minton Cup 2026</b>. Tim kami akan segera menghubungi Anda untuk verifikasi data dan pembayaran pendaftaran.</p>
                <button onclick="closeGlobalModal()" style="width: 100%; padding: 14px; border-radius: 12px; border: none; background-color: #bdd124; color: #000; font-size: 16px; font-weight: 600; cursor: pointer; transition: 0.3s; font-family: 'Plus Jakarta Sans', sans-serif;">Selesai</button>
            </div>
        `;
        setTimeout(() => {
            overlay.children[0].style.transform = 'scale(1)';
            overlay.children[0].style.opacity = '1';
        }, 10);
    }, 300);
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
        '.section-label', '.lb-list', '.mabar-card',
        '.stat-card', '.mabar-card-dash', '.turnamen-card',
        '.court-card-dash', '.history-card', '.dashboard-card',
        '.profile-card', '.section-header', '.hero-left', '.hero-right',
        '.cta-content', '.info-card', '.booking-card', '.table-container',
        '.hero-image', '.page-hero-content', '.auth-container'
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
