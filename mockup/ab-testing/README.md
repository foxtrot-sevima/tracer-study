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

## Paket B — Usulan (`paket-b-usulan/`)
Konsep baru.
- **Model Kuesioner:** Single & Living Questionnaire (satu kuesioner, wave Exit/G1/G2, tier Core/Optional/Specific).
- **Struktur Navigasi:** Portal Karir + Tracer Study **tergabung** (satu app, navbar ringkas).

| File | Fungsi |
|------|--------|
| `gate.html` | Layar Gate Sevima → satu entri "KarirLink Admin CDC" |
| `dashboard.html` | Master dashboard (karier + tracer, sync Portal Karir) |
| `kuesioner.html` | Single Living Questionnaire (konfigurasi wave & tier) |
| `mahasiswa-alumni.html` | Tren karier, prestasi, lamaran alumni (→ Detail) |
| `alumni-detail.html` | Detail alumni: profil terkini (self-update) vs snapshot wave, riwayat karier (timeline), audit trail perubahan data |
| `aktivitas.html` | Kerja sama perusahaan, event, kalender CDC |

## Catatan Teknis
- **8 halaman KarirLink pakai framework Quantum** (design system SEVIMA asli) — sama seperti `mockup/quantum/*`. CSS dirujuk dari `../../../../karir_prompt/slicing-karirlink-v2/vendors/quantum-.../qn-202310260001.css` + `../../quantum/assets/css/main.css`.
- **`gate.html` sengaja tetap gaya Sevima SITU AKADEMIK** (Tailwind) karena Gate adalah shell pemilihan modul, bukan halaman KarirLink.
- Chart.js CDN dipakai di halaman dashboard.
- Mockup statis; navigasi antar file via `<a href>`.
- Buka mulai dari `gate.html` di tiap folder untuk menelusuri alur.
