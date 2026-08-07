# Format Pengiriman Data Tracer Study ke Kemdiktisaintek

> **Untuk siapa dokumen ini?** Backend developer KarirLink. Ini spesifikasi **lapisan pengiriman** — bentuk data saat dikirim ke sistem pelaporan nasional, bukan bentuk pertanyaan di antarmuka. Untuk pertanyaan dan opsinya, lihat [Tabel Master](Tabel-Master-Pertanyaan-Tracer-Study.md); untuk aturan tier dan keputusan desain, lihat [Mapping Kode Dikti](Mapping-Kode-Dikti-Tracer-Study.md).

**Sumber:** `Data Master Pertanyaan.html` dan `Data Master Lokasi Kerja.html` — dua lampiran resmi dari menu **Panduan Form** di admin panel `tracerstudy.kemdikbud.go.id`. Keduanya ada di `karirlink/docs/jawaban tracer study lulusan/`.

Dokumen ini menutup ketidaktahuan yang sebelumnya tercatat di [Mapping §13.8](Mapping-Kode-Dikti-Tracer-Study.md): `tracer schema.sql` tidak punya tabel upload/ekspor, jadi mekanisme pengiriman tidak bisa diverifikasi dari repo. Sekarang bisa — spesifikasinya datang dari sisi Dikti.

---

## 1. Bentuk pengiriman: satu baris per alumni, 86 kolom

Pengiriman berbentuk **tabel datar**. Satu alumni = satu baris. Tidak ada nesting, tidak ada array. Semua percabangan sudah "diratakan": kolom yang tidak relevan untuk cabang tertentu dikirim **kosong**.

| Kelompok | Jumlah kolom | Isi |
|---|---|---|
| Identitas | 9 | Kode PT, Kode Prodi, NIM, Nama, HP, Email, Tahun Lulus, NIK, NPWP |
| Jawaban berkode | 77 | `f8` sampai `f1614` |
| **Total** | **86** | |

Rincian 77 kolom berkode:

| Blok | Kolom | Jumlah |
|---|---|---|
| Status & pekerjaan | `f8`, `f502`, `f505`, `f5a1`, `f5a2`, `f1101`, `f1102`, `f5b`, `f5c`, `f5d` | 10 |
| Studi lanjut | `f18a`, `f18b`, `f18c`, `f18d` | 4 |
| Sumber dana kuliah | `f1201`, `f1202` | 2 |
| Keeratan & jenjang | `f14`, `f15` | 2 |
| Kompetensi A & B | `f1761`–`f1774` | 14 |
| Metode pembelajaran | `f21`–`f27` | 7 |
| Kapan mulai mencari kerja | `f301`, `f302`, `f303` | 3 |
| Cara mencari pekerjaan | `f401`–`f416` | 16 |
| Proses lamaran | `f6`, `f7`, `f7a` | 3 |
| Aktif mencari kerja | `f1001`, `f1002` | 2 |
| Alasan kerja tidak sesuai | `f1601`–`f1614` | 14 |

---

## 2. Tiga temuan yang mengubah cara kita menyimpan data

### 2.1 `f502` adalah SATU kolom, dan angka 0 punya arti

Panduan resmi mencantumkan opsi `f502` sebagai: **Ya (0)** / **Tidak (Free Text)**.

Artinya satu kolom `f502` menampung dua kemungkinan:

| Kondisi alumni | Nilai yang dikirim |
|---|---|
| Sudah mendapat pekerjaan / melanjutkan studi **sebelum lulus** | `0` |
| Baru mendapat **setelah lulus** | angka bulan, mis. `3`, `12`, `999` |
| Belum mendapat sama sekali (status Belum Bekerja / Mencari Kerja) | kosong |

Tidak ada kolom gate Ya/Tidak terpisah. Bentuk gabungan di mockup (`"Ya, sebelum lulus"` / `"Tidak — kira-kira [4] bulan setelah lulus"`) **tepat memetakan** ke kolom tunggal ini.

> **Catatan sejarah.** Versi panduan 2023 memuat kode `f504` untuk pertanyaan gate "Apakah Anda telah mendapatkan pekerjaan <= 6 bulan / termasuk bekerja sebelum lulus?". Kode itu **sudah dihapus** di panduan 2024 dan tidak ada di Data Master. Jangan diimplementasikan.

### 2.2 Setiap "Lainnya" butuh DUA kolom: penanda dan teks

Ini temuan yang paling mudah terlewat, dan akibatnya jawaban alumni hilang tanpa jejak.

| Pertanyaan | Kolom penanda | Kolom teks | Isi kolom penanda |
|---|---|---|---|
| `f1101` jenis perusahaan | `f1101` = `5` | **`f1102`** | value 5 = "Lainnya, tuliskan" |
| `f1201` sumber dana kuliah | `f1201` = `7` | **`f1202`** | value 7 = "Lainnya, tuliskan" |
| `f1001` aktif mencari kerja | `f1001` = `5` | **`f1002`** | value 5 = "Lainnya" |
| `f4` cara mencari pekerjaan | **`f415`** = `1` | **`f416`** | kolom biner tersendiri |
| `f16` alasan tidak sesuai | **`f1613`** = `1` | **`f1614`** | kolom biner tersendiri |

**Koreksi terhadap dokumen kita sebelumnya.** `Mapping` §1 dan `Tabel Master` §1 menyebut `f415` dan `f1613` sebagai "kode isian Lainnya". Itu keliru separuh: keduanya adalah **penanda tercentang**, dan teksnya ada di kolom yang belum pernah kita catat — `f416` dan `f1614`.

Untuk pilihan tunggal (`f1101`, `f1201`, `f1001`), "Lainnya" bukan kolom tersendiri melainkan salah satu `value` pada kolom utamanya, dengan teks di kolom pendamping.

**Konsekuensi ke penyimpanan:** kolom `is_other_dikti_code` di `quest_questions` hanya menyimpan satu kode. Untuk `f4` dan `f16`, itu cukup menyimpan penandanya (`f415`, `f1613`), tapi **tidak ada tempat** untuk kode teksnya. Perlu satu kolom tambahan, atau konvensi turunan (kode teks = kode penanda + 1).

### 2.3 Pilihan ganda dan matriks jadi satu kolom per baris

Tidak ada kolom yang menampung daftar. Semuanya dipecah:

| Jenis | Bentuk pengiriman |
|---|---|
| `f4` (pilihan ganda, 14 opsi + Lainnya) | 15 kolom biner `f401`–`f415`, masing-masing `0` atau `1`, plus `f416` teks |
| `f16` (pilihan ganda, 12 opsi + Lainnya) | 13 kolom biner `f1601`–`f1613`, plus `f1614` teks |
| `f17` (matriks kompetensi 7 baris × 2 kolom) | 14 kolom `f1761`–`f1774`, masing-masing berisi skala 1–5 |
| `f2` (matriks metode pembelajaran 7 baris) | 7 kolom `f21`–`f27`, masing-masing berisi skala 1–5 |

Penomoran `f17`: **ganjil = kolom A** (saat lulus), **genap = kolom B** (dibutuhkan sekarang). `f1761` Etika-A, `f1762` Etika-B, `f1763` Keahlian-A, dan seterusnya.

Inilah alasan struktural di balik invarian "jumlah opsi berkode tidak boleh dikurangi atau digabung" ([Mapping §7.1](Mapping-Kode-Dikti-Tracer-Study.md)): setiap opsi adalah **satu kolom** di format pengiriman. Menghapus opsi berarti mengosongkan kolom yang formatnya tetap menuntut ada.

---

## 3. Kamus kolom lengkap

### 3.1 Identitas (9 kolom)

| Kolom | Nama di panduan | Tipe | Catatan |
|---|---|---|---|
| Kode Pt | `kdptimsmh` | teks | Kode Perguruan Tinggi, mis. `041008` |
| Kode Prodi | `kdpstmsmh` | teks | mis. `70201` |
| Nomor Mhs | `nimhsmsmh` | teks | NIM / NPM |
| Nama | `nmmhsmsmh` | teks | Nama alumni |
| Hp | `telpomsmh` | teks | Simpan sebagai **teks**, bukan angka — nol depan tidak boleh hilang |
| Email | `emailmsmh` | teks | |
| Tahun Lulus | `tahun_lulus` | angka | mis. `2023` |
| NIK | `nik` | teks | 16 digit. Simpan sebagai teks |
| NPWP | `npwp` | teks | Boleh kosong |

### 3.2 Status dan pekerjaan

| Kolom | Tipe | Value | Muncul untuk status |
|---|---|---|---|
| `f8` | pilihan | 1 Bekerja · 2 Belum memungkinkan bekerja · 3 Wiraswasta · 4 Melanjutkan Pendidikan · 5 Tidak kerja tetapi sedang mencari kerja | semua |
| `f502` | angka | `0` = sebelum lulus · angka bulan = setelah lulus | Bekerja, Wiraswasta, Melanjutkan Pendidikan |
| `f505` | angka | bebas (rupiah, tanpa pemisah) | Bekerja, Wiraswasta |
| `f5a1` | kode wilayah | 5–6 digit, lihat §4 | Bekerja, Wiraswasta |
| `f5a2` | kode wilayah | 5–6 digit, lihat §4 | Bekerja, Wiraswasta |
| `f1101` | pilihan | 1 Intansi pemerintah · 2 Organisasi non-profit/LSM · 3 Perusahaan swasta · 4 Wiraswasta/perusahaan sendiri · **5 Lainnya** · 6 BUMN/BUMD · 7 Institusi/Organisasi Multilateral | Bekerja |
| `f1102` | teks | isian bebas bila `f1101` = 5 | Bekerja |
| `f5b` | teks | nama perusahaan/kantor | Bekerja, Wiraswasta |
| `f5c` | pilihan | 1 Founder · 2 Co-Founder · 3 Staff · 4 Freelance/Kerja Lepas | **hanya Wiraswasta** — lihat §5.2 |
| `f5d` | pilihan | 1 Lokal/Wilayah/Wiraswasta tidak berbadan hukum · 2 Nasional/Wiraswasta berbadan hukum · 3 Multinasional/Internasional | Bekerja, Wiraswasta |

Perhatikan **urutan `value` `f1101` tidak berurutan dengan urutan tampil.** Nomor 5 adalah "Lainnya", sedangkan BUMN/BUMD dan Multilateral memakai 6 dan 7. Ini sudah dikonfirmasi sama antara panduan resmi dan `template-lengkap.json` — jangan disusun ulang.

### 3.3 Studi lanjut

| Kolom | Tipe | Value |
|---|---|---|
| `f18a` | pilihan | 1 Biaya Sendiri · 2 Beasiswa |
| `f18b` | teks | Perguruan Tinggi tujuan |
| `f18c` | teks | Program Studi |
| `f18d` | tanggal | format `dd/mm/yyyy` |

Keempatnya hanya untuk status **Melanjutkan Pendidikan**.

### 3.4 Sumber dana kuliah

| Kolom | Tipe | Value |
|---|---|---|
| `f1201` | pilihan | 1 Biaya Sendiri/Keluarga · 2 Beasiswa ADIK · 3 Beasiswa BIDIKMISI · 4 Beasiswa PPA · 5 Beasiswa AFIRMASI · 6 Beasiswa Perusahaan/Swasta · **7 Lainnya** |
| `f1202` | teks | isian bebas bila `f1201` = 7 |

Ditanyakan ke **semua status**. Keterangan resmi: "bukan ketika Studi Lanjut" — yang dimaksud adalah dana kuliah yang baru diselesaikan, bukan dana studi lanjut.

### 3.5 Keeratan dan jenjang

| Kolom | Tipe | Value |
|---|---|---|
| `f14` | pilihan | 1 Sangat Erat · 2 Erat · 3 Cukup Erat · 4 Kurang Erat · 5 Tidak Sama Sekali |
| `f15` | pilihan | 1 Setingkat Lebih Tinggi · 2 Tingkat yang Sama · 3 Setingkat Lebih Rendah · 4 Tidak Perlu Pendidikan Tinggi |

### 3.6 Kompetensi (14 kolom, skala 1–5)

Skala seragam: **1 Sangat Rendah · 2 Rendah · 3 Cukup · 4 Tinggi · 5 Sangat Tinggi**

| Aspek | Kolom A (saat lulus) | Kolom B (dibutuhkan sekarang) |
|---|---|---|
| Etika | `f1761` | `f1762` |
| Keahlian berdasarkan bidang ilmu | `f1763` | `f1764` |
| Bahasa Inggris | `f1765` | `f1766` |
| Penggunaan Teknologi Informasi | `f1767` | `f1768` |
| Komunikasi | `f1769` | `f1770` |
| Kerja sama tim | `f1771` | `f1772` |
| Pengembangan | `f1773` | `f1774` |

### 3.7 Metode pembelajaran (7 kolom, skala 1–5)

Skala seragam: **1 Sangat Besar · 2 Besar · 3 Cukup Besar · 4 Kurang Besar · 5 Tidak Sama Sekali**

| Metode | Kolom |
|---|---|
| Perkuliahan | `f21` |
| Demonstrasi | `f22` |
| Partisipasi dalam proyek riset | `f23` |
| Magang | `f24` |
| Praktikum | `f25` |
| Kerja Lapangan | `f26` |
| Diskusi | `f27` |

> ⚠️ **Arah skala berlawanan dengan kompetensi.** Di sini `1` berarti paling positif; di kompetensi `5` yang paling positif. Setiap agregasi atas `f21`–`f27` harus membalik skala lebih dulu (`6 - value`). Lihat [Mapping §13.2](Mapping-Kode-Dikti-Tracer-Study.md).

### 3.8 Kapan mulai mencari pekerjaan (3 kolom)

| Kolom | Tipe | Value |
|---|---|---|
| `f301` | pilihan | 1 Sebelum lulus · 2 Sesudah lulus · 3 Saya tidak mencari kerja |
| `f302` | angka | jumlah bulan **sebelum** lulus — diisi bila `f301` = 1 |
| `f303` | angka | jumlah bulan **sesudah** lulus — diisi bila `f301` = 2 |

Satu pertanyaan di antarmuka, tiga kolom di pengiriman. Bila `f301` = 3, keduanya kosong.

> **Catatan validasi.** Situs resmi tidak mencegah alumni mengisi `f302` **dan** `f303` sekaligus. Itu cacat di sisi mereka. Di produk kita, isian hanya aktif pada baris yang dipilih, sehingga hanya satu kolom yang pernah terisi.

### 3.9 Cara mencari pekerjaan (16 kolom)

Kolom `f401`–`f415` bertipe **biner `0` / `1`**. Kolom `f416` bertipe teks.

| Kolom | Opsi |
|---|---|
| `f401` | Melalui iklan di koran/majalah, brosur |
| `f402` | Melamar ke perusahaan tanpa mengetahui lowongan yang ada |
| `f403` | Pergi ke bursa/pameran kerja |
| `f404` | Mencari lewat internet/iklan online/milis |
| `f405` | Dihubungi oleh perusahaan |
| `f406` | Menghubungi Kemenakertrans |
| `f407` | Menghubungi agen tenaga kerja komersial/swasta |
| `f408` | Memeroleh informasi dari pusat/kantor pengembangan karir fakultas/universitas |
| `f409` | Menghubungi kantor kemahasiswaan/hubungan alumni |
| `f410` | Membangun jejaring (network) sejak masih kuliah |
| `f411` | Melalui relasi (misalnya dosen, orang tua, saudara, teman, dll.) |
| `f412` | Membangun bisnis sendiri |
| `f413` | Melalui penempatan kerja atau magang |
| `f414` | Bekerja di tempat yang sama dengan tempat kerja semasa kuliah |
| **`f415`** | **Lainnya — penanda tercentang** |
| **`f416`** | **Lainnya — isian teks** |

### 3.10 Proses lamaran (3 kolom)

| Kolom | Tipe | Pertanyaan |
|---|---|---|
| `f6` | angka | Berapa perusahaan yang sudah dilamar (lewat surat atau e-mail) **sebelum memeroleh pekerjaan pertama** |
| `f7` | angka | Berapa banyak yang merespons lamaran |
| `f7a` | angka | Berapa banyak yang mengundang wawancara |

Ketiganya tanpa batas atas di situs resmi.

### 3.11 Aktif mencari kerja (2 kolom)

| Kolom | Tipe | Value |
|---|---|---|
| `f1001` | pilihan | 1 Tidak · 2 Tidak, tapi sedang menunggu hasil lamaran kerja · 3 Ya, akan mulai bekerja dalam 2 minggu ke depan · 4 Ya, tapi belum pasti akan bekerja dalam 2 minggu ke depan · **5 Lainnya** |
| `f1002` | teks | isian bebas bila `f1001` = 5 |

### 3.12 Alasan pekerjaan tidak sesuai pendidikan (14 kolom)

Kolom `f1601`–`f1613` bertipe **biner `0` / `1`**. Kolom `f1614` bertipe teks.

| Kolom | Opsi |
|---|---|
| `f1601` | Pertanyaan tidak sesuai; pekerjaan saya sekarang sudah sesuai dengan pendidikan saya |
| `f1602` | Saya belum mendapatkan pekerjaan yang lebih sesuai |
| `f1603` | Di pekerjaan ini saya memeroleh prospek karir yang baik |
| `f1604` | Saya lebih suka bekerja di area pekerjaan yang tidak ada hubungannya dengan pendidikan saya |
| `f1605` | Saya dipromosikan ke posisi yang kurang berhubungan dengan pendidikan saya dibanding posisi sebelumnya |
| `f1606` | Saya dapat memeroleh pendapatan yang lebih tinggi di pekerjaan ini |
| `f1607` | Pekerjaan saya saat ini lebih aman/terjamin/secure |
| `f1608` | Pekerjaan saya saat ini lebih menarik |
| `f1609` | Pekerjaan saya saat ini lebih memungkinkan saya mengambil pekerjaan tambahan/jadwal yang fleksibel, dll. |
| `f1610` | Pekerjaan saya saat ini lokasinya lebih dekat dari rumah saya |
| `f1611` | Pekerjaan saya saat ini dapat lebih menjamin kebutuhan keluarga saya |
| `f1612` | Pada awal meniti karir ini, saya harus menerima pekerjaan yang tidak berhubungan dengan pendidikan saya |
| **`f1613`** | **Lainnya — penanda tercentang** |
| **`f1614`** | **Lainnya — isian teks** |

---

## 4. Kode wilayah: yang dikirim adalah angka, bukan nama

`f5a1` dan `f5a2` **tidak** menerima teks. Yang dikirim adalah kode numerik dari `Data Master Lokasi Kerja`.

### 4.1 Pola kode

| Level | Pola | Contoh |
|---|---|---|
| Provinsi | kelipatan `10000` | `10000` DKI Jakarta · `20000` Jawa Barat · `150000` Kalimantan Selatan |
| Kabupaten | kode provinsi + `100`, `200`, `300`, … | `20500` Kab. Bogor · `50100` Kab. Gresik |
| Kota | kode provinsi + `6000` lalu + `100`, `200`, … | `26000` Kota Bandung · `56000` Kota Surabaya |

Offset `+6000` konsisten menandai **Kota** di semua provinsi yang terperiksa. Ini pengamatan dari data, bukan aturan tertulis — jangan dijadikan rumus, tetap pakai tabel referensi.

### 4.2 Kode provinsi yang terkonfirmasi

| Kode | Provinsi |
|---|---|
| 10000 | DKI Jakarta |
| 20000 | Jawa Barat |
| 30000 | Jawa Tengah |
| 40000 | D.I Yogyakarta |
| 50000 | Jawa Timur |
| 60000 | Aceh |
| 70000 | Sumatera Utara |
| 80000 | Sumatera Barat |
| 90000 | Riau |
| 100000 | Jambi |
| 110000 | Sumatera Selatan |
| 120000 | Lampung |
| 130000 | Kalimantan Barat |
| 140000 | Kalimantan Tengah |
| 150000 | Kalimantan Selatan |

> ⚠️ **Daftar ini belum lengkap.** Salinan `Data Master Lokasi Kerja.html` di repo terpotong pada baris 284 (Kalimantan Selatan). Provinsi sisanya — Kalimantan Timur, Kalimantan Utara, Bali, NTB, NTT, Sulawesi (6), Maluku (2), Papua (semua pemekaran), Banten, Bengkulu, Kepulauan Riau, Bangka Belitung, Gorontalo — **belum terekam**. Ambil ulang dari tautan resmi di panduan form: `master-provinsi.xlsx` dan `master-kab-kota.xlsx`.

### 4.3 Penamaan berbeda dari yang tampil di layar

| Sumber | Bentuk nama |
|---|---|
| Data Master (yang dikirim) | `Jawa Barat`, `Bogor` |
| Situs resmi (yang tampil) | `Prov. Jawa Barat`, `Kab. Bogor`, `Kota Bandung` |
| `template-lengkap.json` | `Prov. Jawa Barat`, `Kab. Bogor` |

Prefiks `Prov.` / `Kab.` / `Kota` adalah **format tampilan**, bukan bagian dari data. Yang wajib benar adalah kodenya. Nama boleh ditampilkan dengan atau tanpa prefiks.

### 4.4 Perilaku input di situs resmi

Dropdown wilayah bersifat **searchable** — alumni mengetik dulu, opsi baru muncul. Kabupaten/Kota terkunci sampai Provinsi dipilih ("Silahkan pilih Provinsi terlebih dahulu"). Mockup kita masih memakai `<select>` biasa; untuk 528 kabupaten/kota, pola searchable jauh lebih baik dan sebaiknya diikuti saat implementasi.

---

## 5. Kolom mana yang terisi untuk cabang mana

### 5.1 Matriks cabang — dari lima tangkapan live site

Diverifikasi langsung dengan mengisi kelima status di live site. Tanda ✅ = pertanyaan muncul dan kolomnya terisi.

| Kolom | Bekerja | Wiraswasta | Melanjutkan Pendidikan | Tidak kerja, mencari | Belum memungkinkan |
|---|---|---|---|---|---|
| `f8` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `f502` | ✅ | — | — | — | — |
| `f505` | ✅ | — | — | — | — |
| `f5a1` `f5a2` | ✅ | — | — | — | — |
| `f1101` `f1102` | ✅ | — | — | — | — |
| `f5b` | ✅ | — | — | — | — |
| `f5c` | — | ✅ | — | — | — |
| `f5d` | ✅ | ✅ | — | — | — |
| `f14` | ✅ | — | — | — | — |
| `f15` | ✅ | — | — | — | — |
| `f18a`–`f18d` | — | — | ✅ | — | — |
| `f1201` `f1202` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `f1761`–`f1774` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `f21`–`f27` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `f301`–`f303` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `f401`–`f416` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `f6` `f7` `f7a` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `f1001` `f1002` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `f1601`–`f1614` | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Jumlah pertanyaan** | **19** | **13** | **12** | **11** | **11** |

Sepuluh blok terakhir muncul di **semua** cabang. Cabang Bekerja punya sembilan blok eksklusif — dan justru blok-blok itulah yang dipakai menghitung IKU#2 (masa tunggu, pendapatan, lokasi, jenis instansi).

### 5.2 Dua tempat produk kita berbeda dari situs resmi — dan alasannya

**Pertanyaan pencarian kerja tidak kami tampilkan ke semua cabang.**

Situs resmi menampilkan `f301`–`f303`, `f4`, `f6`, `f7`, `f7a`, `f1001`, dan `f16` bahkan ke alumni berstatus **"Belum memungkinkan bekerja"**. Menanyakan "berapa perusahaan yang sudah Anda lamar sebelum memeroleh pekerjaan pertama" kepada orang yang belum memungkinkan bekerja tidak masuk akal, dan `f16` bertanya tentang "pekerjaan Anda saat ini" kepada orang yang tidak punya pekerjaan.

Produk kita menyaringnya per cabang. Ini **tidak melanggar apa pun**: kolomnya tetap ada di format pengiriman, tinggal dikirim kosong — sama seperti yang terjadi kalau alumni membiarkannya kosong di situs resmi. Yang berubah hanya pengalaman pengisian.

**`f5c` (jabatan) kami tanyakan juga di cabang Bekerja — tapi tidak dikirim.**

Panduan resmi menuliskannya eksplisit sebagai bersyarat: *"Bila berwiraswasta, apa posisi/jabatan Anda saat ini? **(Apabila 1 Menjawab [3] wiraswasta)**"*. Jadi Dikti mengharapkan `f5c` terisi hanya bila `f8` = 3.

Kami tetap menanyakannya di cabang Bekerja karena tanpa itu laporan "jabatan alumni" kosong untuk kelompok responden terbesar. Tapi supaya tidak berisiko ditandai anomali saat validasi silang `f8` × `f5c` di sisi Dikti:

> **Aturan pengiriman:** `f5c` dikirim **hanya bila `f8` = 3** (Wiraswasta). Untuk `f8` = 1 (Bekerja), jawabannya disimpan sebagai **data internal PT** dan kolom `f5c` dikirim kosong.

Ini pola yang sama dengan blok kontak atasan (`k1`, `k2`, dan tiga field tanpa kode): ditanyakan, disimpan, tidak dikirim.

---

## 6. Kolom yang KAMI kumpulkan tapi TIDAK dikirim

Data Master hanya punya 86 kolom. Semua yang di luar itu adalah data internal PT — tidak punya tempat di format pengiriman.

| Data | Kode internal | Kegunaan |
|---|---|---|
| Nama atasan | `k1` | Jembatan ke Survei Pengguna Lulusan |
| Email atasan | `k2` | Alamat pengiriman survei otomatis |
| Jabatan atasan | — | Konteks penilai |
| No. telp atasan | — | Kontak alternatif |
| Alamat perusahaan | — | Verifikasi |
| Tipe kontrak pekerjaan | — | Analisis stabilitas kerja |
| Verifikasi pekerjaan pra-lulus masih berjalan | — | Kriteria (e)/(f) IKU#2 "tetap menjalankan" |
| `f5c` untuk cabang Bekerja | — | Laporan jabatan alumni (lihat §5.2) |
| Jawaban Wave Exit | — | Isian awal untuk Wave G1 |
| Pertanyaan Spesifik institusi | — | Kebutuhan prodi |
| Bundle Kemenkes (4 pertanyaan) | — | Tidak punya sistem kode sama sekali |

Survei Pengguna Lulusan juga tidak dikirim ke Dikti — instrumen itu untuk BAN-PT Indikator 14B. Hanya tiga kode `gu_*` yang berfungsi sebagai kunci pencocokan internal.

---

## 7. Daftar periksa implementasi backend

| # | Hal | Kenapa berisiko kalau terlewat |
|---|---|---|
| 1 | Simpan `value` opsi, bukan urutan tampil | Menyusun ulang urutan tampil lalu menomori ulang `value` akan membalik seluruh data **tanpa pesan kesalahan** |
| 2 | Sediakan kolom teks untuk tiap "Lainnya" | `f416`, `f1614`, `f1102`, `f1202`, `f1002` — tanpa ini isian alumni hilang |
| 3 | `f502` satu kolom, `0` bermakna | Kalau `0` diperlakukan sebagai "kosong", alumni yang bekerja sebelum lulus hilang dari hitungan masa tunggu terbaik |
| 4 | Simpan kode wilayah numerik | Nama wilayah tidak diterima Dikti |
| 5 | Simpan HP, NIK, NPWP sebagai teks | Tipe angka menghapus nol depan |
| 6 | Balik skala `f21`–`f27` saat agregasi | Arah skalanya berlawanan dengan `f1761`–`f1774` |
| 7 | Simpan nomor bagian bersama jawaban | 17 kode dipakai ulang antar cabang; tanpa penanda cabang, asal jawaban tidak jelas |
| 8 | Jangan implementasikan `f504` | Sudah dihapus di panduan 2024 |
| 9 | `f5c` hanya dikirim bila `f8` = 3 | Menghindari anomali validasi silang di sisi Dikti |
| 10 | Lengkapi tabel wilayah dari sumber resmi | Salinan di repo terpotong di Kalimantan Selatan |

---

## 8. Yang masih belum diketahui

- **Mekanisme transportnya.** Data Master mendefinisikan bentuk kolom, tapi tidak menyebut apakah pengiriman lewat unggah berkas (Excel/CSV), API, atau isian manual per alumni. Menu admin panel punya **Unggah Data** dan **Unduh Data**, jadi unggah berkas hampir pasti tersedia — formatnya belum terverifikasi.
- **Perlakuan kolom kosong.** Belum diketahui apakah Dikti menolak baris yang kolom wajibnya kosong, atau menerima dengan penandaan.
- **Validasi silang.** Belum diketahui apakah Dikti memeriksa konsistensi antar kolom, mis. `f8` = 4 (Melanjutkan Pendidikan) tapi `f505` (pendapatan) terisi.
- **Batas nilai.** Situs resmi menerima `999` bulan untuk `f502` dan `f302`/`f303`. Belum diketahui apakah sisi penerima memvalidasi.

Empat hal ini sebaiknya dikonfirmasi ke tim yang pernah melakukan pengiriman nyata, bukan disimpulkan dari dokumen.
