import { Button, Card, Col, Form, Input, Row, Switch, Radio, message, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie } from "../../../helpers/cookie";
import NoRole from "../../../components/NoRole";
import { listAllCategory } from "../../../services/admin/categoryServies";
import MyEditor from "../../../components/MyEditor";
import UploadFile from "../../../components/UploadFile";
import useArticles from "../../../hooks/admin/useArticles";
import { useMemo } from "react";
import { useCallback } from "react";

function ArticleCreate() {
  const permissions = useMemo(() => JSON.parse(localStorage.getItem("permissions")) || [], []);
  const navigate = useNavigate();
  const token = getCookie("token"); // Lấy token từ cookie

  // upload img
  const [imageUrl, setImageUrl] = useState("");
  const [categories, setCategories] = useState([]);

  const { createArticle } = useArticles({ token: token });

  const fetchApi = useCallback(async () => {
    try {
      const response = await listAllCategory(token); // Truyền token vào hàm
      if (response) {
        setCategories(response.data);
      }
    } catch (error) {
      message.error("Lỗi khi tải danh mục:", error.message);
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      message.error("Token không tồn tại, vui lòng đăng nhập!");
      return;
    }

    fetchApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchApi, token]);

  // xử lý submit
  const onFinish = async (e) => {
    e.thumbnail = imageUrl ? imageUrl : "";
    e.status = e.status ? "active" : "inactive";
    e.featured = e.featured === 0 ? "0" : "1";
    e.position = !e.position ? "" : Number(e.position);

    createArticle.mutate(e, {
      onSuccess: (response) => {
        if (response?.code === 200) {
          navigate("/admin/articles");
        }
      }
    });
  }
  // end xử lý submit

  // options cho Select
  const optionsCategories = categories.map((category) => ({
    label: category.title, // Hiển thị title trong Select
    value: category._id,   // Giá trị _id khi submit
  }));
  // end options cho Select

  if (!permissions.includes("articles_create")) return <NoRole />;

  return (
    <>
      <Card title="Thêm mới bài viết">
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
                  rules={[{ required: true, message: "Nhập tiêu đề" }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item label="Danh mục" name="categories" rules={[{ required: true, message: "Chọn danh mục" }]}>
                  <Select
                    mode="multiple"
                    style={{ width: '100%' }}
                    placeholder="select multiple tags"
                    options={optionsCategories}
                  />
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
              <Col span={5}>
                <Form.Item label="Nổi bật?" name="featured" initialValue={1} style={{ marginLeft: "10px" }}>
                  <Radio.Group>
                    <Radio value={1}>Nổi bật</Radio>
                    <Radio value={0}>Không nổi bật</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="Ảnh nhỏ" name="thumbnail">
                  <UploadFile onImageUrlsChange={setImageUrl} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="Tác giả" name="author" rules={[{ required: true, message: "Nhập tác giả" }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="Trích đoạn" name="excerpt" rules={[{ required: true, message: "Nhập trích đoạn" }]}>
                  <TextArea></TextArea>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="Nội dung" name="description" rules={[{ required: true, message: "Nhập nội dung" }]}>
                  <MyEditor />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="Tắt hoạt động / Hoạt động" name="status">
                  <Switch />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Button type="primary" htmlType="submit">Thêm</Button>
              </Col>
            </Row>
          </Form>
        </Card>
      </Card>
    </>
  )
}

export default ArticleCreate;