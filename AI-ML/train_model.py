import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
import pickle

# =========================
# 1. Load snapshot data
# =========================
df = pd.read_csv("parking_snapshot_training.csv")

# =========================
# 2. Features & label
# =========================
y = df["status"]

X = df[
    [
        "sensor_id",
        "weather",
        "is_weekend",
        "day_of_week",
        "hour",
        "minute_bucket",
    ]
]

# =========================
# 3. Feature types
# =========================
categorical_features = ["weather", "sensor_id"]
numeric_features = [
    "is_weekend",
    "day_of_week",
    "hour",
    "minute_bucket",
]

preprocess = ColumnTransformer(
    transformers=[
        ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_features),
        ("num", "passthrough", numeric_features),
    ]
)

# =========================
# 4. Pipeline
# =========================
model = Pipeline(
    steps=[
        ("preprocess", preprocess),
        ("clf", RandomForestClassifier(
            n_estimators=200,
            max_depth=None,
            random_state=42,
            n_jobs=-1
        )),
    ]
)

# =========================
# 5. Train
# =========================
model.fit(X, y)

# =========================
# 6. Save model
# =========================
with open("parking_model.pkl", "wb") as f:
    pickle.dump(model, f)

print("✅ Parking prediction model trained and saved!")