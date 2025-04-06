import { Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const AudioUploader = ({ onUpload }) => {
  const props = {
    beforeUpload: (file) => {
      onUpload(file);
      return false;
    },
    accept: "audio/*",
    maxCount: 1,
  };

  return (
    <Upload {...props}>
      <Button size="large" icon={<UploadOutlined />}>Upload Audio</Button>
    </Upload>
  );
};

export default AudioUploader;
