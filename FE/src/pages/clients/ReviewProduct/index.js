import { useState, useEffect } from "react"
import { Card, Rate, Button, Form, Input, message, Avatar, Empty, Badge, Progress, Space } from "antd"
import { UserOutlined, DeleteOutlined, StarFilled, SendOutlined, CloseOutlined, EditOutlined, EyeInvisibleOutlined } from "@ant-design/icons"
import { productReviewsGet } from "../../../services/client/productServies"
import { getCookie } from "../../../helpers/cookie"
import {
  handleDeleteReview,
  handleDeleteReply,
  handleSubmitReplyCustomer,
  handleSubmitReview
} from "./handleCustomer";

import {
  handleDeleteReviewByAdmin,
  handleDeleteReplyByAdmin,
  handleSubmitReplyByAdmin
} from "./handleAdmin";
const { TextArea } = Input

const ReviewProduct = ({ productId }) => {

  const [tokenUser] = useState(getCookie("tokenUser"));
  const [token] = useState(getCookie("token"));
  const currentUserId = getCookie("userId");

  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [form] = Form.useForm();

  // State cho reply customer
  const [replyingReview, setReplyingReview] = useState(null);
  const [replyForm] = Form.useForm();

  // State cho reply customer
  const [replyingReviewAdmin, setReplyingReviewAdmin] = useState(null);
  const [replyFormAdmin] = Form.useForm();

  // State cho form đánh giá
  const [showReviewForm, setShowReviewForm] = useState(false)

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await productReviewsGet(productId);
      if (res.code === 200) {
        setReviews(res.data);
      }
    } catch (error) {
      message.error("Không thể tải đánh giá. Vui lòng thử lại!")
    } finally {
      setLoading(false)
    }
  }

  // Lấy danh sách đánh giá khi component mount
  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenUser])

  // Xử lý mở modal khi customer bấm Trả lời, lưu review hiện tại vào replyingReview
  const handleReplyClick = (review) => {
    setReplyingReview(review);
  };

  // --------------------------------------------------------------------//
  //                            ADMIN
  // Xử lý mở modal khi admin bấm Trả lời, lưu review hiện tại vào replyingReview
  const handleReplyClickAdmin = (review) => {
    setReplyingReviewAdmin(review);
  };

  // Lấy badge theo role
  const getRoleBadge = (role) => {
    const badges = {
      admin: { text: "Admin", color: "#ff4d4f" },
      customer: { text: "Khách hàng", color: "#52c41a" }
    }
    return badges[role] || badges.customer
  }

  // Tính điểm trung bình
  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0

  // Tính phân bố đánh giá theo sao
  const ratingDistribution = [5, 4, 3, 2, 1].map(star => {
    const count = reviews.filter(r => r.rating === star).length
    const percentage = reviews.length > 0 ? (count / reviews.length * 100) : 0
    return { star, count, percentage }
  })

  const renderReview = (review) => (
    < div key={review._id} className="mb-6" >
      <div className="flex items-start gap-3">
        <Avatar icon={<UserOutlined />} />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="font-medium">{review.user.fullName}     <Badge count={getRoleBadge(review.role || "customer").text}
                color={getRoleBadge(review.role || "customer").color}
                style={{ fontSize: "10px" }}
              />
              </h4>
              <Rate disabled value={review.rating} />
              <span className="ml-2 text-sm text-gray-500">
                {new Date(review.createdAt).toLocaleString()}
              </span>
            </div>
            <div>

              {/* Customer xóa và trả lời review */}
              {tokenUser && (
                <Button type="link" size="small" onClick={() => handleReplyClick(review)}>
                  Trả lời
                </Button>
              )}
              {currentUserId === review.user._id && (
                <Button size="small" icon={<DeleteOutlined />}  title="Xóa"
                  onClick={() => handleDeleteReview(review._id, tokenUser, setReviews)}
                />
              )}

              {/* Admin xóa và trả lời review */}
              {token && (
                <>
                  <Button className="ml-2" variant="outlined" danger size="small" onClick={() => handleReplyClickAdmin(review)}>
                    Trả lời
                  </Button>
                  <Button className="ml-2" size="small" icon={<EyeInvisibleOutlined />} danger title="Ẩn bình luận"
                    onClick={() => handleDeleteReviewByAdmin(review._id, token, setReviews)}
                  />
                </>
              )}
            </div>
          </div>
          <p className="mb-3">{review.content}</p>

          {/* Danh sách reply (chỉ 1 cấp) */}
          {review.replies.length > 0 && (
            <div className="ml-8 border-l pl-4">
              {review.replies.map((reply) => (
                <div key={reply.id} className="flex items-center justify-between mb-2">
                  {reply.user === null ? (
                    <>
                      <div>
                        <h5 className="font-medium">Shop online     <Badge count={getRoleBadge(review.role || "admin").text}
                          color={getRoleBadge(reply.role || "admin").color}
                          style={{ fontSize: "10px" }}
                        /></h5>
                        <p className="text-gray-700">{reply.content}</p>
                        <span className="text-xs text-gray-500">
                          {new Date(reply.createdAt).toLocaleString()}
                        </span>
                      </div>
                      {/* Admin xóa reply */}
                      {token && (
                        <>
                          <Button className="ml-2" size="small" icon={<DeleteOutlined />} danger
                            onClick={() => handleDeleteReplyByAdmin(review._id, reply._id, token, fetchReviews)}
                          />
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <div>
                        <h5 className="font-medium">{reply.user.fullName}     <Badge count={getRoleBadge(review.role || "customer").text}
                          color={getRoleBadge(reply.role || "customer").color}
                          style={{ fontSize: "10px" }}
                        /></h5>
                        <p className="text-gray-700">{reply.content}</p>
                        <span className="text-xs text-gray-500">
                          {new Date(reply.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <div>
                        {/* Customer xóa reply */}
                        {currentUserId === reply.user._id && (
                          <Button size="small" icon={<DeleteOutlined />} onClick={() => handleDeleteReply(review._id, reply._id)} />
                        )}

                        {/* Admin xóa reply */}
                        {token && (
                          <>
                            <Button className="ml-2" size="small" icon={<DeleteOutlined />} danger onClick={() => handleDeleteReplyByAdmin(review._id, reply._id)} />
                          </>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Form reply */}
          {replyingReview?._id === review._id && (
            <Card size="small" className="mt-3">
              <Form form={replyForm} layout="vertical"
                onFinish={(e) => handleSubmitReplyCustomer
                  (replyingReview, e, tokenUser, fetchReviews, replyForm, setReplyingReview, setSubmitting)}
              >
                <Form.Item
                  name="content"
                  rules={[{ required: true, message: "Vui lòng nhập nội dung trả lời!" }]}
                >
                  <TextArea rows={3} placeholder="Nhập trả lời của bạn..." />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" size="small">
                    Gửi
                  </Button>
                  <Button
                    size="small"
                    className="ml-2"
                    onClick={() => setReplyingReview(null)}
                  >
                    Hủy
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          )}

          {/* Form reply Admin*/}
          {replyingReviewAdmin?._id === review._id && (
            <Card size="small" className="mt-3">
              <Form form={replyFormAdmin} layout="vertical"
                onFinish={(e) => handleSubmitReplyByAdmin
                  (replyingReviewAdmin, e, token, fetchReviews, replyFormAdmin, setReplyingReviewAdmin)}
              >
                <Form.Item
                  name="content"
                  rules={[{ required: true, message: "Vui lòng nhập nội dung trả lời!" }]}
                >
                  <TextArea rows={3} placeholder="Nhập trả lời của bạn..." />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" danger size="small">
                    Gửi
                  </Button>
                  <Button
                    size="small"
                    className="ml-2"
                    danger
                    onClick={() => setReplyingReviewAdmin(null)}
                  >
                    Hủy
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          )}
        </div>
      </div>
    </ div>
  );

  return (
    <div className="product-reviews">
      {/* Thống kê tổng quan */}
      <Card
        style={{
          marginBottom: 24,
          background: 'linear-gradient(135deg, #ffecd2 0%, #F8D49A 100%)',
          border: 'none',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
        }}
      >
        <div style={{
          display: 'grid',
          gridTemplateColumns: window.innerWidth > 768 ? '1fr 1px 1fr' : '1fr',
          gap: 32,
          alignItems: 'center'
        }}>
          {/* Left: Average Rating */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 80,
              height: 80,
              background: 'white',
              borderRadius: '50%',
              boxShadow: '0 4px 12px rgba(252, 182, 159, 0.3)',
              marginBottom: 16
            }}>
              <StarFilled style={{ fontSize: 36, color: '#faad12' }} />
            </div>
            <div style={{ fontSize: 48, fontWeight: 700, color: '#d4380d', marginBottom: 8 }}>
              {averageRating}
            </div>
            <Rate disabled value={parseFloat(averageRating)} allowHalf style={{ fontSize: 20 }} />
            <div style={{ marginTop: 12, color: '#8c8c8c', fontSize: 14 }}>
              Dựa trên {reviews.length} đánh giá
            </div>
          </div>

          {/* Divider */}
          {window.innerWidth > 768 && (
            <div style={{ width: 1, height: 200, background: 'rgba(0,0,0,0.1)' }} />
          )}

          {/* Right: Rating Distribution */}
          <div style={{ padding: '0 16px' }}>
            {ratingDistribution.map(({ star, count, percentage }) => (
              <div
                key={star}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  marginBottom: 12
                }}
              >
                <span style={{
                  fontWeight: 500,
                  width: 60,
                  fontSize: 14,
                  color: '#595959'
                }}>
                  {star} <StarFilled style={{ color: '#faad14', fontSize: 12 }} />
                </span>
                <Progress
                  percent={percentage}
                  strokeColor={{
                    '0%': '#faad14',
                    '100%': '#ff7a45'
                  }}
                  showInfo={false}
                  style={{ flex: 1 }}
                />
                <span style={{
                  width: 40,
                  textAlign: 'right',
                  fontSize: 14,
                  color: '#595959',
                  fontWeight: 500
                }}>
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Form đánh giá mới */}
      {tokenUser && (
        <Card
          style={{
            marginBottom: 24,
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            border: '1px solid #f0f0f0'
          }}
        >
          {!showReviewForm ? (
            <Button
              type="dashed"
              size="large"
              block
              icon={<EditOutlined />}
              onClick={() => setShowReviewForm(true)}
              style={{
                height: 56,
                fontSize: 16,
                fontWeight: 500,
                color: '#1890ff'
              }}
            >
              Viết đánh giá của bạn
            </Button>
          ) : (
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 24
              }}>
                <h3 style={{
                  fontSize: 20,
                  fontWeight: 600,
                  margin: 0,
                  color: '#262626'
                }}>
                  <EditOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                  Đánh giá sản phẩm
                </h3>
                <Button
                  type="text"
                  icon={<CloseOutlined />}
                  onClick={() => setShowReviewForm(false)}
                />
              </div>

              <Form
                form={form}
                layout="vertical"
                onFinish={(values) => handleSubmitReview(
                  productId,
                  values,
                  setReviews,
                  tokenUser,
                  form,
                  setSubmitting, 
                  fetchReviews
                )}
                initialValues={{ rating: 5 }}
              >
                <Form.Item
                  name="rating"
                  label={<span style={{ fontSize: 15, fontWeight: 500 }}>Đánh giá của bạn</span>}
                  rules={[{ required: true, message: "Vui lòng chọn số sao!" }]}
                >
                  <Rate style={{ fontSize: 28 }} />
                </Form.Item>

                <Form.Item
                  name="content"
                  label={<span style={{ fontSize: 15, fontWeight: 500 }}>Nội dung đánh giá</span>}
                  rules={[
                    { required: true, message: "Vui lòng nhập nội dung đánh giá!" },
                    { min: 10, message: "Nội dung phải có ít nhất 10 ký tự!" }
                  ]}
                >
                  <TextArea
                    rows={5}
                    placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                    maxLength={500}
                    showCount
                    style={{ fontSize: 15 }}
                  />
                </Form.Item>

                <Form.Item style={{ marginBottom: 0 }}>
                  <Space>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={submitting}
                      size="large"
                      icon={<SendOutlined />}
                    >
                      Gửi đánh giá
                    </Button>
                    <Button
                      size="large"
                      onClick={() => setShowReviewForm(false)}
                    >
                      Hủy
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </div>
          )}
        </Card>
      )}

      {/* Danh sách đánh giá */}
      <Card title={`Tất cả đánh giá (${reviews.length})`}>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-500">Đang tải đánh giá...</p>
          </div>
        ) : reviews.length === 0 ? (
          <Empty description="Chưa có đánh giá nào" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          <div className="space-y-4">
            {reviews.map(renderReview)}
          </div>
        )}
      </Card>
    </div>
  )
}

export default ReviewProduct;
