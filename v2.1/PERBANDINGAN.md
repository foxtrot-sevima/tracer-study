# Perbandingan Trade-off — FOX-983 A/B Test

Dokumen pembanding kompleksitas Admin vs fleksibilitas Alumni untuk 2 skenario prototype di `/v2.1/`, sebagai bahan keputusan desain final sebelum lanjut ke development (acceptance criteria FOX-983).

## Ringkasan satu-baris

| | **A — Alur Sederhana** | **B — Alumni Dapat Isi Kembali/Edit** |
|---|---|---|
| Filosofi | Sekali isi, seminimal mungkin langkah Admin | Data selalu up-to-date, Admin tetap punya kontrol granular |
| Prototype | [`a/`](./a/index.html) | [`b/`](./b/index.html) |
| Flowchart sumber | `docs/flow/alur-sederhana.md` | `docs/flow/alur-alumni-isi-kembali-edit.md` |

## Kompleksitas sisi Admin

| Aspek | A — Sederhana | B — Isi Kembali/Edit |
|---|---|---|
| Konsep yang harus dipahami Admin | 1: "Kuesioner" (susun -> simpan -> kirim, satu langkah gabungan), pertanyaan dari bank soal Core/Optional | 2: Template Version (riwayat, tidak bisa diedit setelah publish) + Campaign (institusi+wave+cohort+tanggal) — **model yang sudah berjalan sekarang, tidak ada penambahan** |
| Langkah dari "mulai" ke "terkirim ke lulusan" | Susun -> Simpan sebagai Template -> Kirim (3 klik) | Susun -> Preview -> Publish Template Version -> Buat Campaign (isi institusi/wave/cohort/tanggal) -> Campaign aktif (5+ klik) — alur yang sudah berjalan sekarang, tidak berubah |
| Menambah pertanyaan baru per-section tier (Core/Optional/Wave-khusus) | Ada — bank soal Core (terkunci, wajib) + Optional (toggle on/off), tidak ada pertanyaan freetext/manual | Ada — tiap section punya `waveScope`, perlu dipahami Admin mana yang Core/Optional/khusus-wave (mekanisme yang sudah berjalan sekarang) |
| Menyasar angkatan/wave tertentu | Pilih Tahun Lulus langsung saat kirim | Wave dihitung otomatis dari cohort_year, Admin bisa override per Campaign (mekanisme yang sudah berjalan sekarang) |
| Mengelola Template Pengguna Lulusan | Opsi checkbox "Kirimkan Juga Template Pengguna Lulusan" saat kirim (fitur yang sudah ada, sama di A) | Sama seperti A — fitur yang sudah ada, bukan pembeda skenario |
| **Kesimpulan** | **Beban kognitif & jumlah klik Admin jauh lebih rendah** | **Sisi Admin TIDAK berubah dari yang sudah berjalan sekarang — kompleksitasnya tetap sama. Trade-off B murni ada di sisi Alumni, lihat bagian berikut** |

## Fleksibilitas sisi Alumni

| Aspek | A — Sederhana | B — Isi Kembali/Edit |
|---|---|---|
| Setelah submit, bisa edit? | **Tidak** — status "Sudah Mengisi" adalah halaman terminal terkunci | **Ya** — tombol "Edit Jawaban" selama campaign masih aktif |
| Bisa lihat riwayat pengisian lintas wave? | Tidak ada halaman riwayat | Ada — `riwayat-pengisian.html`, daftar semua wave + status per wave |
| Penentuan wave (Exit/GS-I/GS-II) | Otomatis dari tahun lulus, read-only, sama seperti B | Sama — otomatis dari cohort_year, read-only bagi alumni |
| Risiko data "usang" (jawaban lama tidak update walau kondisi berubah) | Tinggi — begitu submit, data itu final sampai wave berikutnya | Rendah — alumni bisa update sewaktu-waktu selama campaign masih buka |
| **Kesimpulan** | **Pengalaman lebih cepat & jelas ("sudah selesai, tidak perlu balik lagi"), tapi data bisa jadi tidak representatif kalau kondisi alumni berubah** | **Data lebih akurat/representatif, tapi menambah 1 keputusan desain terbuka: perlu UI/reminder supaya alumni tahu mereka BISA balik & update** |

## Implikasi ke model data (lihat juga `COHORT-MATCHING.md`)

- **A** hanya butuh flag boolean "sudah submit / belum" per (respondent, campaign) — sederhana, tidak ada riwayat versi.
- **B** butuh menyimpan **riwayat/versi response** per (respondent_id, campaign_id) supaya "Edit Jawaban" tidak menimpa data tanpa jejak audit — ini pekerjaan backend tambahan yang tidak ada di A.

## Rekomendasi bahan diskusi PM

1. Kalau tujuan utama adalah **menaikkan response rate** (fokus FOX-943), **A** kemungkinan lebih efektif jangka pendek — makin sedikit gesekan (friction) di kedua sisi, makin tinggi kemungkinan alumni menyelesaikan pengisian.
2. Kalau tujuan utama adalah **kualitas/akurasi data jangka panjang** (laporan akreditasi, tren karier per angkatan), **B** lebih unggul — dan karena sisi Admin B tidak diubah dari yang sudah berjalan sekarang, effort development & training tambahan HANYA di sisi Alumni (halaman Riwayat Pengisian + tombol Edit Jawaban), bukan di seluruh alur admin.
3. Karena B sengaja dirancang tanpa mengubah sisi Admin, B pada dasarnya SUDAH menjadi opsi hybrid: model Admin yang sudah berjalan sekarang + kapabilitas "Edit Jawaban" alumni. Sisa pekerjaan yang perlu backend (riwayat/versi response per submission) dijelaskan di bagian "Implikasi ke model data" di atas.
