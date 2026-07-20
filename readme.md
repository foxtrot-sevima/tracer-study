# Setup Versi Mockup (v1, v2, dst.)

## Tujuan

Tiap versi mockup punya folder sendiri, diakses lewat URL sederhana:

```text
tracer-study.vercel.app/v1/index.html      (Dashboard - halaman utama)
tracer-study.vercel.app/v1/kuesioner.html
tracer-study.vercel.app/v1/alumni.html
```

Polanya mengikuti struktur project [DimsPorf](https://dimsporf.vercel.app): **tidak ada rewrite, tidak ada folder nested** - folder versi (`v1/`, `v2/`, dst.) langsung berisi semua halaman HTML dan `assets/`-nya di level yang sama. Karena struktur fisik sudah 1:1 dengan URL yang diakses, tidak perlu `vercel.json` atau konfigurasi tambahan apa pun.

---

## Struktur Project

```text
tracer-study/
└── v1/
    ├── index.html      (Dashboard - halaman utama/landing)
    ├── kuesioner.html
    ├── alumni.html
    ├── ...html lainnya
    └── assets/
        ├── css/          (main.css, portal-karir.css - override khusus halaman)
        ├── karirlink/    (css & gambar brand Karirlink)
        └── vendors/      (Quantum, Choices.js, dll.)
```

---

## Aturan Path Asset: `<base>` + Path Relatif

Tiap halaman punya `<base>` tag di awal `<head>`, sesuai prefix foldernya:

```html
<head>
    <base href="/v1/">
    ...
</head>
```

Dengan `<base>` terpasang, semua path relatif di halaman itu (asset maupun link antar halaman) otomatis di-resolve dari `/v1/` - jadi cukup tulis biasa, tanpa awalan apa pun:

```html
<link rel="stylesheet" href="assets/css/main.css">
<script src="assets/vendors/.../qn-202310260001.js"></script>
<img src="assets/karirlink/images/logo/karirlink-colored.webp">
<a href="kuesioner.html">Kuesioner</a>
```

Karena folder `v1/` **memang** folder yang diakses lewat URL `/v1/`, path relatif ini valid persis, di produksi maupun lokal - tidak ada mismatch antara lokasi file asli dan URL yang terlihat.

---

## Preview Lokal

Karena tidak ada rewrite yang perlu ditiru, preview lokal otomatis identik dengan produksi - cukup buka lewat local server mana pun (bukan `file://` double-click, karena `<base href="/v1/">` adalah path absolut yang butuh sebuah origin/server).

Termudah: pakai extension **Live Preview** di VS Code. `.vscode/settings.json` di project ini sudah diarahkan supaya langsung membuka halaman v1:

```json
{
    "livePreview.defaultPreviewPath": "/v1/index.html"
}
```

Alternatif tanpa VS Code: jalankan static server apa pun dari root project, mis. `npx serve .`, lalu buka `http://localhost:<port>/v1/index.html`.

---

## Menambah Versi Baru (v2, v3, dst.)

1. Buat folder versi baru dengan pola yang sama - semua HTML + `assets/` langsung di root folder versi (bukan nested):
   ```text
   v2/
   ├── index.html
   ├── ...
   └── assets/
   ```
2. Tambahkan `<base href="/v2/">` di awal `<head>` tiap halaman.
3. Tulis semua path asset & link antar halaman relatif biasa (`assets/...`, `dashboard.html`, dll.) - tidak perlu awalan `./`, `../`, atau path absolut.

Tidak perlu menyentuh `vercel.json` (project ini tidak memakainya) - Vercel otomatis serve `v2/index.html` di URL `/v2/index.html` karena strukturnya memang sudah cocok.

---

## Troubleshooting

- **CSS/JS/gambar tidak muncul (404)** → pastikan halaman itu punya `<base href="/vX/">` di awal `<head>`, dan path assetnya ditulis relatif tanpa `./` atau `../`.
- **Buka file HTML langsung (`file://`, double-click) → asset tidak kebaca** → ini diharapkan, karena `<base>` berupa path absolut yang butuh sebuah server/origin. Pakai Live Preview atau `npx serve` (lihat bagian Preview Lokal).
- **Setelah deploy, perlu cek ulang** → jalankan preview Vercel dan buka tab Network di browser untuk memastikan tidak ada request 404 ke asset.
