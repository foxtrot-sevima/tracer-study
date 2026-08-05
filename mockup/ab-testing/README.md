# Mockup A/B Testing — KarirLink Tracer Study

Folder ini berisi mockup untuk eksperimen A/B (lihat `../../docs/CATATAN-AB-TESTING-TRACER.md`).
Diuji sebagai **2 paket**:

## Paket A — Baseline (`paket-a-baseline/`)
Kondisi mendekati existing.
- **Model Kuesioner:** Multi-template (banyak kuesioner per PT).
- **Struktur Navigasi:** Portal Tracer Study & Portal Karir **terpisah** (dua pintu dari Gate).

| File | Fungsi |
|------|--------|
| `gate.html` | Layar Gate Sevima → pilih akses (2 portal terpisah) |
| `pilih-portal.html` | Pemilihan Portal Tracer Study vs Portal Karir |
| `tracer-dashboard.html` | Dashboard Tracer Study |
| `tracer-kuesioner.html` | Daftar Kuesioner (multi-template) |
| `karir-beranda.html` | Beranda Portal Karir (terpisah) |
| `simulasi-pengisian.html` | **Sisi alumni** — reproduksi perilaku KarirLink yang berjalan sekarang. Punya tombol *Tandai pertanyaan bermasalah* yang mati secara bawaan |

> **Tentang `simulasi-pengisian.html` Paket A.** Halaman 1 disusun dari tangkapan layar Mode Pratinjau KarirLink dan mereproduksi perilakunya apa adanya: seluruh pertanyaan satu bagian tampil sekaligus tanpa memeriksa jawaban sebelumnya. Halaman 2–8 **sengaja tidak direka-reka** karena tangkapannya tidak tersedia — mengisi dengan dugaan akan membuat pembanding ini tidak bisa dipercaya. Halaman 1 sudah cukup untuk memperlihatkan selisihnya.

## Paket B — Usulan (`paket-b-usulan/`)
Konsep baru.
- **Model Kuesioner:** Single & Living Questionnaire (satu kuesioner, wave Exit/G1/G2, tier Core/Optional/Specific).
- **Struktur Navigasi:** Portal Karir + Tracer Study **tergabung** (satu app, navbar ringkas).

### Sisi Admin CDC

| File | Fungsi |
|------|--------|
| `gate.html` | Layar Gate Sevima → satu entri "KarirLink Admin CDC" |
| `dashboard.html` | Master dashboard (karier + tracer, sync Portal Karir) |
| `kuesioner.html` | **Flagship** — Single Living Questionnaire: timeline wave, badge tier, keterangan per pertanyaan |
| `mahasiswa-alumni.html` | Tren karier, prestasi, lamaran alumni (→ Detail) |
| `alumni-detail.html` | Profil terkini (self-update) vs Jawaban Tracer per wave, riwayat karier, log aktivitas |
| `aktivitas.html` | Kerja sama perusahaan, event, kalender CDC |

### Sisi responden

| File | Fungsi |
|------|--------|
| `simulasi-pengisian-alur.html` | **Alur alumni** — satu langkah pada satu waktu, isi Langkah 2 menyesuaikan status yang dipilih. Ada peta pengisian yang menempel di atas dan kartu konsekuensi tiap pilihan |
| `simulasi-pengisian.html` | **Katalog** — Wave Exit / G1 / G2 dengan pengalih wave. Wave G1 memuat seluruh cabang berdampingan beserta keterangan "Untuk Admin CDC" di tiap keputusan desain |
| `simulasi-pengguna-lulusan.html` | **Sisi atasan/perusahaan** — 12 aspek penilaian kinerja alumni untuk BAN-PT Indikator 14B |
| `simulasi-email.html` | Pratinjau email undangan dan pengingat |

Semuanya dibuka dari tombol **Simulasi Pengisian** di `kuesioner.html`.

> **Dua tampilan, dua tujuan.** `simulasi-pengisian-alur.html` untuk memahami **pengalaman alumni** — cocok saat mempresentasikan ke manajemen. `simulasi-pengisian.html` untuk memeriksa **isi kuesioner secara menyeluruh** — cocok saat mengonfigurasi atau mengaudit tier. Keduanya memuat pertanyaan Wave G1 yang sama, jadi **kalau salah satu diubah, yang lain harus ikut diperbarui.**

## Cara Menelusuri

Mulai dari `gate.html` di tiap folder.

| Yang ingin dibandingkan | Buka berdampingan |
|---|---|
| Sisi Admin CDC | `paket-a-baseline/tracer-kuesioner.html` ↔ `paket-b-usulan/kuesioner.html` |
| **Sisi alumni** | `paket-a-baseline/simulasi-pengisian.html` ↔ `paket-b-usulan/simulasi-pengisian-alur.html` |

Untuk perbandingan sisi alumni, buka Paket A lebih dulu **tanpa** menyalakan penanda — supaya terlihat bagaimana alumni sungguhan mengalaminya. Baru setelah itu nyalakan *Tandai pertanyaan bermasalah*.

Isi kuesioner Wave G1 di Paket B sudah **diverifikasi terhadap format resmi Kemdiktisaintek** sampai tingkat kode dan nilai jawaban. Kalau perlu menelusuri dasar suatu pertanyaan:

| Pertanyaannya | Buka |
|---|---|
| Kenapa pertanyaan ini terkunci / bisa dinonaktifkan? | `../../docs/Mapping-Kode-Dikti-Tracer-Study.md` §7 |
| Redaksi persis dan seluruh opsinya? | `../../docs/Tabel-Master-Pertanyaan-Tracer-Study.md` |
| Bentuk data yang dikirim ke Dikti? | `../../docs/Format-Pengiriman-Data-ke-Dikti.md` |
| Pertanyaan mana muncul di cabang mana? | `../../docs/Format-Pengiriman-Data-ke-Dikti.md` §5.1 |

## Catatan Teknis

- **14 halaman KarirLink pakai framework Quantum** (design system SEVIMA asli) — 5 di Paket A, 9 di Paket B. Sama seperti `mockup/quantum/*`. CSS dirujuk dari `../../../../karir_prompt/slicing-karirlink-v2/vendors/quantum-.../qn-202310260001.css` + `../../quantum/assets/css/main.css`.
- **Kedua `gate.html` sengaja tetap gaya Sevima SITU AKADEMIK** (Tailwind) karena Gate adalah shell pemilihan modul, bukan halaman KarirLink.
- Chart.js CDN dipakai di halaman dashboard.
- **Dropdown di Paket B memakai `<select>` biasa** dengan `appearance:menulist !important` — bukan `.select-default`, karena hook Choices.js tidak di-load di halaman-halaman itu. Pengecualian: `paket-a-baseline/tracer-dashboard.html` dan `tracer-kuesioner.html` memang memuat Choices.js, jadi di dua berkas itu `.select-default` aman dipakai.
- Copywriting dibuat **statis**, tidak digenerate JS, supaya isinya bisa dibaca langsung dari berkas.
- Mockup statis; navigasi antar file via `<a href>`. Tombol aksi masih dummy.

## Yang Perlu Diketahui Sebelum Menyunting

- **Kartu "Untuk Admin CDC"** di `simulasi-pengisian.html` memakai ikon ℹ️ dan menjelaskan alasan tiap keputusan desain. Kalau menambah pertanyaan, tambahkan kartunya juga — itu yang membuat mockup ini bisa dipakai sebagai bahan diskusi, bukan cuma tampilan.
- **Jangan menyusun ulang urutan kolom pada dua tabel matriks** di bagian Tingkat Kompetensi. Angka di baliknya sudah ditetapkan Dikti per label, dan arah skala kedua tabel **berlawanan** — kompetensi 5 = paling tinggi, metode pembelajaran 1 = paling besar.
- **Setiap opsi "Lainnya" wajib punya kotak isian teks** di bawahnya. Format resmi mengirim penanda dan teksnya sebagai dua data terpisah.
- Setelah menyunting, periksa keseimbangan tag `<div>`. `simulasi-pengisian.html` punya ~447 blok.
