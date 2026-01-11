-- CreateTable
CREATE TABLE "parking_events" (
    "id" TEXT NOT NULL,
    "sensor_id" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "event_time" TIMESTAMP(3) NOT NULL,
    "weather" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "parking_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "parking_events_sensor_id_idx" ON "parking_events"("sensor_id");

-- CreateIndex
CREATE INDEX "parking_events_event_time_idx" ON "parking_events"("event_time");

-- CreateIndex
CREATE INDEX "parking_events_sensor_id_event_time_idx" ON "parking_events"("sensor_id", "event_time");
