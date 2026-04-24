import {
  Button,
  Col,
  Form,
  Input,
  message,
  Modal,
  Radio,
  Row,
  Select,
} from "antd";
import {
  PlusOutlined,
} from "@ant-design/icons";
import { useState, useCallback, useEffect } from "react";
import { getCookie } from "../../../helpers/cookie";
import NoRole from "../../../components/NoRole";
import { productsGet } from "../../../services/admin/orderServies";
import useOrders from "../../../hooks/admin/useOrders";


function OrderEdit(props) {
  const permissions = JSON.parse(localStorage.getItem("permissions") || "[]");
  const token = getCookie("token");

  const { record } = props

  const [form] = Form.useForm();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [parsedSizes, setParsedSizes] = useState([]);

  const { updateProducts } = useOrders({
    token
  });

  // Dùng useCallback để tránh re-create hàm mỗi render */
  const showModal = useCallback(() => setIsModalOpen(true), []);
  const handleCancel = useCallback(() => setIsModalOpen(false), []);

  const fetchApi = useCallback(async () => {
    try {
      const response = await productsGet(token); // Truyền token vào hàm
      if (response.code === 200) {
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


  const handleSelectProduct = (productId) => {
    const product = products.find(p => p._id === productId);

    if (!product) return;

    setSelectedProduct(product);

    // Parse ["M-100", "L-132"] → [{size: "M", stock: 100}]
    const sizes = product.sizeStock.map(item => {
      const [size, stock] = item.split("-");
      return {
        size,
        stock: Number(stock),
      };
    });

    setParsedSizes(sizes);

    // reset field
    form.setFieldsValue({
      size: undefined,
      quantity: 1,
    });
  };

  const onFinish = (values) => {
    const product = products.find(p => p._id === values.product_id);

    const payload = {
      order_id: record._id,
      product_id: values.product_id,
      size: values.size,
      quantity: values.quantity,
      price: product.price,
      discountPercentage: product.discountPercentage,
    };

    updateProducts.mutate({ payload }, {
      onSuccess: (response) => {
        if (response?.code === 200) {
          handleCancel();
        }
      }
    });
  };

  if (!permissions.includes("orders_edit")) return <NoRole />;

  return (
    <>
      <Button
        icon={<PlusOutlined />}
        type="primary"
        style={{ marginLeft: 8 }}
        ghost
        onClick={showModal}
      >
        Thêm sản phẩm
      </Button>

      <Modal
        title="Thêm sản phẩm"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width="70%"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Row gutter={16}>
            {/* CHỌN SẢN PHẨM */}
            <Col span={12}>
              <Form.Item
                label="Sản phẩm"
                name="product_id"
                rules={[{ required: true, message: "Vui lòng chọn sản phẩm" }]}
              >
                <Select
                  placeholder="Chọn sản phẩm"
                  onChange={handleSelectProduct}
                  
                >
                  {products.map(product => (
                    <Select.Option key={product._id} value={product._id}>
                      {product.title}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                label="Giá"
                name="price"
              >
                {selectedProduct ? selectedProduct.price : "-"}
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                label="Giảm giá (%)"
                name="discount_percentage"
              >
                {selectedProduct ? selectedProduct.discountPercentage : "-"}%
              </Form.Item>
            </Col>

            {/* SIZE */}
            {parsedSizes.length > 0 && (
              <Col span={12}>
                <Form.Item
                  label="Size"
                  name="size"
                  rules={[{ required: true, message: "Vui lòng chọn size" }]}
                >
                  <Radio.Group>
                    {parsedSizes.map(item => (
                      <Radio
                        key={item.size}
                        value={item.size}
                        disabled={item.stock === 0}
                      >
                        {item.size} (Còn {item.stock})
                      </Radio>
                    ))}
                  </Radio.Group>
                </Form.Item>
              </Col>
            )}
          </Row>

          {/* SỐ LƯỢNG */}
          {parsedSizes.length > 0 && (
            <Row>
              <Col span={12}>
                <Form.Item
                  label="Số lượng"
                  name="quantity"
                  rules={[
                    { required: true, message: "Nhập số lượng" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        const size = getFieldValue("size");
                        if (!size || !value) return Promise.resolve();

                        const sizeObj = parsedSizes.find(s => s.size === size);
                        if (value <= sizeObj.stock) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error(`Số lượng tối đa là ${sizeObj.stock}`)
                        );
                      },
                    }),
                  ]}
                >
                  <Input type="number" min={1} />
                </Form.Item>
              </Col>
            </Row>
          )}

          {/* SUBMIT */}
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Thêm vào đơn hàng
            </Button>
          </Form.Item>
        </Form>

      </Modal>
    </>
  );
}

export default OrderEdit;
