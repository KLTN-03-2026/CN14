import { Card, Input, Table, Tag, Form, Row, Col, Select } from "antd";
import { useMemo, useState, useCallback } from "react";
import { getCookie } from "../../../helpers/cookie";
import NoRole from "../../../components/NoRole";
import useTransactions from "../../../hooks/admin/useTransactions";
import dayjs from "dayjs";
dayjs.locale("vi")

function Transaction() {
  const permissions = useMemo(() => JSON.parse(localStorage.getItem("permissions")) || [], []);
  const token = getCookie("token");

  // 🧩 State quản lý phân trang, lọc, sắp xếp
  const [limit] = useState(15);
  const [currentPage, setCurrentPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [sortKey, setSortKey] = useState("default");
  const [status, setStatus] = useState("default");
  const [provider, setProvider] = useState("default");
  const [sortType, setSortType] = useState("asc");

  const { transactionsQuery } = useTransactions({
    token,
    currentPage,
    limit,
    keyword,
    sortKey,
    sortType,
    status,
    provider
  });

  // Lấy dữ liệu sản phẩm
  const data = transactionsQuery.data?.transactions ?? [];
  const totalPage = transactionsQuery.data?.totalPage ?? 0;

  const handleSearch = useCallback((values) => setKeyword(values.keyword || ""), []);

  const handleSortChange = useCallback((key) => (value) => {
    setSortKey(key);
    setSortType(value);
  }, []);

  const handleChangeStatus = useCallback((key) => (value) => {
    setStatus(value);
  }, []);

  const handleChangeProvider = useCallback((key) => (value) => {
    setProvider(value);
  }, []);

  const columns = useMemo(
    () => [
      {
        title: "Mã đơn hàng",
        dataIndex: "code_TxnRef",
        key: "code_TxnRef",
      },
      {
        title: "Số tiền",
        dataIndex: "amount",
        key: "amount",
        render: (amount) =>
          new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount),
      },
      {
        title: "Nhà cung cấp",
        dataIndex: "provider",
        key: "provider",
      },
      {
        title: 'Tạo lúc',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (_, record) => {
          return (
            <>
              <b>{dayjs(record.createdAt).format("DD/MM/YYYY HH:mm")}</b>
            </>
          );
        }
      },
      {
        title: 'Cập nhật lúc',
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        render: (_, record) => {
          return (
            <>
              <b>{dayjs(record.updatedAt).format("DD/MM/YYYY HH:mm")}</b>
            </>
          );
        }
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        render: (_, record) => {
          let color = "";
          switch (record.status) {
            case "paid":
              color = "success"; // xanh lá
              break;
            case "pending":
              color = "warning"; // vàng
              break;
            case "expired":
              color = "error"; // đỏ
              break;
            default:
              color = "default";
          }

          return (
            <Tag color={color} style={{ textTransform: "capitalize" }}>
              {record.status}
            </Tag>
          );
        },
      },

    ], []);

  // 🧭 Render giao diện
  if (!permissions.includes("orders_view")) return <NoRole />;

  return (
    <Card title="Lịch sử giao dịch">
      <Form onFinish={handleSearch} layout="vertical">
        <Row gutter={[12, 12]}>
          <Col span={22}>
            <Form.Item name="keyword">
              <Input
                allowClear
                placeholder="Tìm kiếm mã đơn hàng"
                onChange={(e) => setKeyword(e.target.value)}
              />
            </Form.Item>
          </Col>

          {/* Sort số tiền */}
          <Col span={4}>
            <Form.Item label="Sắp xếp theo số tiền" name="sortAmount" initialValue="default">
              <Select
                onChange={handleSortChange("amount")}
                options={[
                  { label: "Mặc định", value: "default" },
                  { label: "Tăng", value: "asc" },
                  { label: "Giảm", value: "desc" },
                ]}
              />
            </Form.Item>
          </Col>

          {/* Sort nhà cung cấp*/}
          <Col span={4}>
            <Form.Item label="Nhà cung cấp" name="provider" initialValue="default">
              <Select
                onChange={handleChangeProvider("provider")}
                options={[
                  { label: "Tất cả", value: "default" },
                  { label: "VN-Pay", value: "vnpay" },
                  { label: "Momo-Pay", value: "momo" },
                ]}
              />
            </Form.Item>
          </Col>

          {/* Sort status */}
          <Col span={4}>
            <Form.Item label="Trạng thái" name="status" initialValue="default">
              <Select
                onChange={handleChangeStatus("status")}
                options={[
                  { label: "Tất cả", value: "default" },
                  { label: "Chưa giải quyết", value: "pending" },
                  { label: "Đã thanh toán", value: "paid" },
                  { label: "Hết hạn", value: "expired" },
                ]}
              />
            </Form.Item>
          </Col>

        </Row>
      </Form>

      <Card style={{ marginTop: 10 }} type="inner">
        <Table
          dataSource={data}
          columns={columns}
          rowKey="_id"
          loading={transactionsQuery.isFetching}
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
  );
}

export default Transaction;
