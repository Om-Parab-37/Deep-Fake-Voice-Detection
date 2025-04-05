import { Card, Typography, Tag } from "antd";
import { motion } from "framer-motion";

const { Title, Text } = Typography;

const ResultsDisplay = ({ result }) => {
  const isSpoof = result.prediction?.toLowerCase() === "spoof";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card
        style={{
          width: 300,
          textAlign: "center",
          border: `2px solid ${isSpoof ? "#ff4d4f" : "#52c41a"}`,
          background: isSpoof ? "#fff1f0" : "#f6ffed",
          borderRadius: "12px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Title level={4} style={{ color: isSpoof ? "#ff4d4f" : "#52c41a" }}>
          {isSpoof ? "⚠️ Spoof Detected!" : "✅ Bonafide Audio"}
        </Title>
        <Text strong style={{ fontSize: 16 }}>
          Confidence:{" "}
          <Tag
            color={isSpoof ? "red" : "green"}
            style={{ fontSize: 16, padding: "5px 10px" }}
          >
            {100 * result.probability.toFixed(2)}%
          </Tag>
        </Text>
      </Card>
    </motion.div>
  );
};

export default ResultsDisplay;
