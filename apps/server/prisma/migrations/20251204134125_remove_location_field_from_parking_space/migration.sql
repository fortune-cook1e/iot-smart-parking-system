/*
  Warnings:

  - You are about to drop the column `location` on the `parking_spaces` table. All the data in the column will be lost.
  - Added the required column `address` to the `parking_spaces` table without a default value. This is not possible if the table is not empty.
  - Added the required column `latitude` to the `parking_spaces` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `parking_spaces` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "parking_spaces" DROP COLUMN "location",
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "latitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "longitude" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "parking_spaces_address_idx" ON "parking_spaces"("address");

-- CreateIndex
CREATE INDEX "parking_spaces_is_occupied_idx" ON "parking_spaces"("is_occupied");

-- CreateIndex
CREATE INDEX "parking_spaces_latitude_longitude_idx" ON "parking_spaces"("latitude", "longitude");

-- CreateIndex
CREATE INDEX "subscriptions_user_id_idx" ON "subscriptions"("user_id");

-- CreateIndex
CREATE INDEX "subscriptions_parking_space_id_idx" ON "subscriptions"("parking_space_id");
