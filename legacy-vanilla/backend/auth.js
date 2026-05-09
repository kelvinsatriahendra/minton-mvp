const SUPABASE_URL = 'https://zsunvptdtqbncbghjqbl.supabase.co';
const SUPABASE_KEY = 'sb_publishable_JjWesIkDAmLhdwfzyGiRfA_VVqwSJhZ';
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function handleRegister(e) {
    e.preventDefault();
    const btnSubmit = document.getElementById('btnSubmit');
    const originalText = btnSubmit.innerHTML;
    btnSubmit.innerHTML = '<i class="fa-solid fa-spinner fa-spin" style="margin-right: 8px;"></i> Memproses...';
    btnSubmit.disabled = true;
    btnSubmit.style.opacity = '0.7';
    btnSubmit.style.cursor = 'not-allowed';
    
    const namaValue = document.getElementById('nama').value.trim();
    const waValue = document.getElementById('whatsapp').value.trim();
    const emailValue = document.getElementById('email').value.trim();
    const passwordValue = document.getElementById('password').value;
    
    if (passwordValue.length < 8) {
        alert('Kata sandi terlalu pendek! Harus minimal 8 karakter untuk keamanan.');
        btnSubmit.innerHTML = originalText;
        btnSubmit.disabled = false;
        btnSubmit.style.opacity = '1';
        btnSubmit.style.cursor = 'pointer';
        return;
    }
    
    if (waValue.length < 10 || isNaN(waValue)) {
        alert('Format Nomor Whatsapp tidak valid! Harus berupa angka dan minimal 10 digit.');
        btnSubmit.innerHTML = originalText;
        btnSubmit.disabled = false;
        btnSubmit.style.opacity = '1';
        btnSubmit.style.cursor = 'pointer';
        return;
    }
    
    const payload = {
        nama_lengkap: namaValue,
        whatsapp: waValue,
        email: emailValue,
        password: passwordValue
    };
    
    try {
        const { data, error } = await supabaseClient
            .from('users')
            .insert([payload]);
        if (error) {
            throw error;
        }
        localStorage.setItem('userName', payload.nama_lengkap);
        document.getElementById('modalMessage').innerText = "Pendaftaran berhasil! Akun Anda telah tersimpan di Supabase.";
        document.getElementById('successModal').style.display = 'flex';
    } catch (error) {
        console.error('Error:', error);
        alert('Gagal Mendaftar: ' + (error.message || 'Terjadi kesalahan jaringan.'));
        btnSubmit.innerHTML = originalText;
        btnSubmit.disabled = false;
        btnSubmit.style.opacity = '1';
        btnSubmit.style.cursor = 'pointer';
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const btnSubmit = document.getElementById('btnSubmit');
    const originalText = btnSubmit.innerHTML;
    btnSubmit.innerHTML = '<i class="fa-solid fa-spinner fa-spin" style="margin-right: 8px;"></i> Sedang Masuk...';
    btnSubmit.disabled = true;
    btnSubmit.style.opacity = '0.7';
    btnSubmit.style.cursor = 'not-allowed';
    
    const loginId = document.getElementById('loginId').value;
    const loginPassword = document.getElementById('loginPassword').value;
    
    try {
        const isEmail = loginId.includes('@');
        const columnToCheck = isEmail ? 'email' : 'whatsapp';
        const { data, error } = await supabaseClient
            .from('users')
            .select('*')
            .eq(columnToCheck, loginId)
            .eq('password', loginPassword);
            
        if (error) {
            throw error;
        }
        
        if (data && data.length > 0) {
            const user = data[0];
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userName', user.nama_lengkap);
            sessionStorage.setItem('flashMessage', JSON.stringify({
                title: 'Login Berhasil',
                message: `Selamat datang kembali, ${user.nama_lengkap}! Siap untuk mendominasi lapangan hari ini?`
            }));
            window.location.href = '../index.html';
        } else {
            alert('Maaf, Email/Whatsapp atau Kata Sandi Anda salah.');
            btnSubmit.innerHTML = originalText;
            btnSubmit.disabled = false;
            btnSubmit.style.opacity = '1';
            btnSubmit.style.cursor = 'pointer';
        }
    } catch (err) {
        console.error('Error Login:', err);
        alert('Terjadi kesalahan pada server saat login.');
        btnSubmit.innerHTML = originalText;
        btnSubmit.disabled = false;
        btnSubmit.style.opacity = '1';
        btnSubmit.style.cursor = 'pointer';
    }
}
