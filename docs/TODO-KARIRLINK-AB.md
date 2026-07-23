# TODO & Feature Mapping — KarirLink A/B (Existing vs Alternatif)

> Dokumen perencanaan untuk tim Foxtrot (Product squad). Memetakan **fitur existing** vs **keputusan di alternatif (Paket B — Single & Living + Portal Tergabung)**, beserta alasan dan dampak **key data dictionary**.
> Pendamping: `CATATAN-AB-TESTING-TRACER.md`. Belum masuk PRD sampai pemenang A/B disepakati.
> **Terakhir diperbarui:** 21 Juli 2026

## Legenda Status (di Alternatif)
- **TETAP** — fitur dipertahankan apa adanya.
- **UBAH** — dipertahankan tapi ada perubahan perilaku/data.
- **GABUNG** — dilebur ke navigasi/menu tergabung.
- **BARU** — fitur baru (belum ada di existing).
- **TANGGUHKAN** — belum diputuskan / di luar scope awal.

## Legenda Data Dictionary
- **(=)** disimpan/tetap · **(~)** berubah · **(+)** tambahan baru

---

## 1. Tracer Study — Admin CDC

| Fitur Existing | Status | Alasan | Key Data Dictionary |
|---|---|---|---|
| Daftar Kuesioner multi-template (Draft/Siap Kirim/Terkirim) | **UBAH** | Diganti **satu** kuesioner hidup per PT; hilangkan beban buat template berulang | (~) `kuesioner`: dari banyak record → satu instrumen ber-versi; (+) `questionnaire_version`, `published_at` |
| Template Lengkap/Kemdikbud/Pengguna Lulusan | **UBAH** | Tidak lagi memilih template; jadi tier `Core/Optional/Specific` pada satu instrumen | (+) `question.tier` (core/optional/specific); (=) bank pertanyaan Kemdikbud sbg Core |
| Builder kuesioner | **UBAH** | Admin hanya susun Specific + pilih Optional; Core terkunci | (+) `question.wave` (exit/g1/g2), `question.editable` |
| Finalisasi & Kirim (pilih tahun lulus/prodi + deadline) | **UBAH** | Diganti konsep **Campaign/wave** otomatis dari `cohort_year`; kirim per wave | (~) `pengiriman` → (+) `campaign`(wave, cohort_year, open_at, close_at) |
| Dashboard Tracer (pengisian, waktu tunggu, status, kesesuaian, tingkat kerja) | **GABUNG** | Dilebur ke master Dashboard tergabung + filter prodi/fakultas/angkatan/tahun | (=) metrik IKU; (+) dimensi filter fakultas/angkatan |
| Halaman detail analitik (6 detail-*) | **TETAP** | Tetap dibutuhkan untuk drill-down akreditasi | (=) |
| Daftar Alumni + Sinkron SIAKAD | **UBAH** | Jadi menu "Mahasiswa/Alumni" tergabung; + status karier & progres wave | (=) alumni master; (+) `career_status`, `wave_progress` |
| Publikasi | **TANGGUHKAN** | Belum jadi fokus A/B | (=) |
| Unduh hasil (APT/Excel/PDF) | **TETAP** | Kebutuhan pelaporan tetap | (=) |

---

## 2. Tracer Study — Sisi Alumni (Pengisian)

| Fitur Existing | Status | Alasan | Key Data Dictionary |
|---|---|---|---|
| Email undangan tracer | **TETAP** | Kanal distribusi tetap perlu | (=) ; (+) `campaign_id`, `wave` di link |
| Step1 (pilih tahun/jenjang/prodi) → Step2 (pilih diri) → Verify (DOB) | **UBAH** | Identitas dari login/gate + `cohort_year` otomatis; kurangi friksi | (~) alur verifikasi; (+) resolusi wave dari `cohort_year` |
| Form kuesioner (Section 1 dst) | **UBAH** | Konten adaptif per wave (Exit ringan / G1 wajib / G2 optional) | (+) `response.wave`, `response.version`; jawaban terkunci per wave |
| Halaman sukses + lowongan | **TETAP** | Cross-sell ke Portal Karir | (=) |
| Form Pengguna Lulusan (employer) | **TANGGUHKAN** | Track paralel, dikaji terpisah | (=) ; (+) trigger di G1/G2 |
| — (belum ada) Self-update profil alumni | **BARU** | Request kampus #3; wujud "living" sisi alumni | (+) `alumni_profile`(current_company, position, domicile, updated_at, source) |
| — (belum ada) Wizard adaptif per wave | **BARU** | Memvisualkan "living" & mengurangi kuesioner panjang | (+) render per `wave` |

---

## 3. Portal Karir — Admin CDC

| Fitur Existing | Status | Alasan | Key Data Dictionary |
|---|---|---|---|
| Beranda (profil PT, statistik pengikut/alumni) | **GABUNG** | Dilebur ke Dashboard tergabung | (=) |
| Feed / Bagikan Sesuatu (post lowongan/event) | **TETAP** | Kanal komunikasi ke alumni tetap bernilai | (=) `feed_post`(content, post_type, posted_at, author_id) |
| **Komentar & Suka di feed** | **TETAP** | Engagement 2 arah; sinyal minat alumni terhadap info karier. Tetap ada di alternatif | (=) `comment`(post_id, author_id, body, created_at), `like`(post_id, user_id) |
| Aktivitas Lamaran Alumni (monitoring) | **UBAH** | Dilebur ke Dashboard + Mahasiswa/Alumni; sinkron ke data karier | (=) `lamaran`(alumni_id, company_id, position, status, applied_at); (+) sync → `career_event` |
| Perusahaan Mitra (undang, status) | **GABUNG** | Masuk menu Aktivitas | (=) `partnership`(company, status, joined_at) |
| Buat Lowongan / Daftar Lowongan | **TETAP** | Inti Portal Karir | (=) `job` |
| Buat Event / Daftar Event | **GABUNG** | Masuk menu Aktivitas | (=) `event` |
| Kerja Sama (pencarian mitra, daftar mitra, kegiatan) | **GABUNG** | Masuk menu Aktivitas | (=) |
| Landing CDC publik | **TETAP** | Halaman publik alumni/pelamar | (=) |

---

## 4. Portal Karir — Perusahaan (Company)

| Fitur Existing | Status | Alasan | Key Data Dictionary |
|---|---|---|---|
| Register + Onboarding perusahaan | **TETAP** | Tidak terdampak A/B (di luar sisi PT) | (=) |
| Beranda perusahaan + feed | **TETAP** | — | (=) |
| Buat/Daftar Lowongan (+ batasi universitas) | **TETAP** | — | (=) `job.target_university` |
| Daftar Mitra / Kegiatan Kerja Sama | **TETAP** | — | (=) |
| Pencarian Mitra (perspektif perusahaan) | **TETAP** | Baru dibuat, tetap relevan | (=) |

> Catatan: sisi Perusahaan **tidak** menjadi bagian A/B (A/B fokus pada pengalaman Admin CDC & Alumni). Dicatat sebagai TETAP agar lengkap.

---

## 5. Fitur Baru — Request Institut Muslim Cendekia

| Fitur | Status | Alasan | Key Data Dictionary |
|---|---|---|---|
| Dashboard persebaran alumni per lokasi kerja + filter prodi/fakultas/angkatan/tahun | **BARU** (mockup dibuat) | Nilai institutional tracer; breakdown per prodi | (+) `alumni_profile.work_location`, agregasi geo |
| Dashboard demografi (gender per daerah) | **BARU** (mockup dibuat) | Insight sebaran; gender dari SIAKAD | (=) `gender` SIAKAD; agregasi |
| Self-update alumni | **BARU** | Living data sisi alumni | (+) `alumni_profile` + `source=self-update` |
| Monitoring perubahan data + audit trail + notifikasi | **BARU** (mockup dibuat) | Governance & mitigasi risiko self-update | (+) `data_change_log`(field, old, new, actor, source, timestamp) |
| Riwayat karier (append-only) | **BARU** (mockup dibuat) | Panel/longitudinal; bukan hanya kerja terakhir | (+) `career_event`(alumni_id, company, position, location, start, end, source) |

---

## 6. TODO List — Kandidat Semester 2 2026 (Foxtrot)

### A. Mockup / Desain (lanjutan A/B)
- [ ] **Sisi Alumni (sepaket):** wizard pengisian adaptif per wave (Exit/G1/G2) + view **self-update** profil.
- [ ] Mockup track **Pengguna Lulusan (employer)** dalam model single-living.
- [ ] Mockup **detail analitik** persebaran & demografi (drill-down dari dashboard).
- [ ] Review visual Quantum semua halaman A/B di browser (verifikasi kelas `alert_*`, ikon).

### B. Definisi Produk / Requirement
- [ ] Tetapkan **metrik keberhasilan A/B** (bagian 5 CATATAN) — beban admin, response rate per wave, kelengkapan IKU H+1, drop-out.
- [ ] Rancang **data model 2 bidang**: snapshot wave (terkunci, IKU) vs profil terkini (self-update).
- [ ] Definisikan `career_event` (append-only) & aturan perhitungan masa tunggu IKU #2.
- [ ] Definisikan `data_change_log` (audit) + aturan notifikasi PIC/CDC.
- [ ] Kebijakan **versioning/version-pinning** respons ke versi instrumen saat submit.
- [ ] Aturan **backfill** (alumni masuk saat sudah G2 tapi belum G1).
- [ ] **Consent & PII**: self-update, simpan riwayat karier, tampil ke CDC.

### C. Keputusan yang Menunggu
- [ ] Menang A/B mana (Paket A vs B) → baru update **PRD**.
- [ ] Kombinasi dimensi (model kuesioner × struktur navigasi) untuk eksekusi.
- [ ] Nasib fitur **Publikasi** & **Pengguna Lulusan** dalam alternatif.

### D. Prasyarat Teknis (untuk fase build)
- [ ] Integrasi SIAKAD: gender, prodi, fakultas, angkatan, tahun lulus, `cohort_year`.
- [ ] Sinkron Portal Karir → data karier master dashboard (nice to have).
- [ ] Bank pertanyaan Core (Kemdikti + Kemenkes) sebagai sumber terkunci.

---

## 7. Prinsip yang Dikunci (jangan hilang saat lanjut)
1. `wave` (Exit/G1/G2) dan `tier` (Core/Optional/Specific) = **dua atribut terpisah**.
2. Snapshot wave **terkunci** untuk IKU; self-update mengisi **profil terkini**, tidak menimpa.
3. Self-update = **pelengkap**, bukan pengganti survei wave (representativeness & Slovin dari G1).
4. Setiap data punya **provenance**: source + timestamp + actor.
5. PRD di-update **setelah** pemenang A/B disepakati.
