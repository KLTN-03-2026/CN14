import { Button, Card, Col, Form, Input, message, Row, Switch } from "antd";
import { useEffect, useState } from "react";
import { getCookie } from "../../../helpers/cookie";
import { useNavigate } from "react-router-dom";
import NoRole from "../../../components/NoRole";
import UploadFile from "../../../components/UploadFile";
import MyEditor from "../../../components/MyEditor";
import useCategories from "../../../hooks/admin/useCategories";

function CategoriesCreate() {
  const permissions = JSON.parse(localStorage.getItem('permissions'));

  const token = getCookie("token"); // Lấy token từ cookie
  const navigate = useNavigate();
  // upload img
  const [imageUrls, setImageUrls] = useState("");

  const { createCategory } = useCategories({ token: token });

  useEffect(() => {
    const fetchApi = async () => {
      if (!token) {
        message.error("Token không tồn tại, vui lòng đăng nhập!");
        return;
      }
    };

    fetchApi();
  }, [token, imageUrls]); // Thêm token vào dependency để đảm bảo cập nhật khi token thay đổi

  // xử lý submit
  const onFinish = async (e) => {
    e.status = e.status ? "active" : "inactive";
    e.description = !e.description ? "" : e.description;
    e.position = !e.position ? "" : Number(e.position);
    e.thumbnail = imageUrls ? imageUrls : "";

    createCategory.mutate(e, {
      onSuccess: (response) => {
        if (response?.code === 200) {
          navigate("/admin/product-category");
        }
      }
    });
  }
  // xử lý submit

  
  return (
    <>
      {permissions.includes("products_category_create") ?
        <Card title="Thêm mới danh mục">
          <Card
            style={{
              marginTop: 10,
              width: "100%"
            }}
            type="inner"
          >
            <Form onFinish={onFinish} layout="vertical">
              <Row gutter={[12, 12]}>
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
                    <UploadFile onImageUrlsChange={setImageUrls} />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Mô tả" name="description" >
                    <MyEditor />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Tắt hoạt động / Hoạt động " name="status">
                    <Switch />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">Thêm</Button>
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

export default CategoriesCreate;