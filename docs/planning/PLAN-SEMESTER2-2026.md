# Kickoff — Perencanaan Semester 2 2026 (Tim Foxtrot / Product Squad)

> Catatan pembuka untuk sesi perencanaan. Dibuat sebagai handoff agar sesi planning berikutnya langsung "hangat".
> **Dibuat:** 21 Juli 2026 · **Status:** Draft kickoff (belum final)

---

## 0. Cara Pakai Dokumen Ini
Saat memulai sesi planning baru, cukup arahkan ke dokumen ini. Ia menautkan seluruh konteks yang sudah dibangun dan mendaftar keputusan yang harus diambil.

## 1. Ruang Lingkup Pembahasan
- **KarirLink** (Tracer Study + Portal Karir) — bahasan utama, konteks paling matang.
- **Modul lain milik squad Foxtrot** — _(diisi saat planning: sebutkan modul apa saja)_.

## 2. Dokumen Konteks (baca dulu)
- `docs/CATATAN-AB-TESTING-TRACER.md` — konsep Single & Living, keputusan terkunci, progress mockup, request kampus, prinsip.
- `docs/TODO-KARIRLINK-AB.md` — feature mapping existing vs alternatif + **TODO Semester 2 (bagian 6)** + prinsip terkunci.
- `docs/PRD-Portal-Tracer-Study.md` & `docs/PRD-Portal-Karir.md` — PRD existing (baseline, belum diupdate).
- `regulasi/iku-kepmen-358-2025.md` — IKU (grounding regulasi, khususnya IKU #2).
- Mockup A/B: `mockup/ab-testing/paket-a-baseline/` & `paket-b-usulan/`.

## 3. Keputusan yang Harus Diambil saat Planning
- [ ] **Pemenang A/B** (Paket A vs B) — atau lanjut eksperimen dulu? (menentukan apakah PRD diupdate)
- [ ] **Metrik keberhasilan A/B** difinalkan (beban admin, response rate per wave, kelengkapan IKU H+1, drop-out).
- [ ] **Kombinasi dimensi** yang dieksekusi (model kuesioner × struktur navigasi).
- [ ] **Nasib fitur** Publikasi & Pengguna Lulusan dalam alternatif.
- [ ] **Prioritas request Institut Muslim Cendekia** (persebaran, demografi, self-update, audit, riwayat karier) — masuk Semester 2 atau backlog?
- [ ] **Scope build vs desain** — Semester 2 fokus finalisasi desain/PRD, atau sudah mulai development?

## 4. Kandidat Backlog (ringkasan dari TODO bagian 6)
- Desain: wizard alumni per wave + self-update; track employer; detail analitik persebaran/demografi.
- Requirement: data model 2 bidang (snapshot wave vs profil terkini); `career_event`; `data_change_log`; versioning; backfill; consent/PII.
- Prasyarat teknis: integrasi SIAKAD (`cohort_year` dll); sync Portal Karir→dashboard; bank pertanyaan Core Kemdikti/Kemenkes.

## 5. Kapasitas & Timeline Tim (diisi saat planning)
- Anggota squad & kapasitas: _(TBD)_
- Sprint/cadence: _(TBD)_
- Milestone Semester 2: _(TBD)_
- Dependensi lintas tim (SIAKAD, dll): _(TBD)_

## 6. Prinsip yang Dikunci (jangan berubah tanpa kesepakatan)
1. `wave` dan `tier` = dua atribut terpisah.
2. Snapshot wave terkunci untuk IKU; self-update mengisi profil terkini (tidak menimpa).
3. Self-update = pelengkap, bukan pengganti survei wave.
4. Setiap data punya provenance (source + timestamp + actor).
5. PRD diupdate setelah pemenang A/B disepakati.

---
_Ketika planning dimulai: isi bagian 1 (modul lain), bagian 5 (kapasitas/timeline), dan tuntaskan checklist bagian 3._
