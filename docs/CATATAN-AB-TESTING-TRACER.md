# Catatan A/B Testing — Tracer Study KarirLink

> **Status:** Eksperimen (belum final). PRD Portal Tracer Study **tidak diupdate** sampai ada pemenang A/B yang disepakati.
> **Terakhir diperbarui:** 4 Agustus 2026
>
> **Perubahan besar sejak 21 Juli 2026:** seluruh isi kuesioner Wave G1 sudah dipetakan ke **kode Dikti resmi**, dan format pengirimannya ke Kemdiktisaintek sudah terdokumentasi. Ini menggeser sifat Paket B: dari usulan konsep menjadi usulan yang **isinya sudah terverifikasi terhadap sumber resmi**. Rinciannya di **§10**.

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

5. **Yang mengikat adalah kode Dikti, bukan redaksi pertanyaan.** Diksi pertanyaan dan opsi boleh disesuaikan selama maknanya tidak bergeser; tipe data juga bebas. Yang tidak boleh berubah: kode tetap melekat ke pertanyaan/opsi yang maknanya sama, nilai `value` tetap melekat ke opsi yang maknanya sama, dan **struktur opsi berkode tidak boleh digabung, dihapus, atau ditambah**. Redaksi tetap dikunci di produk, tapi dasarnya **kebijakan komparabilitas antar-PT**, bukan keharusan teknis. Framing ini penting saat dijelaskan ke Admin CDC.

6. **Definisi Core jadi objektif dan bisa diaudit.** Core = (berkode Dikti dan wajib) ATAU (wajib agar sistem berjalan) ATAU (wajib agar evaluasi prodi bisa dilakukan). Sebelumnya tier ditentukan secara intuitif; sekarang bisa ditunjuk dasarnya per pertanyaan, dengan daftar pengecualian yang tercatat.

7. **Poltekkes tetap PT di bawah PDDikti**, jadi modelnya **Core (Kemdikti) + delta Kemenkes** — bukan irisan dua regulator. Bundle Kemenkes adalah tambahan, bukan pengganti. Regulator diperlakukan sebagai **tag**, bukan penentu cabang.

---

## 4. Keputusan Desain yang Masih Terbuka (perlu diselesaikan)

- [ ] **Versioning:** "single" tetap perlu version pinning per response (respons lama terikat versi saat diisi) demi integritas data.
- [ ] **Penghitungan responden per wave+cohort** untuk IKU/Slovin — denominator di-scope per angkatan pada titik H+1, bukan counter global.
- [ ] **Backfill logic:** jika alumni pertama login sudah H+3 (G2) tapi belum pernah isi G1 — diarahkan isi G1 dulu atau langsung G2?
- [ ] **Panel mortality:** monitoring drop-out per wave & prodi (Schomburg hal. 32, 37).
- [x] ~~**Track Pengguna Lulusan (employer):** kemungkinan track paralel yang ter-trigger di G1/G2.~~ — **diputuskan dan sudah dimockup.** Trigger-nya otomatis setelah alumni mengisi G1 dan menyebutkan email atasan (`k2`). Instrumennya 12 pertanyaan, hanya 3 berkode (`gu_*` sebagai kunci pencocokan), tidak dikirim ke Dikti karena ini kebutuhan BAN-PT Indikator 14B. Mockup: `simulasi-pengguna-lulusan.html`.
- [ ] **Kombinasi dua dimensi:** apakah A/B menguji 4 kombinasi (2×2) atau hanya varian tertentu (mis. B1+B2 vs A1+A2)? Perlu disepakati agar mockup tidak meledak jumlahnya.
- [ ] **Data sync Portal Karir → Dashboard (nice to have):** jika mahasiswa dapat kerja lewat Portal Karir, statusnya otomatis mengisi data karier di master dashboard (dan berpotensi memengaruhi IKU #2).
- [x] ~~**Sisi responden untuk Paket A.**~~ — **sudah dibuat** sebagai `paket-a-baseline/simulasi-pengisian.html` (4 Agustus 2026). Halaman 1 mereproduksi Mode Pratinjau KarirLink apa adanya, dengan tombol *Tandai pertanyaan bermasalah* yang mati secara bawaan supaya reproduksinya tetap jujur. Halaman 2–8 tidak direka-reka. Selisih A vs B sekarang bisa dilihat berdampingan.
- [ ] **Kolom teks "Lainnya" belum punya tempat di schema.** `is_other_dikti_code` hanya menyimpan satu kode (penanda). Kode teksnya (`f416`, `f1614`) belum ada kolomnya — perlu keputusan: kolom tambahan atau konvensi turunan.

---

## 5. Metrik Keberhasilan A/B (TBD)

> Perlu ditentukan bersama sebelum eksekusi A/B. Kandidat awal:
- Waktu & jumlah langkah Admin CDC untuk menyiapkan + mengirim survei (beban operasional).
- Response rate per wave (Exit / G1 / G2).
- Kelengkapan data IKU #2 pada titik H+1 (memenuhi Slovin 2,3%?).
- Tingkat drop-out panel antar wave.
- Kepuasan/kemudahan yang dipersepsikan Admin CDC.

**Kandidat tambahan yang baru bisa diukur setelah pemetaan §10 selesai:**

- **Jumlah pertanyaan tidak relevan yang dilihat alumni, per status.** Sekarang bisa dihitung persis dari matriks cabang. Contoh: alumni berstatus "Belum memungkinkan bekerja" di model datar melihat pertanyaan tentang jumlah lamaran dan alasan pekerjaan tidak sesuai — keduanya mengandaikan ia punya pekerjaan.
- **Jumlah pertanyaan yang benar-benar diisi vs ditampilkan.** Proksi langsung untuk beban pengisian.
- **Kelengkapan kolom pengiriman per cabang.** Dari 86 kolom, berapa yang terisi benar untuk tiap status. Ini mengukur kesiapan lapor, bukan sekadar response rate.
- **Jumlah jawaban "Lainnya" yang punya teks penjelas.** Nol berarti ada kebocoran data seperti yang ditemukan di §10.3.

---

## 6. Glosarium

- **Gate** — layar pemilihan modul di ekosistem Sevima (URL pola `.../gate/menu#karirlink`) yang tampil **sebelum** user masuk ke modul tertentu. Berisi "Daftar Modul" (Administrasi Aplikasi, SIM Akademik, KarirLink, dll) + "Daftar Role". Titik awal semua alur Admin CDC.
- **Wave** — fase waktu pengisian berdasarkan timeline lulusan: Exit (baru lulus), G1 (H+1 tahun), G2 (lebih lama).
- **Tier** — klasifikasi komparabilitas/kontrol pertanyaan: Core (terkunci, wajib), Optional (institusi pilih), Specific (bebas/personalisasi).

---

## 7. Referensi

### 7.1 Landasan konsep & regulasi

- Schomburg, H. — *Key Methodological Issues of Tracer Studies* (INCHER-Kassel, 2014): tipe institutional survey, wave design (Exit/G1/G2), struktur Core/Optional/Specific, panel design, response rate.
- Kepmen Dikti Saintek No. 358/M/KEP/2025 — IKU PT, khususnya IKU #2 (lulusan bekerja/wirausaha/lanjut studi H+1) — lihat `regulasi/iku-kepmen-358-2025.md`.
- PerBAN-PT 35/2025 Lamp. 3h — Indikator 14A & 14B, termasuk Survei Pengguna Lulusan dan syarat ≥50% responden.
- Kondisi existing: `karirlink/mockup/quantum/index.html` dan PRD Portal Tracer Study.

### 7.2 Dokumen isi kuesioner (dibuat sesudah 21 Juli 2026)

Empat dokumen ini menopang isi Wave G1 di Paket B. Urutan baca yang disarankan:

| Dokumen | Isi | Kapan dibuka |
|---|---|---|
| [Mapping Kode Dikti](Mapping-Kode-Dikti-Tracer-Study.md) | Analisis, aturan tier, keputusan desain, dan seluruh koreksi | Saat perlu tahu **kenapa** sesuatu diputuskan |
| [Tabel Master Pertanyaan](Tabel-Master-Pertanyaan-Tracer-Study.md) | 62 pertanyaan apa adanya + opsi + kode, digenerate dari JSON | Saat perlu redaksi persis atau daftar opsi |
| [Format Pengiriman Data ke Dikti](Format-Pengiriman-Data-ke-Dikti.md) | 86 kolom pengiriman, value resmi, kode wilayah, matriks per cabang | Saat membangun lapisan simpan/kirim |
| [Komparasi Kemdikti vs Kemenkes](Komparasi%20Kuesioner%20KEMDIKTI%20(Kemdiktisaintek)%20vs%20KEMENKES.md) | Urutan live site, penyelarasan definisi Core, sisi Kemenkes yang belum lengkap | Saat menyentuh bundle Kemenkes |

Ditambah [Bank Soal & Logic Interaktif](Bank%20Soal%20&%20Logic%20Interaktif%20-%20Prototype%20KarirLink%20v2.1a.md) yang merekam prototype v2.1/a dan landasan timeline wave.

### 7.3 Sumber primer dari Kemdikti

Tersimpan di `karirlink/docs/jawaban tracer study lulusan/`:

| Berkas | Isi |
|---|---|
| `Data Master Pertanyaan.html` | **Paling otoritatif.** 86 kolom pengiriman + value resmi tiap opsi |
| `Data Master Lokasi Kerja.html` | Kode numerik provinsi & kab/kota (terpotong di Kalimantan Selatan) |
| `Tracerstudy … [TERBARU 2024 …].md` | Panduan Form versi 2024 — yang berlaku |
| `Tracerstudy Kemendikbudristek Form.md` | Panduan Form 2023 — memuat `f504` yang sudah dihapus, **jangan dipakai** |
| `bekerja.md`, `wiraswasta.md`, `melanjutkan studi.md`, `tidak kerja tetapi sedang mencari kerja.md`, `belum memungkinkan bekerja.md` | Tangkapan kelima cabang live site, redaksi persis |

Ditambah `template-lengkap.json` dan `template-pddikti.json` di `karirlink/docs/` sebagai basis teknis.

---

## 8. Progress & Handoff (untuk sesi berikutnya)

**Status per 4 Agustus 2026:** Mockup A/B Admin CDC lengkap dan ber-Quantum. Sisi responden dan sisi pengguna lulusan sudah ada di Paket B. Isi kuesioner Wave G1 sudah terverifikasi terhadap sumber resmi Kemdikti (§10).

### Lokasi
`karirlink/mockup/ab-testing/` (+ `README.md`).

### Sudah selesai
- **Paket A — `paket-a-baseline/`** (multi-template + portal terpisah), **6 halaman**: `gate.html`, `pilih-portal.html`, `tracer-dashboard.html`, `tracer-kuesioner.html`, `karir-beranda.html`, dan **`simulasi-pengisian.html`** (sisi alumni, baru 4 Agustus).
- **Paket B — `paket-b-usulan/`** (single living + portal tergabung), **10 halaman**:

  | Berkas | Fungsi |
  |---|---|
  | `gate.html` | Satu entri "KarirLink Admin CDC" |
  | `dashboard.html` | Master dashboard karier + tracer |
  | `kuesioner.html` | **Flagship** — timeline wave, badge tier, keterangan per pertanyaan |
  | `mahasiswa-alumni.html` | Tren karier, prestasi, lamaran |
  | `alumni-detail.html` | Profil terkini vs Jawaban Tracer, riwayat karier, log aktivitas |
  | `aktivitas.html` | Kerja sama perusahaan, event, kalender |
  | **`simulasi-pengisian-alur.html`** | **Alur alumni** — tiga langkah, Langkah 2 bercabang sesuai status, peta pengisian + kartu konsekuensi |
  | **`simulasi-pengisian.html`** | **Katalog** — Wave Exit/G1/G2, ~447 blok, seluruh cabang G1 berdampingan |
  | **`simulasi-pengguna-lulusan.html`** | **Sisi atasan/perusahaan** — 12 aspek kinerja |
  | **`simulasi-email.html`** | Pratinjau email undangan/pengingat |

  Tiga halaman terakhir bertanda **baru sejak 21 Juli** — sebelumnya tercatat sebagai "belum dikerjakan".
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

**Prioritas terdekat:**

1. **Metrik keberhasilan A/B** — masih TBD sejak Juli. Tanpa metrik, eksperimen tidak bisa disimpulkan. Kandidat baru yang sekarang terukur ada di §5.
2. **View self-update alumni** (request #3 IMC: pindah kerja/jabatan/domisili). Satu-satunya bagian sisi alumni yang belum ada — wizard pengisiannya sudah selesai.
3. **Halaman 2–8 sisi responden Paket A** — hanya halaman 1 yang tertangkap. Sengaja tidak direka-reka. Kalau tangkapan berikutnya tersedia, lengkapi `paket-a-baseline/simulasi-pengisian.html`.

**Menunggu input dari luar repo:**

| Yang dibutuhkan | Dari siapa |
|---|---|
| `master-provinsi.xlsx` & `master-kab-kota.xlsx` lengkap | Situs Dikti — salinan di repo terpotong di Kalimantan Selatan |
| Arti `is_required`: "wajib diisi responden" atau "wajib ada di template" | Tim backend |
| Mekanisme transport pengiriman (unggah berkas / API / manual) | Tim yang pernah mengirim sungguhan |
| Tangkapan live site Kemenkes | Sisi Kemenkes masih level topik saja |

**Lain-lain:**

- Tombol/aksi masih dummy (Publish Versi, Edit, Buat Event).
- Dropdown wilayah masih `<select>` biasa dengan opsi contoh. Situs resmi memakai pola *searchable* (ketik dulu, opsi muncul) dan Kab/Kota terkunci sampai Provinsi dipilih — untuk 528 pilihan, pola itu jauh lebih baik.
- Keputusan terbuka lain: versioning/version-pinning, penghitungan responden per wave+cohort, backfill logic, panel mortality, sync Portal Karir→Dashboard, tempat kolom teks "Lainnya" di schema (lihat §4).

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

---

## 10. Pemetaan Kode Dikti (Juli–Agustus 2026)

Bagian ini merekam badan kerja terbesar sesudah 21 Juli: memastikan isi kuesioner Wave G1 di Paket B **benar-benar sesuai format resmi Kemdiktisaintek**, sampai ke tingkat kode dan nilai jawaban.

Sebelum ini, Paket B adalah usulan **konsep** — single & living, wave, tier. Sesudah ini, Paket B adalah usulan yang **isinya sudah terverifikasi terhadap sumber resmi**, dan bisa dipertanggungjawabkan pertanyaan per pertanyaan.

### 10.1 Yang dikerjakan

| Tahap | Hasil |
|---|---|
| Pemetaan pertanyaan & jawaban ke kode Dikti | 76 kode unik di empat level: pertanyaan, opsi jawaban, baris matriks, penanda "Lainnya" |
| Tabel master seluruh pertanyaan | 62 pertanyaan digenerate langsung dari `template-lengkap.json`, bukan ditulis tangan |
| Pemilihan basis template | `template-lengkap.json` (superset penuh dari pddikti: 27 kode sama, plus 14 pertanyaan tanpa kode) |
| Penyelarasan dokumen terdahulu | Dua definisi Core yang bertentangan (3 item vs 18 item) diselesaikan |
| Telaah tangkapan live site | Kelima cabang status diisi langsung; urutan tampil dan tanda wajib terverifikasi |
| Pembacaan Data Master resmi | 86 kolom pengiriman, value resmi tiap opsi, kode wilayah numerik |

### 10.2 Keputusan yang terkunci

Selain empat prinsip di §3 poin 5–7, ini yang mengikat di tingkat isi:

- **Kuesioner Single & Living**, pengiriman berbasis **Periode Yudisium**, tanpa batas waktu isi. Cutoff ditentukan Kemdiktisaintek per triwulan.
- **Kode Dikti tidak ditampilkan di antarmuka.** Admin CDC tidak perlu melihat `f8` atau `f505`.
- **Pertanyaan UMR tidak ditanyakan ke alumni.** Nilainya diambil sistem dari tabel `ump` yang sudah ada di schema. Terkonfirmasi, bukan sekadar preferensi desain.
- **`f5c` (jabatan) ditanyakan juga di cabang Bekerja, tapi tidak dikirim ke Dikti.** Format resmi menandainya bersyarat hanya untuk Wiraswasta; jawaban dari cabang Bekerja disimpan sebagai data internal kampus.
- **Penyaringan per cabang lebih ketat daripada situs resmi.** Situs resmi menampilkan pertanyaan pencarian kerja ke semua status termasuk "Belum memungkinkan bekerja" — itu cacat relevansi, tidak ditiru.
- **Panduan Form 2024 yang berlaku.** Kode `f504` dari versi 2023 sudah dihapus; jangan diimplementasikan.

### 10.3 Empat kesalahan yang ditemukan dan diperbaiki di mockup

Telaah ini bukan hanya konfirmasi — ia menemukan cacat nyata di mockup Paket B yang sebelumnya lolos:

| Cacat | Akibat kalau lolos ke produksi |
|---|---|
| **Skala matriks metode pembelajaran terbalik.** Kolom 1 dipasangkan dengan "Tidak sama sekali", padahal format resmi menetapkan 1 = Sangat Besar | Prodi dengan metode pembelajaran terkuat akan tampil paling lemah di dashboard, **tanpa satu pun pesan kesalahan muncul** |
| **Enam opsi "Lainnya" tanpa kotak isian** | Yang terkirim hanya keterangan "lainnya" tanpa penjelasan. Justru isian inilah yang paling informatif karena memuat hal yang tidak terpikirkan saat opsi disusun |
| **Tiga pertanyaan yang seharusnya satu.** "Kapan mulai mencari pekerjaan" dipecah jadi tiga; masa tunggu dipecah jadi dua | Alumni mengisi lebih banyak kotak daripada perlu, dan bentuknya menyimpang dari format resmi |
| **Snapshot G1 saling bertentangan.** Menampilkan "bekerja sebelum lulus = Ya" bersama "masa tunggu = 4 bulan" | Data yang tidak konsisten di mata Admin CDC dan auditor |

Ditambah empat kolom identitas yang belum pernah ada di mockup: **NIK, NPWP, Kode Perguruan Tinggi, Kode Program Studi**.

Yang pertama patut diperhatikan khusus: itu kelas kesalahan **senyap**. Tidak ada yang gagal, tidak ada yang merah, datanya cuma terbalik. Ditemukan hanya karena `value` di template dibaca satu per satu.

### 10.4 Kenapa ini memperkuat Paket B

Keluhan yang memicu seluruh telaah ini datang dari Mode Pratinjau KarirLink yang berjalan sekarang: pertanyaan "Apakah Anda mendapatkan pekerjaan pertama sebelum lulus?" dan "Dalam berapa bulan…" **muncul tanpa syarat**, sehingga alumni yang belum pernah bekerja tetap melihatnya. Pertanyaan "Apakah Anda aktif mencari pekerjaan dalam 4 minggu terakhir?" juga muncul untuk alumni yang sudah bekerja.

Penyebabnya: KarirLink menampilkan pertanyaan per *section* secara datar. Percabangan hanya bekerja **antar halaman**, bukan **di dalam** halaman. Jadi tidak ada mekanisme menyembunyikan pertanyaan yang tidak relevan dengan jawaban sebelumnya.

Paket B menyaring per cabang, dan sekarang penyaringannya punya dasar yang bisa ditunjuk: matriks kolom-per-cabang dari lima tangkapan live site. Ini bukan preferensi desain lagi, tapi selisih yang bisa diukur — lihat kandidat metrik baru di §5.

**Yang belum ada:** Paket A tidak punya sisi responden, jadi selisih ini belum bisa dilihat berdampingan. Itu prioritas pertama di §8.

### 10.5 Catatan proses untuk sesi berikutnya

- **Angka di Tabel Master digenerate dari JSON, jangan disunting tangan.** Semua koreksi hidup di §9 dokumen itu sebagai lampiran, supaya tetap bisa dibandingkan dengan sumbernya. Kalau §1 dan §9 berselisih, **§9 yang berlaku**.
- **Data Master lebih otoritatif daripada template JSON** untuk apa pun yang menyangkut bentuk data terkirim. Untuk `value`, keduanya sudah terbukti sama.
- Sumber primer disimpan **di dalam repo** — pelajaran dari sisi Kemdikti yang folder tangkapan aslinya hilang dan tidak bisa ditelusuri ulang.
