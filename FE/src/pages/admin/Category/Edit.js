import { Button, Col, Form, Input, message, Modal, Radio, Row } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useState } from "react";
import { getCookie } from "../../../helpers/cookie";
import UploadFile from "../../../components/UploadFile";
import MyEditor from "../../../components/MyEditor";
import useCategories from "../../../hooks/admin/useCategories";
import { useEffect } from "react";

function CategoriesEdit(props) {
  const { record } = props;
  const token = getCookie("token");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form] = Form.useForm();

  const { updateCategory } = useCategories({
    token,
  });

  // radio status
  const [valueRadio, setValueRadio] = useState(record.status === "active" ? "active" : "inactive");
  const [imageUrl, setImageUrl] = useState(record.thumbnail);
  const onChange = (e) => {
    setValueRadio(e.target.value);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchApi = async () => {
      if (!token) {
        message.error("Token không tồn tại, vui lòng đăng nhập!");
        return;
      }
    };

    fetchApi();
  }, [token, imageUrl]);

  const onFinish = async (e) => {
    e.status = e.status ? "active" : "inactive";
    e.parent_id = !e.parent_id ? "" : e.parent_id;
    e.description = !e.description ? "" : e.description;
    e.position = !e.position ? "" : Number(e.position);
    e.thumbnail = imageUrl ? imageUrl : "";
    e.status = valueRadio;
    updateCategory.mutate({ id: record._id, data: e }, {
      onSuccess: (response) => {
        if (response?.code === 200) {
          handleCancel();
        }
      }
    });
  };


  return (
    <>
      <Button icon={<EditOutlined />} type="primary" ghost onClick={showModal} />
      <Modal
        title="Chỉnh sửa"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        width={"70%"}
      >
        <Form onFinish={onFinish} layout="vertical" form={form} initialValues={record}>
          <Row>
            <Col span={24}>
              <Form.Item label="Tiêu đề" name="title"
                rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item label="Vị trí" name="position" >
                <Input
                  allowClear
                  type="number"
                  placeholder="Tự tăng"
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Ảnh nhỏ" name="thumbnail">
                <UploadFile onImageUrlsChange={setImageUrl} initialImageUrls={imageUrl} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Mô tả" name="description">
                <MyEditor />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Trạng thái" name="status">
                <Radio.Group onChange={onChange} value={valueRadio}>
                  <Radio value="active">Bật</Radio>
                  <Radio value="inactive">Tắt</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="btn">
                <Button type="primary" htmlType="submit">
                  Cập nhập
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
}

export default CategoriesEdit;
