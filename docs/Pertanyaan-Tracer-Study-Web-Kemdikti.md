# Pertanyaan Tracer Study — Live Site Kemdiktisaintek (Cabang Bekerja)

Sudah. Cabang **"Belum memungkinkan bekerja"** — 11 pertanyaan, **identik** dengan cabang "Tidak kerja tetapi sedang mencari kerja".

## Matriks lengkap FINAL — semua 5 cabang (versi site lama DIKTI)

| Pertanyaan | Kode | Bekerja (19) | Wiraswasta (13) | Lanjut Studi (12) | Tidak kerja mencari (11) | Belum memungkinkan (11) |
|---|---|---|---|---|---|---|
| Status | `f8` | ✅ | ✅ | ✅ | ✅ | ✅ |
| Masa tunggu | `f502` | ✅ | ❌ | ❌ | ❌ | ❌ |
| Pendapatan | `f505` | ✅ | ❌ | ❌ | ❌ | ❌ |
| Lokasi kerja | `f5a1`+`f5a2` | ✅ | ❌ | ❌ | ❌ | ❌ |
| Jenis instansi | `f1101` | ✅ | ❌ | ❌ | ❌ | ❌ |
| Nama perusahaan | `f5b` | ✅ | ❌ | ❌ | ❌ | ❌ |
| Posisi/jabatan | `f5c` | ❌ | ✅ | ❌ | ❌ | ❌ |
| Tingkat tempat kerja | `f5d` | ✅ | ✅ | ❌ | ❌ | ❌ |
| Keeratan bidang studi | `f14` | ✅ | ❌ | ❌ | ❌ | ❌ |
| Jenjang pendidikan | `f15` | ✅ | ❌ | ❌ | ❌ | ❌ |
| Studi lanjut (4 field) | `f18a`–`f18d` | ❌ | ❌ | ✅ | ❌ | ❌ |
| **Sumber dana kuliah** | `f1201` | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Kompetensi A+B** | `f17` | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Metode pembelajaran** | `f2` | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Kapan cari kerja** | `f301`–`f303` | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Cara cari kerja** | `f4` | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Jumlah dilamar** | `f6` | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Jumlah merespons** | `f7` | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Jumlah wawancara** | `f7a` | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Aktif cari kerja** | `f1001` | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Alasan tidak sesuai** | `f16` | ✅ | ✅ | ✅ | ✅ | ✅ |

> **Sumber:** Tangkapan layar `tracerstudy.kemdiktisaintek.go.id/kuesioner`, Mode Pratinjau alumni tahun lulus 2022, jawaban no. 1 = "Bekerja (full time / part time)". Tangkapan dilakukan Agustus 2026.

## Identitas (terkunci, abu-abu)

| Field | Contoh isi | Bisa diedit? |
|---|---|---|
| NIM | 152050209 | Tidak |
| Kode PT | 041008 | Tidak |
| Tahun Lulus | 2022 | Tidak |
| Kode Prodi | 70201 | Tidak |
| Nama | RIF'ATUR ROHMANIAH | Tidak |
| NIK | 3204285804970002 | Tidak |
| Alamat Email | rifaturrohmaniah@gmail.com | Ya |
| Nomor Telepon/HP | 085659492729 | Ya |
| NPWP | *(kosong)* | Ya |

**Catatan:** NIK ditampilkan **lengkap** di situs resmi — berbeda dari mockup kita yang hanya menampilkan sebagian.

---

## Kuesioner Wajib — 19 pertanyaan (status: Bekerja)

Semua pertanyaan tampil dalam **satu halaman** tanpa paginasi. Pertanyaan bertanda `*` = wajib diisi. Pertanyaan **dinamis** — yang muncul tergantung jawaban no. 1.

| No | Redaksi persis di layar | Tipe input | Wajib | Kode Dikti | Catatan |
|---|---|---|---|---|---|
| 1 | Jelaskan status Anda saat ini? | Radio (5 opsi) | * | `f8` | Gate — menentukan pertanyaan mana yang muncul |
| 2 | Dalam berapa bulan Anda mendapatkan pekerjaan pertama ? | Numeric (bebas, bisa sampai 999) | * | `f502` | **Muncul karena jawab Bekerja.** Redaksi berbeda dari template ("pekerjaan pertama" saja, tanpa "melanjutkan pendidikan") |
| 3 | Berapa rata-rata pendapatan Anda per bulan? (take home pay) | Numeric, auto-format Rupiah ("Rp8.800.000") | | `f505` | Tanpa tanda `*` |
| 4 | Dimana lokasi tempat Anda bekerja? | 2 dropdown (Provinsi + Kota/Kabupaten), **searchable** — ketik dulu baru muncul opsi | | `f5a1` + `f5a2` | Format: "Prov. Jawa Barat", "Kab. Bogor", "Kota Bandung". Kota/Kabupaten baru bisa dipilih setelah Provinsi terpilih |
| 5 | Apa jenis perusahaan/intansi/institusi tempat anda bekerja sekarang? | Radio (6 opsi + Lainnya dengan isian string) | | `f1101` | Opsi: Intansi pemerintah · Organisasi non-profit/Lembaga Swadaya Masyarakat · Perusahaan swasta · Wiraswasta/perusahaan sendiri · BUMN/BUMD · Institusi/Organisasi Multilateral · Lainnya, tuliskan |
| 6 | Apa nama perusahaan/kantor tempat Anda bekerja? | Isian string | | `f5b` | |
| 7 | Apa tingkat tempat kerja Anda? | Dropdown (3 opsi) | | `f5d` | Opsi: Lokal/Wilayah/Wiraswasta tidak berbadan hukum · Nasional/Wiraswasta berbadan hukum · Multinasional/Internasional |
| 8 | Seberapa erat hubungan bidang studi dengan pekerjaan Anda? | Radio (5 opsi) | * | `f14` | Sangat Erat · Erat · Cukup Erat · Kurang Erat · Tidak Sama Sekali |
| 9 | Tingkat pendidikan apa yang paling tepat/sesuai untuk pekerjaan anda saat ini? | Radio (4 opsi) | * | `f15` | Setingkat Lebih Tinggi · Tingkat yang Sama · Setingkat Lebih Rendah · Tidak Perlu Pendidikan Tinggi |
| 10 | Sebutkan sumberdana dalam pembiayaan kuliah? *(bukan ketika Studi Lanjut)* | Radio (6 opsi + Lainnya) | * | `f1201` | Biaya Sendiri/Keluarga · Beasiswa ADIK · Beasiswa BIDIKMISI · Beasiswa PPA · Beasiswa AFIRMASI · Beasiswa Perusahaan/Swasta · Lainnya, tuliskan |
| 11 | Pada saat lulus, pada tingkat mana kompetensi di bawah ini anda : kuasai? (A) Pada saat ini, pada tingkat mana kompetensi di bawah ini diperlukan dalam pekerjaan? (B) | Matriks 7 baris x 5 kolom, **A dan B dalam satu tabel** | * | `f17` | Skala: 1 Sangat Rendah … 5 Sangat Tinggi. Baris: Etika · Keahlian berdasarkan bidang ilmu · Bahasa Inggris · Penggunaan Teknologi Informasi · Komunikasi · Kerja sama tim · **Pengembangan** (bukan "Pengembangan Diri") |
| 12 | Menurut anda seberapa besar penekanan pada metode pembelajaran dibawah ini dilaksanakan di program studi anda? | 7 grup radio terpisah (bukan matriks), tata letak **3 kolom** | | `f2` | Skala: Sangat Besar · Besar · Cukup Besar · **Kurang Besar** · Tidak Sama Sekali. Baris: Perkuliahan · Demonstrasi · Partisipasi dalam proyek riset · Magang · Praktikum · Kerja Lapangan · Diskusi |
| 13 | Kapan anda mulai mencari pekerjaan? *(Mohon pekerjaan sambilan tidak dimasukkan)* | **Radio + isian numeric inline** | | `f301`+`f302`+`f303` | Bentuk: "Kira-kira `[___]` bulan sebelum lulus" · "Kira-kira `[___]` bulan sesudah lulus" · "Saya tidak mencari kerja". Bisa isi angka di kedua baris (999 pun diterima) |
| 14 | Bagaimana anda mencari pekerjaan tersebut? Jawaban bisa lebih dari satu | Checkboxes (14 opsi + Lainnya dengan isian string) | | `f4` | 14 opsi sesuai template. Lainnya = checkbox + isian string |
| 15 | Berapa perusahaan/instansi/institusi yang sudah anda lamar (lewat surat atau e-mail) sebelum anda memeroleh pekerjaan pertama? | Numeric + suffix "perusahaan/instansi/institusi" | | `f6` | **Titik hitung: "sebelum memeroleh pekerjaan pertama"** — terkonfirmasi |
| 16 | Berapa banyak perusahaan/instansi/institusi yang merespons lamaran anda? | Numeric + suffix | | `f7` | |
| 17 | Berapa banyak perusahaan/instansi/institusi yang mengundang anda untuk wawancara? | Numeric + suffix "perusahaan/instansi/institusi" | | `f7a` | |
| 18 | Apakah anda aktif mencari pekerjaan dalam 4 minggu terakhir? Pilihlah satu jawaban | Radio (4 opsi + Lainnya dengan isian string) | | `f1001` | Tidak · Tidak, tapi saya sedang menunggu hasil lamaran kerja · Ya, saya akan mulai bekerja dalam 2 minggu ke depan · Ya, tapi saya belum pasti akan bekerja dalam 2 minggu ke depan · Lainnya |
| 19 | Jika menurut anda pekerjaan anda saat ini tidak sesuai dengan : pendidikan anda, mengapa anda mengambilnya? Jawaban bisa lebih dari satu | Checkboxes (12 opsi + Lainnya dengan isian string) | | `f16` | 12 opsi sesuai template. Lainnya = checkbox + isian string |

**Setelah no. 19: tombol "Kirim"** — tidak ada halaman berikutnya untuk cabang Bekerja.

---

## Temuan baru dari tangkapan ini

### 1. Pertanyaan dinamis — terkonfirmasi

Situs resmi Kemdiktisaintek **memang** menampilkan pertanyaan secara dinamis berdasarkan jawaban no. 1. Kalau jawab "Bekerja", langsung muncul 19 pertanyaan yang relevan. Tidak ada "Halaman 1 dari 8" — semua dalam satu scroll panjang dengan tombol Kirim di akhir.

Ini menjawab pertanyaan sebelumnya: pertanyaan **tidak ditampilkan flat untuk semua status**. Yang kita lihat di tangkapan awal (yang tidak memilih status) adalah tampilan kosong sebelum gate dipilih.

### 2. Urutan pertanyaan di situs resmi (cabang Bekerja)

| Urutan situs | Kode | Konteks di template |
|---|---|---|
| 1 | `f8` | Section 1 - Informasi Umum |
| 2 | `f502` | Section 1 - Informasi Umum |
| 3 | `f505` | Section 2 - Bekerja |
| 4 | `f5a1` + `f5a2` | Section 2 - Bekerja |
| 5 | `f1101` | Section 2 - Bekerja |
| 6 | `f5b` | Section 2 - Bekerja |
| 7 | `f5d` | Section 2 - Bekerja |
| 8 | `f14` | Section 2 - Bekerja |
| 9 | `f15` | Section 2 - Bekerja |
| 10 | `f1201` | Section 1 - Informasi Umum |
| 11 | `f17` A+B | Section 6 - Tingkat Kompetensi |
| 12 | `f2` | Section 6 - Tingkat Kompetensi |
| 13 | `f301`+`f302`+`f303` | Section 2 - Bekerja |
| 14 | `f4` | Section 2 - Bekerja |
| 15 | `f6` | Section 2 - Bekerja |
| 16 | `f7` | Section 2 - Bekerja |
| 17 | `f7a` | Section 2 - Bekerja |
| 18 | `f1001` | Section 1 - Informasi Umum |
| 19 | `f16` | Section 2 - Bekerja |

**Section di template benar-benar diabaikan** dalam urutan tampil. `f1201` (Section 1) muncul di posisi 10, di antara pertanyaan Section 2. `f1001` (Section 1) muncul di posisi 18, hampir paling akhir. `f17` dan `f2` (Section 6) muncul di tengah.

### 3. Yang bertanda wajib (`*`) di situs resmi

Hanya **4 pertanyaan** yang bertanda `*`:
- No. 1 (`f8`) — status
- No. 2 (`f502`) — masa tunggu
- No. 8 (`f14`) — keeratan bidang studi
- No. 9 (`f15`) — jenjang pendidikan

Sisanya 15 pertanyaan **tanpa tanda `*`** — termasuk `f505` (pendapatan), `f1201` (sumber dana), `f17` (kompetensi), dan `f4` (cara mencari pekerjaan) yang di template ditandai `is_required: true`.

### 4. Selisih redaksi situs resmi vs template

| Kode | Situs resmi | Template lengkap |
|---|---|---|
| `f502` | "Dalam berapa bulan Anda mendapatkan pekerjaan **pertama** ?" | "…pekerjaan pertama / **melanjutkan pendidikan** sebelum lulus?" + "…**melanjutkan studi** setelah lulus?" |
| `f505` | "Berapa rata-rata pendapatan Anda per bulan? **(take home pay)**" | "Berapa rata-rata pendapatan Anda per bulan **(Take Home Pay)** saat ini?" |
| `f5a1`+`f5a2` | "Dimana lokasi tempat Anda bekerja?" (satu pertanyaan, 2 field) | Dua pertanyaan terpisah |
| `f1101` | "…tempat anda bekerja **sekarang**?" | "…tempat Anda bekerja **saat ini**?" |
| `f5d` | "Apa tingkat tempat kerja **Anda**?" | Sama |
| `f14` | "Seberapa erat hubungan bidang studi dengan pekerjaan **Anda**?" | "Seberapa erat hubungan **antara** bidang studi dengan pekerjaan Anda **saat ini**?" |
| `f15` | "…paling tepat/sesuai untuk pekerjaan **anda** saat ini?" | "…paling tepat / sesuai untuk pekerjaan **Anda** saat ini?" |
| `f1201` | "**Sebutkan** sumberdana dalam pembiayaan kuliah?" | "**Sumber dana apa yang Anda gunakan** untuk membiayai kuliah?" |
| `f17` | "…diperlukan dalam **pekerjaan**?" | "…diperlukan dalam pekerjaan **/ studi lanjut Anda**?" |
| `f17` baris 7 | "**Pengembangan**" | "**Pengembangan Diri**" |
| `f2` | "Menurut anda seberapa besar…" | "Menurut **Anda** seberapa besar…" (pddikti) / tanpa "Menurut Anda" (lengkap) |
| `f2` label skala | "**Kurang Besar**" | "**Kurang**" |
| `f301` | "Kapan anda mulai mencari pekerjaan? **(Mohon pekerjaan sambilan tidak dimasukkan)**" | Tanpa keterangan sambilan |
| `f6` | "…yang sudah anda lamar **(lewat surat atau e-mail) sebelum anda memeroleh pekerjaan pertama**?" | "…yang sudah Anda lamar **sampai saat ini**?" |
| `f1001` | "Apakah anda aktif mencari pekerjaan dalam 4 minggu terakhir? **Pilihlah satu jawaban**" | Sama dengan template lengkap |
| `f16` | "…tidak sesuai dengan **: pendidikan anda**, mengapa anda mengambilnya?" | "…tidak sesuai dengan **pendidikan Anda**, mengapa Anda mengambilnya?" |

### 5. Perilaku input yang dicatat

| Input | Perilaku |
|---|---|
| Masa tunggu (no. 2) | Numeric bebas, bisa sampai 999 bulan tanpa validasi batas atas |
| Pendapatan (no. 3) | Numeric, auto-format menjadi "Rp8.800.000" |
| Provinsi (no. 4) | Searchable dropdown — ketik dulu baru muncul opsi yang cocok |
| Kota/Kab (no. 4) | Searchable dropdown — disabled sampai Provinsi dipilih |
| Jenis instansi (no. 5) | "Lainnya, tuliskan" = radio + isian string muncul di bawahnya |
| Nama perusahaan (no. 6) | Isian string biasa |
| Tingkat tempat kerja (no. 7) | Dropdown biasa (bukan searchable) |
| Masa cari kerja (no. 13) | Isian numeric inline di dalam opsi radio — **kedua baris bisa diisi sekaligus** (999/999) meski harusnya saling eksklusif |
| Cara mencari pekerjaan (no. 14) | Checkboxes — "Lainnya" = checkbox + isian string |
| Jumlah lamaran (no. 15–17) | Numeric + suffix teks "perusahaan/instansi/institusi" |
| Aktif mencari kerja (no. 18) | "Lainnya" = radio + isian string |
| Alasan kerja tidak sesuai (no. 19) | Checkboxes — "Lainnya" = checkbox + isian string |

### 6. Implikasi untuk mockup kita

**Pertanyaan no. 13 — kedua baris bisa diisi.** Di situs resmi, alumni bisa mengisi 999 di "sebelum lulus" DAN 999 di "sesudah lulus" tanpa validasi. Ini bug UX dari mereka, bukan desain yang perlu diikuti. Di mockup kita, isian angka hanya aktif pada baris yang dipilih.

**Tanda `*` tidak selaras dengan `is_required`.** Ini mempertegas temuan §13.6 di Mapping — `is_required` ternyata bukan penentu tanda wajib di antarmuka situs resmi. Kemungkinan tanda `*` di sana hanya menandai pertanyaan yang benar-benar **memblokir submit**, sedangkan yang lain tetap terkirim meski kosong.

**Satu halaman, bukan multi-page.** Situs resmi menampilkan semua 19 pertanyaan dalam satu scroll + satu tombol Kirim. Tidak ada "Halaman 1 dari 8" seperti KarirLink sekarang.

---

## Perbandingan dengan KarirLink saat ini (Mode Pratinjau)

| Aspek | Situs Resmi Kemdikti | KarirLink (Mode Pratinjau) |
|---|---|---|
| Pertanyaan dinamis | Ya — hanya tampil pertanyaan yang relevan dengan status | Tidak — semua pertanyaan di section ditampilkan flat |
| Jumlah halaman | 1 halaman + Kirim | 8 halaman |
| Urutan | Mengabaikan section template | Mengikuti section template |
| Pertanyaan `f502` | Gate + isian bulan dalam satu pertanyaan | Dua pertanyaan terpisah |
| Pertanyaan `f301`/`f302`/`f303` | Satu pertanyaan dengan isian inline | Tiga pertanyaan terpisah |
| Lokasi kerja | Satu pertanyaan, 2 field | Dua pertanyaan |
| Format pendapatan | Auto Rupiah | Plain numeric |
| Dropdown wilayah | Searchable (ketik dulu) | Dropdown biasa |
| Validasi masa tunggu | Tidak ada batas atas | Tidak ada batas atas |
| Bug: no. 3 & 4 tampil tanpa syarat | Tidak terjadi — pertanyaan dinamis | **Terjadi** — semua tampil |
