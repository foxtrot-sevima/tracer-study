# Requirements Document

## Introduction

Fitur **Tracer Study Gating** menjadikan penyelesaian instrumen Tracer Study sebagai prasyarat sebelum pengguna Karirlink dapat melakukan aksi bernilai tinggi di Portal Karir, yaitu melamar lowongan dan mendaftar Event. Tujuan bisnisnya adalah menaikkan tingkat pengisian Tracer Study, yang pada data mockup saat ini berada di 98 dari 2088 lulusan (4,7%) — jauh di bawah ambang responden minimum Slovin galat 2,3% yang dibutuhkan untuk pelaporan IKU #2 dan syarat responden BAN-PT.

Fitur ini dirancang **konfigurabel per Perguruan Tinggi**, dengan tiga tingkat ketegasan (Mode_Gating) dan cakupan yang bisa dipilih, bukan sebagai satu aturan keras yang berlaku seragam.

### Temuan Kritis yang Membentuk Requirements Ini

Berdasarkan telaah `docs/arsitektur-karirlink.md`, ide awal "wajib isi Tracer Study sebelum melamar" **tidak dapat diterapkan apa adanya** karena tiga benturan berikut:

1. **Mahasiswa aktif akan terblokir permanen.** Menu Tracer Study berstatus *Terkunci* bagi mahasiswa yang belum lulus ("tersedia setelah lulus"), sementara mahasiswa aktif **sudah** boleh melamar lowongan. Gating berbasis Wave Tracer Study terhadap mahasiswa aktif menciptakan prasyarat yang mustahil dipenuhi. Requirements ini memisahkan perlakuan Mahasiswa_Aktif dan Alumni secara tegas, dan menetapkan Student_Survey sebagai satu-satunya instrumen yang boleh menggating Mahasiswa_Aktif (Requirement 2).
2. **Pengguna PT non-klien Sevima tidak punya menu Tracer Study sama sekali.** Gating tidak boleh menyentuh mereka (Requirement 3).
3. **Wave punya Tanggal Akhir dan jawaban terkunci permanen setelahnya.** Alumni yang terlambat akan kehilangan akses melamar selamanya jika tidak ada jalan keluar. Requirements ini mewajibkan adanya jalur pemenuhan alternatif untuk Wave yang sudah tertutup (Requirement 6).

Risiko produk yang belum terselesaikan dan menunggu keputusan (kualitas data menurun karena pengisian asal-asalan, pengguna berpindah ke platform lain, serta aspek persetujuan pelindungan data pribadi) dicatat di **Lampiran A**. Alternatif yang lebih lunak dicatat di **Lampiran B** sebagai pembanding. Keputusan yang masih terbuka dicatat di **Lampiran C**.

## Glossary

### Peran dan Entitas Pengguna

- **Admin CDC**: Pengelola *Career Development Center* di sebuah Perguruan Tinggi, pemilik konfigurasi Tracer Study dan Portal Karir untuk PT tersebut.
- **Mahasiswa_Aktif**: Pemilik akun Karirlink yang status akademiknya di SIAKAD belum lulus. Sudah dapat memakai Portal Karir, tetapi menu Tracer Study berstatus *Terkunci*.
- **Alumni**: Pemilik akun Karirlink yang status akademiknya di SIAKAD sudah lulus dan `tahun_lulus`-nya terisi. Menu Tracer Study berstatus *Terbuka*.
- **Relasi_PT**: Hubungan antara satu akun Karirlink dan satu Perguruan Tinggi. Satu akun dapat memiliki lebih dari satu Relasi_PT (mis. S1 di PT Alpha, S2 di PT Beta), masing-masing dengan status dan riwayat tracer terpisah.
- **PT_Klien**: Perguruan Tinggi yang berlangganan Sevima, sehingga modul Tracer Study aktif untuknya.
- **PT_NonKlien**: Perguruan Tinggi yang penggunanya memakai Portal Karir tanpa modul Tracer Study.

### Instrumen Pengumpulan Data

- **Wave_Exit**: Gelombang Tracer Study yang dikirim saat yudisium atau segera setelah lulus. Tujuan utamanya pemutakhiran email dan nomor HP agar Wave berikutnya sampai. Tidak memiliki kode Dikti.
- **Wave_G1**: Gelombang Tracer Study yang dikirim minimal 12 bulan setelah lulus. Memuat pertanyaan inti untuk IKU #2 dan dilaporkan ke Kemdiktisaintek.
- **Wave_G2**: Gelombang lanjutan (sekitar 48 bulan setelah lulus) untuk pendalaman relevansi program studi. Dapat berulang.
- **Survei_Pengguna_Lulusan**: Instrumen yang diisi atasan atau perusahaan tempat alumni bekerja, ter-trigger otomatis setelah alumni menyelesaikan Wave_G1 dengan status Bekerja. Kebutuhan akreditasi BAN-PT Indikator 14B. **Bukan** instrumen yang diisi alumni, sehingga tidak dapat dijadikan prasyarat gating.
- **Student_Survey**: Instrumen kuesioner yang ditujukan kepada Mahasiswa_Aktif (*time window* Student Survey pada menu Kuesioner Admin CDC), terpisah dari Tracer Study alumni. Satu-satunya instrumen yang boleh dijadikan prasyarat bagi Mahasiswa_Aktif.
- **Wave_Prasyarat**: Himpunan instrumen yang dipilih Admin CDC sebagai syarat pemenuhan gating pada satu PT.
- **Tanggal_Akhir_Wave**: Batas waktu pengisian sebuah Wave. Setelah tanggal ini, jawaban dikunci permanen dan tidak dapat direvisi atau ditambahkan.
- **Status_Pemenuhan**: Hasil evaluasi apakah satu akun sudah menyelesaikan seluruh Wave_Prasyarat pada satu Relasi_PT. Bernilai `Terpenuhi`, `Belum_Terpenuhi`, atau `Tidak_Berlaku`.

### Konsep Fitur

- **Gating**: Mekanisme yang mengaitkan izin melakukan aksi tertentu di Portal Karir dengan Status_Pemenuhan instrumen pengumpulan data.
- **Mode_Gating**: Tingkat ketegasan Gating. Bernilai `Lunak` (pengingat yang dapat ditutup, aksi tetap berjalan), `Bertahap` (aksi berjalan sampai Kuota_Bebas habis), atau `Keras` (aksi ditahan sampai Status_Pemenuhan bernilai `Terpenuhi`).
- **Cakupan_Gating**: Himpunan jenis aksi yang di-gate. Bernilai `Lamaran_Lowongan`, `Pendaftaran_Event`, atau keduanya.
- **Kuota_Bebas**: Jumlah aksi yang boleh dilakukan pengguna sebelum Gating mulai menahan aksi, berlaku pada Mode_Gating `Bertahap`.
- **Aksi_Ter-gate**: Satu percobaan melamar lowongan atau mendaftar Event yang dievaluasi oleh Sistem_Gating.
- **Pembebasan_Manual**: Penetapan oleh Admin CDC yang membuat satu akun tertentu tidak dikenai Gating pada satu Relasi_PT, dengan alasan tercatat.
- **IKU #2**: Indikator Kinerja Utama Perguruan Tinggi tentang lulusan yang bekerja, berwirausaha, atau melanjutkan studi dalam 1 tahun setelah lulus (Kepmen Dikti Saintek No. 358/M/KEP/2025).

### Nama Sistem

- **Panel_Admin_CDC**: Antarmuka konfigurasi Karirlink untuk Admin CDC.
- **Sistem_Gating**: Komponen yang menghitung Status_Pemenuhan dan memutuskan izin Aksi_Ter-gate.
- **Portal_Karir**: Komponen Karirlink yang menyajikan lowongan dan menangani lamaran.
- **Modul_Event**: Komponen Karirlink yang menyajikan dan menangani pendaftaran Event.
- **Modul_Tracer_Study**: Komponen Karirlink yang menyajikan dan menyimpan kuesioner Wave.
- **Pemeriksa_Kualitas_Jawaban**: Komponen yang menilai kelengkapan dan indikasi pengisian asal-asalan pada satu jawaban kuesioner.
- **Sistem_Notifikasi**: Komponen pengirim email dan notifikasi dalam aplikasi.
- **Log_Audit**: Komponen pencatat perubahan konfigurasi dan keputusan Gating.
- **Dasbor_Dampak_Gating**: Tampilan di Panel_Admin_CDC yang menyajikan metrik dampak Gating.

## Requirements

### Requirement 1: Konfigurasi Gating per Perguruan Tinggi

**User Story:** Sebagai Admin CDC, saya ingin mengatur sendiri apakah Gating aktif, seberapa tegas, dan aksi apa yang di-gate, sehingga saya dapat menyesuaikan tekanan pengisian dengan kondisi kampus saya.

#### Acceptance Criteria

1. THE Panel_Admin_CDC SHALL menetapkan status Gating bernilai nonaktif sebagai nilai bawaan untuk setiap PT_Klien.
2. WHEN Admin CDC membuka pengaturan Gating, THE Panel_Admin_CDC SHALL menampilkan empat kolom konfigurasi: status aktif, Cakupan_Gating, Mode_Gating, dan daftar Wave_Prasyarat.
3. THE Panel_Admin_CDC SHALL membatasi pilihan Cakupan_Gating pada tiga nilai: `Lamaran_Lowongan`, `Pendaftaran_Event`, dan keduanya.
4. THE Panel_Admin_CDC SHALL membatasi pilihan Mode_Gating pada tiga nilai: `Lunak`, `Bertahap`, dan `Keras`.
5. THE Panel_Admin_CDC SHALL membatasi pilihan Wave_Prasyarat pada instrumen yang sudah memiliki jadwal pengiriman aktif di PT tersebut.
6. IF Admin CDC menyimpan konfigurasi dengan status Gating aktif dan daftar Wave_Prasyarat kosong, THEN THE Panel_Admin_CDC SHALL menolak penyimpanan dan menampilkan pesan bahwa minimal satu Wave_Prasyarat wajib dipilih.
7. WHERE Mode_Gating bernilai `Bertahap`, THE Panel_Admin_CDC SHALL meminta nilai Kuota_Bebas berupa bilangan bulat dalam rentang 1 sampai 20.
8. WHEN Admin CDC mengaktifkan Gating, THE Panel_Admin_CDC SHALL menampilkan jumlah akun yang akan langsung berstatus `Belum_Terpenuhi` dan meminta konfirmasi sebelum menyimpan.
9. WHEN konfigurasi Gating disimpan, THE Log_Audit SHALL mencatat identitas aktor, waktu penyimpanan, nilai konfigurasi sebelum, dan nilai konfigurasi sesudah.
10. THE Sistem_Gating SHALL memakai konfigurasi Gating milik PT_Klien tempat lowongan atau Event tersebut diterbitkan.

### Requirement 2: Pemisahan Perlakuan Mahasiswa Aktif dan Alumni

**User Story:** Sebagai Mahasiswa_Aktif, saya ingin tetap dapat melamar lowongan meskipun Gating aktif, sehingga saya tidak terblokir oleh kuesioner yang belum boleh saya isi.

#### Acceptance Criteria

1. WHILE akun berstatus Mahasiswa_Aktif pada satu Relasi_PT, THE Sistem_Gating SHALL menetapkan Status_Pemenuhan bernilai `Tidak_Berlaku` untuk seluruh Wave_Exit, Wave_G1, dan Wave_G2 pada Relasi_PT tersebut.
2. IF Admin CDC memilih Wave_Exit, Wave_G1, atau Wave_G2 sebagai Wave_Prasyarat, THEN THE Panel_Admin_CDC SHALL menandai prasyarat tersebut berlaku hanya untuk Alumni dan menampilkan keterangan bahwa Mahasiswa_Aktif tidak dapat mengisi Wave tersebut.
3. WHERE Student_Survey memiliki jadwal pengiriman aktif di satu PT_Klien, THE Panel_Admin_CDC SHALL mengizinkan Admin CDC menetapkan Student_Survey sebagai Wave_Prasyarat bagi Mahasiswa_Aktif.
4. WHILE akun berstatus Mahasiswa_Aktif dan tidak ada Student_Survey berjadwal aktif pada Relasi_PT, THE Sistem_Gating SHALL mengizinkan seluruh Aksi_Ter-gate pada Relasi_PT tersebut.
5. IF Admin CDC memilih Survei_Pengguna_Lulusan sebagai Wave_Prasyarat, THEN THE Panel_Admin_CDC SHALL menolak pilihan tersebut dan menampilkan alasan bahwa instrumen tersebut diisi oleh atasan alumni.
6. WHEN status akun pada satu Relasi_PT berubah dari Mahasiswa_Aktif menjadi Alumni, THE Sistem_Gating SHALL menghitung ulang Status_Pemenuhan pada Relasi_PT tersebut memakai Wave_Prasyarat yang berlaku bagi Alumni.
7. WHEN status akun pada satu Relasi_PT berubah dari Mahasiswa_Aktif menjadi Alumni dan Mode_Gating bernilai `Keras`, THE Sistem_Notifikasi SHALL mengirim pemberitahuan yang memuat daftar Wave_Prasyarat baru dan tenggat pengisiannya sebelum Gating mulai menahan Aksi_Ter-gate.
8. WHILE akun berstatus Alumni dan berada dalam Masa_Tenggang_Transisi yang dikonfigurasi Admin CDC, THE Sistem_Gating SHALL mengizinkan seluruh Aksi_Ter-gate pada Relasi_PT tersebut.

### Requirement 3: Pengecualian Pengguna PT Non-Klien

**User Story:** Sebagai pengguna Karirlink dari PT_NonKlien, saya ingin tetap dapat memakai Portal Karir sepenuhnya, sehingga ketiadaan modul Tracer Study di kampus saya tidak merugikan saya.

#### Acceptance Criteria

1. WHILE seluruh Relasi_PT pada satu akun terhubung ke PT_NonKlien, THE Sistem_Gating SHALL mengizinkan seluruh Aksi_Ter-gate pada akun tersebut.
2. WHILE satu akun tidak memiliki Relasi_PT, THE Sistem_Gating SHALL mengizinkan seluruh Aksi_Ter-gate pada akun tersebut.
3. WHEN lowongan diterbitkan oleh PT_NonKlien, THE Sistem_Gating SHALL mengizinkan lamaran pada lowongan tersebut dari seluruh akun.
4. WHEN sebuah PT berubah status dari PT_NonKlien menjadi PT_Klien, THE Sistem_Gating SHALL menetapkan status Gating pada PT tersebut bernilai nonaktif sampai Admin CDC mengaktifkannya.

### Requirement 4: Evaluasi Prasyarat pada Lamaran Lowongan

**User Story:** Sebagai Admin CDC, saya ingin lamaran lowongan menjadi titik pemenuhan Tracer Study, sehingga alumni yang aktif mencari kerja terdorong melengkapi data karier mereka.

#### Acceptance Criteria

1. WHEN Alumni membuka halaman detail lowongan, THE Portal_Karir SHALL menampilkan Status_Pemenuhan yang berlaku untuk lowongan tersebut sebelum menampilkan tombol Lamar.
2. WHERE Cakupan_Gating memuat `Lamaran_Lowongan` DAN Mode_Gating bernilai `Keras` DAN Status_Pemenuhan bernilai `Belum_Terpenuhi`, WHEN Alumni menekan tombol Lamar, THE Sistem_Gating SHALL menahan pengiriman lamaran dan menampilkan halaman pemenuhan prasyarat.
3. WHERE Cakupan_Gating tidak memuat `Lamaran_Lowongan`, WHEN Alumni menekan tombol Lamar, THE Portal_Karir SHALL mengirim lamaran tanpa memeriksa Status_Pemenuhan.
4. WHEN Status_Pemenuhan bernilai `Terpenuhi`, THE Portal_Karir SHALL mengirim lamaran tanpa langkah tambahan.
5. WHEN Alumni menyelesaikan seluruh Wave_Prasyarat setelah lamaran tertahan, THE Portal_Karir SHALL mengembalikan Alumni ke halaman detail lowongan yang sama dengan berkas lamaran yang sudah diisi tetap tersimpan.
6. WHEN Sistem_Gating menahan satu lamaran, THE Log_Audit SHALL mencatat identitas akun, identitas lowongan, waktu, dan daftar Wave_Prasyarat yang belum terpenuhi.
7. THE Sistem_Gating SHALL mengizinkan Alumni melihat daftar dan detail lowongan tanpa memeriksa Status_Pemenuhan.
8. THE Sistem_Gating SHALL mengizinkan Alumni melihat riwayat lamaran yang sudah terkirim tanpa memeriksa Status_Pemenuhan.

### Requirement 5: Evaluasi Prasyarat pada Pendaftaran Event

**User Story:** Sebagai Admin CDC, saya ingin memilih jenis Event mana yang di-gate, sehingga Event yang bersifat edukasi karier tetap terbuka bagi yang paling membutuhkannya.

#### Acceptance Criteria

1. THE Panel_Admin_CDC SHALL menyediakan pilihan Gating terpisah untuk setiap Jenis_Event: `Virtual_Job_Fair`, `Campus_Hiring`, `Career_Workshop`, `Career_Seminar`, dan `Coaching_Karier`.
2. THE Panel_Admin_CDC SHALL menetapkan Gating pada Jenis_Event `Career_Workshop`, `Career_Seminar`, dan `Coaching_Karier` bernilai nonaktif sebagai nilai bawaan.
3. WHERE Gating aktif untuk satu Jenis_Event DAN Mode_Gating bernilai `Keras` DAN Status_Pemenuhan bernilai `Belum_Terpenuhi`, WHEN Alumni menekan tombol Daftar pada Event berjenis tersebut, THE Sistem_Gating SHALL menahan pendaftaran dan menampilkan halaman pemenuhan prasyarat.
4. WHERE Gating nonaktif untuk satu Jenis_Event, WHEN Alumni menekan tombol Daftar pada Event berjenis tersebut, THE Modul_Event SHALL mendaftarkan Alumni tanpa memeriksa Status_Pemenuhan.
5. THE Sistem_Gating SHALL mengizinkan seluruh akun melihat daftar dan detail Event tanpa memeriksa Status_Pemenuhan.
6. IF satu Event dijadwalkan mulai dalam kurang dari 24 jam, THEN THE Sistem_Gating SHALL mengizinkan pendaftaran pada Event tersebut tanpa memeriksa Status_Pemenuhan.
7. WHEN Sistem_Gating menahan satu pendaftaran Event, THE Log_Audit SHALL mencatat identitas akun, identitas Event, waktu, dan daftar Wave_Prasyarat yang belum terpenuhi.

### Requirement 6: Jalan Keluar untuk Wave yang Sudah Tertutup

**User Story:** Sebagai Alumni yang melewatkan tenggat pengisian, saya ingin tetap punya cara memenuhi prasyarat, sehingga saya tidak kehilangan akses melamar kerja secara permanen.

#### Acceptance Criteria

1. WHEN tanggal berjalan melewati Tanggal_Akhir_Wave pada satu Wave_Prasyarat, THE Sistem_Gating SHALL menetapkan Wave tersebut bernilai `Tidak_Berlaku` dalam perhitungan Status_Pemenuhan.
2. IF seluruh Wave_Prasyarat pada satu Relasi_PT bernilai `Tidak_Berlaku`, THEN THE Sistem_Gating SHALL menetapkan Status_Pemenuhan bernilai `Terpenuhi` pada Relasi_PT tersebut.
3. WHEN Sistem_Gating menetapkan satu Wave_Prasyarat bernilai `Tidak_Berlaku` karena Tanggal_Akhir_Wave terlampaui, THE Dasbor_Dampak_Gating SHALL menampilkan jumlah akun yang lolos Gating melalui jalur tersebut.
4. WHERE satu Wave_Prasyarat sudah melewati Tanggal_Akhir_Wave DAN Wave berikutnya pada Relasi_PT yang sama sudah terbuka, THE Modul_Tracer_Study SHALL mengarahkan Alumni mengisi Wave yang masih terbuka.
5. THE Sistem_Gating SHALL membatasi jumlah Wave_Prasyarat yang dievaluasi pada satu Relasi_PT hanya pada Wave yang berada dalam rentang Tanggal_Mulai sampai Tanggal_Akhir_Wave.
6. IF satu akun berstatus `Belum_Terpenuhi` selama lebih dari 180 hari berturut-turut, THEN THE Sistem_Notifikasi SHALL memberitahu Admin CDC agar meninjau akun tersebut untuk Pembebasan_Manual.

### Requirement 7: Penentuan Cakupan Gating pada Akun Multi-PT

**User Story:** Sebagai Alumni dari dua kampus, saya ingin prasyarat tracer satu kampus tidak memblokir akses saya ke lowongan kampus lain, sehingga kewajiban saya jelas dan proporsional.

#### Acceptance Criteria

1. THE Sistem_Gating SHALL menghitung Status_Pemenuhan secara terpisah untuk setiap Relasi_PT pada satu akun.
2. WHEN Alumni melamar lowongan yang diterbitkan oleh satu PT_Klien, THE Sistem_Gating SHALL memakai Status_Pemenuhan pada Relasi_PT antara akun tersebut dan PT_Klien penerbit lowongan.
3. IF akun tidak memiliki Relasi_PT dengan PT_Klien penerbit lowongan, THEN THE Sistem_Gating SHALL mengizinkan lamaran pada lowongan tersebut.
4. WHEN Alumni melamar lowongan yang diterbitkan oleh perusahaan tanpa keterkaitan PT_Klien, THE Sistem_Gating SHALL memakai Status_Pemenuhan pada Relasi_PT dengan Tahun_Lulus terbaru yang Gating-nya aktif.
5. WHEN Alumni mendaftar Event yang diselenggarakan oleh satu PT_Klien, THE Sistem_Gating SHALL memakai Status_Pemenuhan pada Relasi_PT antara akun tersebut dan PT_Klien penyelenggara Event.
6. WHERE satu akun memiliki lebih dari satu Relasi_PT berstatus `Belum_Terpenuhi`, WHEN Sistem_Gating menahan satu Aksi_Ter-gate, THE Portal_Karir SHALL menampilkan nama PT_Klien yang prasyaratnya menahan aksi tersebut.

### Requirement 8: Tiga Tingkat Ketegasan Gating

**User Story:** Sebagai Admin CDC, saya ingin memulai dengan tekanan ringan dan menaikkannya bertahap, sehingga saya dapat mengukur dampak sebelum memberlakukan aturan keras.

#### Acceptance Criteria

1. WHERE Mode_Gating bernilai `Lunak` DAN Status_Pemenuhan bernilai `Belum_Terpenuhi`, WHEN Alumni membuka halaman detail lowongan atau detail Event, THE Portal_Karir SHALL menampilkan sebuah spanduk pengingat yang memuat tautan ke kuesioner dan tombol tutup.
2. WHERE Mode_Gating bernilai `Lunak`, THE Sistem_Gating SHALL mengizinkan seluruh Aksi_Ter-gate.
3. WHEN Alumni menutup spanduk pengingat, THE Portal_Karir SHALL menyembunyikan spanduk tersebut selama 7 hari pada akun tersebut.
4. WHERE Mode_Gating bernilai `Bertahap` DAN jumlah Aksi_Ter-gate yang sudah dilakukan Alumni pada Relasi_PT tersebut lebih kecil daripada Kuota_Bebas, THE Sistem_Gating SHALL mengizinkan Aksi_Ter-gate dan menampilkan jumlah sisa Kuota_Bebas.
5. WHERE Mode_Gating bernilai `Bertahap` DAN jumlah Aksi_Ter-gate yang sudah dilakukan Alumni pada Relasi_PT tersebut sama dengan atau lebih besar daripada Kuota_Bebas DAN Status_Pemenuhan bernilai `Belum_Terpenuhi`, WHEN Alumni melakukan Aksi_Ter-gate, THE Sistem_Gating SHALL menahan aksi tersebut.
6. THE Sistem_Gating SHALL menghitung pemakaian Kuota_Bebas hanya dari Aksi_Ter-gate yang berhasil terkirim.
7. WHEN Admin CDC menaikkan Mode_Gating dari `Lunak` ke `Bertahap` atau ke `Keras`, THE Sistem_Notifikasi SHALL memberitahu seluruh akun berstatus `Belum_Terpenuhi` pada PT tersebut minimal 14 hari sebelum tanggal berlaku yang ditetapkan Admin CDC.
8. WHILE tanggal berjalan berada sebelum tanggal berlaku yang ditetapkan Admin CDC, THE Sistem_Gating SHALL memakai Mode_Gating sebelumnya.

### Requirement 9: Transparansi Alasan dan Jalur Pemenuhan

**User Story:** Sebagai Alumni yang aksinya tertahan, saya ingin tahu persis apa yang harus saya isi dan berapa lama waktunya, sehingga saya dapat menyelesaikannya tanpa mencari-cari.

#### Acceptance Criteria

1. WHEN Sistem_Gating menahan satu Aksi_Ter-gate, THE Portal_Karir SHALL menampilkan nama PT_Klien, daftar Wave_Prasyarat yang belum terpenuhi, dan Tanggal_Akhir_Wave setiap Wave tersebut.
2. WHEN Sistem_Gating menahan satu Aksi_Ter-gate, THE Portal_Karir SHALL menampilkan perkiraan jumlah pertanyaan yang harus dijawab pada Wave_Prasyarat yang belum terpenuhi.
3. WHEN Sistem_Gating menahan satu Aksi_Ter-gate, THE Portal_Karir SHALL menampilkan satu tautan yang membuka kuesioner Wave_Prasyarat secara langsung.
4. WHEN Alumni membuka kuesioner dari halaman pemenuhan prasyarat, THE Modul_Tracer_Study SHALL mengisi awal setiap pertanyaan yang jawabannya sudah tersedia dari SIAKAD atau dari Wave sebelumnya.
5. WHEN Alumni menyelesaikan seluruh Wave_Prasyarat, THE Portal_Karir SHALL menampilkan konfirmasi bahwa Status_Pemenuhan bernilai `Terpenuhi` beserta tautan kembali ke aksi yang tertahan.
6. THE Portal_Karir SHALL menampilkan indikator Status_Pemenuhan pada halaman profil pengguna untuk setiap Relasi_PT yang Gating-nya aktif.

### Requirement 10: Penjagaan Kualitas Jawaban

**User Story:** Sebagai Admin CDC, saya ingin jawaban yang masuk karena Gating tetap layak dipakai untuk IKU #2 dan akreditasi, sehingga kenaikan angka pengisian tidak menghasilkan data yang tidak dapat dipertanggungjawabkan.

#### Acceptance Criteria

1. WHEN Alumni mengirim jawaban satu Wave, THE Pemeriksa_Kualitas_Jawaban SHALL memverifikasi bahwa setiap pertanyaan wajib pada cabang status yang dipilih sudah terisi.
2. IF satu pertanyaan wajib pada cabang status yang dipilih belum terisi, THEN THE Modul_Tracer_Study SHALL menahan pengiriman dan menandai pertanyaan tersebut.
3. WHEN Alumni mengirim jawaban satu Wave, THE Pemeriksa_Kualitas_Jawaban SHALL menghitung Skor_Indikasi_Asal berdasarkan tiga penanda: durasi pengisian, keseragaman jawaban pada pertanyaan matriks, dan panjang jawaban teks bebas.
4. WHEN Skor_Indikasi_Asal melewati Ambang_Indikasi yang dikonfigurasi Admin CDC, THE Pemeriksa_Kualitas_Jawaban SHALL menandai jawaban tersebut sebagai `Perlu_Ditinjau` dan menyimpan penanda yang terpicu.
5. THE Sistem_Gating SHALL menetapkan Status_Pemenuhan bernilai `Terpenuhi` untuk jawaban bertanda `Perlu_Ditinjau`.
6. THE Dasbor_Dampak_Gating SHALL menampilkan jumlah dan persentase jawaban bertanda `Perlu_Ditinjau` per Wave dan per program studi.
7. WHEN Admin CDC menandai satu jawaban sebagai tidak layak pakai, THE Modul_Tracer_Study SHALL mengeluarkan jawaban tersebut dari agregasi laporan IKU #2 dan menyimpan alasannya.
8. THE Pemeriksa_Kualitas_Jawaban SHALL menyimpan durasi pengisian setiap jawaban Wave dalam satuan detik.

### Requirement 11: Persetujuan dan Pelindungan Data Pribadi

**User Story:** Sebagai Alumni, saya ingin tahu data apa yang dikumpulkan dan untuk apa sebelum saya mengisi, sehingga persetujuan saya diberikan dengan sadar.

#### Acceptance Criteria

1. WHEN Alumni membuka kuesioner Wave_Prasyarat untuk pertama kali pada satu Relasi_PT, THE Modul_Tracer_Study SHALL menampilkan pernyataan tujuan pengumpulan data, daftar kategori data yang dikumpulkan, dan daftar penerima data.
2. THE Modul_Tracer_Study SHALL meminta persetujuan eksplisit Alumni sebelum menyimpan jawaban Wave pertama pada satu Relasi_PT.
3. WHEN Alumni memberikan persetujuan, THE Log_Audit SHALL mencatat identitas akun, waktu, dan versi pernyataan persetujuan.
4. THE Modul_Tracer_Study SHALL menyediakan jalur bagi Alumni untuk melihat seluruh jawaban Wave yang pernah dikirimkannya.
5. WHERE satu pertanyaan bertanda opsional, THE Modul_Tracer_Study SHALL mengizinkan Alumni mengirim jawaban Wave tanpa mengisi pertanyaan tersebut.
6. THE Panel_Admin_CDC SHALL menampilkan peringatan bahwa pemberlakuan Mode_Gating `Keras` memerlukan telaah kepatuhan pelindungan data pribadi oleh PT sebelum konfigurasi disimpan.
7. IF Alumni menolak memberikan persetujuan, THEN THE Sistem_Gating SHALL menetapkan Status_Pemenuhan bernilai `Tidak_Berlaku` dan mencatat penolakan tersebut.

### Requirement 12: Pembebasan Manual oleh Admin CDC

**User Story:** Sebagai Admin CDC, saya ingin dapat membebaskan akun tertentu dari Gating, sehingga kasus tepi yang tidak terduga dapat saya selesaikan tanpa menunggu perubahan sistem.

#### Acceptance Criteria

1. THE Panel_Admin_CDC SHALL menyediakan aksi Pembebasan_Manual pada halaman detail setiap akun yang memiliki Relasi_PT dengan PT tersebut.
2. WHEN Admin CDC menetapkan Pembebasan_Manual, THE Panel_Admin_CDC SHALL meminta alasan berupa teks dan tanggal berakhir pembebasan.
3. WHILE Pembebasan_Manual berlaku pada satu Relasi_PT, THE Sistem_Gating SHALL mengizinkan seluruh Aksi_Ter-gate pada Relasi_PT tersebut.
4. WHEN tanggal berjalan melewati tanggal berakhir Pembebasan_Manual, THE Sistem_Gating SHALL menghitung ulang Status_Pemenuhan pada Relasi_PT tersebut.
5. WHEN Pembebasan_Manual ditetapkan atau dicabut, THE Log_Audit SHALL mencatat identitas Admin CDC, identitas akun, waktu, alasan, dan tanggal berakhir.
6. THE Panel_Admin_CDC SHALL menampilkan daftar seluruh Pembebasan_Manual yang berlaku pada PT tersebut.

### Requirement 13: Pemantauan Dampak dan Penjagaan Pemakaian Portal Karir

**User Story:** Sebagai Admin CDC, saya ingin melihat dampak Gating pada pengisian tracer sekaligus pada pemakaian Portal Karir, sehingga saya dapat menghentikannya jika ternyata merugikan.

#### Acceptance Criteria

1. THE Dasbor_Dampak_Gating SHALL menampilkan tingkat penyelesaian setiap Wave per bulan sejak 12 bulan sebelum tanggal berjalan.
2. THE Dasbor_Dampak_Gating SHALL menampilkan jumlah lamaran terkirim dan jumlah pendaftaran Event per bulan sejak 12 bulan sebelum tanggal berjalan.
3. THE Dasbor_Dampak_Gating SHALL menampilkan jumlah Aksi_Ter-gate yang tertahan dan jumlah Alumni yang menyelesaikan Wave_Prasyarat setelah aksinya tertahan.
4. THE Dasbor_Dampak_Gating SHALL menampilkan Rasio_Konversi_Gating, yaitu jumlah Alumni yang menyelesaikan Wave_Prasyarat setelah aksinya tertahan dibagi jumlah Alumni yang aksinya tertahan.
5. THE Dasbor_Dampak_Gating SHALL menampilkan jumlah Alumni yang aksinya tertahan dan tidak melakukan Aksi_Ter-gate lagi dalam 30 hari sesudahnya.
6. IF jumlah lamaran terkirim per bulan pada satu PT turun lebih dari 30 persen dibandingkan rata-rata tiga bulan sebelum Gating aktif, THEN THE Sistem_Notifikasi SHALL memberitahu Admin CDC beserta angka pembandingnya.
7. THE Panel_Admin_CDC SHALL menyediakan aksi menonaktifkan Gating yang berlaku pada seluruh akun PT tersebut dalam satu langkah.
8. WHEN Admin CDC menonaktifkan Gating, THE Sistem_Gating SHALL mengizinkan seluruh Aksi_Ter-gate pada PT tersebut.

### Requirement 14: Insentif sebagai Pelengkap Gating

**User Story:** Sebagai Admin CDC, saya ingin memberi keuntungan nyata bagi Alumni yang sudah mengisi, sehingga pengisian didorong oleh manfaat dan bukan hanya oleh hambatan.

#### Acceptance Criteria

1. WHERE Insentif_Pengisian aktif pada satu PT_Klien DAN Status_Pemenuhan bernilai `Terpenuhi`, THE Portal_Karir SHALL menampilkan penanda Profil_Terverifikasi pada lamaran Alumni tersebut.
2. WHERE Insentif_Pengisian aktif pada satu PT_Klien, THE Panel_Admin_CDC SHALL mengizinkan Admin CDC menandai satu Event sebagai Event_Eksklusif yang pendaftarannya terbatas pada akun berstatus `Terpenuhi`.
3. WHEN Alumni menyelesaikan seluruh Wave_Prasyarat, THE Sistem_Notifikasi SHALL mengirim ringkasan manfaat yang menjadi terbuka bagi Alumni tersebut.
4. THE Panel_Admin_CDC SHALL mengizinkan Insentif_Pengisian aktif bersamaan dengan Mode_Gating `Lunak`.

---

## Lampiran A: Risiko yang Perlu Ditelaah Sebelum Desain

Ketiga risiko berikut bersifat produk dan kebijakan, bukan hanya teknis. Requirements di atas menyediakan alat ukur dan mitigasi, tetapi keputusan menerima atau menolak risiko berada di luar cakupan dokumen ini.

| Risiko | Wujudnya | Mitigasi yang sudah masuk requirements | Yang masih perlu keputusan |
|---|---|---|---|
| **Kualitas data menurun** | Alumni yang dipaksa mengisi cenderung memilih jawaban tercepat, bukan yang benar. Data IKU #2 dan akreditasi jadi tidak dapat dipertanggungjawabkan justru saat angka pengisiannya naik. | Requirement 10: validasi kelengkapan per cabang, Skor_Indikasi_Asal dari tiga penanda, penandaan `Perlu_Ditinjau`, dan jalur mengeluarkan jawaban dari agregasi. | Ambang_Indikasi awal. Apakah jawaban `Perlu_Ditinjau` tetap dihitung dalam denominator Slovin. Siapa yang bertanggung jawab meninjau, dan berapa kapasitas tinjauannya. |
| **Pemakaian Portal Karir menurun** | Jika melamar jadi sulit, mahasiswa dan alumni berpindah ke Jobstreet atau Glints. Nilai Portal Karir bagi PT dan bagi perusahaan mitra justru turun, dan sinyal karier yang bisa dipanen Karirlink hilang. | Requirement 13: metrik penjaga berupa jumlah lamaran per bulan, Rasio_Konversi_Gating, jumlah Alumni yang berhenti beraksi setelah tertahan, peringatan otomatis pada penurunan lebih dari 30 persen, dan tombol nonaktif satu langkah. Requirement 8: Mode_Gating bertingkat agar dampak terukur sebelum aturan keras berlaku. | Ambang penurunan 30 persen adalah nilai awal yang perlu divalidasi dengan data nyata. Apakah penurunan lamaran dapat diterima jika pengisian tracer naik, dan sampai titik mana. |
| **Persetujuan dan pelindungan data pribadi** | Menjadikan pengisian data pribadi sebagai syarat mengakses layanan bersinggungan dengan asas persetujuan yang bebas. Persetujuan yang diberikan karena akses layanan ditahan dapat dipersoalkan keabsahannya. | Requirement 11: pernyataan tujuan sebelum pengisian, persetujuan eksplisit tercatat berversi, pertanyaan opsional tetap dapat dilewati, penolakan persetujuan tidak menyebabkan blokir permanen, dan peringatan telaah kepatuhan sebelum Mode_Gating `Keras` disimpan. | **Perlu telaah hukum terpisah.** Apakah Mode_Gating `Keras` dapat diberlakukan sama sekali. Apakah dasar pemrosesan yang dipakai adalah persetujuan atau kewajiban hukum pelaporan PT. Bagaimana posisi Karirlink sebagai prosesor terhadap PT sebagai pengendali data. |

## Lampiran B: Alternatif Pembanding

Empat pendekatan berikut lebih lunak daripada gating keras dan sudah terwakili dalam requirements sebagai konfigurasi, bukan sebagai fitur terpisah. Dicatat di sini agar perbandingannya eksplisit saat keputusan diambil.

| Alternatif | Wujud dalam requirements | Kelebihan | Kekurangan |
|---|---|---|---|
| **Soft gating** — spanduk pengingat yang dapat ditutup, aksi tetap berjalan | Mode_Gating `Lunak` (Requirement 8 AC 1–3) | Tanpa risiko kehilangan pengguna. Tidak menyentuh persoalan persetujuan. | Kenaikan pengisian kemungkinan kecil. |
| **Gating bertahap** — boleh melakukan N aksi dulu, sesudahnya wajib mengisi | Mode_Gating `Bertahap` dengan Kuota_Bebas (Requirement 8 AC 4–6) | Pengguna sudah merasakan manfaat Portal Karir sebelum diminta membalas. Menyaring pengguna yang benar-benar aktif. | Menambah keadaan yang harus dilacak per akun per PT. Kuota_Bebas yang tepat perlu diukur. |
| **Insentif alih-alih paksaan** — penanda profil terverifikasi, Event eksklusif | Requirement 14 | Jawaban lebih mungkin jujur karena pengisian bersifat sukarela. Tidak bersinggungan dengan asas persetujuan. | Bergantung pada nilai insentif yang dipersepsikan. Sulit mencapai ambang Slovin hanya dengan ini. |
| **Gating hanya pada aksi bernilai tinggi** — mis. Campus Hiring eksklusif, bukan semua lamaran | Gating per Jenis_Event (Requirement 5 AC 1–2) dan Cakupan_Gating terpilih (Requirement 1 AC 3) | Tekanan terarah pada aksi yang paling diinginkan pengguna. Portal Karir sehari-hari tetap terbuka. | Jangkauannya terbatas pada pengguna yang mengejar aksi tersebut. |

**Catatan urutan penerapan yang disarankan:** `Lunak` → ukur dengan Requirement 13 → `Bertahap` → ukur → pertimbangkan `Keras` hanya setelah telaah pelindungan data pribadi selesai.

## Lampiran C: Keputusan yang Masih Terbuka

1. **Nilai bawaan Kuota_Bebas** pada Mode_Gating `Bertahap`. Requirement 1 AC 7 membatasi rentang 1 sampai 20 tanpa menetapkan nilai bawaan.
2. **Panjang Masa_Tenggang_Transisi** setelah status berubah dari Mahasiswa_Aktif menjadi Alumni (Requirement 2 AC 8). Perlu diselaraskan dengan jadwal pengiriman Wave_Exit.
3. **Ketersediaan Student_Survey.** Requirement 2 AC 3 bergantung pada Student_Survey sebagai instrumen yang benar-benar terkirim ke Mahasiswa_Aktif. Pada dokumentasi saat ini, Student_Survey masih tercatat sebagai *time window* pada menu Kuesioner tanpa alur pengisian yang sudah dimockup. Perlu konfirmasi status implementasinya.
4. **Perlakuan lowongan tanpa keterkaitan PT_Klien.** Requirement 7 AC 4 memilih Relasi_PT dengan Tahun_Lulus terbaru. Aturan ini perlu diuji terhadap kasus alumni yang Gating-nya aktif di dua PT sekaligus.
5. **Interaksi dengan *backfill logic*.** Catatan A/B testing masih membuka pertanyaan apakah alumni yang pertama login pada masa G2 diarahkan mengisi G1 dulu atau langsung G2. Requirement 6 AC 4 mengarahkan ke Wave yang masih terbuka, dan keputusan itu perlu disepakati bersama keputusan backfill.
6. **Ambang_Indikasi awal** untuk Skor_Indikasi_Asal (Requirement 10 AC 4), termasuk bobot ketiga penanda.
7. **Dampak Gating pada perhitungan denominator Slovin.** Apakah jawaban yang masuk karena Gating diperlakukan sama dengan jawaban sukarela dalam pelaporan IKU #2.
8. **Kepemilikan keputusan Mode_Gating `Keras`.** Apakah Sevima menyediakannya sebagai pilihan konfigurasi, atau menahannya sampai ada dasar hukum yang jelas per PT.
