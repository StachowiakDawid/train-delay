/*
  Warnings:

  - You are about to drop the column `station` on the `stop` table. All the data in the column will be lost.
  - Added the required column `station_id` to the `stop` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "stop" DROP COLUMN "station",
ADD COLUMN     "station_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "stop" ADD CONSTRAINT "stop_station_id_fkey" FOREIGN KEY ("station_id") REFERENCES "station"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
