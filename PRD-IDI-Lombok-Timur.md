# PRD – Sistem Data Keanggotaan Dokter IDI Kabupaten Lombok Timur

Versi 1.0 · Disusun untuk: Tuanmuda · Status: Draft untuk review

## 1. Ringkasan Produk

Sistem web untuk mendata seluruh dokter anggota Ikatan Dokter Indonesia (IDI) Cabang Kabupaten Lombok Timur, sekaligus menjadi etalase publik agar masyarakat mudah menemukan dokter terdekat. Sistem memiliki tiga sisi: **Admin** (pengelola data & iuran), **Anggota/Dokter** (mengelola profil pelayanan sendiri), dan **Pengunjung** (mencari, menyukai, dan menghubungi dokter).

## 2. Tujuan & Indikator Keberhasilan

- Seluruh 50 dokter anggota IDI Lombok Timur terdata digital (biodata, SIP, tempat praktik) — target 100% dalam 3 bulan setelah peluncuran.
- Pengurus dapat memantau status iuran anggota secara real-time tanpa rekap manual.
- Masyarakat dapat menemukan dokter berdasarkan kecamatan dan kategori dalam maksimal 3 klik.
- Dokter aktif memperbarui profil sendiri (target ≥ 70% profil lengkap).
- Halaman publik memuat < 3 detik pada koneksi seluler 4G.

## 3. Peran Pengguna

| Peran | Deskripsi | Akses |
|---|---|---|
| Admin | Pengurus IDI Lombok Timur (ketua, sekretaris, bendahara) | Panel admin penuh |
| Anggota (Dokter) | Dokter terdaftar yang diberi akun oleh admin | Hanya halaman miliknya sendiri |
| Pengunjung | Masyarakat umum, tanpa login wajib | Halaman publik, like, chat/booking |

Catatan: sub-peran admin (Super Admin, Sekretaris, Bendahara) direkomendasikan agar bendahara hanya mengelola iuran. Dikonfirmasi pada tahap review.

## 4. Ruang Lingkup

**Termasuk:** manajemen data dokter, manajemen akses akun, iuran bulanan, filter kecamatan, profil dokter publik, pencarian, like, chat konsultasi/booking, dashboard anggota.

**Tidak termasuk (fase 1):** payment gateway untuk iuran (iuran dicatat manual oleh bendahara), chat real-time, pembayaran konsultasi online, video call, rekam medis pasien, resep digital.

## 5. Kebutuhan Fungsional

### 5.1 Modul Admin

**A1. Autentikasi & akses**

- Login admin dengan email/username dan kata sandi; opsi verifikasi OTP.
- Admin membuat akun anggota, mengaktifkan/menonaktifkan akses, dan mereset kata sandi.

**A2. Pendataan dokter**

- Tambah, lihat, ubah, nonaktifkan data dokter.
- Daftar seluruh dokter dengan pencarian nama, paginasi, dan ekspor (Excel/PDF).
- Detail profil dokter: foto, nama lengkap & gelar, NIK, jenis kelamin, tempat/tanggal lahir, nomor anggota IDI, nomor STR, nomor SIP beserta masa berlaku, kategori (dokter umum, dokter spesialis, subspesialis, dokter gigi, lainnya), jenis spesialisasi, kontak (HP/WA, email), alamat domisili.
- Tempat praktik (bisa lebih dari satu): jenis (pribadi/dinas), nama fasilitas, alamat, kecamatan, desa, koordinat peta, jadwal praktik.
- Dokumen terlampir (scan SIP/STR) — opsional.
- Pengingat otomatis SIP yang akan kedaluwarsa (90/30 hari): di samping masa berlaku SIP pada daftar dokter, detail dokter, dan profil anggota muncul label "Segera perpanjang" (oranye) jika sisa masa berlaku 90 hari atau kurang, dan label "SIP kedaluwarsa" (merah) jika sudah lewat.

**A3. Filter & laporan**

- Filter berdasarkan kecamatan (seluruh kecamatan di Lombok Timur), kategori dokter, spesialisasi, jenis tempat praktik, status iuran, status aktif.
- Kombinasi filter dapat disimpan dan diekspor.

**A4. Iuran bulanan**

- Iuran sama untuk seluruh anggota: Rp100.000 per bulan (nominal dapat diubah admin di pengaturan).
- Pembayaran dapat dicatat untuk **1, 2, 3, 6 bulan, atau 12 bulan sekaligus**; sistem otomatis menandai bulan-bulan yang terlunasi (Rp100.000 / 200.000 / 300.000 / 600.000 / 1.200.000). Pembayaran dicatat manual oleh bendahara; belum ada pembayaran online pada fase 1.
- Status per anggota: Lunas, Menunggak (berapa bulan), Belum ada pembayaran.
- Riwayat pembayaran, tanggal bayar, metode (tunai/transfer), bukti bayar, nomor kuitansi.
- Ringkasan: total iuran terkumpul bulan ini, jumlah anggota lunas vs menunggak.
- Pengingat tunggakan via WhatsApp/email (fase lanjutan).

**A5. Dashboard admin**

- Kartu ringkasan: total dokter, dokter aktif, persentase iuran lunas, SIP segera berakhir.
- Grafik sebaran dokter per kecamatan dan per kategori.
- Aktivitas terbaru (anggota baru, pembayaran, pembaruan profil).

**A6. Moderasi**

- Admin dapat menyembunyikan profil dari halaman publik, meninjau laporan penyalahgunaan chat.

### 5.2 Modul Anggota (Dokter)

Anggota hanya melihat dan mengubah data miliknya sendiri.

- **Profil:** ganti foto profil dengan mengklik langsung foto profil (dari penyimpanan internal perangkat; JPG/PNG, maks 5 MB, dengan crop); biodata pelayanan, bio singkat, keahlian, dan bahasa diubah lewat tombol Edit/Pengaturan Profil.
- **Tempat praktik & jadwal:** edit alamat, jam praktik, tautan peta.
- **Galeri:** unggah foto tempat kerja/klinik (maks 8 foto).
- **Sosial media:** Instagram, Facebook, TikTok, YouTube, WhatsApp, website.
- **Statistik:** jumlah like profil, jumlah kunjungan profil.
- **Pesan:** kotak masuk pesan dari pengunjung (konsultasi/booking), balas, tandai selesai, notifikasi pesan baru.
- **Iuran (hanya lihat):** status iuran pribadi dan riwayat pembayaran.
- Data sensitif (NIK, nomor STR/SIP) hanya dapat diubah melalui pengajuan ke admin.

* **Daftar tempat praktik:** jika dokter berpraktik di beberapa tempat, profil menampilkan semua tempat praktik (nama, jenis pribadi/dinas, alamat, kecamatan, jadwal), dan dokter dapat menambah, mengubah, atau menghapus tempat praktik sendiri.
* **Ikon notifikasi:** di header halaman anggota, dengan lencana angka untuk (1) like baru dari pengunjung, (2) pesan/chat masuk baru, (3) pengingat iuran belum dibayar atau menunggak, dan (4) pengingat SIP yang mendekati masa berakhir. Notifikasi dapat ditandai sudah dibaca dan membuka halaman terkait.

- **Satu tombol Edit/Pengaturan Profil:** halaman profil anggota hanya memiliki satu tombol khusus untuk mengubah data (biodata pelayanan, tempat praktik, sosial media, galeri, dan foto). Halaman tidak dipenuhi tombol edit terpisah agar tampilan tetap bersih; foto profil diganti dengan klik langsung pada foto.
- **Keterangan SIP:** masa berlaku SIP ditampilkan di profil, disertai label "Segera perpanjang" bila mendekati habis.

### 5.3 Modul Pengunjung (Front End Utama)

- **Beranda menarik:** hero dengan kotak pencarian besar, pilihan cepat kategori (Dokter Umum, Spesialis Anak, Kandungan, Penyakit Dalam, Gigi, dll), daftar dokter populer (berdasarkan like), sebaran per kecamatan.
- **Pencarian dokter terdekat:** input daerah/kecamatan atau gunakan lokasi saya, pilih kategori/spesialisasi, urutkan (terdekat, paling disukai, nama).
- **Hasil pencarian:** kartu dokter (foto, nama, spesialis, tempat praktik, jarak, jumlah like) dengan tampilan daftar dan peta.
- **Profil dokter:** foto, bio, kategori, tempat praktik & jadwal, galeri, sosial media, peta lokasi, jumlah like.
- **Like (love):** pengunjung dapat menyukai dokter; satu perangkat/sesi satu like per dokter (pembatasan anti-spam; tanpa wajib login).
- **Chat konsultasi / booking:** pengunjung tidak perlu login, cukup mengisi nama, nomor HP, dan alamat, lalu pesan, tipe (konsultasi atau booking tempat), dan tanggal/jam yang diinginkan. Pesan masuk ke kotak pesan dokter (bukan chat real-time); opsi lanjut via WhatsApp.
- **Responsif:** prioritas mobile-first karena mayoritas pengunjung memakai ponsel.

## 6. Alur Utama

1. Admin menambah data dokter → membuat akun anggota → dokter menerima akses.
2. Dokter login → melengkapi profil, foto, sosial media → profil tampil di halaman publik.
3. Pengunjung mencari dokter (daerah + kategori) → membuka profil → like / kirim pesan.
4. Dokter menerima notifikasi pesan → membalas.
5. Bendahara mencatat iuran (1/2/3/6/12 bulan) → status anggota otomatis diperbarui → terlihat di dashboard.

## 7. Model Data (Ringkas)

- **users** (id, peran, email/username, password_hash, status_aktif)
- **doctors** (id, user_id, nama, gelar, NIK, jenis_kelamin, tempat_tgl_lahir, no_anggota_idi, no_str, kategori, spesialisasi, bio, foto, kontak, alamat, status)
- **sip** (id, doctor_id, nomor, tanggal_terbit, masa_berlaku, file)
- **practice_places** (id, doctor_id, jenis [pribadi/dinas], nama, alamat, kecamatan, desa, lat, lng, jadwal)
- **social_links** (id, doctor_id, platform, url)
- **gallery** (id, doctor_id, foto, urutan)
- **dues** (id, doctor_id, periode_bulan, nominal, status)
- **payments** (id, doctor_id, jumlah_bulan [1/2/3/6/12], total, tanggal, metode, bukti, no_kuitansi, dicatat_oleh)
- **likes** (id, doctor_id, visitor_token, created_at)
- **messages** (id, doctor_id, nama_pengunjung, kontak, tipe [konsultasi/booking], isi, jadwal_diminta, status, created_at)
- **districts** (id, nama_kecamatan)

## 8. Kebutuhan Non-Fungsional

- **Keamanan:** HTTPS, hash kata sandi, kontrol akses berbasis peran, pembatasan percobaan login, backup harian.
- **Privasi:** NIK dan dokumen hanya terlihat admin; nomor pribadi dokter tampil publik hanya jika dokter mengizinkan. Mengacu pada UU Pelindungan Data Pribadi.
- **Performa:** halaman publik < 3 detik; kompres gambar otomatis saat unggah.
- **Kompatibilitas:** Chrome, Safari, Firefox terbaru; Android & iOS.
- **Ketersediaan:** target uptime 99%.
- **Anti-spam:** rate limit pada like dan pesan, captcha ringan pada formulir pesan.

## 9. Panduan Visual (UI)

Mengacu pada gambar referensi (dashboard bergaya modern):

- **Layout:** sidebar kiri berwarna ungu pekat dengan menu ikon, area konten latar biru muda lembut, kartu putih bersudut sangat membulat (radius 24–32 px), header kartu berisi judul halaman + pencarian + tombol keluar.
- **Warna:** ungu utama (#5B4FA8), ungu muda & lavender untuk kartu aksen, biru muda (#E3ECFA) sebagai latar, hijau untuk status Lunas, merah muda/oranye untuk Menunggak.
- **Komponen:** badge status bulat, lencana angka pada menu, kartu profil dengan foto bulat, daftar bertimeline, kartu promosi ungu dengan tombol putih.
- **Tipografi:** sans-serif bersih (mis. Plus Jakarta Sans/Inter).
- **Halaman pengunjung:** memakai bahasa visual yang sama tetapi lebih cerah dan ramah — hero besar, kartu dokter berfoto, tombol hati (like) yang menonjol.
- Mockup interaktif tersedia pada halaman visual terlampir.

## 10. Rekomendasi Teknologi (Opsional)

- Front end: Next.js/React + Tailwind CSS, atau Laravel Blade + Tailwind.
- Back end: Laravel atau Node.js (NestJS) dengan REST API.
- Basis data: MySQL/PostgreSQL.
- Penyimpanan foto: object storage (S3-compatible) atau penyimpanan server dengan kompresi.
- Peta: Leaflet + OpenStreetMap (gratis) atau Google Maps.
- Notifikasi: email dan integrasi WhatsApp (fase lanjutan).

## 11. Peta Jalan Rilis

| Fase | Cakupan | Estimasi |
|---|---|---|
| 1 – Fondasi | Login, data dokter, SIP, tempat praktik, filter kecamatan | 3–4 minggu |
| 2 – Iuran | Pencatatan iuran 1/2/3/6/12 bulan, status & laporan | 2 minggu |
| 3 – Portal Anggota | Edit profil, foto, sosial media, galeri | 2–3 minggu |
| 4 – Front End Publik | Beranda, pencarian, profil, like, chat/booking | 3–4 minggu |
| 5 – Penyempurnaan | Notifikasi, pengingat SIP, ekspor, uji coba, peluncuran | 2 minggu |

## 12. Risiko & Pertanyaan Terbuka

**Keputusan yang sudah diambil:**

- Chat konsultasi berupa pesan masuk ke dokter, bukan real-time.
- Pengunjung tidak wajib login untuk like dan chat; untuk mengirim pesan wajib mengisi nama, nomor HP, dan alamat.
- Iuran sama untuk semua anggota: Rp100.000 per bulan.
- Iuran dicatat manual oleh bendahara untuk saat ini.
- Jumlah anggota awal: 50 dokter.

**Pertanyaan terbuka:**

- Validasi legal: kebijakan IDI terkait publikasi data dokter dan konsultasi online perlu dikonfirmasi ke pengurus IDI sebelum peluncuran, termasuk persetujuan tertulis dokter untuk menampilkan data di halaman publik.
- Perlukah pembatasan pesan per nomor HP (anti-spam) karena pengunjung tanpa login?

**Risiko dan mitigasi:**

- Kelengkapan data awal 50 dokter: admin menyiapkan formulir/template pengumpulan data (biodata, SIP, tempat praktik), lalu memverifikasi satu per satu sebelum akun dibuat.
- Adopsi dokter yang kurang familiar teknologi: pelatihan singkat, panduan bergambar, dan pendampingan oleh admin selama bulan pertama; admin juga dapat membantu mengisi profil.
