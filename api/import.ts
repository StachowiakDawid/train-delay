import { PrismaClient } from './generated/prisma'
import axios from 'axios';
const { format } = require("date-fns");
const prisma = new PrismaClient()
import { API_URL } from './constants';

async function main() {
  axios.get(API_URL)
    .then((allFiles) => {
      for (let day of Object.keys(allFiles.data.files)) {
        for (let url of allFiles.data.files[day]) {
          const daySplit = day.split('-').map(i => parseInt(i));
          const department_date = new Date(daySplit[0], daySplit[1] - 1, daySplit[2] + 1);
          // if (day !== '2025-6-14') continue;
          axios.get(url).then(async (res) => {
            for (let connection of res.data) {
              const name = connection[3];
              const pkp_id = connection[1];
              const operator = connection[5];
              const stops = [];
              const destination = connection[4];
              const connectionEntity = await prisma.connection.create({
                data: {
                  department_date,
                  name,
                  operator,
                  destination,
                  pkp_id: `${pkp_id}`
                },
              });
              for (let [i, stop] of connection[6].entries()) {
                const arrival_timestamp = new Date(stop[2][0]);
                const department_timestamp = new Date(stop[1][0]);
                stops.push({
                  connection_id: connectionEntity.id,
                  station: stop[0],
                  arrival_timestamp,
                  arrival_delay: stop[1][1], // UTC
                  arrival_time: format(arrival_timestamp, "yyyy-MM-dd'T'HH:mm:ss'Z'"), // Local timezone
                  department_timestamp,
                  department_delay: stop[2][1], // UTC
                  department_time: format(department_timestamp, "yyyy-MM-dd'T'HH:mm:ss'Z'"), // Local timezone
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
                data: stops
              });
            }
          })
        }
      }
    })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })