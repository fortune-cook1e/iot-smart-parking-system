import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score,
    confusion_matrix,
    recall_score,
)
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
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2, # 20% for testing
    random_state=42, # for reproducibility
    stratify=y, # maintain label distribution
)

model.fit(X_train, y_train)

# =========================
# 5.1 Evaluate (Accuracy)
# =========================
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)

# Majority-class baseline (helps interpret accuracy when labels are imbalanced)
majority_baseline = max(y_test.mean(), 1 - y_test.mean())

print(f"✅ Accuracy (test): {accuracy:.4f}")
print(f"ℹ️  Majority baseline (test): {majority_baseline:.4f}")

# Occupied recall (how many true occupied spots we correctly catch)
recall_pos = recall_score(y_test, y_pred, pos_label=1, zero_division=0)
print(f"✅ Occupied(1) Recall (test): {recall_pos:.4f}")

# Confusion matrix: [[TN, FP], [FN, TP]] for labels [0, 1]
tn, fp, fn, tp = confusion_matrix(y_test, y_pred, labels=[0, 1]).ravel()
print("📊 Confusion Matrix (labels: 0=available, 1=occupied)")
print(f"   TN={tn}  FP={fp}")
print(f"   FN={fn}  TP={tp}")

# Optional: train final model on all data before saving
model.fit(X, y)

# =========================
# 6. Save model
# =========================
with open("parking_model.pkl", "wb") as f:
    pickle.dump(model, f)

print("✅ Parking prediction model trained and saved!")