import {
  Button,
  Card,
  message,
  Modal,
  Table,
  Tag,
} from "antd";
import {
  EyeOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { useMemo, useState, useCallback } from "react";
import { getCookie } from "../../../helpers/cookie";
import NoRole from "../../../components/NoRole";
import { getReviewsOfProduct } from "../../../services/admin/productServies";
import dayjs from "dayjs";
import DeleteItem from "../../../components/DeleteItem";
import useProducts from "../../../hooks/admin/useProducts";

function ProductReview({ product_id, slug }) {
  const permissions = JSON.parse(localStorage.getItem("permissions") || "[]");
  const token = getCookie("token");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [data, setData] = useState([]);
  const [limit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const { updateDeletedReview } = useProducts({
    token
  });

  const showModal = useCallback(() => {
    const fetchApi = async () => {
      const response = await getReviewsOfProduct(token, product_id);
      if (response.code === 200) {
        setData(response.data);
      } else {
        message.error(response.message);
      }
    }
    fetchApi();
    setIsModalOpen(true);
  }, [product_id, token]);
  const handleCancel = useCallback(() => setIsModalOpen(false), []);

  const handleDeleted = useCallback(
    (e) => {
      const [status, id] = e.target.dataset.id.split("-");

      if (!permissions.includes("products_view"))
        return message.error("Bạn không có quyền!");
      updateDeletedReview.mutate({ status, id },
        {
          onSuccess: (response) => {
            if (response?.code === 200) {
              handleCancel();
            }
          },
        });

    }, [handleCancel, permissions, updateDeletedReview]);


  const columns = useMemo(
    () => [
      {
        title: "Tên khách hàng",
        dataIndex: "fullName",
        key: "fullName",
      },
      {
        title: "Nội dung",
        dataIndex: "content",
        key: "content",
      },
      {
        title: "Rating",
        dataIndex: "rating",
        key: "rating",
      },
      {
        title: "Tạo lúc",
        dataIndex: "createdAt",
        key: "createdAt",
        render: (_, record) => (
          <>
            {dayjs(record.createdAt).format("HH:mm DD/MM/YYYY")}
          </>
        )
      },
      {
        title: "Ẩn/hiện",
        dataIndex: "deleted",
        key: "deleted",
        render: (_, record) => (
          <>
            <Tag
              color={record.deleted === true ? "#cd201f" : "#55acee"}
              data-id={
                record.deleted === false
                  ? `true-${record._id}`
                  : `false-${record._id}`
              }
              onClick={handleDeleted}
              style={{ cursor: "pointer" }}
            >
              {record.deleted === false ? "Hiện" : "Đã ẩn"}
            </Tag>
          </>
        ),
      },
      {
        title: "Hành động",
        key: "actions",
        render: (_, record) => (
          <>
            <a href={`/detail/${slug}`} target="_blank" rel="noreferrer" >
              <Button icon={<EyeOutlined />}
                title="Chi tiết"
                type="primary" ghost />
            </a>
            <DeleteItem record={record} typeDelete="permanent-review" />
          </>
        ),
      },
    ], [handleDeleted, slug]);

  if (!permissions.includes("products_view")) return <NoRole />;

  return (
    <>
      <Button
        icon={<MessageOutlined />}
        type="primary"
        title="Quản lý đánh giá"
        ghost
        onClick={showModal}
        style={{ marginRight: "10px" }}
      />

      <Modal
        title="Danh sách đánh giá"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width="70%"
        destroyOnClose
      >
        <Card style={{ marginTop: 10 }} type="inner">
          {data && (
            <Table
              dataSource={data}
              columns={columns}
              rowKey="_id"
              pagination={{
                current: currentPage,
                pageSize: limit,
                total: data.length / limit,
                showSizeChanger: false,
                onChange: setCurrentPage,
                style: { display: "flex", justifyContent: "center" },
              }}
            />
          )}
        </Card>
      </Modal>
    </>
  );
}

export default ProductReview;
