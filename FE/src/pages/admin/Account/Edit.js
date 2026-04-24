import { Button, Col, Form, Input, message, Modal, Radio, Row, Select, Upload } from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { getCookie } from "../../../helpers/cookie";
import { listRoleGet } from "../../../services/admin/rolesServies";
import { editAccountPatch } from "../../../services/admin/accountServies";
import UploadFile from "../../../components/UploadFile";

function AccountEdit(props) {

  const { record, onReload } = props;
  const token = getCookie("token");

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Danh sách quyền
  const [roles, setRoles] = useState([]);

  const [form] = Form.useForm();

  // radio
  const [valueRadio, setValueRadio] = useState(record.status === "active" ? "active" : "inactive");

  const onChange = (e) => {
    setValueRadio(e.target.value);
  };

  // upload img
  const [avatar, setAvatar] = useState(record.avatar);
  // upload img

  useEffect(() => {
    const fetchApi = async () => {
      if (!token) {
        message.error("Token không tồn tại, vui lòng đăng nhập!");
        return;
      }

      try {
        const response = await listRoleGet(token);

        if (response) {
          setRoles(response.roles);
        }
      } catch (error) {
        message.error("Lỗi khi tải danh sách quyền:", error.message);
      }
    };

    fetchApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Tạo options cho Select 
  const options = roles.map((category) => ({
    label: category.title, // Hiển thị title trong Select
    value: category._id,   // Giá trị _id khi submit
  }));

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // xử lý edit
  const onFinish = async (e) => {
    e.avatar = avatar ? setAvatar : "";

    if (e.password === undefined) {
      delete e.password;
    }

    // Kiểm tra số điện thoại
    if (!e.phone) {
      e.phone = "";
    } else {
      // Kiểm tra xem số điện thoại có phải là một chuỗi gồm toàn số và có độ dài 10 không
      const phoneRegex = /^[0-9]{10}$/;

      if (!phoneRegex.test(e.phone)) {
        message.error("Số điện thoại phải là 10 chữ số và không chứa ký tự!");
        return;
      }
    }

    try {
      const response = await editAccountPatch(record._id, e, token);

      if (response.code === 200) {
        message.success("Cập nhật thành công");
        handleCancel();
        onReload();
      } else {
        if (Array.isArray(response.message)) {
          const allErrors = response.message.map(err => err.message).join("\n");
          message.error(allErrors);
        } else {
          message.error(response.message);
        }
      }
    } catch (error) {
      message.error(error.message);
    }
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
              <Form.Item label="Họ tên" name="fullName"
                rules={[{ required: true, message: 'Nhập tên!' }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Phân quyền" name="role_id"
                rules={[{ required: true, message: 'Chọn quyền!' }]}>
                <Select options={options} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Email" name="email"
                rules={[{ required: true, message: 'Nhập email!' }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Password" name="password">
                <Input type="password" placeholder="Nhập mật khẩu mới nếu muốn thay đổi" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Số điện thoại" name="phone">
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Ảnh đại diện" name="avatar">
                <UploadFile onImageUrlsChange={setAvatar} initialImageUrls={avatar} />
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
              <Form.Item>
                <Button type="primary" htmlType="submit" name="btn">
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

export default AccountEdit;