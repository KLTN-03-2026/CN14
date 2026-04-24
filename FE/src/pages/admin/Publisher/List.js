import {
  Button,
  Card,
  Input,
  Table,
  Form,
  Row,
  Col,
  Select,
} from "antd";
import { useMemo, useState, useCallback } from "react";
import { getCookie } from "../../../helpers/cookie";
import DeleteItem from "../../../components/DeleteItem";
import NoRole from "../../../components/NoRole";
import usePublishers from "../../../hooks/admin/usePublishers";
import AuthorEdit from "./Edit";

function PublisherList() {
  const permissions = useMemo(
    () => JSON.parse(localStorage.getItem("permissions")) || [],
    []
  );

  const token = getCookie("token");

  // State quản lý
  const [limit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [sortKey, setSortKey] = useState("default");
  const [sortType, setSortType] = useState("asc");

  const { publishersQuery } = usePublishers({
    token,
    currentPage,
    limit,
    keyword,
    sortKey,
    sortType,
  });

  // Dữ liệu
  const data = publishersQuery.data?.publishers || [];
  const totalPage = publishersQuery.data?.totalPage || 0;

  // Reload table khi cần
  const handleReload = useCallback(() => {
    publishersQuery.refetch();
  }, [publishersQuery]);

  // Xử lý tìm kiếm
  const onFinish = useCallback((values) => {
    setKeyword(values.keyword?.trim() || "");
    setCurrentPage(1);
  }, []);

  // Thay đổi sắp xếp
  const handleChangePosition = useCallback((value) => {
    setSortKey(value === "default" ? "default" : "position");
    setSortType(value);
  }, []);

  // 🔧 Cấu hình cột Table
  const columns = useMemo(
    () => [
      {
        title: "Tên nhà xuất bản",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
      },
      {
        title: "Địa chỉ",
        dataIndex: "address",
        key: "address",
      },
      {
        title: "Số điện thoại",
        dataIndex: "phone",
        key: "phone",
      },
      {
        title: "Ảnh",
        dataIndex: "thumbnail",
        key: "thumbnail",
        render: (thumbnail) => (
          <img
            src={thumbnail}
            alt="thumbnail"
            style={{ width: 70, marginTop: 10 }}
          />
        ),
      },
      {
        title: "Hành động",
        key: "actions",
        render: (_, record) => (
          <div style={{ display: "flex", gap: 8 }}>
            {permissions.includes("publishers_edit") && (
              <AuthorEdit record={record} key={`edit-${record._id}`} />
            )}
            {permissions.includes("publishers_del") && (
              <DeleteItem
                record={record}
                key={`delete-${record._id}`}
                typeDelete="publisher"
                onReload={handleReload}
              />
            )}
          </div>
        ),
      },
    ],
    [permissions, handleReload]
  );

  // Không có quyền thì return luôn
  if (!permissions.includes("authors_view")) return <NoRole />;

  return (
    <Card title="Danh sách nhà xuất bản">
      {/* Tìm kiếm + Sắp xếp */}
      <Form onFinish={onFinish} layout="vertical">
        <Row gutter={[12, 12]}>
          <Col span={22}>
            <Form.Item name="keyword">
              <Input
                allowClear
                placeholder="Tìm kiếm nhà xuất bản..."
                onChange={(e) => setKeyword(e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col span={2}>
            <Form.Item name="btnSearch">
              <Button type="primary" htmlType="submit">
                Tìm kiếm
              </Button>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label="Vị trí" name="sortPosition" initialValue="default">
              <Select
                onChange={handleChangePosition}
                options={[
                  { label: "Mặc định", value: "default" },
                  { label: "Tăng", value: "asc" },
                  { label: "Giảm", value: "desc" },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>

      {/* Bảng thương hiệu */}
      <Card style={{ marginTop: 10 }} type="inner">
        <Table
          dataSource={data}
          columns={columns}
          rowKey="_id"
          loading={publishersQuery.isLoading}
          pagination={{
            current: currentPage,
            pageSize: limit,
            total: limit * totalPage,
            showSizeChanger: false,
            style: { display: "flex", justifyContent: "center" },
            onChange: (page) => setCurrentPage(page),
          }}
        />
      </Card>
    </Card>
  );
}

export default PublisherList;
