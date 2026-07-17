# Setup Vercel - URL Sederhana untuk Banyak Versi Mockup

## Tujuan

Tiap versi mockup (v1, v2, dst.) disimpan dalam folder nested (karena mengikuti struktur template/vendor aslinya), tapi URL yang diakses user tetap pendek dan konsisten:

```text
tracer-study.vercel.app/v1/index.html
tracer-study.vercel.app/v1/dashboard.html
tracer-study.vercel.app/v1/alumni.html
```

Ini dicapai dengan **rewrite** di `vercel.json`, bukan dengan memindahkan file secara fisik.

---

## Struktur Project Saat Ini

```text
tracer-study/
├── vercel.json
└── v1/
    └── quantum/              <- nama folder mengikuti nama template ("quantum")
        ├── index.html
        ├── dashboard.html
        ├── alumni.html
        ├── ...html lainnya
        └── assets/
            ├── css/          (main.css, portal-karir.css — override khusus halaman)
            ├── karirlink/    (css & gambar brand Karirlink)
            └── vendors/      (Quantum, Choices.js, dll.)
```

> Semua HTML dan semua asetnya berada **dalam satu folder yang sama** (`v1/quantum/`). Ini wajib — lihat aturan path di bawah.

---

## Konfigurasi `vercel.json`

```json
{
  "rewrites": [
    {
      "source": "/v1/:path*",
      "destination": "/v1/quantum/:path*"
    }
  ]
}
```

Artinya: setiap request ke `/v1/...` — baik file HTML maupun asset (css/js/gambar) — diarahkan ke `/v1/quantum/...` di belakang layar. Browser tetap melihat URL pendek (`/v1/index.html`), tapi file yang benar-benar dibuka ada di `/v1/quantum/index.html`.

| URL yang diakses user   | File yang sebenarnya dibuka           |
| ------------------------ | -------------------------------------- |
| `/v1/index.html`         | `/v1/quantum/index.html`               |
| `/v1/dashboard.html`     | `/v1/quantum/dashboard.html`            |
| `/v1/assets/css/main.css`| `/v1/quantum/assets/css/main.css`      |

---

## Aturan Wajib: Path Asset Harus Relatif Same-Level (`./`)

Rewrite hanya bekerja untuk request yang **tetap berada di dalam prefix `/v1/`**. Karena browser me-resolve path relatif berdasarkan URL yang terlihat (`/v1/index.html`), bukan lokasi file sebenarnya, maka:

✅ **Benar** — pakai `./` (tetap di dalam `/v1/`, ikut ter-rewrite):
```html
<link rel="stylesheet" href="./assets/css/main.css">
<script src="./assets/vendors/.../qn-202310260001.js"></script>
<img src="./assets/karirlink/images/logo/karirlink-colored.webp">
```

❌ **Salah** — pakai `../` (keluar dari prefix `/v1/`, jadi 404):
```html
<link rel="stylesheet" href="../assets/css/main.css">
```
`../assets/...` dari `/v1/index.html` akan diminta browser sebagai `/assets/...` — sudah keluar dari `/v1/`, sehingga rewrite tidak berlaku dan file tidak ditemukan.

❌ **Salah** — pakai path absolut (`/...`):
```html
<link rel="stylesheet" href="/assets/css/main.css">
```
Path absolut selalu dicari dari root project, bukan dari folder versi.

### Kenapa masih perlu `<base href="/v1/">`

`./assets/...` di atas hanya resolve dengan benar kalau URL yang terlihat browser diakhiri trailing slash setelah `v1` (mis. `/v1/` atau `/v1/index.html`). Kalau user mengakses tanpa trailing slash (`/v1`) atau lewat sub-path lain, resolusi path relatif bisa meleset dan aset gagal dimuat.

Untuk menghindari itu, tiap halaman punya `<base>` tag di awal `<head>`, dipasang tetap (hardcode) sesuai prefix versinya:

```html
<head>
    <base href="/v1/">
    ...
</head>
```

Ini memaksa semua path relatif (`./assets/...`, `./dashboard.html`, dll.) selalu di-resolve dari `/v1/`, apapun URL persis yang diketik user — lalu tetap diteruskan ke rewrite di `vercel.json` seperti biasa.

> **Trade-off:** karena `<base href="/v1/">` berupa path absolut dari root domain, membuka file HTML langsung secara lokal (double-click / `file://`) tidak akan menemukan asetnya. Untuk preview lokal yang akurat, jalankan lewat local server (mis. `vercel dev`) atau `python -m http.server` dari root project lalu akses `http://localhost:<port>/v1/...`.

---

## Menambah Versi Baru (v2, v3, dst.)

1. Buat folder versi baru dengan pola yang sama — semua HTML + `assets/` dalam satu folder nested:
   ```text
   v2/<nama-folder-template>/
   ├── index.html
   ├── ...
   └── assets/
   ```
2. Pastikan semua path asset di HTML pakai `./assets/...` (relatif same-level), bukan `../` atau `/`.
3. Tambahkan `<base href="/v2/">` di awal `<head>` tiap halaman (sesuaikan prefix dengan nomor versi).
4. Tambahkan satu rewrite baru di `vercel.json`:
   ```json
   {
     "rewrites": [
       { "source": "/v1/:path*", "destination": "/v1/quantum/:path*" },
       { "source": "/v2/:path*", "destination": "/v2/<nama-folder-template>/:path*" }
     ]
   }
   ```

### Alternatif: satu rule untuk semua versi

Jika semua versi kebetulan memakai nama folder template yang sama (mis. semua `quantum`), rewrite bisa disederhanakan dengan wildcard versi:

```json
{
  "rewrites": [
    {
      "source": "/:version(v1|v2|v3)/:path*",
      "destination": "/:version/quantum/:path*"
    }
  ]
}
```

Tapi karena nama folder template **bisa berbeda-beda per versi** (sesuai catatan awal project ini), cara paling aman tetap menuliskan satu rule eksplisit per versi seperti pada langkah 3 di atas.

---

## Troubleshooting

- **CSS/JS/gambar tidak muncul (404) saat diakses lewat domain Vercel, tapi normal saat dibuka lokal** → cek apakah ada path asset yang masih pakai `../` atau `/`. Ganti ke `./`.
- **Halaman lain (`dashboard.html`, dll.) 404** → pastikan file itu ada di dalam folder nested yang sama (`v1/quantum/`), dan rewrite `source` mencakup path tersebut (`/v1/:path*` sudah mencakup semua sub-path).
- **Setelah deploy, perlu cek ulang** → jalankan preview Vercel dan buka tab Network di browser untuk memastikan tidak ada request 404 ke asset.
