import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const NEWS_DB_FILE = path.join(DATA_DIR, 'news_db.json');
const ENGINE_STATUS_FILE = path.join(DATA_DIR, 'engine_status.json');

// Ensure database files exist with initial content
function ensureDirAndFiles() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(NEWS_DB_FILE)) {
    fs.writeFileSync(NEWS_DB_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
  if (!fs.existsSync(ENGINE_STATUS_FILE)) {
    const initialStatus = {
      lastSync: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      syncHistory: [],
      sourcesHealth: {
        Startupi: { status: 'Online', lastResponseMs: 120, lastChecked: new Date().toISOString() },
        InfoMoney: { status: 'Online', lastResponseMs: 150, lastChecked: new Date().toISOString() },
        Valor: { status: 'Online', lastResponseMs: 180, lastChecked: new Date().toISOString() },
        Canaltech: { status: 'Online', lastResponseMs: 200, lastChecked: new Date().toISOString() },
        TechMundo: { status: 'Online', lastResponseMs: 210, lastChecked: new Date().toISOString() },
        Diolinux: { status: 'Online', lastResponseMs: 110, lastChecked: new Date().toISOString() },
        Gizmodo: { status: 'Online', lastResponseMs: 190, lastChecked: new Date().toISOString() },
        GNews: { status: 'Online', lastResponseMs: 250, lastChecked: new Date().toISOString() },
      },
      stats: {
        imported: 0,
        updated: 0,
        discarded: 0
      }
    };
    fs.writeFileSync(ENGINE_STATUS_FILE, JSON.stringify(initialStatus, null, 2), 'utf-8');
  }
}

// Queue system for thread-safe file writes
class FileLockQueue {
  private queue: Array<() => Promise<void>> = [];
  private running = false;

  async add(task: () => Promise<void>): Promise<void> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          await task();
          resolve();
        } catch (err) {
          reject(err);
        }
      });
      this.next();
    });
  }

  private async next() {
    if (this.running || this.queue.length === 0) return;
    this.running = true;
    const task = this.queue.shift();
    if (task) {
      try {
        await task();
      } catch (err) {
        console.error('FileLockQueue task failed:', err);
      }
    }
    this.running = false;
    this.next();
  }
}

const writeQueue = new FileLockQueue();

export interface StorageArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  image: string;
  publishedAt: string;
  source: string;
  category: string;
  score: number;
  importedAt: string;
  importanceScore: number; // calculated importance for priorities
  expiresAt?: string;
  isPinned?: boolean;
}

export interface SourceHealthInfo {
  status: 'Online' | 'Instável' | 'Offline';
  lastResponseMs: number;
  lastChecked: string;
}

export interface EngineStatus {
  lastSync: string;
  syncHistory: Array<{
    timestamp: string;
    durationMs: number;
    importedCount: number;
    updatedCount: number;
    discardedCount: number;
    modules: string[];
    error?: string;
  }>;
  sourcesHealth: Record<string, SourceHealthInfo>;
  stats: {
    imported: number;
    updated: number;
    discarded: number;
  };
}

// --- Persistent remote store (Upstash Redis / Vercel KV via REST, no extra dependency) ---
// On serverless hosts (e.g. Vercel) the project filesystem is read-only, so the JSON files
// can never be updated at runtime. When REST credentials exist we keep the data there and
// use the committed JSON files only as the initial seed / local-dev fallback.
const REMOTE_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || '';
const REMOTE_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || '';
const REMOTE_ENABLED = !!(REMOTE_URL && REMOTE_TOKEN);
const ARTICLES_KEY = 'focus-news:articles';
const STATUS_KEY = 'focus-news:status';

async function remoteCommand(command: unknown[]): Promise<unknown> {
  const res = await fetch(REMOTE_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${REMOTE_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(command),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Remote store returned HTTP ${res.status}`);
  const data = await res.json();
  if (data.error) throw new Error(`Remote store error: ${data.error}`);
  return data.result;
}

async function remoteGet<T>(key: string): Promise<T | null> {
  const result = await remoteCommand(['GET', key]);
  return typeof result === 'string' ? (JSON.parse(result) as T) : null;
}

async function remoteSet(key: string, value: unknown): Promise<void> {
  await remoteCommand(['SET', key, JSON.stringify(value)]);
}

function readArticlesFromFile(): StorageArticle[] {
  ensureDirAndFiles();
  try {
    return JSON.parse(fs.readFileSync(NEWS_DB_FILE, 'utf-8')) as StorageArticle[];
  } catch (err) {
    console.error('Failed to read news database, returning empty array:', err);
    return [];
  }
}

function readStatusFromFile(): EngineStatus {
  ensureDirAndFiles();
  try {
    return JSON.parse(fs.readFileSync(ENGINE_STATUS_FILE, 'utf-8')) as EngineStatus;
  } catch (err) {
    console.error('Failed to read engine status, rebuilding initial state:', err);
    fs.unlinkSync(ENGINE_STATUS_FILE);
    ensureDirAndFiles();
    return JSON.parse(fs.readFileSync(ENGINE_STATUS_FILE, 'utf-8')) as EngineStatus;
  }
}

function writeFileAtomic(file: string, value: unknown): Promise<void> {
  return writeQueue.add(async () => {
    const tempPath = `${file}.tmp`;
    try {
      fs.writeFileSync(tempPath, JSON.stringify(value, null, 2), 'utf-8');
      fs.renameSync(tempPath, file);
    } catch (err) {
      console.error(`Failed to save ${path.basename(file)}:`, err);
      if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
      throw err;
    }
  });
}

export const Storage = {
  async readArticles(): Promise<StorageArticle[]> {
    if (REMOTE_ENABLED) {
      try {
        const remote = await remoteGet<StorageArticle[]>(ARTICLES_KEY);
        if (remote) return remote;
      } catch (err) {
        console.error('Remote read of articles failed, using bundled file:', err);
      }
    }
    return readArticlesFromFile();
  },

  async saveArticles(articles: StorageArticle[]): Promise<void> {
    if (REMOTE_ENABLED) return remoteSet(ARTICLES_KEY, articles);
    ensureDirAndFiles();
    return writeFileAtomic(NEWS_DB_FILE, articles);
  },

  async readStatus(): Promise<EngineStatus> {
    if (REMOTE_ENABLED) {
      try {
        const remote = await remoteGet<EngineStatus>(STATUS_KEY);
        if (remote) return remote;
      } catch (err) {
        console.error('Remote read of status failed, using bundled file:', err);
      }
    }
    return readStatusFromFile();
  },

  async saveStatus(status: EngineStatus): Promise<void> {
    if (REMOTE_ENABLED) return remoteSet(STATUS_KEY, status);
    ensureDirAndFiles();
    return writeFileAtomic(ENGINE_STATUS_FILE, status);
  },
};
