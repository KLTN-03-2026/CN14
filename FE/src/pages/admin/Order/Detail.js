import { Button, Card, Col, message, Modal, Row, Table, Tag, Typography } from "antd";
import { useEffect, useState } from "react";
import { DeleteOutlined, ExclamationCircleFilled, EyeOutlined } from "@ant-design/icons";
import NoRole from "../../../components/NoRole";
import OrderEdit from "./Edit";
import useOrders from "../../../hooks/admin/useOrders";
import { getCookie } from "../../../helpers/cookie";
const { confirm } = Modal;
const { Text } = Typography;

const OrderDetail = (props) => {
  const permissions = JSON.parse(localStorage.getItem('permissions'));
  const token = getCookie("token");

  const { record, shippingFee } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [products, setProducts] = useState([]);

  const { removeProducts } = useOrders({
    token
  });

  const fetchApi = async () => {
    setProducts(record.products);
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

  // Xoa san pham khoi don hang
  const showDeleteConfirm = (e) => {
    confirm({
      title: `Bạn chắc chắn muốn xóa sản phẩm này khỏi đơn hàng?`,
      icon: <ExclamationCircleFilled />,
      content: 'Xác nhận xóa!',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {

        if(record.products.length === 1){
          message.error("Đơn hàng phải có ít nhất một sản phẩm!");
          return;
        }

        const payload = {
          order_id: record._id,
          product_id: e.product_id,
          size: e.size
        }
        
        removeProducts.mutate({ payload }, {
          onSuccess: (response) => {
            if (response?.code === 200) {
              handleCancel();
            }
          }
        });
      },
      onCancel() {

      },
    });
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
      render: (text) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(text)
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
      render: (text) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(text)
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (_, record) => {
        return (
          <>
            <b>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(record.newPrice) * record.quantity)}</b>
          </>
        )
      }
    },
    {
      title: 'Hành động',
      dataIndex: 'actions',
      key: 'actions',
      render: (_, rec) => {
        return (
          <div>
            {permissions.includes("orders_edit") && record.status === "initialize" && (
              <Button style={{ marginLeft: 8 }} icon={<DeleteOutlined />}
                type="primary" ghost danger onClick={() => showDeleteConfirm(rec)} />
            )}
          </div>
        )
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
                    <p>Email: {record.email}</p>
                    <p>Ngày tạo: {formatDate(record.createdAt)}</p>
                  </Card>
                </Card>
              </Col>
              <Col span={24} style={{ marginTop: 10 }}>
                <div style={{ textAlign: 'right', marginBottom: 10 }}>
                  {permissions.includes("orders_edit") && record.status === "initialize" &&
                    <OrderEdit record={record} />
                  }
                </div>
                <Table
                  dataSource={products}
                  columns={columns}
                  className='table-list'
                  rowKey={(record) => record._id} // Đảm bảo rằng mỗi hàng trong bảng có key duy nhất
                  pagination={{
                    pageSize: 5, // Số mục trên mỗi trang
                    total: record.products?.length || 0, // Tổng số mục (dựa trên data)
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
        :
        <NoRole />
      }
    </>
  )
}

export default OrderDetail;