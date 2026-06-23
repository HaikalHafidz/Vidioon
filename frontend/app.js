/* ===== VIDIOON APP.JS ===== */

const API_BASE = 'http://localhost:3000/api';

// ===== SAMPLE DATA (fallback jika backend offline) =====
const SAMPLE_MOVIES = [
  { id:1, title:'Dune: Part Two', year:2024, rating:8.5, genre:'Sci-Fi', poster:'https://image.tmdb.org/t/p/w500/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg', backdrop:'https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg', desc:'Paul Atreides menyatukan dirinya dengan kaum Fremen dalam perjalanan balas dendam.', type:'movie', duration:'2j 46m', embed:'https://www.2embed.cc/embed/693134' },
  { id:2, title:'Oppenheimer', year:2023, rating:8.9, genre:'Drama', poster:'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg', backdrop:'', desc:'Kisah nyata bapak bom atom Amerika Serikat.', type:'movie', duration:'3j 0m', embed:'https://www.2embed.cc/embed/872585' },
  { id:3, title:'Spider-Man: No Way Home', year:2021, rating:8.2, genre:'Aksi', poster:'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg', backdrop:'', desc:'Peter Parker meminta bantuan Doctor Strange untuk mengubah ingatan dunia.', type:'movie', duration:'2j 28m', embed:'https://www.2embed.cc/embed/634649' },
  { id:4, title:'The Batman', year:2022, rating:7.8, genre:'Aksi', poster:'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg', backdrop:'', desc:'Bruce Wayne menyelidiki korupsi kota Gotham selama tahun keduanya sebagai Batman.', type:'movie', duration:'2j 56m', embed:'https://www.2embed.cc/embed/414906' },
  { id:5, title:'Avatar: The Way of Water', year:2022, rating:7.6, genre:'Petualangan', poster:'https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9954M.jpg', backdrop:'https://image.tmdb.org/t/p/original/t6HIqrRAclMCA60NsSmeqe9954M.jpg', desc:'Jake Sully dan Neytiri berjuang melindungi keluarga mereka di Pandora.', type:'movie', duration:'3j 12m', embed:'https://www.2embed.cc/embed/76600' },
  { id:6, title:'Top Gun: Maverick', year:2022, rating:8.3, genre:'Aksi', poster:'https://image.tmdb.org/t/p/w500/62HCnUTHJl9UFbnCIFRfIKDjFkb.jpg', backdrop:'https://image.tmdb.org/t/p/original/62HCnUTHJl9UFbnCIFRfIKDjFkb.jpg', desc:'Pete Mitchell mendorong batas-batas sebagai pilot uji coba teratas.', type:'movie', duration:'2j 11m', embed:'https://www.2embed.cc/embed/361743' },
  { id:7, title:'Everything Everywhere All at Once', year:2022, rating:7.8, genre:'Sci-Fi', poster:'https://image.tmdb.org/t/p/w500/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg', backdrop:'https://image.tmdb.org/t/p/original/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg', desc:'Seorang ibu Chinese-Amerika menjelajahi multiverse.', type:'movie', duration:'2j 19m', embed:'https://www.2embed.cc/embed/545611' },
  { id:8, title:'Interstellar', year:2014, rating:8.7, genre:'Sci-Fi', poster:'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', backdrop:'https://image.tmdb.org/t/p/original/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', desc:'Sekelompok penjelajah melewati lubang cacing di angkasa.', type:'movie', duration:'2j 49m', embed:'https://www.2embed.cc/embed/157336' },
  { id:9, title:'John Wick: Chapter 4', year:2023, rating:8.1, genre:'Aksi', poster:'https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg', backdrop:'https://image.tmdb.org/t/p/original/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg', desc:'John Wick kembali menghadapi musuh-musuh lamanya dengan taruhannya lebih tinggi.', type:'movie', duration:'2j 49m', embed:'https://www.2embed.cc/embed/685083' },
  { id:10, title:'Guardians of the Galaxy Vol. 3', year:2023, rating:8.0, genre:'Aksi', poster:'https://image.tmdb.org/t/p/w500/r2J02Z2OpNTctfOSN1Ydgii51I3.jpg', backdrop:'https://image.tmdb.org/t/p/original/r2J02Z2OpNTctfOSN1Ydgii51I3.jpg', desc:'Tim Guardian menghadapi ancaman baru sambil mempertahankan persahabatan mereka.', type:'movie', duration:'2j 30m', embed:'https://www.2embed.cc/embed/616037' },
  { id:11, title:'Black Panther: Wakanda Forever', year:2022, rating:7.2, genre:'Aksi', poster:'https://image.tmdb.org/t/p/w500/sv1xJUazXeYqALzczSZ3O6nkH75.jpg', backdrop:'https://image.tmdb.org/t/p/original/sv1xJUazXeYqALzczSZ3O6nkH75.jpg', desc:'Wakanda menghadapi ancaman baru setelah kematian T’Challa.', type:'movie', duration:'2j 41m', embed:'https://www.2embed.cc/embed/558396' },
  { id:12, title:'The Flash', year:2023, rating:6.5, genre:'Aksi', poster:'https://image.tmdb.org/t/p/w500/wHa6KOJAoNTFLFtp7wguUJKSnju.jpg', backdrop:'https://image.tmdb.org/t/p/original/wHa6KOJAoNTFLFtp7wguUJKSnju.jpg', desc:'Barry Allen berusaha memperbaiki waktu yang rusak dan menghadapi musuh baru.', type:'movie', duration:'2j 0m', embed:'https://www.2embed.cc/embed/899112' },
];

const SAMPLE_SERIES = [
  { id:101, title:'Breaking Bad', year:2008, rating:9.5, genre:'Drama', poster:'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg', desc:'Seorang guru kimia berubah menjadi produsen narkoba.', type:'series', seasons:5, embed:'https://www.2embed.cc/embedtv/1396' },
  { id:102, title:'Squid Game', year:2021, rating:8.0, genre:'Thriller', poster:'https://image.tmdb.org/t/p/w500/dDlEmu3EZ0Pgg93K2SVNLCjCSvE.jpg', desc:'Ratusan peserta berjuang hidup-mati dalam permainan anak-anak mematikan.', type:'series', seasons:2, embed:'https://www.2embed.cc/embedtv/100088' },
  { id:103, title:'Stranger Things', year:2016, rating:8.7, genre:'Sci-Fi', poster:'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg', desc:'Sekelompok anak-anak menghadapi misteri supernatural di Hawkins.', type:'series', seasons:4, embed:'https://www.2embed.cc/embedtv/66732' },
  { id:104, title:'The Last of Us', year:2023, rating:8.7, genre:'Drama', poster:'https://image.tmdb.org/t/p/w500/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg', desc:'Joel menyelundupkan Ellie melintasi Amerika pasca-apokalipstik.', type:'series', seasons:2, embed:'https://www.2embed.cc/embedtv/100088' },
  { id:105, title:'The Witcher', year:2019, rating:8.2, genre:'Fantasi', poster:'https://image.tmdb.org/t/p/w500/zrPpUlehQaBf8YX2NrVrKK8IEpf.jpg', desc:'Geralt of Rivia berjuang menyelamatkan dunia dari kekacauan.', type:'series', seasons:3, embed:'https://www.2embed.cc/embedtv/71912' },
  { id:106, title:'House of the Dragon', year:2022, rating:8.5, genre:'Drama', poster:'https://image.tmdb.org/t/p/w500/z2yahl2uefxDCl0nogcRBstwruJ.jpg', desc:'Lanjutan rumah Targaryen yang penuh intrik dan perang.', type:'series', seasons:1, embed:'https://www.2embed.cc/embedtv/100168' },
];

const SAMPLE_ANIME = [
  { id:201, title:'Attack on Titan', year:2013, rating:9.0, genre:'Aksi', poster:'https://image.tmdb.org/t/p/w500/hTP1DtLGFamjfu8WqjnuQdP1n4i.jpg', desc:'Manusia berjuang melawan titan raksasa yang mengancam keberadaan mereka.', type:'anime', episodes:87, embed:'https://www.2embed.cc/embedtv/46261' },
  { id:202, title:'Demon Slayer', year:2019, rating:8.7, genre:'Aksi', poster:'https://image.tmdb.org/t/p/w500/xUfRZu2mi8jH6SzQEJGP6tjBuYj.jpg', desc:'Tanjiro menjadi pemburu iblis setelah keluarganya dibunuh.', type:'anime', episodes:44, embed:'https://www.2embed.cc/embedtv/85937' },
  { id:203, title:'Jujutsu Kaisen', year:2020, rating:8.7, genre:'Aksi', poster:'https://image.tmdb.org/t/p/w500/23JtQgsGbMrDbSczVc1ByoAKAR1.jpg', desc:'Yuji Itadori bergabung dengan organisasi penyihir rahasia.', type:'anime', episodes:47, embed:'https://www.2embed.cc/embedtv/95479' },
  { id:204, title:'One Piece', year:1999, rating:8.9, genre:'Petualangan', poster:'https://image.tmdb.org/t/p/w500/e3NBGiAifW9Xt8xD5tpARskjccO.jpg', desc:'Monkey D. Luffy berpetualang mencari harta karun terbesar.', type:'anime', episodes:1000, embed:'https://www.2embed.cc/embedtv/37854' },
  { id:205, title:'My Hero Academia', year:2016, rating:8.4, genre:'Aksi', poster:'https://image.tmdb.org/t/p/w500/wyBhDMs6FQ5SymAmM58U4bcF2pW.jpg', desc:'Deku berlatih menjadi pahlawan terbesar di dunia.', type:'anime', episodes:88, embed:'https://www.2embed.cc/embedtv/42656' },
  { id:206, title:'Spy x Family', year:2022, rating:8.2, genre:'Aksi', poster:'https://image.tmdb.org/t/p/w500/aQvJ5WPzZgYVDrxLX4R6cLJCEaZ.jpg', desc:'Seorang mata-mata membuat keluarga palsu untuk tugas rahasia.', type:'anime', episodes:50, embed:'https://www.2embed.cc/embedtv/111732' },
];

let allContent = [...SAMPLE_MOVIES, ...SAMPLE_SERIES, ...SAMPLE_ANIME];

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  renderRows();
  initHeroRotation();
  addToastContainer();
});

// ===== NAVBAR =====
function initNavbar() {
  window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (nav) nav.classList.toggle('solid', window.scrollY > 80);
  });
  updateUserStatus();
}

function updateUserStatus() {
  const token = localStorage.getItem('vidioon_token');
  const userName = localStorage.getItem('vidioon_user');
  const navActions = document.querySelector('.nav-actions');
  if (!navActions) return;

  if (token && userName) {
    const role = localStorage.getItem('vidioon_role');
    const userInitial = userName.charAt(0).toUpperCase();
    const html = `
      <button class="btn-search" onclick="toggleSearch()"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></button>
      <div class="user-status" onclick="toggleUserMenu()">
        <div class="user-avatar">${userInitial}</div>
        <span>${userName}</span>
        <div class="user-dropdown" id="userDropdown">
          <div class="user-menu-item">📊 Profile</div>
          <div class="user-menu-item">❤️ Wishlist</div>
          <div class="user-menu-item">⚙️ Pengaturan</div>
          ${role === 'admin' ? '<div class="user-menu-item" onclick="window.location=\'admin.html\'">👑 Admin Panel</div>' : ''}
          <div class="user-menu-item logout" onclick="doLogout()">🚪 Logout</div>
        </div>
      </div>
    `;
    navActions.innerHTML = html;
  } else {
    // User belum login
    const html = `
      <button class="btn-search" onclick="toggleSearch()"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></button>
      <a href="login.html" class="btn-nav">Masuk</a>
    `;
    navActions.innerHTML = html;
  }
}

function toggleUserMenu() {
  const dropdown = document.getElementById('userDropdown');
  if (dropdown) {
    dropdown.classList.toggle('open');
  }
}

function doLogout() {
  if (confirm('Yakin ingin logout?')) {
    localStorage.removeItem('vidioon_token');
    localStorage.removeItem('vidioon_user');
    localStorage.removeItem('vidioon_role');
    showToast('Logout berhasil', 'success');
    setTimeout(() => window.location = 'index.html', 1000);
  }
}

function toggleNav() {
  const links = document.querySelector('.nav-links');
  if (links) links.classList.toggle('open');
}

function toggleSearch() {
  const bar = document.getElementById('searchBar');
  if (bar) {
    bar.classList.toggle('open');
    if (bar.classList.contains('open')) {
      document.getElementById('searchInput')?.focus();
    }
  }
}

function searchContent(val) {
  const container = document.getElementById('searchResults');
  if (!container) return;
  if (!val.trim()) { container.classList.remove('open'); return; }
  const results = allContent.filter(m => m.title.toLowerCase().includes(val.toLowerCase())).slice(0,6);
  container.classList.add('open');
  container.innerHTML = results.map(m => `
    <div class="search-result-item" onclick="window.location='watch.html?id=${m.id}'">
      <img src="${m.poster}" alt="${m.title}" onerror="this.src='placeholder.jpg'"/>
      <div class="info">
        <h4>${m.title}</h4>
        <span>${m.year} · ${m.type === 'movie' ? '🎬 Film' : m.type === 'series' ? '📺 Serial' : '⚡ Anime'}</span>
      </div>
    </div>
  `).join('') || '<div style="padding:1rem;color:var(--text3);text-align:center">Tidak ditemukan</div>';
}

// ===== RENDER ROWS =====
function renderRows() {
  const rows = {
    trendingRow: allContent.sort(() => 0.5 - Math.random()).slice(0, 12),
    newMoviesRow: SAMPLE_MOVIES,
    seriesRow: SAMPLE_SERIES,
    animeRow: SAMPLE_ANIME,
  };
  Object.entries(rows).forEach(([id, items]) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = items.map(m => movieCard(m)).join('');
  });

  const top10 = document.getElementById('top10Grid');
  if (top10) {
    top10.innerHTML = [...SAMPLE_MOVIES].sort((a,b) => b.rating - a.rating).slice(0,10).map((m,i) => `
      <div class="top10-item" onclick="showModal(${m.id})">
        <div class="top10-num">${i+1}</div>
        <img src="${m.poster}" alt="${m.title}" onerror="this.src='placeholder.jpg'"/>
        <div class="top10-info">
          <h4>${m.title}</h4>
          <div class="meta">${m.year} · ${m.genre}</div>
          <div class="rating">⭐ ${m.rating}</div>
        </div>
      </div>
    `).join('');
  }
}

function movieCard(m) {
  const badge = m.type === 'anime' ? '⚡ ANIME' : m.type === 'series' ? '📺 SERIAL' : null;
  return `
    <div class="movie-card" onclick="showModal(${m.id})">
      <img src="${m.poster}" alt="${m.title}" loading="lazy" onerror="this.style.background='#1a1a25'"/>
      ${badge ? `<div class="card-badge">${badge}</div>` : ''}
      <div class="card-hover">
        <div class="play-icon">▶</div>
        <h4>${m.title}</h4>
        <div class="card-meta">
          <span class="card-rating">⭐ ${m.rating}</span>
          <span>${m.year}</span>
        </div>
      </div>
      <div class="card-title">${m.title}</div>
      <div class="card-year">${m.year}</div>
    </div>
  `;
}

// ===== MODAL =====
function showModal(id) {
  const m = allContent.find(x => x.id === id);
  if (!m) return;

  document.getElementById('modalThumb').src = m.backdrop || m.poster;
  document.getElementById('modalTitle').textContent = m.title;
  document.getElementById('modalDesc').textContent = m.desc;
  document.getElementById('modalPlay').href = `watch.html?id=${m.id}`;
  document.getElementById('modalWatchBtn').href = `watch.html?id=${m.id}`;
  document.getElementById('modalMeta').innerHTML = `
    <span style="color:var(--gold);font-weight:700">⭐ ${m.rating} IMDb</span>
    <span>${m.year}</span>
    <span>${m.duration || (m.seasons ? m.seasons + ' Season' : m.episodes + ' Eps')}</span>
    <span class="tag">${m.genre}</span>
  `;

  document.getElementById('modal').classList.add('open');
  document.getElementById('modalBackdrop').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modal').classList.remove('open');
  document.getElementById('modalBackdrop').classList.remove('open');
  document.body.style.overflow = '';
}

function addWishlist() {
  showToast('Ditambahkan ke Daftar Saya ✓', 'success');
}

// ===== HERO ROTATION =====
function initHeroRotation() {
  // Dots click
  document.querySelectorAll('.dot').forEach((dot, i) => {
    dot.addEventListener('click', () => {
      document.querySelectorAll('.dot').forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
    });
  });
}

// ===== TOAST =====
function addToastContainer() {
  if (!document.querySelector('.toast-container')) {
    const el = document.createElement('div');
    el.className = 'toast-container';
    el.id = 'toastContainer';
    document.body.appendChild(el);
  }
}

function showToast(msg, type='success') {
  const c = document.getElementById('toastContainer');
  if (!c) return;
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `${type === 'success' ? '✓' : '⚠'} ${msg}`;
  c.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

// ===== API HELPERS =====
async function apiFetch(path, options={}) {
  try {
    const res = await fetch(API_BASE + path, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options
    });
    return await res.json();
  } catch(e) {
    console.warn('API offline, using sample data');
    return null;
  }
}

// ===== WATCH PAGE =====
async function initWatchPage() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'));
  let movie = allContent.find(m => m.id === id);

  try {
    const apiMovie = await apiFetch(`/content/${id}`);
    if (apiMovie) {
      movie = apiMovie;
      const existing = allContent.find(m => m.id === movie.id);
      if (existing) Object.assign(existing, movie);
      else allContent.push(movie);
    }
  } catch (e) {
    console.warn('Gagal memuat konten dari API:', e);
  }

  if (!movie) {
    console.error('Film tidak ditemukan');
    return;
  }

  document.title = `${movie.title} – Vidioon`;
  document.getElementById('watchTitle').textContent = movie.title;
  document.getElementById('watchMeta').innerHTML = `
    <span style="color:var(--gold)">⭐ ${movie.rating}</span>
    <span>${movie.year}</span>
    <span>${movie.genre}</span>
    <span>${movie.duration || ''}</span>
  `;
  document.getElementById('watchDesc').textContent = movie.desc;
  
  const mainPlayer = document.getElementById('mainPlayer');
  if (mainPlayer && !mainPlayer.src) {
    mainPlayer.src = movie.embed || `https://www.2embed.cc/embed/${id}`;
  }

  const related = allContent.filter(m => m.id !== id && m.genre === movie.genre).slice(0,12);
  const relEl = document.getElementById('relatedRow');
  if (relEl) {
    relEl.innerHTML = related.length > 0 ? related.map(m => movieCard(m)).join('') : '<div style="padding:2rem;color:var(--text3);text-align:center">Belum ada rekomendasi film serupa.</div>';
  }
}

// ===== CONTENT PAGE =====
function initContentPage(type) {
  let items = type === 'movie' ? SAMPLE_MOVIES : type === 'series' ? SAMPLE_SERIES : SAMPLE_ANIME;
  const grid = document.getElementById('contentGrid');
  if (grid) {
    grid.innerHTML = items.map(m => `
      <div class="movie-card" onclick="window.location='watch.html?id=${m.id}'" style="width:100%">
        <img src="${m.poster}" alt="${m.title}" loading="lazy"/>
        <div class="card-hover">
          <div class="play-icon">▶</div>
          <h4>${m.title}</h4>
          <div class="card-meta"><span class="card-rating">⭐ ${m.rating}</span><span>${m.year}</span></div>
        </div>
        <div class="card-title">${m.title}</div>
        <div class="card-year">${m.year} · ${m.genre}</div>
      </div>
    `).join('');
  }
}

function filterByGenre(genre) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
  const all = [...SAMPLE_MOVIES, ...SAMPLE_SERIES, ...SAMPLE_ANIME];
  const items = genre === 'Semua' ? all : all.filter(m => m.genre === genre);
  const grid = document.getElementById('contentGrid');
  if (grid) grid.innerHTML = items.map(m => `
    <div class="movie-card" onclick="window.location='watch.html?id=${m.id}'" style="width:100%">
      <img src="${m.poster}" alt="${m.title}" loading="lazy"/>
      <div class="card-hover">
        <div class="play-icon">▶</div>
        <h4>${m.title}</h4>
        <div class="card-meta"><span class="card-rating">⭐ ${m.rating}</span><span>${m.year}</span></div>
      </div>
      <div class="card-title">${m.title}</div>
      <div class="card-year">${m.year}</div>
    </div>
  `).join('');
}