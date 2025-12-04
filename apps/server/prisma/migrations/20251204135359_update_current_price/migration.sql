/*
  Warnings:

  - You are about to drop the column `current_price` on the `parking_spaces` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "parking_spaces" DROP COLUMN "current_price",
ADD COLUMN     "currentPrice" DOUBLE PRECISION NOT NULL DEFAULT 0;
