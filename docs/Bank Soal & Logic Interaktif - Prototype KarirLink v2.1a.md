# Bank Soal & Logic Interaktif — Prototype KarirLink v2.1/a

Dokumentasi lengkap dari 2 file prototype yang ditemukan lewat pencarian "STR" sebelumnya:

- **Bank soal (sisi Admin):** `Tracer Study/v2.1/a/kuesioner-builder.html`
- **Wizard interaktif (sisi Responden):** `Tracer Study/v2.1/a/tracer-study-form.html`

> ⚠️ Kedua file ini adalah **mockup statis terpisah**, belum terhubung end-to-end — wizard responden (`tracer-study-form.html`) berisi pertanyaan yang di-hardcode, **tidak** menarik secara dinamis dari konfigurasi Optional/regulatorTags yang ada di bank soal admin. Jadi pertanyaan bertag `kemenkes`/`ikuptn`/`banpt`/`lam` yang ada di bank soal (bagian 1) **belum muncul** di wizard responden manapun (bagian 2) — baru sebatas tersedia untuk admin pilih di builder, belum ada contoh render-nya ke responden.

## 1. Seluruh Bank Soal (dari `kuesioner-builder.html`)

### Section 1 — Informasi Pribadi (Core, terkunci, tidak bisa dihapus)

| ID | Pertanyaan | Tipe | Wajib |
|---|---|---|---|
| 1 | Alamat Email | text | Ya |
| 2 | Nomor HP | text | Ya |
| 3 | NIK/No. KTP | text | Ya |
| 4 | NPWP | text | Tidak |

### Section 2 — Informasi Umum (campur Core + Optional)

Pertanyaan "Jelaskan status Anda saat ini?” — cocok jadi gate question yang menentukan section optional mana yang tampil:

flowchart TD
    S["Core: Status Anda saat ini?"] -->|Bekerja full/part time| G1["Section: Pekerjaan Saat Ini\n(Core + Optional aktif)"]
    S -->|Wiraswasta| G2["Section: Wirausaha\n(Optional, jika diaktifkan admin)"]
    S -->|Melanjutkan pendidikan| G3["Section: Studi Lanjut\n(Optional)"]
    S -->|Sedang mencari kerja| G4["Section: Proses Pencarian Kerja\nOptional: kapan mulai cari,\njumlah lamaran, respon, wawancara"]
    S -->|Belum memungkinkan bekerja| G5["Section: Alasan Belum Bekerja\n(Optional)"]

    G1 --> Sesuai{"Pekerjaan sesuai\ndengan pendidikan?"}
    Sesuai -->|Tidak| G6["Optional: Alasan mengambil\npekerjaan yang tidak sesuai"]
    Sesuai -->|Ya| Done(["Lanjut ke section berikutnya"])
    G6 --> Done

| ID | Tier | Tag Regulator | Pertanyaan | Tipe | Opsi Jawaban | Wajib | Aktif Default |
|---|---|---|---|---|---|---|---|
| 5 | Core | — | Status Anda saat ini? | checkbox (multi-select) | Bekerja (full time/part time) · Wiraswasta (Wirausaha) · Melanjutkan pendidikan · Tidak kerja, tetapi sedang mencari kerja · Belum memungkinkan bekerja | Ya | — |
| 6 | Core | — | Dari status yang dipilih, mana status utama Anda? *(kalau memilih lebih dari satu)* | radio | *(placeholder statis di builder: "Sesuai status yang dicentang di atas"; opsi sebenarnya di-generate dinamis — lihat bagian 2)* | Ya | — |
| 7 | Optional | `kemdikbud` | Sumber dana apa yang Anda gunakan untuk membiayai kuliah? | radio | Biaya Sendiri/Keluarga · Beasiswa ADIK · BIDIKMISI · PPA | Ya | Nonaktif |
| 8 | Optional | `kemdikbud` | Kapan Anda mulai mencari pekerjaan? | text | — | Tidak | Nonaktif |
| 9 | Optional | `kemdikbud` | Bagaimana cara Anda mencari pekerjaan? | text | — | Tidak | Nonaktif |
| 10 | Optional | `kemdikbud` | Berapa perusahaan yang sudah Anda lamar? | number | — | Tidak | Nonaktif |
| 11 | Optional | `kemenkes` | Apakah Anda bekerja di fasilitas kesehatan? | radio | Ya · Tidak | Tidak | Nonaktif |
| **12** | **Optional** | **`kemenkes`** | **Status STR (Surat Tanda Registrasi) Anda saat ini?** | radio | Aktif · Dalam proses perpanjangan · Belum memiliki | Tidak | Nonaktif |
| 13 | Optional | `kemenkes` | Apakah bidang kerja Anda sesuai dengan kompetensi tenaga kesehatan yang dimiliki? | radio | Sesuai · Tidak sesuai | Tidak | Nonaktif |
| 14 | Optional | `ikuptn` | Berapa lama waktu tunggu Anda mendapatkan pekerjaan pertama? (bulan) | number | — | Tidak | Nonaktif |
| 15 | Optional | `banpt` | Seberapa besar pekerjaan Anda sesuai dengan bidang pendidikan? | scale (1-5) | — | Tidak | Nonaktif |
| 16 | Optional | `banpt`, `lam` | Saran perbaikan untuk program studi/kurikulum | textarea | — | Tidak | Nonaktif |
| 17 | Optional | `lam` | Bagaimana Anda menilai kesiapan kerja lulusan program studi ini secara umum? | scale (1-5) | — | Tidak | Nonaktif |
| 18 | Core | — | Berapa tempat kerja yang Anda jalani saat ini? | number | — | Ya | — |
| 19 | Core | — | Tingkat kompetensi yang dikuasai saat lulus | scale (1-5) | — | Ya | — |

### Section 3-8 — Placeholder Kosong (belum ada soal terpasang)

Bagian ini ada namanya di builder tapi **belum diisi pertanyaan apapun** — admin perlu menambah dari Bank Soal Optional (bagian 1.2) atau menulis Specific sendiri:

- Bekerja
- Wiraswasta
- Melanjutkan Pendidikan
- Belum Bekerja
- Tingkat Kompetensi
- Rencana Karier Lanjutan

### 1.2 — Bank Soal Optional (belum ditambahkan ke section manapun / `bankPool`)

| ID | Tag Regulator | Pertanyaan | Tipe | Opsi Jawaban |
|---|---|---|---|---|
| 101 | `kemdikbud` | Berapa yang merespons lamaran Anda? | number | — |
| 102 | `kemdikbud` | Berapa yang mengundang wawancara? | number | — |
| 103 | `kemdikbud` | Jika pekerjaan tidak sesuai pendidikan, mengapa Anda mengambilnya? | textarea | — |
| 104 | `kemenkes` | Apakah Anda memiliki sertifikat kompetensi/profesi di bidang kesehatan? | radio | Ya · Tidak |
| 105 | `banpt`, `lam` | Seberapa besar otonomi/kebebasan dalam pekerjaan Anda saat ini? | scale (1-5) | — |
| 106 | `banpt`, `lam` | Seberapa puas Anda dengan pekerjaan saat ini secara keseluruhan? | scale (1-5) | — |

**Label regulator yang dipakai di builder:** `kemdikbud` → Kemdikbud · `kemenkes` → Kemenkes · `ikuptn` → IKU PTN · `banpt` → BAN-PT · `lam` → LAM.

**Total pertanyaan di seluruh bank soal (termasuk bankPool):** 25 item (ID 1-19 + 101-106).

### 1.3 Status Cakupan — Seluruh Pertanyaan KEMDIKTI vs Bank Soal Prototype

Mencocokkan **semua 32 baris** di [Komparasi §1a Tabel A](Komparasi%20Kuesioner%20KEMDIKTI%20(Kemdiktisaintek)%20vs%20KEMENKES.md) terhadap bank soal + wizard prototype ini, supaya tidak ada satupun pertanyaan KEMDIKTI yang diam-diam hilang dari dokumentasi:

| Tabel A No. | Pertanyaan | Status di Prototype |
|---|---|---|
| 1 | Jelaskan status Anda saat ini? | ✅ Ada — `id 5` (Core, checkbox multi-select; live site pakai single-select radio) |
| 2 | Sebutkan sumber dana pembiayaan kuliah | ✅ Ada — `id 7` (Optional/kemdikbud, 4 opsi) **dan** wizard `Q6` (7 opsi) — opsi tidak sinkron, lihat bagian 3 |
| 3 | Kompetensi dikuasai saat lulus (bagian A) | ⚠️ Ada tapi disederhanakan — `id 19` "Tingkat kompetensi yang dikuasai saat lulus" (1 scale gabungan, tidak dipecah per aspek) |
| 4 | Kompetensi dibutuhkan pekerjaan saat ini (bagian B) | ❌ Belum ada field terpisah di bank soal manapun |
| 5 | Penekanan metode pembelajaran di prodi | ❌ Belum ada sama sekali di prototype |
| 6 | Kapan mulai mencari pekerjaan | ✅ Ada — `id 8` (Optional/kemdikbud) |
| 7 | Bagaimana cara mencari pekerjaan | ✅ Ada — `id 9` (Optional/kemdikbud) |
| 8 | Jumlah perusahaan dilamar | ✅ Ada — `id 10` (Optional/kemdikbud) |
| 9 | Jumlah yang merespons lamaran | ✅ Ada — `id 101` (bankPool/kemdikbud) |
| 10 | Jumlah yang mengundang wawancara | ✅ Ada — `id 102` (bankPool/kemdikbud) |
| 11 | Aktif mencari kerja 4 minggu terakhir | ⚠️ Ada versi berbeda — wizard `Q9` (Core, 5 opsi granular), tapi **tidak** ada sebagai Optional/kemdikbud terpisah di builder sesuai redaksi asli |
| 12 | Alasan kerja tidak sesuai pendidikan | ✅ Ada — `id 103` (bankPool/kemdikbud) |
| 13 | *(live site)* Dalam berapa bulan dapat pekerjaan pertama | ⚠️ Ada versi digabung — wizard `Q7`+`Q8` ("pekerjaan/pendidikan sebelum lulus" + waktu tunggu), tidak spesifik per-pekerjaan |
| 14 | *(live site)* Pendapatan per bulan (take home pay) | ✅ Ada — field `Gaji` di kartu repeatable pekerjaan |
| 15 | *(live site)* Lokasi tempat bekerja | ❌ Belum ada field lokasi di kartu pekerjaan |
| 16 | *(live site)* Jenis perusahaan/instansi tempat bekerja | ❌ Belum ada (kartu pekerjaan tidak punya field kategori instansi) |
| 17 | *(live site)* Nama perusahaan/kantor | ✅ Ada — field `Instansi/Perusahaan` di kartu repeatable |
| 18 | *(live site)* Tingkat tempat kerja | ❌ Belum ada |
| 19 | *(live site)* Keeratan bidang studi dgn pekerjaan | ⚠️ Ada, tapi cuma bertag `banpt` bukan `kemdikbud` — `id 15` builder "Seberapa besar pekerjaan Anda sesuai dengan bidang pendidikan?" (scale) |
| 20 | *(live site)* Tingkat pendidikan tersesuai utk pekerjaan | ❌ Belum ada |
| 21 | *(live site)* Belum memungkinkan bekerja — tanpa lanjutan | ✅ Konsisten — `block-none` di wizard tidak menampilkan field tambahan |
| 22 | *(live site)* Bulan mulai wiraswasta | ❌ Belum ada di `block-usaha` |
| 23 | *(live site)* Pendapatan wiraswasta per bulan | ⚠️ Kemungkinan numpang di field `Gaji` kartu pekerjaan (karena `block-pekerjaan` ikut tampil saat wiraswasta dicentang), tapi tidak eksplisit dipisah dari status "bekerja" |
| 24-25 | *(live site)* Lokasi usaha (Provinsi/Kota-Kabupaten) | ❌ Belum ada di `block-usaha` (cuma ada field `Bidang Usaha`) |
| 26 | *(live site)* Posisi/jabatan saat wiraswasta | ❌ Belum ada — opsi `Status Kerja` di kartu pekerjaan cuma Full-time/Part-time/Kontrak/Freelance, **tidak ada opsi "Pemilik Usaha"** |
| 27 | *(live site)* Tingkat tempat kerja (wiraswasta) | ❌ Belum ada |
| 28 | *(live site)* Sumber biaya studi lanjut | ❌ Belum ada di `block-studi` (cuma ada field `Jenjang Studi Lanjut`) |
| 29 | *(live site)* Nama Perguruan Tinggi studi lanjut | ❌ Belum ada |
| 30 | *(live site)* Program Studi lanjut | ❌ Belum ada |
| 31 | *(live site)* Tanggal Masuk studi lanjut | ❌ Belum ada |
| 32 | *(live site)* Tidak kerja tapi sedang mencari kerja — tanpa lanjutan | ✅ Konsisten — `block-none` juga mencakup status ini |

**Ringkasan:** dari 32 pertanyaan KEMDIKTI, **12 penuh ada**, **5 ada tapi beda bentuk/redaksi**, **15 belum ada sama sekali** di prototype — mayoritas yang hilang ada di cabang Wiraswasta (5/6 field) dan Melanjutkan Pendidikan (4/4 field), karena `block-usaha` dan `block-studi` di wizard baru berisi 1 field masing-masing, jauh lebih sederhana dari redaksi live site Kemdiktisaintek.

### 1.4 Status Cakupan — Seluruh Pertanyaan KEMENKES vs Bank Soal Prototype

Mencocokkan **semua 9 baris** di [Komparasi §1a Tabel B](Komparasi%20Kuesioner%20KEMDIKTI%20(Kemdiktisaintek)%20vs%20KEMENKES.md):

| Tabel B No. | Pertanyaan | Status di Prototype |
|---|---|---|
| 1 | Apakah Anda saat ini sedang melanjutkan studi? *(dugaan)* | ⚠️ Konsepnya tercakup di `id 5` (Status Anda saat ini, opsi "Melanjutkan pendidikan"), tapi tidak sebagai pertanyaan Ya/Tidak terpisah |
| 2 | Apakah Anda saat ini sedang bekerja? *(dugaan)* | ⚠️ Sama — tercakup sebagai salah satu opsi `id 5`, bukan pertanyaan Ya/Tidak sendiri |
| 3 | Kompetensi dikuasai saat lulus (bagian A) | ⚠️ Sama seperti Tabel A No. 3 — `id 19`, digabung jadi 1 scale |
| 4 | Kompetensi dibutuhkan pekerjaan saat ini (bagian B) | ❌ Belum ada, sama seperti Tabel A No. 4 |
| 5 | Penekanan metode pembelajaran di prodi | ❌ Belum ada, sama seperti Tabel A No. 5 |
| 6 | Apakah Anda bekerja di fasilitas kesehatan? | ✅ Ada — `id 11` (Optional/kemenkes) |
| 7 | **Status STR (Surat Tanda Registrasi) Anda saat ini?** | ✅ Ada — `id 12` (Optional/kemenkes) |
| 8 | Apakah bidang kerja sesuai kompetensi tenaga kesehatan? | ✅ Ada — `id 13` (Optional/kemenkes) |
| 9 | Apakah punya sertifikat kompetensi/profesi bidang kesehatan? | ✅ Ada — `id 104` (bankPool/kemenkes) |

**Ringkasan:** dari 9 pertanyaan KEMENKES, **4 penuh ada** (semuanya yang ditemukan lewat penelusuran STR), **2 tercakup implisit lewat status gate**, **3 belum ada** (kompetensi bagian B, metode pembelajaran, dan status melanjutkan-studi/bekerja sbg pertanyaan Ya/Tidak terpisah — sama persis dengan 3 gap yang juga berlaku di sisi Kemdikti).

## 2. Logic Interaktif Nyata (dari `tracer-study-form.html` — wizard 2 halaman)

Wizard ini adalah **contoh render statis** dengan Q1-9 hardcode (bukan hasil generate dinamis dari bank soal admin) — beberapa redaksi/opsi sedikit berbeda dari bank soal builder (dicatat di bagian 3).

### Halaman 1 — Informasi Pribadi + Informasi Umum

| No | Pertanyaan | Cara Menjawab | Opsi | Logic Interaktif |
|---|---|---|---|---|
| 1 | Alamat Email | text, **readonly** (sudah terisi otomatis) | — | Tidak bisa diedit responden |
| 2 | Nomor HP | text input | — | Wajib |
| 3 | NIK/No. KTP | text input, maks 16 digit, numeric | — | Wajib |
| 4 | NPWP | text input | — | Opsional |
| 5 | Status Anda saat ini? | **checkbox, multi-select** | Bekerja (full time/part time) · Wiraswasta (Wirausaha) · Melanjutkan pendidikan · Tidak kerja tetapi sedang mencari kerja · Belum memungkinkan bekerja | Tiap centang memanggil `handleStatusChange()` → memicu Q5a **dan** merekalkulasi blok halaman 2 (`recomputeTransisiKerja()`) |
| 5a | Dari status yang Anda pilih, mana status utama Anda? | radio, **hanya muncul kalau Q5 dicentang >1** | *Opsi di-generate dinamis* = persis status-status yang dicentang di Q5 (kalau centang "Bekerja" + "Melanjutkan pendidikan", opsi radio-nya cuma 2 itu) | `display:none` default; construct via `updateStatusUtama()`. Kalau responden uncheck sampai cuma 1 status tersisa, blok ini otomatis disembunyikan lagi & pilihan dikosongkan |
| 6 | Sumber dana apa yang Anda gunakan untuk membiayai kuliah? | radio, single-select | Biaya Sendiri/Keluarga · Beasiswa ADIK · Beasiswa BIDIKMISI · Beasiswa PPA · Beasiswa AFIRMASI · Beasiswa Perusahaan/Swasta · Lainnya | 7 opsi (lebih banyak dari bank soal builder yang cuma 4 — lihat bagian 3) |
| 7 | Apakah Anda mendapatkan pekerjaan pertama / melanjutkan pendidikan sebelum lulus? | radio, single-select | Ya · Tidak | Memanggil `applyQ7Logic(value)` |
| 8 | Dalam berapa bulan Anda mendapatkan pekerjaan pertama/melanjutkan studi setelah lulus? | number input (0-120) | — | **Conditional**: hanya muncul kalau Q7 = **"Tidak"**. Kalau Q7 diubah ke "Ya", field ini disembunyikan lagi & value dikosongkan otomatis |
| 9 | Apakah Anda aktif mencari pekerjaan dalam 4 minggu terakhir? | radio, single-select | Tidak · Tidak, tapi saya sedang menunggu hasil lamaran kerja · Ya, saya akan mulai bekerja dalam 2 minggu ke depan · Ya, tapi saya belum pasti akan bekerja dalam 2 minggu ke depan · Lainnya | 5 opsi granular (vs live site Kemdiktisaintek yang cuma implisit Ya/Tidak — lihat [Komparasi §2](Komparasi%20Kuesioner%20KEMDIKTI%20(Kemdiktisaintek)%20vs%20KEMENKES.md)) |

### Halaman 2 — Transisi Kerja (isinya 100% bergantung jawaban Q5 di halaman 1)

Fungsi `recomputeTransisiKerja()` menentukan blok mana yang tampil, dievaluasi ulang setiap kali Q5 berubah:

| Blok | Kondisi Tampil | Isi |
|---|---|---|
| `block-pekerjaan` | Q5 mengandung **"bekerja"** ATAU **"wiraswasta"** | 1) "Berapa tempat kerja yang Anda jalani saat ini?" (number, sinkron otomatis dgn jumlah kartu pekerjaan lewat `syncJobCount()`)<br>2) **Grup repeatable** "Detail Pekerjaan" — tombol "+ Tambah Pekerjaan Lain" menambah kartu baru; tiap kartu (`Pekerjaan #1`, `#2`, dst) berisi 4 field: Instansi/Perusahaan (text), Bidang Kerja (text), Status Kerja (dropdown: Full-time/Part-time/Kontrak/Freelance), Gaji (number, prefix "Rp") |
| `block-studi` | Q5 mengandung **"melanjutkan_pendidikan"** | "Jenjang Studi Lanjut" — dropdown: S1 · S2 · S3 · Profesi |
| `block-usaha` | Q5 mengandung **"wiraswasta"** | "Bidang Usaha" — text input (cth. Kuliner, Fashion, Jasa Konsultan) |
| `block-none` | Q5 **tidak** mengandung bekerja/wiraswasta/studi (artinya cuma "mencari_kerja" dan/atau "belum_bekerja" yang dicentang) | Pesan statis: *"Tidak ada pertanyaan lanjutan untuk status yang Anda pilih di halaman sebelumnya."* — **tidak ada field tambahan sama sekali** |

Catatan penting soal `block-none`: kalau responden pilih **"Wiraswasta" + "Melanjutkan pendidikan"** sekaligus (tanpa "bekerja"), maka `block-usaha` DAN `block-studi` tampil bersamaan, `block-pekerjaan` tetap tampil juga (karena kondisinya OR dengan wiraswasta) — union tiga blok sekaligus, bukan exclusive. Ini konsisten dengan model "union per status" yang pernah dibahas di [Konsep §9.6.1](Konsep-Pertanyaan-Core-Optional-Specific-untuk-Template-Quisioner.md).

### Validasi & Progress

- `validatePage1()` / `validatePage2()`: submit diblokir (toast merah berisi daftar field yang kurang) kalau ada yang wajib belum diisi — termasuk validasi kondisional (mis. Q8 cuma divalidasi wajib kalau Q7="Tidak"; field pekerjaan repeatable cuma divalidasi kalau block-pekerjaan sedang tampil).
- Progress bar & counter "X pertanyaan dijawab" dihitung ulang tiap perubahan (`updateAnsweredCount()`), termasuk cuma menghitung field yang sedang **terlihat** (`isElementVisible`) — field yang disembunyikan karena kondisi tidak terpenuhi tidak ikut dihitung.
- Setelah halaman 2 valid, submit mengarahkan ke `tracer-study-success.html` (halaman selesai) — belum ada pemanggilan API/penyimpanan data nyata (murni mockup front-end, `console.log`/redirect saja).

## 3. Diskrepansi yang Ditemukan

| Temuan | Detail |
|---|---|
| Q6 (sumber dana) beda jumlah opsi | Wizard responden: **7 opsi** (termasuk AFIRMASI, Perusahaan/Swasta). Bank soal admin (ID 7): cuma **4 opsi**. Perlu disamakan salah satu jadi rujukan tunggal. |
| Q9 (aktif cari kerja) beda granularitas | Wizard responden: **5 opsi** nuansa (menunggu hasil, mulai 2 minggu, dst). Live site Kemdiktisaintek (dari [Komparasi §1](Komparasi%20Kuesioner%20KEMDIKTI%20(Kemdiktisaintek)%20vs%20KEMENKES.md)): tidak ada follow-up sama sekali untuk status ini. |
| Pertanyaan `kemenkes`/`ikuptn`/`banpt`/`lam` belum dirender ke wizard manapun | Semua ada di bank soal builder (bagian 1), tapi `tracer-study-form.html` tidak punya satupun instance-nya — termasuk STR. Builder dan wizard belum terhubung dinamis. |
| Status "mencari_kerja"/"belum_bekerja" konsisten tanpa follow-up | Baik di live site Kemdiktisaintek maupun di wizard prototype ini (`block-none`), kedua status ini sama-sama tidak py pertanyaan lanjutan — mengonfirmasi ulang temuan di Komparasi §2, bukan cuma kebetulan satu sumber. |
| Section placeholder builder (Bekerja/Wiraswasta/dst) kosong | Section-section ini ada namanya di data model builder tapi 0 pertanyaan — mengindikasikan pertanyaan cabang (job detail, bidang usaha, jenjang studi) di desain builder **belum dipetakan** ke section-section itu, padahal secara nyata sudah ada & jalan di wizard `tracer-study-form.html` halaman 2. Kemungkinan builder & wizard dikerjakan terpisah dan belum disinkronkan. |


## 4. Landasan Regulasi Timeline Wave & Survei Pengguna Lulusan

### 4.1 Sumber Regulasi

| Regulasi | Dokumen | Poin Kunci |
|---|---|---|
| **IKU#2** | Kepmen 358/2025 | Tracer study inti (G1) dilakukan **min. 1 tahun setelah kelulusan**. Responden min. Slovin 2,3%. Bobot: masa tunggu <6 bulan & gaji >1,2× UMP = bobot 1. |
| **BAN-PT** | PerBAN-PT 35/2025 · Lamp. 3h IAPT 4.1 (Akademi Komunitas Terakreditasi) | **Indikator 14B** — Tingkat Kepuasan Pengguna Lulusan: data diperoleh melalui tracer study yang dilakukan **1 tahun setelah kelulusan** (≥50% responden mengisi), dengan validasi tambahan dari T1: **pengguna lulusan/instansi tempat bekerja**. PT melakukan Survei Kepuasan Pengguna Lulusan pada TS-1 s/d TS-3 dengan data valid & representatif, dievaluasi untuk perbaikan kurikulum. |
| **BAN-PT** | PerBAN-PT 35/2025 · Lamp. 3h IAPT 4.1 | **Indikator 14A** — Kompetensi Lulusan: (1) serapan kerja lokal/regional ~70% di industri, level nasional dalam 1 tahun; (2) 30% mampu mendirikan usaha; (3) 50% memiliki sertifikat profesi resmi; (4) 30% memiliki kemampuan inovasi sederhana. |

### 4.2 Kesimpulan untuk Arsitektur Timeline

Berdasarkan kedua regulasi di atas, **batas minimum G1 = 12 bulan setelah lulus** dikunci oleh dua jalur:

- IKU#2 mensyaratkan data min. 1 tahun
- BAN-PT indikator 14B juga menyebutkan "1 tahun setelah kelulusan"

**Survei Pengguna Lulusan** timeline-nya sejajar dengan G1 (sama-sama H+1 tahun), karena:
- BAN-PT menyebutkan "validasi tambahan dari T1: pengguna lulusan" pada data yang sama
- Secara logis, perusahaan baru bisa menilai kinerja alumni setelah alumni bekerja cukup lama (min. beberapa bulan)
- Trigger pengiriman link ke perusahaan bisa otomatis setelah alumni mengisi G1 dan menyebutkan tempat kerjanya

### 4.3 Arsitektur Timeline Wave yang Disepakati

```
Wave Exit     → Saat yudisium / sebelum wisuda (dikonfigurasi Admin CDC)
Wave G1       → Min. 12 bulan setelah lulus (batas bawah terkunci regulasi)
Wave G2       → Bebas (rekomendasi 4-5 tahun, dikonfigurasi Admin CDC)
Pengguna Lul. → Sejajar G1, dikirim setelah alumni mengisi G1 + menyebut tempat kerja
```

### 4.4 Konfigurasi yang Bisa Diatur Admin CDC

| Parameter | Dapat Diatur | Batas Sistem |
|---|---|---|
| Kapan Wave Exit dikirim | ✅ (saat yudisium / 1 minggu sebelum wisuda / custom) | — |
| Kapan Wave G1 dikirim | ✅ (12 bulan, 18 bulan, dll) | Min. 12 bulan ⚠️ |
| Kapan Wave G2 dikirim | ✅ (36, 48, 60 bulan, dll) | — |
| Kapan Survei Pengguna Lulusan dikirim | ✅ (otomatis setelah alumni isi G1 / manual) | Min. sejajar G1 |
| Jumlah & jarak reminder | ✅ (maks 3×, setiap 7 hari, dll) | Berhenti otomatis jika sudah isi |

**Catatan:** Tidak ada "batas waktu isi" — link tetap aktif kapan saja. Yang diatur hanya periode reminder aktif. Setelah semua reminder selesai dan alumni/responden belum isi, sistem berhenti mengirim pengingat tapi link tetap bisa diakses.

### 4.5 Catatan Penting untuk A/B Testing

- BAN-PT mensyaratkan **≥50% responden** mengisi tracer study — jauh lebih ketat dari IKU#2 yang pakai Slovin 2,3%. Ini penting disampaikan ke Admin CDC saat setup.
- Survei Pengguna Lulusan bukan hanya "nice to have" — BAN-PT secara eksplisit menyebutnya sebagai **validasi tambahan** (T1) yang diperhitungkan dalam skor akreditasi.
- Pertanyaan pengguna lulusan (12 aspek kinerja: integritas, keahlian, bahasa asing, TI, komunikasi, kerja tim, kepemimpinan, pengembangan diri, etos kerja, kesiapan masyarakat, berpikir kritis, kreativitas) sudah terimplementasi di mockup `simulasi-pengguna-lulusan.html`.

### 4.6 Pertanyaan G2 sebagai Optional yang Bisa "Dipinjam" ke G1

Keputusan desain: pertanyaan Wave G2 (kepuasan kompetensi, relevansi kurikulum, saran perbaikan) tersedia sebagai **Optional yang bisa di-toggle aktif di G1** oleh Admin CDC.

Aturan:
- Default di G1 = **nonaktif** (agar G1 tidak terlalu panjang)
- Jika Admin CDC mengaktifkan → pertanyaan muncul di form G1 alumni
- Di Wave G2, pertanyaan yang **sudah dijawab di G1 otomatis di-skip** (tidak ditanyakan ulang)
- G2 tetap ringan karena yang sudah dijawab bisa di-skip


## 5. Arsitektur Data: Snapshot vs Profil Terkini + Consent Layer

### 5.1 Dua Layer Data

| Layer | Fungsi | Sifat | Source |
|-------|--------|-------|--------|
| **Profil Terkini** | Operasional harian (matching lowongan, profil di Portal Karir) | Living, selalu terbaru | Portal Karir + Tracer + SIAKAD (ambil yang paling baru) |
| **Snapshot Tracer** | Pelaporan IKU & akreditasi BAN-PT | Terkunci per wave setelah cutoff resmi | Isian tracer study saat submit |

### 5.2 Source Input Penghasilan

Penghasilan bisa diinput dari dua tempat:
- **Tracer Study** (Wave Exit / G1) → masuk Snapshot + sinkron ke Profil Terkini
- **Portal Karir** (saat alumni update profil untuk apply lowongan) → masuk Profil Terkini saja

Di Profil Terkini selalu tampil **angka asli + keterangan UMP provinsi daerah kerja**:
- `> 1,2× UMP [Provinsi]` (tag hijau) — memenuhi bobot tertinggi IKU#2
- `< 1,2× UMP [Provinsi]` (tag netral) — belum memenuhi threshold

Provinsi yang dipakai = provinsi lokasi kerja alumni (bukan domisili asal).

### 5.3 Consent Layer — Revisi Snapshot Sebelum Cutoff

Alur ketika data di Profil Terkini berubah signifikan dibanding Snapshot:

1. Alumni update data di Portal Karir (misal gaji naik dari 8.5jt → 15jt)
2. Sistem deteksi perbedaan signifikan dengan Snapshot Tracer terakhir
3. **Notifikasi ke alumni** (in-app + email):
   > "Penghasilan Anda saat ini (Rp 15.000.000) berbeda dari yang Anda isi di Tracer Study sebelumnya (Rp 8.500.000). Apakah Anda mengizinkan kampus memperbarui data tracer dengan angka terbaru ini? Data akan digunakan untuk pelaporan resmi."
4. Alumni memilih:
   - **[Ya, perbarui]** → Snapshot direvisi + audit trail mencatat "Direvisi oleh alumni (consent diberikan) [tanggal]"
   - **[Tidak, biarkan]** → Snapshot tetap, Profil Terkini tetap data terbaru
5. **Setelah cutoff resmi pelaporan** → Snapshot dikunci permanen, tidak bisa direvisi lagi

### 5.4 Aturan Cutoff

- Cutoff ditentukan oleh Admin CDC (misal: "Data G1 dikunci 30 Juni untuk pelaporan semester genap")
- Sebelum cutoff: alumni boleh revisi snapshot (dengan consent)
- Setelah cutoff: snapshot frozen, hanya Profil Terkini yang terus bergerak
- Audit trail mencatat semua perubahan (siapa, kapan, dari berapa ke berapa, sumber mana)


### 5.5 Audit Trail — Sumber Data (Provenance)

Setiap perubahan data alumni/mahasiswa wajib memiliki jejak sumber. Tidak ada data yang berubah tanpa atribusi. Berikut 5 sumber yang dikenali sistem:

| # | Sumber (badge) | Pemicu | Source Input Teknis | Warna |
|---|---|---|---|---|
| 1 | **SIAKAD sync** | Sistem (otomatis, terjadwal) | Integrasi API SIAKAD → data awal mahasiswa (nama, NIM, prodi, email, HP, IPK, status akademik) | primary (biru) |
| 2 | **Alumni (self-update)** | Alumni sendiri, kapan saja | Portal Karir → form "Edit Profil" (domisili, perusahaan, lokasi kerja, jabatan, LinkedIn, penghasilan) | success (hijau) |
| 3 | **Alumni (wave Exit/G1/G2)** | Alumni saat mengisi tracer | Form Tracer Study → submit jawaban per wave. Data masuk Snapshot + Profil Terkini | default (netral) |
| 4 | **Admin CDC** | Operator kampus, manual | Panel Admin KarirLink → edit/koreksi (misal perbaiki typo email, update status) | warning (oranye) |
| 5 | **Pengguna Lulusan (perusahaan)** | Atasan/HRD alumni | Form Survei Pengguna Lulusan → submit penilaian kinerja (12 aspek + saran) | danger (merah muda) |

**Catatan implementasi:**
- Setiap entri audit mencatat: `timestamp`, `field yang berubah` (dari → ke), `sumber` (salah satu dari 5 di atas), `identitas aktor` (jika manusia: nama/email)
- Audit trail immutable (tidak bisa dihapus/diedit) — untuk keperluan akreditasi
- Admin CDC bisa filter audit per sumber (misal: "tampilkan hanya perubahan dari SIAKAD sync")
- Consent layer (§5.3) mencatat persetujuan revisi sebagai sub-type dari sumber #2 dengan flag `consent_given: true`


## 6. Data Dictionary — Log Aktivitas (Detail Alumni)

### 6.1 Kolom "Field / Aktivitas"

Format tampilan: **Nama field** *(Section asal)*

| # | Nama Field / Aktivitas | Section Asal di Halaman | Keterangan |
|---|---|---|---|
| 1 | Email | Profil Terkini | Alamat email aktif |
| 2 | No. HP | Profil Terkini | Nomor HP/WhatsApp |
| 3 | Domisili | Profil Terkini | Kota, Provinsi tempat tinggal |
| 4 | Lokasi Kerja | Profil Terkini | Kota, Provinsi tempat bekerja |
| 5 | Perusahaan | Profil Terkini | Nama perusahaan/instansi saat ini |
| 6 | Jabatan | Profil Terkini | Posisi/jabatan saat ini |
| 7 | Penghasilan | Profil Terkini | Angka rupiah + keterangan UMP |
| 8 | LinkedIn | Profil Terkini | URL profil LinkedIn |
| 9 | Status Akademik | Profil Terkini | Aktif / Cuti / Lulus / Keluar |
| 10 | IPK | Profil Terkini | Angka IPK (sumber SIAKAD) |
| 11 | Wave Exit diisi | Jawaban Tracer Study | Event: alumni submit Wave Exit |
| 12 | Wave G1 diisi | Jawaban Tracer Study | Event: alumni submit Wave G1 |
| 13 | Wave G2 diisi | Jawaban Tracer Study | Event: alumni submit Wave G2 |
| 14 | Jawaban tracer direvisi | Jawaban Tracer Study | Alumni consent update sebelum cutoff |
| 15 | Penilaian dari perusahaan | Jawaban Tracer Study | Event: perusahaan submit survei pengguna lulusan |
| 16 | Posisi baru ditambahkan | Riwayat Karier & Pengalaman | Entry kerja/magang/organisasi baru |
| 17 | Data awal tersinkronisasi | Profil Terkini | SIAKAD sync pertama kali |

### 6.2 Kolom "Sebelum" dan "Sesudah"

| # | Field | Sebelum (contoh) | Sesudah (contoh) | Sifat value |
|---|---|---|---|---|
| 1 | Email | ahmad.rizki@yahoo.com | ahmad.rizki@gmail.com | Dinamis (teks bebas) |
| 2 | No. HP | 081234567890 | 089876543210 | Dinamis (angka) |
| 3 | Domisili | Kota Surabaya, Jawa Timur | Kota Bandung, Jawa Barat | Dinamis (dropdown wilayah) |
| 4 | Lokasi Kerja | Kota Surabaya, Jawa Timur | Kota Bandung, Jawa Barat | Dinamis (dropdown wilayah) |
| 5 | Perusahaan | PT Cahaya Seruni | PT Telkom Indonesia | Dinamis (dropdown + ketik sendiri) |
| 6 | Jabatan | Junior Developer | Backend Engineer | Dinamis (dropdown + ketik sendiri) |
| 7 | Penghasilan | Rp 8.500.000 | Rp 15.000.000 | Dinamis (angka rupiah) |
| 8 | LinkedIn | — | linkedin.com/in/ahmad-rizki | Dinamis (URL, bisa dari kosong) |
| 9 | Status Akademik | Aktif | Lulus | Default opsi: Aktif / Cuti / Lulus / Keluar |
| 10 | IPK | 3.50 | 3.72 | Dinamis (angka desimal, sumber SIAKAD) |
| 11 | Wave Exit diisi | — | Disubmit (7 pertanyaan) | Default: "—" → "Disubmit (N pertanyaan)" |
| 12 | Wave G1 diisi | — | Disubmit (12 pertanyaan Core) | Default: "—" → "Disubmit (N pertanyaan Core)" |
| 13 | Wave G2 diisi | — | Disubmit (4 pertanyaan) | Default: "—" → "Disubmit (N pertanyaan)" |
| 14 | Jawaban tracer direvisi | Penghasilan: Rp 8.500.000 | Penghasilan: Rp 15.000.000 | Dinamis (field + value lama → baru) |
| 15 | Penilaian dari perusahaan | — | Skor rata-rata: Baik | Default opsi: Kurang / Cukup / Baik / Sangat Baik |
| 16 | Posisi baru ditambahkan | — | Backend Engineer · PT Telkom Indonesia | Dinamis (posisi + perusahaan) |
| 17 | Data awal tersinkronisasi | — | Data awal tersinkronisasi | Default (selalu sama) |

### 6.3 Kolom "Oleh / Sumber"

| # | Value | Kapan muncul | Warna badge |
|---|---|---|---|
| 1 | **SIAKAD sync** | Sinkronisasi otomatis dari sistem akademik (data awal, update IPK/status) | primary (biru) |
| 2 | **Alumni (self-update)** | Alumni memperbarui profil di Portal Karir secara mandiri | success (hijau) |
| 3 | **Alumni (wave Exit)** | Alumni submit jawaban Wave Exit | default (netral) |
| 4 | **Alumni (wave G1)** | Alumni submit jawaban Wave G1 | default (netral) |
| 5 | **Alumni (wave G2)** | Alumni submit jawaban Wave G2 | default (netral) |
| 6 | **Alumni (revisi tracer)** | Alumni consent update jawaban sebelum cutoff pelaporan | default (netral) |
| 7 | **Admin CDC** | Operator kampus edit/koreksi manual | warning (oranye) |
| 8 | **[Nama Perusahaan] (pengguna lulusan)** | Perusahaan submit survei pengguna lulusan — nama perusahaan dinamis | danger (merah muda) |

### 6.4 Cutoff Pelaporan (terkait revisi tracer)

| Aspek | Pengisian awal tracer | Revisi jawaban tracer |
|-------|---|---|
| Batas waktu? | ❌ Tidak ada (link tetap aktif selamanya) | ✅ Ada (sampai tanggal cutoff) |
| Alasan | Response rate tidak terpotong | Data harus stabil untuk pelaporan resmi |

**Cutoff ditentukan oleh Kemdiktisaintek via surat edaran**, bukan oleh PT sendiri. Admin CDC memantau edaran lalu menginput tanggal ke sistem.

**Jadwal pelaporan tracer study Kemdiktisaintek = per triwulan:**
- Triwulan I: Maret
- Triwulan II: Juni
- Triwulan III: September
- Triwulan IV: Desember (sekaligus batas akhir rekapitulasi tahunan)

**Cutoff khusus (IKU & BAN-PT):** kementerian sering menetapkan tanggal cut-off khusus di pertengahan atau akhir tahun (Juli–November) tergantung jadwal penilaian nasional. Sumber: surat edaran Kemdiktisaintek dan LLDIKTI wilayah.

**Setting di sistem:**
```
Triwulan pelaporan: [I: Maret / II: Juni / III: September / IV: Desember]
Tanggal cutoff: [input manual setelah Admin CDC baca surat edaran]
Keterangan: "Sesuaikan dengan surat edaran terbaru dari Kemdiktisaintek/LLDIKTI"
```

**Flow revisi:**
1. Alumni isi G1 (Maret 2025)
2. Alumni update profil di Portal Karir (Juni 2025, misal gaji naik)
3. Sistem deteksi perbedaan → notifikasi: "Mau update jawaban tracer juga?"
4. Jika [Ya] dan belum lewat cutoff → revisi berhasil, tercatat "Alumni (revisi tracer)"
5. Jika [Ya] tapi sudah lewat cutoff → ditolak: "Periode pelaporan sudah ditutup"
6. Profil Terkini tetap terupdate terlepas dari cutoff (living data tidak terkunci)


## 7. Arsitektur Pengiriman Wave — Berbasis Periode Yudisium

### 7.1 Konsep

Pengiriman kuesioner tracer study **tidak dihitung per individu**, tapi per **batch Periode Yudisium**. Patokan waktu = Tanggal Akhir Periode Yudisium (bukan tanggal SK Yudisium per-mahasiswa).

**Sumber data:** SIAKAD (otomatis tersinkronisasi, tidak perlu input manual Admin CDC).

### 7.2 Contoh

```
Periode Yudisium: Semester Genap 2023/2024
├─ Mahasiswa A: SK Yudisium 15 Juni 2024
├─ Mahasiswa B: SK Yudisium 20 Juni 2024
├─ Mahasiswa C: SK Yudisium 10 Juli 2024
└─ Tanggal Akhir Periode: 31 Juli 2024

→ Semua dianggap "Lulus" per 31 Juli 2024
→ Wave Exit dikirim serentak: 31 Juli 2024 (atau +offset)
→ Wave G1 dikirim serentak: 31 Juli 2025 (12 bulan)
→ Wave G2 dikirim serentak: 31 Juli 2028 (48 bulan)
```

### 7.3 Mekanisme Pengiriman

| Mekanisme | Cara kerja | Peran Admin CDC |
|---|---|---|
| **Otomatis** | Sistem deteksi Periode Yudisium baru dari SIAKAD → hitung tanggal kirim per wave → kirim serentak ke batch | ❌ Tanpa campur tangan |
| **Manual ("Ingatkan Alumni")** | Admin CDC trigger reminder ke batch yang response rate rendah | ✅ Klik tombol, pilih periode + wave |

### 7.4 Catatan Penting

- Satu tahun bisa ada **>1 Periode Yudisium** (tergantung kebijakan PT: Ganjil, Genap, Susulan, dll)
- Tanggal Akhir Periode Yudisium **otomatis dari SIAKAD** — backend KarirLink tinggal baca
- Tidak ada tombol "Publish Versi" — kuesioner Single & Living, perubahan langsung berlaku
- Admin CDC cukup set 1× di awal (offset wave, reminder interval), selanjutnya semua otomatis
- Tombol "Ingatkan Alumni" = trigger manual per batch + wave, untuk kejar response rate

### 7.5 Model Kuesioner: Evolusi per Waktu (bukan per Angkatan)

- Kuesioner = **1 versi aktif** yang terus berkembang (Single & Living)
- Perubahan pertanyaan Optional/Specific oleh Admin CDC **berlaku prospektif** (ke depan, untuk yang belum mengisi)
- Alumni yang sudah mengisi → jawaban tersimpan sesuai versi saat mereka isi (snapshot terkunci)
- **Tidak ada versi kuesioner per angkatan** — cukup satu versi yang berevolusi
- Jika butuh pertanyaan khusus angkatan tertentu → gunakan conditional logic per pertanyaan (syarat tampil), bukan bikin kuesioner terpisah


## 8. Verifikasi Jawaban Exit di Wave G1

### 8.1 Masalah yang diselesaikan

Wave Exit menanyakan "Apakah Anda sudah bekerja atau berwirausaha sebelum lulus?". Tanpa tindak lanjut, jawaban itu jadi menggantung: alumni yang sudah bekerja sebelum lulus belum tentu masih bekerja setahun kemudian. IKU#2 kriteria (e) dan (f) mensyaratkan alumni **tetap menjalankan** pekerjaan atau usahanya, bukan sekadar pernah punya.

### 8.2 Dua varian pertanyaan verifikasi

Pertanyaan verifikasi muncul di awal Wave G1, hanya jika alumni menjawab "Ya" di Exit. Redaksinya berbeda tergantung jawaban Exit.

**Jika Exit = "Ya, sudah bekerja":**
> Sebelumnya Anda menyebutkan sudah bekerja sebelum lulus. Apakah pekerjaan tersebut masih Anda jalankan saat ini?
- Ya, masih di tempat yang sama → **memenuhi** kriteria (e)
- Ya, tapi sudah pindah ke tempat lain → tidak memenuhi
- Tidak, saya sudah berhenti → tidak memenuhi

**Jika Exit = "Ya, sudah berwirausaha":**
> Sebelumnya Anda menyebutkan sudah berwirausaha sebelum lulus. Apakah usaha tersebut masih Anda jalankan saat ini?
- Ya, usaha saya masih berjalan → **memenuhi** kriteria (f)
- Ya, tapi saya sudah beralih ke usaha/bidang lain → tidak memenuhi
- Tidak, usaha saya sudah berhenti → tidak memenuhi

Hanya **opsi pertama** pada masing-masing varian yang memenuhi kriteria IKU#2, karena hanya opsi itu yang membuktikan kelangsungan pekerjaan/usaha yang sama.

### 8.3 Verifikasi tidak punya kode Dikti

Pertanyaan verifikasi ini **tidak ada** di format resmi Kemdiktisaintek, jadi tidak punya kode Dikti dan tidak di-upload. Ia pertanyaan internal untuk perhitungan bobot IKU#2. Yang di-upload adalah jawaban `f502` dan `f8` yang dihasilkan **setelah** verifikasi. Rinciannya di `Mapping-Kode-Dikti-Tracer-Study.md`.

### 8.4 Status jadi pilihan tunggal

Pertanyaan status ("Jelaskan status Anda saat ini?") diubah dari pilihan ganda menjadi **pilihan tunggal**. Alasannya dua:

1. Format resmi Kemdiktisaintek memakai pilihan tunggal, dan jawabannya mengendalikan percabangan seluruh kuesioner (`jump_to_box: true`). Kalau alumni bisa memilih dua status, sistem tidak tahu cabang mana yang harus dibuka.
2. IKU#2 menghitung satu status per alumni. Dua jawaban membuat perhitungan ambigu.

Penekanan "utama" dipindahkan ke **keterangan bantuan** di bawah pertanyaan: "Jika Anda memiliki lebih dari satu aktivitas (misal bekerja sambil kuliah), pilih yang paling menggambarkan kondisi utama Anda saat ini." Keterangan bantuan tidak punya kode Dikti, jadi boleh disesuaikan kampus tanpa merusak kecocokan data.

### 8.5 Inkonsistensi jawaban — peringatan lunak, bukan penghalang

Jika jawaban verifikasi bertabrakan dengan status (misal: "usaha masih berjalan" tapi status "Tidak kerja, tetapi sedang mencari kerja"), sistem menampilkan peringatan lunak, bukan memblokir pengiriman.

Alasan tidak memblokir: kombinasi yang tampak aneh bisa jadi benar. Alumni bisa punya usaha kecil sambil aktif mencari pekerjaan tetap. Memblokir justru berisiko membuat alumni berhenti mengisi — dan response rate adalah hal yang paling sulit dinaikkan (BAN-PT mensyaratkan ≥50%).

**Isi peringatan:**
- Judul: "Jawaban Anda tampak tidak sesuai"
- Penjelasan singkat perbedaannya
- Dua tombol: **[Perbaiki jawaban]** dan *Ya, lanjutkan*

**Konsekuensi tiap tombol:**

| Tombol | Yang terjadi | Catatan di Log Aktivitas |
|---|---|---|
| Perbaiki jawaban | Halaman menggulir ke pertanyaan yang bermasalah, jawaban dikosongkan agar diisi ulang. Peringatan hilang setelah jawaban konsisten. | Tidak ada. Dianggap koreksi wajar saat mengisi. |
| Ya, lanjutkan | Jawaban diterima apa adanya, alumni bisa lanjut ke pertanyaan berikutnya. | Dicatat sebagai **"inkonsistensi dikonfirmasi alumni"**. Admin CDC bisa meninjau dan menghubungi alumni bila perlu. |

Data yang ditandai tetap ikut dihitung dalam laporan. Penandaan hanya alat bantu tinjauan, bukan penolakan data.

---

## 9. Kode Dikti — Ringkasan Keputusan

Detail lengkap mapping ada di dokumen terpisah: **`Mapping-Kode-Dikti-Tracer-Study.md`**. Poin yang perlu diketahui tim produk:

### 9.1 Kode Dikti tidak ditampilkan di antarmuka

Admin CDC tidak perlu melihat kode seperti `f8` atau `f505`. Kode adalah urusan penyimpanan dan pengiriman data. Yang perlu diketahui Admin CDC hanya dua hal: pertanyaan ini boleh dinonaktifkan atau tidak, dan bagian mana yang boleh disesuaikan. Alasannya harus dijelaskan dengan benar — lihat §9.3b.

### 9.2 Kode melekat di empat level

Bukan hanya di pertanyaan, tapi juga di opsi jawaban, baris matriks, dan isian "Lainnya". Contohnya "Bagaimana Anda mencari pekerjaan tersebut?" punya kode `f4`, dan setiap dari 14 opsinya punya kode sendiri (`f401`–`f414`), plus `f415` untuk isian Lainnya.

Ini sebabnya **jumlah opsi jawaban tidak boleh dikurangi atau digabung** — bukan karena kata-katanya, tapi karena tiap baris opsi adalah pemegang kodenya. Menggabungkan dua opsi berarti menghapus satu baris, dan kode yang dibawanya kehilangan tempat.

### 9.3 Definisi tier berbasis data template

| Tier | Aturan |
|---|---|
| Core | Punya kode Dikti **dan** wajib di template resmi — atau wajib agar sistem bisa berjalan (email, nomor HP) |
| Optional | Punya kode Dikti tapi tidak wajib, **atau** diminta regulator lain (Kemenkes, BAN-PT, LAM) |
| Specific | Tanpa kode Dikti, buatan institusi |

### 9.3a Yang mengikat adalah kode, bukan redaksi

Versi awal bagian ini menyatakan bahwa mengubah redaksi membuat jawaban tidak bisa di-upload. **Itu keliru** dan sudah dikoreksi. Dua sumber yang meluruskannya:

- **Schema.** `participant_answers` menyimpan jawaban sebagai `answer_question_id` — referensi baris opsi, bukan teks maupun kode. Kode diambil lewat join saat pengiriman, jadi mengubah kolom `content` tidak menyentuh jalur pengiriman.
- **Tim produk.** Diksi pertanyaan dan jawaban boleh disesuaikan selama makna tidak bergeser jauh. Tipe data juga bebas — belum ada kepastian apakah Dikti menyimpan semuanya sebagai string, jadi memakai numeric atau boolean di sisi kita tidak masalah.

**Yang tidak boleh berubah:** kode tetap melekat ke pertanyaan dan opsi yang maknanya sama, dan **struktur opsi berkode** tidak boleh digabung, dihapus, atau ditambah.

**Yang boleh berubah:** redaksi pertanyaan dan opsi, tipe input dan tipe kolom, urutan tampil, keterangan bantuan.

### 9.3c Ada pengikat kedua yang sempat terlewat: kolom `value`

Pembacaan ulang template menemukan bahwa **hanya `f4` dan `f16` yang opsinya punya kode sendiri.** Untuk semua pertanyaan pilihan tunggal dan matriks skala — bagian terbesar kuesioner — opsinya tidak berkode. Yang mengidentifikasi jawaban di sana adalah kolom **`value`**: angka 1, 2, 3, dan seterusnya, yang melekat ke label, bukan ke posisi.

Jadi invarian §9.3a bertambah satu baris: **pasangan (makna opsi ↔ `value`) tidak boleh bergeser.**

Praktisnya, ada satu kesalahan yang harus dihindari: menyusun ulang urutan tampil sebuah pertanyaan, lalu menomori ulang `value` mengikuti urutan baru. Itu membalik seluruh data **tanpa satu pun pesan kesalahan muncul di layar**. Kelas kesalahan yang paling berbahaya karena senyap.

Dua contoh nyata dari template:

- **`f8` (status saat ini):** 1 = Bekerja · 2 = Belum memungkinkan bekerja · 3 = Wiraswasta · 4 = Melanjutkan pendidikan · 5 = Tidak kerja tapi mencari kerja. Angka 2 terselip di antara Bekerja dan Wiraswasta — urutannya bukan urutan yang enak dibaca manusia, dan itu justru buktinya bahwa `value` tidak boleh diturunkan dari urutan tampil.
- **`f2` dan `f17` berlawanan arah.** Di `f2` (metode pembelajaran), 1 = Sangat Besar. Di `f17` (kompetensi), 5 = Sangat Tinggi. Dua matriks berdampingan di bagian yang sama dengan arah skala berbeda. Setiap agregasi atas `f2` harus membalik skala lebih dulu, atau grafik dashboard akan menunjukkan kebalikan dari kenyataan.

Rinciannya di [Mapping Kode Dikti §13.1–13.2](Mapping-Kode-Dikti-Tracer-Study.md).

### 9.3d Dua koreksi dari Data Master resmi Kemdikti

Lampiran resmi Panduan Form Kemdikti (`Data Master Pertanyaan`) memberi kepastian atas dua hal yang sebelumnya masih dugaan.

**`value` di template terkonfirmasi benar.** §9.3c menyebut `value` sebagai pengikat berdasarkan pembacaan template. Data Master mencantumkan value tiap opsi secara resmi, dan hasilnya **sama persis** dengan template. Jadi ini bukan lagi dugaan — `value` di template adalah value yang dikirim ke Dikti.

**Setiap "Lainnya" butuh dua kolom, bukan satu.** Ini yang perlu perhatian tim produk: opsi "Lainnya" mengirim **penanda tercentang** dan **isian teksnya** sebagai dua kolom berbeda.

| Pertanyaan | Penanda | Teks |
|---|---|---|
| Cara mencari pekerjaan | `f415` | `f416` |
| Alasan kerja tidak sesuai | `f1613` | `f1614` |
| Jenis perusahaan | `f1101` = 5 | `f1102` |
| Sumber dana kuliah | `f1201` = 7 | `f1202` |
| Aktif mencari kerja | `f1001` = 5 | `f1002` |

Kalau sistem hanya menyimpan penandanya, jawaban yang ditulis alumni di kotak "Lainnya" **hilang tanpa jejak** — dan itu justru jawaban yang paling informatif karena berisi hal yang tidak terpikirkan saat opsi disusun.

Spesifikasi lengkap lapisan pengiriman ada di [Format Pengiriman Data ke Dikti](Format-Pengiriman-Data-ke-Dikti.md).

### 9.3b Kenapa redaksi tetap dikunci di produk

Karena boleh secara teknis bukan berarti bijak secara produk. **Optional berkode Dikti tetap dikunci redaksinya** — tapi dasarnya bukan mekanisme upload, melainkan:

1. Batas "makna tidak bergeser jauh" butuh pemahaman instrumen. Persona Admin CDC di banyak PT bukan orang riset, jadi memberi kebebasan tanpa alat penilaian sama dengan memindahkan risiko ke orang yang tidak bisa mengelolanya.
2. Komparabilitas antar-PT adalah nilai jual platform — dan itu justru inti definisi Core menurut Schomburg.
3. Risikonya asimetris: untung kecil (bahasa sedikit lebih pas), rugi besar (data tidak komparabel, dan kalau ternyata Dikti juga mencocokkan teks, laporan bisa ditolak).

**Yang perlu diubah adalah alasan yang ditampilkan ke Admin CDC**, bukan aturannya. Bukan "kalau diubah tidak bisa di-upload", tapi "dikunci agar data bisa dibandingkan antar-PT dan aman saat dilaporkan".

Rinciannya di [Mapping Kode Dikti §7.1–7.2](Mapping-Kode-Dikti-Tracer-Study.md).

### 9.4 Perbaikan yang sudah diterapkan ke mockup

Hasil pencocokan mockup dengan template resmi menemukan lima hal yang perlu dirapikan, dan semuanya sudah diperbaiki:

1. **Dua pertanyaan salah tier.** "Apakah Anda aktif mencari pekerjaan dalam 4 minggu terakhir?" dan "Bagaimana Anda mencari pekerjaan tersebut?" ditandai wajib di template resmi, jadi dinaikkan dari Optional menjadi Core.
2. **Opsi jawaban terpotong.** Pertanyaan "aktif mencari pekerjaan" sebelumnya cuma Ya/Tidak; format resmi punya empat opsi dengan nuansa berbeda (menunggu hasil lamaran, akan mulai bekerja dalam 2 minggu, belum pasti). Sudah dilengkapi. Hal yang sama berlaku untuk "alasan pekerjaan tidak sesuai" (6 → 12 opsi resmi).
3. **Satu pertanyaan yang seharusnya dua.** Lokasi kerja dipecah menjadi "Dimana provinsi Anda bekerja saat ini?" dan "Dimana Kabupaten / Kota Anda bekerja saat ini?"
4. **Isian yang salah jenis.** "Dalam berapa bulan Anda mendapatkan pekerjaan pertama?" diubah dari pilihan rentang menjadi isian angka bulan, sesuai format resmi. Pengelompokan "<6 bulan" untuk IKU#2 dihitung sistem, bukan diisi alumni.
5. **Baris matriks kurang.** Matriks metode pembelajaran hanya punya 5 baris, format resmi punya 7 (Perkuliahan, Demonstrasi, Partisipasi dalam proyek riset, Magang, Praktikum, Kerja Lapangan, Diskusi). Sudah dilengkapi.

Selain itu ditambahkan dua pertanyaan Core yang sebelumnya belum ada di mockup: **sumber dana kuliah** (`f1201`) dan **aktif mencari pekerjaan 4 minggu terakhir** (`f1001`).

### 9.5 Perbaikan gelombang kedua — setelah telaah situs resmi

Lima perbaikan di §9.4 berasal dari pencocokan dengan **file template**. Setelah tangkapan layar **situs resmi** ditelaah, muncul enam perbaikan lagi:

1. **Pola "gate + isian angka" dipulihkan.** Di situs resmi, "kapan mulai mencari pekerjaan" adalah **satu** pertanyaan dengan isian angka di dalam opsi radionya ("Kira-kira … bulan sebelum lulus" / "… sesudah lulus" / "Saya tidak mencari kerja"). Kami sebelumnya memecahnya jadi tiga pertanyaan terpisah. Sudah digabung, di ketiga cabang.
2. **Masa tunggu juga memakai pola itu.** Gate "sebelum lulus?" dan isian bulan sebenarnya satu field. Bukti dari `value`: opsi "Ya" bernilai `0` — artinya masa tunggu nol bulan — dan "Tidak" bernilai `null` karena nilainya diambil dari isian bulan.
3. **Arah skala matriks metode pembelajaran diperbaiki.** Mockup memasangkan kolom 1 dengan "Tidak sama sekali", padahal template menetapkan 1 = Sangat Besar. Terbalik. Kolom sekarang dimulai dari "Sangat Besar", sesuai situs resmi sekaligus sesuai `value`.
4. **Titik hitung jumlah lamaran diperjelas.** Di cabang Bekerja, tiga pertanyaan `f6`/`f7`/`f7a` dihitung "sebelum memperoleh pekerjaan pertama" mengikuti situs resmi; kedua template memakai "sampai saat ini", yang mengukur hal berbeda. Di cabang Belum Bekerja tetap "sampai saat ini".
5. **Pertanyaan jabatan ditambahkan ke cabang Bekerja.** Template hanya menaruhnya di cabang Wiraswasta, jadi jabatan alumni yang bekerja tidak pernah terekam — padahal jabatan atasannya iya.
6. **Blok Identitas dilengkapi** NIK, NPWP, Kode Perguruan Tinggi, dan Kode Program Studi, yang ada di halaman Identitas situs resmi tapi belum pernah masuk mockup.

Satu hal yang **tidak** berubah meski sempat diragukan: `f4` dan `f1001` tetap Core. Di situs resmi keduanya tidak bertanda wajib, tapi `is_required` ternyata berbeda per cabang — dan halaman yang tertangkap adalah tampilan sebelum cabang dipilih. Penjelasan lengkap di [Mapping Kode Dikti §14.3](Mapping-Kode-Dikti-Tracer-Study.md).
