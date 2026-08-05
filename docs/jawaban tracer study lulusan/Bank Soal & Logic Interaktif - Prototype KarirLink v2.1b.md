# Bank Soal & Logic Interaktif — Prototype KarirLink v2.1/b

Katalog lengkap seluruh pertanyaan yang benar-benar ada di prototype v2.1/b saat ini, disusun dari:

- **Bank soal (sisi Admin):** `v2.1/b/kuesioner-builder.html` — sumber tunggal untuk kode PDDIKTI, tier (Core/Optional), dan bagian mana yang mengaktifkan pertanyaan apa.
- **Wizard responden (sisi Alumni):** `v2.1/b/tracer-study-form-exit.html` (Exit Survey), `tracer-study-form-gs1.html` (GS-I, 1-2 tahun), `tracer-study-form-gs2.html` (GS-II, 4-5 tahun).

> Dokumen ini menggantikan `Bank Soal & Logic Interaktif - Prototype KarirLink v2.1a copy.md` (mendokumentasikan `v2.1/a`, versi yang lebih lama dan sudah tidak dikembangkan). Di v2.1/b, bank soal admin dan wizard alumni **sudah konsisten satu sama lain** — setiap section di builder benar-benar punya representasi visual (card tersendiri) di wizard, termasuk section yang dulu kosong seperti "Tingkat Kompetensi" dan "Rencana Karier Lanjutan".

## Legenda

| Kolom | Arti |
|---|---|
| **Kode** | Kode resmi PDDIKTI/Kemdikti (format `fXX`) kalau pertanyaan ini terpadankan ke standar resmi. Kode custom seperti `STATUS_UTAMA`, `JUMLAH_PEKERJAAN` dipakai untuk pertanyaan yang murni logic internal (bukan field data ke Kemdikti). |
| **Tipe** | radio (pilihan tunggal) · checkbox (pilihan ganda) · text · textarea · number · date · scale (1-5) |
| **Wajib** | Apakah pertanyaan ini wajib diisi alumni (ditandai `*` di form) |
| **Wave** | Exit = Exit Survey (saat lulus) · GS-I = 1-2 tahun setelah lulus · GS-II = 4-5 tahun setelah lulus |
| **Tier** | Core = kode PDDIKTI wajib, admin tidak bisa nonaktifkan · Optional = admin bisa toggle aktif/nonaktif per section |

---

## 1. Informasi Pribadi *(Core, terkunci — semua wave: Exit, GS-I, GS-II)*

Semua field di section ini **readonly**, otomatis terisi dari SIAKADCLOUD kampus atau akun Karirlink alumni — bukan isian bebas. Section ini identik di ketiga file wizard.

| Pertanyaan | Sumber Data | Tipe | Wajib | Catatan |
|---|---|---|---|---|
| Nama | SIAKADCLOUD | text | Ya |
| NIM | SIAKADCLOUD | text | Ya |
| Jenjang Studi | SIAKADCLOUD | text | Ya |
| Tahun Lulus | SIAKADCLOUD | text | Ya |
| Kode PT | SIAKADCLOUD | text | Ya |
| Kode Program Studi | SIAKADCLOUD | text | Ya |
| Jenis Kelamin | SIAKADCLOUD/akun Karirlink | text | Ya |
| Tanggal Lahir | SIAKADCLOUD/akun Karirlink | date | Ya |
| NIK/No. KTP | SIAKADCLOUD | text | Ya |
| NPWP | SIAKADCLOUD | text | Tidak |
| Alamat Email | SIAKADCLOUD | text | Ya |
| Nomor HP | SIAKADCLOUD | text | Ya |

*Alasan:* data identitas ini tidak masuk akal ditanya ulang ke alumni (sudah tercatat sistem) — kalau ada yang salah, alumni diarahkan memperbarui lewat SIAKADCLOUD/Pengaturan Akun, bukan mengedit langsung di form tracer study.

---

## 2. Informasi Umum *(campur Core — cakupan wave bervariasi per pertanyaan)*

| Pertanyaan | Kode | Tipe | Opsi Jawaban | Wajib | Wave | Alasan/Catatan |
|---|---|---|---|---|---|---|
| Jelaskan status Anda saat ini? | `f8` | checkbox (multi) | Bekerja (full time/part time) · Belum memungkinkan bekerja · Wiraswasta (Wirausaha) · Melanjutkan pendidikan · Tidak kerja, tetapi sedang mencari kerja | Ya | Exit, GS-I, GS-II | Trigger utama seluruh logic kondisional wizard — jawaban di sini menentukan section mana (Bekerja/Wiraswasta/Melanjutkan Pendidikan/Belum Bekerja) yang muncul selanjutnya. |
| Dari status yang dipilih, mana status utama Anda? | `STATUS_UTAMA` | radio | Otomatis mengikuti status yang dicentang di atas | Ya, kalau status dicentang >1 | Exit, GS-I, GS-II | Hanya muncul kalau alumni mencentang lebih dari 1 status sekaligus — perlu 1 status "utama" untuk klasifikasi laporan nasional supaya alumni tidak terhitung ganda. |
| Berapa tempat kerja yang Anda jalani saat ini? | `JUMLAH_PEKERJAAN` | number | — | Ya | Exit, GS-I, GS-II | Menentukan jumlah kartu "Detail Pekerjaan" berulang yang dirender di section Bekerja. |
| Tingkat kompetensi yang dikuasai saat lulus *(Kompetensi A, 7 aspek)* | `f17` (per-aspek `f1761/63/65/67/69/71/73`, ganjil) | scale (1-5) × 7 aspek | Etika · Keahlian Bidang Ilmu · Bahasa Asing · Penggunaan Teknologi Informasi · Komunikasi · Kerja Sama Tim · Pengembangan Diri | Ya | Exit, GS-I *(baru ditambahkan supaya alumni yang lewati Exit Survey tetap punya baseline)* | PDDIKTI Q12 Bagian A: "Pada saat lulus, pada tingkat mana kompetensi ini Anda kuasai?" — jadi baseline pembanding untuk Kompetensi B di section "Tingkat Kompetensi". |
| Pendidikan Orang Tua | `PENDIDIKAN_ORTU` | radio | SD · SMP · SMA/SMK · Diploma · S1 · S2 · S3 · Tidak Sekolah | Tidak | **Exit saja** | Indikator latar belakang sosio-ekonomi, dikumpulkan sekali saat baru lulus. |
| Menurut Anda seberapa besar penekanan pada metode pembelajaran di bawah ini dilaksanakan di program studi Anda? *(7 aspek)* | `f2` (per-aspek `f21`-`f27`) | scale, **1=Sangat Besar … 5=Tidak Sama Sekali** (terbalik dari kebiasaan, sesuai dokumen resmi Kemdikti) | Perkuliahan · Demonstrasi · Partisipasi dalam Proyek Riset · Magang · Praktikum · Kerja Lapangan · Diskusi | Ya | **Exit saja** | Menilai kurikulum/metode ajar program studi — hanya relevan ditanya sekali, tepat saat lulus, karena mengingat pengalaman kuliah yang sudah lewat. |
| Rencana Anda Setelah Lulus | `RENCANA_SETELAH_LULUS` | radio (+ freetext utk "Lainnya") | Bekerja · Melanjutkan Studi · Wirausaha · Belum Ada Rencana · Lainnya | Tidak | **Exit saja** | Menangkap niat alumni sesaat sebelum benar-benar memasuki dunia kerja/lanjut studi. |
| Apakah Anda aktif mencari pekerjaan dalam 4 minggu terakhir? | `f1001` (Lainnya → `f1002`) | radio (+ freetext utk "Lainnya") | Tidak · Tidak, tapi sedang menunggu hasil lamaran kerja · Ya, mulai bekerja dalam 2 minggu ke depan · Ya, tapi belum pasti bekerja dalam 2 minggu ke depan · Lainnya | Tidak | **GS-I, GS-II saja** | Tidak relevan di Exit Survey (alumni belum lulus/baru lulus, belum ada histori pencarian kerja pasca-lulus). |
| Sumber dana apa yang Anda gunakan untuk membiayai kuliah? | `f1201` (Lainnya → `f1202`) | radio (+ freetext utk "Lainnya") | Biaya Sendiri/Keluarga · Beasiswa ADIK · BIDIKMISI · PPA · AFIRMASI · Perusahaan/Swasta · Lainnya | Ya | Exit, GS-I, GS-II | Kode DIKTI wajib, tidak boleh dinonaktifkan admin — bukan ditanya kalau status "Melanjutkan pendidikan" (ada pertanyaan sumber dana terpisah di section itu, `f18a`). |

---

## 3. Bekerja *(Core — GS-I & GS-II saja; muncul kalau status "Bekerja" dicentang)*

| Pertanyaan | Kode | Tipe | Opsi Jawaban | Wajib | Alasan/Catatan |
|---|---|---|---|---|---|
| Apakah Anda telah mendapatkan pekerjaan pertama ini ≤ 6 bulan / termasuk bekerja sebelum lulus? | `f504` | radio | Ya · Tidak | Ya | Jika "Tidak", memicu pertanyaan lanjutan jumlah bulan pasti (`f502`) — kode sama dipakai versi Melanjutkan Pendidikan dengan wording berbeda. |
| Dalam berapa bulan Anda mendapatkan pekerjaan pertama ini? | `f502` | number | — | Tidak (wajib kalau `f504`="Tidak") | Follow-up angka pasti, hanya relevan kalau `f504` dijawab "Tidak" (berarti >6 bulan). |
| Berapa rata-rata pendapatan Anda per bulan (Take Home Pay) saat ini? (Rp) | `f505` | number, format "Rp 1.000.000" | — | Ya | Dasar hitung skor IKU 2 — ambang 1,2× UMP (Kepmen Diktisaintek No. 358/M/2025). |
| Apa jenis perusahaan/instansi/institusi tempat Anda bekerja saat ini? | `f1101` | radio (+ freetext utk "Lainnya", kode sama `f1101`) | Instansi pemerintah · BUMN/BUMD · Institusi/Organisasi Multilateral · Organisasi non-profit/LSM · Perusahaan swasta · Wiraswasta/perusahaan sendiri · Lainnya | Ya | Kategori resmi Kepmen Diktisaintek No. 358/M/2025. |
| Kapan Anda mulai mencari pekerjaan yang Anda jalani saat ini? | `f301` | radio | Sebelum lulus · Sesudah lulus · Saya tidak mencari kerja | Tidak | Trigger 2 follow-up di bawah — hanya salah satu yang tampil tergantung jawaban. |
| Jika sebelum lulus, dalam berapa bulan sebelum lulus mulai mencari pekerjaan? | `f302` | number | — | Tidak | Tampil hanya kalau `f301` = "Sebelum lulus". Tanggal Lulus = tanggal Yudisium. |
| Jika sesudah lulus, dalam berapa bulan sesudah lulus mulai mencari pekerjaan? | `f303` | number | — | Tidak | Tampil hanya kalau `f301` = "Sesudah lulus". |
| Di mana tempat provinsi Anda bekerja saat ini? | `f5a1` | text (dropdown cari, cascading) | 35 provinsi | Ya | Provinsi memfilter pilihan Kabupaten/Kota di bawahnya. |
| Di mana Kabupaten/Kota tempat Anda bekerja saat ini? | `f5a2` | text (dropdown cari, cascading) | 528 kab/kota, terfilter sesuai provinsi | Ya | Nonaktif sampai provinsi dipilih. |
| Apa nama perusahaan/kantor tempat Anda bekerja saat ini? | `f5b` | text | — | Ya | — |
| Apa tingkat tempat kerja Anda saat ini? | `f5d` | radio | Lokal/Wilayah/Berwirausaha tidak Berbadan Hukum · Nasional/Berwirausaha Berbadan Hukum · Multinasional/Internasional | Ya | — |
| Seberapa erat hubungan antara bidang studi dengan pekerjaan Anda saat ini? | `f14` | radio | Sangat Erat · Erat · Cukup Erat · Kurang Erat · Tidak Sama Sekali | Ya | — |
| Tingkat pendidikan apa yang paling tepat/sesuai untuk pekerjaan Anda saat ini? | `f15` | radio | Setingkat Lebih Tinggi · Tingkat yang Sama · Setingkat Lebih Rendah · Tidak Perlu Pendidikan Tinggi | Ya | — |
| Bagaimana Anda mencari pekerjaan tersebut? *(15 opsi, tiap opsi punya kode sendiri)* | `f4` (per-opsi `f401`-`f415`; Lainnya→`f4016`) | checkbox (multi, + freetext utk "Lainnya") | Iklan koran/majalah · Melamar tanpa tahu lowongan · Bursa/pameran kerja · Internet/iklan online · Dihubungi perusahaan · Kemenakertrans · Agen tenaga kerja swasta · Pusat karir kampus · Kantor kemahasiswaan/alumni · Jejaring sejak kuliah · Relasi (dosen/ortu/teman) · Bisnis sendiri · Magang · Tempat sama semasa kuliah · Lainnya | Tidak | Kode DIKTI wajib, tidak dapat dinonaktifkan. |
| Berapa perusahaan/instansi/institusi yang sudah Anda lamar sampai saat ini? | `f6` | number | — | Tidak | Bagian corong (funnel) lamaran kerja — divalidasi harus ≥ jumlah yang merespons. |
| Berapa banyak perusahaan/instansi/institusi yang merespons lamaran Anda sampai saat ini? | `f7` | number | — | Tidak | Divalidasi harus ≤ `f6` dan ≥ `f7a`. |
| Berapa banyak perusahaan/instansi/institusi yang mengundang Anda untuk wawancara sampai saat ini? | `f7a` | number | — | Tidak | Divalidasi harus ≤ `f7`. |
| Jika pekerjaan Anda tidak sesuai pendidikan, mengapa Anda mengambilnya? *(13 opsi, tiap opsi punya kode sendiri)* | `f16` (per-opsi `f1601`-`f1613`; Lainnya→`f1614`) | checkbox (multi, + freetext utk "Lainnya") | Sudah sesuai (eksklusif dgn opsi lain) · Belum dapat yang lebih sesuai · Prospek karir baik · Suka area lain · Dipromosikan · Pendapatan lebih tinggi · Lebih aman/terjamin · Lebih menarik · Jadwal fleksibel · Lokasi dekat rumah · Menjamin keluarga · Awal karir · Lainnya | Tidak | Kode DIKTI wajib. Opsi "sudah sesuai" otomatis membatalkan opsi lain yang dicentang (saling eksklusif secara makna) dan sebaliknya. |

---

## 4. Wiraswasta *(Core — GS-I & GS-II saja; muncul kalau status "Wiraswasta" dicentang)*

Struktur identik dengan section Bekerja, hanya wording disesuaikan konteks usaha sendiri.

| Pertanyaan | Kode | Tipe | Opsi Jawaban | Wajib | Alasan/Catatan |
|---|---|---|---|---|---|
| Status kewirausahaan Anda saat ini? | `f5c` | radio | Founder · Co-Founder · Staff · Freelance/Kerja Lepas | Ya | Menentukan bobot skor IKU 2 (Kepmen 358/M/2025) — beda peran, beda skor. |
| Berapa rata-rata pendapatan Anda dari usaha ini per bulan (Take Home Pay)? (Rp) | `f505` | number, format "Rp" | — | Ya | Sama seperti Bekerja, tapi konteks usaha sendiri. |
| Apa jenis perusahaan/usaha wiraswasta yang Anda kelola saat ini? | `f1101` | radio (+ freetext "Lainnya", kode sama) | (opsi sama dengan versi Bekerja) | Ya | — |
| Kapan Anda mulai merencanakan berwiraswasta? | `f301` | radio | Sebelum lulus · Sesudah lulus · Saya tidak merencanakan berwiraswasta | Tidak | Trigger 2 follow-up di bawah, sama pola dengan versi Bekerja. |
| Jika sebelum lulus, dalam berapa bulan sebelum lulus mulai merencanakannya? | `f302` | number | — | Tidak | Tampil hanya kalau opsi "Sebelum lulus" dipilih. |
| Jika sesudah lulus, dalam berapa bulan sesudah lulus mulai merencanakannya? | `f303` | number | — | Tidak | Tampil hanya kalau opsi "Sesudah lulus" dipilih. |
| Di mana provinsi tempat Anda berwiraswasta saat ini? | `f5a1` | text (dropdown cari, cascading) | 35 provinsi | Ya | — |
| Di mana Kabupaten/Kota tempat Anda berwiraswasta saat ini? | `f5a2` | text (dropdown cari, cascading) | terfilter sesuai provinsi | Ya | — |
| Apa nama perusahaan/kantor tempat Anda berwiraswasta saat ini? | `f5b` | text | — | Ya | — |
| Apa tingkat/ukuran tempat berwiraswasta Anda saat ini? | `f5d` | radio | Lokal · Nasional · Multinasional | Ya | — |
| Seberapa erat hubungan antara bidang studi dengan pekerjaan Anda saat ini? | `f14` | radio | Sangat Erat … Tidak Sama Sekali | Ya | — |
| Tingkat pendidikan apa yang paling tepat/sesuai untuk pekerjaan Anda saat ini? | `f15` | radio | Setingkat Lebih Tinggi … Tidak Perlu Pendidikan Tinggi | Ya | — |
| Jika pekerjaan tidak sesuai pendidikan, mengapa Anda mengambilnya? *(13 opsi berkode)* | `f16` (per-opsi `f1601`-`f1613`; Lainnya→`f1614`) | checkbox (multi, + freetext) | (opsi sama dengan versi Bekerja) | Tidak | Sama seperti versi Bekerja, termasuk logic saling eksklusif opsi "sudah sesuai". |

---

## 5. Melanjutkan Pendidikan *(Core — GS-I & GS-II saja; muncul kalau status "Melanjutkan pendidikan" dicentang)*

| Pertanyaan | Kode | Tipe | Opsi Jawaban | Wajib | Alasan/Catatan |
|---|---|---|---|---|---|
| Kapan Anda menerima surat penerimaan studi lanjut? | `f18d` | date | — | Ya | Kriteria IKU 2: diterima <12 bulan sejak kelulusan dihitung sebagai outcome positif (Kepmen 358/M/2025). |
| Apakah Anda telah melanjutkan pendidikan ini ≤ 6 bulan / termasuk studi lanjut sebelum lulus? | `f504` | radio | Ya · Tidak | Ya | Versi "Melanjutkan Pendidikan" dari pertanyaan yang sama di section Bekerja — kode identik, wording disesuaikan konteks studi. |
| Dalam berapa bulan Anda mulai melanjutkan studi ini? | `f502` | number | — | Tidak (wajib kalau `f504`="Tidak") | Follow-up, sama pola dengan section Bekerja. |
| Jenjang Studi Lanjut | `JENJANG_STUDI_LANJUT` | radio | S1 · S2 · S3 · Profesi | Ya | — |
| Dari manakah sumber biaya studi lanjut Anda | `f18a` | radio | Biaya Sendiri · Beasiswa | Ya | Terpisah dari `f1201` (sumber dana kuliah S1) di Informasi Umum. |
| Apa nama Perguruan Tinggi tempat Anda melanjutkan Pendidikan? | `f18b` | text | — | Ya | — |
| Apa nama program studi yang Anda ambil dalam melanjutkan pendidikan? | `f18c` | text | — | Ya | — |
| Seberapa erat hubungan antara bidang studi dengan pendidikan Anda? | `f14` | radio | Sangat Erat … Tidak Sama Sekali | Ya | — |

---

## 6. Belum Bekerja *(Core + Optional — GS-I & GS-II saja; muncul kalau status yang dicentang HANYA "Belum memungkinkan bekerja" dan/atau "Tidak kerja, tetapi sedang mencari kerja")*

### Core

| Pertanyaan | Kode | Tipe | Opsi Jawaban | Wajib | Alasan/Catatan |
|---|---|---|---|---|---|
| Kapan Anda mulai mencari pekerjaan? | `f301` | radio | Sebelum lulus · Sesudah lulus · Saya tidak mencari kerja | Tidak | Sama pola dengan section Bekerja. |
| Jika sebelum lulus, dalam berapa bulan sebelum lulus mulai mencari pekerjaan? | `f302` | number | — | Tidak | — |
| Jika sesudah lulus, dalam berapa bulan sesudah lulus mulai mencari pekerjaan? | `f303` | number | — | Tidak | — |
| Bagaimana Anda mencari pekerjaan tersebut? *(15 opsi berkode)* | `f4` (per-opsi `f401`-`f415`; Lainnya→`f4016`) | checkbox (multi, + freetext) | (opsi sama dengan section Bekerja) | Tidak | Kode DIKTI wajib. |
| Berapa perusahaan/instansi/institusi yang sudah Anda lamar sampai saat ini? | `f6` | number | — | Tidak | Bagian corong lamaran kerja, sama seperti section Bekerja. |
| Berapa banyak yang merespons lamaran Anda sampai saat ini? | `f7` | number | — | Tidak | — |
| Berapa banyak yang mengundang Anda untuk wawancara sampai saat ini? | `f7a` | number | — | Tidak | — |

### Optional (default aktif — bank soal id 108, 109)

| Pertanyaan | Tipe | Opsi Jawaban | Regulator | Alasan pertanyaan ini ada |
|---|---|---|---|---|
| Apa alasan utama Anda belum bekerja saat ini? | radio | Belum ada lowongan yang sesuai · Sedang mempersiapkan diri (kursus/sertifikasi) · Kondisi kesehatan/keluarga · Belum berminat bekerja saat ini · Lainnya | *(tidak ada mandat regulator)* | Tidak ada padanan resmi di dokumen Kemdikti/Kemenkes untuk topik "Belum Bekerja" — pertanyaan ditulis sebagai *insight institusi* murni, supaya section ini tidak kosong sama sekali dan kampus tetap dapat data untuk program pembinaan alumni. |
| Apakah Anda berencana aktif mencari kerja dalam 6 bulan ke depan? | radio | Ya · Tidak · Belum yakin | *(tidak ada mandat regulator)* | Sama seperti di atas — insight institusi untuk merancang program job-matching/pembinaan lanjutan. |

---

## 7. Tingkat Kompetensi *(Core + Optional — GS-I & GS-II saja)*

### Core

| Pertanyaan | Kode | Tipe | Wajib | Alasan/Catatan |
|---|---|---|---|---|
| Tingkat kompetensi yang dibutuhkan pekerjaan/kegiatan Anda saat ini *(Kompetensi B, 7 aspek sama seperti Kompetensi A)* | `f17` (per-aspek `f1762/64/66/68/70/72/74`, genap) | scale (1-5) × 7 aspek | Ya | PDDIKTI Q12 Bagian B: "Pada saat ini, pada tingkat mana kompetensi ini diperlukan dalam pekerjaan?" — dibandingkan dengan Kompetensi A (section Informasi Umum) untuk mengukur kesenjangan kompetensi (competency gap). GS-I menampilkan tabel referensi read-only jawaban Kompetensi A dari Exit Survey untuk perbandingan langsung; GS-II menampilkan tren 2 titik data (Exit → GS-I). |

### Optional (default aktif — bank soal id 13, 15, 16, 17, 105, 106, 107)

| Pertanyaan | Tipe | Opsi Jawaban | Regulator | Alasan pertanyaan ini ada |
|---|---|---|---|---|
| Apakah bidang kerja Anda sesuai dengan kompetensi tenaga kesehatan yang dimiliki? | radio | Sesuai · Tidak sesuai | Kemenkes | Mandat Kemenkes untuk memantau kesesuaian kerja tenaga kesehatan dengan kompetensi profesinya — relevan terutama untuk prodi kesehatan. |
| Seberapa sesuai pekerjaan Anda saat ini dengan bidang studi Anda? | scale (1-5) | — | BAN-PT | Indikator akreditasi BAN-PT untuk relevansi kurikulum vs dunia kerja. |
| Saran perbaikan untuk program studi/kurikulum | textarea | — | BAN-PT, LAM | Masukan kualitatif untuk evaluasi kurikulum, dibutuhkan dua lembaga akreditasi sekaligus. |
| Bagaimana Anda menilai kesiapan kerja lulusan program studi ini secara umum? | scale (1-5) | — | LAM | Indikator akreditasi LAM (Lembaga Akreditasi Mandiri) soal *job readiness* lulusan. |
| Seberapa besar otonomi/kebebasan Anda dalam mengambil keputusan di pekerjaan Anda? | scale (1-5) | — | BAN-PT, LAM | Indikator kualitas penempatan kerja (bukan cuma "dapat kerja", tapi seberapa bermakna perannya). |
| Seberapa puas Anda dengan pekerjaan Anda secara keseluruhan? | scale (1-5) | — | BAN-PT, LAM | Indikator kepuasan kerja — pelengkap data kuantitatif (gaji, jabatan) dengan persepsi subjektif alumni. |
| Seberapa besar kompetensi yang Anda peroleh selama kuliah dimanfaatkan dalam pekerjaan Anda saat ini? | scale (1-5) | — | BAN-PT, LAM | Mengukur *utilization* kompetensi — beda dari "kesesuaian bidang studi" (f14), ini soal seberapa banyak ilmu kuliah benar-benar terpakai. |

*Kenapa ketujuh optional ini didefaultkan aktif di section ini:* semuanya sama-sama mengukur "kecocokan/pemanfaatan kompetensi", topik yang sama persis dengan pertanyaan Core "Kompetensi B" di section ini — jadi ditempatkan bersama alih-alih dibiarkan menganggur di Bank Optional modal.

---

## 8. Rencana Karier Lanjutan *(Optional saja — GS-II saja; tidak ada pertanyaan Core)*

| Pertanyaan | Tipe | Opsi Jawaban | Regulator | Alasan pertanyaan ini ada |
|---|---|---|---|---|
| Apa rencana pengembangan karier Anda dalam 1-2 tahun ke depan? | checkbox (multi) | Melanjutkan pendidikan (S2/S3/Profesi) · Pindah ke pekerjaan/bidang lain · Mengembangkan usaha sendiri · Mengambil sertifikasi/pelatihan profesi tambahan · Tetap di posisi saat ini · Belum ada rencana khusus | *(tidak ada mandat regulator)* | Tidak ada padanan resmi Kemdikti/Kemenkes untuk topik ini — insight institusi supaya kampus tahu arah karier alumni jangka menengah, berguna untuk program alumni relations. |
| Dukungan apa yang paling Anda butuhkan dari kampus untuk pengembangan karier ke depan? | textarea | — | *(tidak ada mandat regulator)* | Sama seperti di atas — masukan kualitatif untuk merancang layanan karir/alumni. |

*Kenapa hanya muncul di GS-II:* pertanyaan tentang rencana karier jangka menengah baru relevan setelah alumni cukup lama berkarier (4-5 tahun) untuk punya gambaran arah pengembangan diri; di GS-I (1-2 tahun) atau Exit Survey terlalu dini untuk ditanya.

---

## 9. Bank Soal Optional — belum aktif di section manapun *(admin perlu aktifkan manual lewat "Tambah dari Bank Optional")*

| ID | Pertanyaan | Tipe | Opsi Jawaban | Regulator | Kategori | Kenapa belum aktif default |
|---|---|---|---|---|---|---|
| 11 | Apakah Anda bekerja di fasilitas kesehatan? | radio | Ya · Tidak | Kemenkes | Kesesuaian Kerja | Hanya relevan untuk prodi kesehatan — admin institusi non-kesehatan tidak perlu, jadi dibiarkan opsional di bank soal, bukan default aktif di section Bekerja/Wiraswasta. |
| 12 | Status STR (Surat Tanda Registrasi) Anda saat ini? | radio | Aktif · Dalam proses perpanjangan · Belum memiliki | Kemenkes | Kesesuaian Kerja | Sama seperti di atas — spesifik profesi kesehatan berlisensi (dokter, perawat, dll). |
| 14 | Berapa lama waktu tunggu Anda mendapatkan pekerjaan pertama? (bulan) | number | — | IKU PTN | Transisi Kerja | Konsep serupa sudah tercakup kode resmi PDDIKTI `f502`/`f504` (section Bekerja/Melanjutkan Pendidikan) — item ini adalah versi metrik IKU PTN yang lebih generik, disediakan untuk institusi yang butuh pelaporan format IKU PTN terpisah dari PDDIKTI. |
| 104 | Apakah Anda memiliki sertifikat kompetensi/profesi di bidang kesehatan? | radio | Ya · Tidak | Kemenkes | Kesesuaian Kerja | Sama seperti id 11/12 — spesifik prodi kesehatan. |

---

## 10. Ringkasan Logic Interaktif Kunci

| Logic | Mekanisme |
|---|---|
| Status ganda → Status Utama | Mencentang >1 status di "Jelaskan status Anda saat ini?" memunculkan pertanyaan "Status Utama" dengan opsi dibatasi hanya ke status-status yang dicentang. |
| Status saling bertentangan diblokir | "Bekerja"/"Wiraswasta" (sedang bekerja) tidak bisa dicentang bersamaan dengan "Belum memungkinkan bekerja"/"Tidak kerja, mencari kerja" (sedang tidak bekerja) — otomatis membatalkan salah satu lewat `resolveStatusConflict()`. |
| Section kondisional Halaman 2 | `block-pekerjaan` tampil kalau status "Bekerja" ATAU "Wiraswasta"; `block-studi` kalau "Melanjutkan pendidikan"; `block-usaha` kalau "Wiraswasta" (tambahan, bukan pengganti `block-pekerjaan`); `block-none` kalau cuma "Belum memungkinkan bekerja"/"Tidak kerja, mencari kerja" yang dicentang — union per status, bukan exclusive. |
| Submit langsung tanpa Halaman 2 kosong | Kalau status yang dicentang cuma "Belum memungkinkan bekerja" dan/atau "Tidak kerja, mencari kerja" (Halaman 2 cuma akan menampilkan pesan statis, tanpa field), tombol "Selanjutnya" berubah jadi "Kirim Jawaban" — submit langsung tanpa memaksa klik ke halaman kosong. |
| `f504` → `f502` conditional | "Apakah sudah dapat kerja/lanjut studi ≤6 bulan?" dijawab "Tidak" memicu field angka pasti "Dalam berapa bulan...?"; dijawab "Ya" menyembunyikan & mengosongkan field tsb. |
| `f301` → `f302`/`f303` conditional | "Kapan mulai mencari kerja?" — pilih "Sebelum lulus" memunculkan field `f302`, pilih "Sesudah lulus" memunculkan `f303`, keduanya tidak pernah tampil bersamaan. |
| Opsi "Lainnya" selalu ada freetext | Setiap pertanyaan radio/checkbox dengan opsi "Lainnya" memunculkan field teks bebas begitu opsi itu dipilih/dicentang — berlaku generik lewat `toggleLainnyaField()`, termasuk untuk checkbox-group (fix supaya centang opsi lain di grup yang sama tidak ikut menyembunyikan field freetext). |
| Opsi eksklusif dalam checklist (`f16`/`f16usaha`) | Opsi "Pekerjaan sudah sesuai pendidikan" saling meniadakan dengan semua opsi alasan ketidaksesuaian lainnya di grup yang sama — mencentang satu otomatis membatalkan yang lain (`handleExclusiveOption()`). |
| Dropdown Provinsi → Kabupaten/Kota cascading | Pilih provinsi memfilter & mengaktifkan dropdown Kabupaten/Kota (Choices.js, searchable); dropdown Kab/Kota nonaktif dan kosong sebelum provinsi dipilih. |
| Corong (funnel) lamaran kerja | `f6` (jumlah dilamar) ≥ `f7` (jumlah merespons) ≥ `f7a` (jumlah wawancara) — divalidasi agar tidak logis kalau dibalik. |
| Format mata uang Rupiah | Field gaji/pendapatan (`f505`) pakai badge "Rp" terpisah + live-format titik ribuan saat mengetik (mis. ketik "1000000" tampil "1.000.000"). |
| Kode per-aspek pada pertanyaan matriks | Pertanyaan skala multi-aspek (Kompetensi A/B, Metode Pembelajaran) dan checklist panjang (`f4`, `f16`) sebenarnya py kode PDDIKTI **per baris/opsi**, bukan satu kode untuk seluruh pertanyaan — builder menampilkan kode ini di tiap baris supaya admin tidak salah kira cuma ada 1 kode. |
| Skala terbalik "Penekanan Metode Pembelajaran" | Satu-satunya pertanyaan dengan arah skala 1=Sangat Besar…5=Tidak Sama Sekali (kebalik dari skala 1-5 lain di form yang selalu 1=rendah…5=tinggi) — ditandai caption eksplisit di kedua ujung skala supaya alumni tidak salah isi. |

---

*Dokumen ini dihasilkan dari pembacaan langsung `v2.1/b/kuesioner-builder.html`, `tracer-study-form-exit.html`, `tracer-study-form-gs1.html`, dan `tracer-study-form-gs2.html` per kondisi terakhir prototype — bukan dari draft/rencana. Kalau ada perubahan lanjutan di keempat file itu, tabel ini perlu di-refresh manual (belum ada mekanisme generate otomatis).*
