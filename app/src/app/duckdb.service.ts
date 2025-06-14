import { inject, Injectable, Signal, signal } from '@angular/core';
import { Location } from '@angular/common';
import * as duckdb from '@duckdb/duckdb-wasm';
import urlJoin from 'url-join';

@Injectable({
  providedIn: 'root',
})
export class DuckDbService {
  private location = inject(Location);
  private db: duckdb.AsyncDuckDB | null = null;
  private connection: duckdb.AsyncDuckDBConnection | null = null;
  private isInitialized = signal<boolean>(false);
  constructor() {
    this.initializeDb();
  }
  private async initializeDb(): Promise<void> {
    try {
      const MANUAL_BUNDLES: duckdb.DuckDBBundles = {
        mvp: {
          mainModule: 'duckdb-mvp.wasm',
          mainWorker: 'duckdb-browser-mvp.worker.js',
        },
        eh: {
          mainModule: 'duckdb-eh.wasm',
          mainWorker: 'duckdb-browser-eh.worker.js',
        },
      };
      const bundle = await duckdb.selectBundle(MANUAL_BUNDLES);

      const worker = new Worker(bundle.mainWorker!);
      const logger = new duckdb.ConsoleLogger();
      this.db = new duckdb.AsyncDuckDB(logger, worker);
      await this.db.instantiate(bundle.mainModule);

      this.connection = await this.db.connect();
      await this.loadData();
      this.isInitialized.set(true);
      console.log('DuckDB initialized successfully');
    } catch (error) {
      console.error('Failed to initialize DuckDB:', error);
      this.isInitialized.set(false);
    }
  }

  private async loadData(): Promise<void> {
    if (!this.connection) {
      throw new Error('DuckDB connection is not initialized');
    }
    const promise1 = this.connection
      .prepare(`CREATE TABLE route AS SELECT * FROM read_parquet(?);`)
      .then((stmt) => {
        stmt.query(this.getUrl('/route.parquet'));
      });
    const promise2 = this.connection
      .prepare(`CREATE TABLE time_offset AS SELECT * FROM read_parquet(?);`)
      .then((stmt) => {
        stmt.query(this.getUrl('/time_offset.parquet'));
      });
    const promise3 = this.connection
      .prepare(`CREATE TABLE connection AS SELECT * FROM read_parquet(?);`)
      .then((stmt) => {
        stmt.query(this.getUrl('/connection.parquet'));
      });
    await Promise.all([promise1, promise2, promise3]);
  }

  private getUrl(path: string): string {
    return urlJoin(
      window.location.origin,
      this.location.prepareExternalUrl(path),
    );
  }

  public async query(sql: string): Promise<any[]> {
    if (!this.connection) {
      throw new Error('DuckDB connection is not initialized');
    }
    const stmt = await this.connection.prepare(sql);
    const result = await stmt.query();
    return result.toArray();
  }

  public async queryWithParams(sql: string, params: any[]): Promise<any[]> {
    if (!this.connection) {
      throw new Error('DuckDB connection is not initialized');
    }
    const stmt = await this.connection.prepare(sql);
    const result = await stmt.query(...params);
    return result.toArray();
  }

  public get isReady(): Signal<boolean> {
    return this.isInitialized.asReadonly();
  }
}
