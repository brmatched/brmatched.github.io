import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath } from 'node:url';
import { hashPassword } from './auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const UPLOADS_DIR = path.join(__dirname, 'uploads');
const DB_PATH = path.join(__dirname, 'brmatched.db');

fs.mkdirSync(UPLOADS_DIR, { recursive: true });

/**
 * Generates a valid uncompressed ZIP archive containing a single text file
 * without needing external zip binaries — so demo downloads always work cleanly on Windows!
 */
function createSampleZip(filePath, entryName, contentText) {
  const nameBuf = Buffer.from(entryName, 'utf8');
  const dataBuf = Buffer.from(contentText, 'utf8');

  let crc = 0xffffffff;
  for (let i = 0; i < dataBuf.length; i++) {
    crc ^= dataBuf[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }
  crc = (crc ^ 0xffffffff) >>> 0;

  const localHeader = Buffer.alloc(30 + nameBuf.length);
  localHeader.writeUInt32LE(0x04034b50, 0);
  localHeader.writeUInt16LE(20, 4);
  localHeader.writeUInt16LE(0, 6);
  localHeader.writeUInt16LE(0, 8);
  localHeader.writeUInt16LE(0, 10);
  localHeader.writeUInt16LE(0, 12);
  localHeader.writeUInt32LE(crc, 14);
  localHeader.writeUInt32LE(dataBuf.length, 18);
  localHeader.writeUInt32LE(dataBuf.length, 22);
  localHeader.writeUInt16LE(nameBuf.length, 26);
  localHeader.writeUInt16LE(0, 28);
  nameBuf.copy(localHeader, 30);

  const centralOffset = localHeader.length + dataBuf.length;

  const centralHeader = Buffer.alloc(46 + nameBuf.length);
  centralHeader.writeUInt32LE(0x02014b50, 0);
  centralHeader.writeUInt16LE(20, 4);
  centralHeader.writeUInt16LE(20, 6);
  centralHeader.writeUInt16LE(0, 8);
  centralHeader.writeUInt16LE(0, 10);
  centralHeader.writeUInt16LE(0, 12);
  centralHeader.writeUInt16LE(0, 14);
  centralHeader.writeUInt32LE(crc, 16);
  centralHeader.writeUInt32LE(dataBuf.length, 20);
  centralHeader.writeUInt32LE(dataBuf.length, 24);
  centralHeader.writeUInt16LE(nameBuf.length, 28);
  centralHeader.writeUInt16LE(0, 30);
  centralHeader.writeUInt16LE(0, 32);
  centralHeader.writeUInt16LE(0, 34);
  centralHeader.writeUInt16LE(0, 36);
  centralHeader.writeUInt32LE(0, 38);
  centralHeader.writeUInt32LE(0, 42);
  nameBuf.copy(centralHeader, 46);

  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(0, 4);
  eocd.writeUInt16LE(0, 6);
  eocd.writeUInt16LE(1, 8);
  eocd.writeUInt16LE(1, 10);
  eocd.writeUInt32LE(centralHeader.length, 12);
  eocd.writeUInt32LE(centralOffset, 16);
  eocd.writeUInt16LE(0, 20);

  const zipBuffer = Buffer.concat([localHeader, dataBuf, centralHeader, eocd]);
  fs.writeFileSync(filePath, zipBuffer);
  return {
    size: zipBuffer.length,
    sha256: crypto.createHash('sha256').update(zipBuffer).digest('hex'),
  };
}

export function initDatabase() {
  const db = new DatabaseSync(DB_PATH);
  db.exec('PRAGMA journal_mode = WAL;');
  db.exec('PRAGMA foreign_keys = ON;');

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'player',
      avatar_color TEXT NOT NULL DEFAULT '#FFE600',
      badge TEXT NOT NULL DEFAULT 'Duelista Beta',
      favorite_deck TEXT NOT NULL DEFAULT 'Rei Arthur',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS releases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      version TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      channel TEXT NOT NULL DEFAULT 'beta',
      platform TEXT NOT NULL DEFAULT 'Windows 10/11 (x64)',
      file_name TEXT NOT NULL,
      stored_name TEXT NOT NULL,
      file_size INTEGER NOT NULL DEFAULT 0,
      sha256 TEXT NOT NULL DEFAULT '',
      changelog TEXT NOT NULL,
      download_count INTEGER NOT NULL DEFAULT 0,
      is_latest INTEGER NOT NULL DEFAULT 0,
      external_url TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      issue_number INTEGER NOT NULL DEFAULT 1,
      title TEXT NOT NULL,
      tag TEXT NOT NULL DEFAULT 'DEVLOG',
      summary TEXT NOT NULL,
      content TEXT NOT NULL,
      author TEXT NOT NULL DEFAULT 'Criador do BRMatched',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      username TEXT NOT NULL,
      user_badge TEXT NOT NULL DEFAULT 'Duelista',
      category TEXT NOT NULL DEFAULT 'idea',
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'novo',
      votes INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS feedback_votes (
      feedback_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      PRIMARY KEY (feedback_id, user_id),
      FOREIGN KEY (feedback_id) REFERENCES feedback(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // Safe migration for existing databases without external_url column
  const releaseCols = db.prepare('PRAGMA table_info(releases)').all();
  if (!releaseCols.some((c) => c.name === 'external_url')) {
    db.exec("ALTER TABLE releases ADD COLUMN external_url TEXT NOT NULL DEFAULT '';");
  }

  seedInitialData(db);
  return db;
}

function seedInitialData(db) {
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  if (userCount === 0) {
    const insertUser = db.prepare(`
      INSERT INTO users (username, email, password_hash, role, avatar_color, badge, favorite_deck)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    insertUser.run(
      'DevBRMatched',
      'admin@brmatched.com',
      hashPassword('admin123'),
      'admin',
      '#FF2A5F',
      'Criador Oficial',
      'Medusa'
    );
    insertUser.run(
      'LendaArthur',
      'jogador@brmatched.com',
      hashPassword('player123'),
      'player',
      '#00D4FF',
      'Duelista Fundador',
      'Rei Arthur'
    );
  }

  const releaseCount = db.prepare('SELECT COUNT(*) as count FROM releases').get().count;
  if (releaseCount === 0) {
    const sampleBuilds = [
      {
        version: 'v2.0-beta',
        title: 'Beta 2.0 — 6 Heróis Lendários (PT-BR Comics)',
        channel: 'beta',
        platform: 'Windows 10/11 (x64)',
        file_name: 'BRMatched-v2.0-beta-Windows-x64.zip',
        stored_name: 'seed-brmatched-v2.0-beta.zip',
        changelog: [
          'NOVO: Pé-Grande (com Jackalope) e Robin Hood (com 4 Foras-da-Lei) agora jogáveis no Beta 2.0!',
          'COMPLETO: Elenco com 6 heróis lendários — Medusa, Rei Arthur, Alice, Sinbad, Pé-Grande e Robin Hood — todos com baralhos de 30 cartas em PT-BR e arte Comics.',
          'NOVO: Arenas Floresta de Sherwood e Yukon adicionadas ao lado de Marmoreal e Sarpedon.',
          'MELHORIA: Motor de combate fiel à ordem Imediatamente → Durante o Combate → Após o Combate, incluindo cancelamento por Finta.',
        ].join('\n'),
        download_count: 246,
        is_latest: 1,
      },
      {
        version: 'v1.5-beta',
        title: 'Batalha das Lendas Vol. 1 — 4 Heróis Iniciais',
        channel: 'beta',
        platform: 'Windows 10/11 (x64)',
        file_name: 'BRMatched-v1.5-beta-Windows-x64.zip',
        stored_name: 'seed-brmatched-v1.5-beta.zip',
        changelog: [
          'Medusa, Rei Arthur, Alice e Sinbad jogáveis com todos os Ajudantes (3 Harpias, Merlin, Jabberwock e Carregador).',
          'Sistema completo de Impulso (Boost) na Manobra e habilidade secreta do Rei Arthur.',
          'CORREÇÃO: Regra de alcance à distância na mesma zona para Medusa e Merlin.',
        ].join('\n'),
        download_count: 318,
        is_latest: 0,
      },
      {
        version: 'v1.0-alpha',
        title: 'Protótipo da Arena — Duelo 1v1',
        channel: 'alpha',
        platform: 'Windows 10/11 (x64)',
        file_name: 'BRMatched-v1.0-alpha-Windows-x64.zip',
        stored_name: 'seed-brmatched-v1.0-alpha.zip',
        changelog: [
          'Primeira build jogável do BRMatched para Windows PC!',
          'Tabuleiro tático com zonas coloridas, Medidor de Vida (Health Dial) e 2 ações por turno.',
          'Duelo inicial Rei Arthur vs Medusa com tradução completa para Português do Brasil.',
        ].join('\n'),
        download_count: 192,
        is_latest: 0,
      },
    ];

    const insertRelease = db.prepare(`
      INSERT INTO releases (
        version, title, channel, platform, file_name, stored_name,
        file_size, sha256, changelog, download_count, is_latest
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const rel of sampleBuilds) {
      const fullPath = path.join(UPLOADS_DIR, rel.stored_name);
      const readmeText = [
        '==================================================',
        `   BRMATCHED! — ${rel.version} (${rel.title})`,
        '   EM BATALHA, NAO HA IGUAIS! (EDICAO COMICS PT-BR)',
        '==================================================',
        '',
        'Este e um pacote de demonstracao gerado pelo site do BRMatched.',
        'Para disponibilizar o seu executavel real (.exe ou .zip):',
        '1. Faca login como Admin no site (admin@brmatched.com / admin123)',
        '2. Acesse o Dashboard > Aba "Painel Dev / Upload"',
        '3. Faca upload do arquivo .exe ou .zip real do seu jogo!',
        '',
        'Novidades desta versao:',
        rel.changelog,
        '',
        'Bons duelos no BRMatched!',
      ].join('\r\n');

      const meta = createSampleZip(fullPath, `BRMatched-${rel.version}/LEIA-ME.txt`, readmeText);
      insertRelease.run(
        rel.version,
        rel.title,
        rel.channel,
        rel.platform,
        rel.file_name,
        rel.stored_name,
        meta.size,
        meta.sha256,
        rel.changelog,
        rel.download_count,
        rel.is_latest
      );
    }
  }

  const postCount = db.prepare('SELECT COUNT(*) as count FROM posts').get().count;
  if (postCount === 0) {
    const insertPost = db.prepare(`
      INSERT INTO posts (issue_number, title, tag, summary, content, author)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    insertPost.run(
      5,
      'EM BREVE: BRMATCHED BETA 4.0 JÁ ESTÁ EM PRODUÇÃO!',
      'EM BREVE • 4.0',
      'Em breve vamos ter o Beta 4.0! Prepare-se para Beowulf, Chapeuzinho Vermelho, novas arenas ilustradas e mecânicas inéditas de combate.',
      'Temos uma grande novidade para a comunidade de duelistas: em breve vamos ter o BRMatched Beta 4.0!\n\nLogo após o lançamento do Beta 3.0 (Becos e Brumas), já iniciamos a produção da próxima grande atualização gratuita do jogo. O Beta 4.0 vai expandir ainda mais a arena com a chegada de Beowulf (acompanhado por Wiglaf e sua mecânica de Fúria) e Chapeuzinho Vermelho (ao lado do Caçador e os combos da Cesta de cartas).',
      'DevBRMatched'
    );
    insertPost.run(
      4,
      'BETA 3.0 NO AR: BECOS E BRUMAS TRAZ 10 HERÓIS E 6 ARENAS!',
      'BETA 3.0',
      'Drácula, Sherlock Holmes, Homem Invisível e Jekyll & Hyde chegaram junto com Soho, Mansão Baskerville (com Passagens Secretas) e novos efeitos!',
      'O BRMatched Beta 3.0 — Becos e Brumas chegou com 10 heróis jogáveis (300 cartas em PT-BR), 6 arenas ilustradas incluindo Soho e Mansão Baskerville com Passagens Secretas, seleção direta no mapa/mão e novos efeitos visuais e sonoros.',
      'DevBRMatched'
    );
    insertPost.run(
      3,
      'BETA 2.0 NO AR: PÉ-GRANDE E ROBIN HOOD ENTRAM NA ARENA!',
      'BETA 2.0',
      'O elenco chegou a 6 heróis jogáveis! Confira Medusa, Rei Arthur, Alice, Sinbad, Pé-Grande e Robin Hood em estilo HQ.',
      'A atualização Beta 2.0 do BRMatched está oficialmente disponível para Windows PC! Além dos 4 clássicos da Batalha das Lendas Vol. 1 (Medusa, Rei Arthur, Alice e Sinbad), agora você pode duelar com o Pé-Grande (e seu Jackalope) e Robin Hood (com os 4 Foras-da-Lei), todos com baralhos completos de 30 cartas em português e artes inéditas em estilo Comics!',
      'DevBRMatched'
    );
    insertPost.run(
      2,
      'ARTES INÉDITAS EM QUADRINHOS PARA TODOS OS 6 BARALHOS!',
      'ARTE',
      'Cada carta de Ataque, Defesa, Versátil e Estratagema ganhou identidade própria em estilo Comics vibrante.',
      'O BRMatched traz duelos táticos assimétricos intensos com identidade visual 100% original em quadrinhos e cartas totalmente em português brasileiro. Todas as 180 cartas do Beta 2.0 receberam molduras de alto contraste e efeitos visuais de impacto!',
      'DevBRMatched'
    );
    insertPost.run(
      1,
      'BEM-VINDO AO HUB OFICIAL DO BRMATCHED PARA WINDOWS!',
      'ANÚNCIO',
      'Baixe todas as versões do jogo, acompanhe a tradução das cartas e ajude a testar novas arenas.',
      'Este portal foi criado para centralizar os downloads do BRMatched para PC Windows, reunir as fichas dos lutadores em PT-BR e abrir um canal direto com a comunidade de duelistas. Crie sua conta para baixar builds antecipadas e reportar qualquer regra ou bug que precise de ajuste!',
      'DevBRMatched'
    );
  }

  const feedbackCount = db.prepare('SELECT COUNT(*) as count FROM feedback').get().count;
  if (feedbackCount === 0) {
    const player = db.prepare('SELECT id, username, badge FROM users WHERE role = ?').get('player');
    const admin = db.prepare('SELECT id, username, badge FROM users WHERE role = ?').get('admin');
    const insertFb = db.prepare(`
      INSERT INTO feedback (user_id, username, user_badge, category, title, message, status, votes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    if (player && admin) {
      insertFb.run(
        player.id,
        player.username,
        player.badge,
        'idea',
        'Adicionar Drácula e Sherlock Holmes (Névoa & Sombras)',
        'Depois de Robin Hood e Pé-Grande, seria sensacional ter o conjunto de Londres com Drácula, Sherlock, Homem Invisível e Jekyll & Hyde em estilo comics!',
        'em_dev',
        24
      );
      insertFb.run(
        player.id,
        player.username,
        player.badge,
        'balance',
        'Destaque visual para a Zona da Medusa antes do Olhar Petrificante',
        'Quando a Medusa está em uma casa de duas cores na arena Marmoreal, seria ótimo destacar todas as zonas válidas com brilho verde antes do início do turno.',
        'em_analise',
        14
      );
      insertFb.run(
        admin.id,
        admin.username,
        admin.badge,
        'bug',
        'Finta cancelando Impulso do Rei Arthur',
        'Corrigido na v0.4.2-beta: agora quando o defensor joga Finta contra o Rei Arthur, o Impulso da habilidade especial é cancelado corretamente conforme a regra oficial!',
        'resolvido',
        9
      );
    }
  }
}
