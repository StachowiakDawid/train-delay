/*
  Warnings:

  - A unique constraint covering the columns `[route]` on the table `route` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `station` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "route_route_key" ON "route"("route");

-- CreateIndex
CREATE UNIQUE INDEX "station_name_key" ON "station"("name");
