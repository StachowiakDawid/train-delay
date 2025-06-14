-- CreateTable
CREATE TABLE "route" (
    "id" SERIAL NOT NULL,
    "route" VARCHAR NOT NULL,

    CONSTRAINT "route_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "time_offset" (
    "id" SERIAL NOT NULL,
    "offsets" INTEGER[],

    CONSTRAINT "time_offset_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "connection" (
    "id" SERIAL NOT NULL,
    "department_date" TIMESTAMP(0) NOT NULL,
    "operator" VARCHAR NOT NULL,
    "route_id" INTEGER NOT NULL,
    "arrivals_offsets_id" INTEGER NOT NULL,
    "departments_offsets_id" INTEGER NOT NULL,
    "arrival_delays" INTEGER[],
    "department_delays" INTEGER[],
    "cancelled" BOOLEAN[],

    CONSTRAINT "connection_pk" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "route_route_key" ON "route"("route");

-- AddForeignKey
ALTER TABLE "connection" ADD CONSTRAINT "connection_route_id_fkey" FOREIGN KEY ("route_id") REFERENCES "route"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "connection" ADD CONSTRAINT "connection_arrivals_offsets_id_fkey" FOREIGN KEY ("arrivals_offsets_id") REFERENCES "time_offset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "connection" ADD CONSTRAINT "connection_departments_offsets_id_fkey" FOREIGN KEY ("departments_offsets_id") REFERENCES "time_offset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
