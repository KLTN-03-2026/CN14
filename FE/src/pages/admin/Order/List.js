import { useMemo, useState } from "react";
import { getCookie } from "../../../helpers/cookie";
import { Badge, Button, Card, Col, DatePicker, Form, Input, message, Modal, Row, Select, Space, Table } from "antd";
import OrderDetail from "./Detail";
import NoRole from "../../../components/NoRole";
import { formatDate } from "../../../helpers/dateTime";
import ShippingSetting from "./Shipping"
import { useCallback } from "react";
import useOrders from "../../../hooks/admin/useOrders";

function OrderList() {
  const permissions = useMemo(() => JSON.parse(localStorage.getItem("permissions")) || [], []);
  const token = getCookie("token");

  const [limit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [keyword, setKeyword] = useState("");

  const { updateStatus, ordersQuery } = useOrders({
    token,
    currentPage,
    limit,
    keyword,
    day,
    month
  });

  // Lấy dữ liệu sản phẩm
  const data = ordersQuery.data?.orders.map(order => ({
    _id: order._id,
    fullName: order.userInfo.fullName,
    phone: order.userInfo.phone,
    address: order.userInfo.address,
    totalOrder: order.totalOrder,
    createdAt: order.createdAt,
    quantityOrder: order.products.reduce((sum, product) => sum + product.quantity, 0),
    products: order.products,
    paymentMethod: order.paymentMethod,
    code: order.code,
    status: order.status,
    email: order.userInfo.email,
    shippingFee: order.shippingFee,
    discountAmount: order.discountAmount,
    voucher_code: order.voucher_code,
    user_id: order.user_id
  })) ?? [];
  const totalPage = ordersQuery.data?.totalPage ?? 0;

  const handleChangeStatus = useCallback(
    (e, code) => {
      if (!permissions.includes("orders_edit"))
        return message.error("Bạn không có quyền chỉnh sửa đơn hàng!");
      Modal.confirm({
        title: "Xác nhận thay đổi trạng thái",
        content: `Bạn có chắc muốn chuyển đơn hàng sang trạng thái "${e}" không?`,
        okText: "Xác nhận",
        cancelText: "Hủy",
        onOk: () => {
          updateStatus.mutate({ statusChange: e, code: code });
        },
      });

    }, [permissions, updateStatus]);

  // Data đổ vào table

  const columns = useMemo(
    () => [
      {
        title: 'Họ tên',
        dataIndex: 'fullName',
        key: 'fullName'
      },
      {
        title: 'CODE',
        dataIndex: 'code',
        key: 'code',
        render: (_, record) => {
          return (
            <span>
              {record.status === "initialize" ? (
                <Badge dot><b >{record.code}</b></Badge>
              ) : (
                <b>{record.code}</b>
              )}
            </span>
          )
        }
      },
      {
        title: 'SĐT',
        dataIndex: 'phone',
        key: 'phone',
      },
      {
        title: 'Khách hàng',
        dataIndex: 'user_id',
        key: 'user_id',
        render: (_, record) => {
          return (
            <span>
              {record.user_id ? (
                <p style={{ color: "blue" }}>Thành viên</p>
              ) : (
                <p style={{ color: "red" }}>Vãng lai
                </p>
              )}
            </span>
          )
        }
      },
      {
        title: 'Phương thức thanh toán',
        dataIndex: 'paymentMethod',
        key: 'paymentMethod',
      },
      {
        title: 'Trạng thái',
        dataIndex: 'status',
        key: 'status',
        render: (_, record) => {
          // Tính toán option cần disable
          const disabledOptions = {
            initialize: ['initialize', 'received', 'processing', 'shipping', 'completed', 'returned'],
            received: ['initialize', 'received', 'shipping', 'completed', 'processing'],
            confirmed: ['initialize', 'confirmed', 'received', 'shipping', 'completed', 'returned'],
            processing: ['initialize', 'confirmed', 'processing', 'completed', 'returned', 'received'],
            shipping: ['initialize', 'confirmed', 'received', 'processing', 'shipping', 'returned'],
            completed: ['initialize', 'confirmed', 'received', 'processing', 'shipping', 'completed', 'cancelled'],
            cancelled: ['initialize', 'confirmed', 'received', 'processing', 'shipping', 'completed', 'cancelled', 'returned'],
            returned: ['initialize', 'confirmed', 'received', 'processing', 'shipping', 'completed', 'cancelled', 'returned'],
          };

          return (
            <Select
              defaultValue={record.status}
              style={{ width: 180 }}
              onChange={(value) => handleChangeStatus(value, record.code)}
            >
              <Select.Option
                value="initialize"
                disabled={disabledOptions[record.status].includes("initialize")}
              >
                <span>Khởi tạo</span>
              </Select.Option>

              <Select.Option
                value="received"
                disabled={disabledOptions[record.status].includes("received")}
              >
                <span >Đã thanh toán</span>
              </Select.Option>

              <Select.Option
                value="confirmed"
                disabled={disabledOptions[record.status].includes("confirmed")}
              >
                <span>Đã xác nhận đơn</span>
              </Select.Option>

              <Select.Option
                value="processing"
                disabled={disabledOptions[record.status].includes("processing")}
              >
                <span>Đang xử lý đơn</span>
              </Select.Option>

              <Select.Option
                value="shipping"
                disabled={disabledOptions[record.status].includes("shipping")}
              >
                <span>Đang giao hàng</span>
              </Select.Option>

              <Select.Option
                value="completed"
                disabled={disabledOptions[record.status].includes("completed")}
              >
                <span style={{ color: "green" }}>Hoàn thành</span>
              </Select.Option>

              <Select.Option
                value="cancelled"
                disabled={disabledOptions[record.status].includes("cancelled")}
              >

                <span style={{ color: "red" }}>Đã hủy</span>
              </Select.Option>

              <Select.Option
                value="returned"
                disabled={disabledOptions[record.status].includes("returned")}
              >
                <span>Hoàn hàng / Hoàn tiền</span>
              </Select.Option>
            </Select>

          );
        }
      },
      {
        title: 'Tổng tiền',
        dataIndex: 'totalOrder',
        key: 'totalOrder',
        render: (_, record) => {
          return (
            <span>{Number(record.totalOrder - record.discountAmount + record.shippingFee).toLocaleString()}đ
            </span>
          )
        }
      },
      {
        title: 'Số lượng SP',
        dataIndex: 'quantityOrder',
        key: 'quantityOrder',
      },
      {
        title: 'Voucher',
        dataIndex: 'voucher_code',
        key: 'voucher_code',
      },
      {
        title: 'Ngày tạo',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (text) => formatDate(text)
      },
      {
        title: 'Hành động',
        dataIndex: 'actions',
        key: 'actions',
        render: (_, record) => {
          return (
            <>
              <div key={`action-${record._id}`}>
                <OrderDetail record={record} shippingFee={record.shippingFee} />
              </div>
            </>
          )
        }
      }
    ], [handleChangeStatus]
  )

  const onChangeDay = (_date, dateString) => {
    setMonth("");
    setDay(dateString);
  };
  const onChangeMonth = (_date, dateString) => {
    setDay("");
    setMonth(dateString);
  };
  const handleSearch = useCallback((values) => setKeyword(values.keyword || ""), []);

  return (
    <>
      {permissions.includes("orders_view") ?
        <Card title="Danh sách đơn hàng" style={{ height: "100vh" }}>
          <Form onFinish={handleSearch} layout="vertical">
            <Row gutter={[12, 12]}>
              <Col span={22}>
                <Form.Item name="keyword">
                  <Input
                    allowClear
                    placeholder="Tìm kiếm theo SĐT, mã đơn hàng"
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                </Form.Item>
              </Col>
              <Col span={2}>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Tìm kiếm
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <Card
            style={{
              marginTop: 10,
              width: "100%"
            }}
            type="inner"
          >
            <Space direction="horizontal" size={12} style={{ marginBottom: 10 }}>
              <DatePicker onChange={onChangeDay} />
              <DatePicker onChange={onChangeMonth} picker="month" />
              <ShippingSetting />
            </Space>
            <Table
              dataSource={data}
              columns={columns}
              rowKey="_id"
              loading={ordersQuery.isFetching}
              pagination={{
                current: currentPage,
                pageSize: limit,
                total: limit * totalPage,
                showSizeChanger: false,
                onChange: setCurrentPage,
                style: { display: "flex", justifyContent: "center" },
              }}
            />
          </Card>
        </Card>
        :
        <NoRole />
      }
    </>
  )
}

export default OrderList;