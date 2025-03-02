FROM python:3.11

WORKDIR /backend

ENV PYTHONPATH=/backend/app

# Install system dependencies, including poppler
RUN apt-get update && apt-get install -y poppler-utils && rm -rf /var/lib/apt/lists/*

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .
# Ensure the temp folder exists
RUN mkdir -p /backend/app/temp && chmod 777 /backend/app/temp

# Expose the port Uvicorn runs on
EXPOSE 8000

# Run Uvicorn server
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]