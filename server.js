const express = require('express');
const path = require('path');
const prisma = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const STATUSES = ['watching', 'completed', 'plan', 'hold'];
let visitors = 4047;

const toInt = (v, min, max, fallback) => {
  const n = parseInt(v, 10);
  return Number.isNaN(n) ? fallback : Math.min(max, Math.max(min, n));
};

// GET semua series
app.get('/api/series', async (req, res) => {
  res.json(await prisma.series.findMany({ orderBy: { id: 'asc' } }));
});

// POST tambah series
app.post('/api/series', async (req, res) => {
  const { title, genre, totalEpisodes, status, rating, review } = req.body;
  if (!title || !String(title).trim()) {
    return res.status(400).json({ message: 'Judul wajib diisi' });
  }
  const total = toInt(totalEpisodes, 1, 9999, 0);
  if (!total) return res.status(400).json({ message: 'Total episode minimal 1' });

  const st = STATUSES.includes(status) ? status : 'plan';
  const item = await prisma.series.create({
    data: {
      title: String(title).trim(),
      genre: String(genre || 'Lainnya').trim(),
      totalEpisodes: total,
      watched: st === 'completed' ? total : 0,
      status: st,
      rating: toInt(rating, 0, 5, 0),
      review: String(review || '').trim(),
    },
  });
  res.status(201).json(item);
});

// PUT update (progress, status, rating, review)
app.put('/api/series/:id', async (req, res) => {
  const id = Number(req.params.id);
  const old = Number.isInteger(id) ? await prisma.series.findUnique({ where: { id } }) : null;
  if (!old) return res.status(404).json({ message: 'Series tidak ditemukan' });

  const s = { ...old };
  const b = req.body;
  if (b.title !== undefined && String(b.title).trim()) s.title = String(b.title).trim();
  if (b.genre !== undefined) s.genre = String(b.genre).trim();
  if (b.totalEpisodes !== undefined) s.totalEpisodes = toInt(b.totalEpisodes, 1, 9999, s.totalEpisodes);
  if (b.watched !== undefined) s.watched = toInt(b.watched, 0, s.totalEpisodes, s.watched);
  if (STATUSES.includes(b.status)) s.status = b.status;
  if (b.rating !== undefined) s.rating = toInt(b.rating, 0, 5, s.rating);
  if (b.review !== undefined) s.review = String(b.review).trim();

  s.watched = Math.min(s.watched, s.totalEpisodes);
  if (b.watched !== undefined && s.watched >= s.totalEpisodes) s.status = 'completed';
  if (s.status === 'completed') s.watched = s.totalEpisodes;
  else if (s.watched >= s.totalEpisodes) s.watched = s.status === 'watching' ? s.totalEpisodes - 1 : 0;

  const { id: _id, ...data } = s;
  res.json(await prisma.series.update({ where: { id }, data }));
});

// DELETE hapus series
app.delete('/api/series/:id', async (req, res) => {
  const id = Number(req.params.id);
  const old = Number.isInteger(id) ? await prisma.series.findUnique({ where: { id } }) : null;
  if (!old) return res.status(404).json({ message: 'Series tidak ditemukan' });
  await prisma.series.delete({ where: { id } });
  res.json({ message: 'Series dihapus', data: old });
});

app.get('/api/visits', (req, res) => res.json({ count: ++visitors }));

// Error handler (Express 5 otomatis meneruskan error dari async route)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Terjadi kesalahan pada server' });
});

app.listen(PORT, () => console.log(`SeriesLog jalan di http://localhost:${PORT}`));