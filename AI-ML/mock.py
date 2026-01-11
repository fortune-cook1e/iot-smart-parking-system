import pandas as pd
import random
import uuid
from datetime import datetime, timedelta


def clamp(value: float, low: float, high: float) -> float:
    return max(low, min(high, value))


def arrival_probability(hour: int, is_weekend: int, weather: str) -> float:
    """Return probability of a car arriving in a given hour.

    This intentionally injects signal so a model can learn patterns:
    - Weekday daytime tends to be busier
    - Night is quieter
    - Rainy weather increases demand
    """
    # Lower base probability to reduce total events (~200 events target)
    p = 0.15

    # Time-of-day effects
    if 7 <= hour <= 9:       # morning rush
        p += 0.12
    elif 10 <= hour <= 16:   # daytime steady
        p += 0.08
    elif 17 <= hour <= 20:   # evening rush
        p += 0.15
    elif 0 <= hour <= 5:     # late night low
        p -= 0.10
    else:
        p -= 0.03

    # Weekend effect
    if is_weekend:
        p -= 0.05

    # Weather effect
    if weather == "rainy":
        p += 0.06
    elif weather == "cloudy":
        p += 0.02
    elif weather == "windy":
        p -= 0.01

    return clamp(p, 0.03, 0.50)


def generate_parking_duration(hour: int, is_weekend: int) -> int:
    """Generate parking duration in minutes based on time patterns."""
    # Base duration: 30-180 minutes
    if is_weekend:
        # Weekend: longer stays (shopping, leisure)
        base = random.randint(60, 240)
    elif 7 <= hour <= 9:
        # Morning commuters: longer stays
        base = random.randint(180, 480)
    elif 17 <= hour <= 20:
        # Evening: shorter stays
        base = random.randint(30, 120)
    else:
        base = random.randint(30, 180)

    return base


# ==========================
# Configuration
# ==========================
sensor_id = "SENSOR_C04"
weathers = ["sunny", "cloudy", "rainy", "windy"]

# Time range
start_time = datetime(2025, 12, 17, 0, 0, 0)
end_time = datetime(2026, 1, 5, 23, 59, 59)

# Snapshot interval (10 minutes)
snapshot_interval = timedelta(minutes=10)

# Target approximately 800 snapshots for training (more data for better model)
max_snapshots = 800

# ==========================
# Step 1: Generate parking_events data
# ==========================
print("🚗 Generating parking_events...")

events = []
event_id = 1
current_time = start_time

# Track current occupancy state
is_occupied = False
current_arrival_time = None

# Weather changes every few hours
current_weather = random.choice(weathers)
weather_change_time = start_time

while current_time < end_time:
    # Change weather periodically (every 3-6 hours)
    if current_time >= weather_change_time:
        current_weather = random.choice(weathers)
        weather_change_time = current_time + timedelta(hours=random.randint(3, 6))

    is_weekend = 1 if current_time.weekday() >= 5 else 0
    hour = current_time.hour

    if not is_occupied:
        # Check if a car arrives
        p_arrive = arrival_probability(hour, is_weekend, current_weather)
        if random.random() < p_arrive:
            # Car arrives (OCCUPIED event)
            is_occupied = True
            current_arrival_time = current_time

            events.append({
                "id": str(uuid.uuid4()),
                "sensor_id": sensor_id,
                "event_type": "occupied",
                "event_time": current_time.strftime("%Y-%m-%d %H:%M:%S"),
                "weather": current_weather,
                "created_at": current_time.strftime("%Y-%m-%d %H:%M:%S"),
            })
            event_id += 1

            # Schedule departure
            duration = generate_parking_duration(hour, is_weekend)
            departure_time = current_time + timedelta(minutes=duration)

            # Jump to departure time
            current_time = departure_time
            continue
    else:
        # Car departs (AVAILABLE event)
        is_occupied = False

        events.append({
            "id": str(uuid.uuid4()),
            "sensor_id": sensor_id,
            "event_type": "available",
            "event_time": current_time.strftime("%Y-%m-%d %H:%M:%S"),
            "weather": current_weather,
            "created_at": current_time.strftime("%Y-%m-%d %H:%M:%S"),
        })
        event_id += 1
        current_arrival_time = None

    # Move forward in time (5-30 minutes between potential events)
    current_time += timedelta(minutes=random.randint(5, 30))

# Save parking_events.csv
events_df = pd.DataFrame(events)
events_df.to_csv("parking_events.csv", index=False)
print(f"✅ parking_events.csv 生成完成！共 {len(events_df)} 条事件")

# ==========================
# Step 2: Generate parking_snapshot_training from events
# ==========================
print("\n📸 Generating parking_snapshot_training from events...")

# Build a timeline of occupancy states from events
events_df["event_time"] = pd.to_datetime(events_df["event_time"])
events_df = events_df.sort_values("event_time")

# Generate snapshot timestamps
total_duration = (end_time - start_time).total_seconds()
total_buckets = int(total_duration / snapshot_interval.total_seconds()) + 1

if max_snapshots >= total_buckets:
    selected_indices = range(total_buckets)
else:
    selected_indices = [
        i * (total_buckets - 1) // (max_snapshots - 1)
        for i in range(max_snapshots)
    ]

snapshots = []

for idx in selected_indices:
    snapshot_time = start_time + idx * snapshot_interval

    # Find the most recent event before this snapshot
    past_events = events_df[events_df["event_time"] <= snapshot_time]

    if len(past_events) == 0:
        # No events yet, assume available
        status = 0
        last_event_time = snapshot_time - timedelta(minutes=random.randint(1, 9))
        weather = random.choice(weathers)
    else:
        last_event = past_events.iloc[-1]
        # Status based on last event type
        status = 1 if last_event["event_type"] == "occupied" else 0
        last_event_time = last_event["event_time"]
        weather = last_event["weather"]

    is_weekend = 1 if snapshot_time.weekday() >= 5 else 0
    day_of_week = snapshot_time.weekday()
    hour = snapshot_time.hour
    minute_bucket = (snapshot_time.minute // 10) * 10

    snapshots.append({
        "sensor_id": sensor_id,
        "time_bucket_start": snapshot_time.strftime("%Y-%m-%d %H:%M:%S"),
        "status": status,
        "last_event_time": last_event_time.strftime("%Y-%m-%d %H:%M:%S") if isinstance(last_event_time, datetime) else str(last_event_time),
        "weather": weather,
        "is_weekend": is_weekend,
        "day_of_week": day_of_week,
        "hour": hour,
        "minute_bucket": minute_bucket,
        "created_at": snapshot_time.strftime("%Y-%m-%d %H:%M:%S"),
    })

# Save parking_snapshot_training.csv
snapshots_df = pd.DataFrame(snapshots)
snapshots_df.to_csv("parking_snapshots.csv", index=False)

print(f"✅ parking_snapshots.csv 生成完成！")
print(f"   时间范围: {start_time.strftime('%Y-%m-%d')} -> {end_time.strftime('%Y-%m-%d')}")
print(f"   快照间隔: {int(snapshot_interval.total_seconds() / 60)} 分钟")
print(f"   快照数量: {len(snapshots_df)}")
print(f"\n📊 状态统计:")
print(f"   占用 (status=1): {(snapshots_df['status'] == 1).sum()}")
print(f"   空闲 (status=0): {(snapshots_df['status'] == 0).sum()}")