import { useState } from "react"
import { Card, Spin, Empty, Tag, Divider, Row, Col, Statistic } from "antd"
import { CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons"
import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { searchOrder } from "../../../services/client/searchServices"

const statusConfig = {
  initialize: { color: "default", icon: <ClockCircleOutlined />, label: "Chờ xác nhận" },
  received: { color: "processing", icon: <ClockCircleOutlined />, label: "Đã nhận tiền" },
  confirmed: { color: "processing", icon: <ClockCircleOutlined />, label: "Đã xác nhận" },
  processing: { color: "processing", icon: <ClockCircleOutlined />, label: "Đang xử lý" },
  shipping: { color: "processing", icon: <ClockCircleOutlined />, label: "Đang giao" },
  completed: { color: "success", icon: <CheckCircleOutlined />, label: "Hoàn thành" },
  cancelled: { color: "error", icon: <ExclamationCircleOutlined />, label: "Đã hủy" },
  returned: { color: "error", icon: <ExclamationCircleOutlined />, label: "Hoàn tiền" },
}

const transactionStatusConfig = {
  pending: { label: "Đang chờ", color: "gold" },
  paid: { label: "Đã thanh toán", color: "green" },
  failed: { label: "Thất bại", color: "red" },
  cancelled: { label: "Đã hủy", color: "volcano" },
  expired: { label: "Hết hạn", color: "gray" },
};

export default function OrderLookup() {
  const params = useParams();

  const [orderCode, setOrderCode] = useState(params.code || "")
  const [email, setEmail] = useState(params.email || "")
  const [loading, setLoading] = useState(false)
  const [order, setOrder] = useState(null)
  const [transactions, setTransaction] = useState(null)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchApi = async () => {
      try {
        setLoading(true)
        setError("")
        setOrder(null)
        setTransaction(null)

        const response = await searchOrder(orderCode, email);
        if (response.code === 200) {
          setOrder(response.data.order)
          setTransaction(response.data.trans)
        }
      } catch (err) {
        setError("Không tìm thấy đơn hàng. Vui lòng kiểm tra lại mã đơn hàng.")
      } finally {
        setLoading(false)
      }
    }
    fetchApi();

  }, [email, orderCode])

  return (
    <div className="space-y-6">
      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-12">
          <Spin size="large" tip="Đang tìm kiếm..." />
        </div>
      )}

      {/* Results */}
      {order && (
        <div className="space-y-6">
          {/* Order Status */}
          <Card className="shadow-lg border-0">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900">Mã đơn hàng: {order.code}</h2>
                <Tag
                  icon={statusConfig[order.status]?.icon}
                  color={statusConfig[order.status]?.color}
                  className="text-base px-3 py-1"
                >
                  {statusConfig[order.status]?.label}
                </Tag>
              </div>
              <Divider className="my-4" />
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={6}>
                  <Statistic
                    title="Ngày đặt hàng"
                    value={new Date(order.createdAt).toLocaleDateString("vi-VN")}
                    valueStyle={{ color: "#1f2937", fontSize: "16px" }}
                  />
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Statistic
                    title="Cập nhật lần cuối"
                    value={new Date(order.updatedAt).toLocaleDateString("vi-VN")}
                    valueStyle={{ color: "#1f2937", fontSize: "16px" }}
                  />
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Statistic
                    title="Phương thức thanh toán"
                    value={order.paymentMethod.toUpperCase()}
                    valueStyle={{ color: "#1f2937", fontSize: "16px" }}
                  />
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Statistic
                    title="Tổng tiền"
                    value={order.totalOrder - order.discountAmount + order.shippingFee}
                    suffix="₫"
                    valueStyle={{ color: "#2563eb", fontSize: "16px", fontWeight: "bold" }}
                  />
                </Col>
              </Row>
            </div>
          </Card>

          {/* Customer Info */}
          <Card title="Thông Tin Khách Hàng" className="shadow-lg border-0">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <div className="space-y-3">
                  <div>
                    <p className="text-slate-600 text-sm">Họ và tên</p>
                    <p className="text-slate-900 font-medium">{order.userInfo.fullName}</p>
                  </div>
                  <div>
                    <p className="text-slate-600 text-sm">Số điện thoại</p>
                    <p className="text-slate-900 font-medium">{order.userInfo.phone}</p>
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={12}>
                <div className="space-y-3">
                  <div>
                    <p className="text-slate-600 text-sm">Email</p>
                    <p className="text-slate-900 font-medium">{order.userInfo.email}</p>
                  </div>
                  <div>
                    <p className="text-slate-600 text-sm">Địa chỉ giao hàng</p>
                    <p className="text-slate-900 font-medium">{order.userInfo.address}</p>
                  </div>
                </div>
              </Col>
              {order.userInfo.note && (
                <Col xs={24}>
                  <div>
                    <p className="text-slate-600 text-sm">Ghi chú</p>
                    <p className="text-slate-900 font-medium italic">{order.userInfo.note}</p>
                  </div>
                </Col>
              )}
            </Row>
          </Card>

          {/* Products */}
          <Card title="Chi Tiết Sản Phẩm" className="shadow-lg border-0">
            <div className="space-y-3">
              {order.products.map((product, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-slate-900 font-medium">{product.title}</p>
                    <p className="text-slate-600 text-sm">
                      {product.size && `Size: ${product.size} | `}
                      Số lượng: {product.quantity}
                    </p>
                    <p className="text-slate-900 font-medium">Tổng: </p>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-900 font-medium">{Number(product.price).toLocaleString("vi-VN")}₫</p>
                    {product.discountPercentage ? (
                      <p className="text-red-600 text-sm">-{product.discountPercentage}%</p>
                    ) : null}
                    <p className="text-slate-900 font-medium">
                      {Number((product.price - (product.price * (product.discountPercentage / 100))) * product.quantity).toLocaleString("vi-VN")}₫
                    </p>
                  </div>

                </div>
              ))}
            </div>

            <Divider className="my-4" />

            {/* Price Summary */}
            <div className="space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Tạm tính:</span>
                <span>{order.totalOrder.toLocaleString("vi-VN")}₫</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Mã giảm giá:</span>
                <span>{order.voucher_code}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Giảm giá:</span>
                <span>{order.discountAmount.toLocaleString("vi-VN")}₫</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Phí vận chuyển:</span>
                <span>{order.shippingFee.toLocaleString("vi-VN")}₫</span>
              </div>
              <Divider className="my-2" />
              <div className="flex justify-between text-lg font-bold text-blue-600">
                <span>Tổng cộng:</span>
                <span>{Number(order.totalOrder - order.discountAmount + order.shippingFee).toLocaleString("vi-VN")}₫</span>
              </div>
            </div>
          </Card>

          {/* Transaction Info */}
          {transactions && (
            <>
              <Card title="Thông Tin Thanh Toán" className="shadow-lg border-0">
                {order.paymentMethod === "cod" ? (
                  <>
                    <h2 className="text-2xl font-bold text-slate-900">Thanh toán khi nhận hàng</h2>
                  </>
                ) : (
                  <>
                    {transactions.map((transaction, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-xl ${["failed", "cancelled", "expired"].includes(transaction.status)
                          ? "bg-red-50 border border-red-200"
                          : "bg-white"
                          }`}
                      >
                        <Row gutter={[16, 16]}>
                          <Col xs={24} sm={12}>
                            <div className="space-y-3">
                              <div>
                                <p className="text-slate-600 text-sm">Nhà cung cấp</p>
                                <p className="text-slate-900 font-medium uppercase">{transaction.provider}</p>
                              </div>
                              <div>
                                <p className="text-slate-600 text-sm">Nội dung giao dịch</p>
                                <p className="text-slate-900 font-medium uppercase">{transaction.orderInfo}</p>
                              </div>
                              <div>
                                <p className="text-slate-600 text-sm">Mã giao dịch</p>
                                <p className="text-slate-900 font-medium font-mono text-sm">
                                  {transaction.transactionNo || transaction.payType}
                                </p>
                              </div>
                            </div>
                          </Col>

                          <Col xs={24} sm={12}>
                            <div className="space-y-3">
                              <div>
                                <p className="text-slate-600 text-sm">Trạng thái</p>
                                <Tag
                                  color={transactionStatusConfig[transaction.status]?.color}
                                  className="text-base px-3 py-1"
                                >
                                  {transactionStatusConfig[transaction.status]?.label}
                                </Tag>
                              </div>
                              <div>
                                <p className="text-slate-600 text-sm">Số tiền</p>
                                <p className="text-slate-900 font-bold text-lg">
                                  {transaction.amount.toLocaleString("vi-VN")}₫
                                </p>
                              </div>
                            </div>
                          </Col>

                          {transaction.bankCode && (
                            <Col xs={24} sm={12}>
                              <div>
                                <p className="text-slate-600 text-sm">Mã ngân hàng</p>
                                <p className="text-slate-900 font-medium">{transaction.bankCode}</p>
                              </div>
                            </Col>
                          )}

                          {transaction.payType && (
                            <Col xs={24} sm={12}>
                              <div>
                                <p className="text-slate-600 text-sm">Loại thanh toán</p>
                                <p className="text-slate-900 font-medium">{transaction.payType}</p>
                              </div>
                            </Col>
                          )}

                          {/* 🔥 Nếu là giao dịch lỗi thì hiện chi tiết lỗi */}
                          {["failed", "cancelled", "expired"].includes(transaction.status) && (
                            <Col xs={24}>
                              <div className="mt-3">
                                <p className="text-red-600 font-semibold">
                                  ⚠️ Giao dịch không thành công: {transaction.errorMessage || "Không rõ nguyên nhân."}
                                </p>
                              </div>
                            </Col>
                          )}
                        </Row>

                        <Divider />
                      </div>
                    ))}
                  </>
                )}
              </Card>
            </>
          )}

        </div>
      )}

      {/* Empty State */}
      {!loading && !order && !error && (
        <Card className="shadow-lg border-0">
          <Empty description="Nhập mã đơn hàng để bắt đầu tra cứu" style={{ padding: "40px 0" }} />
        </Card>
      )}
    </div>
  )
}
