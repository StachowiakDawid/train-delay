-- CreateTable
CREATE TABLE "Connection" (
    "id" SERIAL NOT NULL,
    "department_date" DATE NOT NULL,
    "name" VARCHAR NOT NULL,
    "operator" VARCHAR NOT NULL,
    "destination" VARCHAR NOT NULL,
    "pkp_id" VARCHAR NOT NULL,

    CONSTRAINT "connection_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stop" (
    "id" SERIAL NOT NULL,
    "connection_id" INTEGER NOT NULL,
    "order_number" INTEGER NOT NULL,
    "station" VARCHAR NOT NULL,
    "arrival_timestamp" TIMESTAMP(6) NOT NULL,
    "department_timestamp" TIMESTAMP(6) NOT NULL,
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

-- AddForeignKey
ALTER TABLE "Stop" ADD CONSTRAINT "Stop_connection_id_fkey" FOREIGN KEY ("connection_id") REFERENCES "Connection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
