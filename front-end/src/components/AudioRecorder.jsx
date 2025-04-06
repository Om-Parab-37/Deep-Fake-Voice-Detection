import { useState, useRef } from "react";
import { Button } from "antd";
import {
  AudioOutlined,
  StopOutlined,
  LoadingOutlined,
  PauseCircleOutlined,
  XFilled,
} from "@ant-design/icons";

const AudioRecorder = ({ onRecord }) => {
  const [recording, setRecording] = useState(false);
  const [time, setTime] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);
  const timerRef = useRef(null); // Timer reference

  const startRecording = async () => {
    try {
      // Check if microphone access is allowed
      const permission = await navigator.permissions.query({
        name: "microphone",
      });

      if (permission.state === "denied") {
        alert(
          "Microphone access is blocked. Please allow it in browser settings."
        );
        return;
      }

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Initialize MediaRecorder
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunks.current = []; // Reset audio chunks

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        if (audioChunks.current.length > 0) {
          const audioBlob = new Blob(audioChunks.current, {
            type: "audio/wav",
          });
          onRecord(audioBlob);
        }
        audioChunks.current = [];

        // Stop all tracks in stream to release microphone
        stream.getTracks().forEach((track) => track.stop());
      };

      // Start recording
      mediaRecorderRef.current.start();
      setRecording(true);
      setTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Microphone access failed. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }

    setRecording(false);

    // Stop Timer
    clearInterval(timerRef.current);
  };

  // Format time to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <Button
    size="large"
      onClick={recording ? stopRecording : startRecording}
      type="primary"
      danger={recording} // Changes to red while recording
    >
      {recording ? (
        <>
          <XFilled />
          {` Recording... ${formatTime(time)}`}
        </>
      ) : (
        <>
          <AudioOutlined />
          {" Start Recording"}
        </>
      )}
    </Button>
  );
};

export default AudioRecorder;
