import { PrismaClient } from "./generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import fs from "node:fs";
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter});
import "dotenv/config";

async function load(data: any, day: string) {
  data = JSON.parse(data);
  const daySplit = day.split("-").map((i) => parseInt(i));
  const department_date = new Date(
    daySplit[0],
    daySplit[1] - 1,
    daySplit[2],
  );
  department_date.setHours(0, 0, 0, 0);
  for (let connection of data) {
    const operator = connection[5];
    const stations = connection[6].map((stop: any) => stop[0].replaceAll('.', '').replaceAll('dot', ''));
    const route = stations.join(".");
    const arrivals = connection[6].map((stop: any) => (new Date(stop[1][0]).getTime() - department_date.getTime())/1000);
    const departments = connection[6].map((stop: any) => (new Date(stop[2][0]).getTime() - department_date.getTime())/1000);
    let timeOffsetId: any = await prisma.time_offset.findFirst({
      where: {
        departments_offsets: {
          equals: departments,
        },
        arrivals_offsets: {
          equals: arrivals,
        },
      }
    });
    timeOffsetId = timeOffsetId?.id;
    if (!timeOffsetId) {
      timeOffsetId = await prisma.time_offset.create({
        data: {
          departments_offsets: departments,
          arrivals_offsets: arrivals,
        },
      });
      timeOffsetId = timeOffsetId.id;
    }
    let routeId: any = await prisma.$queryRaw`SELECT id FROM route WHERE route = ${route}`;
    routeId = routeId[0]?.id;
    if (!routeId) {
      const routeEntity = await prisma.route.create({
        data: {
          route,
          array_route: stations,
        },
      });
      routeId = routeEntity.id;
    }
    await prisma.connection.create({
      data: {
        department_date,
        operator,
        time_offset_id: timeOffsetId,
        route_id: routeId,
        arrival_delays: connection[6].map((stop: any) => stop[1][1]/1000),
        department_delays: connection[6].map((stop: any) => stop[2][1]/1000),
        cancelled: connection[6].map((stop: any) => stop[5]),
      },
    });
  }
}

async function main() {
  fs.readdir("./data", async (err: any, allFiles: string[]) => {
    await prisma.$executeRaw`create index if not exists route_array_route_index on route using gin(array_route)`;
    let i = 0;
    for (let file of allFiles) {
      // if (i > 5) continue;
      // if (!file.startsWith('2026-2-24')) continue;
      console.log(file);
      await load(await fs.promises.readFile(`./data/${file}`, "utf-8"), file);
      i++;
    }
    // await prisma.$executeRaw`create extension ltree`;
    // await prisma.$executeRaw`alter table route add ltree_route ltree`;
    // await prisma.$executeRaw`update route set ltree_route = text2ltree(route)`;
    // await prisma.$executeRaw`create index route_ltree_route_index on route using gist(ltree_route)`;
    // await prisma.$executeRaw`update route set array_route = string_to_array(route, '.')`;
  });
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
