import { useEffect, useRef } from "react";
import { Card } from "antd";

const AudioPlayer = ({ audioUrl }) => {
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
    }
  }, [audioUrl]);

  return (
    <Card>
      <audio ref={audioRef} controls>
        <source src={audioUrl} type="audio/wav" />
      </audio>
    </Card>
  );
};

export default AudioPlayer;
