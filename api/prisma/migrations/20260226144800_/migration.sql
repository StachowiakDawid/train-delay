/*
  Warnings:

  - You are about to drop the column `connection_type` on the `connection` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `connection` table. All the data in the column will be lost.
  - You are about to drop the column `destination` on the `connection` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `connection` table. All the data in the column will be lost.
  - You are about to drop the column `pkp_id` on the `connection` table. All the data in the column will be lost.
  - You are about to drop the column `arrival_time` on the `stop` table. All the data in the column will be lost.
  - You are about to drop the column `department_time` on the `stop` table. All the data in the column will be lost.
  - You are about to drop the column `first_station` on the `stop` table. All the data in the column will be lost.
  - You are about to drop the column `last_station` on the `stop` table. All the data in the column will be lost.
  - You are about to drop the column `platform` on the `stop` table. All the data in the column will be lost.
  - You are about to drop the column `problems` on the `stop` table. All the data in the column will be lost.
  - You are about to drop the column `railway` on the `stop` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "connection" DROP COLUMN "connection_type",
DROP COLUMN "description",
DROP COLUMN "destination",
DROP COLUMN "name",
DROP COLUMN "pkp_id";

-- AlterTable
ALTER TABLE "stop" DROP COLUMN "arrival_time",
DROP COLUMN "department_time",
DROP COLUMN "first_station",
DROP COLUMN "last_station",
DROP COLUMN "platform",
DROP COLUMN "problems",
DROP COLUMN "railway";
