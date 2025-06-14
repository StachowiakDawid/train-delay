import axios from "axios";
import "dotenv/config";
import fs from "fs";

function load(url: string, day: string, i: number) {
  axios.get(url).then(
    async (res) => {
      const data = res.data;
      const name = `./data/${day}_${i}.json`;
      if (fs.existsSync(name))
        return;
      fs.writeFile(name, JSON.stringify(data), (err) => {
        if (err) {
          console.error(err);
        }
      });
    },
    () => {
      load(url, day, i);
    },
  );
}

async function main() {
  fs.readFile("./allFiles.json", "utf-8", async (err, allFiles: any) => {
    if (err) {
      console.error(err);
      return;
    }
    allFiles = JSON.parse(allFiles);
    let i = 0;
    const yesterday  = new Date();
    yesterday.setDate(yesterday.getDate()-1);
    const date =`${yesterday.getFullYear()}-${yesterday.getMonth() + 1}-${yesterday.getDate()}`;
    for (let day of Object.keys(allFiles.files)) {
      if (day !== date) continue;
      for (let url of allFiles.files[day]) {
        i++;
        console.log(day);
        load(url, day, i);
        await new Promise((r) => setTimeout(r, 2500));
      }
      i = 0;
    }
  });
}

main();
