import { useState } from "react";
import { Avatar, Card, Flex } from "antd";
import AudioUploader from "../components/AudioUploader";
import AudioRecorder from "../components/AudioRecorder";
import AudioPlayer from "../components/AudioPlayer";
import AnalyzeButton from "../components/AnalyzeButton";
import ResultsDisplay from "../components/ResultsDisplay";
import { motion } from "framer-motion";

const Home = () => {
  const [audio, setAudio] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [result, setResult] = useState(null);

  const handleUpload = (file) => {
    setAudio(file);
    setAudioUrl(URL.createObjectURL(file));
    setResult(null);
  };

  const handleRecord = (audioBlob) => {
    setAudio(audioBlob);
    setAudioUrl(URL.createObjectURL(audioBlob));
    setResult(null);
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Flex gap="middle" align="center" justify="center">
          <Avatar size={64} src="/audio-waves.png" />
          <h2 style={{ textAlign: "center", color: "#694cc8" }}>True Voice</h2>
        </Flex>

        <Card
          style={{
            maxWidth: "370px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)", // Soft shadow
            borderRadius: "12px", // Optional rounded corners
          }}
          title={
            <>
              <Flex align="center" vertical>
                Deep Fake Voice Detector
              </Flex>
            </>
          }
        >
          <Flex gap="middle" align="center" vertical>
            {!result && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <Flex gap="middle" align="center" vertical>
                  <AudioUploader onUpload={handleUpload} />
                  <AudioRecorder
                    onRecord={handleRecord}
                    setAudioUrl={setAudioUrl}
                  />
                  {audioUrl && (
                    <AudioPlayer
                      style={{ boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)" }}
                      audioUrl={audioUrl}
                    />
                  )}
                </Flex>
              </motion.div>
            )}

            <Flex gap="middle" align="center" vertical>
              {audio && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <AnalyzeButton
                    audioBlob={audio}
                    onResult={setResult}
                    result={result}
                  />
                </motion.div>
              )}
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <ResultsDisplay result={result} />
                </motion.div>
              )}
            </Flex>
          </Flex>
        </Card>
      </motion.div>
    </div>
  );
};

export default Home;
