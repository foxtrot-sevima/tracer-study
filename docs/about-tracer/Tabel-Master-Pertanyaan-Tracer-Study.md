# Tabel Master Pertanyaan Tracer Study — Redaksi, Jawaban, dan Kode Dikti

> **Isi dokumen ini.** Seluruh pertanyaan tracer study apa adanya: redaksi persis, setiap opsi jawaban, setiap baris matriks, dan kode Dikti di tiap levelnya. Dipakai sebagai rujukan tunggal saat menyusun seed data atau memverifikasi mockup.
>
> Dokumen pendamping: [Mapping Kode Dikti](Mapping-Kode-Dikti-Tracer-Study.md) berisi analisis, aturan tier, dan keputusan desain. Yang ini murni datanya.

**Digenerate langsung dari** `karirlink/docs/template-lengkap.json` (`formula: "lengkap"`) — template yang dipakai sebagai basis produk. Dilengkapi `template-pengguna-lulusan.json`, dan dibandingkan dengan `template-pddikti.json` untuk menandai selisihnya.

## Ringkasan angka

| | Jumlah |
|---|---|
| Pertanyaan di template lengkap | **62** |
| — bertier Core | 41 |
| — bertier Optional | 19 |
| — sengaja tidak diadopsi | 2 |
| Bagian (section) | 6 |
| Kode Dikti unik, seluruh level | **76** |
| — kode pertanyaan | 27 |
| — kode opsi jawaban | 26 |
| — kode isian "Lainnya" | 2 |
| — kode baris matriks | 21 |
| Kode internal non-Dikti | 2 (`k1`, `k2`) |

Jumlah pertanyaan (62) jauh lebih banyak dari jumlah kode pertanyaan (27) karena dua hal: **kode dipakai ulang antar cabang** (`f505` di Bekerja dan Wiraswasta, `f301` di tiga cabang), dan **14 pertanyaan tidak punya kode Dikti sama sekali**. Rinciannya di [Mapping Kode Dikti §4 dan §12](Mapping-Kode-Dikti-Tracer-Study.md).

## Kenapa template lengkap, bukan pddikti

Template lengkap adalah **superset penuh** — 27 kode Dikti di pddikti ada semuanya di lengkap, ditambah 14 pertanyaan tanpa kode:

| Tambahan | Jumlah | Kegunaan |
|---|---|---|
| Upah minimum (UMR) lokasi kerja | 2 | Pembanding IKU#2 — **tidak diadopsi**, diganti lookup sistem |
| Tipe kontrak pekerjaan | 1 | Analisis stabilitas kerja alumni |
| Kontak atasan: nama `k1`, jabatan, alamat, no. telp, email `k2` | 10 | Jembatan otomatis ke Survei Pengguna Lulusan |
| `f14` varian studi lanjut | 1 | Keeratan bidang studi untuk alumni yang melanjutkan kuliah |

Pertimbangan lengkap ada di [Mapping Kode Dikti §12](Mapping-Kode-Dikti-Tracer-Study.md), termasuk 9 selisih redaksi dan alasan penolakan pertanyaan UMR.

## Cara membaca

> ⚠️ **Baca §9 lebih dulu kalau Anda mau memakai dokumen ini sebagai acuan produk.** Bagian §1 dan §2 memotret **file template apa adanya**. Setelah tangkapan layar situs resmi ditelaah, produk berbeda dari potret itu di tujuh titik — beberapa pertanyaan yang di sini tampil terpisah sebenarnya **satu pertanyaan**. §9 memuat daftar selisihnya.

- **Wajib** = nilai `is_required` di template lengkap. Bukan sama dengan tier. Perlu dicatat: `is_required` ternyata **berbeda antar cabang** untuk kode yang sama — `f4` wajib di cabang Bekerja tapi tidak wajib di cabang Belum Bekerja.
- **Tier** = Core / Optional menurut aturan di [Mapping Kode Dikti §7](Mapping-Kode-Dikti-Tracer-Study.md).
- Kolom **Pertanyaan** memuat redaksi yang dipakai di produk saat dokumen ini digenerate — untuk pertanyaan bertanda **[R]**, redaksinya diambil dari template pddikti. **Satu penanda [R] sudah gugur**, yaitu pada `f1001`; lihat §9.
- **Urutan di tabel ini mengikuti urutan array template**, bukan urutan tampil di produk. Di produk, cabang Bekerja disusun mengikuti situs resmi Kemdiktisaintek. Lihat §8.
- Hanya `f5a2` (528 kabupaten/kota) yang opsinya tidak ditulis penuh — diambil dari tabel referensi wilayah sistem.
- Opsi jawaban di sini ditulis **tanpa kolom `value`**. Untuk pertanyaan pilihan tunggal dan matriks skala, `value`-lah yang mengikat, bukan kode — penjelasannya di §9 dan [Mapping Kode Dikti §13.1](Mapping-Kode-Dikti-Tracer-Study.md).

---

## 1. Indeks — 62 Pertanyaan Template Lengkap

Seluruh pertanyaan dalam satu tampilan. Kolom **Opsi** hanya memuat jumlah pilihan; teks lengkapnya ada di bagian 2.

| # | Bagian | Kode Dikti | Pertanyaan (redaksi yang dipakai) | Jenis jawaban | Opsi | Wajib | Tier |
|---|---|---|---|---|---|---|---|
| 1 | 1 · Informasi Umum | **f8** | Jelaskan status Anda saat ini? | Pilihan tunggal | 5 | wajib | Core |
| 2 | 1 · Informasi Umum | **f1201** | Sumber dana apa yang Anda gunakan untuk membiayai kuliah? | Pilihan tunggal | 6 + Lainnya | wajib | Core |
| 3 | 1 · Informasi Umum | **f502** | Apakah Anda mendapatkan pekerjaan pertama / melanjutkan pendidikan sebelum lulus? | Pilihan tunggal | 2 | wajib | Core |
| 4 | 1 · Informasi Umum | **f502** | Dalam berapa bulan Anda mendapatkan pekerjaan pertama / melanjutkan studi setelah lulus? | Isian angka | - | wajib | Core |
| 5 | 1 · Informasi Umum | **f1001** | Apakah Anda aktif mencari pekerjaan dalam 4 minggu terakhir? **[R̶]** | Pilihan tunggal | 4 + Lainnya | wajib | Core |
| 6 | 2 · Bekerja | **f301** | Kapan Anda mulai mencari pekerjaan yang Anda jalani saat ini? | Pilihan tunggal | 3 | tidak | Optional |
| 7 | 2 · Bekerja | **f302** | Jika Anda mulai mencari pekerjaan sejak sebelum lulus, dalam berapa bulan sebelum lulus Anda memulai mencari pekerjaan? | Isian angka | - | tidak | Optional |
| 8 | 2 · Bekerja | **f303** | Jika Anda mulai mencari pekerjaan sesudah lulus, dalam berapa bulan sesudah lulus Anda memulai mencari pekerjaan? | Isian angka | - | tidak | Optional |
| 9 | 2 · Bekerja | **f4** | Bagaimana Anda mencari pekerjaan tersebut? | Pilihan ganda | 14 + Lainnya | wajib | Core |
| 10 | 2 · Bekerja | **f6** | Berapa perusahaan / instansi / institusi yang sudah Anda lamar sampai saat ini? | Isian angka | - | tidak | Optional |
| 11 | 2 · Bekerja | **f7** | Berapa banyak perusahaan / instansi / institusi yang merespons lamaran Anda sampai saat ini? | Isian angka | - | tidak | Optional |
| 12 | 2 · Bekerja | **f7a** | Berapa banyak perusahaan / instansi / institusi yang mengundang Anda untuk wawancara sampai saat ini? | Isian angka | - | tidak | Optional |
| 13 | 2 · Bekerja | **f505** | Berapa rata-rata pendapatan Anda per bulan (Take Home Pay) saat ini? | Isian angka | - | wajib | Core |
| 14 | 2 · Bekerja | *(tanpa kode)* | Berapakah upah minimum (UMR) di tempat lokasi Anda bekerja saat ini? **[X]** | Isian angka | - | tidak | Tidak diadopsi |
| 15 | 2 · Bekerja | **f1101** | Apa jenis perusahaan / instansi / institusi tempat Anda bekerja saat ini? | Pilihan tunggal | 6 + Lainnya | wajib | Core |
| 16 | 2 · Bekerja | **f5d** | Apa tingkat tempat kerja Anda saat ini? | Pilihan tunggal | 3 | wajib | Core |
| 17 | 2 · Bekerja | **f5a1** | Dimana provinsi Anda bekerja saat ini? **[R]** | Dropdown wilayah | 35 | wajib | Core |
| 18 | 2 · Bekerja | **f5a2** | Dimana Kabupaten / Kota Anda bekerja saat ini? **[R]** | Dropdown wilayah | 528 | wajib | Core |
| 19 | 2 · Bekerja | *(tanpa kode)* | Apa tipe kontrak pekerjaan Anda saat ini? **[+]** | Pilihan tunggal | 3 | tidak | Optional |
| 20 | 2 · Bekerja | **f5b** | Apa nama perusahaan / kantor tempat Anda bekerja saat ini? | Isian teks | - | wajib | Core |
| 21 | 2 · Bekerja | **k1** | Siapakah nama atasan di perusahaan Anda bekerja saat ini? **[+]** | Isian teks | - | wajib | Core |
| 22 | 2 · Bekerja | *(tanpa kode)* | Apa jabatan atasan Anda bekerja saat ini? **[+]** | Isian teks | - | wajib | Core |
| 23 | 2 · Bekerja | *(tanpa kode)* | Dimana Alamat perusahaan tempat Anda bekerja saat ini? **[+]** | Isian teks | - | wajib | Core |
| 24 | 2 · Bekerja | *(tanpa kode)* | Berapa No Telp / No HP atasan Anda saat ini? **[+]** | Isian angka | - | wajib | Core |
| 25 | 2 · Bekerja | **k2** | Apa alamat email atasan Anda saat ini? **[+]** | Isian teks | - | wajib | Core |
| 26 | 2 · Bekerja | **f14** | Seberapa erat hubungan antara bidang studi dengan pekerjaan Anda saat ini? | Pilihan tunggal | 5 | wajib | Core |
| 27 | 2 · Bekerja | **f15** | Tingkat pendidikan apa yang paling tepat / sesuai untuk pekerjaan Anda saat ini? **[R]** | Pilihan tunggal | 4 | wajib | Core |
| 28 | 2 · Bekerja | **f16** | Jika menurut Anda pekerjaan Anda saat ini tidak sesuai dengan pendidikan Anda, mengapa Anda mengambilnya? | Pilihan ganda | 12 + Lainnya | tidak | Optional |
| 29 | 3 · Wiraswasta | **f301** | Kapan anda mulai merencanakan berwiraswasta? | Pilihan tunggal | 3 | tidak | Optional |
| 30 | 3 · Wiraswasta | **f302** | Jika Anda mulai merencanakan berwiraswasta sejak sebelum lulus, dalam berapa bulan sebelum lulus Anda memulai merencanakannya? | Isian angka | - | tidak | Optional |
| 31 | 3 · Wiraswasta | **f303** | Jika Anda mulai merencanakan berwiraswasta sejak sesudah lulus, dalam berapa bulan sesudah lulus Anda memulai merencanakannya? | Isian angka | - | tidak | Optional |
| 32 | 3 · Wiraswasta | **f5c** | Apa posisi / jabatan Anda saat ini? | Pilihan tunggal | 4 | wajib | Core |
| 33 | 3 · Wiraswasta | **f1101** | Apa jenis perusahaan / usaha wiraswasta yang Anda kelola saat ini? | Pilihan tunggal | 6 + Lainnya | wajib | Core |
| 34 | 3 · Wiraswasta | **f5d** | Apa tingkat / ukuran tempat berwiraswasta Anda saat ini? | Pilihan tunggal | 3 | wajib | Core |
| 35 | 3 · Wiraswasta | **f5a1** | Dimana provinsi tempat Anda berwiraswasta saat ini? | Dropdown wilayah | 35 | wajib | Core |
| 36 | 3 · Wiraswasta | **f5a2** | Dimana Kabupaten / Kota tempat Anda berwiraswasta saat ini? | Dropdown wilayah | 528 | wajib | Core |
| 37 | 3 · Wiraswasta | **f5b** | Apa nama perusahaan / kantor tempat Anda berwiraswasta saat ini? | Isian teks | - | wajib | Core |
| 38 | 3 · Wiraswasta | **f505** | Berapa rata-rata pendapatan Anda per bulan (Take Home Pay) saat ini? | Isian angka | - | wajib | Core |
| 39 | 3 · Wiraswasta | *(tanpa kode)* | Berapakah upah minimum (UMR) di tempat lokasi Anda berwiraswasta saat ini? **[X]** | Isian angka | - | tidak | Tidak diadopsi |
| 40 | 3 · Wiraswasta | **k1** | Siapakah Nama Atasan di perusahaan Anda berwiraswasta saat ini? **[+]** | Isian teks | - | wajib | Core |
| 41 | 3 · Wiraswasta | *(tanpa kode)* | Apa jabatan atasan Anda saat ini? **[+]** | Isian teks | - | wajib | Core |
| 42 | 3 · Wiraswasta | *(tanpa kode)* | Dimana Alamat perusahaan / tempat Anda berwiraswasta saat ini? **[+]** | Isian teks | - | wajib | Core |
| 43 | 3 · Wiraswasta | *(tanpa kode)* | Berapa No Telp / No HP atasan Anda saat ini? **[+]** | Isian angka | - | wajib | Core |
| 44 | 3 · Wiraswasta | **k2** | Apa alamat email atasan Anda saat ini? **[+]** | Isian teks | - | wajib | Core |
| 45 | 3 · Wiraswasta | **f14** | Seberapa erat hubungan antara bidang studi dengan pekerjaan Anda saat ini? | Pilihan tunggal | 5 | wajib | Core |
| 46 | 3 · Wiraswasta | **f15** | Tingkat pendidikan apa yang paling tepat / sesuai untuk pekerjaan Anda saat ini? **[R]** | Pilihan tunggal | 4 | wajib | Core |
| 47 | 3 · Wiraswasta | **f16** | Jika menurut Anda pekerjaan Anda saat ini tidak sesuai dengan pendidikan Anda, mengapa Anda mengambilnya? | Pilihan ganda | 12 + Lainnya | tidak | Optional |
| 48 | 4 · Melanjutkan Pendidikan | **f18a** | Dari manakah sumber biaya studi lanjut Anda | Pilihan tunggal | 2 | wajib | Core |
| 49 | 4 · Melanjutkan Pendidikan | **f18b** | Apa nama Perguruan Tinggi tempat Anda melanjutkan Pendidikan? | Isian teks | - | wajib | Core |
| 50 | 4 · Melanjutkan Pendidikan | **f18c** | Apa nama program studi yang Anda ambil dalam melanjutkan pendidikan? | Isian teks | - | wajib | Core |
| 51 | 4 · Melanjutkan Pendidikan | **f18d** | Kapan Anda mulai masuk melanjutkan pendidikan? | Isian tanggal | - | wajib | Core |
| 52 | 4 · Melanjutkan Pendidikan | **f14** | Seberapa erat hubungan antara bidang studi dengan pendidikan Anda? | Pilihan tunggal | 5 | wajib | Core |
| 53 | 5 · Belum Bekerja | **f301** | Kapan anda mulai mencari pekerjaan? | Pilihan tunggal | 3 | tidak | Optional |
| 54 | 5 · Belum Bekerja | **f302** | Jika Anda mulai mencari pekerjaan sejak sebelum lulus, dalam berapa bulan sebelum lulus Anda memulai mencari pekerjaan? | Isian angka | - | tidak | Optional |
| 55 | 5 · Belum Bekerja | **f303** | Jika Anda mulai mencari pekerjaan sesudah lulus, dalam berapa bulan sesudah lulus Anda memulai mencari pekerjaan? | Isian angka | - | tidak | Optional |
| 56 | 5 · Belum Bekerja | **f4** | Bagaimana Anda mencari pekerjaan tersebut? | Pilihan ganda | 14 + Lainnya | tidak | Optional |
| 57 | 5 · Belum Bekerja | **f6** | Berapa perusahaan / instansi / institusi yang sudah Anda lamar sampai saat ini? | Isian angka | - | tidak | Optional |
| 58 | 5 · Belum Bekerja | **f7** | Berapa banyak perusahaan / instansi / institusi yang merespon lamaran Anda sampai saat ini? | Isian angka | - | tidak | Optional |
| 59 | 5 · Belum Bekerja | **f7a** | Berapa banyak perusahaan / instansi / institusi yang mengundang Anda untuk wawancara sampai saat ini? | Isian angka | - | tidak | Optional |
| 60 | 6 · Tingkat Kompetensi | **f2** | Menurut Anda seberapa besar penekanan pada metode pembelajaran di bawah ini dilaksanakan di program studi Anda? **[R]** | Matriks skala | 5 kolom × 7 baris | tidak | Coreᵈ |
| 61 | 6 · Tingkat Kompetensi | **f17** | Pada saat lulus, pada tingkat mana kompetensi di bawah ini Anda kuasai? | Matriks skala | 5 kolom × 7 baris | wajib | Core |
| 62 | 6 · Tingkat Kompetensi | **f17** | Pada saat ini, pada tingkat mana kompetensi di bawah ini diperlukan dalam pekerjaan / studi lanjut Anda? | Matriks skala | 5 kolom × 7 baris | wajib | Core |

**Keterangan tanda:**

- **[+]** tambahan template lengkap — tidak ada di template pddikti
- **[R]** redaksi memakai versi **pddikti**, bukan lengkap (lihat [Mapping Kode Dikti §12.3](Mapping-Kode-Dikti-Tracer-Study.md))
- **[R̶]** penanda [R] yang **sudah gugur** setelah telaah situs resmi — hanya `f1001` (#5)
- **[X]** sengaja **tidak diadopsi** ke produk — lihat [Mapping Kode Dikti §12.4](Mapping-Kode-Dikti-Tracer-Study.md)
- ᵈ Core berdasarkan keputusan produk, bukan flag `is_required` template

Dua catatan ketelitian:

**Pertanyaan #52 juga tambahan template lengkap**, tapi tidak bertanda **[+]** karena kodenya (`f14`) sudah ada di template pddikti — hanya varian redaksi untuk cabang studi lanjut yang baru. Jadi total tambahan lengkap adalah **14 pertanyaan**: 13 bertanda **[+]** ditambah #52.

**Pertanyaan #11 dan #58 memakai kode yang sama (`f7`) dengan ejaan berbeda** — "merespon**s**" di cabang Bekerja, "merespon" di cabang Belum Bekerja. Ini apa adanya dari template lengkap, bukan salah ketik dokumen ini. Di produk keduanya diseragamkan jadi "merespons".

---

## 2. Detail Pertanyaan & Opsi Jawaban


### Bagian 1 — Informasi Umum

#### 1. `f8` — Jelaskan status Anda saat ini?

**Jenis:** Pilihan tunggal · **Status:** ✅ wajib · **Tier:** Core

**Pengendali percabangan** — jawaban pertanyaan ini menentukan bagian mana yang dibuka berikutnya.

**Opsi jawaban:**

| Opsi | Lompat ke bagian |
|---|---|
| Bekerja (full time / part time) | 1 |
| Belum memungkinkan bekerja | 5 |
| Wiraswasta (Wirausaha) | 2 |
| Melanjutkan pendidikan | 3 |
| Tidak kerja, tetapi sedang mencari kerja | 4 |

#### 2. `f1201` — Sumber dana apa yang Anda gunakan untuk membiayai kuliah?

**Jenis:** Pilihan tunggal · **Status:** ✅ wajib · **Tier:** Core

**Keterangan bantuan di template:** Bukan ketika studi lanjut

**Opsi jawaban:**

| Opsi |
|---|
| Biaya Sendiri / Keluarga |
| Beasiswa ADIK |
| Beasiswa BIDIKMISI |
| Beasiswa PPA |
| Beasiswa AFIRMASI |
| Beasiswa Perusahaan / Swasta |

**Isian "Lainnya":** ada, tanpa kode Dikti terpisah

#### 3. `f502` — Apakah Anda mendapatkan pekerjaan pertama / melanjutkan pendidikan sebelum lulus?

**Jenis:** Pilihan tunggal · **Status:** ✅ wajib · **Tier:** Core

**Opsi jawaban:**

| Opsi |
|---|
| Ya |
| Tidak |

#### 4. `f502` — Dalam berapa bulan Anda mendapatkan pekerjaan pertama / melanjutkan studi setelah lulus?

**Jenis:** Isian angka · **Status:** ✅ wajib · **Tier:** Core

**Opsi jawaban:** tidak ada — responden mengisi sendiri.

#### 5. `f1001` — Apakah Anda aktif mencari pekerjaan dalam 4 minggu terakhir?

**Jenis:** Pilihan tunggal · **Status:** ✅ wajib · **Tier:** Core

**⚠️ Penanda [R] di sini sudah gugur.** Semula redaksi pddikti yang dipilih. Setelah situs resmi ditelaah, ternyata di sana tertulis "…4 minggu terakhir? **Pilihlah satu jawaban**" — jadi redaksi **template lengkap** yang benar. Di produk, kalimat "Pilihlah satu jawaban" ditaruh sebagai keterangan bantuan di bawah pertanyaan, bukan disambung ke redaksinya. Lihat §9.

**Opsi jawaban:**

| Opsi |
|---|
| Tidak |
| Tidak, tapi saya sedang menunggu hasil lamaran kerja |
| Ya, saya akan mulai bekerja dalam 2 minggu ke depan |
| Ya, tapi saya belum pasti akan bekerja dalam 2 minggu ke depan |

**Isian "Lainnya":** ada, tanpa kode Dikti terpisah


### Bagian 2 — Bekerja

#### 6. `f301` — Kapan Anda mulai mencari pekerjaan yang Anda jalani saat ini?

**Jenis:** Pilihan tunggal · **Status:** ⬜ tidak wajib · **Tier:** Optional

**Keterangan bantuan di template:** Tanggal Lulus = tanggal Yudisium

**Opsi jawaban:**

| Opsi |
|---|
| Sebelum lulus |
| Sesudah lulus |
| Saya tidak mencari kerja |

#### 7. `f302` — Jika Anda mulai mencari pekerjaan sejak sebelum lulus, dalam berapa bulan sebelum lulus Anda memulai mencari pekerjaan?

**Jenis:** Isian angka · **Status:** ⬜ tidak wajib · **Tier:** Optional

**Keterangan bantuan di template:** Tanggal Lulus = tanggal Yudisium

**Opsi jawaban:** tidak ada — responden mengisi sendiri.

#### 8. `f303` — Jika Anda mulai mencari pekerjaan sesudah lulus, dalam berapa bulan sesudah lulus Anda memulai mencari pekerjaan?

**Jenis:** Isian angka · **Status:** ⬜ tidak wajib · **Tier:** Optional

**Keterangan bantuan di template:** Tanggal Lulus = tanggal Yudisium

**Opsi jawaban:** tidak ada — responden mengisi sendiri.

#### 9. `f4` — Bagaimana Anda mencari pekerjaan tersebut?

**Jenis:** Pilihan ganda · **Status:** ✅ wajib · **Tier:** Core

**Keterangan bantuan di template:** Jawaban bisa lebih dari satu

**Opsi jawaban:**

| Kode opsi | Opsi |
|---|---|
| `f401` | Melalui iklan di koran / majalah, brosur |
| `f402` | Melamar ke perusahaan tanpa mengetahui lowongan yang ada |
| `f403` | Pergi ke bursa / pameran kerja |
| `f404` | Mencari lewat internet / iklan online / milis |
| `f405` | Dihubungi oleh perusahaan |
| `f406` | Menghubungi Kemenakertrans |
| `f407` | Menghubungi agen tenaga kerja komersial / swasta |
| `f408` | memperoleh informasi dari pusat / kantor pengembangan karir fakultas / universitas |
| `f409` | Menghubungi kantor kemahasiswaan / hubungan alumni |
| `f410` | Membangun jejaring (network) sejak masih kuliah |
| `f411` | Melalui relasi (misalnya dosen, orang tua, saudara, teman, dll) |
| `f412` | Membangun bisnis sendiri |
| `f413` | Melalui penempatan kerja atau magang |
| `f414` | Bekerja di tempat yang sama dengan tempat kerja semasa kuliah |

**Isian "Lainnya":** ada, berkode `f415`

#### 10. `f6` — Berapa perusahaan / instansi / institusi yang sudah Anda lamar sampai saat ini?

**Jenis:** Isian angka · **Status:** ⬜ tidak wajib · **Tier:** Optional

**Opsi jawaban:** tidak ada — responden mengisi sendiri.

#### 11. `f7` — Berapa banyak perusahaan / instansi / institusi yang merespons lamaran Anda sampai saat ini?

**Jenis:** Isian angka · **Status:** ⬜ tidak wajib · **Tier:** Optional

**Opsi jawaban:** tidak ada — responden mengisi sendiri.

#### 12. `f7a` — Berapa banyak perusahaan / instansi / institusi yang mengundang Anda untuk wawancara sampai saat ini?

**Jenis:** Isian angka · **Status:** ⬜ tidak wajib · **Tier:** Optional

**Opsi jawaban:** tidak ada — responden mengisi sendiri.

#### 13. `f505` — Berapa rata-rata pendapatan Anda per bulan (Take Home Pay) saat ini?

**Jenis:** Isian angka · **Status:** ✅ wajib · **Tier:** Core

**Keterangan bantuan di template:** Contoh pengisian 2000000

**Opsi jawaban:** tidak ada — responden mengisi sendiri.

#### 14. *(tanpa kode)* — Berapakah upah minimum (UMR) di tempat lokasi Anda bekerja saat ini?

**Jenis:** Isian angka · **Status:** ⬜ tidak wajib · **Tier:** Tidak diadopsi

**[+] Tambahan template lengkap** — tidak ada di template pddikti.

**[X] Tidak diadopsi ke produk.** Nilainya diambil sistem dari tabel referensi, tidak ditanyakan ke alumni.

**Keterangan bantuan di template:** Contoh pengisian 2000000

**Opsi jawaban:** tidak ada — responden mengisi sendiri.

#### 15. `f1101` — Apa jenis perusahaan / instansi / institusi tempat Anda bekerja saat ini?

**Jenis:** Pilihan tunggal · **Status:** ✅ wajib · **Tier:** Core

**Opsi jawaban:**

| Opsi |
|---|
| Instansi pemerintah |
| BUMN / BUMD |
| Institusi / Organisasi Multilateral |
| Organisasi non-profit / Lembaga Swadaya Masyarakat |
| Perusahaan swasta |
| Wiraswast / perusahaan sendiri |

**Isian "Lainnya":** ada, tanpa kode Dikti terpisah

#### 16. `f5d` — Apa tingkat tempat kerja Anda saat ini?

**Jenis:** Pilihan tunggal · **Status:** ✅ wajib · **Tier:** Core

**Opsi jawaban:**

| Opsi |
|---|
| Lokal / Wilayah / Berwirausaha tidak Berbadan Hukum |
| Nasional / Berwirausaha Berbadan Hukum |
| Multinasional / Internasional |

#### 17. `f5a1` — Dimana provinsi Anda bekerja saat ini?

**Jenis:** Dropdown wilayah · **Status:** ✅ wajib · **Tier:** Core

**[R] Redaksi memakai versi pddikti.** Versi template lengkap berbeda — lihat Mapping Kode Dikti bagian 12.3.

**Opsi jawaban:**

| Opsi |
|---|
| Prov. D.K.I. Jakarta |
| Prov. Jawa Barat |
| Prov. Jawa Timur |
| Prov. Riau |
| Prov. Jambi |
| Prov. Sulawesi Tenggara |
| Prov. Maluku |
| Prov. Papua Barat |
| Prov. Sulawesi Barat |
| Luar Negeri |
| Prov. Gorontalo |
| Prov. Sumatera Barat |
| Prov. Sulawesi Tengah |
| Prov. Sulawesi Selatan |
| Prov. Maluku Utara |
| Prov. Banten |
| Prov. Sumatera Utara |
| Prov. Sulawesi Utara |
| Prov. Papua |
| Prov. Bengkulu |
| Prov. D.I. Yogyakarta |
| Prov. Aceh |
| Prov. Nusa Tenggara Timur |
| Prov. Sumatera Selatan |
| Prov. Jawa Tengah |
| Prov. Kepulauan Bangka Belitung |
| Prov. Lampung |
| Prov. Kalimantan Barat |
| Prov. Kalimantan Utara |
| Prov. Kepulauan Riau |
| Prov. Kalimantan Timur |
| Prov. Nusa Tenggara Barat |
| Prov. Kalimantan Tengah |
| Prov. Kalimantan Selatan |
| Prov. Bali |

#### 18. `f5a2` — Dimana Kabupaten / Kota Anda bekerja saat ini?

**Jenis:** Dropdown wilayah · **Status:** ✅ wajib · **Tier:** Core

**[R] Redaksi memakai versi pddikti.** Versi template lengkap berbeda — lihat Mapping Kode Dikti bagian 12.3.

**Opsi jawaban:** 528 pilihan dari tabel referensi wilayah — tidak ditulis ulang di sini.

Contoh isi: Kab. Kepulauan Seribu · Kota Jakarta Pusat · ...

#### 19. *(tanpa kode)* — Apa tipe kontrak pekerjaan Anda saat ini?

**Jenis:** Pilihan tunggal · **Status:** ⬜ tidak wajib · **Tier:** Optional

**[+] Tambahan template lengkap** — tidak ada di template pddikti.

**Opsi jawaban:**

| Opsi |
|---|
| Karyawan Kontrak |
| Karyawan Tetap |
| Tidak ada kontrak kerja (paruh waktu) |

#### 20. `f5b` — Apa nama perusahaan / kantor tempat Anda bekerja saat ini?

**Jenis:** Isian teks · **Status:** ✅ wajib · **Tier:** Core

**Opsi jawaban:** tidak ada — responden mengisi sendiri.

#### 21. `k1` — Siapakah nama atasan di perusahaan Anda bekerja saat ini?

**Jenis:** Isian teks · **Status:** ✅ wajib · **Tier:** Core

**[+] Tambahan template lengkap** — tidak ada di template pddikti.

**Opsi jawaban:** tidak ada — responden mengisi sendiri.

#### 22. *(tanpa kode)* — Apa jabatan atasan Anda bekerja saat ini?

**Jenis:** Isian teks · **Status:** ✅ wajib · **Tier:** Core

**[+] Tambahan template lengkap** — tidak ada di template pddikti.

**Keterangan bantuan di template:** Contoh : Supervisor

**Opsi jawaban:** tidak ada — responden mengisi sendiri.

#### 23. *(tanpa kode)* — Dimana Alamat perusahaan tempat Anda bekerja saat ini?

**Jenis:** Isian teks · **Status:** ✅ wajib · **Tier:** Core

**[+] Tambahan template lengkap** — tidak ada di template pddikti.

**Opsi jawaban:** tidak ada — responden mengisi sendiri.

#### 24. *(tanpa kode)* — Berapa No Telp / No HP atasan Anda saat ini?

**Jenis:** Isian angka · **Status:** ✅ wajib · **Tier:** Core

**[+] Tambahan template lengkap** — tidak ada di template pddikti.

**Opsi jawaban:** tidak ada — responden mengisi sendiri.

#### 25. `k2` — Apa alamat email atasan Anda saat ini?

**Jenis:** Isian teks · **Status:** ✅ wajib · **Tier:** Core

**[+] Tambahan template lengkap** — tidak ada di template pddikti.

**Keterangan bantuan di template:** Apabila anda tidak mengetahui email atasan, isikan alamat email perusahaan

**Opsi jawaban:** tidak ada — responden mengisi sendiri.

#### 26. `f14` — Seberapa erat hubungan antara bidang studi dengan pekerjaan Anda saat ini?

**Jenis:** Pilihan tunggal · **Status:** ✅ wajib · **Tier:** Core

**Opsi jawaban:**

| Opsi |
|---|
| Sangat Erat |
| Erat |
| Cukup Erat |
| Kurang Erat |
| Tidak Sama Sekali |

#### 27. `f15` — Tingkat pendidikan apa yang paling tepat / sesuai untuk pekerjaan Anda saat ini?

**Jenis:** Pilihan tunggal · **Status:** ✅ wajib · **Tier:** Core

**[R] Redaksi memakai versi pddikti.** Versi template lengkap berbeda — lihat Mapping Kode Dikti bagian 12.3.

**Opsi jawaban:**

| Opsi |
|---|
| Setingkat Lebih Tinggi |
| Tingkat yang Sama |
| Setingkat Lebih Rendah |
| Tidak Perlu Pendidikan Tinggi |

#### 28. `f16` — Jika menurut Anda pekerjaan Anda saat ini tidak sesuai dengan pendidikan Anda, mengapa Anda mengambilnya?

**Jenis:** Pilihan ganda · **Status:** ⬜ tidak wajib · **Tier:** Optional

**Keterangan bantuan di template:** Jawaban bisa lebih dari satu

**Opsi jawaban:**

| Kode opsi | Opsi |
|---|---|
| `f1601` | Pertanyaan tidak sesuai, pekerjaan saya sekarang sudah sesuai dengan pendidikan saya |
| `f1602` | Saya belum mendapatkan pekerjaan yang lebih sesuai |
| `f1603` | Di pekerjaan ini, saya memperoleh prospek karir yang baik |
| `f1604` | Saya lebih suka bekerja di area pekerjaan yang tidak ada hubungannya dengan pendidikan saya |
| `f1605` | Saya dipromosikan ke posisi yang kurang berhubungan dengan pendidikan saya dibanding posisi sebelumnya |
| `f1606` | Saya dapat memperoleh pendapatan yang lebih tinggi di pekerjaan ini |
| `f1607` | Pekerjaan saya saat ini lebih aman / terjamin / secure |
| `f1608` | Pekerjaan saya saat ini lebih menarik |
| `f1609` | Pekerjaan saya saat ini, lebih memungkinkan saya mengambil pekerjaan tambahan / jadwal yang fleksibel, dll |
| `f1610` | Pekerjaan saya saat ini lokasinya lebih dekat dari rumah saya |
| `f1611` | Pekerjaan saya saat ini dapat lebih menjamin kebutuhan keluarga saya |
| `f1612` | Pada awal meniti karir ini, saya harus menerima pekerjaan yang tidak berhubungan dengan pendidikan saya |

**Isian "Lainnya":** ada, berkode `f1613`


### Bagian 3 — Wiraswasta

#### 29. `f301` — Kapan anda mulai merencanakan berwiraswasta?

**Jenis:** Pilihan tunggal · **Status:** ⬜ tidak wajib · **Tier:** Optional

**Keterangan bantuan di template:** Wiraswasta = Wirausaha

**Opsi jawaban:**

| Opsi |
|---|
| Sebelum lulus |
| Sesudah lulus |
| Saya tidak merencanakan berwiraswasta |

#### 30. `f302` — Jika Anda mulai merencanakan berwiraswasta sejak sebelum lulus, dalam berapa bulan sebelum lulus Anda memulai merencanakannya?

**Jenis:** Isian angka · **Status:** ⬜ tidak wajib · **Tier:** Optional

**Keterangan bantuan di template:** Tanggal Lulus = tanggal Yudisium

**Opsi jawaban:** tidak ada — responden mengisi sendiri.

#### 31. `f303` — Jika Anda mulai merencanakan berwiraswasta sejak sesudah lulus, dalam berapa bulan sesudah lulus Anda memulai merencanakannya?

**Jenis:** Isian angka · **Status:** ⬜ tidak wajib · **Tier:** Optional

**Keterangan bantuan di template:** Tanggal Lulus = tanggal Yudisium

**Opsi jawaban:** tidak ada — responden mengisi sendiri.

#### 32. `f5c` — Apa posisi / jabatan Anda saat ini?

**Jenis:** Pilihan tunggal · **Status:** ✅ wajib · **Tier:** Core

**Opsi jawaban:**

| Opsi |
|---|
| Founder |
| Co-Founder |
| Staff |
| Freelance / Kerja Lepas |

#### 33. `f1101` — Apa jenis perusahaan / usaha wiraswasta yang Anda kelola saat ini?

**Jenis:** Pilihan tunggal · **Status:** ✅ wajib · **Tier:** Core

**Opsi jawaban:**

| Opsi |
|---|
| Instansi pemerintah |
| BUMN / BUMD |
| Institusi / Organisasi Multilateral |
| Organisasi non-profit / Lembaga Swadaya Masyarakat |
| Perusahaan swasta |
| Wiraswasta / perusahaan sendiri |

**Isian "Lainnya":** ada, tanpa kode Dikti terpisah

#### 34. `f5d` — Apa tingkat / ukuran tempat berwiraswasta Anda saat ini?

**Jenis:** Pilihan tunggal · **Status:** ✅ wajib · **Tier:** Core

**Opsi jawaban:**

| Opsi |
|---|
| Lokal / Wilayah / Berwirausaha tidak Berbadan Hukum |
| Nasional / Berwirausaha Berbadan Hukum |
| Multinasional / Internasional |

#### 35. `f5a1` — Dimana provinsi tempat Anda berwiraswasta saat ini?

**Jenis:** Dropdown wilayah · **Status:** ✅ wajib · **Tier:** Core

**Opsi jawaban:**

| Opsi |
|---|
| Prov. D.K.I. Jakarta |
| Prov. Jawa Barat |
| Prov. Jawa Timur |
| Prov. Riau |
| Prov. Jambi |
| Prov. Sulawesi Tenggara |
| Prov. Maluku |
| Prov. Papua Barat |
| Prov. Sulawesi Barat |
| Luar Negeri |
| Prov. Gorontalo |
| Prov. Sumatera Barat |
| Prov. Sulawesi Tengah |
| Prov. Sulawesi Selatan |
| Prov. Maluku Utara |
| Prov. Banten |
| Prov. Sumatera Utara |
| Prov. Sulawesi Utara |
| Prov. Papua |
| Prov. Bengkulu |
| Prov. D.I. Yogyakarta |
| Prov. Aceh |
| Prov. Nusa Tenggara Timur |
| Prov. Sumatera Selatan |
| Prov. Jawa Tengah |
| Prov. Kepulauan Bangka Belitung |
| Prov. Lampung |
| Prov. Kalimantan Barat |
| Prov. Kalimantan Utara |
| Prov. Kepulauan Riau |
| Prov. Kalimantan Timur |
| Prov. Nusa Tenggara Barat |
| Prov. Kalimantan Tengah |
| Prov. Kalimantan Selatan |
| Prov. Bali |

#### 36. `f5a2` — Dimana Kabupaten / Kota tempat Anda berwiraswasta saat ini?

**Jenis:** Dropdown wilayah · **Status:** ✅ wajib · **Tier:** Core

**Opsi jawaban:** 528 pilihan dari tabel referensi wilayah — tidak ditulis ulang di sini.

Contoh isi: Kab. Kepulauan Seribu · Kota Jakarta Pusat · ...

#### 37. `f5b` — Apa nama perusahaan / kantor tempat Anda berwiraswasta saat ini?

**Jenis:** Isian teks · **Status:** ✅ wajib · **Tier:** Core

**Opsi jawaban:** tidak ada — responden mengisi sendiri.

#### 38. `f505` — Berapa rata-rata pendapatan Anda per bulan (Take Home Pay) saat ini?

**Jenis:** Isian angka · **Status:** ✅ wajib · **Tier:** Core

**Keterangan bantuan di template:** Contoh pengisian 2000000

**Opsi jawaban:** tidak ada — responden mengisi sendiri.

#### 39. *(tanpa kode)* — Berapakah upah minimum (UMR) di tempat lokasi Anda berwiraswasta saat ini?

**Jenis:** Isian angka · **Status:** ⬜ tidak wajib · **Tier:** Tidak diadopsi

**[+] Tambahan template lengkap** — tidak ada di template pddikti.

**[X] Tidak diadopsi ke produk.** Nilainya diambil sistem dari tabel referensi, tidak ditanyakan ke alumni.

**Keterangan bantuan di template:** Contoh pengisian 2000000

**Opsi jawaban:** tidak ada — responden mengisi sendiri.

#### 40. `k1` — Siapakah Nama Atasan di perusahaan Anda berwiraswasta saat ini?

**Jenis:** Isian teks · **Status:** ✅ wajib · **Tier:** Core

**[+] Tambahan template lengkap** — tidak ada di template pddikti.

**Keterangan bantuan di template:** Apabila Anda sebagai Atasan / Pemilik maka isikan nama Anda sendiri

**Opsi jawaban:** tidak ada — responden mengisi sendiri.

#### 41. *(tanpa kode)* — Apa jabatan atasan Anda saat ini?

**Jenis:** Isian teks · **Status:** ✅ wajib · **Tier:** Core

**[+] Tambahan template lengkap** — tidak ada di template pddikti.

**Keterangan bantuan di template:** Apabila Anda sebagai Atasan / Pemilik maka isikan nama Anda sendiri

**Opsi jawaban:** tidak ada — responden mengisi sendiri.

#### 42. *(tanpa kode)* — Dimana Alamat perusahaan / tempat Anda berwiraswasta saat ini?

**Jenis:** Isian teks · **Status:** ✅ wajib · **Tier:** Core

**[+] Tambahan template lengkap** — tidak ada di template pddikti.

**Opsi jawaban:** tidak ada — responden mengisi sendiri.

#### 43. *(tanpa kode)* — Berapa No Telp / No HP atasan Anda saat ini?

**Jenis:** Isian angka · **Status:** ✅ wajib · **Tier:** Core

**[+] Tambahan template lengkap** — tidak ada di template pddikti.

**Opsi jawaban:** tidak ada — responden mengisi sendiri.

#### 44. `k2` — Apa alamat email atasan Anda saat ini?

**Jenis:** Isian teks · **Status:** ✅ wajib · **Tier:** Core

**[+] Tambahan template lengkap** — tidak ada di template pddikti.

**Keterangan bantuan di template:** Apabila Anda sebagai Atasan / Pemilik maka isikan nama Anda sendiri

**Opsi jawaban:** tidak ada — responden mengisi sendiri.

#### 45. `f14` — Seberapa erat hubungan antara bidang studi dengan pekerjaan Anda saat ini?

**Jenis:** Pilihan tunggal · **Status:** ✅ wajib · **Tier:** Core

**Opsi jawaban:**

| Opsi |
|---|
| Sangat Erat |
| Erat |
| Cukup Erat |
| Kurang Erat |
| Tidak Sama Sekali |

#### 46. `f15` — Tingkat pendidikan apa yang paling tepat / sesuai untuk pekerjaan Anda saat ini?

**Jenis:** Pilihan tunggal · **Status:** ✅ wajib · **Tier:** Core

**[R] Redaksi memakai versi pddikti.** Versi template lengkap berbeda — lihat Mapping Kode Dikti bagian 12.3.

**Opsi jawaban:**

| Opsi |
|---|
| Setingkat Lebih Tinggi |
| Tingkat yang Sama |
| Setingkat Lebih Rendah |
| Tidak Perlu Pendidikan Tinggi |

#### 47. `f16` — Jika menurut Anda pekerjaan Anda saat ini tidak sesuai dengan pendidikan Anda, mengapa Anda mengambilnya?

**Jenis:** Pilihan ganda · **Status:** ⬜ tidak wajib · **Tier:** Optional

**Keterangan bantuan di template:** Jawaban bisa lebih dari satu!

**Opsi jawaban:**

| Kode opsi | Opsi |
|---|---|
| `f1601` | Pertanyaan tidak sesuai, pekerjaan saya sekarang sudah sesuai dengan pendidikan saya |
| `f1602` | Saya belum mendapatkan pekerjaan yang lebih sesuai |
| `f1603` | Di pekerjaan ini, saya memperoleh prospek karir yang baik |
| `f1604` | Saya lebih suka bekerja di area pekerjaan yang tidak ada hubungannya dengan pendidikan saya |
| `f1605` | Saya dipromosikan ke posisi yang kurang berhubungan dengan pendidikan saya dibanding posisi sebelumnya |
| `f1606` | Saya dapat memperoleh pendapatan yang lebih tinggi di pekerjaan ini |
| `f1607` | Pekerjaan saya saat ini lebih aman / terjamin / secure |
| `f1608` | Pekerjaan saya saat ini lebih menarik |
| `f1609` | Pekerjaan saya saat ini, lebih memungkinkan saya mengambil pekerjaan tambahan / jadwal yang fleksibel, dll |
| `f1610` | Pekerjaan saya saat ini lokasinya lebih dekat dari rumah saya |
| `f1611` | Pekerjaan saya saat ini dapat lebih menjamin kebutuhan keluarga saya |
| `f1612` | Pada awal meniti karir ini, saya harus menerima pekerjaan yang tidak berhubungan dengan pendidikan saya |

**Isian "Lainnya":** ada, berkode `f1613`


### Bagian 4 — Melanjutkan Pendidikan

#### 48. `f18a` — Dari manakah sumber biaya studi lanjut Anda

**Jenis:** Pilihan tunggal · **Status:** ✅ wajib · **Tier:** Core

**Opsi jawaban:**

| Opsi |
|---|
| Biaya Sendiri |
| Beasiswa |

#### 49. `f18b` — Apa nama Perguruan Tinggi tempat Anda melanjutkan Pendidikan?

**Jenis:** Isian teks · **Status:** ✅ wajib · **Tier:** Core

**Opsi jawaban:** tidak ada — responden mengisi sendiri.

#### 50. `f18c` — Apa nama program studi yang Anda ambil dalam melanjutkan pendidikan?

**Jenis:** Isian teks · **Status:** ✅ wajib · **Tier:** Core

**Opsi jawaban:** tidak ada — responden mengisi sendiri.

#### 51. `f18d` — Kapan Anda mulai masuk melanjutkan pendidikan?

**Jenis:** Isian tanggal · **Status:** ✅ wajib · **Tier:** Core

**Opsi jawaban:** tidak ada — responden mengisi sendiri.

#### 52. `f14` — Seberapa erat hubungan antara bidang studi dengan pendidikan Anda?

**Jenis:** Pilihan tunggal · **Status:** ✅ wajib · **Tier:** Core

**Opsi jawaban:**

| Opsi |
|---|
| Sangat Erat |
| Erat |
| Cukup Erat |
| Kurang Erat |
| Tidak Sama Sekali |


### Bagian 5 — Belum Bekerja

#### 53. `f301` — Kapan anda mulai mencari pekerjaan?

**Jenis:** Pilihan tunggal · **Status:** ⬜ tidak wajib · **Tier:** Optional

**Keterangan bantuan di template:** Tanggal Lulus = Tanggal Yudisium

**Opsi jawaban:**

| Opsi |
|---|
| Sebelum lulus |
| Sesudah lulus |
| Saya tidak mencari kerja |

#### 54. `f302` — Jika Anda mulai mencari pekerjaan sejak sebelum lulus, dalam berapa bulan sebelum lulus Anda memulai mencari pekerjaan?

**Jenis:** Isian angka · **Status:** ⬜ tidak wajib · **Tier:** Optional

**Keterangan bantuan di template:** Tanggal Lulus = Tanggal Yudisium

**Opsi jawaban:** tidak ada — responden mengisi sendiri.

#### 55. `f303` — Jika Anda mulai mencari pekerjaan sesudah lulus, dalam berapa bulan sesudah lulus Anda memulai mencari pekerjaan?

**Jenis:** Isian angka · **Status:** ⬜ tidak wajib · **Tier:** Optional

**Keterangan bantuan di template:** Tanggal Lulus = Tanggal Yudisium

**Opsi jawaban:** tidak ada — responden mengisi sendiri.

#### 56. `f4` — Bagaimana Anda mencari pekerjaan tersebut?

**Jenis:** Pilihan ganda · **Status:** ⬜ tidak wajib · **Tier:** Optional

**Keterangan bantuan di template:** Jawaban bisa lebih dari satu

**Opsi jawaban:**

| Kode opsi | Opsi |
|---|---|
| `f401` | Melalui iklan di koran / majalah, brosur |
| `f402` | Melamar ke perusahaan tanpa mengetahui lowongan yang ada |
| `f403` | Pergi ke bursa / pameran kerja |
| `f404` | Mencari lewat internet / iklan online / milis |
| `f405` | Dihubungi oleh perusahaan |
| `f406` | Menghubungi Kemenakertrans |
| `f407` | Menghubungi agen tenaga kerja komersial / swasta |
| `f408` | memperoleh informasi dari pusat / kantor pengembangan karir fakultas / universitas |
| `f409` | Menghubungi kantor kemahasiswaan / hubungan alumni |
| `f410` | Membangun jejaring (network) sejak masih kuliah |
| `f411` | Melalui relasi (misalnya dosen, orang tua, saudara, teman, dll) |
| `f412` | Membangun bisnis sendiri |
| `f413` | Melalui penempatan kerja atau magang |
| `f414` | Bekerja di tempat yang sama dengan tempat kerja semasa kuliah |

**Isian "Lainnya":** ada, berkode `f415`

#### 57. `f6` — Berapa perusahaan / instansi / institusi yang sudah Anda lamar sampai saat ini?

**Jenis:** Isian angka · **Status:** ⬜ tidak wajib · **Tier:** Optional

**Opsi jawaban:** tidak ada — responden mengisi sendiri.

#### 58. `f7` — Berapa banyak perusahaan / instansi / institusi yang merespon lamaran Anda sampai saat ini?

**Jenis:** Isian angka · **Status:** ⬜ tidak wajib · **Tier:** Optional

**Opsi jawaban:** tidak ada — responden mengisi sendiri.

#### 59. `f7a` — Berapa banyak perusahaan / instansi / institusi yang mengundang Anda untuk wawancara sampai saat ini?

**Jenis:** Isian angka · **Status:** ⬜ tidak wajib · **Tier:** Optional

**Opsi jawaban:** tidak ada — responden mengisi sendiri.


### Bagian 6 — Tingkat Kompetensi

#### 60. `f2` — Menurut Anda seberapa besar penekanan pada metode pembelajaran di bawah ini dilaksanakan di program studi Anda?

**Jenis:** Matriks skala · **Status:** ⬜ tidak wajib · **Tier:** Coreᵈ

**[R] Redaksi memakai versi pddikti.** Versi template lengkap berbeda — lihat Mapping Kode Dikti bagian 12.3.

**Keterangan bantuan di template:** Bagi Anda yang sedang studi lanjut, silakan isi berdasarkan Program Studi sebelumnya

**Baris yang dinilai (sub-pertanyaan):**

| Kode baris | Baris |
|---|---|
| `f21` | Perkuliahan |
| `f22` | Demonstrasi |
| `f23` | Partisipasi dalam proyek riset |
| `f24` | Magang |
| `f25` | Praktikum |
| `f26` | Kerja Lapangan |
| `f27` | Diskusi |

**Kolom skala:**

| Opsi |
|---|
| Tidak Sama Sekali |
| Kurang |
| Cukup Besar |
| Besar |
| Sangat Besar |

#### 61. `f17` — Pada saat lulus, pada tingkat mana kompetensi di bawah ini Anda kuasai?

**Jenis:** Matriks skala · **Status:** ✅ wajib · **Tier:** Core

**Baris yang dinilai (sub-pertanyaan):**

| Kode baris | Baris |
|---|---|
| `f1761` | Etika |
| `f1763` | Keahlian berdasarkan bidang ilmu (profesionalisme) |
| `f1765` | Bahasa Inggris |
| `f1767` | Penggunaan Teknologi Informasi |
| `f1769` | Komunikasi |
| `f1771` | Kerja sama tim |
| `f1773` | Pengembangan Diri |

**Kolom skala:**

| Opsi |
|---|
| Sangat Rendah |
| Rendah |
| Cukup |
| Tinggi |
| Sangat Tinggi |

#### 62. `f17` — Pada saat ini, pada tingkat mana kompetensi di bawah ini diperlukan dalam pekerjaan / studi lanjut Anda?

**Jenis:** Matriks skala · **Status:** ✅ wajib · **Tier:** Core

**Baris yang dinilai (sub-pertanyaan):**

| Kode baris | Baris |
|---|---|
| `f1762` | Etika |
| `f1764` | Keahlian berdasarkan bidang ilmu (profesionalisme) |
| `f1766` | Bahasa Inggris |
| `f1768` | Penggunaan Teknologi Informasi |
| `f1770` | Komunikasi |
| `f1772` | Kerja sama tim |
| `f1774` | Pengembangan Diri |

**Kolom skala:**

| Opsi |
|---|
| Sangat Rendah |
| Rendah |
| Cukup |
| Tinggi |
| Sangat Tinggi |




---

## 3. Survei Pengguna Lulusan

Sumber: `template-pengguna-lulusan.json` (`formula: "graduate-user"`). Diisi atasan atau HRD tempat alumni bekerja, bukan alumni.

**12 pertanyaan, hanya 3 yang berkode.** Ini konsisten dengan posisinya sebagai instrumen BAN-PT Indikator 14B, bukan pelaporan PDDikti.

| # | Kode | Pertanyaan (redaksi resmi) | Jenis jawaban | Wajib |
|---|---|---|---|---|
| 1 | — | Nama Ibu/Bapak/Saudara | Isian teks | ✅ |
| 2 | — | No Telp/HP | Isian teks | ⬜ |
| 3 | — | Email | Isian teks | ⬜ |
| 4 | — | Nama Perusahaan | Isian teks | ✅ |
| 5 | — | Alamat Perusahaan | Isian teks | ✅ |
| 6 | — | Jabatan Anda | Isian teks | ✅ |
| 7 | `gu_nama_alumni` | Nama Alumni yang akan dinilai | Isian teks | ✅ |
| 8 | `gu_prodi_alumni` | Program Studi Alumni yang akan dinilai | Isian teks | ✅ |
| 9 | `gu_tahun_lulus` | Tahun Lulus Alumni yang akan dinilai | Isian angka | ✅ |
| 10 | — | Berikan penilaian Ibu/Bapak/Saudara atas kinerja Alumni kami dalam | Matriks skala, 4 kolom × 12 baris | ✅ |
| 11 | — | Bagaimana harapan Anda terhadap lulusan Universitas kami? | Isian teks | ⬜ |
| 12 | — | Berikan Saran dan masukan Anda untuk Universitas kami | Isian teks | ⬜ |

### 3.1 Matriks penilaian kinerja (pertanyaan 10)

**Kolom skala:** Kurang · Cukup · Baik · Sangat Baik

**12 baris yang dinilai** — semuanya tanpa kode:

| # | Aspek kinerja |
|---|---|
| 1 | Integritas / etika berperilaku / moral |
| 2 | Kinerja/keahlian berdasarkan bidang ilmu (profesionalisme / kompetensi utama) |
| 3 | Kemampuan berbahasa asing |
| 4 | Kemampuan Penggunaan teknologi informasi |
| 5 | Kemampuan berkomunikasi |
| 6 | Kemampuan bekerjasama dalam tim |
| 7 | Kepemimpinan |
| 8 | Pengembangan diri |
| 9 | Etos Kerja |
| 10 | Kesiapan terjun di Masyarakat |
| 11 | Berpikir Kritis |
| 12 | Kreatifitas |

### 3.2 Bagaimana survei ini sampai ke perusahaan

Enam pertanyaan pertama (identitas penilai dan perusahaan) sebagian bisa **terisi otomatis** dari jawaban alumni di G1 — lihat pertanyaan 21–25 dan 40–44 di §1, blok kontak atasan. Alumni menyebutkan nama, jabatan, email, telepon atasan, dan alamat perusahaan; sistem memakai email itu untuk mengirim link survei.

Tiga kode `gu_*` berfungsi sebagai **kunci pencocokan** — supaya jawaban perusahaan bisa ditautkan ke record alumni yang benar. Tanpa ketiganya, penilaian tidak tahu milik siapa.

---

## 4. Bundle Kemenkes — Tidak Ada Format Kode

**Kemenkes tidak punya format kode seperti Dikti.** Tidak ada satu pun kode Kemenkes yang bisa diverifikasi dari sumber mana pun di workspace ini.

### 4.1 Apa yang sebenarnya kita punya

| Sumber | Kedalaman data | Kode |
|---|---|---|
| `template-lengkap.json` | Redaksi persis + opsi + kode di 4 level + flag wajib + percabangan | 76 kode Dikti + 2 internal |
| Riset awal Kemdikti vs Kemenkes | Level topik saja (✅/❌ per topik) | tidak ada |
| Prototype `kuesioner-builder.html` v2.1/a | Redaksi konkret, 4 pertanyaan | tidak ada |

Ketidaksetaraan ini sudah ditandai sejak awal di [Komparasi §0](Komparasi%20Kuesioner%20KEMDIKTI%20(Kemdiktisaintek)%20vs%20KEMENKES.md), dan sampai sekarang belum terselesaikan.

### 4.2 Empat pertanyaan Kemenkes di mockup

Keempatnya berasal dari prototype lama, **bukan** dari instrumen resmi Kemenkes. Redaksi dan opsinya berpotensi berubah begitu sumber resmi ditemukan.

| Pertanyaan | Opsi jawaban | Kode | Tier |
|---|---|---|---|
| Apakah Anda bekerja di fasilitas kesehatan? | Ya · Tidak | tidak ada | Optional, tag `kemenkes` |
| Bagaimana status STR (Surat Tanda Registrasi) Anda saat ini? | Aktif · Dalam proses perpanjangan · Belum memiliki | tidak ada | Optional, tag `kemenkes` |
| Apakah bidang kerja Anda sesuai kompetensi tenaga kesehatan? | Sesuai · Tidak sesuai | tidak ada | Optional, tag `kemenkes` |
| Apakah Anda memiliki sertifikat kompetensi/profesi bidang kesehatan? | Ya · Tidak | tidak ada | Optional, tag `kemenkes` |

### 4.3 Tiga topik yang di-share Kemenkes — sudah tercakup Core

Menurut riset awal, Kemenkes hanya meminta tiga hal yang sama dengan Kemdikti. Ketiganya **sudah ada di Core**, jadi tidak diduplikasi di bundle Kemenkes:

| Topik | Sudah ada sebagai | Kode |
|---|---|---|
| Status Anda saat ini | Pertanyaan #1 | `f8` |
| Kompetensi dikuasai saat lulus (A) vs dibutuhkan sekarang (B) | Pertanyaan #61 dan #62 | `f17` |
| Penekanan metode pembelajaran di prodi | Pertanyaan #60 | `f2` |

Tujuh topik lain di tabel riset (proses pencarian kerja, sumber dana, alasan kerja tidak sesuai) ditandai ❌ untuk Kemenkes.

### 4.4 Konsekuensi praktis

**Bundle Kemenkes tidak bisa di-upload ke mana pun.** Empat pertanyaan itu tersimpan sebagai data internal PT, berguna untuk laporan manual ke Kemenkes atau analisis prodi kesehatan, tapi tidak punya jalur pelaporan otomatis seperti kode Dikti.

**Poltekkes tetap mengisi Core Dikti.** Karena Poltekkes adalah perguruan tinggi di bawah PDDikti, IKU#2 berlaku juga untuk mereka. Bundle Kemenkes adalah **tambahan**, bukan pengganti. Latar keputusan ini di [Mapping Kode Dikti §11.2](Mapping-Kode-Dikti-Tracer-Study.md).

**Kalau instrumen resmi Kemenkes ditemukan:** cek apakah ada sistem penomoran di sana. Kalau ada, tambahkan kolom kode terpisah di skema — jangan campur dengan `code` Dikti. Kalau tidak ada, empat pertanyaan itu tetap Optional tanpa kode dan tidak perlu perubahan skema.

---

## 5. Catatan Pengecualian Tier

Dua hal bertier Core meski tidak memenuhi aturan dasar "berkode Dikti dan `is_required: true`". Ini disengaja dan tercatat supaya bisa dipertanggungjawabkan.

| Pertanyaan | Kode | `is_required` | Dasar Core |
|---|---|---|---|
| Menurut Anda seberapa besar penekanan pada metode pembelajaran … | `f2` | ⬜ false | Satu-satunya pengukur proses pembelajaran; diminta Kemenkes; jadi dasar prodi mengaitkan kelemahan kompetensi ke metode pengajaran |
| Alamat email + Nomor HP alumni (Wave Exit) | tidak ada | tidak ada di template | Tanpa keduanya sistem tidak bisa mengirim Wave G1 dan G2 |

**`f505` sudah bukan pengecualian.** Di template lengkap nilainya `is_required: true`, jadi Core-nya mengikuti aturan biasa. Sebelumnya ia jadi pengecualian karena basis yang dipakai adalah template pddikti yang menandainya tidak wajib.

**Blok kontak atasan (pertanyaan 21–25 dan 40–44)** ditandai Core meski tanpa kode Dikti, dan itu **sesuai** aturan — `is_required: true` di template lengkap. Dasarnya operasional: tanpa email atasan, Survei Pengguna Lulusan untuk BAN-PT tidak bisa dikirim otomatis.

Rinciannya di [Mapping Kode Dikti §11.4](Mapping-Kode-Dikti-Tracer-Study.md).

---

## 6. Anomali di Template

Tiga hal yang perlu diperhatikan backend karena tidak mengikuti pola normal.

**`f502` dipakai dua kali dalam bagian yang sama** — untuk gate "Apakah Anda mendapatkan pekerjaan pertama / melanjutkan pendidikan sebelum lulus?" (pilihan tunggal) dan "Dalam berapa bulan …" (isian angka). Pembedanya `answer_type_id`, bukan `code`. **Ini ternyata bukan anomali:** keduanya memang **satu field masa tunggu**, dengan gate sebagai saklarnya. Opsi "Ya" bernilai `value = 0` (masa tunggu nol bulan) dan "Tidak" bernilai `null` karena nilainya diambil dari isian bulan. Lihat §9.

**`f17` dipakai dua kali dalam Bagian 6.** Untuk kompetensi saat lulus (A) dan kompetensi yang dibutuhkan sekarang (B). Pembedanya kode baris: nomor ganjil untuk A (`f1761`–`f1773`), nomor genap untuk B (`f1762`–`f1774`). Situs resmi menampilkan keduanya sebagai **satu tabel** dua kelompok kolom, dan template lengkap memberi keduanya `number` yang sama (14) — jadi ini pun bukan anomali, melainkan satu butir formulir.

**Enam belas kode dipakai ulang antar bagian.** `f301`, `f302`, `f303`, `f4`, `f5a1`, `f5a2`, `f5b`, `f5d`, `f505`, `f14`, `f15`, `f16`, `f1101`, `f6`, `f7`, `f7a`. Karena alumni hanya melewati satu cabang, hanya satu nilai terisi per kode. Setelah `f5c` ditambahkan ke cabang Bekerja, kode itu ikut dipakai ulang — jadi tujuh belas.

**Kolom `number` jangan dipakai untuk apa pun.** Nilainya duplikat: lima pertanyaan di cabang Bekerja sama-sama bernilai `4`. Hipotesis bahwa `number` adalah nomor butir pada formulir resmi Dikti sudah **diuji dan gugur** — situs resmi menampilkan `f6`/`f7`/`f7a` sebagai tiga pertanyaan bernomor terpisah meski ketiganya `number = 4`, dan kedua template tidak sepakat soal nomor `f17`. Rinciannya di [Mapping Kode Dikti §13.4](Mapping-Kode-Dikti-Tracer-Study.md).

**Skala `f2` dan `f17` berlawanan arah.** `f2`: `value` 1 = Sangat Besar sampai 5 = Tidak Sama Sekali. `f17`: 1 = Sangat Rendah sampai 5 = Sangat Tinggi. Dua matriks berdampingan di bagian yang sama. Setiap agregasi atas `f2` harus membalik skala lebih dulu (`6 - value`), atau grafik dashboard akan menunjukkan kebalikan dari kenyataan. Perhatikan juga bahwa urutan opsi `f2` di §2 ditulis dari "Tidak Sama Sekali" ke "Sangat Besar" — itu urutan array template, sedangkan situs resmi dan produk menampilkannya terbalik. Keduanya sah, karena `value` melekat ke label bukan ke posisi.

**Kunci penyimpanan yang disarankan:** `(quest_master_id, nomor bagian, nomor pertanyaan, code)`. Jangan mengandalkan `code` sendirian. Catatan penamaan: properti bagian di file template bernama `number` dan `name` — **tidak ada** `section_id`, jadi sebutan itu di versi awal dokumen ini keliru.

---

## 7. Struktur Cabang

Percabangan dikendalikan jawaban `f8` (pertanyaan #1), satu-satunya pertanyaan dengan `jump_to_box: true`.

```
1. Informasi Umum  ......................  semua alumni
       │
       └── jawaban f8 menentukan cabang
             │
             ├── Bekerja ...............  bagian 2
             ├── Wiraswasta ............  bagian 3
             ├── Melanjutkan Pendidikan   bagian 4
             ├── Tidak kerja, mencari ..  bagian 5
             └── Belum memungkinkan ....  langsung ke bagian 6

6. Tingkat Kompetensi  ..................  semua alumni
```

| Bagian | Jumlah pertanyaan | Tier dominan | Catatan |
|---|---|---|---|
| 1 · Informasi Umum | 5 | Core | Semua wajib. Ditambah pertanyaan verifikasi internal di produk (tanpa kode) |
| 2 · Bekerja | 23 | Core | Cabang terpanjang. Termasuk blok kontak atasan dan 1 pertanyaan tidak diadopsi |
| 3 · Wiraswasta | 19 | Core | Tidak menanyakan `f4`; format resmi tidak memasukkannya di sini |
| 4 · Melanjutkan Pendidikan | 5 | Core | Cabang paling ringkas |
| 5 · Belum Bekerja | 7 | **Optional** | Satu-satunya cabang tanpa pertanyaan wajib — seluruh isinya `is_required: false` |
| 6 · Tingkat Kompetensi | 3 matriks | Core | Diisi semua status, termasuk yang melanjutkan pendidikan |

Alumni dengan status "Belum memungkinkan bekerja" tidak punya cabang sendiri — langsung menuju bagian 6.

---

## 8. Urutan Tampil di Produk ≠ Urutan Array Template

Urutan di §1 mengikuti urutan array di JSON. **Di produk, urutannya berbeda** — cabang Bekerja disusun mengikuti situs resmi Kemdiktisaintek supaya alumni yang pernah mengisi di sana menemukan alur yang familiar.

| Urutan tampil di produk | Kode | Nomor di §1 |
|---|---|---|
| 1 | `f505` pendapatan | 13 |
| 2 | `f5a1` provinsi | 17 |
| 3 | `f5a2` kabupaten/kota | 18 |
| 4 | `f1101` jenis instansi | 15 |
| 5 | `f5b` nama perusahaan | 20 |
| 6 | `f5d` tingkat tempat kerja | 16 |
| 7 | `f14` keeratan bidang studi | 26 |
| 8 | `f15` jenjang pendidikan | 27 |
| 9 | `f4` cara mencari pekerjaan | 9 |
| 10–14 | blok kontak atasan | 21–25 |

Delapan pertama persis mengikuti urutan situs resmi. `f4` tidak ada di situs resmi tapi ditandai wajib di template, jadi ditaruh setelahnya. Blok kontak atasan ditaruh paling akhir karena bukan bagian dari format Dikti.

**Masa tunggu (`f502`, nomor 4) ditaruh di Informasi Umum, bukan di cabang.** Di template posisinya memang di Section 1, dan itu menguntungkan: kalau ditaruh di cabang, pertanyaan yang sama harus diduplikasi tiga kali. Di produk ditandai muncul bersyarat untuk status Bekerja, Wiraswasta, atau Melanjutkan Pendidikan.

**Matriks kompetensi digabung jadi satu tabel.** Secara teknis `f17` adalah dua pertanyaan (nomor 61 dan 62), tapi di produk ditampilkan sebagai satu tabel dengan kolom A dan B. **Situs resmi Kemdiktisaintek juga menampilkannya begitu**, jadi ini bukan penyederhanaan dari kami. Saat disimpan tetap dipisah sesuai kode baris.

Setelah penambahan `f5c` (jabatan) ke cabang Bekerja, urutan tampilnya menjadi: pendapatan, provinsi, kabupaten/kota, jenis instansi, nama perusahaan, **jabatan**, tingkat tempat kerja, keeratan, jenjang, cara mencari pekerjaan, blok kontak atasan.

---

## 9. Lampiran: Selisih Tabel Ini dengan Produk Setelah Telaah Situs Resmi

Tabel di §1 dan §2 **digenerate apa adanya dari template lengkap** dan sengaja tidak diubah, supaya tetap bisa dibandingkan dengan sumbernya. Setelah tangkapan layar situs resmi Kemdiktisaintek ditelaah, produk berbeda dari tabel ini di tujuh titik. Alasan lengkapnya di [Mapping Kode Dikti §13–§14](Mapping-Kode-Dikti-Tracer-Study.md).

| Nomor di §1 | Isi tabel ini | Bentuk di produk |
|---|---|---|
| **3 + 4** (`f502`) | Dua pertanyaan: gate Ya/Tidak, lalu isian bulan | **Satu pertanyaan**: "Ya, sebelum lulus" atau "Tidak — kira-kira … bulan setelah lulus". `value = 0` pada opsi "Ya" ternyata berarti masa tunggu nol bulan |
| **6 + 7 + 8** (`f301`, `f302`, `f303`) cabang Bekerja | Tiga pertanyaan terpisah | **Satu pertanyaan** dengan isian angka di dalam opsi radio, mengikuti format resmi |
| **29 + 30 + 31** cabang Wiraswasta | Tiga pertanyaan terpisah | **Satu pertanyaan**, pola sama |
| **53 + 54 + 55** cabang Belum Bekerja | Tiga pertanyaan terpisah | **Satu pertanyaan**, pola sama |
| **10, 11, 12** (`f6`, `f7`, `f7a`) cabang Bekerja | "…sampai saat ini?" | "…**sebelum Anda memperoleh pekerjaan pertama**?" mengikuti situs resmi. Di cabang Belum Bekerja (57–59) tetap "sampai saat ini" |
| **5** (`f1001`) | Bertanda **[R]** — redaksi pddikti | Redaksi **lengkap** yang benar; situs resmi memuat "Pilihlah satu jawaban". Di produk kalimat itu ditaruh sebagai keterangan bantuan |
| **32** (`f5c`) | Hanya ada di cabang Wiraswasta | **Ditambahkan juga ke cabang Bekerja** — template melewatkannya, sehingga jabatan alumni yang bekerja tidak pernah terekam |

Satu hal yang tidak terlihat di tabel ini karena bukan soal redaksi:

**Kolom `value` mengikat untuk opsi yang tidak punya kode.** Hanya `f4` dan `f16` yang opsinya berkode. Untuk semua pertanyaan pilihan tunggal dan matriks skala, yang mengidentifikasi jawaban adalah `value`. Tiga konsekuensi penting:

- **Urutan tampil bebas, tapi pasangan (label ↔ `value`) tidak boleh bergeser.** Menyusun ulang urutan lalu menomori ulang `value` akan membalik seluruh data tanpa pesan kesalahan apa pun.
- **Arah skala `f2` dan `f17` berlawanan.** `f2`: 1 = Sangat Besar sampai 5 = Tidak Sama Sekali. `f17`: 1 = Sangat Rendah sampai 5 = Sangat Tinggi. Mockup sebelumnya memasangkan angka 1 pada `f2` dengan "Tidak sama sekali" — terbalik dari template, dan sudah diperbaiki.
- **`value` di template terkonfirmasi sama dengan value resmi Dikti.** Data Master resmi Kemdikti mencantumkan value tiap opsi, dan hasilnya identik dengan `template-lengkap.json`. Jadi tabel di §2 bisa dipakai langsung sebagai acuan penyimpanan.

**Setiap "Lainnya" sebenarnya dua kolom.** `f415` dan `f1613` yang di §1 disebut "kode isian Lainnya" ternyata adalah **penanda biner** apakah opsi itu dicentang. Teksnya dikirim di kolom terpisah — `f416` dan `f1614` — yang tidak ada di template dan belum pernah tercatat di dokumen ini. Pola sama berlaku untuk `f1101`→`f1102`, `f1201`→`f1202`, `f1001`→`f1002`.

**Spesifikasi lapisan pengiriman ada di dokumen tersendiri.** 86 kolom, tipe tiap kolom, kode wilayah numerik, dan matriks kolom-per-cabang: lihat [Format Pengiriman Data ke Dikti](Format-Pengiriman-Data-ke-Dikti.md). Dokumen itu lebih otoritatif daripada tabel ini untuk segala hal yang menyangkut bentuk data terkirim.
