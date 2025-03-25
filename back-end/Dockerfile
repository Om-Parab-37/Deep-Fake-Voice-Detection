# Use a base Python image
FROM python:3.9

# Install system dependencies (including FFmpeg)
RUN apt-get update && apt-get install -y ffmpeg

# Set working directory
WORKDIR /app

# Copy project files
COPY . /app

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose the default FastAPI port
EXPOSE 7860

# Run the app
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "7860"]
