import { Button, Card, Col, Form, Input, message, Radio, Row, Select, Upload } from "antd";
import { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { getCookie } from "../../../helpers/cookie";
import { listRoleGet } from "../../../services/admin/rolesServies";
import { addAccountPost } from "../../../services/admin/accountServies";
import { useNavigate } from "react-router-dom";
import NoRole from "../../../components/NoRole";

function AccountCreate() {
  const permissions = JSON.parse(localStorage.getItem('permissions'));

  const navigate = useNavigate();
  const token = getCookie("token");

  const [roles, setRoles] = useState([]);

  // upload img
  const [imageUrl, setImageUrl] = useState("");
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    const fetchApi = async () => {
      if (!token) {
        message.error("Token không tồn tại, vui lòng đăng nhập!");
        return;
      }

      try {
        const response = await listRoleGet(token);
        if (response.code === 200) {
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

  const onFinish = async (e) => {
    e.avatar = imageUrl ? imageUrl : "";
    e.role_id = !e.role_id ? "" : e.role_id;
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
      const response = await addAccountPost(e, token);

      if (response.code === 200) {
        message.success(response.message)
        navigate("/admin/accounts")
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
  }

  return (
    <>
      {permissions.includes("accounts_create") ?
        <Card title="Thêm mới tài khoản nhân viên">
          <Card
            style={{
              marginTop: 10,
              width: "100%"
            }}
            type="inner"
          >
            <Form onFinish={onFinish} layout="vertical">
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
                    <Select options={options} placeholder="Chọn quyền" />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Email" name="email">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Password" name="password"
                    rules={[{ required: true, message: 'Nhập password!' }]}>
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
                    <div>
                      <Upload
                        name="file"
                        listType="picture-card"
                        showUploadList={{ showPreviewIcon: false }}
                        maxCount={1} // Giới hạn chỉ được chọn 1 ảnh
                        customRequest={async ({ file, onSuccess, onError }) => {
                          const formData = new FormData();
                          formData.append("file", file);
                          formData.append("upload_preset", "my_preset"); // Thay bằng preset của bạn

                          try {
                            const response = await fetch(
                              `https://api.cloudinary.com/v1_1/djckm3ust/image/upload`,
                              {
                                method: "POST",
                                body: formData,
                              }
                            );
                            const data = await response.json();

                            if (data.secure_url) {
                              setImageUrl(data.secure_url); // Lưu đường dẫn ảnh
                              setFileList([
                                {
                                  uid: data.asset_id,
                                  name: data.original_filename,
                                  status: "done",
                                  url: data.secure_url,
                                },
                              ]);
                              onSuccess(data);
                            }
                          } catch (error) {
                            console.error("Lỗi khi upload ảnh:", error);
                            onError(error);
                          }
                        }}
                        onChange={({ fileList: newFileList }) => setFileList(newFileList)}
                        onRemove={() => {
                          setImageUrl(""); // Xóa link ảnh
                          setFileList([]); // Xóa danh sách file
                        }}
                      >
                        {fileList.length >= 1 ? null : (
                          <div>
                            <PlusOutlined />
                            <div style={{ marginTop: 8 }}>Upload</div>
                          </div>
                        )}
                      </Upload>
                      {imageUrl && (
                        <div style={{ marginTop: "10px" }}>
                          <p>Link ảnh:</p>
                          <Input value={imageUrl} readOnly />
                        </div>
                      )}
                    </div>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Trạng thái" name="status" initialValue={"active"}>
                    <Radio.Group>
                      <Radio value="active">Bật</Radio>
                      <Radio value="inactive">Tắt</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Tạo
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </Card>
        :
        <NoRole />
      }
    </>
  )
}

export default AccountCreate;
