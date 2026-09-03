# 📝 Laporan Penjualan Kedai

Aplikasi web sederhana yang sangat cepat, ringan, dan **mobile-friendly** untuk mencatat transaksi penjualan dan pengeluaran harian kedai. Didesain secara khusus agar sangat praktis digunakan langsung dari *smartphone* tanpa perlu ribet mengetik secara manual, dengan hasil akhir berupa teks laporan yang rapi dan siap dikirim via WhatsApp.

## ✨ Fitur Utama

- **Antarmuka Minimalis & Mobile First**: Mengusung konsep *less is more* dengan desain bersih layaknya aplikasi *native*. Tombol-tombol berukuran besar yang sangat ramah sentuhan layar (touch-friendly).
- **Counter Pintar (+ / -)**: Mencatat penjualan semudah menekan tombol `+`. Tidak perlu lagi repot mengetik angka secara manual dari keyboard handphone.
- **Smart Expense Parser**: Dapat mendeteksi dan menjumlahkan nominal pengeluaran secara cerdas. Anda dapat menggunakan format angka standar (`20000`) atau singkatan modern (`20k`), dan aplikasi akan otomatis menghitung totalnya secara akurat.
- **Auto-Merge Data**: Tidak perlu khawatir jika tidak sengaja memasukkan menu yang sama dua kali. Aplikasi akan secara otomatis mengelompokkan dan menjumlahkan item dengan nama yang sama (misal: "Es Teh = 3" dan "Es Teh = 2" otomatis menjadi "Es Teh = 5").
- **Auto-Save (Local Storage)**: Semua data yang Anda ketik atau tambahkan otomatis tersimpan di dalam *cache/storage* browser. Jika tab tidak sengaja tertutup atau ter-refresh, data Anda 100% aman dan tidak hilang.
- **Support Offline & PWA**: Aplikasi ini adalah *Progressive Web App (PWA)* yang dilengkapi dengan *Service Worker*. Anda dapat menginstalnya sebagai aplikasi mandiri di *Homescreen* HP Anda dan membukanya meskipun **tanpa koneksi internet (offline)**.
- **Auto-Reset Harian**: Sangat cocok untuk rutinitas harian! Saat Anda membuka aplikasi pada **hari yang baru** (pergantian tanggal), daftar menu yang sudah Anda daftarkan akan dipertahankan, namun angka/counternya akan otomatis dikembalikan ke `0`.
- **Integrasi WhatsApp**: Cukup dengan satu klik, teks hasil laporan harian bisa disalin atau langsung diteruskan (*forward*) menuju aplikasi WhatsApp Anda.

## 🚀 Cara Menjalankan

Karena aplikasi ini murni dibangun menggunakan **Vanilla HTML, CSS, dan JavaScript**, tidak diperlukan instalasi (NPM/Node) atau konfigurasi *build tool* apa pun.

1. *Clone* repository ini ke perangkat Anda:
   ```bash
   git clone https://github.com/inugroho399-alt/laporan-penjualan-kedai.git
   ```
2. Cukup buka (Double-Click) file `index.html` menggunakan *browser* pilihan Anda (Chrome, Safari, Firefox), baik melalui Laptop/PC ataupun *Smartphone*.
3. Aplikasi siap langsung digunakan!

### Panduan Pemakaian Harian:
1. **Tambah Penjualan**: Tekan tombol `+` pada menu setiap kali ada menu yang laku. Jika ada varian menu baru, tekan tulisan `+ Tambah` pada bagian header Penjualan.
2. **Catat Pengeluaran**: Tekan `+ Tambah` pada bagian header Pengeluaran, isi nama item (misal: "Es Batu") dan nominalnya (misal: "10.000" atau "10k").
3. **Kirim Laporan**: Scroll ke paling bawah lalu klik tombol **Buat Laporan** berwarna hitam. Akan muncul area *preview* laporan teks, selanjutnya cukup klik **Kirim WhatsApp**.

## 🛠️ Stack Teknologi

Proyek ini tidak memiliki ketergantungan (*dependencies*) terhadap pihak ketiga, demi menjamin performa waktu muat (*load time*) tercepat:
- **HTML5**: Menyediakan struktur semantik yang baik dan input berbasis angka bawaan.
- **CSS3**: Sistem desain modern dengan *CSS Variables*, Flexbox, dan media queries yang sangat responsif (*No Framework/No Tailwind*).
- **Vanilla JavaScript**: Menangani *DOM Manipulation*, interaksi *LocalStorage*, algoritma *Regex Parsing* untuk perhitungan nilai tukar, dan fungsionalitas papan klip (*Clipboard API*).

---
*Dibuat untuk mempermudah operasional dan sistem pelaporan kedai harian.*
