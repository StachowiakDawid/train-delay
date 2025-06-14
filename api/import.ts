import { PrismaClient } from "./generated/prisma";
import fs from "node:fs";
const prisma = new PrismaClient();
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
    const route = connection[6].map((stop: any) => stop[0].replaceAll('.', '').replaceAll('dot', '')).join(".");
    const arrivals = connection[6].map((stop: any) => (new Date(stop[1][0]).getTime() - department_date.getTime())/1000);
    const departments = connection[6].map((stop: any) => (new Date(stop[2][0]).getTime() - department_date.getTime())/1000);
    let arrivalsId: any = await prisma.time_offset.findFirst({
      where: {
        offsets: {
          equals: arrivals,
        }
      }
    });
    arrivalsId = arrivalsId?.id;
    if (!arrivalsId) {
      arrivalsId = await prisma.time_offset.create({
        data: {
          offsets: arrivals,
        },
      });
      arrivalsId = arrivalsId.id;
    }
    let departmentsId: any = await prisma.time_offset.findFirst({
      where: {
        offsets: {
          equals: departments,
        }
      }
    });
    departmentsId = departmentsId?.id;
    if (!departmentsId) {
      departmentsId = await prisma.time_offset.create({
        data: {
          offsets: departments,
        },
      });
      departmentsId = departmentsId.id;
    }
    let routeId: any = await prisma.$queryRaw`SELECT id FROM route WHERE route = ${route}`;
    routeId = routeId[0]?.id;
    if (!routeId) {
      const routeEntity = await prisma.route.create({
        data: {
          route,
        },
      });
      routeId = routeEntity.id;
    }
    await prisma.connection.create({
      data: {
        department_date,
        operator,
        arrivals_offsets_id: arrivalsId,
        departments_offsets_id: departmentsId,
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
    let i = 0;
    for (let file of allFiles) {
      // if (i > 5) continue;
      // if (!file.startsWith('2026-2-24')) continue;
      console.log(file);
      await load(await fs.promises.readFile(`./data/${file}`, "utf-8"), file);
      i++;
    }
    await prisma.$executeRaw`create extension ltree`;
    await prisma.$executeRaw`alter table route add ltree_route ltree`;
    await prisma.$executeRaw`update route set ltree_route = text2ltree(route)`;
    await prisma.$executeRaw`create index route_ltree_route_index on route using gist(ltree_route)`;
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
