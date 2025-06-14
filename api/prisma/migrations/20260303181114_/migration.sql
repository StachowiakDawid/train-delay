/*
  Warnings:

  - You are about to drop the column `cancelled` on the `connection` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "connection" DROP COLUMN "cancelled",
ADD COLUMN     "cancellation_id" INTEGER;

-- CreateTable
CREATE TABLE "cancellation" (
    "id" SERIAL NOT NULL,
    "cancelled" BOOLEAN[],

    CONSTRAINT "cancellation_pk" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "connection" ADD CONSTRAINT "connection_cancellation_id_fkey" FOREIGN KEY ("cancellation_id") REFERENCES "cancellation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
