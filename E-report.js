// Ambil data dari localStorage (kalau ada)
let data = JSON.parse(localStorage.getItem("penjualan")) || [];
let counter = data.length ? data[data.length - 1].no + 1 : 1;

// Tambahkan variabel DOM
const loginContainer = document.getElementById("loginContainer");
const dashboardContainer = document.getElementById("dashboardContainer");
const bodyElement = document.body;
// Tambahan variabel untuk daftar produk (agar bisa disembunyikan saat login)
const productListContainer = document.getElementById("productListContainer"); 
const tableBody = document.getElementById("tableBody"); 
const totalPendapatanSpan = document.getElementById("totalPendapatan"); 


// Fungsi untuk menampilkan dashboard dan menyembunyikan login
function showDashboard() {
    loginContainer.classList.add('d-none'); // Sembunyikan login
    if (productListContainer) {
        productListContainer.classList.add('d-none'); // Sembunyikan daftar produk
    }
    dashboardContainer.classList.remove('d-none'); // Tampilkan dashboard
    // Ubah style body agar cocok untuk dashboard
    bodyElement.classList.add('dashboard-page');
    updateTable(); // Pastikan tabel di-render
}

// Fungsi untuk menampilkan login dan menyembunyikan dashboard
function showLogin() {
    loginContainer.classList.remove('d-none'); // Tampilkan login
    if (productListContainer) {
        productListContainer.classList.remove('d-none'); // Tampilkan daftar produk
    }
    dashboardContainer.classList.add('d-none'); // Sembunyikan dashboard
    // Kembalikan style body untuk full-screen login
    bodyElement.classList.remove('dashboard-page');
}

// Cek status login saat halaman dimuat
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (isLoggedIn) {
        showDashboard();
    } else {
        showLogin();
    }
}

// --- LOGIC LOGOUT ---
function logout() {
    if (confirm("Yakin ingin Logout?")) {
        localStorage.removeItem('isLoggedIn'); // Hapus status login
        showLogin(); // Tampilkan halaman login
        document.getElementById("username").value = ""; // Bersihkan form
        document.getElementById("password").value = "";
    }
}

// --- LOGIC LOGIN ---
document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const message = document.getElementById("message");

    // Contoh login sederhana (dummy)
    const user = {
        username: "Admin Toko Sembako",
        password: "Sukses",
    };

    if (username === user.username && password === user.password) {
        message.style.color = "green";
        message.textContent = "Login successful!";

        localStorage.setItem('isLoggedIn', 'true'); // Simpan status
        setTimeout(() => {
            showDashboard(); // Panggil fungsi untuk menampilkan dashboard
            message.textContent = ""; // Bersihkan pesan
        }, 1000);
    } else {
        message.style.color = "red";
        message.textContent = "Invalid username or password!";
    }
});
// --- END LOGIC LOGIN ---


// Simpan ke localStorage
function simpanKeLocalStorage() {
    localStorage.setItem("penjualan", JSON.stringify(data));
}

// Tambah data
document.getElementById("addDataForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const namaProduk = document.getElementById("namaProduk").value;
    const kategori = document.getElementById("kategori").value;
    const jumlah = parseInt(document.getElementById("jumlah").value);
    const harga = parseInt(document.getElementById("harga").value);
    const total = jumlah * harga;

    data.push({ no: counter, namaProduk, kategori, jumlah, harga, total });
    counter++;

    simpanKeLocalStorage();
    updateTable();
    this.reset();

    const modal = bootstrap.Modal.getInstance(document.getElementById("addDataModal"));
    modal.hide();
});

// Update tabel
function updateTable() {
    tableBody.innerHTML = "";

    data.forEach((item, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.namaProduk}</td>
            <td>${item.kategori}</td>
            <td>${item.jumlah}</td>
            <td>Rp ${item.harga.toLocaleString("id-ID")}</td>
            <td>Rp ${item.total.toLocaleString("id-ID")}</td>
            <td>
                <button class="btn btn-warning btn-sm me-2" onclick="editData(${index})">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="hapusData(${index})">Hapus</button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    hitungTotalPendapatan();
}

// Hapus data
function hapusData(index) {
    if (confirm("Yakin ingin menghapus data ini?")) {
        data.splice(index, 1);
        simpanKeLocalStorage();
        updateTable();
    }
}

// Hapus semua data
function hapusSemuaData() {
    if (confirm("Hapus semua data penjualan?")) {
        data = [];
        counter = 1;
        simpanKeLocalStorage();
        updateTable();
    }
}

// Edit data
function editData(index) {
    const item = data[index];
    document.getElementById("editIndex").value = index;
    document.getElementById("editNamaProduk").value = item.namaProduk;
    document.getElementById("editKategori").value = item.kategori;
    document.getElementById("editJumlah").value = item.jumlah;
    document.getElementById("editHarga").value = item.harga;

    // Pastikan modal muncul
    const modal = new bootstrap.Modal(document.getElementById("editDataModal"));
    modal.show();
}

// Simpan hasil edit
document.getElementById("editDataForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const index = document.getElementById("editIndex").value;
    const namaProduk = document.getElementById("editNamaProduk").value;
    const kategori = document.getElementById("editKategori").value;
    const jumlah = parseInt(document.getElementById("editJumlah").value);
    const harga = parseInt(document.getElementById("editHarga").value);
    const total = jumlah * harga;

    // Pastikan data di-update sebagai objek lengkap
    data[index] = { no: data[index].no, namaProduk, kategori, jumlah, harga, total };

    simpanKeLocalStorage();
    updateTable();

    const modal = bootstrap.Modal.getInstance(document.getElementById("editDataModal"));
    modal.hide();
});

// Hitung total pendapatan
function hitungTotalPendapatan() {
    const totalPendapatan = data.reduce((acc, item) => acc + item.total, 0);
    document.getElementById("totalPendapatan").innerText =
        "Rp " + totalPendapatan.toLocaleString("id-ID");
}

// Saat halaman dimuat, cek status login
window.onload = checkLoginStatus;