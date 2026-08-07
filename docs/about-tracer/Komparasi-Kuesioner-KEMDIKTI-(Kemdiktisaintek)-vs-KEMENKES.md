# Komparasi Kuesioner KEMDIKTI (Kemdiktisaintek) vs KEMENKES

## 0. Catatan Sumber & Tingkat Kedalaman Data

> ⚠️ **Penting:** kedalaman data di dua sisi ini **tidak setara** — perbedaan ini sengaja ditandai eksplisit, bukan diabaikan:
>
> - **Sisi Kemdikti/Kemdiktisaintek**: bersumber dari screenshot **live product** [tracerstudy.kemdiktisaintek.go.id](https://tracerstudy.kemdiktisaintek.go.id) — mencakup redaksi persis tiap pertanyaan, logic percabangan per pilihan status, sampai dokumen resmi kriteria & bobot penilaian **IKU 2**. Sejak sesi berikutnya, redaksi ini juga terkonfirmasi lewat `template-pddikti.json` dan `template-lengkap.json`.
> - **Sisi Kemenkes**: masih level topik (✅/❌) dari riset awal [Perbandingan Pertanyaan yang di ajukan oleh KEMDIKTI & KEMENKES](Perbandingan%20Pertanyaan%20yang%20di%20ajukan%20oleh%20KEMDIK%2039de039bd7dc80329d24f58dae0d674e.md).

> 📌 **Klarifikasi sumber Kemenkes (penting).** Tidak ada dokumen instrumen resmi Kemenkes yang bisa dicari — **yang ada dan sah adalah live site Kemenkes**, persis seperti sisi Kemdikti yang juga bersumber dari live site. Jadi kesetaraan data bukan hal yang mustahil; hanya belum dilakukan penangkapannya.
>
> Yang dibutuhkan untuk menyetarakan: penangkapan layar live site Kemenkes dengan cakupan yang sama seperti Kemdikti. Daftar rincinya di **§5.1**.

> ⚠️ **Jejak sumber tidak ada di workspace ini.** Folder screenshot yang dirujuk versi awal dokumen ini (`quesioner/kemdikti`, `quesioner/kemdiktisaintek`) **tidak ditemukan** di repositori. Artinya klaim redaksi sisi Kemdikti tidak bisa ditelusuri ulang dari workspace — untungnya sekarang sudah tergantikan oleh dua file template JSON yang ada di `karirlink/docs/`. Untuk Kemenkes, simpan tangkapan layarnya **di dalam repo** supaya masalah yang sama tidak terulang.

## 1. Struktur Percabangan Kemdiktisaintek (Live Site)

Gate question (dikonfirmasi via screenshot): **single-select radio button** — bukan multi-select.

> "Jelaskan status Anda saat ini?" *(wajib diisi)*
> - ⚪ Bekerja (full time / part time)
> - ⚪ Belum memungkinkan bekerja
> - ⚪ Wiraswasta
> - ⚪ Melanjutkan Pendidikan
> - ⚪ Tidak kerja tetapi sedang mencari kerja

| Status Dipilih | Pertanyaan Lanjutan yang Muncul (redaksi persis dari live site) |
|---|---|
| **Bekerja** | 1. Dalam berapa bulan Anda mendapatkan pekerjaan pertama?<br>2. Berapa rata-rata pendapatan Anda per bulan? (take home pay)<br>3. Dimana lokasi tempat Anda bekerja?<br>4. Apa jenis perusahaan/instansi/institusi tempat Anda bekerja sekarang?<br>5. Apa nama perusahaan/kantor tempat Anda bekerja?<br>6. Apa tingkat tempat kerja Anda?<br>7. Seberapa erat hubungan bidang studi dengan pekerjaan Anda?<br>8. Tingkat pendidikan apa yang paling tepat/sesuai untuk pekerjaan Anda saat ini? |
| **Belum memungkinkan bekerja** | *Tidak ada pertanyaan lanjutan yang tercatat pada screenshot* |
| **Wiraswasta** | 1. Dalam berapa bulan setelah lulus Anda memulai wiraswasta?<br>2. Berapa rata-rata pendapatan Anda per bulan? (take home pay)<br>3. Dimana lokasi tempat Anda bekerja? (Provinsi, Kota/Kabupaten)<br>4. Bila berwiraswasta, apa posisi/jabatan Anda saat ini?<br>5. Apa tingkat tempat kerja Anda? |
| **Melanjutkan Pendidikan** | Sumber biaya, Perguruan Tinggi, Program Studi, Tanggal Masuk |
| **Tidak kerja tapi sedang mencari kerja** | *Tidak ada pertanyaan lanjutan yang tercatat pada screenshot* |

### 1.1 Halaman yang Tertangkap: Identitas + Kuesioner Wajib

Tangkapan layar terbaru dari `tracerstudy.kemdiktisaintek.go.id/kuesioner` menunjukkan hal yang **tidak terlihat** dari file template: situs resmi hanya punya **dua bagian**, bukan enam bagian bercabang.

**Halaman Identitas.** Terkunci (dari data PT): NIM, Kode Perguruan Tinggi, Tahun Lulus, Kode Program Studi, Nama, NIK. Bisa diisi alumni: Alamat Email, Nomor Telepon / HP, NPWP.

> **NIK, NPWP, Kode PT, dan Kode Prodi belum pernah ada** di kedua file template maupun di mockup kami sebelumnya. Empat kolom ini sekarang sudah ditambahkan ke blok Identitas di `simulasi-pengisian.html`.

**Halaman "Kuesioner Wajib"** memuat 11 pertanyaan berurutan dan **datar** — tanpa percabangan, karena statusnya belum dipilih. Pemetaannya ke kode:

| Urutan di situs | Kode | Catatan |
|---|---|---|
| 1 | `f8` | bertanda wajib |
| 2 | `f1201` | bertanda wajib |
| 3 | `f17` | bertanda wajib · **A dan B dalam satu pertanyaan**, satu tabel dua kelompok kolom |
| 4 | `f2` | bukan matriks di situs resmi — tiap baris jadi grup radio terpisah dalam tata letak tiga kolom |
| 5 | `f301` + `f302` + `f303` | **satu pertanyaan** dengan isian angka di dalam opsi radio |
| 6 | `f4` | |
| 7 | `f6` | |
| 8 | `f7` | |
| 9 | `f7a` | |
| 10 | `f1001` | |
| 11 | `f16` | |

Tiga hal yang perlu dicatat dari tangkapan ini:

**`section_number` di template bukan urutan tampil.** `f1001` berada di Section 1 template tapi tampil di posisi 10; `f2` mendahului `f17` di array tapi tampil sesudahnya. Urutan tampil adalah milik aplikasi, bukan milik file template.

**Hanya nomor 1, 2, dan 3 bertanda `*`.** Nomor 4–11 tidak — termasuk `f4` dan `f1001` yang di template bernilai `is_required: true`. Penjelasan yang paling masuk akal: halaman ini tampilan **sebelum cabang dipilih**, dan `is_required` di template ternyata berbeda antar cabang. Rinciannya di [Mapping Kode Dikti §14.3](Mapping-Kode-Dikti-Tracer-Study.md).

**Redaksi situs resmi berbeda dari kedua template.** Enam selisih tercatat, dan satu di antaranya bukan soal diksi: `f6` di situs resmi dihitung "**sebelum anda memeroleh pekerjaan pertama**", sedangkan kedua template menulis "**sampai saat ini**". Dua rumusan itu mengukur hal berbeda. Riset awal di dokumen ini ternyata benar dan kedua templatlah yang menyimpang — lihat [Mapping Kode Dikti §14.2](Mapping-Kode-Dikti-Tracer-Study.md).

## 1a. Daftar Lengkap Seluruh Pertanyaan (Bukan Perbandingan Berpasangan)

Dua daftar independen — **bukan** tabel berpasangan baris-per-baris — supaya masing-masing sisi tampil apa adanya sesuai jumlah pertanyaan yang benar-benar ada, tanpa dipaksa sejajar dengan sisi lainnya.

### Tabel A — Seluruh Pertanyaan KEMDIKTI / Kemdiktisaintek (32 baris)

Menggabungkan dua sumber: tabel riset awal (kolom **Sumber** = *Riset awal*) dan screenshot live site Kemdiktisaintek (kolom **Sumber** = *Live site*) — ditandai supaya jelas mana *standar tertulis* dan mana *implementasi nyata* (keduanya bisa saja tidak 100% sama, lihat bagian 2).

| No | Sumber | Konteks / Cabang | Pertanyaan |
|---|---|---|---|
| 1 | Riset awal + Live site | Gate (semua status) | Jelaskan status Anda saat ini? *(single-select, wajib)* — opsi: Bekerja (full time/part time) · Belum memungkinkan bekerja · Wiraswasta · Melanjutkan Pendidikan · Tidak kerja tetapi sedang mencari kerja |
| 2 | Riset awal | Umum | Sebutkan sumber dana dalam pembiayaan kuliah? *(bukan ketika Studi Lanjut)* |
| 3 | Riset awal | Umum | Pada saat lulus, pada tingkat mana kompetensi di bawah ini anda kuasai? *(bagian A)* |
| 4 | Riset awal | Umum | Pada saat ini, pada tingkat mana kompetensi di bawah ini diperlukan dalam pekerjaan? *(bagian B)* |
| 5 | Riset awal | Umum | Menurut anda seberapa besar penekanan pada metode pembelajaran di bawah ini dilaksanakan di program studi anda? |
| 6 | Riset awal | Umum (proses cari kerja) | Kapan anda mulai mencari pekerjaan? *(pekerjaan sambilan tidak dimasukkan)* |
| 7 | Riset awal | Umum (proses cari kerja) | Bagaimana anda mencari pekerjaan tersebut? |
| 8 | Riset awal | Umum (proses cari kerja) | Berapa perusahaan/instansi/institusi yang sudah anda lamar (lewat surat/e-mail) sebelum memperoleh pekerjaan pertama? |
| 9 | Riset awal | Umum (proses cari kerja) | Berapa banyak perusahaan/instansi/institusi yang merespons lamaran anda? |
| 10 | Riset awal | Umum (proses cari kerja) | Berapa banyak perusahaan/instansi/institusi yang mengundang anda untuk wawancara? |
| 11 | Riset awal | Umum (proses cari kerja) | Apakah anda aktif mencari pekerjaan dalam 4 minggu terakhir? |
| 12 | Riset awal | Umum (kesesuaian kerja) | Jika pekerjaan anda saat ini tidak sesuai dengan pendidikan anda, mengapa anda mengambilnya? *(bisa lebih dari satu jawaban)* |
| 13 | Live site | Cabang: Bekerja | Dalam berapa bulan Anda mendapatkan pekerjaan pertama? |
| 14 | Live site | Cabang: Bekerja | Berapa rata-rata pendapatan Anda per bulan? *(take home pay)* |
| 15 | Live site | Cabang: Bekerja | Dimana lokasi tempat Anda bekerja? |
| 16 | Live site | Cabang: Bekerja | Apa jenis perusahaan/instansi/institusi tempat anda bekerja sekarang? |
| 17 | Live site | Cabang: Bekerja | Apa nama perusahaan/kantor tempat Anda bekerja? |
| 18 | Live site | Cabang: Bekerja | Apa tingkat tempat kerja Anda? |
| 19 | Live site | Cabang: Bekerja | Seberapa erat hubungan bidang studi dengan pekerjaan Anda? |
| 20 | Live site | Cabang: Bekerja | Tingkat pendidikan apa yang paling tepat/sesuai untuk pekerjaan anda saat ini? |
| 21 | Live site | Cabang: Belum memungkinkan bekerja | *(Tidak ada pertanyaan lanjutan yang tercatat pada screenshot)* |
| 22 | Live site | Cabang: Wiraswasta | Dalam berapa bulan setelah lulus anda memulai wiraswasta? |
| 23 | Live site | Cabang: Wiraswasta | Berapa rata-rata pendapatan Anda per bulan? *(take home pay)* |
| 24 | Live site | Cabang: Wiraswasta | Dimana lokasi tempat Anda bekerja? — Provinsi |
| 25 | Live site | Cabang: Wiraswasta | Dimana lokasi tempat Anda bekerja? — Kota/Kabupaten |
| 26 | Live site | Cabang: Wiraswasta | Bila berwiraswasta, apa posisi/jabatan Anda saat ini? |
| 27 | Live site | Cabang: Wiraswasta | Apa tingkat tempat kerja Anda? |
| 28 | Live site | Cabang: Melanjutkan Pendidikan | Sumber biaya *(studi lanjut)* |
| 29 | Live site | Cabang: Melanjutkan Pendidikan | Perguruan Tinggi *(studi lanjut)* |
| 30 | Live site | Cabang: Melanjutkan Pendidikan | Program Studi *(studi lanjut)* |
| 31 | Live site | Cabang: Melanjutkan Pendidikan | Tanggal Masuk *(studi lanjut)* |
| 32 | Live site | Cabang: Tidak kerja tetapi sedang mencari kerja | *(Tidak ada pertanyaan lanjutan yang tercatat pada screenshot)* |

### Tabel B — Seluruh Pertanyaan KEMENKES (5 baris yang diketahui)

Ini **semua** yang ada sumbernya di workspace ini, digabung dari 2 sumber: tabel riset awal (level topik, ✅/❌ saja) dan bank soal di prototype `kuesioner-builder.html` (sudah ada redaksi konkret bertag `kemenkes`).

| No | Sumber | Pertanyaan | Tipe / Opsi | Catatan |
|---|---|---|---|---|
| 1 | Riset awal | Apakah Anda saat ini sedang melanjutkan studi? | — | Redaksi **dugaan**, berdasar anotasi riset awal "(melanjutkan studi)" — perlu verifikasi ke dokumen resmi Kemenkes |
| 2 | Riset awal | Apakah Anda saat ini sedang bekerja? | — | Redaksi **dugaan**, berdasar anotasi riset awal "(apakah saat ini sedang bekerja)" — perlu verifikasi |
| 3 | Riset awal | Pada saat lulus, pada tingkat mana kompetensi di bawah ini anda kuasai? *(bagian A)* | — | Ditandai ✅ identik dgn Kemdikti di tabel riset awal (asumsi periset: redaksi sama) |
| 4 | Riset awal | Pada saat ini, pada tingkat mana kompetensi di bawah ini diperlukan dalam pekerjaan? *(bagian B)* | — | Ditandai ✅ identik dgn Kemdikti |
| 5 | Riset awal | Menurut anda seberapa besar penekanan pada metode pembelajaran di bawah ini dilaksanakan di program studi anda? | — | Ditandai ✅ identik dgn Kemdikti |
| 6 | Prototype `v2.1/a` | Apakah Anda bekerja di fasilitas kesehatan? | radio: Ya / Tidak | Optional, tag `kemenkes`, `active: false` (belum diaktifkan default) |
| 7 | Prototype `v2.1/a` | **Status STR (Surat Tanda Registrasi) Anda saat ini?** | radio: Aktif / Dalam proses perpanjangan / Belum memiliki | Optional, tag `kemenkes`, `active: false` |
| 8 | Prototype `v2.1/a` | Apakah bidang kerja Anda sesuai dengan kompetensi tenaga kesehatan yang dimiliki? | radio: Sesuai / Tidak sesuai | Optional, tag `kemenkes`, `active: false` |
| 9 | Prototype `v2.1/a` (bank soal terpisah) | Apakah Anda memiliki sertifikat kompetensi/profesi di bidang kesehatan? | radio: Ya / Tidak | Ada di `bankPool`, tag `kemenkes`, belum ditambahkan ke section manapun |

Baris 6-9 bersumber dari `Tracer Study/v2.1/a/kuesioner-builder.html` (salinan **di luar** git) — belum ditemukan di salinan git `tracer-study/v2.1/a/kuesioner-builder.html` yang mtime-nya lebih baru (lihat catatan di bagian 2). Di luar 9 baris ini, tidak ada pertanyaan Kemenkes lain yang tercatat — 7 topik sisanya di tabel riset awal (No. 6-12 pada Tabel A) eksplisit ditandai ❌ untuk Kemenkes, dan belum ada sumber di workspace ini yang mencakup redaksi kuesioner Kemenkes resmi secara utuh/mandiri (mis. screenshot produk resmi Kemenkes).

## 2. Temuan Penting: Perbedaan dengan Desain Kita di Konsep §9

Dua perbedaan signifikan antara **produk yang sudah berjalan** (Kemdiktisaintek) dan **desain yang sedang kita rancang** ([Konsep §9.5-9.6](Konsep-Pertanyaan-Core-Optional-Specific-untuk-Template-Quisioner.md)):

1. **Single-select vs multi-select** — Live site memakai radio button (1 status wajib, tidak bisa pilih lebih dari satu), sedangkan desain kita mengusulkan `STATUS_SAAT_INI` jadi **multi-select** + `STATUS_UTAMA` supaya kasus "Bekerja + Wiraswasta" atau "Bekerja + Melanjutkan Studi" bisa tertangkap apa adanya. Ini **bukan** salah satu yang keliru — ini trade-off nyata yang perlu didiskusikan: multi-select menangkap realita lebih lengkap, tapi mengubah struktur data + tidak otomatis kompatibel dengan histori data yang sudah terkumpul lewat single-select.
2. **"Sedang mencari kerja" tidak punya pertanyaan lanjutan di live site** — padahal di [Pemetaan §2](Pemetaan%20Pertanyaan%20Core%20vs%20Optional%20(Draft%20Seed%20Data).md) kita mengasumsikan grup "proses pencarian kerja" (`MULAI_CARI_KERJA`, `CARA_CARI_KERJA`, `JUMLAH_LAMARAN`, `JUMLAH_RESPON_LAMARAN`, `JUMLAH_WAWANCARA`, `AKTIF_CARI_KERJA_4MGG`, Q5-Q10) itu ada di standar Kemdikti (dari tabel riset awal). Perlu diklarifikasi: apakah 6 pertanyaan itu **memang belum diimplementasikan** di live site saat ini (gap produk), atau **tidak lagi dipakai** di versi Kemdiktisaintek terbaru (standar sudah berubah dari versi awal riset)?

   > ✅ **Terjawab — jawabannya "keduanya salah".** Enam pertanyaan itu **ada** di template resmi `template-pddikti.json`, lengkap dengan kode Dikti. Yang membuatnya tidak terlihat di screenshot adalah flag `is_required`:
   >
   > | Pertanyaan | Kode | `is_required` | Ada di section |
   > |---|---|---|---|
   > | Kapan Anda mulai mencari pekerjaan | `f301` | ❌ false | Bekerja, Wiraswasta, Belum Bekerja |
   > | Bagaimana Anda mencari pekerjaan tersebut | `f4` | ✅ true di Bekerja, ❌ false di Belum Bekerja | Bekerja, Belum Bekerja |
   > | Jumlah perusahaan yang dilamar | `f6` | ❌ false | Bekerja, Belum Bekerja |
   > | Jumlah yang merespons lamaran | `f7` | ❌ false | Bekerja, Belum Bekerja |
   > | Jumlah yang mengundang wawancara | `f7a` | ❌ false | Bekerja, Belum Bekerja |
   > | Aktif mencari pekerjaan 4 minggu terakhir | `f1001` | ✅ **true** | Informasi Umum |
   >
   > Jadi bukan gap produk dan bukan standar yang berubah — pertanyaan tidak wajib memang bisa tidak ditampilkan tergantung konfigurasi template yang dipakai kampus. Yang menarik: **`f1001` justru wajib** dan ada di bagian Informasi Umum (ditanyakan ke semua status), bukan hanya ke yang sedang mencari kerja. Sebelumnya kita menandainya Optional — sudah dikoreksi jadi Core.
   >
   > Cabang "Belum Bekerja" memang benar-benar tidak punya pertanyaan wajib satu pun. Seluruh Section 5 template resmi bernilai `is_required: false`.

## 3. Kriteria & Bobot IKU 2 (Data Baru — Perlu Masuk ke Pemetaan §3)

Dokumen resmi IKU 2 yang dianalisis di folder `quesioner` memuat rumus penilaian yang **belum** tercatat di Pemetaan §3 (sebelumnya cuma ditandai "gap, perlu verifikasi"). Ini jawabannya:

**a. Kriteria bekerja (berdasarkan masa tunggu & gaji vs UMP):**

| Kondisi | Bobot |
|---|---|
| Masa tunggu < 6 bulan **dan** gaji > 1,2× UMP | **1** |
| Masa tunggu < 1 tahun **dan** gaji > 1,2× UMP | **0,8** |
| Masa tunggu < 1 tahun **dan** gaji < 1,2× UMP | **0,6** |

**b. Kategori tempat bekerja** (sudah ada sebagai pilihan di form, bisa free-text kalau tidak sesuai kategori):
- Perusahaan swasta (nasional, multinasional, startup, UMKM, dst.)
- Lembaga/organisasi nirlaba
- Institusi/organisasi multilateral (mis. PBB, UNICEF)
- Instansi Pemerintah, BUMN, atau BUMD

**c. Kriteria berwirausaha:** dropdown posisi/jabatan sudah tersedia di form saat status = Wiraswasta.

**d. Kriteria melanjutkan studi:** surat penerimaan **< 12 bulan** setelah lulus → setara bobot 0,6. Bisa dihitung dari field `Tanggal Masuk` (studi lanjut) yang sudah ada di form.

**e. Gap yang diidentifikasi sendiri oleh tim (di catatan asli, belum terselesaikan):**
- **Bekerja/berwirausaha sebelum lulus** (dengan penghasilan >1,2× UMP → bobot 1; <1,2× UMP → bobot 0,6) — *"belum ditemukan data yang secara eksplisit menunjukkan bahwa responden telah memperoleh pekerjaan sebelum lulus"* pada form saat ini. Alternatif yang diusulkan: bandingkan masa aktif kuliah dengan field "dalam berapa bulan mendapat pekerjaan pertama", tapi ini masih butuh validasi lebih lanjut, belum jadi field eksplisit.

  > ✅ **Terjawab — field eksplisitnya sudah ada.** `template-pddikti.json` Section 1 memuat **"Apakah Anda mendapatkan pekerjaan pertama sebelum lulus?"** dengan kode `f502`, tipe pilihan tunggal Ya/Tidak, `is_required: true`. Tidak perlu didekati secara tidak langsung lewat perbandingan masa aktif kuliah.
  >
  > Yang perlu dicatat: kode `f502` **dipakai dua kali** di section yang sama — untuk pertanyaan Ya/Tidak di atas, dan untuk "Dalam berapa bulan Anda mendapatkan pekerjaan pertama?" (isian angka). Backend perlu membedakannya lewat `answer_type_id` atau `number`, tidak bisa mengandalkan `code` saja.
  >
  > **Kriteria (e)/(f) IKU#2 butuh lebih dari sekadar "pernah bekerja sebelum lulus".** Regulasi mensyaratkan alumni **tetap menjalankan** pekerjaan/usaha itu. Karena itu ditambahkan pertanyaan verifikasi di Wave G1 ("Apakah pekerjaan/usaha sebelum lulus masih Anda jalankan?") — pertanyaan internal tanpa kode Dikti, tidak di-upload. Hanya jawaban "masih di tempat yang sama" / "usaha masih berjalan" yang memenuhi kriteria. Rinciannya di [Bank Soal §8](Bank%20Soal%20&%20Logic%20Interaktif%20-%20Prototype%20KarirLink%20v2.1a.md).

## 4. Perbandingan Level-Topik: KEMDIKTI vs KEMENKES

Tabel dari riset awal, ditambah kolom konfirmasi terhadap live site Kemdiktisaintek:

| Pertanyaan | Kemdikti | Kemenkes | Terverifikasi di Live Site? |
|---|---|---|---|
| Status Anda saat ini? | ✅ | ✅ (melanjutkan studi / sedang bekerja) | ✅ Ya — gate question, single-select |
| Sumber dana pembiayaan kuliah | ✅ | ❌ | *Belum diverifikasi di screenshot* |
| Kompetensi dikuasai saat lulus (A) vs dibutuhkan pekerjaan (B) | ✅ | ✅ | *Belum diverifikasi di screenshot* |
| Penekanan metode pembelajaran di prodi | ✅ | ✅ | *Belum diverifikasi di screenshot* |
| Kapan mulai mencari pekerjaan | ✅ | ❌ | ⚠️ Tidak tercatat pada status "sedang mencari kerja" |
| Bagaimana cara mencari pekerjaan | ✅ | ❌ | ⚠️ Tidak tercatat |
| Jumlah perusahaan yang dilamar | ✅ | ❌ | ⚠️ Tidak tercatat |
| Jumlah yang merespons lamaran | ✅ | ❌ | ⚠️ Tidak tercatat |
| Jumlah yang mengundang wawancara | ✅ | ❌ | ⚠️ Tidak tercatat |
| Aktif mencari kerja 4 minggu terakhir | ✅ | ❌ | ⚠️ Tidak tercatat |
| Alasan kerja tidak sesuai pendidikan | ✅ | ❌ | *Belum diverifikasi di screenshot* |
| *(baru, dari live site)* Lama waktu tunggu kerja pertama | — | — | ✅ Ada (`Dalam berapa bulan Anda mendapatkan pekerjaan pertama?`) |
| *(baru, dari live site)* Pendapatan per bulan (take home pay) | — | — | ✅ Ada |
| *(baru, dari live site)* Lokasi & jenis/nama instansi kerja | — | — | ✅ Ada |
| *(baru, dari live site)* Kesesuaian bidang studi dgn pekerjaan | — | — | ✅ Ada |
| *(baru, dari live site)* Tingkat pendidikan tersesuai utk pekerjaan | — | — | ✅ Ada |

## 5. Rekomendasi Tindak Lanjut

**Sudah selesai:**

- [x] ~~Update [Pemetaan §3](Pemetaan%20Pertanyaan%20Core%20vs%20Optional%20(Draft%20Seed%20Data).md)~~ — keempat item "gap, perlu verifikasi" sudah ditutup; semuanya ada di template resmi dengan kode Dikti.
- [x] ~~Diskusikan ulang keputusan single-select vs multi-select untuk `STATUS_SAAT_INI`~~ — **diputuskan single-select**, mengikuti format resmi. Dua alasannya: (1) jawaban `f8` punya `jump_to_box: true`, artinya mengendalikan percabangan seluruh kuesioner — kalau alumni bisa memilih dua status, sistem tidak tahu cabang mana yang dibuka; (2) IKU#2 menghitung satu status per alumni. Kasus "bekerja sambil kuliah" ditangani lewat **keterangan bantuan** ("pilih yang paling menggambarkan kondisi utama"), bukan lewat multi-select. Keterangan bantuan tidak berkode Dikti jadi bebas disesuaikan kampus.
- [x] ~~Klarifikasi status pertanyaan proses pencarian kerja (Q5-Q10)~~ — lihat catatan di bagian 2 poin 2. Semuanya ada, dibedakan oleh flag `is_required`.
- [x] ~~Tambahkan field eksplisit untuk status bekerja/wirausaha sebelum lulus~~ — sudah ada sebagai `f502`, lihat catatan di bagian 3e.
- [x] ~~Konfirmasi urutan tampil dan tanda wajib di situs resmi Kemdiktisaintek~~ — sudah tertangkap, dipetakan ke kode di §1.1. Sekaligus menemukan empat kolom identitas yang belum pernah ada di mockup (NIK, NPWP, Kode PT, Kode Prodi) dan satu pergeseran makna pada `f6`.

**Masih terbuka:**

- [ ] **Dokumentasikan kuesioner Kemenkes dari live site** — bukan mencari dokumen instrumen (yang memang tidak ada), tapi menangkap layar live site seperti yang dulu dilakukan untuk Kemdikti. Daftar tangkapan yang dibutuhkan di §5.1.
- [ ] **Verifikasi ulang empat pertanyaan Kemenkes di mockup** (faskes, STR, kesesuaian kompetensi, sertifikat profesi). Keempatnya berasal dari prototype `kuesioner-builder.html` v2.1/a, bukan dari live site Kemenkes. Redaksi dan opsinya bisa berubah setelah penangkapan di §5.1 selesai.

### 5.1 Daftar tangkapan yang dibutuhkan dari live site Kemenkes

Supaya sisi Kemenkes bisa naik dari level-topik ke level-redaksi, tangkapan layarnya perlu mencakup hal yang sama seperti yang kita punya untuk Kemdikti. Urutan berikut disusun dari yang paling menentukan.

**Prioritas 1 — menentukan arsitektur:**

| Yang ditangkap | Kenapa penting |
|---|---|
| Pertanyaan status/gate beserta **seluruh opsinya** | Menentukan apakah percabangan Kemenkes sama dengan Kemdikti. Kalau opsinya berbeda, bundle Kemenkes tidak bisa sekadar "tambahan" — perlu logika percabangan sendiri |
| Seluruh pertanyaan lanjutan **per opsi status** | Sama seperti tabel §1 untuk Kemdikti. Ini yang membedakan tambahan sederhana vs cabang paralel |
| Ada/tidaknya penomoran atau kode di antarmuka | Menentukan apakah perlu kolom kode terpisah di skema, atau cukup tanpa kode |

**Prioritas 2 — menentukan redaksi terkunci:**

| Yang ditangkap | Kenapa penting |
|---|---|
| Redaksi tiap pertanyaan | Bukan untuk dicocokkan persis — redaksi boleh disesuaikan (lihat [Mapping Kode Dikti §7.1](Mapping-Kode-Dikti-Tracer-Study.md)). Yang dibutuhkan adalah **maknanya**, supaya bisa dipastikan mana yang beririsan dengan Core Kemdikti dan mana yang benar-benar baru |
| Seluruh opsi jawaban per pertanyaan | Empat pertanyaan Kemenkes di mockup sekarang opsinya masih dugaan dari prototype lama |
| Tanda wajib/tidak wajib di tiap pertanyaan | Menentukan tier Core vs Optional, sama seperti flag `is_required` |

**Prioritas 3 — melengkapi:**

| Yang ditangkap | Kenapa penting |
|---|---|
| Keterangan bantuan di bawah pertanyaan | Boleh disesuaikan kampus, tapi berguna sebagai contoh |
| Halaman selesai / konfirmasi | Membandingkan pengalaman pasca-submit |
| Dokumen bobot penilaian (jika ada) | Padanan dokumen IKU 2 di sisi Kemdikti |

**Yang perlu diperhatikan saat menangkap:** kuesioner Kemdikti hanya menampilkan pertanyaan yang ditandai wajib pada konfigurasi tertentu — pertanyaan tidak wajib bisa tidak muncul. Bisa jadi hal yang sama terjadi di Kemenkes, sehingga tangkapan dari satu akun belum tentu memuat seluruh pertanyaan. Kalau memungkinkan, tangkap dari **lebih dari satu kondisi status** agar cabang yang berbeda terlihat.

**Simpan hasilnya di dalam repo**, misalnya `karirlink/docs/quesioner-kemenkes/`, supaya bisa ditelusuri ulang — pelajaran dari sisi Kemdikti yang folder sumbernya hilang (lihat catatan di bagian 0).

## 6. Penyelarasan Definisi Core — Dokumen Ini vs Mapping Kode Dikti

Bagian 4 dokumen ini menunjukkan irisan Kemdikti ∩ Kemenkes hanya tiga topik: status saat ini, kompetensi A/B, dan metode pembelajaran. Dari sana [Pemetaan §6](Pemetaan%20Pertanyaan%20Core%20vs%20Optional%20(Draft%20Seed%20Data).md) menyimpulkan Core = 3 item.

Kesimpulan itu **tidak lagi dipakai**. Alasannya bukan karena tabelnya salah, tapi karena asumsi di baliknya berubah:

| | Asumsi lama | Yang berlaku sekarang |
|---|---|---|
| Poltekkes lapor ke | Kemenkes saja | **Kemenkes dan PDDikti** |
| Konsekuensi | Core harus irisan dua regulator | Core = kewajiban PDDikti; Kemenkes jadi **tambahan**, bukan pengganti |
| Jumlah Core | 3 | 18 (untuk satu alumni) |

Irisan hanya masuk akal kalau ada kampus yang benar-benar lepas dari format PDDikti. Setelah ditelusuri, Poltekkes tetap perguruan tinggi di bawah PDDikti — IKU#2 berlaku juga untuk mereka. Jadi modelnya **Core (Kemdikti) + delta Kemenkes**.

Satu hal yang kebetulan sudah konsisten: tiga topik yang di-share Kemenkes justru **tidak** diduplikasi di bundle Kemenkes pada mockup, karena sudah ada di Core. Tidak ada pertanyaan redundant.

Penetapan tier yang berlaku ada di [Mapping Kode Dikti §7 & §11](Mapping-Kode-Dikti-Tracer-Study.md).
