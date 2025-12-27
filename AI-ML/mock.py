import pandas as pd
import random
from datetime import datetime, timedelta

# ==========================
# 配置
# ==========================
num_samples = 2000        # 数据条数
sensor_id = "SENSOR_C04"
weathers = ["sunny", "cloudy"]

start_time = datetime(2025, 1, 1, 0, 0, 0)  # 起始时间
time_step = timedelta(minutes=10)           # 快照间隔

# ==========================
# 生成数据
# ==========================
data = []

for i in range(num_samples):
    time_bucket_start = start_time + i * time_step
    status = random.choices([0, 1], weights=[0.6, 0.4])[0]  # 60% 空闲, 40% 占用
    last_event_time = time_bucket_start - timedelta(minutes=random.randint(1, 9))
    weather = random.choice(weathers)
    is_weekend = 1 if time_bucket_start.weekday() >= 5 else 0
    day_of_week = time_bucket_start.weekday()
    hour = time_bucket_start.hour
    minute_bucket = (time_bucket_start.minute // 10) * 10
    created_at = time_bucket_start

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
        created_at.strftime("%Y-%m-%d %H:%M:%S")
    ])

# ==========================
# 保存 CSV
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
print("✅ parking_snapshot_training.csv 生成完成！")