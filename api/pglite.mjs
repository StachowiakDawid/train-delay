import { PGlite } from "@electric-sql/pglite";
import { PrismaClient } from "./generated/prisma/index.js";
import fs from "fs";
const prisma = new PrismaClient();
const db = new PGlite();

async function main() {
  await prisma.$executeRaw`COPY connection TO '/tmp/connection.csv' WITH HEADER DELIMITER ';' ;`;
  await prisma.$executeRaw`COPY time_offset TO '/tmp/time_offset.csv' WITH HEADER DELIMITER ';' ;`;
  await prisma.$executeRaw`COPY route TO '/tmp/route.csv' WITH HEADER DELIMITER ';' ;`;
  await prisma.$executeRaw`COPY cancellation TO '/tmp/cancellation.csv' WITH HEADER DELIMITER ';' ;`;


  await db.exec(`CREATE TABLE IF NOT EXISTS public."connection" (
	id serial4 NOT NULL,
	department_date timestamp(0) NOT NULL,
	"operator" varchar NOT NULL,
	route_id int4 NOT NULL,
	arrival_delays _int4 NULL,
	department_delays _int4 NULL,
	time_offset_id int4 NOT NULL,
	cancelled _boolean NULL,
	CONSTRAINT connection_pk PRIMARY KEY (id)
);`);

  await db.exec(`CREATE TABLE IF NOT EXISTS public.time_offset (
	id serial4 NOT NULL,
	arrivals_offsets _int4 NULL,
	departments_offsets _int4 NULL,
	CONSTRAINT time_offset_pk PRIMARY KEY (id)
);`);

  await db.exec(`CREATE TABLE IF NOT EXISTS public.route (
	id serial4 NOT NULL,
	route varchar NOT NULL,
	array_route _varchar NULL,
	CONSTRAINT route_pk PRIMARY KEY (id)
);`);
  await db.exec(
    `CREATE INDEX IF NOT EXISTS route_array_route_index ON public.route USING gin (array_route);`,
  );
  await db.exec(
    `CREATE UNIQUE INDEX IF NOT EXISTS route_route_key ON public.route USING btree (route);`,
  );

  await db.exec(`DELETE FROM public."connection";`);
  await db.exec(`DELETE FROM public.time_offset;`);
  await db.exec(`DELETE FROM public.route;`);

  let blob = await fs.openAsBlob("/tmp/connection.csv");

  await db.query(
    "COPY connection FROM '/dev/blob' WITH HEADER DELIMITER ';' ;",
    [],
    {
      blob,
    },
  );

  blob = await fs.openAsBlob("/tmp/time_offset.csv");

  await db.query(
    "COPY time_offset FROM '/dev/blob' WITH HEADER DELIMITER ';' ;",
    [],
    {
      blob,
    },
  );

  blob = await fs.openAsBlob("/tmp/route.csv");

  await db.query(
    "COPY route FROM '/dev/blob' WITH HEADER DELIMITER ';' ;",
    [],
    {
      blob,
    },
  );

  const dump = await db.dumpDataDir("gzip");

  fs.writeFileSync(dump.name, Buffer.from(await dump.arrayBuffer()));
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
