# Dockerfile for api_service
FROM python:3.9-slim

WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend code
COPY . /app/backend

# Expose the port the app runs on
EXPOSE 8001

# Run the application
CMD ["uvicorn", "backend.api_service.main:app", "--host", "0.0.0.0", "--port", "8001"]