# Wave Exit
Tujuan: Kuesioner Wave Exit bertujuan untuk pemutakhiran data mahasiswa sebelum dia benar-benar lulus. Dengan begitu, mahasiswa bisa menerima Kuesioner Wave Graduate 1 (G1) dan Wave Graduate 2 (G2)

## Pertanyaan Wave Exit
| Pertanyaan | Variabel/Kode Dikti (Before)|Variabel/Kode Dikti (After) | Tipe Data | Mandatory? | Business Logic |
|---|---|---|---|---|---|
| Alamat email aktif Anda saat ini | email | email | email | Yes | Value otomatis muncul dari data sync Alumni, lalu bisa diedit jika mahasiswa ingin mengubahnya
| Nomor HP / WhatsApp aktif | phone | no_hp | numeric | Yes | value otomatis muncul dari SIAKAD, lalu bisa diedit jika mahasiswa ingin mengubahnya



## Matriks lengkap FINAL — semua 5 cabang

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
