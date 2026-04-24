import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  Typography,
  Button,
  Space,
  Row,
  Col,
  Image,
  Spin,
  Result,
  Alert,
  Divider,
  Badge,
} from "antd";
import {
  CloseCircleOutlined,
  ReloadOutlined,
  ShoppingOutlined,
  CustomerServiceOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { detailOrderGet } from "../../../services/client/checkoutServies";

const { Title, Text, Paragraph } = Typography;

const FailCheckout = () => {
  const { code } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorReason, setErrorReason] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await detailOrderGet(code);
        if (res.code === 200) {
          setOrder(res.data.order);
          setErrorReason(res.data.transaction?.errorMessage || "Thanh toán không thành công.");
        } else {
          setErrorReason("Không tìm thấy thông tin đơn hàng.");
        }
      } catch (err) {
        console.error("❌ Lỗi lấy đơn hàng:", err);
        setErrorReason("Không thể kết nối đến server.");
      } finally {
        setLoading(false);
      }
    };
    if (code) fetchData();
  }, [code]);

  const formatPrice = (p) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(p);

  const handleRetry = () => (window.location.href = `/checkout/payment/${code}`);
  const handleBackHome = () => (window.location.href = "/");

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Spin size="large" />
        <Text className="mt-3">Đang tải thông tin đơn hàng...</Text>
      </div>
    );

  if (!order)
    return (
      <Result
        status="404"
        title="Không tìm thấy đơn hàng"
        subTitle="Đơn hàng không tồn tại hoặc đã bị xóa."
        extra={
          <Button type="primary" onClick={handleBackHome}>
            Về trang chủ
          </Button>
        }
      />
    );

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <CloseCircleOutlined className="text-6xl text-red-500 mb-4" />
          <Title level={2}>Thanh toán thất bại</Title>
          <Paragraph className="text-gray-500">
            Rất tiếc, giao dịch của bạn không được xử lý thành công.
          </Paragraph>
        </div>

        {/* Cảnh báo lỗi */}
        <Alert
          message="Lỗi thanh toán"
          description={errorReason}
          type="error"
          showIcon
          className="mb-6"
        />

        <Row gutter={[24, 24]}>
          {/* Thông tin đơn hàng */}
          <Col xs={24} md={14}>
            <Card
              title={<span className="font-semibold text-lg">Thông tin đơn hàng</span>}
              bordered={false}
              className="shadow-sm"
            >
              <Space direction="vertical" size="middle" className="w-full">
                <Row>
                  <Col span={10}>
                    <Text strong>Mã đơn hàng:</Text>
                  </Col>
                  <Col span={14}>
                    <Text code>{order.code}</Text>
                  </Col>
                </Row>

                <Row>
                  <Col span={10}>
                    <Text strong>Trạng thái:</Text>
                  </Col>
                  <Col span={14}>
                    <Badge color="red" text="Thanh toán thất bại" />
                  </Col>
                </Row>

                <Row>
                  <Col span={10}>
                    <Text strong>Phương thức thanh toán:</Text>
                  </Col>
                  <Col span={14}>
                    <Text>
                      {order.paymentMethod === "cod"
                        ? "Thanh toán khi nhận hàng"
                        : order.paymentMethod}
                    </Text>
                  </Col>
                </Row>

                <Divider />

                <Title level={5}>Sản phẩm</Title>
                <Space direction="vertical" className="w-full">
                  {order.products.map((p, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-gray-50 p-2 rounded-md"
                    >
                      <div className="flex items-center gap-3">
                        <Image
                          width={60}
                          src={p.productInfo.thumbnail || "/placeholder.svg"}
                          alt={p.productInfo.title}
                          preview={false}
                        />
                        <div>
                          <Text strong>{p.productInfo.title}</Text>
                          <div className="text-gray-500 text-sm">
                            {p.quantity} x {formatPrice(p.price)}
                          </div>
                        </div>
                      </div>
                      <Text className="font-semibold text-gray-700">
                        {formatPrice(p.price * p.quantity)}
                      </Text>
                    </div>
                  ))}
                </Space>
              </Space>
            </Card>
          </Col>

          {/* Cột phải - tổng tiền và khách hàng */}
          <Col xs={24} md={10}>
            <Space direction="vertical" size="large" className="w-full">
              <Card
                title={<span className="font-semibold text-lg">Thông tin khách hàng</span>}
                bordered={false}
                className="shadow-sm"
              >
                <Space direction="vertical" size="small">
                  <Space>
                    <UserOutlined /> <Text>{order.userInfo.fullName}</Text>
                  </Space>
                  <Space>
                    <PhoneOutlined /> <Text>{order.userInfo.phone}</Text>
                  </Space>
                  <Space>
                    <MailOutlined /> <Text>{order.userInfo.email}</Text>
                  </Space>
                  <Space align="start">
                    <EnvironmentOutlined /> <Text>{order.userInfo.address}</Text>
                  </Space>
                </Space>
              </Card>

              <Card
                title={<span className="font-semibold text-lg">Tổng cộng</span>}
                bordered={false}
                className="shadow-sm"
              >
                <Row justify="space-between">
                  <Text>Tạm tính:</Text>
                  <Text>{formatPrice(order.totalOrder)}</Text>
                </Row>
                <Row justify="space-between">
                  <Text>Phí vận chuyển:</Text>
                  <Text>{order.shippingFee === 0 ? <>Miễn phí </> : <>{formatPrice(order.shippingFee)}</>}</Text>
                </Row>
                <Row justify="space-between">
                  <Col>
                    <Text>Giảm:</Text>
                  </Col>
                  <Col>
                    <Text>{formatPrice(order.discountAmount)}</Text>
                  </Col>
                </Row>
                <Divider />
                <Row justify="space-between">
                  <Title level={4}>Thành tiền:</Title>
                  <Title level={4} style={{ color: "#ff4d4f" }}>
                    {formatPrice(order.totalOrder - order.discountAmount + order.shippingFee)}
                  </Title>
                </Row>
              </Card>

              {/* Các nút hành động */}
              <Space direction="vertical" className="w-full">
                <Button
                  type="primary"
                  icon={<ReloadOutlined />}
                  size="large"
                  block
                  onClick={handleRetry}
                  className="bg-red-500 border-red-500 hover:bg-red-600"
                >
                  Thử lại thanh toán
                </Button>

                <Button
                  icon={<ShoppingOutlined />}
                  size="large"
                  block
                  onClick={handleBackHome}
                >
                  Tiếp tục mua sắm
                </Button>

                <Button
                  icon={<CustomerServiceOutlined />}
                  size="large"
                  block
                  onClick={() => window.open("/support", "_blank")}
                >
                  Liên hệ hỗ trợ
                </Button>
              </Space>
            </Space>
          </Col>
        </Row>

        {/* Ghi chú cuối trang */}
        <Alert
          message="Lưu ý"
          description={
            <>
              <p>• Đơn hàng của bạn vẫn được lưu trong hệ thống và có thể thanh toán lại.</p>
              <p>• Nếu tiền đã bị trừ, hệ thống sẽ hoàn lại trong 3–5 ngày làm việc.</p>
            </>
          }
          type="info"
          showIcon
          className="mt-8"
        />
      </div>
    </div>
  );
};

export default FailCheckout;
