import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Switch,
  Radio,
  message,
  Spin,
  DatePicker,
} from "antd";
import { useEffect, useState, useMemo, useCallback } from "react";
import { listAllCategory } from "../../../services/admin/categoryServies";
import { getCookie } from "../../../helpers/cookie";
import NoRole from "../../../components/NoRole";
import UploadFiles from "../../../components/UploadFiles";
import UploadFile from "../../../components/UploadFile";
import { useNavigate } from "react-router-dom";
import useProducts from "../../../hooks/admin/useProducts";
import MyEditor from "../../../components/MyEditor";
import { listAllAuthors } from "../../../services/admin/authorServices";
import { listAllPublisher } from "../../../services/admin/publisherServices";

function ProductsCreate() {
  const permissions = useMemo(
    () => JSON.parse(localStorage.getItem("permissions")) || [],
    []
  );

  const token = getCookie("token");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [thumbnail, setThumbnail] = useState("");

  const { createProduct } = useProducts({ token });

  /** Gọi API lấy danh mục + thương hiệu */
  const fetchApi = useCallback(async () => {
    try {
      const [catRes, authorRes, publisherRes] = await Promise.all([
        listAllCategory(token),
        listAllAuthors(token),
        listAllPublisher(token),
      ]);
      if (catRes?.data) setCategories(catRes.data);
      if (authorRes?.data) setAuthors(authorRes.data);
      if (publisherRes?.data) setPublishers(publisherRes.data);
    } catch (error) {
      message.error(`Lỗi khi tải dữ liệu: ${error.message}`);
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      message.error("Token không tồn tại, vui lòng đăng nhập!");
      return;
    }
    fetchApi();
  }, [token, fetchApi]);

  /** Xử lý khi submit */
  const onFinish = async (values) => {
    const data = {
      ...values,
      thumbnail: thumbnail || "",
      images: imageUrls || [],
      status: values.status ? "active" : "inactive",
      featured: values.featured === 0 ? "0" : "1",
      price: Number(values.price),
      pageCount: Number(values.pageCount),
      stock: Number(values.stock),
      discountPercentage: Number(values.discountPercentage),
      position: values.position ? Number(values.position) : "",
      categories: values.categories || [],
      description: values.description || "",
    };

    setLoading(true);
    try {
      createProduct.mutate(data, {
        onSuccess: (res) => {
          if (res?.code === 200) {
            navigate("/admin/products");
          }
        },
        onError: (err) => {
          message.error(`Lỗi khi thêm sản phẩm: ${err.message}`);
        },
      });
    } finally {
      setLoading(false);
    }
  };

  /** Memo hóa options tránh re-render */
  const options = useMemo(
    () =>
      categories.map((c) => ({
        label: c.title,
        value: c._id,
      })),
    [categories]
  );

  const optionsPublisher = useMemo(
    () =>
      publishers.map((p) => ({
        label: p.name,
        value: p._id,
      })),
    [publishers]
  );

  const optionsAuthor = useMemo(
    () =>
      authors.map((a) => ({
        label: a.fullName,
        value: a._id,
      })),
    [authors]
  );

  if (!permissions.includes("products_create")) return <NoRole />;

  return (
    <Card title="Thêm mới sản phẩm">
      <Spin spinning={loading} tip="Đang xử lý...">
        <Card style={{ marginTop: 10, width: "100%" }} type="inner">
          <Form
            onFinish={onFinish}
            layout="vertical"
            initialValues={{
              discountPercentage: 0,
              featured: 1,
              sex: 0,
              status: true,
              sizeStock: [{ size: "", quantity: 0 }],
            }}
          >
            <Row gutter={[12, 12]}>
              <Col span={24}>
                <Form.Item
                  label="Tiêu đề"
                  name="title"
                  rules={[
                    { required: true, message: "Vui lòng nhập tiêu đề!" },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  label="Giới thiệu ngắn"
                  name="excerpt"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập giới thiệu ngắn!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  label="Thể loại"

                  name="categories"
                  rules={[
                    { required: true, message: "Vui lòng chọn thể loại!" },
                  ]}
                >
                  <Select mode="multiple"
                    options={options}
                    placeholder="Chọn thể loại"
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  label="Tác giả"
                  name="author_id"
                  rules={[
                    { required: true, message: "Vui lòng chọn tác giả!" },
                  ]}
                >
                  <Select
                    options={optionsAuthor}
                    placeholder="Chọn tác giả"
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  label="Nhà xuất bản"
                  name="publisher_id"
                  rules={[
                    { required: true, message: "Vui lòng chọn nhà xuất bản!" },
                  ]}
                >
                  <Select
                    options={optionsPublisher}
                    placeholder="Chọn nhà xuất bản"
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  label="Ngày xuất bản"
                  name="publishDate"
                  rules={[{ required: true, message: 'Vui lòng chọn ngày xuất bản!' }]}
                >
                  <DatePicker
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  label="Tổng số trang"
                  name="pageCount"
                  rules={[{ required: true, message: "Vui lòng nhập tổng số trang!" }]}
                >
                  <Input allowClear type="number" min={0} />
                </Form.Item>
              </Col>

              {/* SIZE */}
              <Col span={8}>
                <Form.Item
                  label="Số lượng"
                  name="stock"
                  rules={[{ required: true, message: "Vui lòng nhập số lượng!" }]}
                >
                  <Input allowClear type="number" min={0} />
                </Form.Item>
              </Col>

              <Col span={16}>
                <Form.Item
                  label="Giá"
                  name="price"
                  rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
                >
                  <Input allowClear type="number" min={0} />
                </Form.Item>
              </Col>

              <Col span={16}>
                <Form.Item
                  label="Phần trăm giảm giá"
                  name="discountPercentage"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập phần trăm giảm giá!",
                    },
                  ]}
                >
                  <Input allowClear type="number" max={100} min={0} />
                </Form.Item>
              </Col>

              <Col span={16}>
                <Form.Item label="Vị trí (Càng cao hiển thị trước)" name="position">
                  <Input
                    allowClear
                    type="number"
                    min={0}
                    placeholder="Tự tăng"
                  />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item label="Nổi bật?" name="featured">
                  <Radio.Group>
                    <Radio value={1}>Nổi bật</Radio>
                    <Radio value={0}>Không nổi bật</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>

              {/* HÌNH ẢNH */}
              <Col span={24}>
                <Form.Item label="Ảnh nhỏ" name="thumbnail">
                  <UploadFile onImageUrlsChange={setThumbnail} />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item label="Ảnh mô tả" name="images">
                  <UploadFiles onImageUrlsChange={setImageUrls} />
                </Form.Item>
              </Col>

              {/* TEXT EDITOR */}
              <Col span={24}>
                <Form.Item label="Mô tả" name="description">
                  <MyEditor />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item label="Tắt hoạt động / Hoạt động" name="status">
                  <Switch />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 border-none rounded-lg font-semibold text-lg"
                  >
                    Thêm sản phẩm
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </Spin>
    </Card>
  );
}

export default ProductsCreate;
