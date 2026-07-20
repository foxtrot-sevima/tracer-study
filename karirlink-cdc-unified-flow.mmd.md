# Alur Aplikasi Karirlink Admin CDC (Gabungan)

Dokumen ini menggabungkan dua diagram yang sebelumnya terpisah menjadi satu alur aplikasi utuh:

- **[karirlink-admin-cdc-menu.mmd.md](./karirlink-admin-cdc-menu.mmd.md)** — struktur menu/navigasi aplikasi Karirlink Admin CDC (Dashboard, Kuesioner, Mahasiswa/Alumni, Aktivitas).
- **[tracer-study-flow.mmd.md](./tracer-study-flow.mmd.md)** — alur proses bisnis detail untuk fitur Tracer Study, sisi Admin CDC maupun sisi Alumni.

Kaitannya: diagram menu adalah **kerangka navigasi** aplikasi, sedangkan alur Tracer Study adalah **proses detail yang berjalan di dalam menu "Kuesioner"**. Hasil dari proses itu (response yang masuk, status campaign) mengalir balik ke menu **Dashboard** (riwayat pengisian) dan menu **Mahasiswa/Alumni** (tren karier).

---

## Diagram Gabungan

```mermaid
flowchart TD

    GATE["Masuk dari Gate"] --> APP["Karirlink Admin CDC<br/><br/>Portal Karier dan Portal<br/>Tracer Study digabung,<br/>tidak sendiri-sendiri"]

    APP --> DASH
    APP --> KUES
    APP --> MHS
    APP --> AKT

    %% ================= DASHBOARD =================
    subgraph DASH["📊 Menu Dashboard (Halaman Utama)"]
        DASH1["Data riwayat karier &<br/>profil mahasiswa/alumni"]
        DASH2["Data riwayat<br/>pengisian Tracer Study"]
        DASH3["Nice to have: sync data<br/>pekerjaan dari Portal Karier<br/>ke master dashboard"]
    end

    %% ================= KUESIONER =================
    subgraph KUES["📋 Menu Kuesioner"]
        direction TB
        KUES_TYPE["Tracer Study → Alumni<br/>Student Survey → Mahasiswa Aktif<br/><br/><i>Nice to have:</i><br/><i>Kuesioner/Evaluasi Kerjasama Perusahaan</i><br/><i>Kuesioner feedback aktivitas Event</i>"]

        subgraph ADMIN_FLOW["Alur Admin CDC — susun & kelola Tracer Study"]
            A1["Admin akses<br/>KarirLink via Gate"]
            A2["Pilih jenis survei<br/>Lulusan / Pengguna Lulusan"]
            A3["Susun Template"]
            A4["Preview pertanyaan &<br/>validasi pertanyaan"]
            A5["Publish<br/>Template Version"]
            A6["Buat / konfirmasi Campaign:<br/>institusi + wave + cohort_year +<br/>tanggal buka-tutup"]
            A7(["Campaign aktif,<br/>notifikasi terkirim"])
            A8[/"Monitoring Tracer Study:<br/>response rate, drop-out,<br/>per prodi & angkatan"/]

            A1 --> A2 --> A3 --> A4 --> A5 --> A6 --> A7 --> A8
            A2 -. "campaign lain untuk angkatan/wave berbeda" .-> A2
        end

        subgraph ALUMNI_FLOW["Alur Alumni — mengisi Tracer Study"]
            B1["Akses via Gate,<br/>karirlink.id, atau<br/>link dari notifikasi email(?)"]
            B2["Login sbg Alumni<br/>(nim; cohort_year<br/>terbaca otomatis)"]
            B3["Hitung wave<br/>dari cohort_year"]
            B4{"Cohort match wave<br/>Exit / GS-I / GS-II<br/>saat ini?"}
            B5(["Belum ada survei aktif<br/>untuk angkatan ini<br/>saat ini (selesai)"])
            B6{"Sudah pernah<br/>submit Response utk<br/>campaign + wave ini?"}
            B7(["Sudah pernah isi<br/>& lengkap"])
            B8["Resolve Template:<br/>Core + Optional aktif + Specific"]
            B9["Buka Wizard,<br/>isi step-per-step"]
            B10["Jawab & kirim<br/>Kuesioner"]
            B11["Selesai"]

            B1 --> B2 --> B3 --> B4
            B4 -- "tidak match" --> B5
            B4 -- "ya" --> B6
            B6 -- "sudah pernah" --> B7
            B6 -- "belum pernah" --> B8 --> B9 --> B10 --> B11
        end

        KUES_TYPE -.-> A1
        A7 -. "data campaign + template aktif -<br/>trigger notifikasi" .-> B1
        B7 -. "terdapat history & dapat mengisi kembali" .-> B3
        B11 -. "terdapat history & dapat mengisi kembali" .-> B3
        A7 -.-> A8
    end

    %% ================= MAHASISWA / ALUMNI =================
    subgraph MHS["🎓 Menu Mahasiswa/Alumni"]
        MHS1["1. Memantau Tren Karier<br/>Mahasiswa/Alumni dan<br/>Prestasi Mahasiswa"]
        MHS2["2. Memantau Lamaran<br/>Mahasiswa/Alumni"]
    end

    %% ================= AKTIVITAS =================
    subgraph AKT["🗓️ Menu Aktivitas"]
        AKT1["1. Memantau status<br/>kerjasama dengan Perusahaan"]
        AKT2["2. Memantau dan<br/>Membuat Event"]
        AKT3["3. Memantau Calendar<br/>Aktivitas CDC"]
    end

    %% ================= INTEGRASI DATA ANTAR MENU =================
    B11 -. "response tersimpan" .-> DASH2
    A8 -. "agregat monitoring" .-> DASH2
    B11 -. "nice to have: data karier hasil isian" .-> MHS1
    DASH3 -. "nice to have" .-> DASH1

    classDef nice stroke-dasharray: 4 3,fill:#f5f5f5;
    class DASH3,KUES_TYPE nice;
```

---

## Detail per Bagian

### 1. Entry & Shell Aplikasi

Semua pengguna — baik Admin CDC maupun Alumni — masuk lewat **Gate**. Setelah masuk, mereka berada di dalam satu aplikasi **Karirlink Admin CDC**, yang menyatukan apa yang sebelumnya dua portal terpisah: **Portal Karier** dan **Portal Tracer Study**. Ini adalah keputusan produk kunci di balik diagram menu asli — tidak ada lagi konteks "pindah aplikasi" antara mengelola karier dan mengelola tracer study.

### 2. Menu Dashboard

Halaman utama setelah login. Menampilkan dua sumber data utama:

| Data | Sumber |
| --- | --- |
| Riwayat karier & profil mahasiswa/alumni | Portal Karier |
| Riwayat pengisian Tracer Study | Hasil alur Kuesioner (lihat §3) — akumulasi dari `B11` (submit selesai) dan `A8` (agregat monitoring) |

**Nice to have**: jika alumni mendapat pekerjaan lewat Portal Karier, datanya sync otomatis ke master dashboard — tidak perlu re-entry manual.

### 3. Menu Kuesioner — Alur Tracer Study

Menu ini adalah tempat proses dari `tracer-study-flow.mmd.md` berjalan. Ada dua jenis kuesioner aktif saat ini (Tracer Study untuk Alumni, Student Survey untuk Mahasiswa Aktif), dengan rencana nice-to-have untuk Kuesioner Kerjasama Perusahaan dan Kuesioner Feedback Event.

#### 3a. Sisi Admin CDC (`A1`–`A8`)

Alur linear untuk menyiapkan & memonitor satu campaign survei:

1. **A1–A2**: Admin masuk dan memilih jenis survei (Lulusan atau Pengguna Lulusan).
2. **A3–A5**: Menyusun template pertanyaan, melakukan preview & validasi, lalu publish sebagai *Template Version* (versioning eksplisit — perubahan template tidak menimpa versi yang sudah dipakai campaign berjalan).
3. **A6**: Membuat/konfirmasi *Campaign* — kombinasi institusi, wave, cohort_year, dan periode buka-tutup. Loop `A2 -.-> A2` menunjukkan admin bisa membuat campaign paralel lain untuk angkatan/wave yang berbeda.
4. **A7**: Campaign aktif → notifikasi terkirim ke alumni target (lihat §3b, `B1`).
5. **A8**: Monitoring real-time — response rate, drop-out, breakdown per prodi & angkatan. Data ini juga mengalir ke Dashboard (`DASH2`).

#### 3b. Sisi Alumni (`B1`–`B11`)

Alur pengisian kuesioner oleh alumni, dipicu oleh campaign yang aktif di sisi admin:

1. **B1–B2**: Alumni mengakses (via Gate, karirlink.id, atau link notifikasi email) dan login — `cohort_year` terbaca otomatis dari NIM.
2. **B3–B4**: Sistem menghitung *wave* dari cohort_year, lalu cek apakah cohort ini match dengan wave (Exit / GS-I / GS-II) yang sedang berjalan.
   - Tidak match → **B5**: belum ada survei aktif untuk angkatan ini saat ini.
3. **B6**: Jika match, cek apakah alumni sudah pernah submit response untuk campaign + wave ini.
   - Sudah pernah → **B7**: ditampilkan sebagai sudah lengkap.
   - Belum pernah → **B8–B11**: resolve template (Core + Optional aktif + Specific) → buka wizard → isi step-per-step → submit → selesai.
4. Baik `B7` maupun `B11` bisa kembali memicu `B3` di kesempatan lain — selama masih ada history dan wave/campaign baru yang relevan (mis. alumni yang sama disurvei lagi di wave GS-II setelah sebelumnya mengisi Exit Survey).

### 4. Menu Mahasiswa/Alumni

Dua sub-fitur monitoring: tren karier & prestasi mahasiswa/alumni, dan pemantauan lamaran kerja. Nice to have: data hasil isian Tracer Study (`B11`) turut memperkaya data tren karier yang ditampilkan di sini.

### 5. Menu Aktivitas

Mencakup pemantauan kerjasama perusahaan, pembuatan & pemantauan event, serta kalender aktivitas CDC. Bagian ini tidak berinteraksi langsung dengan alur Tracer Study saat ini, tapi menjadi sumber untuk kuesioner nice-to-have (evaluasi kerjasama, feedback event) yang disebut di §3.

---

## Titik Integrasi Data Antar Menu

| Dari | Ke | Keterangan |
| --- | --- | --- |
| `A7` (campaign aktif) | `B1` (akses alumni) | Trigger notifikasi email/link ke alumni target campaign |
| `A7` | `A8` | Campaign aktif langsung masuk radar monitoring |
| `B11` (submit selesai) | `DASH2` (riwayat pengisian) | Setiap response tersimpan menambah riwayat di Dashboard |
| `A8` (agregat monitoring) | `DASH2` | Angka response rate/drop-out ikut ditampilkan di Dashboard |
| `B11` | `MHS1` (tren karier) | *Nice to have* — data isian tracer study memperkaya tren karier alumni |
| Portal Karier (dapat kerjaan) | `DASH1` (profil/riwayat karier) | *Nice to have* — sync otomatis ke master dashboard |

## Legenda Notasi

| Bentuk | Arti |
| --- | --- |
| Persegi panjang | Langkah proses / halaman |
| Diamond `{ }` | Keputusan / percabangan |
| Stadium `([ ])` | Kondisi akhir / terminal (selesai, tidak ada aksi lanjut) |
| Parallelogram `[/ /]` | Tampilan data / output (dashboard monitoring) |
| Kotak putus-putus (abu-abu) | Fitur **nice to have** — belum jadi prioritas utama |
| Panah putus-putus `-.->` | Aliran data / trigger antar bagian, bukan urutan langkah langsung |
| Panah penuh `-->` | Urutan langkah langsung dalam satu alur |

---

## Ringkasan Status Fitur

| Fitur | Status |
| --- | --- |
| Menu Dashboard (riwayat karier + riwayat pengisian) | Utama |
| Kuesioner: Tracer Study (Alumni) | Utama |
| Kuesioner: Student Survey (Mahasiswa Aktif) | Utama |
| Kuesioner: Evaluasi Kerjasama Perusahaan | Nice to have |
| Kuesioner: Feedback Event | Nice to have |
| Menu Mahasiswa/Alumni (tren karier, lamaran) | Utama |
| Menu Aktivitas (kerjasama, event, kalender) | Utama |
| Sync data pekerjaan Portal Karier → Dashboard | Nice to have |
| Sync data isian Tracer Study → tren karier | Nice to have |
