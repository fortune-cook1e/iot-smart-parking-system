# predict_service.py
from fastapi import FastAPI
import pickle
import pandas as pd

# Load the pre-trained model
with open("parking_model.pkl", "rb") as f:
    model = pickle.load(f)

app = FastAPI()

@app.post("/predictions/occupancy")
def predict(data: dict):
    # transform data from Frontend to DataFrame
    df = pd.DataFrame([data])
    
    # output occupied probability
    prob = model.predict_proba(df)[0][1]
    
    return {"occupied_probability": float(prob)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3002)