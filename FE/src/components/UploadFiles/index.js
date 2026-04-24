import { useState, useEffect } from "react";
import { Upload, Input, message, Progress } from "antd";
import { PlusOutlined } from "@ant-design/icons";

function UploadFiles(props) {
  const [fileList, setFileList] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  const fakeProgress = setInterval(() => {
    setProgress((prev) => {
      if (prev >= 90) return prev;
      return prev + 10;
    });
  }, 200);

  // Đồng bộ lại ảnh ban đầu nếu props thay đổi (dùng cho EDIT)
  useEffect(() => {
    if (props.initialImageUrls && props.initialImageUrls.length > 0) {
      const formatted = props.initialImageUrls.map((url, index) => ({
        uid: `init-${index}`,
        name: `image-${index}.jpg`,
        status: "done",
        url,
      }));
      setFileList(formatted);
      setImageUrls(props.initialImageUrls);
    }
  }, [props.initialImageUrls]);

  // 📤 Upload ảnh mới lên Cloudinary
  const handleUpload = async (options) => {
    const { file, onSuccess, onError } = options;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "my_preset");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/djckm3ust/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      setLoading(true);
      setProgress(10);

      clearInterval(fakeProgress);
      setProgress(100);

      if (data.secure_url) {
        const newUrl = data.secure_url;

        const newFile = {
          uid: `${Date.now()}`,
          name: file.name,
          status: "done",
          url: newUrl,
        };

        setFileList((prev) => [...prev, newFile]);
        setImageUrls((prev) => [...prev, data.secure_url]);
        props.onImageUrlsChange?.((prev) => [...prev, data.secure_url]);
        onSuccess(data, file);
      } else {
        throw new Error("Không nhận được secure_url");
      }
    } catch (err) {
      console.error("Upload error:", err);
      message.error("Tải ảnh thất bại");
      onError(err);
    }
  };

  // 🗑️ Xóa ảnh
  const handleRemove = (file) => {
    const removedUrl = file.url;

    setImageUrls((prev) => {
      const updated = prev.filter((url) => url !== removedUrl);
      props.onImageUrlsChange?.(updated);
      return updated;
    });

    setFileList((prev) => prev.filter((f) => f.url !== removedUrl));
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
        multiple
        customRequest={handleUpload}
        fileList={fileList}
        onRemove={handleRemove}
        showUploadList={{ showRemoveIcon: true }}
      >
        <div>
          <PlusOutlined />
          <div style={{ marginTop: 8 }}>Upload</div>
        </div>
      </Upload>

      {imageUrls.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <p>Danh sách link ảnh (JSON):</p>
          <Input.TextArea
            value={JSON.stringify(imageUrls, null, 2)}
            readOnly
            autoSize={{ minRows: 3 }}
          />
        </div>
      )}
    </div>
  );
}

export default UploadFiles;
