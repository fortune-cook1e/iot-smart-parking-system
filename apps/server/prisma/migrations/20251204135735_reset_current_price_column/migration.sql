/*
  Warnings:

  - You are about to drop the column `currentPrice` on the `parking_spaces` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "parking_spaces" DROP COLUMN "currentPrice",
ADD COLUMN     "current_price" DOUBLE PRECISION NOT NULL DEFAULT 0;
