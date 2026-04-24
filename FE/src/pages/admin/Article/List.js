import { useState } from "react";
import { getCookie } from "../../../helpers/cookie";
import { Card, Col, Form, message, Row, Select, Table, Tag } from "antd";
import DeleteItem from "../../../components/DeleteItem";
import ArticleEdit from "./Edit";
import NoRole from "../../../components/NoRole";
import useArticles from "../../../hooks/admin/useArticles";
import { useMemo } from "react";
import { useCallback } from "react";
import dayjs from "dayjs";

dayjs.locale("vi")

function ArticleList() {
  const permissions = useMemo(() => JSON.parse(localStorage.getItem("permissions")) || [], []);
  const token = getCookie("token");

  // 🧩 State quản lý phân trang, lọc, sắp xếp
  const [limit] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState("default");
  const [sortType, setSortType] = useState("asc");

  const { articlesQuery, updateStatus } = useArticles({
    token,
    currentPage,
    limit,
    sortKey,
    sortType,
  });

  // Lấy dữ liệu sản phẩm
  const articles = articlesQuery.data?.articles ?? [];
  const totalPage = articlesQuery.data?.totalPage ?? 0;

  // 🧠 Handlers (memoized để tránh re-render)
  const handleChangeStatus = useCallback(
    (e) => {
      const [statusChange, id] = e.target.dataset.id.split("-");
      if (!permissions.includes("articles_edit"))
        return message.error("Bạn không có quyền chỉnh sửa sản phẩm!");
      updateStatus.mutate({ statusChange, id });
    }, [permissions, updateStatus]);

  const handleSortChange = useCallback((key) => (value) => {
    setSortKey(key);
    setSortType(value);
  }, []);

  const columns = useMemo(
    () => [
      {
        title: 'Tiều đề',
        dataIndex: 'title',
        key: 'title',
      },
      {
        title: 'Ảnh',
        dataIndex: 'thumbnail',
        key: 'thumbnail',
        render: (_, record) => {
          return (
            <>
              <img
                src={record.thumbnail}
                alt="Uploaded"
                style={{ width: "70px", display: "block", marginTop: "10px" }}
              />
            </>
          )
        }
      },
      {
        title: 'Vị trí',
        dataIndex: 'position',
        key: 'position',
      },
      {
        title: 'Nổi bật?',
        dataIndex: 'featured',
        key: 'featured',
        render: (_, record) => {
          return (
            <>
              {record.featured === "1" ? (
                <Tag color={"#7FC25D"} key={`inactive-${record._id}`}
                  style={{
                    cursor: "pointer",
                    userSelect: "none"
                  }} >
                  Nổi bật
                </Tag>
              ) : (
                <Tag color={"#cd201f"} key={`active-${record._id}`}
                  style={{
                    cursor: "pointer",
                    userSelect: "none"
                  }}>
                  Không nổi bật
                </Tag>
              )}
            </>
          )
        }
      },
      {
        title: 'Người tạo',
        dataIndex: 'fullName',
        key: 'fullName',
        render: (_, record) => {
          return (
            <>
              <p>{record.createBy.fullName || 'N/A'}</p>
              <b>{record.createdAt ? dayjs(record.createdAt).format("DD/MM/YYYY HH:mm") : 'N/A'}</b>
            </>
          );
        }
      },
      {
        title: 'Cập nhật bởi',
        dataIndex: 'updatedBy',
        key: 'updatedBy',
        render: (_, record) => {
          const latestUpdate = record.updatedBy?.[record.updatedBy.length - 1];
          return (
            <>
              <p>{latestUpdate?.fullName || 'N/A'}</p>
              <b>{latestUpdate ? dayjs(record.updatedAt).format("DD/MM/YYYY HH:mm") : 'N/A'}</b>
            </>
          );
        }
      },
      {
        title: 'Trạng thái',
        dataIndex: 'status',
        key: 'status',
        render: (_, record) => {
          return (
            <>
              {permissions.includes("articles_edit") ? (
                <>
                  <Tag
                    color={record.status === "inactive" ? "#cd201f" : "#55acee"}
                    data-id={
                      record.status === "inactive"
                        ? `active-${record._id}`
                        : `inactive-${record._id}`
                    }
                    onClick={handleChangeStatus}
                    style={{ cursor: "pointer" }}
                  >
                    {record.status === "inactive" ? "Ngừng hoạt động" : "Hoạt động"}
                  </Tag>
                </>
              ) : (
                <>
                  <Tag
                    color={record.status === "inactive" ? "#cd201f" : "#55acee"}
                    data-id={
                      record.status === "inactive"
                        ? `active-${record._id}`
                        : `inactive-${record._id}`
                    }
                  >
                    {record.status === "inactive" ? "Ngừng hoạt động" : "Hoạt động"}
                  </Tag>
                </>
              )}
            </>
          )
        }
      },
      {
        title: 'Hành động',
        dataIndex: 'actions',
        key: 'actions',
        render: (_, record) => {
          return (
            <>
              <div>
                {permissions.includes("articles_edit") && (
                  <ArticleEdit record={record} key={`edit-${record._id}`} />
                )}
                {permissions.includes("articles_del") && (
                  <DeleteItem record={record} key={`delete-${record._id}`} typeDelete="article" />
                )}
              </div>
            </>
          )
        }
      }
    ], [permissions, handleChangeStatus]);

  if (!permissions.includes("articles_view")) return <NoRole />;

  return (
    <>
      <Card title="Danh sách bài viết">
        <Form layout="vertical">
          <Row gutter={[12, 12]}>
            {/* Sort giá */}
            <Col span={6}>
              <Form.Item label="Vị trí" name="sortPosition" initialValue="default">
                <Select
                  onChange={handleSortChange("position")}
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

        <Card style={{ marginTop: 10 }} type="inner">
          <Table
            dataSource={articles}
            columns={columns}
            rowKey="_id"
            loading={articlesQuery.isFetching}
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
    </>
  )
}

export default ArticleList;