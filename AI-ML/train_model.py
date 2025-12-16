import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
import pickle

# 1. Load CSV
df = pd.read_csv("training-demo.csv")

# 2. Features & label
X = df.drop(columns=["occupied"])
y = df["occupied"]

# 3. One-hot encode "weather"
categorical_features = ["weather"]
numeric_features = ["hour", "weekday", "temp", "price", "location_lat", "location_lng"]

preprocess = ColumnTransformer(
    transformers=[
        ("cat", OneHotEncoder(), categorical_features),
        ("num", "passthrough", numeric_features),
    ]
)

# 4. Build the ML pipeline
model = Pipeline(
    steps=[
        ("preprocess", preprocess),
        ("clf", RandomForestClassifier(n_estimators=100)),
    ]
)

# 5. Train
model.fit(X, y)

# 6. Save model
with open("parking_model.pkl", "wb") as f:
    pickle.dump(model, f)

print("Model trained and saved!")