import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import cors from 'cors';
import express from 'express';
import multer from 'multer';
import { createAuthMiddleware, hashPassword, signToken, verifyPassword } from './auth.js';
import { initDatabase, UPLOADS_DIR } from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3001;

const db = initDatabase();
const { optionalAuth, requireAuth, requireAdmin } = createAuthMiddleware(db);

const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' }));

// File upload configuration for Windows builds (.exe, .zip, .msi, .7z, .rar)
const ALLOWED_EXTENSIONS = new Set(['.exe', '.zip', '.msi', '.7z', '.rar']);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.zip';
    const safeName = `build-${Date.now()}-${crypto.randomBytes(4).toString('hex')}${ext}`;
    cb(null, safeName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 * 1024 }, // 2 GB max for indie PC builds
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return cb(new Error('Formato inválido! Envie arquivos .exe, .zip, .msi, .7z ou .rar.'));
    }
    cb(null, true);
  },
});

function computeFileSha256(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath);
    stream.on('data', (chunk) => hash.update(chunk));
    stream.on('end', () => resolve(hash.digest('hex')));
    stream.on('error', reject);
  });
}

// ---------- HEALTH & STATS ----------
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, game: 'BRMatched', timestamp: new Date().toISOString() });
});

app.get('/api/stats', (_req, res) => {
  const totalDownloads =
    db.prepare('SELECT COALESCE(SUM(download_count), 0) as total FROM releases').get().total || 0;
  const totalMembers = db.prepare('SELECT COUNT(*) as total FROM users').get().total || 0;
  const totalReleases = db.prepare('SELECT COUNT(*) as total FROM releases').get().total || 0;
  const openFeedback =
    db.prepare("SELECT COUNT(*) as total FROM feedback WHERE status != 'resolvido'").get().total || 0;
  const latestRelease =
    db.prepare('SELECT * FROM releases WHERE is_latest = 1 ORDER BY id DESC LIMIT 1').get() ||
    db.prepare('SELECT * FROM releases ORDER BY id DESC LIMIT 1').get() ||
    null;

  res.json({
    totalDownloads,
    totalMembers,
    totalReleases,
    openFeedback,
    latestRelease,
  });
});

// ---------- AUTH ----------
app.post('/api/auth/register', (req, res) => {
  const { username, email, password, favorite_deck } = req.body || {};

  const cleanUser = String(username || '').trim();
  const cleanEmail = String(email || '').trim().toLowerCase();
  const cleanPass = String(password || '');

  if (cleanUser.length < 3 || cleanUser.length > 24) {
    return res.status(400).json({ error: 'O apelido precisa ter entre 3 e 24 caracteres.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return res.status(400).json({ error: 'Informe um e-mail válido.' });
  }
  if (cleanPass.length < 6) {
    return res.status(400).json({ error: 'A senha precisa ter pelo menos 6 caracteres.' });
  }

  const existing = db
    .prepare('SELECT id FROM users WHERE LOWER(email) = ? OR LOWER(username) = ?')
    .get(cleanEmail, cleanUser.toLowerCase());
  if (existing) {
    return res.status(409).json({ error: 'Este e-mail ou apelido já está em uso no BRMatched!' });
  }

  const palette = ['#FFE600', '#00E576', '#00D4FF', '#FF2A5F', '#FF7A00', '#A855F7'];
  const avatarColor = palette[Math.floor(Math.random() * palette.length)];
  const deck = String(favorite_deck || 'Combo Trovão').slice(0, 40);

  const result = db
    .prepare(
      `INSERT INTO users (username, email, password_hash, role, avatar_color, badge, favorite_deck)
       VALUES (?, ?, ?, 'player', ?, 'Membro BRMatched', ?)`
    )
    .run(cleanUser, cleanEmail, hashPassword(cleanPass), avatarColor, deck);

  const user = db
    .prepare(
      'SELECT id, username, email, role, avatar_color, badge, favorite_deck, created_at FROM users WHERE id = ?'
    )
    .get(result.lastInsertRowid);

  const token = signToken(user);
  res.status(201).json({ user, token });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  const identifier = String(email || '').trim().toLowerCase();
  const cleanPass = String(password || '');

  if (!identifier || !cleanPass) {
    return res.status(400).json({ error: 'Preencha seu e-mail (ou apelido) e senha!' });
  }

  const userRow = db
    .prepare('SELECT * FROM users WHERE LOWER(email) = ? OR LOWER(username) = ?')
    .get(identifier, identifier);

  if (!userRow || !verifyPassword(cleanPass, userRow.password_hash)) {
    return res.status(401).json({ error: 'Credenciais inválidas! Verifique e-mail e senha.' });
  }

  const user = {
    id: userRow.id,
    username: userRow.username,
    email: userRow.email,
    role: userRow.role,
    avatar_color: userRow.avatar_color,
    badge: userRow.badge,
    favorite_deck: userRow.favorite_deck,
    created_at: userRow.created_at,
  };

  const token = signToken(user);
  res.json({ user, token });
});

app.get('/api/auth/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

app.patch('/api/auth/profile', requireAuth, (req, res) => {
  const { avatar_color, favorite_deck } = req.body || {};
  const allowedColors = new Set([
    '#F5C542',
    '#10D876',
    '#24D1FF',
    '#E62429',
    '#FF7A18',
    '#8B42FF',
    '#FFE600',
    '#00E576',
    '#00D4FF',
    '#FF2A5F',
    '#FF7A00',
    '#A855F7',
  ]);
  const nextColor = allowedColors.has(avatar_color) ? avatar_color : req.user.avatar_color;
  const nextDeck = String(favorite_deck || req.user.favorite_deck).trim().slice(0, 40);

  db.prepare('UPDATE users SET avatar_color = ?, favorite_deck = ? WHERE id = ?').run(
    nextColor,
    nextDeck,
    req.user.id
  );

  const updated = db
    .prepare(
      'SELECT id, username, email, role, avatar_color, badge, favorite_deck, created_at FROM users WHERE id = ?'
    )
    .get(req.user.id);

  res.json({ user: updated });
});

// ---------- RELEASES & WINDOWS DOWNLOADS ----------
app.get('/api/releases', (_req, res) => {
  const releases = db
    .prepare('SELECT * FROM releases ORDER BY is_latest DESC, id DESC')
    .all();
  res.json({ releases });
});

app.get('/api/releases/:id/download', (req, res) => {
  const id = Number(req.params.id);
  const release = db.prepare('SELECT * FROM releases WHERE id = ?').get(id);
  if (!release) {
    return res.status(404).json({ error: 'Versão não encontrada.' });
  }

  if (release.external_url && /^https?:\/\//i.test(release.external_url)) {
    db.prepare('UPDATE releases SET download_count = download_count + 1 WHERE id = ?').run(id);
    return res.redirect(302, release.external_url);
  }

  const fullPath = path.join(UPLOADS_DIR, release.stored_name);
  if (!release.stored_name || !fs.existsSync(fullPath)) {
    return res.status(404).json({ error: 'Arquivo do instalador não encontrado no servidor.' });
  }

  db.prepare('UPDATE releases SET download_count = download_count + 1 WHERE id = ?').run(id);
  res.download(fullPath, release.file_name);
});

app.post('/api/releases', requireAdmin, (req, res) => {
  upload.single('file')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message || 'Erro ao fazer upload do arquivo.' });
    }

    const {
      version,
      title,
      channel,
      platform,
      changelog,
      is_latest,
      external_url,
      file_name,
      file_size_mb,
    } = req.body || {};

    const cleanExternalUrl = String(external_url || '').trim();
    if (!req.file && !cleanExternalUrl) {
      return res
        .status(400)
        .json({ error: 'Envie um arquivo (.exe / .zip) ou informe um link externo de download.' });
    }
    if (cleanExternalUrl && !/^https?:\/\//i.test(cleanExternalUrl)) {
      if (req.file) fs.unlink(req.file.path, () => {});
      return res
        .status(400)
        .json({ error: 'O link externo deve começar com https:// ou http://.' });
    }

    const cleanVersion = String(version || '').trim();
    const cleanTitle = String(title || '').trim();
    const cleanChannel = ['stable', 'beta', 'alpha'].includes(channel) ? channel : 'beta';
    const cleanPlatform = String(platform || 'Windows 10/11 (x64)').trim();
    const cleanChangelog = String(changelog || '').trim();
    const setLatest = is_latest === 'true' || is_latest === '1' || is_latest === true ? 1 : 0;

    if (!cleanVersion || !cleanTitle || !cleanChangelog) {
      if (req.file) fs.unlink(req.file.path, () => {});
      return res
        .status(400)
        .json({ error: 'Preencha versão, título e notas da atualização (changelog).' });
    }

    try {
      const sha256 = req.file ? await computeFileSha256(req.file.path) : '';
      const resolvedFileName = req.file
        ? req.file.originalname
        : String(file_name || `BRMatched-${cleanVersion}-Setup-Windows-x64.exe`).trim();
      const resolvedStoredName = req.file ? req.file.filename : '';
      const parsedMb = Number(String(file_size_mb || '0').replace(',', '.'));
      const resolvedSize = req.file
        ? req.file.size
        : Number.isFinite(parsedMb) && parsedMb > 0
          ? Math.round(parsedMb * 1024 * 1024)
          : 0;

      if (setLatest) {
        db.prepare('UPDATE releases SET is_latest = 0').run();
      }

      const result = db
        .prepare(
          `INSERT INTO releases (
            version, title, channel, platform, file_name, stored_name,
            file_size, sha256, changelog, download_count, is_latest, external_url
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)`
        )
        .run(
          cleanVersion,
          cleanTitle,
          cleanChannel,
          cleanPlatform,
          resolvedFileName,
          resolvedStoredName,
          resolvedSize,
          sha256,
          cleanChangelog,
          setLatest,
          req.file ? '' : cleanExternalUrl
        );

      const created = db.prepare('SELECT * FROM releases WHERE id = ?').get(result.lastInsertRowid);
      res.status(201).json({ release: created });
    } catch (dbErr) {
      if (req.file) fs.unlink(req.file.path, () => {});
      if (String(dbErr.message || '').includes('UNIQUE')) {
        return res.status(409).json({ error: `A versão "${cleanVersion}" já existe!` });
      }
      res.status(500).json({ error: 'Não foi possível salvar a nova versão.' });
    }
  });
});

app.patch('/api/releases/:id/latest', requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const existing = db.prepare('SELECT * FROM releases WHERE id = ?').get(id);
  if (!existing) {
    return res.status(404).json({ error: 'Versão não encontrada.' });
  }
  db.prepare('UPDATE releases SET is_latest = 0').run();
  db.prepare('UPDATE releases SET is_latest = 1 WHERE id = ?').run(id);
  const updated = db.prepare('SELECT * FROM releases WHERE id = ?').get(id);
  res.json({ release: updated });
});

app.delete('/api/releases/:id', requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const existing = db.prepare('SELECT * FROM releases WHERE id = ?').get(id);
  if (!existing) {
    return res.status(404).json({ error: 'Versão não encontrada.' });
  }
  db.prepare('DELETE FROM releases WHERE id = ?').run(id);
  if (existing.stored_name) {
    const fullPath = path.join(UPLOADS_DIR, existing.stored_name);
    if (fs.existsSync(fullPath)) {
      fs.unlink(fullPath, () => {});
    }
  }
  // Ensure another release becomes latest if we deleted the latest one
  if (existing.is_latest) {
    const next = db.prepare('SELECT id FROM releases ORDER BY id DESC LIMIT 1').get();
    if (next) {
      db.prepare('UPDATE releases SET is_latest = 1 WHERE id = ?').run(next.id);
    }
  }
  res.json({ deleted: true });
});

// ---------- DEVLOGS / POSTS ----------
app.get('/api/posts', (_req, res) => {
  const posts = db.prepare('SELECT * FROM posts ORDER BY issue_number DESC, id DESC').all();
  res.json({ posts });
});

app.post('/api/posts', requireAdmin, (req, res) => {
  const { title, tag, summary, content } = req.body || {};
  const cleanTitle = String(title || '').trim();
  const cleanTag = String(tag || 'DEVLOG').trim().toUpperCase().slice(0, 16);
  const cleanSummary = String(summary || '').trim();
  const cleanContent = String(content || '').trim();

  if (!cleanTitle || !cleanSummary || !cleanContent) {
    return res.status(400).json({ error: 'Preencha título, resumo e conteúdo da notícia.' });
  }

  const maxIssue = db.prepare('SELECT COALESCE(MAX(issue_number), 0) as max FROM posts').get().max;
  const result = db
    .prepare(
      'INSERT INTO posts (issue_number, title, tag, summary, content, author) VALUES (?, ?, ?, ?, ?, ?)'
    )
    .run(maxIssue + 1, cleanTitle, cleanTag, cleanSummary, cleanContent, req.user.username);

  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ post });
});

app.delete('/api/posts/:id', requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  db.prepare('DELETE FROM posts WHERE id = ?').run(id);
  res.json({ deleted: true });
});

// ---------- COMMUNITY FEEDBACK ----------
app.get('/api/feedback', optionalAuth, (req, res) => {
  const items = db.prepare('SELECT * FROM feedback ORDER BY votes DESC, id DESC').all();
  let votedIds = new Set();
  if (req.user) {
    const rows = db
      .prepare('SELECT feedback_id FROM feedback_votes WHERE user_id = ?')
      .all(req.user.id);
    votedIds = new Set(rows.map((r) => r.feedback_id));
  }

  res.json({
    feedback: items.map((item) => ({
      ...item,
      votedByMe: votedIds.has(item.id),
    })),
  });
});

app.post('/api/feedback', requireAuth, (req, res) => {
  const { category, title, message } = req.body || {};
  const cleanCat = ['bug', 'idea', 'balance'].includes(category) ? category : 'idea';
  const cleanTitle = String(title || '').trim();
  const cleanMsg = String(message || '').trim();

  if (cleanTitle.length < 4 || cleanMsg.length < 8) {
    return res
      .status(400)
      .json({ error: 'Descreva um título (mín. 4 caracteres) e detalhes (mín. 8 caracteres).' });
  }

  const result = db
    .prepare(
      `INSERT INTO feedback (user_id, username, user_badge, category, title, message, status, votes)
       VALUES (?, ?, ?, ?, ?, ?, 'novo', 1)`
    )
    .run(req.user.id, req.user.username, req.user.badge, cleanCat, cleanTitle, cleanMsg);

  db.prepare('INSERT OR IGNORE INTO feedback_votes (feedback_id, user_id) VALUES (?, ?)').run(
    result.lastInsertRowid,
    req.user.id
  );

  const created = db.prepare('SELECT * FROM feedback WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ feedback: { ...created, votedByMe: true } });
});

app.post('/api/feedback/:id/vote', requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const existing = db.prepare('SELECT * FROM feedback WHERE id = ?').get(id);
  if (!existing) {
    return res.status(404).json({ error: 'Item não encontrado.' });
  }

  const already = db
    .prepare('SELECT 1 FROM feedback_votes WHERE feedback_id = ? AND user_id = ?')
    .get(id, req.user.id);

  if (already) {
    db.prepare('DELETE FROM feedback_votes WHERE feedback_id = ? AND user_id = ?').run(
      id,
      req.user.id
    );
    db.prepare('UPDATE feedback SET votes = MAX(0, votes - 1) WHERE id = ?').run(id);
  } else {
    db.prepare('INSERT INTO feedback_votes (feedback_id, user_id) VALUES (?, ?)').run(
      id,
      req.user.id
    );
    db.prepare('UPDATE feedback SET votes = votes + 1 WHERE id = ?').run(id);
  }

  const updated = db.prepare('SELECT * FROM feedback WHERE id = ?').get(id);
  res.json({ feedback: { ...updated, votedByMe: !already } });
});

app.patch('/api/feedback/:id', requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body || {};
  const allowed = new Set(['novo', 'em_analise', 'em_dev', 'resolvido']);
  if (!allowed.has(status)) {
    return res.status(400).json({ error: 'Status inválido.' });
  }
  db.prepare('UPDATE feedback SET status = ? WHERE id = ?').run(status, id);
  const updated = db.prepare('SELECT * FROM feedback WHERE id = ?').get(id);
  res.json({ feedback: updated });
});

// ---------- STATIC PRODUCTION FRONTEND ----------
const clientDist = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`⚡ BRMatched API rodando em http://localhost:${PORT}`);
});
