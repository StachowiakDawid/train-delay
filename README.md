# TrainDelay

An application showing historical data of delays on Polish railways.

Data provided by https://zbiorkom.live/.

Deployment with DuckDB in WebAssembly: https://train-delay.s3.waw.io.cloud.ovh.net/index.html

# How to use

Before running you need to create database schema using Prisma and import data using scripts `download.ts`, `import.ts` and optionally `pglite.mjs` in `api` folder.

Initializing database:

```
cd api
npx prisma migrate dev
npx prisma generate --sql
```

Exporting database to PGLite (optional):

```
cd api
node pglite.mjs
mv pgdata.tar.gz ../app/public
```

Exporting database to DuckDB (optional):

```
psql -c "COPY time_offset TO '/tmp/time_offset.parquet' (format 'parquet');"
psql -c "COPY route TO '/tmp/route.parquet' (format 'parquet');"
psql -c "COPY connection TO '/tmp/connection.parquet' (format 'parquet');"
mv /tmp/time_offset.parquet ./app/public/
mv /tmp/route.parquet ./app/public/
mv /tmp/connection.parquet ./app/public/
```

Running frontend (all comands in `app` folder):

Development version with PGLite (instance of PostgreSQL in WebAssembly):

`npx ng serve --configuration pglite-development`

Development version with DuckDB (also in WebAssembly):

`npx ng serve --configuration duckdb-development`

Version with standard PostgreSQL server:

`npx ng serve` and `npx tsx index.tsx` in `api`

Deployment of PGLite version:

`npx ng build --configuration pglite`

Deployment of DuckDB version:

`npx ng build --configuration duckdb`