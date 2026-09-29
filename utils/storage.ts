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

export const Storage = {
  // Read all articles
  readArticles(): StorageArticle[] {
    ensureDirAndFiles();
    try {
      const data = fs.readFileSync(NEWS_DB_FILE, 'utf-8');
      return JSON.parse(data) as StorageArticle[];
    } catch (err) {
      console.error('Failed to read news database, returning empty array:', err);
      return [];
    }
  },

  // Save articles (thread-safe queue write)
  async saveArticles(articles: StorageArticle[]): Promise<void> {
    ensureDirAndFiles();
    return writeQueue.add(async () => {
      const tempPath = `${NEWS_DB_FILE}.tmp`;
      try {
        fs.writeFileSync(tempPath, JSON.stringify(articles, null, 2), 'utf-8');
        fs.renameSync(tempPath, NEWS_DB_FILE);
      } catch (err) {
        console.error('Failed to save articles:', err);
        if (fs.existsSync(tempPath)) {
          fs.unlinkSync(tempPath);
        }
        throw err;
      }
    });
  },

  // Read status
  readStatus(): EngineStatus {
    ensureDirAndFiles();
    try {
      const data = fs.readFileSync(ENGINE_STATUS_FILE, 'utf-8');
      return JSON.parse(data) as EngineStatus;
    } catch (err) {
      console.error('Failed to read engine status, rebuilding initial state:', err);
      // Re-create initial state
      fs.unlinkSync(ENGINE_STATUS_FILE);
      ensureDirAndFiles();
      return JSON.parse(fs.readFileSync(ENGINE_STATUS_FILE, 'utf-8')) as EngineStatus;
    }
  },

  // Save status (thread-safe queue write)
  async saveStatus(status: EngineStatus): Promise<void> {
    ensureDirAndFiles();
    return writeQueue.add(async () => {
      const tempPath = `${ENGINE_STATUS_FILE}.tmp`;
      try {
        fs.writeFileSync(tempPath, JSON.stringify(status, null, 2), 'utf-8');
        fs.renameSync(tempPath, ENGINE_STATUS_FILE);
      } catch (err) {
        console.error('Failed to save engine status:', err);
        if (fs.existsSync(tempPath)) {
          fs.unlinkSync(tempPath);
        }
        throw err;
      }
    });
  }
};
