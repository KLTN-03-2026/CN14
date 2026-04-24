import { Button, Card, Col, Modal, Row, Table, Tag, Typography } from "antd";
import { useState } from "react";
import { EyeOutlined } from "@ant-design/icons";
const { Text } = Typography;

const OrderDetail = (props) => {
  const { record } = props;

  const [isModalOpen, setIsModalOpen] = useState(false);

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
      title: 'Tên sản phẩm',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: 'Giá cũ',
      dataIndex: 'price',
      key: 'price',
      render: (text) => <span>{Number(text.toString()).toLocaleString()} VNĐ</span>
    },
    {
      title: '% Giảm giá',
      dataIndex: 'discountPercentage',
      key: 'discountPercentage',
    },
    {
      title: 'Giá mới',
      dataIndex: 'newPrice',
      key: 'newPrice',
      render: (text) => <span>{Number(text.toString()).toLocaleString()} VNĐ</span>
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (text) => <span>{Number(text.toString()).toLocaleString()} VNĐ</span>
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
      <Button icon={<EyeOutlined />} type="primary" ghost onClick={showModal} />
      <Modal
        title="Chi tiết đơn hàng"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        width={"70%"}
      >
        <Row>
          <Col span={24}>
            <Card title="Thông tin khách hàng" style={{ height: "100%" }}>
              <Card
                style={{
                  marginTop: 10,
                  width: "100%"
                }}
                type="inner"
              >
                <p>Tên: {record.fullName}</p>
                <p>Số điện thoại: {record.phone}</p>
                <p>Địa chỉ: {record.address}</p>
                <p>Ngày tạo: {formatDate(record.createdAt)}</p>
              </Card>
            </Card>
          </Col>
          <Col span={24}>
            <Table
              dataSource={record.products ? record.products : []}
              columns={columns}
              className='table-list'
              rowKey={(record) => record._id} // Đảm bảo rằng mỗi hàng trong bảng có key duy nhất
              pagination={{
                pageSize: 5, // Số mục trên mỗi trang
                total: record.products.length, // Tổng số mục (dựa trên data)
                showSizeChanger: false, // Ẩn tính năng thay đổi số mục trên mỗi trang
                style: { display: 'flex', justifyContent: 'center' } // Căn giữa phân trang
              }}
            />
          </Col>
          <Col span={24}>
            <b>Trạng thái: {
              (() => {
                const statusMap = {
                  initialize: { label: "Khởi tạo", color: "default" },
                  confirmed: { label: "Đã xác nhận đơn", color: "gold" },
                  received: { label: "Đã thanh toán", color: "blue" },
                  processing: { label: "Đang xử lý", color: "orange" },
                  shipping: { label: "Đang giao hàng", color: "geekblue" },
                  completed: { label: "Hoàn thành", color: "green" },
                  cancelled: { label: "Đã hủy", color: "red" },
                  returned: { label: "Hoàn trả / Hoàn tiền", color: "volcano" },
                };

                const st = statusMap[record.status] || { label: "Không xác định", color: "default" };
                return <Tag color={st.color}>{st.label}</Tag>;
              })()
            }</b>
            <br />
            <Row justify="space-between">
              <Col>
                <Text>🚚 Phí vận chuyển:  </Text>
                {record.shippingFee === 0 ? (
                  <b><Text>Miễn phí</Text></b>
                ) : (
                  <Text>{Number(record.shippingFee).toLocaleString()} đ</Text>
                )}
              </Col>
            </Row>
            <Row justify="space-between">
              <Col>
                <Text>Giảm:  </Text>
                <Text>{Number(record.discountAmount).toLocaleString()} đ</Text>
              </Col>
            </Row>
            <Row justify="space-between">
              <Col>
                <Text>Tổng tiền:  </Text>
                <b>
                  {Number(record.totalOrder - record.discountAmount + record.shippingFee).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                </b>
              </Col>
            </Row>
          </Col>
        </Row>
      </Modal>
    </>
  )
}

export default OrderDetail;