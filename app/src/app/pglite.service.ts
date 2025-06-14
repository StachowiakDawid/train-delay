import { Injectable, Signal, signal } from '@angular/core';
import { PGlite } from '@electric-sql/pglite';

@Injectable({ providedIn: 'root' })
export class PGliteService {
  private db: PGlite | undefined;
  private isInitialized = signal<boolean>(false);

  async init(dbFile: string): Promise<void> {
    const blob = await fetch(dbFile).then((response) => response.blob());
    this.db = await PGlite.create({ loadDataDir: blob });
    setTimeout(() => {
      this.isInitialized.set(true);
      console.log('Database initialized');
    }, 3000);
  }

  async query<T = any>(sql: string, params?: any[]): Promise<{ rows: T[] }> {
    return this.DB().query<T>(sql, params);
  }

  async exec(sql: string): Promise<void> {
    await this.DB().exec(sql);
  }

  public get isReady(): Signal<boolean> {
    return this.isInitialized.asReadonly();
  }

  private DB(): PGlite {
    if (!this.db) {
      throw new Error('Call init() first.');
    }
    return this.db;
  }
}
