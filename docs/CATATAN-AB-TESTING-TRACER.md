# Catatan A/B Testing — Tracer Study KarirLink

> **Status:** Eksperimen (belum final). PRD Portal Tracer Study **tidak diupdate** sampai ada pemenang A/B yang disepakati.
> **Terakhir diperbarui:** 21 Juli 2026

---

## 1. Latar Belakang & Masalah

Saat ini di KarirLink (lihat `mockup/quantum/index.html`), satu Perguruan Tinggi bisa memiliki **banyak kuesioner/template** tracer study (Draft / Siap Kirim / Terkirim, masing-masing dengan Template Lengkap / Kemdikbud / Pengguna Lulusan).

**Temuan tim:** model multi-template ini **memakan beban operasional Admin CDC** — mereka harus membangun, memfinalisasi, dan mengirim template berulang kali tiap periode/angkatan.

**Hipotesis:** mengganti model multi-template dengan **Single & Living Questionnaire** akan mengurangi beban operasional Admin CDC tanpa mengorbankan kepatuhan regulasi & kualitas data.

---

## 2. Dua Dimensi A/B (independen / orthogonal)

Ada **dua sumbu yang diuji terpisah**. Keduanya bisa dikombinasikan (2×2), jadi saat menyusun mockup perlu jelas kombinasi mana yang sedang digambarkan.

### Dimensi 1 — Model Kuesioner
- **A1. Baseline (existing):** Multi-template — Admin CDC membuat banyak kuesioner per periode/angkatan. Alur: `index.html` → buat template → finalisasi → kirim → dashboard. Sudah terdokumentasi di PRD Portal Tracer Study.
- **B1. Single & Living Questionnaire (usulan):**
  - **Single:** cukup SATU kuesioner per PT (mengikuti pola tracerstudy.kemdiktisaintek.go.id). Admin tidak lagi membangun ulang pertanyaan standar.
  - **Living:** timeline Lulusan menentukan wave aktif, dan wave menentukan konten yang tampil:
    - **Wave Exit** (baru lulus) — pemutakhiran data individu Lulusan. Dominan tier *Specific* (bisa dipersonalisasi kampus).
    - **Wave G1** (H+1 tahun setelah lulus) — pertanyaan inti wajib. Dominan tier *Core* (terkunci, default). Acuan Core: Tracer Kemdikti + Kemenkes.
    - **Wave G2** (lebih lama) — pendalaman relevansi prodi/internal. Dominan tier *Optional* (nice to have: sampai tingkat fakultas & prodi).

### Dimensi 2 — Struktur Navigasi (Portal Tracer Study vs Portal Karir)
- **A2. Terpisah (existing):** Dari **Gate**, user memilih akses → masuk ke **Portal Tracer Study** ATAU **Portal Karir** sebagai dua modul terpisah, masing-masing punya navbar/dashboard sendiri.
- **B2. Tergabung (usulan):** Dari **Gate**, satu entri **"KarirLink Admin CDC"** yang menggabungkan Portal Karir + Tracer Study. Navbar ringkas hanya beberapa menu:
  - **Dashboard** — halaman utama: data riwayat karier & profil mahasiswa/alumni (dari Portal Karir) + data riwayat pengisian Tracer Study. *Nice to have:* jika mahasiswa dapat pekerjaan dari Portal Karir, datanya **sync** ke master dashboard.
  - **Kuesioner** — Tracer Study untuk Alumni + Student Survey untuk Mahasiswa Aktif. *Nice to have:* Kuesioner/Evaluasi Kerja Sama dengan Perusahaan, feedback aktivitas Event.
  - **Mahasiswa/Alumni** — pantau tren karier & prestasi mahasiswa/alumni; pantau lamaran mahasiswa/alumni.
  - **Aktivitas** — pantau status kerja sama dengan Perusahaan; pantau & buat Event; pantau kalender aktivitas CDC.

> **Catatan:** kedua model dashboard (A2 & B2) sama-sama memusatkan "riwayat karier + riwayat pengisian tracer". Perbedaan intinya di **jumlah pintu masuk & struktur navbar**, bukan di data yang ditampilkan.

---

## 3. Keputusan Konsep yang Sudah Disepakati

1. **`wave` dan `tier` adalah DUA atribut terpisah pada setiap pertanyaan** — bukan satu hal yang sama.
   - `wave` = *kapan* pertanyaan ditanya (exit / g1 / g2), berdasarkan kapan data paling akurat diukur.
   - `tier` = *komparabilitas & siapa yang mengontrol* pertanyaan (core / optional / specific).
   - Distribusi cenderung: Exit→banyak Specific, G1→dominan Core, G2→banyak Optional — tapi tetap disimpan sebagai dua label agar fleksibel (mis. tetap boleh ada field Core di Exit seperti konfirmasi NIM/email).

2. **Core = dikelola sistem, terkunci** — sumber utama pengurangan beban admin. Menjamin komparabilitas & national monitoring (sejalan Schomburg).

3. **Admin CDC hanya mengonfigurasi Specific (Exit) + memilih Optional (G2)**; Core otomatis.

4. **Grounding regulasi (Kepmen 358/2025, IKU #2):** tracer study inti dilakukan **1 tahun setelah kelulusan** → memvalidasi "Exit ringan, G1 wajib". Responden minimum pakai rumus **Slovin galat 2,3%**.

---

## 4. Keputusan Desain yang Masih Terbuka (perlu diselesaikan)

- [ ] **Versioning:** "single" tetap perlu version pinning per response (respons lama terikat versi saat diisi) demi integritas data.
- [ ] **Penghitungan responden per wave+cohort** untuk IKU/Slovin — denominator di-scope per angkatan pada titik H+1, bukan counter global.
- [ ] **Backfill logic:** jika alumni pertama login sudah H+3 (G2) tapi belum pernah isi G1 — diarahkan isi G1 dulu atau langsung G2?
- [ ] **Panel mortality:** monitoring drop-out per wave & prodi (Schomburg hal. 32, 37).
- [ ] **Track Pengguna Lulusan (employer):** kemungkinan track paralel yang ter-trigger di G1/G2.
- [ ] **Kombinasi dua dimensi:** apakah A/B menguji 4 kombinasi (2×2) atau hanya varian tertentu (mis. B1+B2 vs A1+A2)? Perlu disepakati agar mockup tidak meledak jumlahnya.
- [ ] **Data sync Portal Karir → Dashboard (nice to have):** jika mahasiswa dapat kerja lewat Portal Karir, statusnya otomatis mengisi data karier di master dashboard (dan berpotensi memengaruhi IKU #2).

---

## 5. Metrik Keberhasilan A/B (TBD)

> Perlu ditentukan bersama sebelum eksekusi A/B. Kandidat awal:
- Waktu & jumlah langkah Admin CDC untuk menyiapkan + mengirim survei (beban operasional).
- Response rate per wave (Exit / G1 / G2).
- Kelengkapan data IKU #2 pada titik H+1 (memenuhi Slovin 2,3%?).
- Tingkat drop-out panel antar wave.
- Kepuasan/kemudahan yang dipersepsikan Admin CDC.

---

## 6. Glosarium

- **Gate** — layar pemilihan modul di ekosistem Sevima (URL pola `.../gate/menu#karirlink`) yang tampil **sebelum** user masuk ke modul tertentu. Berisi "Daftar Modul" (Administrasi Aplikasi, SIM Akademik, KarirLink, dll) + "Daftar Role". Titik awal semua alur Admin CDC.
- **Wave** — fase waktu pengisian berdasarkan timeline lulusan: Exit (baru lulus), G1 (H+1 tahun), G2 (lebih lama).
- **Tier** — klasifikasi komparabilitas/kontrol pertanyaan: Core (terkunci, wajib), Optional (institusi pilih), Specific (bebas/personalisasi).

---

## 7. Referensi

- Schomburg, H. — *Key Methodological Issues of Tracer Studies* (INCHER-Kassel, 2014): tipe institutional survey, wave design (Exit/G1/G2), struktur Core/Optional/Specific, panel design, response rate.
- Kepmen Dikti Saintek No. 358/M/KEP/2025 — IKU PT, khususnya IKU #2 (lulusan bekerja/wirausaha/lanjut studi H+1) — lihat `regulasi/iku-kepmen-358-2025.md`.
- Kondisi existing: `karirlink/mockup/quantum/index.html` dan PRD Portal Tracer Study.

---

## 8. Progress & Handoff (untuk sesi berikutnya)

**Status per 21 Juli 2026:** Mockup A/B Admin CDC sudah dibuat & sudah di-restyle ke **Quantum**.

### Lokasi
`karirlink/mockup/ab-testing/` (+ `README.md`).

### Sudah selesai
- **Paket A — `paket-a-baseline/`** (multi-template + portal terpisah): `gate.html`, `pilih-portal.html`, `tracer-dashboard.html`, `tracer-kuesioner.html`, `karir-beranda.html`.
- **Paket B — `paket-b-usulan/`** (single living + portal tergabung): `gate.html`, `dashboard.html`, `kuesioner.html` (flagship: timeline wave Exit/G1/G2 + badge tier Core/Optional/Specific + lock/edit), `mahasiswa-alumni.html`, `aktivitas.html`, `alumni-detail.html`.
- **Dashboard Paket B diperkaya** (request Institut Muslim Cendekia): filter Fakultas/Prodi/Angkatan/Tahun Lulus, persebaran alumni per lokasi kerja, demografi gender per daerah (#1, #2).
- **`alumni-detail.html`** (dibuka dari `mahasiswa-alumni.html`) mencakup: profil SIAKAD, Profil Terkini (self-update) vs Snapshot Jawaban Tracer (terkunci/IKU), Riwayat Karier (timeline append-only, #5), Riwayat Perubahan Data/audit trail (siapa/kapan/sumber, #4).
- Semua halaman KarirLink pakai **Quantum** (`header header_compact`, `.card`, `.nav-tab`, `.btn`, Chart.js). `gate.html` tetap gaya Sevima SITU AKADEMIK (bukan halaman KarirLink).
- Path aset: `../../../../karir_prompt/slicing-karirlink-v2/...` + `../../quantum/assets/css/main.css` (folder ab-testing 1 level lebih dalam dari `mockup/quantum/`).

### Keputusan yang sudah dikunci
- `wave` (Exit/G1/G2) dan `tier` (Core/Optional/Specific) = **dua atribut terpisah**.
- Exit = ringan/pemutakhiran data (dominan Specific); G1 = H+1, pertanyaan inti wajib (dominan Core, acuan Kemdikti+Kemenkes, isi IKU #2); G2 = pendalaman prodi (dominan Optional).
- Grounding regulasi: Kepmen 358/2025 IKU #2 → tracer inti H+1, responden min. Slovin galat 2,3%.
- PRD **tidak** diupdate sampai pemenang A/B disepakati.
- Styling A/B = Quantum untuk semua halaman KarirLink.

### Belum dikerjakan (kandidat lanjutan)
- **Sisi Lulusan/Alumni (SEPAKET, sesi khusus):** (a) wizard pengisian adaptif per wave (Exit/G1/G2), dan (b) **view self-update** alumni (request #3: pindah kerja/jabatan/domisili). Keduanya sisi alumni → dikerjakan bersama.
- Track **Pengguna Lulusan (employer)**.
- **Metrik keberhasilan A/B** masih TBD (lihat bagian 5).
- Tombol/aksi masih dummy (Publish Versi, Edit, Buat Event).
- Keputusan terbuka lain: versioning/version-pinning, penghitungan responden per wave+cohort, backfill logic, panel mortality, sync Portal Karir→Dashboard (lihat bagian 4).

---

## 9. Input Requirement dari Institut Muslim Cendekia (21 Juli 2026)

> Belum masuk PRD (konsisten dengan kesepakatan). Dicatat sebagai kandidat pengayaan mockup, condong memperkuat **Paket B**.

**Request:**
1. **Dashboard persebaran alumni per lokasi kerja** (provinsi/kota) + filter prodi, fakultas, angkatan, tahun lulus.
2. **Dashboard demografi alumni** (mis. sebaran lulusan L/P yang bekerja per daerah).
3. **Self-update alumni** — alumni memperbarui data mandiri saat pindah kerja, ganti jabatan, pindah domisili.
4. **Monitoring PIC Alumni/CDC** — riwayat perubahan data alumni (audit trail): siapa update, kapan terakhir, + notifikasi bila ada perubahan.
5. **Riwayat karier alumni** — perpindahan pekerjaan terdokumentasi (bukan hanya tempat kerja terakhir).

**Analisis & prinsip desain yang disepakati:**
- Kelima request memperkuat arah **single & living**; #3 dan #5 adalah wujud "living" dari sisi alumni.
- **Pisahkan dua bidang data:**
  - *Snapshot wave* (jawaban tracer per wave, terkunci setelah submit) → untuk IKU & komparabilitas (point-in-time, mis. H+1).
  - *Profil terkini* (boleh terus di-update mandiri) → untuk dashboard kondisi sekarang.
  - Self-update mengisi profil terkini, **tidak menimpa** snapshot wave.
- **Gender/prodi/fakultas/angkatan** dari SIAKAD (master data, tidak ditanya ulang). Lokasi/jabatan dari tracer + self-update.
- **Riwayat karier = event log append-only** (tanggal, perusahaan, jabatan, lokasi), bukan field yang ditimpa. Membantu akurasi masa tunggu (IKU #2).
- **Audit trail:** tiap data punya `source` (SIAKAD / self-update / jawaban wave / edit admin) + `timestamp` + `actor`.
- **Self-update = pelengkap, bukan pengganti** survei wave terstruktur (representativeness & Slovin tetap dari wave G1).
- **Privacy & consent (PII):** self-update + simpan riwayat karier + tampil ke CDC butuh consent eksplisit & penanganan PII.

**Pengelompokan:** Analitik (#1, #2) · Model data (#3, #5) · Governance (#4).
