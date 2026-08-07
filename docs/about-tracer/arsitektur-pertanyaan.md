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
| 4 | Nama perusahaan/usaha | — | `participant_answers` | `exit_perusahaan` | — | dropdown + ketik sendiri | Kondisional (jika #3 = Ya) | Muncul hanya jika #3 dijawab Ya. Pre-fill nama perusahaan di G1. |
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
| 1 | Jelaskan status Anda saat ini? | `participant_answers` | — | `f8` | 1=Bekerja (full time / part time), 2=Belum memungkinkan bekerja, 3=Wiraswasta, 4=Melanjutkan Pendidikan, 5=Tidak kerja tetapi sedang mencari kerja | Ya | **Gate question** — menentukan cabang pertanyaan selanjutnya. |
| 2 | Apakah Anda aktif mencari pekerjaan dalam 4 minggu terakhir? | `participant_answers` | — | `f1001` | 1=Tidak, 2=Tidak tapi menunggu hasil lamaran, 3=Ya akan mulai bekerja dalam 2 minggu, 4=Ya tapi belum pasti, 5=Lainnya | Ya | Kode teks Lainnya: `f1002` |
| 3 | Sumber dana kuliah | `participant_answers` | — | `f1201` | 1=Biaya Sendiri/Keluarga, 2=Beasiswa ADIK, 3=Beasiswa BIDIKMISI, 4=Beasiswa PPA, 5=Beasiswa AFIRMASI, 6=Beasiswa Perusahaan/Swasta, 7=Lainnya | Ya | Kode teks Lainnya: `f1202`. Bukan sumber dana studi lanjut. |
| 4 | Masa tunggu mendapatkan pekerjaan | `participant_answers` | — | `f502` | `0` = Ya, sebelum lulus (masa tunggu nol). Angka bulan = Tidak (mis. `3`, `12`) | Ya (kondisional) | Hanya muncul jika status Bekerja, Wiraswasta, atau Melanjutkan Pendidikan. Satu kolom di pengiriman. |

---

## 3. Wave G1 — Cabang Bekerja

Muncul jika `f8` = 1 (Bekerja full time / part time).

| # | Pertanyaan | Kolom DB | Kode Dikti | Value / Format | Wajib | Business Logic |
|---|---|---|---|---|---|---|
| 5 | Pendapatan per bulan (Take Home Pay) | `participant_answers` | `f505` | angka (rupiah, tanpa pemisah) | Ya | Dibandingkan dengan UMP dari tabel `ump` berdasarkan `f5a1`. |
| 6 | Provinsi tempat bekerja | `participant_answers` | `f5a1` | kode numerik provinsi (dari tabel `provinces.code`) | Ya | Searchable dropdown. |
| 7 | Kabupaten/Kota tempat bekerja | `participant_answers` | `f5a2` | kode numerik kab/kota (dari tabel `cities.code`) | Ya | Terkunci sampai provinsi dipilih. |
| 8 | Jenis perusahaan/instansi | `participant_answers` | `f1101` | 1=Instansi pemerintah, 2=Organisasi non-profit/LSM, 3=Perusahaan swasta, 4=Wiraswasta/perusahaan sendiri, 5=Lainnya, 6=BUMN/BUMD, 7=Institusi/Organisasi Multilateral | Ya | Kode teks Lainnya: `f1102`. Perhatikan urutan value tidak berurut. |
| 9 | Nama perusahaan/kantor | `participant_answers` | `f5b` | varchar (free text) | Ya | Dropdown searchable + ketik sendiri. |
| 10 | Posisi/jabatan | `participant_answers` | `f5c` | 1=Founder, 2=Co-Founder, 3=Staff, 4=Freelance/Kerja Lepas | Ya | **Tidak dikirim ke Dikti untuk cabang Bekerja.** Disimpan sebagai data internal. Hanya dikirim jika `f8`=3 (Wiraswasta). |
| 11 | Tingkat tempat kerja | `participant_answers` | `f5d` | 1=Lokal/Wilayah/Wiraswasta tidak berbadan hukum, 2=Nasional/Wiraswasta berbadan hukum, 3=Multinasional/Internasional | Ya | — |
| 12 | Keeratan bidang studi dengan pekerjaan | `participant_answers` | `f14` | 1=Sangat Erat, 2=Erat, 3=Cukup Erat, 4=Kurang Erat, 5=Tidak Sama Sekali | Ya | — |
| 13 | Jenjang pendidikan yang sesuai | `participant_answers` | `f15` | 1=Setingkat Lebih Tinggi, 2=Tingkat yang Sama, 3=Setingkat Lebih Rendah, 4=Tidak Perlu Pendidikan Tinggi | Ya | — |
| 14 | Cara mencari pekerjaan | `participant_answers` | `f4` | 15 kolom biner (`f401`–`f415`) + `f416` teks Lainnya | Ya | Setiap opsi = satu kolom di pengiriman. Jumlah opsi tidak boleh diubah. |
| 15 | Data atasan (nama, jabatan, email, no telp, alamat) | `participant_answers` | `k1` (nama), `k2` (email), sisanya tanpa kode | 5 × varchar | Ya | **Tidak dikirim ke Dikti.** Email atasan dipakai untuk trigger Survei Pengguna Lulusan otomatis. |

---

## 4. Wave G1 — Cabang Wiraswasta

Muncul jika `f8` = 3 (Wiraswasta).

| # | Pertanyaan | Kolom DB | Kode Dikti | Value / Format | Wajib | Business Logic |
|---|---|---|---|---|---|---|
| 16 | Posisi/jabatan | `participant_answers` | `f5c` | 1=Founder, 2=Co-Founder, 3=Staff, 4=Freelance/Kerja Lepas | Ya | **Dikirim ke Dikti** (berbeda dari cabang Bekerja). |
| 17 | Jenis usaha | `participant_answers` | `f1101` | (sama dengan cabang Bekerja) | Ya | Kode teks: `f1102` |
| 18 | Tingkat usaha | `participant_answers` | `f5d` | 1–3 (sama) | Ya | — |
| 19 | Provinsi usaha | `participant_answers` | `f5a1` | kode numerik | Ya | — |
| 20 | Kab/Kota usaha | `participant_answers` | `f5a2` | kode numerik | Ya | — |
| 21 | Nama usaha | `participant_answers` | `f5b` | varchar | Ya | — |
| 22 | Pendapatan per bulan | `participant_answers` | `f505` | angka rupiah | Ya | — |
| 23 | Keeratan bidang studi | `participant_answers` | `f14` | 1–5 | Ya | — |
| 24 | Jenjang pendidikan sesuai | `participant_answers` | `f15` | 1–4 | Ya | — |
| 25 | Data atasan/pemilik (5 field) | `participant_answers` | `k1`, `k2`, sisanya — | 5 × varchar | Ya | Sama seperti cabang Bekerja. |

---

## 5. Wave G1 — Cabang Melanjutkan Pendidikan

Muncul jika `f8` = 4 (Melanjutkan Pendidikan).

| # | Pertanyaan | Kolom DB | Kode Dikti | Value / Format | Wajib | Business Logic |
|---|---|---|---|---|---|---|
| 26 | Sumber biaya studi lanjut | `participant_answers` | `f18a` | 1=Biaya Sendiri, 2=Beasiswa | Ya | — |
| 27 | Perguruan Tinggi tujuan | `participant_answers` | `f18b` | varchar | Ya | — |
| 28 | Program Studi | `participant_answers` | `f18c` | varchar | Ya | — |
| 29 | Tanggal masuk | `participant_answers` | `f18d` | dd/mm/yyyy | Ya | — |
| 30 | Keeratan bidang studi dengan pendidikan | `participant_answers` | `f14` | 1–5 | Ya | Redaksi: "dengan pendidikan Anda" (bukan pekerjaan). Kode sama. |

---

## 6. Wave G1 — Cabang Tidak Kerja, Tetapi Sedang Mencari Kerja

Muncul jika `f8` = 5. **Seluruh pertanyaan TIDAK wajib.**

| # | Pertanyaan | Kolom DB | Kode Dikti | Value / Format | Wajib | Business Logic |
|---|---|---|---|---|---|---|
| 31 | Kapan mulai mencari pekerjaan | `participant_answers` | `f301` + `f302` + `f303` | f301: 1=Sebelum lulus, 2=Sesudah lulus, 3=Tidak mencari. f302: angka bulan sebelum. f303: angka bulan sesudah. | Tidak | Satu pertanyaan di form, tiga kolom di pengiriman. |
| 32 | Cara mencari pekerjaan | `participant_answers` | `f4` | 15 kolom biner + `f416` teks | Tidak | Kode sama dengan cabang Bekerja. |
| 33 | Jumlah perusahaan dilamar | `participant_answers` | `f6` | angka | Tidak | Titik hitung: "sampai saat ini" (berbeda dari cabang Bekerja). |
| 34 | Jumlah merespons lamaran | `participant_answers` | `f7` | angka | Tidak | — |
| 35 | Jumlah mengundang wawancara | `participant_answers` | `f7a` | angka | Tidak | — |

---

## 7. Wave G1 — Cabang Belum Memungkinkan Bekerja

Muncul jika `f8` = 2. **Tidak ada pertanyaan tambahan** — alumni langsung ke bagian Tingkat Kompetensi.

---

## 8. Wave G1 — Tingkat Kompetensi (semua status)

Diisi semua alumni, apa pun statusnya.

| # | Pertanyaan | Kolom DB | Kode Dikti | Value / Format | Wajib | Business Logic |
|---|---|---|---|---|---|---|
| 36 | Kompetensi saat lulus (A) | `participant_answers` | `f17` | 14 kolom: `f1761`–`f1773` (ganjil=A). Skala 1–5 (1=Sangat Rendah, 5=Sangat Tinggi) | Ya | 7 baris: Etika, Keahlian bidang ilmu, Bahasa Inggris, Penggunaan TI, Komunikasi, Kerja sama tim, Pengembangan Diri. |
| 37 | Kompetensi dibutuhkan sekarang (B) | `participant_answers` | `f17` | 14 kolom: `f1762`–`f1774` (genap=B). Skala 1–5 | Ya | Ditampilkan sebagai satu tabel gabungan A+B. |
| 38 | Penekanan metode pembelajaran | `participant_answers` | `f2` | 7 kolom: `f21`–`f27`. Skala 1–5 (**1=Sangat Besar**, 5=Tidak Sama Sekali) | Ya | ⚠️ **Arah skala BERLAWANAN** dengan f17. Backend harus balik skala (`6 - value`) saat agregasi. |

---

## 9. Wave G1 — Optional (Proses Pencarian Kerja)

Boleh diaktifkan/nonaktifkan oleh Admin CDC. Tag: `kemdikbud`.

| # | Pertanyaan | Kolom DB | Kode Dikti | Value / Format | Wajib | Cabang |
|---|---|---|---|---|---|---|
| 39 | Kapan mulai mencari pekerjaan (Bekerja) | `participant_answers` | `f301`+`f302`+`f303` | (sama dengan #31) | Tidak | Bekerja |
| 40 | Kapan mulai merencanakan berwiraswasta | `participant_answers` | `f301`+`f302`+`f303` | (kode sama, redaksi beda) | Tidak | Wiraswasta |
| 41 | Tipe kontrak pekerjaan | `participant_answers` | — (internal) | Kontrak / Tetap / Tanpa kontrak | Tidak | Bekerja |
| 42 | Jumlah perusahaan dilamar (Bekerja) | `participant_answers` | `f6` | angka | Tidak | Bekerja (titik hitung: "sebelum memeroleh pekerjaan pertama") |
| 43 | Jumlah merespons (Bekerja) | `participant_answers` | `f7` | angka | Tidak | Bekerja |
| 44 | Jumlah mengundang wawancara (Bekerja) | `participant_answers` | `f7a` | angka | Tidak | Bekerja |
| 45 | Alasan pekerjaan tidak sesuai pendidikan | `participant_answers` | `f16` | 13 kolom biner (`f1601`–`f1613`) + `f1614` teks | Tidak | Bekerja & Wiraswasta |

---

## 10. Wave G1 — Optional Bundle Kemenkes

Khusus kampus kesehatan (Poltekkes). Default nonaktif untuk PT umum. **Tidak punya kode Dikti.**

| # | Pertanyaan | Kolom DB | Kode Dikti | Value / Format | Wajib |
|---|---|---|---|---|---|
| 46 | Apakah Anda bekerja di fasilitas kesehatan? | `participant_answers` | — | Ya / Tidak | Tidak |
| 47 | Status STR saat ini | `participant_answers` | — | Aktif / Dalam proses / Belum memiliki | Tidak |
| 48 | Bidang kerja sesuai kompetensi tenaga kesehatan? | `participant_answers` | — | Sesuai / Tidak sesuai | Tidak |
| 49 | Punya sertifikat kompetensi/profesi kesehatan? | `participant_answers` | — | Ya / Tidak | Tidak |

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
| Jenis instansi | `f1101` | ✅ | ✅ | ❌ | ❌ | ❌ |
| Nama perusahaan | `f5b` | ✅ | ✅ | ❌ | ❌ | ❌ |
| Posisi/jabatan | `f5c` | ✅ (internal) | ✅ (dikirim) | ❌ | ❌ | ❌ |
| Tingkat tempat kerja | `f5d` | ✅ | ✅ | ❌ | ❌ | ❌ |
| Keeratan bidang studi | `f14` | ✅ | ✅ | ✅ | ❌ | ❌ |
| Jenjang pendidikan | `f15` | ✅ | ✅ | ❌ | ❌ | ❌ |
| Studi lanjut (4 field) | `f18a`–`f18d` | ❌ | ❌ | ✅ | ❌ | ❌ |
| Sumber dana kuliah | `f1201` | ✅ | ✅ | ✅ | ✅ | ✅ |
| Aktif mencari kerja | `f1001` | ✅ | ✅ | ✅ | ✅ | ✅ |
| Kompetensi A+B | `f17` | ✅ | ✅ | ✅ | ✅ | ✅ |
| Metode pembelajaran | `f2` | ✅ | ✅ | ✅ | ✅ | ✅ |
| Data atasan (5 field) | `k1`, `k2` | ✅ | ✅ | ❌ | ❌ | ❌ |

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
