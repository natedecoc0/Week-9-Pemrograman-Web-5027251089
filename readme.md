# 5027251089-Week-9-Pemrograman-Web

Aplikasi web untuk mencatat tontonan (series, drama, film) beserta progres episode, rating, dan review. Setiap judul dikelompokkan berdasarkan status: Watching, Completed, Plan to Watch, dan On Hold. Data disimpan di database PostgreSQL (Neon) menggunakan Prisma.

**Nama:** Nathania Tiara Wahyudi **NRP:** 5027251089 **Mata kuliah:** Pemrograman Web

## Fitur

- **Lihat semua series (GET):** daftar tampil per tab status dengan progress bar episode.
- **Tambah series (POST):** form berisi judul, genre, status, total episode, rating, dan review singkat.
- **Ubah series (PUT):** ubah status, tambah progres episode (+1 Ep), beri rating bintang, dan tulis review.
- **Hapus series (DELETE):** tombol hapus dengan dialog konfirmasi.
- **Penghitung:** total judul dan jumlah per status.
