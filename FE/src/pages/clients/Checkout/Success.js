import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Card, Typography, Badge, Button, Row, Col, Divider, Space, Image, Spin, Result } from "antd"
import {
  CheckCircleOutlined,
  ShoppingOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  CreditCardOutlined,
  InboxOutlined,
} from "@ant-design/icons"
import { detailOrderGet } from "../../../services/client/checkoutServies"

const { Title, Text, Paragraph } = Typography

const SuccessCheckout = () => {
  const params = useParams()
  const [code, setCode] = useState(params.code || "")
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchApi = async () => {
      try {
        setLoading(true)
        const response = await detailOrderGet(code);
        if (response.code === 200) {
          setOrder(response.data.order)
        }
      } catch (error) {
        console.error("Lỗi lấy đơn hàng: ", error)
      } finally {
        setLoading(false)
      }
    }

    if (code) {
      fetchApi()
    }
  }, [code])

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusConfig = (status) => {
    const statusMap = {
      initialize: { text: "Khởi tạo", color: "default" },
      confirmed: { text: "Đã xác nhận", color: "gold" },
      received: { text: "Đã thanh toán", color: "blue" },
      processing: { text: "Đang xử lý", color: "orange" },
      shipping: { text: "Đang giao hàng", color: "geekblue" },
      completed: { text: "Hoàn thành", color: "green" },
      cancelled: { text: "Đã hủy", color: "red" },
      returned: { text: "Hoàn trả / Hoàn tiền", color: "volcano" }
    }

    return statusMap[status] || { text: status, color: "default" }
  }

  const handleTrackOrder = () => {
    // Logic theo dõi đơn hàng
    console.log("Theo dõi đơn hàng:", order.code)
  }

  const handleContinueShopping = () => {
    // Logic tiếp tục mua sắm
    window.location.href = "/"
  }

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <Spin size="large" />
        <Text style={{ marginLeft: 16 }}>Đang tải thông tin đơn hàng...</Text>
      </div>
    )
  }

  if (!order) {
    return (
      <Result
        status="404"
        title="Không tìm thấy đơn hàng"
        subTitle="Đơn hàng không tồn tại hoặc đã bị xóa."
        extra={
          <Button type="primary" onClick={handleContinueShopping}>
            Về trang chủ
          </Button>
        }
      />
    )
  }

  const statusConfig = getStatusConfig(order.status)

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        padding: "24px 0",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 16px",
        }}
      >
        {/* Header thành công */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <CheckCircleOutlined
            style={{
              fontSize: 64,
              color: "#52c41a",
              marginBottom: 16,
            }}
          />
          <Title level={2} style={{ color: "#262626", marginBottom: 8 }}>
            Đặt hàng thành công!
          </Title>
          <Paragraph style={{ fontSize: 16, color: "#8c8c8c" }}>
            Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ xử lý đơn hàng của bạn sớm nhất có thể.
          </Paragraph>
        </div>

        <Row gutter={[24, 24]}>
          {/* Cột trái - Thông tin đơn hàng và sản phẩm */}
          <Col xs={24} lg={16}>
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              {/* Thông tin đơn hàng */}
              <Card
                title={
                  <Space>
                    <InboxOutlined />
                    <span>Thông tin đơn hàng</span>
                  </Space>
                }
              >
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Text strong>Mã đơn hàng:</Text>
                  </Col>
                  <Col span={12}>
                    <Text code style={{ fontSize: 18 }}>
                      {order.code}
                    </Text>
                  </Col>

                  <Col span={12}>
                    <Text strong>Trạng thái:</Text>
                  </Col>
                  <Col span={12}>
                    <Badge color={statusConfig.color} text={statusConfig.text} />
                  </Col>

                  <Col span={12}>
                    <Text strong>Ngày đặt:</Text>
                  </Col>
                  <Col span={12}>
                    <Text type="secondary">{formatDate(order.createdAt)}</Text>
                  </Col>

                  <Col span={12}>
                    <Text strong>Thanh toán:</Text>
                  </Col>
                  <Col span={12}>
                    <Text>{order.paymentMethod === "cod" ? "Thanh toán khi nhận hàng" : "Thanh toán bằng chuyển khoản"}</Text>
                  </Col>
                </Row>
              </Card>

              {/* Danh sách sản phẩm */}
              <Card title="Sản phẩm đã đặt">
                <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                  {order.products.map((product, index) => (
                    <Card key={product._id} size="small" style={{ backgroundColor: "#fafafa" }}>
                      <Row gutter={16} align="middle">
                        <Col xs={6} sm={4}>
                          <Image
                            width={80}
                            height={80}
                            src={product.productInfo.thumbnail || "/placeholder.svg"}
                            alt={product.productInfo.title}
                            style={{ objectFit: "cover", borderRadius: 8 }}
                            fallback="/placeholder.svg?height=80&width=80"
                          />
                        </Col>

                        <Col xs={18} sm={14}>
                          <Title level={5} style={{ marginBottom: 8 }}>
                            {product.productInfo.title}
                          </Title>
                          <Space direction="vertical" size="small">
                            <Text type="secondary">Số lượng: {product.quantity}</Text>
                            <Space>
                              <Text delete type="secondary">
                                {formatPrice(product.price)}
                              </Text>
                              <Text strong style={{ color: "#ff4d4f" }}>
                                {formatPrice(product.price * (1 - product.discountPercentage / 100))}
                              </Text>
                              <Badge count={`-${product.discountPercentage}%`} style={{ backgroundColor: "#ff4d4f" }} />
                            </Space>
                          </Space>
                        </Col>

                        <Col xs={24} sm={6} style={{ textAlign: "right" }}>
                          <Title level={4} style={{ color: "#52c41a", margin: 0 }}>
                            {formatPrice(product.totalPrice)}
                          </Title>
                        </Col>
                      </Row>
                    </Card>
                  ))}
                </Space>
              </Card>
            </Space>
          </Col>

          {/* Cột phải - Thông tin khách hàng và tổng tiền */}
          <Col xs={24} lg={8}>
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              {/* Thông tin khách hàng */}
              <Card
                title={
                  <Space>
                    <UserOutlined />
                    <span>Thông tin khách hàng</span>
                  </Space>
                }
              >
                <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                  <Space>
                    <UserOutlined style={{ color: "#8c8c8c" }} />
                    <Text>{order.userInfo.fullName}</Text>
                  </Space>

                  <Space>
                    <PhoneOutlined style={{ color: "#8c8c8c" }} />
                    <Text>{order.userInfo.phone}</Text>
                  </Space>

                  <Space>
                    <MailOutlined style={{ color: "#8c8c8c" }} />
                    <Text>{order.userInfo.email}</Text>
                  </Space>

                  <Space align="start">
                    <EnvironmentOutlined style={{ color: "#8c8c8c", marginTop: 4 }} />
                    <Text>{order.userInfo.address}</Text>
                  </Space>

                  {order.userInfo.note && (
                    <>
                      <Divider style={{ margin: "12px 0" }} />
                      <div>
                        <Text strong>Ghi chú: </Text>
                        <Text type="secondary">{order.userInfo.note}</Text>
                      </div>
                    </>
                  )}
                </Space>
              </Card>

              {/* Tổng tiền */}
              <Card
                title={
                  <Space>
                    <CreditCardOutlined />
                    <span>Tổng cộng</span>
                  </Space>
                }
              >
                <Space direction="vertical" size="small" style={{ width: "100%" }}>
                  <Row justify="space-between">
                    <Col>
                      <Text>Tạm tính:</Text>
                    </Col>
                    <Col>
                      <Text>{formatPrice(order.totalOrder)}</Text>
                    </Col>
                  </Row>

                  <Row justify="space-between">
                    <Col>
                      <Text>Giảm:</Text>
                    </Col>
                    <Col>
                      <Text>{formatPrice(order.discountAmount)}</Text>
                    </Col>
                  </Row>

                  <Row justify="space-between">
                    <Col>
                      <Text>Phí vận chuyển:</Text>
                    </Col>
                    <Col>
                      <Text>
                        {order.shippingFee > 0 ?
                          (<>{order.shippingFee}</>)
                          :
                          (<>Miễn phí</>)
                        }
                      </Text>
                    </Col>
                  </Row>

                  <Divider style={{ margin: "12px 0" }} />

                  <Row justify="space-between">
                    <Col>
                      <Title level={4}>Tổng cộng:</Title>
                    </Col>
                    <Col>
                      <Title level={4} style={{ color: "#52c41a", margin: 0 }}>
                        {formatPrice(order.totalOrder - order.discountAmount + order.shippingFee)}
                      </Title>
                    </Col>
                  </Row>
                </Space>
              </Card>

              {/* Nút hành động */}
              <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                <Button type="primary" size="large" block onClick={handleTrackOrder}>
                  Theo dõi đơn hàng
                </Button>

                <a href="/" style={{ textDecoration: "none" }} target="_blank" rel="noopener noreferrer">
                  <Button size="large" block icon={<ShoppingOutlined />} onClick={handleContinueShopping}>
                    Tiếp tục mua sắm
                  </Button>
                </a>
              </Space>
            </Space>
          </Col>
        </Row>

        {/* Thông tin bổ sung */}
        <Card style={{ marginTop: 24, textAlign: "center" }}>
          <Paragraph style={{ marginBottom: 8 }}>
            <Text strong>Lưu ý:</Text> Đơn hàng của bạn sẽ được xử lý trong vòng 1-2 ngày làm việc.
          </Paragraph>
          <Paragraph style={{ margin: 0 }}>
            Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi qua hotline:
            <Text strong style={{ marginLeft: 4 }}>
              1900 1234
            </Text>
          </Paragraph>
        </Card>
      </div>
    </div>
  )
}

export default SuccessCheckout;
