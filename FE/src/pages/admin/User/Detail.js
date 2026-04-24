import { Button, Card, Col, message, Modal, Row, Table, Tag, Typography } from "antd";
import { useEffect, useState } from "react";
import { EyeOutlined } from "@ant-design/icons";
import NoRole from "../../../components/NoRole";
import { ordersByUserGet } from "../../../services/admin/userServies";
import { getCookie } from "../../../helpers/cookie";

const UserDetail = (props) => {
  const permissions = JSON.parse(localStorage.getItem('permissions'));
  const token = getCookie("token");

  const { user_id, user } = props;

  const [orders, setOrder] = useState([]);
  const [voucherGifts, setVoucherGift] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchApi = async () => {
    const response = await ordersByUserGet(token, user_id);

    if (response.code === 200) {
      setOrder(response.data.orders);
      setVoucherGift(response.data.voucherGifts);
    } else {
      message.error(response.message)
    }
  }
  useEffect(() => {
    fetchApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // Data đổ vào table
  const columns = [
    {
      title: 'Mã đơn',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (_, record) => {
        return (
          <>
            <b>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
              .format(record.totalOrder - record.discountAmount + record.shippingFee)}</b>
          </>
        )
      }
    },
    {
      title: 'Mã voucher',
      dataIndex: 'voucher_code',
      key: 'voucher_code'
    },
    {
      title: 'Phương thức thanh toán',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod'
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => formatDate(text)
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (_, record) => {
        const statusMap = {
          initialize: { label: "Khởi tạo", color: "default" },
          confirmed: { label: "Đã xác nhận", color: "gold" },
          received: { label: "Đã thanh toán", color: "blue" },
          processing: { label: "Đang xử lý", color: "orange" },
          shipping: { label: "Đang giao hàng", color: "geekblue" },
          completed: { label: "Hoàn thành", color: "green" },
          cancelled: { label: "Đã hủy", color: "red" },
          returned: { label: "Hoàn trả / Hoàn tiền", color: "volcano" },
        };

        const status = statusMap[record.status] || { label: "Không xác định", color: "default" };

        return (
          <Tag color={status.color} key={`${record.status}-${record.code}`} style={{ cursor: "pointer" }}>
            {status.label}
          </Tag>
        );
      }
    }
  ];

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  return (
    <>
      {permissions.includes("orders_view") ?
        <>
          <Button icon={<EyeOutlined />} type="primary" ghost onClick={showModal} />
          <Modal
            title="Thông tin khách hàng"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={null}
            width={"80%"}
          >
            <Row>
              <Col span={12}>
                <Card
                  title="Thông tin khách hàng"
                  style={{
                    marginTop: 10,
                    width: "100%",
                    height: "100%"
                  }}
                  type="inner"
                >
                  <p>Tên: <b>{user.fullName}</b></p>
                  <p>Số điện thoại: <b>{user.phone}</b></p>
                  <p>Địa chỉ: <b>{user.address}</b></p>
                  <p>Email: <b>{user.email}</b></p>
                  <p>Điểm tích lũy: <b>{user.points} điểm</b></p>
                  <p>Nhà cung cấp: <b>{user.provider}</b></p>
                  <p>Ngày đăng ký: <b>{formatDate(user.createdAt)}</b></p>
                  {orders.length > 0 && (
                    <>
                      <p>Tổng chi tiêu: <b>{Number(orders.reduce((sum, i) => {
                        if (i.status === "completed") {
                          sum += Number(i.totalOrder - i.discountAmount + i.shippingFee);
                        }
                        return sum
                      }, 0)).toLocaleString()} đ</b></p>
                    </>
                  )}
                  <p>
                    Hạng:{" "}
                    <span
                      style={{
                        color:
                          user.rank === "Diamond"
                            ? "#00FFFF"
                            : user.rank === "Platinum"
                              ? "#B0E0E6"
                              : user.rank === "Gold"
                                ? "#FFD700"
                                : user.rank === "Silver"
                                  ? "#C0C0C0"
                                  : "#8B4513", // Member
                        fontWeight: "bold",
                      }}
                    >
                      {user.rank || "Member"}
                    </span>
                  </p>

                </Card>
              </Col>
              <Col span={12}>
                <Card
                  title="Phiếu quà tặng"
                  style={{
                    marginTop: 10,
                    width: "100%",
                    height: "100%"
                  }}
                  type="inner"
                >
                  <Row gutter={[12, 12]}>
                    {voucherGifts.map((voucher) => (
                      <Col span={6} key={voucher._id}>
                        <div
                          key={voucher._id}
                          className="border border-red-300 rounded-xl p-1 text-center shadow-sm hover:shadow-md transition"
                        >
                          {/* Mã voucher */}
                          <div className="text-red-600 font-bold text-lg mb-2 uppercase tracking-wide">
                            {voucher.code}
                          </div>

                          {/* Giảm giá */}
                          {voucher.discount > 100 ? (
                            <div className="text-base text-gray-700 mb-1">
                              Giảm:{" "}
                              <span className="font-semibold text-gray-900">
                                {Number(voucher.discount).toLocaleString()}đ
                              </span>
                            </div>
                          ) : (
                            <div className="text-base text-gray-700 mb-1">
                              Giảm:{" "}
                              <span className="font-semibold text-gray-900">
                                {voucher.discount}%
                              </span>
                            </div>
                          )}

                          {/* Giá trị tối thiểu */}
                          <div className="text-sm text-gray-600 mb-2">
                            Đơn tối thiểu:{" "}
                            <span className="font-semibold text-gray-800">
                              {Number(voucher.minOrderValue).toLocaleString()}đ
                            </span>
                          </div>

                          {/* Hạn sử dụng */}
                          <p className="text-sm text-gray-700 mb-3">
                            Hạn sử dụng:{" "}
                            <span className="font-semibold text-gray-900">
                              {new Date(voucher.expiredAt).toLocaleDateString("vi-VN")}
                            </span>
                          </p>

                          {/* Trạng thái */}
                          <div className="mb-3">
                            {voucher.used ? (
                              <Tag color="red" className="text-sm px-2 py-1 rounded-md">
                                Đã sử dụng
                              </Tag>
                            ) : (
                              <Tag color="green" className="text-sm px-2 py-1 rounded-md">
                                Chưa dùng
                              </Tag>
                            )}
                          </div>
                        </div>
                      </Col>
                    ))
                    }
                  </Row>
                </Card>
              </Col>
              <Col span={24}>
                <Table
                  dataSource={orders}
                  columns={columns}
                  className='table-list'
                  rowKey={(record) => record._id} // Đảm bảo rằng mỗi hàng trong bảng có key duy nhất
                  pagination={{
                    pageSize: 5, // Số mục trên mỗi trang
                    total: orders.length || 0, // Tổng số mục (dựa trên data)
                    showSizeChanger: false, // Ẩn tính năng thay đổi số mục trên mỗi trang
                    style: { display: 'flex', justifyContent: 'center' } // Căn giữa phân trang
                  }}
                />
              </Col>
            </Row>
          </Modal>
        </>
        :
        <NoRole />
      }
    </>
  )
}

export default UserDetail;