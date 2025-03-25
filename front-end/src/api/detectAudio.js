import axios from "axios";

export const analyzeAudio = async (audioBlob) => {
  const formData = new FormData();
  formData.append("file", audioBlob, "audio.wav");

  return axios.post(
    "https://doomsday37-deep-fake-voice-detection-api.hf.space/predict/",
    formData
  );
};
