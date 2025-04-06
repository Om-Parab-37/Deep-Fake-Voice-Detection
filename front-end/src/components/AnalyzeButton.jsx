import { Button, message, Spin } from "antd";
import { useMutation } from "@tanstack/react-query";
import { analyzeAudio } from "../api/detectAudio";

const AnalyzeButton = ({ audioBlob, onResult, result }) => {
  const { mutate, isPending, isError } = useMutation({
    mutationFn: analyzeAudio,
    onSuccess: (data) => {
      onResult(data.data);
      message.success("Analysis complete!");
    },
    onError: () => {
      message.error("Error analyzing the audio.");
    },
  });

  const handleAnalyze = () => {
    if (result) {
      onResult(null);
      return;
    }
    if (!audioBlob) {
      message.error("Please upload or record an audio file first.");
      return;
    }

    mutate(audioBlob);
  };

  return (
    <div>
      <Button size="large" type="primary" onClick={handleAnalyze} disabled={isPending}>
        {isPending ? (
          <Spin size="small" />
        ) : result ? (
          " Upload Another Audio"
        ) : (
          "Analyze"
        )}
      </Button>
      {isError && <p style={{ color: "red" }}>Failed to analyze audio</p>}
    </div>
  );
};

export default AnalyzeButton;
