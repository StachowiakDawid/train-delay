/*
  Warnings:

  - You are about to drop the column `cancellation_id` on the `connection` table. All the data in the column will be lost.
  - You are about to drop the `cancellation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "connection" DROP CONSTRAINT "connection_cancellation_id_fkey";

-- AlterTable
ALTER TABLE "connection" DROP COLUMN "cancellation_id",
ADD COLUMN     "cancelled" BOOLEAN[];

-- DropTable
DROP TABLE "cancellation";
