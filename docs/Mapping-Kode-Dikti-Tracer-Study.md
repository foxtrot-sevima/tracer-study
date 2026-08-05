# Mapping Kode Dikti — Pertanyaan & Jawaban Tracer Study

> **Untuk siapa dokumen ini?** Backend developer KarirLink dan tim produk. Kode Dikti **tidak** ditampilkan di antarmuka Admin CDC — ini murni urusan penyimpanan dan pengiriman data ke sistem pelaporan nasional.

> **Butuh tabel lengkapnya?** Redaksi persis tiap pertanyaan beserta seluruh opsi jawaban dan kodenya ada di **[Tabel Master Pertanyaan Tracer Study](Tabel-Master-Pertanyaan-Tracer-Study.md)**. Dokumen ini berisi analisis, aturan tier, dan keputusan desain; yang itu berisi datanya.

> **Mau membangun lapisan pengiriman?** Spesifikasi 86 kolom yang dikirim ke Dikti — tipe, value, kode wilayah, mana yang penanda dan mana yang teks — ada di **[Format Pengiriman Data ke Dikti](Format-Pengiriman-Data-ke-Dikti.md)**. Dokumen itu bersumber dari lampiran resmi Panduan Form Kemdikti, jadi ia **lebih otoritatif daripada template JSON** untuk segala hal yang menyangkut bentuk data terkirim.

> 🟢 **Template yang dipakai: `template-lengkap.json`.** Perbandingan kedua template dan alasan pemilihannya ada di **§12**. Bagian 3–9 dokumen ini masih memakai `template-pddikti.json` sebagai acuan penomoran karena itu yang murni format Dikti; selisih redaksinya dirinci di §12.3.

**Sumber data:**
- `karirlink/docs/template-lengkap.json` — **basis yang dipakai** (`formula: "lengkap"`), 6 section, **62 pertanyaan**. Superset penuh dari template pddikti
- `karirlink/docs/template-pddikti.json` — template murni format Kemdiktisaintek (`formula: "dikti"`), 6 section, **48 pertanyaan**
- `karirlink/docs/template-pengguna-lulusan.json` — Survei Pengguna Lulusan (`formula: "graduate-user"`)
- `karirlink/tracer schema.sql` — struktur tabel (hanya DDL, tanpa data seed)

---

## 1. Di mana kode Dikti disimpan

Kode Dikti melekat di **empat level**, bukan hanya di pertanyaan:

| Level | Tabel | Kolom | Contoh |
|---|---|---|---|
| Pertanyaan | `quest_questions` | `code` | `f8`, `f505`, `f17` |
| Opsi jawaban | `quest_answer_questions` | `code` | `f401`, `f1601` |
| Baris matriks (sub-pertanyaan) | `quest_sub_questions` | `code` | `f21`, `f1761` |
| Penanda "Lainnya" tercentang | `quest_questions` | `is_other_dikti_code` | `f415`, `f1613` |
| **Teks "Lainnya"** | *belum ada tempatnya* | — | `f416`, `f1614` |

Hierarki: `quest_masters` → `quest_sections` → `quest_questions` → `quest_answer_questions` / `quest_sub_questions`.

**Catatan penting:** hanya **2 dari 27 kode pertanyaan** yang opsi jawabannya punya kode sendiri — `f4` (opsi `f401`–`f414`) dan `f16` (opsi `f1601`–`f1612`). Untuk pertanyaan lain, yang mengidentifikasi jawaban adalah kolom **`value`**, bukan kode. Rinciannya di §13.1.

> ⚠️ **Koreksi: `f415` dan `f1613` bukan kode isian teks.** Versi awal dokumen ini menyebut keduanya sebagai "kode isian Lainnya". Menurut Data Master resmi, keduanya adalah **penanda biner** (`0`/`1`) apakah opsi "Lainnya" dicentang, dan teksnya dikirim di kolom terpisah — **`f416`** dan **`f1614`** — yang belum pernah tercatat di dokumen kita dan **belum punya tempat di schema**. Spesifikasi lengkapnya di [Format Pengiriman Data ke Dikti §2.2](Format-Pengiriman-Data-ke-Dikti.md).

---

## 2. Kamus jenis jawaban (`answer_type_id`)

Tabel `quest_answer_types` tidak berisi data seed, jadi pemetaan berikut disimpulkan dari pemakaian nyata di ketiga template:

| ID | Jenis jawaban | Ciri di data | Jumlah pakai |
|---|---|---|---|
| 1 | Pilihan tunggal (radio) | ada `answer_questions`, tanpa `sub_questions` | 36 |
| 2 | Isian teks singkat | tanpa opsi | 26 |
| 3 | *tidak terpakai di ketiga template* | — | 0 |
| 4 | *tidak terpakai di ketiga template* | — | 0 |
| 5 | Matriks skala | ada `sub_questions` (baris) + `answer_questions` (kolom skala) | 7 |
| 6 | Tanggal | tanpa opsi, konteks waktu | 2 |
| 7 | Dropdown daftar panjang | 35 opsi (provinsi) / 528 opsi (kab-kota) | 8 |
| 8 | Pilihan ganda (checkbox) | `description` = "Jawaban bisa lebih dari satu" | 8 |
| 9 | Isian angka | `description` = "Contoh pengisian 2000000" | 35 |

---

## 3. Mapping per section — Template PDDikti

### Section 1 — Informasi Umum (`jump_to: 1`)

| Pertanyaan (redaksi resmi) | Kode | Jenis | Wajib |
|---|---|---|---|
| Jelaskan status Anda saat ini? | **f8** | 1 · radio | ✅ |
| Apakah Anda mendapatkan pekerjaan pertama sebelum lulus? | **f502** | 1 · radio | ✅ |
| Dalam berapa bulan Anda mendapatkan pekerjaan pertama? | **f502** | 9 · angka | ✅ |
| Sumber dana apa yang Anda gunakan untuk membiayai kuliah? | **f1201** | 1 · radio + Lainnya | ✅ |
| Apakah Anda aktif mencari pekerjaan dalam 4 minggu terakhir? | **f1001** | 1 · radio + Lainnya | ✅ |

**Opsi `f8` — penentu percabangan section** (opsi tanpa kode, dikirim sebagai nilai):

| Opsi | Lompat ke section |
|---|---|
| Bekerja (full time / part time) | 1 → Bekerja |
| Wiraswasta (Wirausaha) | 2 → Wiraswasta |
| Melanjutkan pendidikan | 3 → Melanjutkan Pendidikan |
| Tidak kerja, tetapi sedang mencari kerja | 4 → Belum Bekerja |
| Belum memungkinkan bekerja | 5 → selesai |

Ini satu-satunya pertanyaan dengan `jump_to_box: true` — artinya jawabannya mengendalikan alur seluruh kuesioner.

**Opsi `f1201`:** Biaya Sendiri / Keluarga · Beasiswa ADIK · Beasiswa BIDIKMISI · Beasiswa PPA · Beasiswa AFIRMASI · Beasiswa Perusahaan / Swasta · (+ Lainnya, tanpa kode Dikti terpisah)

**Opsi `f1001`** — 4 opsi, **bukan** Ya/Tidak:
- Tidak
- Tidak, tapi saya sedang menunggu hasil lamaran kerja
- Ya, saya akan mulai bekerja dalam 2 minggu ke depan
- Ya, tapi saya belum pasti akan bekerja dalam 2 minggu ke depan

### Section 2 — Bekerja (`jump_to: 5`)

| Pertanyaan (redaksi resmi) | Kode | Jenis | Wajib |
|---|---|---|---|
| Kapan Anda mulai mencari pekerjaan yang Anda jalani saat ini? | **f301** | 1 · radio | — |
| Jika … sebelum lulus, dalam berapa bulan sebelum lulus Anda memulai mencari pekerjaan? | **f302** | 9 · angka | — |
| Jika … sesudah lulus, dalam berapa bulan sesudah lulus Anda memulai mencari pekerjaan? | **f303** | 9 · angka | — |
| Bagaimana Anda mencari pekerjaan tersebut? | **f4** | 8 · checkbox | ✅ |
| Berapa perusahaan / instansi / institusi yang sudah Anda lamar sampai saat ini? | **f6** | 9 · angka | — |
| Berapa banyak yang merespon lamaran Anda sampai saat ini? | **f7** | 9 · angka | — |
| Berapa banyak yang mengundang Anda untuk wawancara sampai saat ini? | **f7a** | 9 · angka | — |
| Berapa rata-rata pendapatan Anda per bulan saat ini? | **f505** | 9 · angka | — |
| Apa jenis perusahaan / instansi / institusi tempat Anda bekerja saat ini? | **f1101** | 1 · radio + Lainnya | ✅ |
| Apa tingkat tempat kerja Anda saat ini? | **f5d** | 1 · radio | ✅ |
| Dimana provinsi Anda bekerja saat ini? | **f5a1** | 7 · dropdown (35 opsi) | ✅ |
| Dimana Kabupaten / Kota Anda bekerja saat ini? | **f5a2** | 7 · dropdown (528 opsi) | ✅ |
| Apa nama perusahaan / kantor tempat Anda bekerja saat ini? | **f5b** | 2 · teks | ✅ |
| Seberapa erat hubungan antara bidang studi dengan pekerjaan Anda saat ini? | **f14** | 1 · radio | ✅ |
| Tingkat pendidikan apa yang paling tepat / sesuai untuk pekerjaan Anda saat ini? | **f15** | 1 · radio | ✅ |
| Jika Anda merasa pekerjaan saat ini tidak sesuai dengan pendidikan, mengapa mengambil pekerjaan tersebut? | **f16** | 8 · checkbox | — |

**Opsi `f4` — berkode Dikti per opsi** (`is_other_dikti_code: f415`):

| Kode | Opsi |
|---|---|
| f401 | Melalui iklan di koran / majalah, brosur |
| f402 | Melamar ke perusahaan tanpa mengetahui lowongan yang ada |
| f403 | Pergi ke bursa / pameran kerja |
| f404 | Mencari lewat internet / iklan online / milis |
| f405 | Dihubungi oleh perusahaan |
| f406 | Menghubungi Kemenakertrans |
| f407 | Menghubungi agen tenaga kerja komersial / swasta |
| f408 | Memperoleh informasi dari pusat / kantor pengembangan karir fakultas / universitas |
| f409 | Menghubungi kantor kemahasiswaan / hubungan alumni |
| f410 | Membangun jejaring (network) sejak masih kuliah |
| f411 | Melalui relasi (misalnya dosen, orang tua, saudara, teman, dll) |
| f412 | Membangun bisnis sendiri |
| f413 | Melalui penempatan kerja atau magang |
| f414 | Bekerja di tempat yang sama dengan tempat kerja semasa kuliah |
| **f415** | *Lainnya* (isian teks) |

**Opsi `f16` — berkode Dikti per opsi** (`is_other_dikti_code: f1613`):

| Kode | Opsi |
|---|---|
| f1601 | Pertanyaan tidak sesuai, pekerjaan saya sekarang sudah sesuai dengan pendidikan saya |
| f1602 | Saya belum mendapatkan pekerjaan yang lebih sesuai |
| f1603 | Di pekerjaan ini, saya memperoleh prospek karir yang baik |
| f1604 | Saya lebih suka bekerja di area pekerjaan yang tidak ada hubungannya dengan pendidikan saya |
| f1605 | Saya dipromosikan ke posisi yang kurang berhubungan dengan pendidikan saya dibanding posisi sebelumnya |
| f1606 | Saya dapat memperoleh pendapatan yang lebih tinggi di pekerjaan ini |
| f1607 | Pekerjaan saya saat ini lebih aman / terjamin / secure |
| f1608 | Pekerjaan saya saat ini lebih menarik |
| f1609 | Pekerjaan saya saat ini lebih memungkinkan saya mengambil pekerjaan tambahan / jadwal yang fleksibel, dll |
| f1610 | Pekerjaan saya saat ini lokasinya lebih dekat dari rumah saya |
| f1611 | Pekerjaan saya saat ini dapat lebih menjamin kebutuhan keluarga saya |
| f1612 | Pada awal meniti karir ini, saya harus menerima pekerjaan yang tidak berhubungan dengan pendidikan saya |
| **f1613** | *Lainnya* (isian teks) |

**Opsi tanpa kode:**
- `f301`: Sebelum lulus · Sesudah lulus · Saya tidak mencari kerja
- `f5d`: Lokal / wilayah / wiraswasta tidak berbadan hukum · Nasional / wiraswasta berbadan hukum · Multinasional / internasional
- `f1101`: Instansi pemerintah · Organisasi non-profit / LSM · Perusahaan swasta · Wiraswasta / perusahaan sendiri · BUMN / BUMD · Institusi / Organisasi Multilateral (+ Lainnya)
- `f14`: Sangat Erat · Erat · Cukup Erat · Kurang Erat · Tidak Sama Sekali
- `f15`: Setingkat Lebih Tinggi · Tingkat yang Sama · Setingkat Lebih Rendah · Tidak Perlu Pendidikan Tinggi

### Section 3 — Wiraswasta (`jump_to: 5`)

Kode **dipakai ulang** dari Section 2, dengan redaksi disesuaikan konteks wirausaha.

| Pertanyaan (redaksi resmi) | Kode | Jenis | Wajib |
|---|---|---|---|
| Kapan anda mulai merencanakan berwiraswasta? | **f301** | 1 · radio | — |
| Jika … sebelum lulus, dalam berapa bulan sebelum lulus Anda memulai merencanakannya? | **f302** | 9 · angka | — |
| Jika … sesudah lulus, dalam berapa bulan sesudah lulus Anda memulai merencanakannya? | **f303** | 9 · angka | — |
| Apa posisi / jabatan Anda saat ini? | **f5c** | 1 · radio | ✅ |
| Apa jenis perusahaan / usaha wiraswasta yang Anda kelola saat ini? | **f1101** | 1 · radio + Lainnya | ✅ |
| Apa nama perusahaan / kantor tempat Anda berwiraswasta saat ini? | **f5b** | 2 · teks | ✅ |
| Apa tingkat / ukuran tempat berwiraswasta Anda saat ini? | **f5d** | 1 · radio | ✅ |
| Dimana provinsi tempat Anda berwiraswasta saat ini? | **f5a1** | 7 · dropdown | ✅ |
| Dimana Kabupaten / Kota tempat Anda berwiraswasta saat ini? | **f5a2** | 7 · dropdown | ✅ |
| Berapa rata-rata pendapatan Anda per bulan saat ini? | **f505** | 9 · angka | — |
| Seberapa erat hubungan antara bidang studi dengan pekerjaan Anda saat ini? | **f14** | 1 · radio | ✅ |
| Tingkat pendidikan apa yang paling tepat / sesuai untuk pekerjaan Anda saat ini? | **f15** | 1 · radio | ✅ |
| Jika Anda merasa pekerjaan saat ini tidak sesuai dengan pendidikan, mengapa mengambil pekerjaan tersebut? | **f16** | 8 · checkbox | — |

**Opsi `f5c`:** Founder · Co-Founder · Staff · Freelance / Kerja Lepas
**Opsi `f301` (varian wirausaha):** Sebelum lulus · Sesudah lulus · Saya tidak merencanakan berwiraswasta

Perhatikan: `f4` (cara mencari pekerjaan) **tidak ada** di section Wiraswasta.

### Section 4 — Melanjutkan Pendidikan (`jump_to: 5`)

| Pertanyaan (redaksi resmi) | Kode | Jenis | Wajib |
|---|---|---|---|
| Dari manakah sumber biaya studi lanjut Anda | **f18a** | 1 · radio (Biaya Sendiri / Beasiswa) | ✅ |
| Apa nama Perguruan Tinggi tempat Anda melanjutkan Pendidikan? | **f18b** | 2 · teks | ✅ |
| Apa nama program studi yang Anda ambil dalam melanjutkan pendidikan? | **f18c** | 2 · teks | ✅ |
| Kapan Anda mulai masuk melanjutkan pendidikan? | **f18d** | 6 · tanggal | ✅ |

### Section 5 — Belum Bekerja (`jump_to: 5`)

Seluruhnya kode ulangan dari Section 2, semua `is_required: false`.

| Pertanyaan (redaksi resmi) | Kode | Jenis |
|---|---|---|
| Kapan Anda mulai mencari pekerjaan? | **f301** | 1 · radio |
| Jika … sebelum lulus, dalam berapa bulan …? | **f302** | 9 · angka |
| Jika … sesudah lulus, dalam berapa bulan …? | **f303** | 9 · angka |
| Bagaimana Anda mencari pekerjaan tersebut? | **f4** (+`f415`) | 8 · checkbox |
| Berapa perusahaan / instansi / institusi yang sudah Anda lamar sampai saat ini? | **f6** | 9 · angka |
| Berapa banyak yang merespon lamaran Anda sampai saat ini? | **f7** | 9 · angka |
| Berapa banyak yang mengundang Anda untuk wawancara sampai saat ini? | **f7a** | 9 · angka |

### Section 6 — Tingkat Kompetensi (`jump_to: 6`)

Tiga matriks skala. Kode utama ada di pertanyaan, kode detail ada di **setiap baris** (`sub_questions`).

**6.1 — Penekanan metode pembelajaran · kode `f2` · skala:** Tidak Sama Sekali · Kurang · Cukup Besar · Besar · Sangat Besar

| Kode baris | Baris |
|---|---|
| f21 | Perkuliahan |
| f22 | Demonstrasi |
| f23 | Partisipasi dalam proyek riset |
| f24 | Magang |
| f25 | Praktikum |
| f26 | Kerja Lapangan |
| f27 | Diskusi |

**6.2 & 6.3 — Tingkat kompetensi · kode `f17` (dipakai dua kali) · skala:** Sangat Rendah · Rendah · Cukup · Tinggi · Sangat Tinggi

Kedua pertanyaan memakai kode pertanyaan yang **sama** (`f17`). Pembedanya adalah **kode baris**: nomor ganjil = kondisi saat lulus, nomor genap = kondisi yang dibutuhkan sekarang.

| Baris | Saat lulus (A) | Dibutuhkan sekarang (B) |
|---|---|---|
| Etika | f1761 | f1762 |
| Keahlian berdasarkan bidang ilmu | f1763 | f1764 |
| Bahasa Inggris | f1765 | f1766 |
| Penggunaan Teknologi Informasi | f1767 | f1768 |
| Komunikasi | f1769 | f1770 |
| Kerja sama tim | f1771 | f1772 |
| Pengembangan Diri | f1773 | f1774 |

Redaksi resmi:
- (A) "Pada saat lulus, pada tingkat mana kompetensi di bawah ini Anda kuasai?"
- (B) "Pada saat ini, pada tingkat mana kompetensi di bawah ini diperlukan dalam pekerjaan / studi lanjut Anda?"

---

## 4. Kode yang dipakai ulang — wajib diperhatikan backend

Kode Dikti **bukan** pengenal unik per pertanyaan. Satu kode bisa muncul di beberapa section karena mewakili **makna data yang sama**, bukan posisi pertanyaan.

| Kode | Muncul di section | Implikasi |
|---|---|---|
| f301 / f302 / f303 | Bekerja, Wiraswasta, Belum Bekerja | Simpan bersama `section_id`; saat upload cukup satu nilai karena alumni hanya melewati satu cabang |
| f4 (+f415) | Bekerja, Belum Bekerja | Sama |
| f5a1 / f5a2 / f5b / f5d | Bekerja, Wiraswasta | Sama |
| f505 / f14 / f15 / f16 / f1101 | Bekerja, Wiraswasta | Sama |
| f6 / f7 / f7a | Bekerja, Belum Bekerja | Sama |
| **f502** | **dua kali dalam section yang sama** | Anomali template resmi: dipakai untuk "Apakah dapat pekerjaan sebelum lulus?" (radio) dan "Dalam berapa bulan?" (angka). Backend perlu membedakan lewat `answer_type_id` atau `number`. |
| **f17** | dua kali dalam Section 6 | Dibedakan lewat kode `sub_questions` (ganjil/genap) |

**Kunci penyimpanan yang disarankan:** `(quest_master_id, section_id, question_number, code)` — jangan mengandalkan `code` sendirian.

---

## 5. Pertanyaan tanpa kode Dikti

Ditemukan di `template-lengkap.json`. Semuanya kebutuhan BAN-PT atau operasional internal, **tidak** di-upload ke Kemdiktisaintek:

| Pertanyaan | Kode | Keterangan |
|---|---|---|
| Berapakah upah minimum (UMR) di tempat lokasi Anda bekerja saat ini? | *(kosong)* | Pembanding untuk IKU#2 (>1,2× UMP) |
| Apa tipe kontrak pekerjaan Anda saat ini? | *(kosong)* | Karyawan Kontrak / Tetap / Tanpa kontrak |
| Siapakah nama atasan di perusahaan Anda bekerja saat ini? | `k1` | Kode internal, bukan kode Dikti |
| Apa jabatan atasan Anda bekerja saat ini? | *(kosong)* | |
| Dimana alamat perusahaan tempat Anda bekerja saat ini? | *(kosong)* | |
| Berapa No Telp / No HP atasan Anda saat ini? | *(kosong)* | |
| Apa alamat email atasan Anda saat ini? | `k2` | Kode internal — dipakai untuk mengirim Survei Pengguna Lulusan |
| Seberapa erat hubungan antara bidang studi dengan pendidikan Anda? | `f14` | Varian Section Melanjutkan Pendidikan, hanya ada di template lengkap |

Prefiks `k` (`k1`, `k2`) menandai **data kontak atasan** — ini jembatan otomatis ke Survei Pengguna Lulusan.

---

## 6. Survei Pengguna Lulusan (`formula: graduate-user`)

Hampir seluruh pertanyaan **tanpa kode Dikti** — konsisten dengan posisinya sebagai instrumen BAN-PT (Indikator 14B), bukan pelaporan PDDikti.

| Pertanyaan | Kode | Jenis |
|---|---|---|
| Nama Ibu/Bapak/Saudara | — | 2 · teks |
| No Telp/HP | — | 2 · teks |
| Email | — | 2 · teks |
| Nama Perusahaan | — | 2 · teks |
| Alamat Perusahaan | — | 2 · teks |
| Jabatan Anda | — | 2 · teks |
| Nama Alumni yang akan dinilai | **gu_nama_alumni** | 2 · teks |
| Program Studi Alumni yang akan dinilai | **gu_prodi_alumni** | 2 · teks |
| Tahun Lulus Alumni yang akan dinilai | **gu_tahun_lulus** | 9 · angka |
| Berikan penilaian … atas kinerja Alumni kami dalam | — | 5 · matriks 12 baris |
| Bagaimana harapan Anda terhadap lulusan Universitas kami? | — | 2 · teks |
| Berikan Saran dan masukan Anda untuk Universitas kami | — | 2 · teks |

**Skala penilaian:** Kurang · Cukup · Baik · Sangat Baik

**12 baris aspek kinerja** (semua tanpa kode): Integritas / etika berperilaku / moral · Kinerja/keahlian berdasarkan bidang ilmu · Kemampuan berbahasa asing · Kemampuan penggunaan teknologi informasi · Kemampuan berkomunikasi · Kemampuan bekerjasama dalam tim · Kepemimpinan · Pengembangan diri · Etos kerja · Kesiapan terjun di masyarakat · Berpikir kritis · Kreatifitas

Tiga kode `gu_*` berfungsi sebagai **kunci pencocokan** — supaya jawaban perusahaan bisa ditautkan ke record alumni yang benar.

---

## 7. Aturan penentuan tier (Core / Optional / Specific)

Sebelumnya tier ditentukan secara intuitif. Setelah membaca data template, aturannya bisa dibuat **objektif dan bisa diaudit**:

| Tier | Aturan | Konsekuensi |
|---|---|---|
| **Core** | Punya `code` Dikti **dan** `is_required = true` | Tidak bisa dinonaktifkan atau dihapus. Redaksi dikunci sebagai **kebijakan produk**, bukan keharusan teknis — lihat §7.1. |
| **Optional** | Punya `code` Dikti **dan** `is_required = false` — *atau* tanpa kode tapi diminta regulator lain (BAN-PT, Kemenkes, LAM) | Bisa di-toggle aktif/nonaktif. Kalau diaktifkan, struktur opsinya tidak boleh diubah. |
| **Specific** | Tanpa `code` Dikti, buatan institusi | Bebas diubah Admin CDC. Tidak pernah di-upload ke Dikti. |

### 7.1 Yang benar-benar mengikat: kode, bukan redaksi

Versi awal dokumen ini menyatakan bahwa redaksi Core terkunci **karena** kode Dikti — bahwa mengubah kata-kata membuat data tidak bisa di-upload. **Itu tidak akurat.** Dikonfirmasi dua hal:

1. **Dari schema.** Tabel `participant_answers` menyimpan jawaban sebagai `answer_question_id` — referensi ke baris opsi, bukan teks maupun kode. Kode diambil lewat join saat pengiriman. Jadi mengubah kolom `content` tidak menyentuh jalur pengiriman sama sekali.
2. **Dari tim produk.** Diksi pertanyaan dan jawaban boleh disesuaikan selama maknanya tidak bergeser jauh. Tipe data juga bebas — belum ada kepastian apakah Dikti menyimpan semuanya sebagai string, jadi memakai numeric/boolean di sisi kita tidak masalah.

**Yang benar-benar tidak boleh berubah:**

| Invarian | Kenapa |
|---|---|
| Kode pertanyaan tetap melekat ke pertanyaan yang **maknanya sama** | Kalau `f505` dipindah ke pertanyaan tentang hal lain, data terkirim ke kolom yang salah |
| Kode opsi tetap melekat ke opsi yang **maknanya sama** | Sama, di level jawaban |
| **Nilai `value` tetap melekat ke opsi yang maknanya sama** — berlaku untuk opsi yang tidak punya kode sendiri | Sebagian besar opsi tidak punya `code`; yang mengidentifikasi jawaban justru kolom `value`. Rinciannya di **§13.1** |
| **Struktur opsi berkode tidak boleh diubah** — tidak boleh digabung, dihapus, atau ditambah di antara yang berkode | Menggabungkan dua opsi berarti menghapus satu baris, dan baris itulah pemegang kodenya. Setiap opsi berkode adalah **satu kolom** di format pengiriman ([Format Pengiriman §2.3](Format-Pengiriman-Data-ke-Dikti.md)); kode yang hilang tidak punya tempat lagi |
| **Isian teks "Lainnya" harus tersimpan terpisah dari penandanya** | Opsi "Lainnya" mengirim dua hal: penanda tercentang (`f415`, `f1613`) dan teksnya (`f416`, `f1614`). Menyimpan hanya penandanya berarti isian alumni terbuang |

**Yang boleh berubah:**

- Redaksi pertanyaan dan opsi, selama makna tidak bergeser
- Tipe input di antarmuka (angka, teks, tanggal) dan tipe kolom di basis data
- Urutan tampil
- Keterangan bantuan di bawah pertanyaan

### 7.2 Kalau boleh diubah, kenapa tetap dikunci di produk?

Karena boleh secara teknis bukan berarti bijak secara produk. Tiga alasan:

**Admin CDC tidak punya cara menilai apakah perubahannya aman.** Batas "makna tidak bergeser jauh" itu penilaian yang butuh pemahaman instrumen. Persona Admin CDC di banyak PT bukan orang riset. Memberi kebebasan tanpa alat penilaian sama dengan memindahkan risiko ke orang yang tidak bisa mengelolanya.

**Komparabilitas antar-PT adalah nilai jual platform.** Begitu tiap kampus menulis ulang pertanyaannya sendiri, benchmark antar-PT kehilangan dasar. Ini justru inti definisi Core menurut Schomburg — sama untuk semua institusi.

**Risikonya asimetris.** Untung dari mengubah diksi kecil: bahasa sedikit lebih pas dengan konteks kampus. Ruginya besar: data tidak komparabel, dan kalau ternyata Dikti juga mencocokkan teks di sisi mereka (kita belum bisa memastikan), laporan bisa ditolak.

**Jadi framing yang benar di antarmuka:** Core dikunci **agar data bisa dibandingkan antar-PT dan aman saat dilaporkan** — bukan karena "kalau diubah tidak bisa di-upload". Yang kedua itu klaim teknis yang tidak benar.

Kalau nanti diputuskan Admin CDC boleh menyunting redaksi Core, syarat minimalnya: redaksi asli tetap tersimpan, perubahan tercatat di log, dan ada peringatan eksplisit soal dampak ke komparabilitas.

Karena basisnya `template-lengkap.json`, flag `is_required` yang dipakai adalah milik template lengkap. Tinggal **dua pengecualian**:

1. **`f2`** (penekanan metode pembelajaran) — `is_required: false` di kedua template, tapi tetap Core karena diminta Kemenkes dan jadi satu-satunya pengukur proses pembelajaran.
2. **Data kontak alumni dan atasan** — email/HP alumni di Wave Exit, serta lima field kontak atasan di G1 (`k1`, jabatan, email `k2`, no. telp, alamat perusahaan). Tidak punya kode Dikti tapi wajib secara operasional: tanpa kontak alumni sistem tidak bisa mengirim wave berikutnya, tanpa kontak atasan Survei Pengguna Lulusan tidak bisa dikirim otomatis.

**`f505` (pendapatan) sudah bukan pengecualian lagi.** Di `template-lengkap.json` nilainya `is_required: true`, jadi statusnya Core mengikuti aturan biasa. Ini salah satu keuntungan memakai template lengkap sebagai basis.

Jadi definisi Core yang berlaku:

> **Core = (berkode Dikti dan wajib) ATAU (wajib agar sistem bisa berjalan) ATAU (wajib agar evaluasi prodi bisa dilakukan).**

Alasan tiap pengecualian dirinci di §11.4. Penting bahwa pengecualian ini **terdaftar dan beralasan**, bukan dibiarkan sebagai penilaian bebas per pertanyaan — begitu Admin CDC atau regulator bertanya "kenapa yang ini terkunci padahal tidak wajib?", jawabannya harus bisa ditunjuk.

---

## 8. Ketidaksesuaian dengan mockup — dan tindakannya

Hasil pencocokan `kuesioner.html` dan `simulasi-pengisian.html` terhadap template resmi.

### 8.1 Salah tier — pertanyaan berkode Dikti & wajib, tapi ditandai Optional

| Pertanyaan di mockup | Kode | `is_required` di template | Tier sekarang | Seharusnya |
|---|---|---|---|---|
| Apakah Anda aktif mencari kerja dalam 4 minggu terakhir? | f1001 | ✅ true | Optional (kemdikbud) | **Core** |
| Bagaimana cara Anda mencari pekerjaan tersebut? | f4 | ✅ true (Section Bekerja) | Optional (kemdikbud) | **Core** |

Yang tetap Optional dan sudah benar (semua `is_required: false`): `f301` (kapan mulai mencari kerja), `f6` (jumlah dilamar), `f7` (jumlah merespons), `f7a` (jumlah mengundang wawancara), `f16` (alasan pekerjaan tidak sesuai).

Bundle Kemenkes (faskes, STR, kesesuaian kompetensi, sertifikat profesi) **tidak ada** di template PDDikti sama sekali → benar sebagai Optional bertag `kemenkes`.

### 8.2 Opsi jawaban salah

`f1001` di mockup ditulis "Pilihan: Ya / Tidak". Template resmi punya **4 opsi** dengan nuansa yang jauh berbeda (menunggu hasil lamaran, akan mulai bekerja dalam 2 minggu, belum pasti).

Ini pelanggaran invarian di §7.1 — bukan soal redaksi, tapi soal **struktur**. Menyederhanakan 4 opsi jadi 2 berarti menghapus dua baris, dan tiap baris memegang identitasnya sendiri. Nuansanya juga hilang: "menunggu hasil lamaran" dan "belum pasti bekerja" adalah dua kondisi berbeda yang dua-duanya bukan sekadar "Tidak".

### 8.3 Satu pertanyaan di mockup = dua pertanyaan berkode di template

| Mockup | Template resmi |
|---|---|
| "Di mana lokasi tempat Anda bekerja? (Provinsi, Kota/Kabupaten)" | `f5a1` (provinsi) + `f5a2` (kab/kota) — **dua** pertanyaan |
| "Tingkat kompetensi saat lulus (A) vs yang dibutuhkan pekerjaan (B)" | `f17` × 2 dengan set `sub_questions` berbeda — **dua** matriks |

Widget di `simulasi-pengisian.html` sudah benar menampilkannya sebagai dua kolom / dua dropdown. Yang perlu diperbaiki hanya pencatatan di builder supaya jumlah pertanyaan Core akurat.

### 8.4 Selisih redaksi

Redaksi ini **tidak wajib persis** — lihat §7.1. Penyelarasan berikut dilakukan atas dasar lain: memakai redaksi resmi berarti alumni yang pernah mengisi tracer di situs Kemdiktisaintek menemukan kalimat yang sama, dan jawaban antar-PT tetap bisa dibandingkan. Ini pilihan kualitas data, bukan kepatuhan teknis.

| Redaksi mockup | Redaksi resmi | Kode |
|---|---|---|
| Apa status utama Anda saat ini? | Jelaskan status Anda saat ini? | f8 |
| Berapa rata-rata pendapatan Anda per bulan? (take home pay) | Berapa rata-rata pendapatan Anda per bulan saat ini? | f505 |
| Apa jenis perusahaan/instansi tempat Anda bekerja? | Apa jenis perusahaan / instansi / institusi tempat Anda bekerja saat ini? | f1101 |
| Apa tingkat tempat kerja Anda? | Apa tingkat tempat kerja Anda saat ini? | f5d |
| Apa nama perusahaan/kantor tempat Anda bekerja? | Apa nama perusahaan / kantor tempat Anda bekerja saat ini? | f5b |
| Seberapa erat hubungan bidang studi dengan pekerjaan Anda? | Seberapa erat hubungan antara bidang studi dengan pekerjaan Anda saat ini? | f14 |
| Tingkat pendidikan apa yang paling sesuai untuk pekerjaan Anda saat ini? | Tingkat pendidikan apa yang paling tepat / sesuai untuk pekerjaan Anda saat ini? | f15 |
| Seberapa besar penekanan metode pembelajaran di program studi Anda? | Menurut Anda seberapa besar penekanan pada metode pembelajaran di bawah ini dilaksanakan di program studi Anda? | f2 |
| Dalam berapa bulan Anda mendapatkan pekerjaan pertama? | *(sudah sesuai)* | f502 |

**Soal "status utama".** Keputusan sebelumnya adalah membuat pertanyaan status menjadi pilihan tunggal dengan penekanan pada kata "utama". Itu tetap bisa dijalankan tanpa mengubah redaksi resmi: kolom `content` memakai redaksi Dikti (`Jelaskan status Anda saat ini?`), dan penekanan "pilih yang paling menggambarkan kondisi utama" ditaruh di kolom `description`. Kolom `description` tidak punya kode Dikti, jadi bebas diisi sesuai kebutuhan kampus.

### 8.5 Wave Exit dan kode f502

Wave Exit menanyakan "Apakah Anda sudah bekerja atau berwirausaha sebelum lulus?" — mirip `f502`, tapi redaksinya berbeda. Rekomendasi: **jawaban Exit tidak diberi kode Dikti**. Kode `f502` ditempelkan pada jawaban **verifikasi di Wave G1**, karena itulah data yang memenuhi ketentuan Kepmen 358/2025 (diambil minimal 1 tahun setelah lulus). Exit tetap berguna sebagai isian awal yang mempercepat pengisian G1.

Konsekuensinya, pertanyaan verifikasi di G1 ("Apakah pekerjaan/usaha sebelum lulus masih Anda jalankan?") memang benar **tidak punya kode Dikti** — ia pertanyaan internal untuk menegakkan kriteria (e)/(f) IKU#2 ("tetap menjalankan"). Yang berkode adalah jawaban `f502` dan `f8` yang dihasilkan setelah verifikasi.

---

## 9. Ringkasan kode

**76 kode Dikti unik** dari 48 pertanyaan:

| Level | Jumlah | Daftar |
|---|---|---|
| Pertanyaan | **27** | f2, f4, f5a1, f5a2, f5b, f5c, f5d, f6, f7, f7a, f8, f14, f15, f16, f17, f18a, f18b, f18c, f18d, f301, f302, f303, f502, f505, f1001, f1101, f1201 |
| Opsi jawaban | **26** | f401–f414 · f1601–f1612 |
| Isian "Lainnya" | **2** | f415 · f1613 |
| Baris matriks | **21** | f21–f27 · f1761–f1774 |

48 pertanyaan tapi hanya 27 kode pertanyaan, karena 16 kode dipakai ulang antar cabang (lihat §4).

**Kode internal (non-Dikti):** k1, k2 · gu_nama_alumni, gu_prodi_alumni, gu_tahun_lulus

**Kode Kemenkes:** tidak ada. Bundle Kemenkes tidak punya sistem kode apa pun — lihat [Tabel Master §5](Tabel-Master-Pertanyaan-Tracer-Study.md).

---

## 10. Struktur Cabang di Wave G1 — Sudah Diterapkan ke Mockup

Format resmi Kemdiktisaintek memecah kuesioner menjadi enam bagian, dengan percabangan dikendalikan jawaban `f8`. Struktur ini sekarang tercermin di `simulasi-pengisian.html`.

> ⚠️ **Bagian ini menggambarkan struktur di file template, bukan tampilan situs resmi.** Setelah kelima cabang ditelusuri langsung di situs resmi, ada tiga selisih — terutama status "Belum memungkinkan bekerja" yang di template melompat ke bagian 6 tapi di situs resmi tetap melewati 11 pertanyaan. Rinciannya di **§15.3**. Struktur enam bagian di bawah tetap berguna sebagai model penyimpanan; untuk pertanyaan mana muncul di cabang mana, pakai matriks di [Format Pengiriman §5.1](Format-Pengiriman-Data-ke-Dikti.md).

### 10.1 Alur

```
1. Informasi Umum  ......................  semua alumni
       │
       └── jawaban f8 menentukan cabang
             │
             ├── Bekerja ...............  cabang 2
             ├── Wiraswasta ............  cabang 3
             ├── Melanjutkan Pendidikan   cabang 4
             ├── Tidak kerja, mencari ..  cabang 5
             └── Belum memungkinkan ....  langsung ke bagian 6
             
6. Tingkat Kompetensi  ..................  semua alumni
```

### 10.2 Isi tiap bagian di mockup

| Bagian | Tier | Jumlah pertanyaan | Catatan |
|---|---|---|---|
| 1 · Informasi Umum | Core | 4 + verifikasi Exit | Masa tunggu (`f502`) diletakkan di sini agar tidak perlu diulang di cabang Bekerja dan Wiraswasta |
| 2 · Bekerja | Core | 10 | Termasuk `f4` (cara mencari pekerjaan) yang wajib di cabang ini, dan `f5c` (jabatan) yang kami tambahkan — lihat §13.5 |
| 3 · Wiraswasta | Core | 9 | Tidak menanyakan `f4` — format resmi tidak memasukkannya di sini |
| 4 · Melanjutkan Pendidikan | Core | 4 | Cabang paling ringkas |
| 5 · Belum Bekerja | **Optional** | 5 | Satu-satunya cabang tanpa pertanyaan Core — seluruh isinya `is_required: false` |
| 6 · Tingkat Kompetensi | Core | 3 matriks | Diisi semua status, termasuk yang melanjutkan pendidikan |

### 10.3 Keputusan desain

**Masa tunggu ditaruh di Informasi Umum.** Di template resmi `f502` memang berada di Section 1, dan itu menguntungkan: kalau ditaruh di cabang, pertanyaan yang sama harus diduplikasi di Bekerja dan Wiraswasta. Ditandai muncul bersyarat ("jika status Bekerja atau Wiraswasta") supaya alumni yang melanjutkan pendidikan tidak melihatnya.

**Cabang Belum Bekerja ditandai Optional, bukan Core.** Ini konsekuensi langsung dari aturan tier di §7 — seluruh pertanyaan di Section 5 template resmi bernilai `is_required: false`. Konsisten berarti cabang ini boleh dinonaktifkan Admin CDC. Kalau diaktifkan, struktur opsinya yang dijaga; redaksinya dikunci atas dasar komparabilitas (§7.2), bukan keharusan teknis.

**Kode ganda antar cabang bukan masalah.** `f505`, `f14`, `f15`, `f16`, `f5a1`, `f5a2`, `f5b`, `f5d`, `f1101` muncul di dua cabang; `f4`, `f6`, `f7`, `f7a`, `f301`–`f303` juga. Karena alumni hanya melewati satu cabang, hanya satu nilai yang terisi per kode. Yang perlu dijaga backend adalah menyimpan **nomor bagian** bersama nilainya, supaya jelas jawaban itu berasal dari cabang mana. Catatan penamaan: di file template properti bagian bernama `number` dan `name` — **tidak ada** `section_id`, jadi sebutan itu di versi awal dokumen ini keliru.

**Cabang "Belum memungkinkan bekerja" tidak punya bagian sendiri.** Sesuai `jump_to: 5` pada opsi `f8`, alumni dengan status ini langsung menuju bagian Tingkat Kompetensi. Tidak perlu widget tambahan.

**Matriks kompetensi digabung — mengikuti situs resmi, bukan keputusan kami.** Di dalam file template, `f17` adalah dua pertanyaan terpisah, dan sempat kami catat bahwa penggabungan kolom A/B adalah pilihan UX kami sendiri demi mengurangi klik. **Itu keliru.** Setelah tangkapan layar situs resmi ditelaah, ternyata situs resmi menampilkannya sebagai **satu tabel dengan dua kelompok kolom** — dan template lengkap pun memberi kedua entri `number` yang sama (14). Jadi bentuk gabungan ini adalah bentuk resminya; kami hanya mengikuti.

Manfaat pengisiannya tetap nyata (alumni bisa langsung membandingkan "yang saya kuasai" dengan "yang dibutuhkan"), tapi itu bonus, bukan alasan. Saat disimpan, keduanya tetap dipisah sesuai kode baris — `f1761`–`f1773` untuk A, `f1762`–`f1774` untuk B — sehingga 14 kode tetap terkirim utuh.

**Arah skala dua matriks di bagian ini berlawanan.** `f17` memakai 1 = Sangat Rendah sampai 5 = Sangat Tinggi. `f2` memakai 1 = Sangat Besar sampai 5 = Tidak Sama Sekali. Mockup sekarang menampilkan `f2` dengan kolom pertama "Sangat Besar", mengikuti situs resmi sekaligus menjaga `value` tetap benar. Rinciannya di §13.2.

---

## 11. Penyelarasan dengan Dokumen Terdahulu

Sebelum dokumen ini ada, penetapan Core/Optional mengacu ke [Pemetaan Pertanyaan Core vs Optional (Draft Seed Data)](Pemetaan%20Pertanyaan%20Core%20vs%20Optional%20(Draft%20Seed%20Data).md) §6, yang menetapkan Core = **3 item**. Dokumen ini menetapkan **18 item** untuk satu alumni. Bagian berikut menjelaskan kenapa berbeda dan mana yang berlaku.

### 11.1 Dua definisi Core yang berbeda

| | Pemetaan §6 (lama) | Dokumen ini (berlaku) |
|---|---|---|
| Dasar | Definisi Schomburg: Core = *fixed for the whole project*, sama untuk semua institusi | Flag `is_required` di `template-pddikti.json` |
| Cara menentukan | Irisan antara yang diminta Kemdikbud dan yang diminta Kemenkes | Kewajiban satu regulator: Kemdiktisaintek |
| Hasil | 3 item | 18 item (untuk satu alumni cabang Bekerja) |
| Pertanyaan yang dijawab | "Apa yang bisa dibandingkan antar semua institusi?" | "Apa yang harus ada supaya laporan bisa di-upload?" |

Keduanya sah, tapi menjawab hal yang berbeda.

### 11.2 Kenapa yang baru dipakai

Bukan karena tabel irisan di [Komparasi §4](Komparasi%20Kuesioner%20KEMDIKTI%20(Kemdiktisaintek)%20vs%20KEMENKES.md) salah, tapi karena **asumsi di baliknya berubah**.

Logika irisan hanya masuk akal kalau ada kampus yang lapor ke Kemenkes tanpa lapor ke PDDikti. Setelah ditelusuri, **Poltekkes tetap perguruan tinggi di bawah PDDikti** — IKU#2 berlaku juga untuk mereka. Jadi modelnya bukan "Kemenkes ATAU Kemdikti", tapi **Core (Kemdikti) + delta Kemenkes**.

Ada juga konsekuensi praktis yang lebih berat. Kalau sebuah pertanyaan `is_required` di format resmi lalu Admin CDC menonaktifkannya, PT tidak bisa mengirim laporan sama sekali. Itu kegagalan yang lebih keras daripada kehilangan daya banding antar institusi.

### 11.3 Prinsip dari dokumen lama yang tetap dipakai

**Regulator adalah tag, bukan penentu tier bercabang.** Tidak ada "Core versi Kemdikbud" dan "Core versi Kemenkes" yang isinya berbeda. Satu bank pertanyaan, satu set Core, dan tag regulator hanya dipakai untuk memfilter Optional. Prinsip ini dari [Pemetaan §1](Pemetaan%20Pertanyaan%20Core%20vs%20Optional%20(Draft%20Seed%20Data).md) dan tetap berlaku.

### 11.4 Pengecualian: Core tanpa dasar `is_required`

Aturan di §7 mengatakan Core = berkode Dikti **dan** `is_required: true`. Setelah basis dipindah ke `template-lengkap.json`, tinggal satu pertanyaan berkode Dikti yang menyimpang.

**`f2` — Menurut Anda seberapa besar penekanan pada metode pembelajaran di bawah ini dilaksanakan di program studi Anda?**

- `is_required: false` di **kedua** template
- Tapi [Pemetaan §2](Pemetaan%20Pertanyaan%20Core%20vs%20Optional%20(Draft%20Seed%20Data).md) menandainya Core, dan [Komparasi §4](Komparasi%20Kuesioner%20KEMDIKTI%20(Kemdiktisaintek)%20vs%20KEMENKES.md) mencatat Kemenkes juga memintanya
- Ini satu-satunya pertanyaan yang mengukur **proses pembelajaran** (bukan hasilnya). Tanpa ini, prodi tidak punya dasar untuk mengaitkan kelemahan kompetensi alumni ke metode pengajaran yang dipakai
- **Keputusan: tetap Core**, dengan dasar kebutuhan internal PT dan permintaan Kemenkes — bukan dasar format upload

**`f505` — sudah tidak lagi jadi pengecualian.** Di `template-lengkap.json` nilainya `is_required: true`, jadi Core-nya mengikuti aturan biasa. Sebelumnya ia jadi pengecualian karena basis yang dipakai adalah `template-pddikti.json` yang menandainya tidak wajib.

**Data kontak (alumni & atasan) — Core operasional, bukan Core regulasi.** Delapan field: email + HP alumni di Wave Exit, dan lima field kontak atasan di G1 (dua di antaranya berkode internal `k1`/`k2`). Tidak satu pun punya kode Dikti. Dasarnya: tanpa kontak alumni sistem tidak bisa mengirim G1/G2, dan tanpa email atasan Survei Pengguna Lulusan tidak bisa dikirim otomatis — padahal survei itu wajib untuk BAN-PT Indikator 14B.

### 11.5 Tiga sumbu yang sebelumnya tercampur

Kebingungan definisi Core muncul karena tiga hal berbeda dipakai bergantian sebagai dasar. Memisahkannya membuat penetapan tier lebih mudah dipertahankan:

| Sumbu | Pertanyaan | Menentukan |
|---|---|---|
| 1 · Berkode | Ada kode Dikti? | Struktur opsinya wajib dijaga, dan redaksinya dikunci atas dasar komparabilitas (§7.1–7.2) |
| 2 · Wajib | `is_required: true`? | Boleh/tidak dinonaktifkan |
| 3 · Lintas cabang | Ditanyakan ke semua status? | Muncul di bagian umum atau di dalam cabang |

Dokumen lama memakai gabungan sumbu 2 dan 3 lewat lensa irisan regulator. Dokumen ini memisahkannya: **tier** ditentukan sumbu 1 dan 2, sedangkan sumbu 3 dipakai untuk menyusun urutan bagian (lihat §10).

Contoh yang menunjukkan ketiganya independen: `f2` lintas cabang (sumbu 3 ✅), terkunci (sumbu 1 ✅), tapi tidak wajib (sumbu 2 ❌). Kalau ketiganya dicampur jadi satu label, kasus seperti ini pasti salah tempat.

### 11.6 Status penyelarasan dokumen

| Dokumen | Tindakan |
|---|---|
| `Pemetaan Pertanyaan Core vs Optional (Draft Seed Data).md` | §1 dan §6 ditandai digantikan. §3 (4 gap) dan §5 (7 aspek → 12 aspek) ditandai sudah terverifikasi. Checklist §8 diperbarui. §4 dan §7 tetap berlaku. |
| `Komparasi Kuesioner KEMDIKTI vs KEMENKES.md` | Dua pertanyaan terbuka di §2 dan §3e ditutup dengan jawaban dari template resmi. Checklist §5 diperbarui. Ditambah §6 berisi penyelarasan definisi Core. |
| `Bank Soal & Logic Interaktif v2.1a.md` | §8 (verifikasi Exit→G1) dan §9 (ringkasan kode Dikti) ditambahkan. |
| `Tabel-Master-Pertanyaan-Tracer-Study.md` | **Baru.** Data mentah: 62 pertanyaan template lengkap dengan redaksi persis, seluruh opsi jawaban, dan kode di tiap level. Digenerate langsung dari JSON, dengan penanda untuk tambahan template lengkap, redaksi yang diambil dari pddikti, dan pertanyaan yang tidak diadopsi. |
| Dokumen ini | Acuan tier dan keputusan desain yang berlaku. §12 memuat pemilihan template. |

**Yang belum terselesaikan:** sisi Kemenkes masih level topik (✅/❌) dari riset awal, tanpa satu pun redaksi yang bisa diverifikasi. Empat pertanyaan Kemenkes di mockup berasal dari prototype lama, jadi redaksi dan opsinya berpotensi berubah.

Perlu diluruskan: **bukan karena dokumen instrumen Kemenkes belum ditemukan** — dokumen semacam itu memang tidak ada. Sumber yang tersedia dan sah adalah **live site Kemenkes**, sama seperti sisi Kemdikti yang juga bersumber dari live site sebelum template JSON-nya ada. Jadi kesetaraan data bisa dicapai; yang belum dilakukan adalah penangkapannya. Daftar tangkapan yang dibutuhkan ada di [Komparasi §5.1](Komparasi%20Kuesioner%20KEMDIKTI%20(Kemdiktisaintek)%20vs%20KEMENKES.md).

Satu risiko yang perlu diantisipasi dari hasil penangkapan itu: **kalau pertanyaan gate Kemenkes ternyata punya opsi status yang berbeda** dari `f8`, bundle Kemenkes tidak bisa tetap sekadar "tambahan Optional" — ia butuh logika percabangan sendiri, dan asumsi "Core Kemdikti + delta Kemenkes" di §11.2 perlu ditinjau ulang. Sampai tangkapan itu ada, asumsi sekarang dipakai karena riset awal menunjukkan Kemenkes hanya meminta tiga topik yang semuanya sudah ada di Core.

---

## 12. Pemilihan Template: `lengkap` vs `pddikti`

Ada dua template di workspace dengan isi yang tumpang tindih. Bagian ini menjelaskan mana yang dipakai dan kenapa.

### 12.1 Hubungan keduanya

**`template-lengkap.json` adalah superset penuh dari `template-pddikti.json`.** Ke-27 kode Dikti yang ada di pddikti semuanya ada di lengkap — tidak ada satu pun kode yang hilang.

| | pddikti | lengkap |
|---|---|---|
| Total pertanyaan | 48 | **62** |
| Kode Dikti unik | 27 | 27 (identik) |
| Pertanyaan tanpa kode | 0 | **14** |

Empat belas tambahan di lengkap:

| Tambahan | Jumlah | Kegunaan |
|---|---|---|
| Upah minimum (UMR) lokasi kerja | 2 (Bekerja, Wiraswasta) | Pembanding IKU#2 |
| Tipe kontrak pekerjaan | 1 | Analisis stabilitas kerja |
| Kontak atasan: nama `k1`, jabatan, alamat, no. telp, email `k2` | 10 (2 cabang × 5) | Jembatan ke Survei Pengguna Lulusan |
| `f14` varian studi lanjut | 1 | Keeratan bidang studi untuk alumni yang melanjutkan kuliah |

### 12.2 Urutan pertanyaan tidak bisa diambil dari template mana pun

Urutan di situs resmi (dari [Komparasi §1](Komparasi%20Kuesioner%20KEMDIKTI%20(Kemdiktisaintek)%20vs%20KEMENKES.md)) untuk cabang Bekerja: pendapatan → provinsi → kab/kota → jenis instansi → nama perusahaan → tingkat tempat kerja → keeratan → jenjang.

| Sumber | Urutan array-nya |
|---|---|
| Situs resmi | pendapatan, lokasi, jenis, **nama**, **tingkat**, keeratan, jenjang |
| pddikti | tingkat, lokasi, jenis, nama, **pendapatan**, keeratan, jenjang |
| lengkap | proses cari kerja, pendapatan, jenis, **tingkat**, lokasi, nama, keeratan |

Kolom `number` juga tidak bisa dipakai sebagai kunci urut — nilainya duplikat, lima pertanyaan sama-sama `num=4`.

**Keputusan:** urutan di mockup mengikuti **situs resmi**, bukan urutan array template. Alasannya pengalaman pengisian: sebagian alumni pernah mengisi tracer di situs Kemdiktisaintek, jadi alur yang sama mengurangi kebingungan. `f4` (cara mencari pekerjaan) tidak ada di situs resmi tapi wajib di template, jadi ditaruh **setelah** delapan pertanyaan yang urutannya mengikuti situs resmi.

### 12.3 Sembilan selisih redaksi — dan mana yang dipakai

Setiap selisih dicocokkan ke catatan situs resmi atau riset awal di dokumen Komparasi:

| Kode | Dipakai | Alasan |
|---|---|---|
| `f505` pendapatan | **lengkap** | Situs resmi menulis "(take home pay)"; hanya ada di lengkap |
| `f7` jumlah merespons | **lengkap** | Riset awal pakai "merespon**s**", pddikti "merespon" |
| `f16` alasan tidak sesuai | **lengkap** | Riset awal: "…mengapa **anda mengambilnya**?" — lengkap sama |
| `f502` masa tunggu | **lengkap** | Redaksi generalisasi ("pekerjaan pertama / melanjutkan studi") memungkinkan satu pertanyaan untuk tiga cabang; redaksi pddikti hanya pas kalau diduplikasi per cabang |
| `f502` Ya/Tidak | **lengkap** | Alasan sama |
| `f2` metode pembelajaran | **pddikti** | Riset awal diawali "**Menurut anda** seberapa besar…"; lengkap menghilangkannya |
| `f1001` aktif 4 minggu | **lengkap** | Situs resmi menulis "…4 minggu terakhir? **Pilihlah satu jawaban**" — jadi versi lengkap yang benar, dan penetapan awal ke pddikti keliru. Di mockup kalimat "Pilihlah satu jawaban" ditaruh sebagai keterangan bantuan di bawah pertanyaan, bukan disambung ke redaksinya. Itu perbedaan tata letak, bukan perbedaan makna |
| `f15` jenjang | **pddikti** | Kapitalisasi "Anda" benar; lengkap pakai "anda" |
| `f5a1` / `f5a2` lokasi | **pddikti** | "Dimana **tempat** provinsi Anda bekerja" (lengkap) rancu secara tata bahasa |

### 12.4 Satu isi template yang sengaja tidak diadopsi

**Pertanyaan upah minimum (UMR) tidak ditanyakan ke alumni.**

Template lengkap memuatnya sebagai isian angka di cabang Bekerja dan Wiraswasta. Kami tidak memakainya, dengan tiga alasan:

1. **Nilainya sudah tersedia di sistem.** `tracer schema.sql` memuat tabel `ump (year, code, name, price)` — referensi UMP per wilayah per tahun sudah dirancang sejak awal. Provinsi kerja alumni diketahui dari `f5a1`, tahunnya dari periode pengisian. Cukup dilookup.
2. **Alumni belum tentu tahu.** Menanyakan UMP provinsi tempat kerja ke individu berisiko besar salah isi, dan angka yang salah langsung merusak perhitungan bobot IKU#2.
3. **Menambah beban tanpa manfaat baru.** Kuesioner G1 sudah panjang. Setiap pertanyaan yang bisa dihilangkan tanpa kehilangan data adalah kemenangan untuk response rate — dan BAN-PT mensyaratkan ≥50%.

Yang perlu dijaga: **isi tabel `ump` diperbarui tiap tahun** mengikuti penetapan gubernur. Ini pekerjaan pemeliharaan data satu kali per tahun, bukan beban alumni tiap pengisian.

Catatan: alasan pertama awalnya saya tulis sebagai dugaan ("UMP kan angka publik, seharusnya bisa dilookup"). Setelah `tracer schema.sql` dibaca lebih teliti, ternyata tabelnya memang sudah ada — jadi keputusan ini terkonfirmasi, bukan sekadar preferensi desain.

### 12.5 Ringkasan penerapan ke mockup

| Langkah | Perubahan |
|---|---|
| Urutan | Cabang Bekerja disusun ulang mengikuti situs resmi — *nama perusahaan* pindah sebelum *tingkat tempat kerja*, `f4` pindah ke setelah jenjang pendidikan |
| Pertanyaan baru | `f502` Ya/Tidak di Informasi Umum · blok kontak atasan (5 field × 2 cabang) · `f14` varian studi lanjut · `f302`/`f303` sebagai Optional · tipe kontrak sebagai Optional |
| Redaksi | Delapan penyesuaian sesuai §12.3 |
| Tidak diadopsi | Pertanyaan UMR — diganti lookup dari tabel referensi |

---

## 13. Pembacaan Ulang Template — Kolom `value` dan Lima Temuan Baru

Setelah menelaah tangkapan layar situs resmi Kemdiktisaintek, kedua template dibuka lagi untuk memeriksa kolom yang sebelumnya belum pernah dianalisis: **`value`** pada tiap opsi jawaban. Hasilnya menambah satu invarian, mengoreksi dua kesimpulan lama, dan memunculkan satu celah data yang belum pernah tercatat.

### 13.1 `value` adalah pengikat untuk opsi yang tidak punya kode

Kolom `value` ternyata punya **dua makna berbeda**, tergantung jenis pertanyaannya:

| Pola | Terjadi pada | Isi `value` | Yang mengikat |
|---|---|---|---|
| Opsi **tanpa** `code` | tipe 1 (pilihan tunggal), tipe 5 (matriks skala) | `1`, `2`, `3`, … berbeda tiap opsi | **`value`** |
| Opsi **dengan** `code` | tipe 8 (pilihan ganda) — hanya `f4` dan `f16` | selalu `1` | **`code`** |

Untuk pilihan ganda, `value = 1` cuma berarti "opsi ini tercentang"; identitas opsinya ada di `code` (`f401`–`f414`, `f1601`–`f1612`). Tapi untuk pilihan tunggal dan matriks skala — yang jumlahnya jauh lebih banyak — **tidak ada kode per opsi sama sekali**. Angka yang mengidentifikasi jawaban adalah `value`.

> ✅ **Terkonfirmasi dari sumber resmi.** Saat bagian ini pertama ditulis, `value` masih dugaan dari pemakaian di template. Data Master resmi Kemdikti kemudian **mencantumkan value tiap opsi secara eksplisit**, dan hasilnya **sama persis** dengan yang ada di `template-lengkap.json` — diperiksa untuk `f8`, `f1101`, `f1201`, `f1001`, `f14`, `f15`, `f5c`, `f5d`, `f18a`, `f301`, dan seluruh skala matriks. Jadi `value` di template **adalah** value yang dikirim ke Dikti, bukan nomor internal aplikasi. Kamus lengkapnya di [Format Pengiriman Data ke Dikti §3](Format-Pengiriman-Data-ke-Dikti.md).
>
> Termasuk kasus yang paling mudah salah: `f1101` memakai value **1, 2, 3, 4, 5, 6, 7** tapi urutan tampilnya 1, 6, 7, 2, 3, 4 — dengan 5 = "Lainnya". Template menyimpannya benar.

**Konsekuensinya ke invarian §7.1:** redaksi tetap bebas, urutan tampil tetap bebas, **tapi pasangan (makna opsi ↔ `value`) tidak boleh bergeser.** Menyusun ulang urutan tampil lalu menomori ulang `value` mengikuti urutan baru akan membalik seluruh data — dan tidak ada satu pun pesan kesalahan yang muncul di layar. Ini kelas kesalahan paling berbahaya karena senyap.

Nilai yang sudah terverifikasi dari `template-lengkap.json`:

**`f8` — status saat ini**

| `value` | Opsi |
|---|---|
| 1 | Bekerja (full time / part time) |
| 2 | Belum memungkinkan bekerja |
| 3 | Wiraswasta (Wirausaha) |
| 4 | Melanjutkan pendidikan |
| 5 | Tidak kerja, tetapi sedang mencari kerja |

Nilai 1, 3, dan 4 adalah pembilang IKU#2. Perhatikan bahwa urutan `value` **bukan** urutan yang enak dibaca manusia — "Belum memungkinkan bekerja" terselip di nomor 2, di antara Bekerja dan Wiraswasta. Justru inilah buktinya bahwa `value` tidak boleh diturunkan dari urutan tampil.

**`f1001` — aktif mencari kerja 4 minggu terakhir**

| `value` | Opsi |
|---|---|
| 1 | Tidak |
| 2 | Tidak, tapi saya sedang menunggu hasil lamaran kerja |
| 3 | Ya, saya akan mulai bekerja dalam 2 minggu ke depan |
| 4 | Ya, tapi saya belum pasti akan bekerja dalam 2 minggu ke depan |

**`f1201` — sumber dana kuliah:** 1 Biaya Sendiri / Keluarga · 2 Beasiswa ADIK · 3 BIDIKMISI · 4 PPA · 5 AFIRMASI · 6 Perusahaan / Swasta

**`f301` — kapan mulai mencari kerja:** 1 Sebelum lulus · 2 Sesudah lulus · 3 Saya tidak mencari kerja

### 13.2 Dua skala berlawanan arah — jebakan untuk dashboard

`f2` dan `f17` sama-sama matriks skala tipe 5 dan berdiri berdampingan di Section 6. Tapi arah skalanya berlawanan:

| Kode | `value = 1` berarti | `value = 5` berarti | Arah |
|---|---|---|---|
| `f2` penekanan metode pembelajaran | **Sangat Besar** | Tidak Sama Sekali | **menurun** — 1 paling positif |
| `f17` tingkat kompetensi | Sangat Rendah | **Sangat Tinggi** | meningkat — 5 paling positif |

Kalau dashboard menghitung rata-rata kedua matriks dengan rumus yang sama, hasil `f2` akan terbalik: prodi yang paling kuat metode pembelajarannya justru tampil paling lemah.

**Tindakan untuk backend dan dashboard:** setiap agregasi atas `f2` harus membalik skala lebih dulu (`6 - value`), atau arah skala disimpan sebagai atribut pertanyaan supaya tidak bergantung pada ingatan siapa pun. Ini catatan perhitungan, tidak berpengaruh ke tampilan pengisian.

Catatan tambahan yang menenangkan: di dalam template, opsi `f2` **diurutkan dari "Tidak Sama Sekali" ke "Sangat Besar"** (yaitu `value` 5 → 1), sedangkan situs resmi menampilkan "Sangat Besar" lebih dulu (1 → 5). Keduanya sah karena `value` melekat ke label, bukan ke posisi. Ini sekaligus **bukti langsung bahwa urutan tampil memang variabel bebas** — bahkan Dikti sendiri tidak konsisten antara file template dan tampilan situsnya. Mockup mengikuti urutan situs resmi.

### 13.3 Pola "gate + isian angka" adalah pola bawaan Dikti

Di situs resmi, pertanyaan nomor 5 berbentuk satu pertanyaan dengan isian angka **di dalam opsi radio**: "Kira-kira `[…]` bulan sebelum lulus" / "…sesudah lulus" / "Saya tidak mencari kerja". Template mengonfirmasi ini secara struktural — tiga entri yang sebenarnya satu pertanyaan:

| Entri | Tipe | Peran |
|---|---|---|
| `f301` | 1 (pilihan tunggal, 3 opsi) | Penentu cabang |
| `f302` | 9 (isian angka) | Nilai untuk opsi "Sebelum lulus" |
| `f303` | 9 (isian angka) | Nilai untuk opsi "Sesudah lulus" |

**Pola yang sama berlaku untuk `f502`** — gate Ya/Tidak (tipe 1) berpasangan dengan isian bulan (tipe 9). Dan `value` gate-nya membuktikan itu:

| Opsi `f502` gate | `value` |
|---|---|
| Ya | `0` |
| Tidak | `null` |

Tidak ada yang bernilai 1 atau 2. Dibaca sebagai pertanyaan pilihan tunggal biasa, angka ini tidak masuk akal — itu sebabnya `value` `f502` masuk daftar keanehan yang belum terjawab.

Dibaca sebagai **satu field masa tunggu**, semuanya cocok dan sangat rapi:

- **"Ya" → `value = 0`** artinya masa tunggunya **nol bulan**. Alumni yang sudah bekerja sebelum lulus memang tidak menunggu sama sekali.
- **"Tidak" → `value = null`** artinya tidak ada nilai di opsi ini; nilainya diambil dari **isian bulan** di sebelahnya.

Jadi `f502` adalah **satu field Dikti dengan gate**, persis seperti nomor 5 di situs resmi — dan angka `0` itu bukan kode internal, melainkan jawaban sesungguhnya. Keputusan sebelumnya yang menampilkan gate dan isian bulan sebagai dua pertanyaan terpisah — begitu pula `f302`/`f303` sebagai dua Optional terpisah — salah di level struktur, bukan cuma soal tampilan.

### 13.4 Hipotesis kolom `number` — diuji, lalu gugur

§12.2 sudah menyimpulkan bahwa `number` tidak bisa dipakai sebagai kunci urut. Muncul hipotesis yang lebih kuat: `number` adalah **nomor pertanyaan pada formulir resmi Dikti**, dan field yang berbagi nomor sama adalah bagian dari satu pertanyaan majemuk. Dua bukti mendukungnya:

- `f6`, `f7`, `f7a` sama-sama `number = 4` di dalam satu section — tiga isian di bawah satu butir formulir.
- `f17` A dan B sama-sama `number = 14` di template lengkap, dan situs resmi memang menampilkannya sebagai **satu** tabel gabungan.

Tapi tiga bukti membantahnya:

- Situs resmi menampilkan `f6`, `f7`, `f7a` sebagai **tiga pertanyaan bernomor terpisah** (7, 8, 9). Jadi berbagi `number` tidak berarti digabung.
- Di Section 1, `f1201` dan gate `f502` sama-sama `number = 1`; isian `f502` dan `f8` sama-sama `number = 2`; lalu `f1001` melompat ke 5 tanpa ada isi di 3 dan 4.
- Template pddikti memberi `f17` A/B nomor 14 dan 15, sedangkan lengkap memberi 14 dan 14. Dua template tidak sepakat soal field yang sama.

**Kesimpulan:** `number` menyimpan sisa penomoran dari formulir asal, tapi sudah rusak oleh penyuntingan template. Jangan dipakai untuk apa pun — bukan kunci urut, bukan penanda penggabungan, bukan rujukan formulir yang bisa dipercaya.

Sekaligus terjawab: **urutan tampil situs resmi tidak bisa direkonstruksi dari template.** Urutan array Section 2 memang kebetulan sama dengan urutan situs nomor 5–11 (`f301`, `f302`, `f303`, `f4`, `f6`, `f7`, `f7a`, `f16`), tapi Section 1 dan 6 tidak — `f1001` ada di Section 1 padahal tampil di nomor 10, dan `f2` mendahului `f17` di array padahal di layar urutannya terbalik. Urutan tampil adalah **milik aplikasi**, bukan milik template. Ini memperkuat kebebasan kita menyusun urutan sendiri.

### 13.5 `f5c` hilang dari cabang Bekerja

Kode `f5c` (posisi / jabatan) hanya muncul **satu kali** di masing-masing template, yaitu di cabang **Wiraswasta** ("Apa posisi / jabatan Anda saat ini?"). Alumni yang bekerja **tidak pernah ditanya jabatannya sendiri** — padahal ia ditanya nama atasan, jabatan atasan, nomor telepon atasan, email atasan, dan alamat perusahaan.

Ini kemungkinan besar kelalaian penyusunan template, bukan desain yang disengaja. Dampaknya nyata: laporan CDC yang ingin menampilkan "jabatan alumni" tidak punya sumber data untuk kelompok responden **terbesar**.

Dua pilihan: (a) tampilkan `f5c` juga di cabang Bekerja, atau (b) biarkan dan terima keterbatasan laporan.

**Usul: ambil (a).** Memakai kode yang sudah ada di cabang lain bukan penambahan opsi berkode baru, jadi tidak menyentuh invarian §7.1 — maknanya identik ("jabatan responden"), hanya konteks cabangnya berbeda, dan template sendiri sudah memakai ulang 16 kode antar cabang (§4). Risikonya nol, manfaat laporannya besar.

### 13.6 Perbedaan `is_required` antar cabang

Temuan sampingan yang berpengaruh ke aturan tier: **`is_required` bukan properti global sebuah kode, melainkan properti per-instance.** `f4` (cara mencari pekerjaan) bernilai `true` di cabang Bekerja tapi `false` di cabang Belum Bekerja. Kode yang sama, kewajiban yang berbeda.

Artinya aturan tier di §7 perlu dibaca per cabang, bukan per kode. Ini juga penjelasan yang mungkin untuk kenapa `f4` di situs resmi tidak bertanda `*` — tampilan flat "Kuesioner Wajib" di sana belum memilih cabang, jadi validasinya belum aktif.

### 13.7 Ringkasan koreksi terhadap kesimpulan lama

| Bagian | Kesimpulan lama | Setelah pembacaan ulang |
|---|---|---|
| §7.1 invarian | Yang mengikat adalah `code` | `code` **atau** `value`, tergantung jenis pertanyaan. Opsi tanpa kode diikat oleh `value` |
| §8, §12.5 — `f302` / `f303` | Dua pertanyaan Optional terpisah | Bagian dari satu pertanyaan bersama `f301`; pola sama untuk `f502` |
| §12.2 — kolom `number` | Tidak bisa dipakai sebagai kunci urut | Tidak bisa dipakai untuk apa pun; hipotesis "nomor formulir resmi" diuji dan gugur |
| §10.3 — matriks kompetensi A/B | Penggabungan A/B adalah keputusan UX kami | Situs resmi memang menggabungkannya, dan template lengkap memberi keduanya `number` yang sama. Rasionalisasi lama perlu diperbaiki |
| §12.3 — `f1001` | Pakai redaksi pddikti | Situs resmi memuat "Pilihlah satu jawaban" — redaksi **lengkap** yang benar |
| §7 — aturan tier | `is_required` per kode | `is_required` per **instance per cabang** |
| — | — | **Baru:** `f5c` tidak ada di cabang Bekerja |
| — | — | **Baru:** arah skala `f2` berlawanan dengan `f17` |

### 13.8 Yang masih belum terjawab

- **Semantik `is_required`** — "wajib diisi responden" atau "wajib ada di template". Sekarang lebih condong ke yang pertama karena nilainya berbeda antar cabang (§13.6), tapi belum dikonfirmasi tim backend. Data Master resmi tidak memuat kolom wajib/tidak, jadi ini tetap terbuka.
- **Tipe jawaban 3 dan 4** tidak terpakai di template mana pun, jadi maknanya tetap tidak diketahui.
- **Redaksi `f1763` / `f1764`** — lengkap menulis "Keahlian berdasarkan bidang ilmu **(profesionalisme)**", pddikti tanpa tambahan itu. Data Master resmi menulis **tanpa** tambahan itu, jadi pddikti yang lebih dekat. Karena ini murni diksi, tidak ada dampaknya.
- **Mekanisme transport pengiriman** — bentuk kolomnya sudah jelas, tapi apakah lewat unggah berkas, API, atau isian manual belum terverifikasi. Lihat [Format Pengiriman §8](Format-Pengiriman-Data-ke-Dikti.md).

**Dua hal sudah terjawab dan dipindahkan keluar dari daftar ini:**

| Sebelumnya belum diketahui | Sekarang |
|---|---|
| Apakah `value` benar-benar yang dikirim ke Dikti | **Ya.** Terkonfirmasi dari Data Master resmi, dan sama persis dengan template — lihat §13.1 |
| `value` `f502` "Ya" = `0` dan "Tidak" = `null` terasa aneh | **Terjawab.** `f502` adalah **satu kolom** masa tunggu: `0` bila sebelum lulus, angka bulan bila sesudah. Data Master menuliskannya "Ya (0) / Tidak (Free Text)" — lihat [Format Pengiriman §2.1](Format-Pengiriman-Data-ke-Dikti.md) |

---

## 14. Penerapan Temuan Situs Resmi ke Mockup

Bagian ini mencatat apa yang benar-benar diubah setelah §13, beserta tiga keputusan yang membalik kesepakatan sebelumnya.

### 14.1 Yang diubah

| Perubahan | File | Alasan |
|---|---|---|
| `f301` + `f302` + `f303` jadi **satu pertanyaan** dengan isian angka di dalam opsi, di ketiga cabang (Bekerja, Wiraswasta, Belum Bekerja) | `simulasi-pengisian.html`, `kuesioner.html` | Bentuk resmi (§13.3) |
| `f502` gate + isian bulan jadi **satu pertanyaan**: "Ya, sebelum lulus" / "Tidak — kira-kira … bulan setelah lulus" | `simulasi-pengisian.html`, `kuesioner.html` | Bentuk resmi, dan `value = 0` pada "Ya" memang berarti masa tunggu nol bulan (§13.3) |
| Kolom matriks `f2` dibalik: kolom 1 sekarang **"Sangat Besar"**, kolom 5 "Tidak Sama Sekali" | `simulasi-pengisian.html` | Mockup sebelumnya memasangkan angka 1 dengan "Tidak sama sekali" — **berlawanan dengan `value` template**. Ini bug pemetaan senyap yang akan membalik seluruh analisis metode pembelajaran (§13.1, §13.2) |
| Kartu keterangan arah skala ditambahkan di bawah dua matriks | `simulasi-pengisian.html` | Mencegah Admin CDC "membetulkan" urutan kolom yang sebenarnya sudah benar |
| `f5c` (posisi / jabatan) ditambahkan ke cabang **Bekerja** — **tapi tidak dikirim ke Dikti**, lihat §15.6 | `simulasi-pengisian.html`, `kuesioner.html`, `alumni-detail.html` | Menutup celah §13.5 |
| Titik hitung `f6` / `f7` / `f7a` di cabang Bekerja diubah menjadi **"sebelum Anda memperoleh pekerjaan pertama"** | `simulasi-pengisian.html`, `kuesioner.html` | Lihat §14.2 |
| Blok Identitas dilengkapi **NIK, NPWP, Kode Perguruan Tinggi, Kode Program Studi** | `simulasi-pengisian.html` | Empat kolom ini ada di halaman Identitas situs resmi tapi belum pernah masuk mockup |
| Snapshot G1: dua baris masa tunggu digabung jadi satu, ditambah baris jabatan | `alumni-detail.html` | Mengikuti bentuk pertanyaan yang baru; sebelumnya menampilkan "bekerja sebelum lulus = Ya" **dan** "masa tunggu = 4 bulan" sekaligus, yang saling bertentangan |
| Redaksi "Kapan **anda** mulai merencanakan berwiraswasta" → "**Anda**" | `simulasi-pengisian.html`, `kuesioner.html` | Kapitalisasi |

### 14.2 `f6` — satu-satunya perubahan yang mengubah arti data

Situs resmi menulis: "Berapa perusahaan / instansi / institusi yang sudah Anda lamar **(lewat surat atau e-mail) sebelum anda memeroleh pekerjaan pertama**?" Kedua template menulis "**sampai saat ini**".

Ini bukan selisih diksi. Dua rumusan itu mengukur hal berbeda, dan angkanya tidak sebanding: alumni yang sudah tiga tahun bekerja bisa melamar puluhan lowongan lain "sampai saat ini" tanpa itu berkaitan dengan pencarian kerja pertamanya.

**Keputusan:** di cabang **Bekerja**, ketiga pertanyaan (`f6`, `f7`, `f7a`) memakai titik hitung "sebelum memperoleh pekerjaan pertama", mengikuti situs resmi. Di cabang **Belum Bekerja**, ketiganya tetap "sampai saat ini", karena di sana belum ada pekerjaan pertama yang bisa jadi titik hitung.

Titik hitung `f7` dan `f7a` disamakan dengan `f6` per cabang, meskipun tangkapan situs resmi untuk kedua pertanyaan itu tidak tersedia. Alasannya: tiga angka ini dibaca sebagai satu corong (dilamar → merespons → mewawancarai). Kalau titik hitungnya berbeda, angka respons bisa melebihi angka lamaran dan corongnya jadi tidak terbaca.

### 14.3 `f4` dan `f1001` tetap Core

Sempat muncul keraguan: di situs resmi hanya nomor 1, 2, dan 3 yang bertanda `*`, sedangkan `f4` dan `f1001` tidak bertanda wajib — padahal template menandainya `is_required: true`. Pertimbangan untuk menurunkan keduanya ke Optional akhirnya **ditolak**, karena temuan §13.6 memberi penjelasan yang lebih masuk akal:

`is_required` berbeda antar cabang. `f4` wajib di cabang Bekerja tapi tidak wajib di cabang Belum Bekerja. Halaman "Kuesioner Wajib" yang tertangkap di situs resmi adalah tampilan **sebelum cabang dipilih**, jadi validasi per cabang belum aktif dan tanda `*` belum muncul. Tanda wajib di sana kemungkinan hanya menandai pertanyaan yang wajib **untuk semua cabang tanpa kecuali**.

Selama penjelasan ini belum dibantah, `f4` dan `f1001` tetap Core. Kalau nanti tim backend mengonfirmasi arti `is_required` yang berbeda, keputusan ini yang pertama perlu ditinjau ulang.

### 14.4 Enam selisih diksi yang sengaja **tidak** diikuti

Setelah terbukti bahwa yang mengikat adalah kode dan `value` — bukan teks — menyalin redaksi situs resmi kata per kata kehilangan nilainya. Situs resmi juga tidak lebih rapi dari file templatnya. Enam selisih berikut dibiarkan memakai redaksi template:

| Kode | Situs resmi | Dipakai di produk | Alasan |
|---|---|---|---|
| `f1201` | "Sebutkan sumberdana dalam pembiayaan kuliah?" | "Sumber dana apa yang Anda gunakan untuk membiayai kuliah?" | "sumberdana" salah tulis, dan bentuk "Sebutkan …?" mencampur perintah dengan tanya |
| `f17` B | "…diperlukan dalam **pekerjaan**?" | "…pekerjaan **/ studi lanjut Anda**?" | Produk kami menanyakan matriks ini juga ke alumni yang melanjutkan kuliah. Redaksi situs resmi akan membingungkan mereka |
| `f17` baris 7 | "Pengembangan" | "Pengembangan Diri" | "Pengembangan" saja tidak bermakna lengkap |
| `f8` opsi 3 | "Wiraswasta" | "Wiraswasta (Wirausaha)" | Tambahan "(Wirausaha)" membantu alumni yang tidak familiar dengan istilah pertama |
| `f1763` / `f1764` | tidak terbaca dari tangkapan | "Keahlian berdasarkan bidang ilmu (profesionalisme)" | Mengikuti template lengkap, konsisten dengan pemilihan basis di §12.1 |

Satu selisih **diikuti**: label skala 4 pada `f2` memakai "Kurang Besar" seperti situs resmi, bukan "Kurang" seperti template — karena berpasangan lebih jelas dengan "Cukup Besar" di sebelahnya. `value`-nya tetap 4.

Yang penting dicatat: **daftar ini bisa berubah bebas tanpa memengaruhi keabsahan laporan.** Redaksi dikunci di produk atas dasar komparabilitas antar-PT (§7.2), bukan karena Dikti mencocokkan teks.

### 14.5 Yang belum dikerjakan

- **Tabel Master** (`Tabel-Master-Pertanyaan-Tracer-Study.md`) digenerate dari JSON, jadi isinya masih memotret template apa adanya. Temuan §13–§14 dicatat sebagai lampiran di dokumen itu, bukan dengan mengubah angka hasil generate — supaya tetap bisa dibandingkan dengan sumbernya.
- **Perhitungan pembalikan skala `f2`** baru dicatat sebagai persyaratan; belum ada mockup dashboard yang menampilkannya.
- **Sisi Kemenkes** masih menunggu tangkapan layar situs resminya (daftar yang dibutuhkan ada di `Komparasi` §5.1).

---

## 15. Verifikasi Kelima Cabang di Situs Resmi

Sampai §14, pengetahuan kita tentang isi tiap cabang berasal dari **file template** dan satu tangkapan cabang Bekerja. Bagian ini mencatat hasil pengisian **kelima status** langsung di situs resmi, plus dua lampiran resmi dari admin panel.

### 15.1 Sumber yang dipakai

| Sumber | Isi | Letak di repo |
|---|---|---|
| Tangkapan 5 cabang | Redaksi persis + urutan tampil untuk tiap status `f8` | `karirlink/docs/jawaban tracer study lulusan/*.md` |
| Panduan Form 2024 | Kode + value tiap opsi, 21 pertanyaan | `…/Tracerstudy Kemendikbudristek - … [TERBARU 2024 …].md` |
| Panduan Form 2023 | Versi lama, memuat `f504` yang sudah dihapus | `…/Tracerstudy Kemendikbudristek Form.md` |
| **Data Master Pertanyaan** | **86 kolom pengiriman + value resmi** | `…/Data Master Pertanyaan.html` |
| **Data Master Lokasi Kerja** | **Kode numerik provinsi & kab/kota** | `…/Data Master Lokasi Kerja.html` |

Dua yang terakhir adalah lampiran resmi menu **Panduan Form** dan menjadi dasar dokumen [Format Pengiriman Data ke Dikti](Format-Pengiriman-Data-ke-Dikti.md).

### 15.2 Matriks cabang

Matriks lengkapnya ada di [Format Pengiriman §5.1](Format-Pengiriman-Data-ke-Dikti.md). Ringkasannya:

| Cabang | Jumlah pertanyaan | Blok eksklusif |
|---|---|---|
| Bekerja | 19 | `f502`, `f505`, `f5a1`, `f5a2`, `f1101`, `f5b`, `f14`, `f15` (+`f5d` bersama Wiraswasta) |
| Wiraswasta | 13 | `f5c` (+`f5d`) |
| Melanjutkan Pendidikan | 12 | `f18a`–`f18d` |
| Tidak kerja, tetapi sedang mencari kerja | 11 | tidak ada |
| Belum memungkinkan bekerja | 11 | tidak ada |

Sepuluh blok muncul di **semua** cabang: `f1201`, `f17`, `f2`, `f301`–`f303`, `f4`, `f6`, `f7`, `f7a`, `f1001`, `f16`.

### 15.3 Tiga koreksi terhadap dugaan kita sebelumnya

**Cabang "Belum memungkinkan bekerja" bukan langsung ke Tingkat Kompetensi.** §10.1 dan §10.2 menggambarkan status ini melompat ke bagian 6 mengikuti `jump_to: 5` di template. Di situs resmi, alumni ini justru melewati 11 pertanyaan — sama banyak dengan cabang "Tidak kerja, mencari". Bagan alur di §10.1 karena itu **menggambarkan template, bukan situs resmi**.

**Cabang Wiraswasta jauh lebih ringkas daripada yang template gambarkan.** Template Section 3 memuat `f505`, `f5a1`, `f5a2`, `f1101`, `f5b`, `f14`, `f15`. Situs resmi **tidak menampilkan satu pun** dari ketujuhnya — hanya `f5c` dan `f5d` yang eksklusif di sana. Artinya alumni wiraswasta di situs resmi tidak pernah ditanya pendapatan maupun lokasi usahanya, sehingga **IKU#2 tidak bisa dihitung penuh** untuk kelompok ini dari data situs resmi.

**Cabang Melanjutkan Pendidikan tidak menampilkan `f14`.** Template lengkap punya varian `f14` untuk cabang ini ("Seberapa erat hubungan antara bidang studi dengan pendidikan Anda?") dan kita mengadopsinya di §12.1. Situs resmi tidak menampilkannya. Ini tetap kita pertahankan sebagai tambahan — kodenya sudah ada dan maknanya sejalan, jadi tidak melanggar invarian §7.1.

### 15.4 Konsekuensi: situs resmi menampilkan pertanyaan yang tidak relevan

Sepuluh blok universal itu termasuk `f4`, `f6`, `f7`, `f7a`, dan `f16`. Artinya alumni berstatus **"Belum memungkinkan bekerja"** di situs resmi tetap ditanya:

- "Berapa perusahaan yang sudah Anda lamar **sebelum memeroleh pekerjaan pertama**?"
- "Jika menurut anda **pekerjaan anda saat ini** tidak sesuai dengan pendidikan anda, mengapa anda mengambilnya?"

Kedua pertanyaan itu mengandaikan alumni punya pekerjaan. Ini **cacat relevansi di sisi situs resmi**, bukan pola yang perlu ditiru.

**Keputusan: produk kita tetap menyaring per cabang.** Kolomnya tetap ada di format pengiriman dan tinggal dikirim kosong — hasil akhirnya sama dengan alumni yang membiarkannya kosong di situs resmi. Yang berbeda hanya alumni kita tidak dibuat bingung.

Ini juga menjawab keluhan yang memicu telaah ini: KarirLink versi berjalan menampilkan pertanyaan masa tunggu dan pendapatan **tanpa syarat**, sehingga alumni yang belum bekerja tetap melihatnya. Perbaikannya bukan meniru situs resmi, tapi menyaring lebih tegas daripada situs resmi.

### 15.5 Perbandingan tiga versi sumber Kemdikti

| Aspek | Panduan 2023 | Panduan 2024 | Situs resmi terkini |
|---|---|---|---|
| Kode gate masa tunggu | `f504` + `f502` | `f502` saja | `f502` saja |
| Jumlah pertanyaan dalam panduan | 20 | 21 | 19 (cabang Bekerja) |
| Kode teks "Lainnya" `f4` | `f4016` | `f416` | — |
| Kode teks "Lainnya" `f1101` | `f1101` | `f1102` | — |
| Copyright | 2023 | 2024 | Kemdiktisaintek |

**Panduan 2024 adalah yang berlaku.** `f504` dan `f4016` adalah artefak versi lama; jangan diimplementasikan. Data Master yang kita pakai sebagai dasar §3 Format Pengiriman konsisten dengan panduan 2024.

### 15.6 `f5c` di cabang Bekerja: ditanyakan, disimpan, tidak dikirim

§13.5 mengusulkan menambahkan `f5c` (posisi/jabatan) ke cabang Bekerja karena format resmi hanya menaruhnya di Wiraswasta, sehingga jabatan alumni yang bekerja tidak pernah terekam. Penambahan itu sudah diterapkan (§14.1).

Data Master resmi kemudian memperjelas satu hal yang sebelumnya tidak terlihat. Pertanyaan itu dituliskan bersyarat secara eksplisit:

> "Bila berwiraswasta, apa posisi/jabatan Anda saat ini? **(Apabila 1 Menjawab [3] wiraswasta)**"

Jadi Dikti mengharapkan kolom `f5c` terisi **hanya** bila `f8` = 3. Kolomnya memang tetap ada di format pengiriman untuk semua baris, sehingga data kita secara teknis akan diterima. Tapi bila Dikti melakukan validasi silang `f8` × `f5c`, baris kita bisa ditandai anomali — dan anomali yang tidak perlu adalah risiko tanpa imbalan.

**Keputusan yang berlaku:**

| `f8` | Ditanyakan ke alumni? | Disimpan di basis data PT? | Dikirim ke Dikti? |
|---|---|---|---|
| 3 · Wiraswasta | Ya | Ya | **Ya** |
| 1 · Bekerja | Ya | Ya | **Tidak** — kolom `f5c` dikirim kosong |
| lainnya | Tidak | — | Tidak |

Kebutuhan laporan CDC tetap terpenuhi karena jawabannya tersimpan; risiko pengirimannya nol karena tidak ikut terkirim. Pola ini sama dengan blok kontak atasan (`k1`, `k2`, dan tiga field tanpa kode): ditanyakan, disimpan, tidak dikirim.

Kartu keterangan di `simulasi-pengisian.html` perlu menyebutkan ini supaya Admin CDC tidak menyangka jabatan alumni yang bekerja ikut dilaporkan.
