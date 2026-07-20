# Struktur Menu Karirlink Admin CDC

``` mermaid
flowchart LR

    A["Masuk<br/>dari Gate"]

    B["Karirlink<br/>Admin<br/>CDC<br/><br/>Portal<br/>Karier dan<br/>Portal<br/>Tracer<br/>Study<br/>digabung,<br/>tidak<br/>sendiri-<br/>sendiri"]

    C["Menu Dashboard<br/>adalah <b>halaman<br/>utama</b> menampilkan<br/>informasi:<br/><br/>• <b>Data riwayat<br/>karier dan profil<br/>mahasiswa/<br/>alumni</b><br/>• <b>Data riwayat<br/>pengisian Tracer<br/>Study</b><br/><br/>Nice to have: Jika<br/>mahasiswa<br/>mendapatkan<br/>pekerjaan dari<br/><b>Portal Karier</b>, maka<br/>datanya sync<br/>dengan data di<br/>master dashboard"]

    D["Menu Kuesioner:<br/><br/>• Tracer Study untuk<br/>Alumni<br/>• Student Survey untuk<br/>Mahasiswa Aktif<br/>• Nice to have:<br/>  • Kuesioner/Evaluasi<br/>    Kerjasama dengan<br/>    Perusahaan<br/>  • Kuesioner feedback<br/>    aktivitas Event"]

    E["Menu Mahasiswa/Alumni:<br/><br/>1. Memantau Tren Karier<br/>   Mahasiswa/Alumni dan<br/>   Prestasi Mahasiswa<br/>2. Memantau Lamaran<br/>   Mahasiswa/Alumni"]

    F["Menu Aktivitas:<br/><br/>1. Memantau status<br/>   kerjasama dengan<br/>   Perusahaan<br/>2. Memantau dan<br/>   Membuat Event<br/>3. Memantau Calendar<br/>   Aktivitas CDC"]

    A --> B --> C
    C --> D
    C --> E
    C --> F
```
