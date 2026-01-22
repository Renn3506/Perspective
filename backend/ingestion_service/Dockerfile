# Use an official Python runtime as a parent image
# Users can change this to a different Python version or base image if preferred.
FROM python:3.12.10-slim

# Prevent Python from buffering stdout/stderr
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install build dependencies for compiling C extensions (e.g., hdbscan)
# Then install Python packages, then remove build deps to keep image small
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    g++ \
    make \
    && rm -rf /var/lib/apt/lists/*

# Copy only requirements first (better caching)
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt && \
    apt-get purge -y gcc g++ make && \
    apt-get autoremove -y && \
    rm -rf /var/lib/apt/lists/*

# Copy application code
COPY common/ /app/common/
COPY ingestion_service/ /app/ingestion_service/

# Optional: create non-root user
RUN useradd -m appuser
USER appuser

# Explicit entrypoint
CMD ["python", "-m", "ingestion_service.run"]
