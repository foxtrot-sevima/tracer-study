# Arsitektur Pertanyaan Tracer Study — Rujukan Teknis

> **Tujuan dokumen ini:** Satu rujukan untuk backend developer dan tim produk. Mencakup: pertanyaan apa saja, di mana disimpan, kode apa yang dikirim ke Dikti, dan logika bisnisnya.
>
> **Konvensi penamaan:**
> - **Kolom DB** = nama kolom di PostgreSQL kita (snake_case, bahasa Indonesia boleh)
> - **Kode Dikti** = kode yang dipakai saat pengiriman ke Kemdiktisaintek (dari Data Master resmi)
> - Keduanya **tidak boleh dicampur** — mapping-nya ada di tabel ini

---

## 1. Wave Exit

**Tujuan:** Pemutakhiran data mahasiswa segera setelah lulus. Supaya sistem punya kontak aktif untuk mengirim Wave G1 dan G2 nanti.

**Kapan dikirim:** Saat yudisium / sebelum wisuda (dikonfigurasi Admin CDC).

**Catatan penting:** Pertanyaan di wave ini **tidak punya kode Dikti** — jawabannya jadi isian awal (pre-fill) untuk Wave G1, bukan data yang dikirim ke Kemdiktisaintek.

| # | Pertanyaan | Kolom DB (sumber) | Kolom DB (simpan) | Kode Internal | Kode Dikti | Value / Format | Wajib | Business Logic |
|---|---|---|---|---|---|---|---|---|
| 1 | Alamat email aktif Anda saat ini | `graduates.email` | `participants.email` | — (kolom dedicated) | `emailmsmh` | varchar, format email | Ya | Pre-fill dari SIAKAD. Disimpan langsung di kolom dedicated karena sistem butuh akses langsung untuk kirim wave. |
| 2 | Nomor HP / WhatsApp aktif | `graduates.no_hp` | `participants.no_hp` | — (kolom dedicated) | `telpomsmh` | varchar (nol depan jangan hilang) | Ya | Pre-fill dari SIAKAD. Disimpan langsung di kolom dedicated untuk kirim WhatsApp. |
| 3 | Apakah Anda sudah bekerja atau berwirausaha sebelum lulus? | — | `participant_answers` | `exit_status_pralulus` | — | radio: Ya sudah bekerja / Ya sudah berwirausaha / Belum | Ya | Tidak dikirim ke Dikti. **Jika Ya:** di G1, `g1_verif_pralulus` akan muncul. Kalau verifikasi juga Ya → `f8` otomatis terpilih dan `f502` otomatis `0`. Kalau verifikasi Tidak → alumni pilih status baru. |
| 4 | Nama tempat bekerja / usaha | — | `participant_answers` | `exit_perusahaan` | — | dropdown + ketik sendiri | Kondisional (jika #3 = Ya) | Muncul hanya jika #3 dijawab Ya. Pre-fill nama tempat kerja/usaha di G1. Sumber dropdown: tabel `companies` (Portal Karir). |
| 5 | Apa rencana utama Anda setelah lulus? | — | `participant_answers` | `exit_rencana` | — | radio: Bekerja / Berwirausaha / Melanjutkan studi / Lainnya | Tidak | Specific — bebas dinonaktifkan. Bahan program intervensi CDC. |
| 6 | Dukungan yang diharapkan dari kampus | — | `participant_answers` | `exit_dukungan` | — | checkbox multi-select + Lainnya (teks) | Tidak | Optional — conditional per rencana di #5. |
| 7 | Tautan profil LinkedIn | — | `participant_answers` | `exit_linkedin` | — | varchar, URL | Tidak | Specific — opsional. Membantu monitoring karier. |

**Catatan penyimpanan:**
- Pertanyaan **1–2** (email, HP) → **kolom dedicated** di `participants`. Alasan: sistem butuh akses langsung tanpa join untuk mengirim wave berikutnya.
- Pertanyaan **3–7** → **`participant_answers`** (pola EAV). Identitas pertanyaan ada di `quest_questions.code` = kolom "Kode Internal" di tabel ini. Query contoh: `WHERE qq.code = 'exit_status_pralulus'`.
- **Kode internal** dimasukkan ke `quest_questions.code` saat seed data — bukan kolom baru di tabel lain.

**Catatan rename kolom:** Schema saat ini memakai `participants.phone`. Rencana rename ke `participants.no_hp` supaya konsisten dengan `graduates.no_hp`. Ini perlu migrasi DB.

---

## 2. Wave G1 — Informasi Umum (semua status)

**Tujuan:** Pertanyaan inti untuk IKU #2. Minimal 1 tahun setelah lulus.

**Kapan dikirim:** Min. 12 bulan setelah lulus (syarat IKU#2 & BAN-PT).

| # | Pertanyaan | Kolom DB | Kode Internal | Kode Dikti | Value / Format | Wajib | Business Logic |
|---|---|---|---|---|---|---|---|
| — | Apakah pekerjaan/usaha sebelum lulus masih Anda jalankan? | `participant_answers` | `g1_verif_pralulus` | — | radio: Ya, masih / Tidak | Ya (kondisional) | Muncul jika di Exit menjawab Ya. Hanya 2 opsi. **Jika Ya:** (1) dicatat untuk IKU#2 kriteria (e)/(f), (2) `f8` otomatis terpilih sesuai jawaban Exit (Bekerja=1 atau Wiraswasta=3), (3) `f502` otomatis terisi `0` (masa tunggu nol bulan). **Jika Tidak:** alumni memilih status sendiri, `f502` tidak di-pre-fill. |
| 1 | Apa status Anda saat ini? | `participant_answers` | — | `f8` | 1=Bekerja (full time / part time), 2=Belum memungkinkan bekerja, 3=Wiraswasta, 4=Melanjutkan Pendidikan, 5=Tidak kerja tetapi sedang mencari kerja | Ya | **Gate question** — menentukan cabang pertanyaan selanjutnya. |
| 2 | Sumber dana kuliah | `participant_answers` | — | `f1201` | 1=Biaya Sendiri/Keluarga, 2=Beasiswa ADIK, 3=Beasiswa BIDIKMISI, 4=Beasiswa PPA, 5=Beasiswa AFIRMASI, 6=Beasiswa Perusahaan/Swasta, 7=Lainnya | Ya | Kode teks Lainnya: `f1202`. Bukan sumber dana studi lanjut. |
| 3 | Apakah Anda aktif mencari pekerjaan dalam 4 minggu terakhir? | `participant_answers` | — | `f1001` | 1=Tidak, 2=Tidak tapi menunggu hasil lamaran, 3=Ya akan mulai bekerja dalam 2 minggu, 4=Ya tapi belum pasti, 5=Lainnya | Ya | Kode teks Lainnya: `f1002` |
| 4 | Masa tunggu mendapatkan [pekerjaan/berwirausaha/melanjutkan studi] | `participant_answers` | — | `f502` | `0` = Ya, sebelum lulus (masa tunggu nol). Angka bulan = Tidak (mis. `3`, `12`) | Ya (kondisional) | Hanya muncul jika status Bekerja, Wiraswasta, atau Melanjutkan Pendidikan. Satu kolom di pengiriman. **Redaksi dan opsi dinamis per cabang — lihat tabel di bawah.** |

**Redaksi dinamis `f502` per cabang:**

| Cabang (f8) | Redaksi pertanyaan | Opsi jawaban | Pre-fill dari `g1_verif_pralulus`? |
|---|---|---|---|
| Bekerja (1) | "Apakah Anda mendapatkan pekerjaan pertama sebelum lulus?" | ○ Ya, sebelum lulus → `0`<br>○ Tidak, kira-kira ___ bulan sesudah lulus → angka | ✅ Jika verif = Ya → otomatis `0`, pertanyaan tidak muncul |
| Wiraswasta (3) | "Apakah Anda sudah mulai berwirausaha sebelum lulus?" | ○ Ya, sebelum lulus → `0`<br>○ Tidak, kira-kira ___ bulan sesudah lulus → angka | ✅ Jika verif = Ya → otomatis `0`, pertanyaan tidak muncul |
| Melanjutkan Pendidikan (4) | "Kapan Anda mulai melanjutkan pendidikan setelah lulus?" | ○ Sudah diterima/mulai sebelum lulus → `0`<br>○ Kira-kira ___ bulan sesudah lulus → angka | ❌ Tidak ada verifikasi — alumni selalu isi sendiri |

**Catatan:** Yang dikirim ke Dikti tetap **satu kolom `f502`** dengan value angka (0 atau bulan). Redaksi berbeda per cabang tidak mengubah format pengiriman.

---

## 3. Wave G1 — Cabang Bekerja

Muncul jika `f8` = 1 (Bekerja full time / part time).

| # | Pertanyaan | Kolom DB | Kode Dikti | Value / Format | Wajib | Business Logic |
|---|---|---|---|---|---|---|
| 1 | Pendapatan per bulan (Take Home Pay) | `participant_answers` | `f505` | angka (rupiah, tanpa pemisah) | Ya | Dibandingkan dengan UMP dari tabel `ump` berdasarkan `f5a1`. |
| 2 | Provinsi tempat bekerja | `participant_answers` | `f5a1` | kode numerik provinsi (dari tabel `provinces.code`) | Ya | Searchable dropdown. |
| 3 | Kabupaten/Kota tempat bekerja | `participant_answers` | `f5a2` | kode numerik kab/kota (dari tabel `cities.code`) | Ya | Terkunci sampai provinsi dipilih. |
| 4 | Apa jenis instansi / organisasi tempat Anda bekerja saat ini? | `participant_answers` | `f1101` | 1=Instansi pemerintah, 2=Organisasi non-profit/LSM, 3=Perusahaan swasta, 4=Wiraswasta/perusahaan sendiri, 5=Lainnya, 6=BUMN/BUMD, 7=Institusi/Organisasi Multilateral | Ya | Kode teks Lainnya: `f1102`. Perhatikan urutan value tidak berurut. Redaksi resmi pakai "perusahaan/instansi/institusi" tapi kita persingkat karena opsi jawaban sudah menjelaskan cakupannya. |
| 5 | Nama tempat bekerja | `participant_answers` | `f5b` | varchar (free text) | Ya | Searchable dropdown dari tabel `companies` (Portal Karir) + ketik sendiri jika belum ada. Alumni bisa bekerja di perusahaan, sekolah, yayasan, lembaga, dll. |
| 6 | Posisi/jabatan | `participant_answers` | `f5c` | 1=Founder, 2=Co-Founder, 3=Staff, 4=Freelance/Kerja Lepas | Ya | **Tidak dikirim ke Dikti untuk cabang Bekerja.** Disimpan sebagai data internal. Hanya dikirim jika `f8`=3 (Wiraswasta). |
| 7 | Tingkat tempat kerja | `participant_answers` | `f5d` | 1=Lokal/Wilayah/Wiraswasta tidak berbadan hukum, 2=Nasional/Wiraswasta berbadan hukum, 3=Multinasional/Internasional | Ya | — |
| 8 | Keeratan bidang studi dengan pekerjaan | `participant_answers` | `f14` | 1=Sangat Erat, 2=Erat, 3=Cukup Erat, 4=Kurang Erat, 5=Tidak Sama Sekali | Ya | — |
| 9 | Jenjang pendidikan yang sesuai | `participant_answers` | `f15` | 1=Setingkat Lebih Tinggi, 2=Tingkat yang Sama, 3=Setingkat Lebih Rendah, 4=Tidak Perlu Pendidikan Tinggi | Ya | — |
| 10 | Cara mencari pekerjaan | `participant_answers` | `f4` | 15 kolom biner: `f401`=Melalui iklan di koran/majalah/brosur, `f402`=Melamar ke perusahaan tanpa mengetahui lowongan, `f403`=Pergi ke bursa/pameran kerja, `f404`=Dihubungi oleh perusahaan, `f405`=Mencari lewat internet/iklan online/milis, `f406`=Menghubungi Kemenakertrans, `f407`=Menghubungi agen tenaga kerja komersial/swasta, `f408`=Memperoleh informasi dari pusat/kantor pengembangan karir fakultas/universitas, `f409`=Menghubungi kantor kemahasiswaan/hubungan alumni, `f410`=Membangun jejaring (network) sejak masih kuliah, `f411`=Melalui relasi (dosen, orang tua, saudara, teman, dll), `f412`=Membangun bisnis sendiri, `f413`=Melalui penempatan kerja atau magang, `f414`=Bekerja di tempat yang sama dengan tempat kerja semasa kuliah, `f415`=Lainnya + `f416` teks | Ya | Setiap opsi = satu kolom biner (0/1) di pengiriman. Jumlah opsi tidak boleh diubah. Jawaban bisa lebih dari satu. |
| 11 | Data atasan (nama, jabatan, email, no telp, alamat) | `participant_answers` | `k1` (nama), `k2` (email), sisanya tanpa kode | 5 × varchar | Ya | **Tidak dikirim ke Dikti.** Email atasan dipakai untuk trigger Survei Pengguna Lulusan otomatis. **Hanya ditanyakan di cabang Bekerja.** |

**Rincian field Data Atasan (#11):**

| Sub-field | Kolom DB | Kode Dikti | Format | Catatan |
|---|---|---|---|---|
| Nama atasan langsung | `participant_answers` (`atasan_nama`) | `k1` | varchar | — |
| Jabatan atasan | `participant_answers` (`atasan_jabatan`) | — | varchar | — |
| Email atasan | `participant_answers` (`atasan_email`) | `k2` | varchar, format email | **Dipakai trigger Survei Pengguna Lulusan otomatis** |
| No. Telp atasan | `participant_answers` (`atasan_telp`) | — | varchar | — |
| Alamat tempat kerja | `participant_answers` (`atasan_alamat`) | — | varchar | — |

> **⚠️ Pisah halaman di sini.** Setelah Data Atasan, alumni masuk ke halaman baru: **Tingkat Kompetensi** (bagian yang diisi semua status). Di mockup simulasi, ini ditandai dengan perpindahan step di stepper ("Cabang" → "Kompetensi").

---

## 4. Wave G1 — Cabang Wiraswasta

Muncul jika `f8` = 3 (Wiraswasta).

| # | Pertanyaan | Kolom DB | Kode Dikti | Value / Format | Wajib | Business Logic |
|---|---|---|---|---|---|---|
| 1 | Posisi/jabatan | `participant_answers` | `f5c` | 1=Founder, 2=Co-Founder, 3=Staff, 4=Freelance/Kerja Lepas | Ya | **Dikirim ke Dikti** (berbeda dari cabang Bekerja). |
| 2 | Apa jenis instansi / organisasi tempat Anda berwirausaha? | `participant_answers` | `f1101` | (sama dengan cabang Bekerja) | Ya | Kode teks: `f1102` |
| 3 | Tingkat usaha | `participant_answers` | `f5d` | 1–3 (sama) | Ya | — |
| 4 | Provinsi usaha | `participant_answers` | `f5a1` | kode numerik | Ya | — |
| 5 | Kab/Kota usaha | `participant_answers` | `f5a2` | kode numerik | Ya | — |
| 6 | Nama usaha / tempat berwirausaha | `participant_answers` | `f5b` | varchar | Ya | Searchable dropdown dari tabel `companies` + ketik sendiri. Bisa berupa nama toko, studio, klinik, CV, dll. |
| 7 | Pendapatan per bulan | `participant_answers` | `f505` | angka rupiah | Ya | — |
| 8 | Keeratan bidang studi | `participant_answers` | `f14` | 1=Sangat Erat, 2=Erat, 3=Cukup Erat, 4=Kurang Erat, 5=Tidak Sama Sekali | Ya | — |
| 9 | Jenjang pendidikan sesuai | `participant_answers` | `f15` | 1=Setingkat Lebih Tinggi, 2=Tingkat yang Sama, 3=Setingkat Lebih Rendah, 4=Tidak Perlu Pendidikan Tinggi | Ya | — |

> **⚠️ Pisah halaman di sini.** Setelah pertanyaan terakhir cabang, alumni masuk ke halaman baru: **Tingkat Kompetensi**.

---

## 5. Wave G1 — Cabang Melanjutkan Pendidikan

Muncul jika `f8` = 4 (Melanjutkan Pendidikan).

| # | Pertanyaan | Kolom DB | Kode Dikti | Value / Format | Wajib | Business Logic |
|---|---|---|---|---|---|---|
| 1 | Dari mana sumber biaya untuk melanjutkan studi Anda? | `participant_answers` | `f18a` | 1=Biaya Sendiri, 2=Beasiswa | Ya | — |
| 2 | Nama Perguruan Tinggi tujuan | `participant_answers` | `f18b` | varchar | Ya | Searchable dropdown dari tabel `universities` + ketik sendiri jika PT tidak ada di daftar. Bisa PT dalam negeri maupun luar negeri. |
| 3 | Program Studi | `participant_answers` | `f18c` | varchar | Ya | Searchable dropdown dari tabel `study_programs` (filter per PT yang dipilih di #2) + ketik sendiri jika prodi tidak ada di daftar. |
| 4 | Tanggal masuk | `participant_answers` | `f18d` | dd/mm/yyyy | Ya | — |
| 5 | Keeratan bidang studi dengan pendidikan | `participant_answers` | `f14` | 1=Sangat Erat, 2=Erat, 3=Cukup Erat, 4=Kurang Erat, 5=Tidak Sama Sekali | Ya | Redaksi: "dengan pendidikan Anda" (bukan pekerjaan). Kode sama. |

> **⚠️ Pisah halaman di sini.** Setelah pertanyaan terakhir cabang, alumni masuk ke halaman baru: **Tingkat Kompetensi**.

---

## 6. Wave G1 — Cabang Tidak Kerja, Tetapi Sedang Mencari Kerja

Muncul jika `f8` = 5. **Seluruh pertanyaan TIDAK wajib.**

| # | Pertanyaan | Kolom DB | Kode Dikti | Value / Format | Wajib | Business Logic |
|---|---|---|---|---|---|---|
| 1 | Kapan mulai mencari pekerjaan | `participant_answers` | `f301` + `f302` + `f303` | f301: 1=Sebelum lulus, 2=Sesudah lulus, 3=Tidak mencari. f302: angka bulan sebelum. f303: angka bulan sesudah. | Tidak | Satu pertanyaan di form, tiga kolom di pengiriman. |
| 2 | Cara mencari pekerjaan | `participant_answers` | `f4` | 15 kolom biner: `f401`=Melalui iklan di koran/majalah/brosur, `f402`=Melamar ke perusahaan tanpa mengetahui lowongan, `f403`=Pergi ke bursa/pameran kerja, `f404`=Dihubungi oleh perusahaan, `f405`=Mencari lewat internet/iklan online/milis, `f406`=Menghubungi Kemenakertrans, `f407`=Menghubungi agen tenaga kerja komersial/swasta, `f408`=Memperoleh informasi dari pusat/kantor pengembangan karir fakultas/universitas, `f409`=Menghubungi kantor kemahasiswaan/hubungan alumni, `f410`=Membangun jejaring (network) sejak masih kuliah, `f411`=Melalui relasi (dosen, orang tua, saudara, teman, dll), `f412`=Membangun bisnis sendiri, `f413`=Melalui penempatan kerja atau magang, `f414`=Bekerja di tempat yang sama dengan tempat kerja semasa kuliah, `f415`=Lainnya + `f416` teks | Tidak | Kode sama dengan cabang Bekerja. Jawaban bisa lebih dari satu. |
| 3 | Jumlah instansi/organisasi yang sudah dilamar | `participant_answers` | `f6` | angka | Tidak | Titik hitung: "sampai saat ini" (berbeda dari cabang Bekerja). |
| 4 | Jumlah merespons lamaran | `participant_answers` | `f7` | angka | Tidak | — |
| 5 | Jumlah mengundang wawancara | `participant_answers` | `f7a` | angka | Tidak | — |

> **⚠️ Pisah halaman di sini.** Setelah pertanyaan terakhir cabang, alumni masuk ke halaman baru: **Tingkat Kompetensi**.

---

## 7. Wave G1 — Cabang Belum Memungkinkan Bekerja

Muncul jika `f8` = 2. **Tidak ada pertanyaan tambahan** — alumni langsung ke halaman **Tingkat Kompetensi** (pisah halaman).

---

## 8. Wave G1 — Tingkat Kompetensi (semua status)

Diisi semua alumni, apa pun statusnya.

| # | Pertanyaan | Kolom DB | Kode Dikti | Value / Format | Wajib | Business Logic |
|---|---|---|---|---|---|---|
| 1 | Kompetensi yang dikuasai saat lulus (A) | `participant_answers` | `f17` | 14 kolom: `f1761`=Etika (A), `f1763`=Keahlian berdasarkan bidang ilmu (A), `f1765`=Bahasa Inggris (A), `f1767`=Penggunaan Teknologi Informasi (A), `f1769`=Komunikasi (A), `f1771`=Kerja sama tim (A), `f1773`=Pengembangan Diri (A). Skala 1–5 (1=Sangat Rendah, 2=Rendah, 3=Cukup Tinggi, 4=Tinggi, 5=Sangat Tinggi) | Ya | **Teks baris (Etika, Keahlian bidang ilmu, dll) TIDAK BOLEH diedit Admin CDC.** Modul Sistem Penjaminan Mutu menarik data berdasarkan teks pertanyaan ini — jika diubah, integrasi SPM akan putus. Kolom A = "yang Anda kuasai saat lulus" (hasil proses pembelajaran di PT). |
| 2 | Kompetensi yang saat ini diperlukan (B) | `participant_answers` | `f17` | 14 kolom: `f1762`=Etika (B), `f1764`=Keahlian berdasarkan bidang ilmu (B), `f1766`=Bahasa Inggris (B), `f1768`=Penggunaan Teknologi Informasi (B), `f1770`=Komunikasi (B), `f1772`=Kerja sama tim (B), `f1774`=Pengembangan Diri (B). Skala 1–5 (1=Sangat Rendah, 2=Rendah, 3=Cukup Tinggi, 4=Tinggi, 5=Sangat Tinggi) | Ya | Ditampilkan sebagai satu tabel gabungan A+B. **Teks baris TIDAK BOLEH diedit** — alasan sama dengan #1. **Redaksi kolom B dinamis per status:** Bekerja → "diperlukan dalam pekerjaan Anda"; Wiraswasta → "diperlukan dalam menjalankan usaha Anda"; Melanjutkan Pendidikan → "diperlukan dalam studi lanjut Anda"; Tidak kerja/Belum memungkinkan → "yang menurut Anda diperlukan dalam dunia kerja". |
| 3 | Penekanan metode pembelajaran | `participant_answers` | `f2` | 7 kolom: `f21`=Perkuliahan, `f22`=Demonstrasi, `f23`=Partisipasi dalam proyek riset, `f24`=Magang, `f25`=Praktikum, `f26`=Kerja Lapangan, `f27`=Diskusi. Skala 1–5 (1=Sangat Besar, 2=Besar, 3=Cukup Besar, 4=Kurang Besar, 5=Tidak Sama Sekali) | Ya | ⚠️ **Arah skala BERLAWANAN** dengan f17 (1=paling positif). Backend harus balik skala (`6 - value`) saat agregasi. **Teks baris (Perkuliahan, Demonstrasi, dll) TIDAK BOLEH diedit** — modul SPM menarik data berdasarkan teks ini. |

> **⚠️ Integrasi SPM (Sistem Penjaminan Mutu):** Ketiga pertanyaan di section ini memiliki teks baris yang dikunci permanen. Modul SPM melakukan query berdasarkan nama baris (mis. "Etika", "Komunikasi", "Perkuliahan") untuk menarik data ke laporan mutu prodi. Jika Admin CDC mengubah teks baris ini, integrasi akan putus dan laporan SPM tidak akan menampilkan data yang benar. Oleh karena itu, fitur edit untuk teks baris ini **tidak disediakan di UI**.

---

## 9. Wave G1 — Optional (Proses Pencarian Kerja)

Boleh diaktifkan/nonaktifkan oleh Admin CDC. Tag: `kemdikbud`. **Default: nonaktif.**

> **Catatan:** Section ini *terlihat* mirip dengan pertanyaan di §6 (cabang Tidak Kerja), tapi konteksnya berbeda. Di §6, alumni **belum** mendapat pekerjaan — titik hitung "sampai saat ini". Di section ini, alumni **sudah** bekerja/berwirausaha — titik hitung "sebelum memperoleh pekerjaan pertama" (melihat ke belakang). Kode Dikti-nya sama (`f301`, `f6`, `f7`, `f7a`) tapi makna data berbeda. Aktifkan section ini jika kampus butuh analisis proses pencarian kerja alumni yang sudah bekerja (durasi cari, jumlah lamar, alasan mismatch bidang studi).

| # | Pertanyaan | Kolom DB | Kode Dikti | Value / Format | Wajib | Cabang |
|---|---|---|---|---|---|---|
| 1 | Kapan mulai mencari pekerjaan (Bekerja) | `participant_answers` | `f301`+`f302`+`f303` | (sama dengan §6 #1) | Tidak | Bekerja |
| 2 | Kapan mulai merencanakan berwiraswasta | `participant_answers` | `f301`+`f302`+`f303` | (kode sama, redaksi beda) | Tidak | Wiraswasta |
| 3 | Tipe kontrak pekerjaan | `participant_answers` | — (internal) | Kontrak / Tetap / Tanpa kontrak | Tidak | Bekerja |
| 4 | Jumlah instansi/organisasi yang sudah dilamar (Bekerja) | `participant_answers` | `f6` | angka | Tidak | Bekerja (titik hitung: "sebelum memeroleh pekerjaan pertama") |
| 5 | Jumlah merespons (Bekerja) | `participant_answers` | `f7` | angka | Tidak | Bekerja |
| 6 | Jumlah mengundang wawancara (Bekerja) | `participant_answers` | `f7a` | angka | Tidak | Bekerja |
| 7 | Alasan pekerjaan tidak sesuai pendidikan | `participant_answers` | `f16` | 13 kolom biner (`f1601`–`f1613`) + `f1614` teks | Tidak | Bekerja & Wiraswasta |

---

## 10. Wave G1 — Optional Bundle Kemenkes

Khusus kampus kesehatan (Poltekkes). Default nonaktif untuk PT umum. **Tidak punya kode Dikti.**

| # | Pertanyaan | Kolom DB | Kode Dikti | Value / Format | Wajib |
|---|---|---|---|---|---|
| 1 | Apakah Anda bekerja di fasilitas kesehatan? | `participant_answers` | — | Ya / Tidak | Tidak |
| 2 | Status STR saat ini | `participant_answers` | — | Aktif / Dalam proses / Belum memiliki | Tidak |
| 3 | Bidang kerja sesuai kompetensi tenaga kesehatan? | `participant_answers` | — | Sesuai / Tidak sesuai | Tidak |
| 4 | Punya sertifikat kompetensi/profesi kesehatan? | `participant_answers` | — | Ya / Tidak | Tidak |

---

## 11. Identitas (dikirim bersama jawaban, bukan pertanyaan)

Data identitas bukan pertanyaan yang alumni isi, tapi tetap dikirim ke Dikti bersama jawaban.

| Data | Kolom DB (sumber) | Kolom DB (simpan di participants) | Kode Dikti | Catatan |
|---|---|---|---|---|
| NIM | `graduates.nim` | `participants.nim` | `nimhsmsmh` | Terkunci |
| Kode PT | — (konfigurasi sistem) | `participants.kode_pt` | `kdptimsmh` | Terkunci |
| Tahun Lulus | `graduates.graduate_year` | `participants.tahun_lulus` | `tahun_lulus` | Terkunci |
| Kode Prodi | — (relasi `study_programs.code`) | `participants.kode_prodi` | `kdpstmsmh` | Terkunci |
| Nama | `graduates.name` | `participants.name` | `nmmhsmsmh` | Terkunci |
| NIK | `graduates.nik` | `participants.nik` | `nik` | Terkunci, tampil sebagian di layar |
| NPWP | `graduates.npwp` | `participants.npwp` | `npwp` | Bisa diedit alumni |
| Email | `graduates.email` | `participants.email` | `emailmsmh` | Bisa diedit alumni |
| Nomor HP | `graduates.no_hp` | `participants.no_hp` | `telpomsmh` | Bisa diedit alumni |

---

## 12. Matriks Cabang — Pertanyaan Mana Muncul di Status Mana

| Pertanyaan | Kode | Bekerja | Wiraswasta | Lanjut Studi | Tidak kerja, mencari | Belum memungkinkan |
|---|---|---|---|---|---|---|
| Status | `f8` | ✅ | ✅ | ✅ | ✅ | ✅ |
| Masa tunggu | `f502` | ✅ | ✅ | ✅ | ❌ | ❌ |
| Pendapatan | `f505` | ✅ | ✅ | ❌ | ❌ | ❌ |
| Lokasi kerja | `f5a1`+`f5a2` | ✅ | ✅ | ❌ | ❌ | ❌ |
| Jenis instansi/organisasi | `f1101` | ✅ | ✅ | ❌ | ❌ | ❌ |
| Nama tempat kerja/usaha | `f5b` | ✅ | ✅ | ❌ | ❌ | ❌ |
| Posisi/jabatan | `f5c` | ✅ (internal) | ✅ (dikirim) | ❌ | ❌ | ❌ |
| Tingkat tempat kerja | `f5d` | ✅ | ✅ | ❌ | ❌ | ❌ |
| Keeratan bidang studi | `f14` | ✅ | ✅ | ✅ | ❌ | ❌ |
| Jenjang pendidikan | `f15` | ✅ | ✅ | ❌ | ❌ | ❌ |
| Studi lanjut (4 field) | `f18a`–`f18d` | ❌ | ❌ | ✅ | ❌ | ❌ |
| Sumber dana kuliah | `f1201` | ✅ | ✅ | ✅ | ✅ | ✅ |
| Aktif mencari kerja | `f1001` | ✅ | ✅ | ✅ | ✅ | ✅ |
| Kompetensi A+B | `f17` | ✅ | ✅ | ✅ | ✅ | ✅ |
| Metode pembelajaran | `f2` | ✅ | ✅ | ✅ | ✅ | ✅ |
| Data atasan (5 field) | `k1`, `k2` | ✅ | ❌ | ❌ | ❌ | ❌ |

**Catatan:** Matriks di atas mencerminkan **produk kita**, bukan situs resmi. Beberapa perbedaan dengan situs resmi tercatat di [Mapping Kode Dikti §15](../Mapping-Kode-Dikti-Tracer-Study.md).

---

## 13. Catatan Teknis untuk Backend

| # | Hal | Detail |
|---|---|---|
| 1 | `f502` satu kolom | Kirim `0` jika sebelum lulus, kirim angka bulan jika sesudah. Bukan dua field terpisah. |
| 2 | Setiap "Lainnya" = 2 data | Penanda tercentang (`f415`, `f1613`) + teks isian (`f416`, `f1614`). Jangan hanya simpan penanda. |
| 3 | Lokasi = kode numerik | Yang dikirim ke Dikti adalah kode dari tabel `provinces.code` dan `cities.code`, bukan nama string. |
| 4 | HP, NIK, NPWP = varchar | Simpan sebagai teks. Tipe angka menghapus nol depan. |
| 5 | Skala `f2` terbalik | 1=Sangat Besar (positif). Agregasi harus balik dulu (`6 - value`) supaya searah dengan `f17`. |
| 6 | `f5c` hanya kirim jika Wiraswasta | Untuk Bekerja, simpan tapi kirim kolom kosong. |
| 7 | Pilihan ganda = satu kolom per opsi | `f4` → 15 kolom biner. `f16` → 13 kolom biner. Bukan array. |
| 8 | `f504` sudah dihapus | Jangan implementasikan. Hanya ada di panduan versi 2023. |
| 9 | Rename `participants.phone` → `participants.no_hp` | Butuh migrasi. Setelah rename, semua reference di code backend perlu diupdate. |
| 10 | Tabel wilayah belum lengkap | Salinan `Data Master Lokasi Kerja.html` di repo terpotong di Kalimantan Selatan. Ambil `master-provinsi.xlsx` dan `master-kab-kota.xlsx` dari situs Dikti. |

---

## 14. Survei Pengguna Lulusan — Pre-fill & Alur

**Trigger:** Otomatis setelah alumni mengisi Wave G1 dengan status **Bekerja** (`f8` = 1). Sistem mengirim link survei ke email atasan (`atasan_email`).

**Siapa yang mengisi:** Atasan langsung / HRD di tempat alumni bekerja — bukan alumni sendiri.

**Hanya untuk status Bekerja.** Alumni Wiraswasta tidak punya atasan, jadi Survei Pengguna Lulusan tidak berlaku untuk mereka.

### Pre-fill dari Data Atasan (G1 §3 #11)

| Field di Survei Pengguna Lulusan | Sumber pre-fill | Bisa diedit penilai? |
|---|---|---|
| Nama penilai (atasan/HRD) | `atasan_nama` (G1 §3 #11) | ✅ Ya |
| Jabatan penilai | `atasan_jabatan` (G1 §3 #11) | ✅ Ya |
| Email penilai | `atasan_email` (G1 §3 #11) | ✅ Ya |
| No. Telp/HP penilai | `atasan_telp` (G1 §3 #11) | ✅ Ya |
| Alamat tempat kerja | `atasan_alamat` (G1 §3 #11) | ✅ Ya |
| Nama perusahaan | — (**tidak di-pre-fill**) | ✅ Ya |
| Nama alumni yang dinilai | `participants.name` | ❌ Readonly |
| Program studi alumni | `study_programs.name` (relasi) | ❌ Readonly |
| Tahun lulus alumni | `participants.tahun_lulus` | ❌ Readonly |

**Kenapa Nama Perusahaan tidak di-pre-fill?** Alumni mungkin menulis versi informal (mis. "Kantor Pak Budi") — atasan lebih tahu nama resmi institusinya.

### Alur lengkap

1. Alumni isi G1, status = Bekerja → isi Data Atasan (5 field)
2. Sistem kirim email ke `atasan_email` berisi link survei unik
3. Atasan buka link → data diri sudah terisi (pre-fill), tinggal verifikasi
4. Atasan langsung mengisi **12 aspek penilaian kinerja** (matriks skala)
5. Atasan submit → data tersimpan, ditautkan ke record alumni via `gu_nama_alumni` + `gu_prodi_alumni` + `gu_tahun_lulus`

### Catatan

- Jika email bounce / atasan tidak merespons → sistem kirim reminder (maks 2×, interval 7 hari)
- Jika alumni belum mengisi Data Atasan (field kosong) → survei tidak dikirim, Admin CDC bisa follow-up manual
- Data penilaian ini untuk **akreditasi BAN-PT (Indikator 14B)**, bukan pelaporan PDDikti
