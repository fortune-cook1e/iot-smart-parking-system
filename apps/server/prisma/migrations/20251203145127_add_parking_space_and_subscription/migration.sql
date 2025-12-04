-- CreateTable
CREATE TABLE "parking_spaces" (
    "id" TEXT NOT NULL,
    "sensor_id" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT NOT NULL,
    "is_occupied" BOOLEAN NOT NULL DEFAULT false,
    "current_price" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "parking_spaces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "parking_space_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "parking_spaces_sensor_id_key" ON "parking_spaces"("sensor_id");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_user_id_parking_space_id_key" ON "subscriptions"("user_id", "parking_space_id");

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_parking_space_id_fkey" FOREIGN KEY ("parking_space_id") REFERENCES "parking_spaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;
