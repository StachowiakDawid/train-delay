import { PrismaClient } from "./generated/prisma";
import fs from "node:fs";
import { format } from "date-fns";
const prisma = new PrismaClient();
import "dotenv/config";

async function load(data: any, day: string) {
  data = JSON.parse(data);
  const daySplit = day.split("-").map((i) => parseInt(i));
  const department_date = new Date(
    daySplit[0],
    daySplit[1] - 1,
    daySplit[2] + 1,
  );
  for (let connection of data) {
    const description = connection[0];
    const pkp_id = connection[1];
    const connection_type = connection[2];
    const name = connection[3];
    const destination = connection[4];
    const operator = connection[5];
    const stops = [];
    const route = connection[6].map((stop: any) => stop[0].replaceAll('.', '').replaceAll('dot', '')).join(".");
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
    const connectionEntity = await prisma.connection.create({
      data: {
        department_date,
        name,
        operator,
        destination,
        description,
        connection_type,
        route: { connect: { id: routeId } },
        pkp_id: `${pkp_id}`,
      },
    });
    const stations = [];
    for (let [i, stop] of connection[6].entries()) {
      const arrival_timestamp = new Date(stop[1][0]);
      const department_timestamp = new Date(stop[2][0]);
      let stationId: any = await prisma.$queryRaw`SELECT id FROM station WHERE name = ${stop[0]}`;
      stationId = stationId[0]?.id;
      if (!stationId) {
        const stationEntity = await prisma.station.create({
          data: {
            name: stop[0].replaceAll('.', '').replaceAll('dot', ''),
          },
        });
        stationId = stationEntity.id;
      }
      stations.push(stationId);
      stops.push({
        connection_id: connectionEntity.id,
        station_id: stationId,
        arrival_timestamp, // UTC
        arrival_delay: stop[1][1]/1000, 
        arrival_time: format(arrival_timestamp, "yyyy-MM-dd'T'HH:mm:ss'Z'"), // Local timezone
        department_timestamp, // UTC
        department_delay: stop[2][1]/1000, 
        department_time: format(
          department_timestamp,
          "yyyy-MM-dd'T'HH:mm:ss'Z'",
        ), // Local timezone
        platform: stop[3] ?? "",
        railway: stop[4] ?? "",
        problems: stop[6],
        cancelled: stop[5],
        order_number: i + 1,
        first_station: false,
        last_station: false,
      });
    }
    stops[0].first_station = true;
    stops[stops.length - 1].last_station = true;
    await prisma.stop.createMany({
      data: stops,
    });
  }
}

async function main() {
  fs.readdir("./data", async (err: any, allFiles: string[]) => {
    let i = 0;
    for (let file of allFiles) {
      // if (i > 5) continue;
      console.log(file);
      await load(await fs.promises.readFile(`./data/${file}`, "utf-8"), file);
      i++;
    }
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
