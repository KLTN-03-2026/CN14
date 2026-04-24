
import { useState, useEffect } from "react";
import { Upload, Input, Progress } from "antd";
import { PlusOutlined } from "@ant-design/icons";

function UploadFile(props) {
  const [fileList, setFileList] = useState([]);
  const [imageUrls, setImageUrls] = useState("");
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  // Khi initialImageUrls thay đổi thì sync vào fileList
  useEffect(() => {
    if (props.initialImageUrls) {
      setImageUrls(props.initialImageUrls);
      setFileList([
        {
          uid: "-1",
          name: "existing-image",
          status: "done",
          url: props.initialImageUrls,
        },
      ]);
    }
  }, [props.initialImageUrls]);

  const fakeProgress = setInterval(() => {
    setProgress((prev) => {
      if (prev >= 90) return prev;
      return prev + 10;
    });
  }, 200);

  const handleUpload = async (options) => {
    const { file, onSuccess, onError } = options;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "my_preset");

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/djckm3ust/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await response.json();
      setLoading(true);
      setProgress(10);

      clearInterval(fakeProgress);
      setProgress(100);

      if (data.secure_url) {
        setImageUrls(data.secure_url);
        props.onImageUrlsChange?.(data.secure_url);

        const newFileList = [
          {
            uid: data.asset_id || Date.now().toString(),
            name: data.original_filename,
            status: "done",
            url: data.secure_url,
          },
        ];
        setFileList(newFileList);
        onSuccess(data);
      }
    } catch (error) {
      console.error("Lỗi khi upload ảnh:", error);
      onError(error);
    }
  };

  const handleRemove = () => {
    setImageUrls("");
    setFileList([]);
    props.onImageUrlsChange?.("");
  };

  return (
    <div>
      {loading && (
        <div style={{ marginTop: 10 }}>
          <Progress percent={progress} size="small" />
        </div>
      )}
      <Upload
        name="file"
        listType="picture-card"
        showUploadList={{ showPreviewIcon: false }}
        maxCount={1}
        customRequest={handleUpload}
        fileList={fileList} // ✅ dùng fileList thay vì defaultFileList
        onRemove={handleRemove}
      >
        {fileList.length >= 1 ? null : (
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>
        )}
      </Upload>
      {imageUrls && (
        <div style={{ marginTop: "10px" }}>
          <p>Link ảnh:</p>
          <Input value={imageUrls} readOnly />
        </div>
      )}
    </div>
  );
}

export default UploadFile;

