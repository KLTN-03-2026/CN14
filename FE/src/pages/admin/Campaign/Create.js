import { Button, Card, Col, Form, Input, Row, Switch, message, Select, DatePicker } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie } from "../../../helpers/cookie";
import NoRole from "../../../components/NoRole";
import UploadFile from "../../../components/UploadFile";
import UploadFiles from "../../../components/UploadFiles";
import useCampaigns from "../../../hooks/admin/useCampaigns";
import { useMemo } from "react";
import { useCallback } from "react";
import { listMaterial } from "../../../services/admin/campainServices";
import dayjs from "dayjs";

function CampaignCreate() {
  const permissions = useMemo(() => JSON.parse(localStorage.getItem("permissions")) || [], []);
  const navigate = useNavigate();
  const token = getCookie("token");

  // upload img
  const [imagesUrl, setImagesUrl] = useState([]);
  const [thumbnail, setThumbnail] = useState("");

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);

  const { createCampain } = useCampaigns({ token: token });

  const fetchApi = useCallback(async () => {
    try {
      const response = await listMaterial(token); // Truyền token vào hàm
      if (response.code === 200) {
        setCategories(response.data.categories);
        setBrands(response.data.brands);
        setProducts(response.data.products);
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
    e.images = imagesUrl ? imagesUrl : [];
    e.thumbnail = thumbnail ? thumbnail : "";
    e.status = e.status ? "active" : "inactive";
    e.position = !e.position ? "" : Number(e.position);

    createCampain.mutate(e, {
      onSuccess: (response) => {
        if (response?.code === 200) {
          navigate("/admin/campaigns");
        }
      }
    });
  }
  // end xử lý submit

  if (!permissions.includes("campaigns_create")) return <NoRole />;

  return (
    <>
      <Card title="Thêm mới chiến dịch">
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

              <Col span={24}>
                <Form.Item label="Thương hiệu" name="brands_id"
                  rules={[{ required: true, message: "Chọn danh sách thương hiệu" }]}>
                  <Select
                    mode="multiple"
                    style={{ width: '100%' }}
                    placeholder="Chọn danh sách thương hiệu"
                    options={brands.map(opt => ({ value: opt._id, label: opt.title }))}
                  />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item label="Danh mục" name="categories_id"
                  rules={[{ required: true, message: "Chọn danh sách danh mục" }]}>
                  <Select
                    mode="multiple"
                    style={{ width: '100%' }}
                    placeholder="Chọn danh sách danh mục"
                    options={categories.map(opt => ({ value: opt._id, label: opt.title }))}
                  />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item label="Sản phẩm" name="products_id"
                  rules={[{ required: true, message: "Chọn danh sách sản phẩm" }]}>
                  <Select
                    mode="multiple"
                    style={{ width: '100%' }}
                    placeholder="Chọn danh sách sản phẩm"
                    options={products.map(opt => ({ value: opt._id, label: opt.title }))}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Ngày bắt đầu"
                  name="start_date"
                  rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu!' }]}
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    disabledDate={(current) => current && current < dayjs().startOf('day')}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Ngày kết thúc"
                  name="end_date"
                  dependencies={['start_date']}
                  rules={[
                    { required: true, message: 'Vui lòng chọn ngày kết thúc!' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        const startDate = getFieldValue('start_date');
                        if (!value || !startDate || value.isAfter(startDate)) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Ngày kết thúc phải sau ngày bắt đầu!'));
                      },
                    }),
                  ]}
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    disabledDate={(current) => current && current < dayjs().startOf('day')}
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

              <Col span={24}>
                <Form.Item label="Ảnh nhỏ" name="thumbnail">
                  <UploadFile onImageUrlsChange={setThumbnail} />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item label="Ảnh chi tiết" name="images">
                  <UploadFiles onImageUrlsChange={setImagesUrl} />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item label="Trích đoạn" name="excerpt"
                  rules={[{ required: true, message: "Nhập trích đoạn" }]}>
                  <TextArea></TextArea>
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

export default CampaignCreate;