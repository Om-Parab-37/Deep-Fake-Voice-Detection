from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from pydub import AudioSegment
import librosa
import numpy as np
import io
import tensorflow as tf
import os

# Ensure ffmpeg is available
AudioSegment.converter = "ffmpeg"
AudioSegment.ffmpeg = "ffmpeg"
AudioSegment.ffprobe = "ffprobe"
os.environ["NUMBA_CACHE_DIR"] = "/tmp/numba_cache"

# Constants
SAMPLE_RATE = 22050  
DURATION = 5  
N_MELS = 128
MAX_TIME_STEPS = 109  
CLASS_LABELS = ["spoof", "bonafide"]  

# Load pre-trained model
MODEL_PATH = "audio_classifier_CNN.h5"  # Update with your actual model path
model = tf.keras.models.load_model(MODEL_PATH)

# FastAPI app
app = FastAPI()

def convert_to_flac(audio_bytes: bytes) -> io.BytesIO:
    """Convert any audio format to FLAC in memory."""
    audio_buffer = io.BytesIO(audio_bytes)
    
    try:
        audio = AudioSegment.from_file(audio_buffer)  # Auto-detect format
    except Exception:
        raise ValueError("Unsupported audio format or corrupted file.")

    flac_buffer = io.BytesIO()
    audio.export(flac_buffer, format="flac")
    flac_buffer.seek(0)  # Reset buffer pointer

    return flac_buffer

def predict(audio_bytes: bytes):
    """Preprocess audio, extract features, and return predicted class with probability."""

    # Convert to FLAC
    flac_buffer = convert_to_flac(audio_bytes)

    # Load audio file with librosa
    audio, _ = librosa.load(flac_buffer, sr=SAMPLE_RATE, duration=DURATION, mono=True)

    # Extract Mel spectrogram
    mel_spectrogram = librosa.feature.melspectrogram(y=audio, sr=SAMPLE_RATE, n_mels=N_MELS)
    mel_spectrogram = librosa.power_to_db(mel_spectrogram, ref=np.max)

    # Ensure consistent shape for model input
    if mel_spectrogram.shape[1] < MAX_TIME_STEPS:
        mel_spectrogram = np.pad(mel_spectrogram, ((0, 0), (0, MAX_TIME_STEPS - mel_spectrogram.shape[1])), mode='constant')
    else:
        mel_spectrogram = mel_spectrogram[:, :MAX_TIME_STEPS]

    # Prepare input for model
    X = np.array([mel_spectrogram])

    # Make prediction
    prediction = model.predict(X)[0]  # Extract first (and only) prediction

    # Get predicted class and probability
    predicted_index = np.argmax(prediction)
    predicted_label = CLASS_LABELS[predicted_index]
    probability = float(prediction[predicted_index])  # Convert to Python float

    return predicted_label, probability * 100

@app.post("/predict/")
async def upload_audio(file: UploadFile = File(...)):
    """Accept an audio file, process it, and return the predicted class with probability."""

    try:
        # Read file into memory
        audio_bytes = await file.read()

        predicted_label, probability = predict(audio_bytes)

        return JSONResponse(content={"prediction": predicted_label, "probability": probability})

    except ValueError as ve:
        return JSONResponse(content={"error": str(ve)}, status_code=400)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
