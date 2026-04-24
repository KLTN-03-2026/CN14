import { Card, Table, Tag, Form, Row, Col, Select, message } from 'antd';
import { useCallback, useMemo, useState } from 'react';
import { getCookie } from "../../../helpers/cookie";
import DeleteItem from '../../../components/DeleteItem';
import CategoriesEdit from './Edit';
import NoRole from '../../../components/NoRole';
import useCategories from '../../../hooks/admin/useCategories';
import { useEffect } from 'react';
import { listAllCategory } from '../../../services/admin/categoryServies';

function CategoriesList() {
  const permissions = useMemo(() => JSON.parse(localStorage.getItem("permissions")) || [], []);
  const token = getCookie("token");

  const [categories, setCategories] = useState([]);

  // 🧩 State quản lý phân trang, lọc, sắp xếp
  const [limit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState("default");
  const [sortType, setSortType] = useState("asc");
  const [status, setStatus] = useState("default");

  const { updateStatus, categoriesQuery } = useCategories({
    token,
    currentPage,
    limit,
    sortKey,
    sortType,
    status
  });

  // Lấy dữ liệu sản phẩm
  const data = categoriesQuery.data?.productCategories ?? [];
  const totalPage = categoriesQuery.data?.totalPage ?? 0;

  useEffect(() => {
    const fetchApi = async () => {
      if (!token) {
        message.error("Token không tồn tại, vui lòng đăng nhập!");
        return;
      }

      try {
        const response = await listAllCategory(token); // Truyền token vào hàm
        if (response) {
          setCategories(response.data);
        }
      } catch (error) {
        message.error("Lỗi khi tải thể loại:", error.message);
      }
    };

    fetchApi();
  }, [token]);

  // 🧠 Handlers (memoized để tránh re-render)
  const handleChangeStatus = useCallback(
    (e) => {
      const [statusChange, id] = e.target.dataset.id.split("-");
      if (!permissions.includes("products_category_edit"))
        return message.error("Bạn không có quyền chỉnh sửa sản phẩm!");
      updateStatus.mutate({ statusChange, id });
    }, [permissions, updateStatus]);

  const handleSortChange = useCallback((key) => (value) => {
    setSortKey(key);
    setSortType(value);
  }, []);

  const handleSortStatus = useCallback((key) => (value) => {
    setStatus(value);
  }, []);

  const columns = useMemo(
    () => [
      {
        title: 'Thể loại',
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
        title: 'Trạng thái',
        dataIndex: 'status',
        key: 'status',
        render: (_, record) => {
          return (
            <>
              {permissions.includes("products_category_edit") ? (
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
                {permissions.includes("products_category_edit") && (
                  <CategoriesEdit categories={data} record={record} key={`edit-${record._id}`} />
                )}
                {permissions.includes("products_category_del") && (
                  <DeleteItem record={record} key={`delete-${record._id}`} typeDelete="product-category" />
                )}
              </div>
            </>
          )
        }
      }
    ], [categories, handleChangeStatus, permissions, data]);


  if (!permissions.includes("products_category_view")) return <NoRole />;

  return (
    <>
      <Card title="Danh sách thể loại">
        <Form layout="vertical">
          <Row gutter={[12, 12]}>
            <Col span={4}>
              <Form.Item label="Sắp xếp theo vị trí" name="position" initialValue="default">
                <Select
                  onChange={handleSortChange("position")}
                  options={[
                    {
                      label: "Mặc định",
                      value: "default"
                    },
                    {
                      label: "Tăng",
                      value: "asc"
                    },
                    {
                      label: "Giảm",
                      value: "desc"
                    }
                  ]}
                />
              </Form.Item>
            </Col>
            {/* Sort status */}
            <Col span={4}>
              <Form.Item label="Trạng thái" name="sortStatus" initialValue="default">
                <Select
                  onChange={handleSortStatus("status")}
                  options={[
                    { label: "Tất cả", value: "default" },
                    { label: "Hoạt động", value: "active" },
                    { label: "Ngưng hoạt động", value: "inactive" },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Card
          style={{ marginTop: 10 }}
          type="inner"
        >
          <Table
            dataSource={data}
            columns={columns}
            rowKey="_id"
            loading={categoriesQuery.isFetching}
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

export default CategoriesList;