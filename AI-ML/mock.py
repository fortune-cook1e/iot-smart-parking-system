import pandas as pd
import random
from datetime import datetime, timedelta


def clamp(value: float, low: float, high: float) -> float:
    return max(low, min(high, value))


def occupancy_probability(hour: int, is_weekend: int, weather: str) -> float:
    """Return P(status=1 occupied) based on simple, learnable rules.

    This intentionally injects signal so a model can learn patterns:
    - Weekday daytime tends to be busier
    - Night is quieter
    - Rainy weather increases demand
    """

    # Base occupancy
    p = 0.35

    # Time-of-day effects
    if 7 <= hour <= 9:       # morning rush
        p += 0.18
    elif 10 <= hour <= 16:   # daytime steady
        p += 0.12
    elif 17 <= hour <= 20:   # evening rush
        p += 0.22
    elif 0 <= hour <= 5:     # late night low
        p -= 0.20
    else:                    # other hours slightly lower
        p -= 0.05

    # Weekend effect (typically less commuter parking)
    if is_weekend:
        p -= 0.12

    # Weather effect
    if weather == "rainy":
        p += 0.10
    elif weather == "cloudy":
        p += 0.03
    elif weather == "windy":
        p -= 0.02

    return clamp(p, 0.05, 0.95)

# ==========================
# Configuration
# ==========================
sensor_id = "SENSOR_C04"
weathers = ["sunny", "cloudy", "rainy", "windy"]

# Keep dataset size around this number (sample evenly across the full date range)
max_samples = 2000

# Generate data from 2025-12-17 to 2026-01-05 (inclusive)
start_time = datetime(2025, 12, 17, 0, 0, 0)
end_time = datetime(2026, 1, 5, 23, 50, 0)  # last 10-min bucket of the day
time_step = timedelta(minutes=10)  # snapshot interval

# ==========================
# generate data
# ==========================
data = []

total_buckets = int((end_time - start_time) / time_step) + 1

if max_samples >= total_buckets:
    selected_indices = range(total_buckets)
else:
    # Evenly sample indices from [0, total_buckets-1] (inclusive)
    # This preserves the full time span while limiting row count.
    selected_indices = [
        i * (total_buckets - 1) // (max_samples - 1)
        for i in range(max_samples)
    ]

for idx in selected_indices:
    time_bucket_start = start_time + idx * time_step
    weather = random.choice(weathers)
    is_weekend = 1 if time_bucket_start.weekday() >= 5 else 0
    day_of_week = time_bucket_start.weekday()
    hour = time_bucket_start.hour
    minute_bucket = (time_bucket_start.minute // 10) * 10
    created_at = time_bucket_start

    p_occ = occupancy_probability(hour=hour, is_weekend=is_weekend, weather=weather)
    status = 1 if random.random() < p_occ else 0

    # keep last_event_time within the previous 1-9 minutes (as before)
    last_event_time = time_bucket_start - timedelta(minutes=random.randint(1, 9))

    data.append([
        sensor_id,
        time_bucket_start.strftime("%Y-%m-%d %H:%M:%S"),
        status,
        last_event_time.strftime("%Y-%m-%d %H:%M:%S"),
        weather,
        is_weekend,
        day_of_week,
        hour,
        minute_bucket,
        created_at.strftime("%Y-%m-%d %H:%M:%S"),
    ])

# ==========================
# save as CSV
# ==========================
columns = [
    "sensor_id",
    "time_bucket_start",
    "status",
    "last_event_time",
    "weather",
    "is_weekend",
    "day_of_week",
    "hour",
    "minute_bucket",
    "created_at"
]

df = pd.DataFrame(data, columns=columns)
df.to_csv("parking_snapshot_training.csv", index=False)
print(
    f"✅ parking_snapshot_training.csv 生成完成！"
    f"\n   range: {start_time.strftime('%Y-%m-%d')} -> {end_time.strftime('%Y-%m-%d')} (10-min buckets)"
    f"\n   total buckets: {total_buckets}"
    f"\n   samples: {len(df)}"
)