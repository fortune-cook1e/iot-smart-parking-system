# Python ML Service Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir \
  --default-timeout=100 \
  --retries 5 \
  -i https://mirrors.aliyun.com/pypi/simple/ \
  --trusted-host mirrors.aliyun.com \
  -r requirements.txt

# Copy application files
COPY service.py .
COPY parking_model.pkl .

# Expose port
EXPOSE 3002

# Run the application
CMD ["uvicorn", "service:app", "--host", "0.0.0.0", "--port", "3002"]
