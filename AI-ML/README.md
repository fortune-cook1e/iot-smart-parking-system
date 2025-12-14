## Getting Started

```bash
# Create a new environment (optional)
conda create -n parking_ml python=3.11

# Activate the environment
conda activate parking_ml

# Install Dependencies
conda install pandas scikit-learn numpy

# use conda-forge channel
conda install -c conda-forge fastapi uvicorn

uvicorn --version

# Start the service
uvicorn predict_service:app --reload --port 9000

# Training
python training.py
```
