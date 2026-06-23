require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'vidioon_secret_key_2024';
if (!process.env.JWT_SECRET) {
  console.warn('⚠️ WARNING: JWT_SECRET belum diset. Gunakan backend/.env dengan nilai rahasia yang kuat.');
}
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5500';
const allowedOrigins = [FRONTEND_URL, 'http://localhost:3000', 'http://127.0.0.1:3000'].filter(Boolean);

// ===== MIDDLEWARE =====
app.use(helmet());
app.disable('x-powered-by');
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json({ limit: '15kb' }));
app.use(express.urlencoded({ extended: true, limit: '15kb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ===== DATABASE SEDERHANA (JSON file) =====
// Di produksi, ganti dengan MongoDB atau MySQL
const DB_FILE = path.join(__dirname, 'db.json');

function readDB() {
  try {
    if (!fs.existsSync(DB_FILE)) return initDB();
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch(e) { return initDB(); }
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

function initDB() {
  const db = {
    users: [
      { id: 1, name: 'Admin', email: 'admin@vidioon.com', password: bcrypt.hashSync('admin123', 10), role: 'admin', createdAt: new Date().toISOString() }
    ],
    content: [
      { id: 1, title: 'Dune: Part Two', originalTitle: 'Dune: Part Two', year: 2024, rating: 8.5, genre: 'Sci-Fi', desc: 'Paul Atreides menyatukan dirinya dengan Chani dan kaum Fremen dalam perjalanan balas dendam.', type: 'movie', duration: '2j 46m', poster: 'https://image.tmdb.org/t/p/w500/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg', backdrop: 'https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg', embed: 'https://www.2embed.cc/embed/693134', embed2: 'https://vidsrc.to/embed/movie/693134', embed3: '', tags: ['sci-fi', 'petualangan'], lang: 'Inggris', views: 0, status: 'active', createdAt: new Date().toISOString() },
      { id: 2, title: 'Oppenheimer', originalTitle: 'Oppenheimer', year: 2023, rating: 8.9, genre: 'Drama', desc: 'Kisah nyata J. Robert Oppenheimer, bapak bom atom Amerika Serikat.', type: 'movie', duration: '3j 0m', poster: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg', backdrop: '', embed: 'https://www.2embed.cc/embed/872585', embed2: '', embed3: '', tags: ['drama', 'sejarah'], lang: 'Inggris', views: 0, status: 'active', createdAt: new Date().toISOString() },
      { id: 101, title: 'Breaking Bad', year: 2008, rating: 9.5, genre: 'Drama', desc: 'Seorang guru kimia berubah menjadi produsen narkoba setelah didiagnosa kanker.', type: 'series', seasons: 5, episodes: 62, poster: 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg', backdrop: '', embed: 'https://www.2embed.cc/embedtv/1396', embed2: '', embed3: '', tags: ['drama', 'crime'], lang: 'Inggris', views: 0, status: 'active', createdAt: new Date().toISOString() },
      { id: 201, title: 'Attack on Titan', year: 2013, rating: 9.0, genre: 'Aksi', desc: 'Manusia berjuang melawan titan raksasa yang mengancam keberadaan mereka.', type: 'anime', episodes: 87, poster: 'https://image.tmdb.org/t/p/w500/hTP1DtLGFamjfu8WqjnuQdP1n4i.jpg', backdrop: '', embed: 'https://www.2embed.cc/embedtv/46261', embed2: '', embed3: '', tags: ['aksi', 'dark fantasy'], lang: 'Jepang', views: 0, status: 'active', createdAt: new Date().toISOString() },
    ],
    wishlist: [],
    views_log: []
  };
  writeDB(db);
  return db;
}

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 25,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Terlalu banyak permintaan, coba lagi nanti.' }
});

const registerValidation = [
  body('name').trim().isLength({ min: 3 }).withMessage('Nama minimal 3 karakter'),
  body('email').isEmail().normalizeEmail().withMessage('Email tidak valid'),
  body('password').isLength({ min: 8 }).withMessage('Password minimal 8 karakter')
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Email tidak valid'),
  body('password').isLength({ min: 8 }).withMessage('Password minimal 8 karakter')
];

const contentValidation = [
  body('title').trim().isLength({ min: 3 }).withMessage('Judul wajib diisi'),
  body('year').isInt({ min: 1800, max: new Date().getFullYear() + 1 }).withMessage('Tahun tidak valid'),
  body('genre').trim().notEmpty().withMessage('Genre wajib diisi'),
  body('desc').trim().isLength({ min: 10 }).withMessage('Deskripsi minimal 10 karakter'),
  body('type').trim().isIn(['movie','series','anime']).withMessage('Tipe konten salah'),
  body('poster').trim().isURL().withMessage('Poster harus URL valid'),
  body('embed').optional({ checkFalsy: true }).isURL().withMessage('Embed harus URL valid'),
  body('embed2').optional({ checkFalsy: true }).isURL().withMessage('Embed2 harus URL valid'),
  body('embed3').optional({ checkFalsy: true }).isURL().withMessage('Embed3 harus URL valid')
];

app.use('/api/auth', authLimiter);

// ===== AUTH MIDDLEWARE =====
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Token tidak ditemukan' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch(e) {
    res.status(401).json({ message: 'Token tidak valid' });
  }
}

function adminMiddleware(req, res, next) {
  authMiddleware(req, res, () => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Akses ditolak' });
    next();
  });
}

// ===== ROUTES =====

// Health Check
app.get('/', (req, res) => {
  res.json({ status: 'OK', message: 'Vidioon API berjalan!', version: '1.0.0' });
});

// ==================
// AUTH ROUTES
// ==================
app.post('/api/auth/register', registerValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, password } = req.body;
  const db = readDB();
  if (db.users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    return res.status(400).json({ message: 'Email sudah terdaftar' });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = {
    id: Date.now(),
    name, email,
    password: hashed,
    role: 'user',
    createdAt: new Date().toISOString()
  };
  db.users.push(user);
  writeDB(db);

  res.status(201).json({ message: 'Akun berhasil dibuat! Silakan login.' });
});

app.post('/api/auth/login', loginValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;
  const db = readDB();
  const user = db.users.find(u => u.email === email);
  if (!user || !await bcrypt.compare(password, user.password)) {
    return res.status(401).json({ message: 'Email atau password salah' });
  }

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  const db = readDB();
  const user = db.users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });
  const { password, ...safeUser } = user;
  res.json(safeUser);
});

// ==================
// CONTENT ROUTES
// ==================
app.get('/api/content', (req, res) => {
  const db = readDB();
  let { type, genre, search, sort, limit = 50, page = 1 } = req.query;
  let content = db.content.filter(c => c.status !== 'deleted');

  if (type) content = content.filter(c => c.type === type);
  if (genre) content = content.filter(c => c.genre === genre);
  if (search) content = content.filter(c => c.title.toLowerCase().includes(search.toLowerCase()));

  if (sort === 'rating') content.sort((a,b) => b.rating - a.rating);
  else if (sort === 'year') content.sort((a,b) => b.year - a.year);
  else if (sort === 'views') content.sort((a,b) => (b.views||0) - (a.views||0));
  else content.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));

  const total = content.length;
  const start = (parseInt(page) - 1) * parseInt(limit);
  const data = content.slice(start, start + parseInt(limit));

  res.json({ data, total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total/limit) });
});

app.get('/api/content/trending', (req, res) => {
  const db = readDB();
  const trending = db.content.filter(c => c.status !== 'deleted').sort((a,b) => (b.views||0) - (a.views||0)).slice(0, 20);
  res.json(trending);
});

app.get('/api/content/top10', (req, res) => {
  const db = readDB();
  const top10 = db.content.filter(c => c.status !== 'deleted').sort((a,b) => b.rating - a.rating).slice(0, 10);
  res.json(top10);
});

app.get('/api/content/:id', (req, res) => {
  const db = readDB();
  const content = db.content.find(c => c.id == req.params.id && c.status !== 'deleted');
  if (!content) return res.status(404).json({ message: 'Konten tidak ditemukan' });

  // Tambah view count
  content.views = (content.views || 0) + 1;
  writeDB(db);

  res.json(content);
});

app.post('/api/content', adminMiddleware, contentValidation, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const db = readDB();
  const newContent = {
    id: Date.now(),
    status: 'active',
    views: 0,
    createdAt: new Date().toISOString(),
    ...req.body
  };
  db.content.push(newContent);
  writeDB(db);

  res.status(201).json({ message: 'Konten berhasil ditambahkan!', content: newContent });
});

app.put('/api/content/:id', adminMiddleware, (req, res) => {
  const db = readDB();
  const idx = db.content.findIndex(c => c.id == req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Konten tidak ditemukan' });

  db.content[idx] = { ...db.content[idx], ...req.body, updatedAt: new Date().toISOString() };
  writeDB(db);
  res.json({ message: 'Konten berhasil diperbarui!', content: db.content[idx] });
});

app.delete('/api/content/:id', adminMiddleware, (req, res) => {
  const db = readDB();
  const idx = db.content.findIndex(c => c.id == req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Konten tidak ditemukan' });

  db.content[idx].status = 'deleted';
  writeDB(db);
  res.json({ message: 'Konten berhasil dihapus' });
});

// ==================
// SEARCH
// ==================
app.get('/api/search', (req, res) => {
  const { q } = req.query;
  if (!q) return res.json([]);
  const db = readDB();
  const results = db.content.filter(c =>
    c.status !== 'deleted' &&
    (c.title.toLowerCase().includes(q.toLowerCase()) ||
     c.genre.toLowerCase().includes(q.toLowerCase()) ||
     (c.tags || []).some(t => t.includes(q.toLowerCase())))
  ).slice(0, 10);
  res.json(results);
});

// ==================
// WISHLIST
// ==================
app.get('/api/wishlist', authMiddleware, (req, res) => {
  const db = readDB();
  const wishlist = db.wishlist.filter(w => w.userId === req.user.id);
  const contentIds = wishlist.map(w => w.contentId);
  const items = db.content.filter(c => contentIds.includes(c.id));
  res.json(items);
});

app.post('/api/wishlist/:contentId', authMiddleware, (req, res) => {
  const db = readDB();
  const exists = db.wishlist.find(w => w.userId === req.user.id && w.contentId == req.params.contentId);
  if (exists) return res.status(400).json({ message: 'Sudah ada di daftar' });
  db.wishlist.push({ userId: req.user.id, contentId: parseInt(req.params.contentId), addedAt: new Date().toISOString() });
  writeDB(db);
  res.json({ message: 'Ditambahkan ke daftar!' });
});

app.delete('/api/wishlist/:contentId', authMiddleware, (req, res) => {
  const db = readDB();
  db.wishlist = db.wishlist.filter(w => !(w.userId === req.user.id && w.contentId == req.params.contentId));
  writeDB(db);
  res.json({ message: 'Dihapus dari daftar' });
});

// ==================
// ADMIN STATS
// ==================
app.get('/api/admin/stats', adminMiddleware, (req, res) => {
  const db = readDB();
  const content = db.content.filter(c => c.status !== 'deleted');
  res.json({
    totalContent: content.length,
    movies: content.filter(c => c.type==='movie').length,
    series: content.filter(c => c.type==='series').length,
    anime: content.filter(c => c.type==='anime').length,
    totalUsers: db.users.length,
    totalViews: content.reduce((sum, c) => sum + (c.views || 0), 0),
  });
});

app.get('/api/admin/users', adminMiddleware, (req, res) => {
  const db = readDB();
  const users = db.users.map(({ password, ...u }) => u);
  res.json(users);
});

// ==================
// UPLOAD GAMBAR
// ==================
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, 'uploads')),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Tipe file tidak didukung. Hanya JPG, PNG, WebP.'), false);
    }
    cb(null, true);
  }
});

app.post('/api/upload', adminMiddleware, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Tidak ada file yang diupload' });
  const url = `http://localhost:${PORT}/uploads/${req.file.filename}`;
  res.json({ url, filename: req.file.filename });
});

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: err.message });
  }
  if (err) {
    return res.status(400).json({ message: err.message || 'Terjadi kesalahan pada server' });
  }
  next();
});

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════╗
║       VIDIOON SERVER AKTIF!        ║
╠════════════════════════════════════╣
║  URL: http://localhost:${PORT}        ║
║  API: http://localhost:${PORT}/api    ║
╠════════════════════════════════════╣
║  Admin: admin@vidioon.com          ║
║  Pass:  admin123                   ║
╚════════════════════════════════════╝
  `);
  readDB(); // Inisialisasi database
});

module.exports = app;
