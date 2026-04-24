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
} from "antd";
import { useEffect, useState, useMemo, useCallback } from "react";
import { listAllCategory } from "../../../services/admin/categoryServies";
import { listAllBrand } from "../../../services/admin/brandServices";
import { getCookie } from "../../../helpers/cookie";
import NoRole from "../../../components/NoRole";
import UploadFiles from "../../../components/UploadFiles";
import UploadFile from "../../../components/UploadFile";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import useProducts from "../../../hooks/admin/useProducts";
import MyEditor from "../../../components/MyEditor";

function ProductsCreate() {
  const permissions = useMemo(
    () => JSON.parse(localStorage.getItem("permissions")) || [],
    []
  );

  const token = getCookie("token");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [thumbnail, setThumbnail] = useState("");

  const { createProduct } = useProducts({ token });

  /** Gọi API lấy danh mục + thương hiệu */
  const fetchApi = useCallback(async () => {
    try {
      const [catRes, brandRes] = await Promise.all([
        listAllCategory(token),
        listAllBrand(token),
      ]);
      if (catRes?.data) setCategories(catRes.data);
      if (brandRes?.data) setBrands(brandRes.data);
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
      discountPercentage: Number(values.discountPercentage),
      position: values.position ? Number(values.position) : "",
      product_category_id: values.product_category_id || "",
      description: values.description || "",
      additionalInformation: values.additionalInformation || "",
      productSizeChart: values.productSizeChart || "",
      outfitSuggestions: values.outfitSuggestions || "",
      sizeStock: (values.sizeStock || [])
        .filter((v) => v.size && v.quantity > 0)
        .map((v) => `${v.size}-${v.quantity}`),
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

  const optionsBrand = useMemo(
    () =>
      brands.map((b) => ({
        label: b.title,
        value: b._id,
      })),
    [brands]
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

              <Col span={4}>
                <Form.Item
                  label="Danh mục"
                  name="product_category_id"
                  rules={[
                    { required: true, message: "Vui lòng chọn danh mục!" },
                  ]}
                >
                  <Select options={options} placeholder="Chọn danh mục" />
                </Form.Item>
              </Col>

              <Col span={4}>
                <Form.Item
                  label="Thương hiệu"
                  name="brand_id"
                  rules={[
                    { required: true, message: "Vui lòng chọn thương hiệu!" },
                  ]}
                >
                  <Select
                    options={optionsBrand}
                    placeholder="Chọn thương hiệu"
                  />
                </Form.Item>
              </Col>

              <Col span={4}>
                <Form.Item
                  label="Giá"
                  name="price"
                  rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
                >
                  <Input allowClear type="number" min={0} />
                </Form.Item>
              </Col>

              <Col span={4}>
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

              <Col span={4}>
                <Form.Item label="Vị trí" name="position">
                  <Input
                    allowClear
                    type="number"
                    min={0}
                    placeholder="Tự tăng"
                  />
                </Form.Item>
              </Col>

              <Col span={4}>
                <Form.Item label="Giới tính" name="sex">
                  <Radio.Group>
                    <Radio value={0}>Nam</Radio>
                    <Radio value={1}>Nữ</Radio>
                    <Radio value={2}>Unisex</Radio>
                  </Radio.Group>
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

              {/* SIZE & STOCK */}
              <Col span={24}>
                <Card style={{ marginTop: 10 }} type="inner">
                  <Form.Item label="Kích cỡ & số lượng" required>
                    <Form.List name="sizeStock">
                      {(fields, { add, remove }) => (
                        <>
                          {fields.map(({ key, name, ...restField }) => (
                            <Row
                              key={key}
                              gutter={12}
                              align="middle"
                              style={{
                                marginBottom: 12,
                                border: "1px solid #f0f0f0",
                                padding: 12,
                                borderRadius: 6,
                              }}
                            >
                              <Col span={10}>
                                <Form.Item
                                  {...restField}
                                  name={[name, "size"]}
                                  rules={[
                                    {
                                      required: true,
                                      message: "Nhập kích cỡ!",
                                    },
                                  ]}
                                >
                                  <Input placeholder="VD: S, M, L, XL" />
                                </Form.Item>
                              </Col>

                              <Col span={10}>
                                <Form.Item
                                  {...restField}
                                  name={[name, "quantity"]}
                                  rules={[
                                    {
                                      required: true,
                                      message: "Nhập số lượng!",
                                    },
                                  ]}
                                >
                                  <Input
                                    type="number"
                                    min={0}
                                    placeholder="0"
                                  />
                                </Form.Item>
                              </Col>

                              <Col span={4} style={{ textAlign: "center" }}>
                                {fields.length > 1 && (
                                  <MinusCircleOutlined
                                    style={{ fontSize: 20, cursor: "pointer" }}
                                    onClick={() => remove(name)}
                                  />
                                )}
                              </Col>
                            </Row>
                          ))}

                          <Form.Item>
                            <Button
                              type="dashed"
                              onClick={() => add()}
                              block
                              icon={<PlusOutlined />}
                            >
                              Thêm kích cỡ
                            </Button>
                          </Form.Item>
                        </>
                      )}
                    </Form.List>
                  </Form.Item>
                </Card>
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
                <Form.Item label="Thông tin thêm" name="additionalInformation">
                  <MyEditor />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item label="Gợi ý phối đồ" name="outfitSuggestions">
                  <MyEditor />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  label="Bảng kích thước sản phẩm"
                  name="productSizeChart"
                >
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
