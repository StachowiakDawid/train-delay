/*
  Warnings:

  - You are about to drop the `Connection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Stop` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Stop" DROP CONSTRAINT "Stop_connection_id_fkey";

-- DropTable
DROP TABLE "Connection";

-- DropTable
DROP TABLE "Stop";

-- CreateTable
CREATE TABLE "station" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,

    CONSTRAINT "station_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "route" (
    "id" SERIAL NOT NULL,
    "route" VARCHAR NOT NULL,

    CONSTRAINT "route_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "connection" (
    "id" SERIAL NOT NULL,
    "department_date" DATE NOT NULL,
    "name" VARCHAR NOT NULL,
    "operator" VARCHAR NOT NULL,
    "destination" VARCHAR NOT NULL,
    "connection_type" VARCHAR NOT NULL,
    "description" VARCHAR NOT NULL,
    "pkp_id" VARCHAR NOT NULL,
    "route_id" INTEGER NOT NULL,

    CONSTRAINT "connection_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stop" (
    "id" SERIAL NOT NULL,
    "connection_id" INTEGER NOT NULL,
    "order_number" INTEGER NOT NULL,
    "station" VARCHAR NOT NULL,
    "arrival_timestamp" TIMESTAMP(0) NOT NULL,
    "department_timestamp" TIMESTAMP(0) NOT NULL,
    "arrival_time" TIME(0) NOT NULL,
    "department_time" TIME(0) NOT NULL,
    "arrival_delay" INTEGER NOT NULL,
    "department_delay" INTEGER NOT NULL,
    "platform" VARCHAR NOT NULL,
    "railway" VARCHAR NOT NULL,
    "problems" VARCHAR[],
    "cancelled" BOOLEAN NOT NULL,
    "first_station" BOOLEAN NOT NULL,
    "last_station" BOOLEAN NOT NULL,

    CONSTRAINT "stop_pk" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "stop_connection_id_idx" ON "stop"("connection_id");

-- AddForeignKey
ALTER TABLE "connection" ADD CONSTRAINT "connection_route_id_fkey" FOREIGN KEY ("route_id") REFERENCES "route"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stop" ADD CONSTRAINT "stop_connection_id_fkey" FOREIGN KEY ("connection_id") REFERENCES "connection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
