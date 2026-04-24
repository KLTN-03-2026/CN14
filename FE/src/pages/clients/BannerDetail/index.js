import { Typography, Row, Col, Card, Tag, Button, message, Space, Progress } from "antd"
import {
  CalendarOutlined,
  ClockCircleOutlined,
  CopyOutlined,
  GiftOutlined,
  ShoppingOutlined,
  FireOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons"
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { detailBanner, vouchersBanner } from "../../../services/client/bannerServies"
import parse from "html-react-parser"
import dayjs from "dayjs"
import "dayjs/locale/vi"

dayjs.locale("vi")

const { Title, Text } = Typography

function BannerDetail() {
  const [timeRemaining, setTimeRemaining] = useState("")
  const [isExpired, setIsExpired] = useState(false)
  const params = useParams();
  const [slug, setSlug] = useState(params.slug || "")
  const [banner, setBanner] = useState(null)
  const [vouchers, setVouchers] = useState([])
  const [loading, setLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Tính thời gian còn lại
  const calculateTimeRemaining = () => {
    if (!banner) return

    const now = new Date()
    const endDate = new Date(banner.end_date)
    const timeDiff = endDate - now

    if (timeDiff > 0) {
      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))

      if (days > 0) {
        setTimeRemaining(`${days} ngày ${hours} giờ`)
      } else if (hours > 0) {
        setTimeRemaining(`${hours} giờ ${minutes} phút`)
      } else {
        setTimeRemaining(`${minutes} phút`)
      }
      setIsExpired(false)
    } else {
      setTimeRemaining("Đã hết hạn")
      setIsExpired(true)
    }
  }

  useEffect(() => {
    const fetchApi = async () => {
      try {
        setLoading(true)
        const response = await detailBanner(slug)
        if (response.code === 200) {
          setBanner(response.data)
          const responseVouchers = await vouchersBanner(response.data._id);
          if (responseVouchers.code === 200) {
            setVouchers(responseVouchers.data)
          }
        } else {
          message.error(response.message || "Không tìm thấy banner")
          setBanner(null)
        }
      } catch (error) {
        message.error("Không thể tải thông tin banner")
      } finally {
        setLoading(false)
      }
    }

    fetchApi()
  }, [slug])

  useEffect(() => {
    if (banner) {
      calculateTimeRemaining()
      const interval = setInterval(calculateTimeRemaining, 60000) // Cập nhật mỗi phút
      return () => clearInterval(interval)
    }
  }, [banner, calculateTimeRemaining])

  // Copy voucher code
  const copyVoucherCode = (code) => {
    navigator.clipboard.writeText(code).then(() => {
      message.success(`Đã copy mã voucher: ${code}`)
    })
  }

  // Get status color and text
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "success"
      case "inactive":
        return "error"
      case "draft":
        return "warning"
      default:
        return "default"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "Đang hoạt động"
      case "inactive":
        return "Không hoạt động"
      case "draft":
        return "Bản nháp"
      default:
        return status
    }
  }

  // Voucher Card Component
  const VoucherCard = ({ voucher }) => {
    const usagePercentage = (voucher.used_count / voucher.quantity) * 100
    const isVoucherExpired = new Date(voucher.end_date) < new Date()

    return (
      <Card
        style={{
          marginBottom: 16,
          border: isVoucherExpired ? "1px solid #d9d9d9" : "2px solid #1890ff",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            background: isVoucherExpired
              ? "linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)"
              : "linear-gradient(135deg, #1890ff 0%, #096dd9 100%)",
            padding: "16px 20px",
            color: isVoucherExpired ? "#999" : "#fff",
          }}
        >
          <Row justify="space-between" align="middle">
            <Col flex="auto">
              <Space direction="vertical" size={4}>
                <Text
                  strong
                  style={{
                    color: isVoucherExpired ? "#999" : "#fff",
                    fontSize: 16,
                  }}
                >
                  {voucher.title}
                </Text>
                <Text
                  style={{
                    color: isVoucherExpired ? "#999" : "rgba(255,255,255,0.9)",
                    fontSize: 12,
                  }}
                >
                  {voucher.discount_value < 100
                    ? `Giảm ${voucher.discount_value}%`
                    : `Giảm ${voucher.discount_value.toLocaleString()}đ`}
                </Text>
              </Space>
            </Col>
            <Col>
              <div
                style={{
                  background: isVoucherExpired ? "#fff" : "rgba(255,255,255,0.2)",
                  padding: "8px 16px",
                  borderRadius: 20,
                  border: isVoucherExpired ? "1px solid #d9d9d9" : "1px solid rgba(255,255,255,0.3)",
                }}
              >
                <Text
                  strong
                  style={{
                    color: isVoucherExpired ? "#999" : "#fff",
                    fontSize: 14,
                    letterSpacing: 1,
                  }}
                >
                  {voucher.voucher_code}
                </Text>
              </div>
            </Col>
          </Row>
        </div>

        <div style={{ padding: "16px 20px" }}>
          <Space direction="vertical" size={12} style={{ width: "100%" }}>
            {/* Description */}
            <div>{parse(voucher.excerpt || "")}</div>
            {/* Min order value */}
            <div>
              <ShoppingOutlined style={{ marginRight: 8, color: "#1890ff" }} />
              <Text type="secondary">
                Đơn hàng tối thiểu: <Text strong>{voucher.min_order_value.toLocaleString()}đ</Text>
              </Text>
            </div>

            {/* Usage progress */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <Text type="secondary">Đã sử dụng:</Text>
                <Text>
                  {voucher.used_count}/{voucher.quantity}
                </Text>
              </div>
              <Progress
                percent={usagePercentage}
                size="small"
                strokeColor={usagePercentage > 80 ? "#ff4d4f" : "#1890ff"}
                showInfo={false}
              />
            </div>

            {/* Expiry date */}
            <div>
              <ClockCircleOutlined style={{ marginRight: 8, color: "#faad14" }} />
              <Text type="secondary">
                Hết hạn: <Text strong>{dayjs(voucher.end_date).format("DD/MM/YYYY HH:mm")}</Text>
              </Text>
            </div>

            {/* Action button */}
            <Button
              type={isVoucherExpired ? "default" : "primary"}
              block
              size="large"
              icon={isVoucherExpired ? <CheckCircleOutlined /> : <CopyOutlined />}
              onClick={() => !isVoucherExpired && copyVoucherCode(voucher.voucher_code)}
              disabled={isVoucherExpired || voucher.used_count >= voucher.quantity}
              style={{
                height: 44,
                borderRadius: 8,
                fontWeight: 500,
              }}
            >
              {isVoucherExpired ? "Đã hết hạn" : voucher.used_count >= voucher.quantity ? "Đã hết lượt" : "Sao chép mã"}
            </Button>
          </Space>
        </div>
      </Card>
    )
  }

  if (loading) {
    return (
      <div style={{ padding: isMobile ? 16 : 24, textAlign: "center" }}>
        <div>Đang tải...</div>
      </div>
    )
  }

  if (!banner) {
    return (
      <div style={{ padding: isMobile ? 16 : 24, textAlign: "center" }}>
        <div>Không tìm thấy banner</div>
      </div>
    )
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #f0f2f5, #ffffff)",
        padding: isMobile ? "16px" : "24px 0",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: isMobile ? 0 : "0 24px" }}>
        <Row gutter={[24, 24]}>
          {/* Main Content */}
          <Col xs={24} lg={16}>
            {/* Hero Section */}
            <Card
              style={{
                marginBottom: 24,
                borderRadius: 16,
                overflow: "hidden",
                boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
              }}
            >
              {/* Hero Image */}
              <div style={{ position: "relative" }}>
                <img
                  src={banner.image || "/placeholder.svg"}
                  alt={banner.title}
                  style={{
                    width: "100%",
                    height: isMobile ? 250 : 400,
                    objectFit: "cover",
                  }}
                />
                {/* Overlay with status */}
                <div
                  style={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                  }}
                >
                  <Tag
                    color={getStatusColor(banner.status)}
                    style={{
                      fontSize: 12,
                      fontWeight: 500,
                      padding: "4px 12px",
                      borderRadius: 20,
                    }}
                  >
                    {getStatusText(banner.status)}
                  </Tag>
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: isMobile ? 20 : 32 }}>
                <Title
                  level={isMobile ? 2 : 1}
                  style={{
                    marginBottom: 16,
                    background: "linear-gradient(135deg, #1890ff, #096dd9)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {banner.title}
                </Title>

                {/* Meta info */}
                <Space
                  direction={isMobile ? "vertical" : "horizontal"}
                  size={16}
                  style={{ marginBottom: 24, width: "100%" }}
                >
                  <div>
                    <CalendarOutlined style={{ marginRight: 8, color: "#1890ff" }} />
                    <Text>Bắt đầu: {dayjs(banner.start_date).format("DD/MM/YYYY HH:mm")}</Text>
                  </div>
                  <div>
                    <ClockCircleOutlined
                      style={{
                        marginRight: 8,
                        color: isExpired ? "#ff4d4f" : "#faad14",
                      }}
                    />
                    <Text style={{ color: isExpired ? "#ff4d4f" : "#faad14", fontWeight: 500 }}>
                      {isExpired ? "Đã hết hạn" : `Còn lại: ${timeRemaining}`}
                    </Text>
                  </div>
                </Space>

                {/* Content */}
                <div
                  style={{
                    fontSize: 16,
                    lineHeight: 1.8,
                    color: "#333"
                  }}
                >
                  {parse(banner.content || "<p>Không có nội dung</p>")}
                </div>
              </div>
            </Card>
          </Col>

          {/* Sidebar - Vouchers */}
          <Col xs={24} lg={8}>
            <div style={{ position: isMobile ? "static" : "sticky", top: 24 }}>
              <Card
                title={
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <GiftOutlined style={{ color: "#1890ff" }} />
                    <span>Voucher khuyến mãi</span>
                    <FireOutlined style={{ color: "#ff4d4f" }} />
                  </div>
                }
                style={{
                  borderRadius: 16,
                  boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                }}
                headStyle={{
                  background: "linear-gradient(135deg, #f0f9ff, #e6f7ff)",
                  borderRadius: "16px 16px 0 0",
                }}
              >
                {vouchers.length > 0 ? (
                  <Space direction="vertical" size={0} style={{ width: "100%" }}>
                    <div style={{ marginBottom: 16, textAlign: "center" }}>
                      <Text type="secondary">
                        🎉 Có{" "}
                        <Text strong style={{ color: "#1890ff" }}>
                          {vouchers.length}
                        </Text>{" "}
                        voucher đang khả dụng
                      </Text>
                    </div>
                    {vouchers.map((voucher) => (
                      <VoucherCard key={voucher._id} voucher={voucher} />
                    ))}
                  </Space>
                ) : (
                  <div style={{ textAlign: "center", padding: 40 }}>
                    <GiftOutlined style={{ fontSize: 48, color: "#d9d9d9", marginBottom: 16 }} />
                    <Text type="secondary">Chưa có voucher nào</Text>
                  </div>
                )}
              </Card>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default BannerDetail
