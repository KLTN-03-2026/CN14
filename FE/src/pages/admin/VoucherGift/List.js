import { Card, message, Table, Tag } from "antd";
import { useMemo, useState } from "react";
import { getCookie } from "../../../helpers/cookie";
import DeleteItem from "../../../components/DeleteItem";
import VoucherGiftEdit from "./Edit";
import NoRole from "../../../components/NoRole";
import dayjs from "dayjs";
import useVoucherGifts from "../../../hooks/admin/useVoucherGift";
import { useCallback } from "react";
dayjs.locale("vi")

function VoucherGiftList() {
  const permissions = useMemo(() => JSON.parse(localStorage.getItem("permissions")) || [], []);
  const token = getCookie("token");

  // 🧩 State quản lý phân trang, lọc, sắp xếp
  const [limit] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const { voucherGiftsQuery, updateStatus } = useVoucherGifts({
    token,
    currentPage,
    limit
  });

  // Lấy dữ liệu sản phẩm
  const data = voucherGiftsQuery.data?.voucherGifts ?? [];

  const totalPage = voucherGiftsQuery.data?.totalPage ?? 0;

  const handleChangeStatus = useCallback(
    (e) => {
      const [statusChange, id] = e.target.dataset.id.split("-");
      if (!permissions.includes("vouchers_edit"))
        return message.error("Bạn không có quyền chỉnh sửa sản phẩm!");
      updateStatus.mutate({ statusChange, id });
    }, [permissions, updateStatus]);

  const columns = useMemo(
    () => [
      {
        title: "Tiêu đề",
        dataIndex: "title",
        key: "title",
      },
      {
        title: "Điểm qui đổi",
        dataIndex: "pointCost",
        key: "pointCost",
      },
      {
        title: "Ngày kể từ khi đổi",
        dataIndex: "expiredAfterDays",
        key: "expiredAfterDays",
      },
      {
        title: "Ảnh",
        dataIndex: "image",
        key: "image",
        render: (url) => (
          <img
            src={url}
            alt="Uploaded"
            style={{ width: 70, display: "block", marginTop: 10 }}
          />
        ),
      },
      {
        title: 'Giá trị giảm giá',
        dataIndex: 'discount',
        key: 'discount',
      },
      {
        title: 'Đơn hàng tối thiểu',
        dataIndex: 'minOrderValue',
        key: 'minOrderValue',
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        render: (_, record) => (
          <>
            {permissions.includes("vouchers_edit") ? (
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
        ),
      },
      {
        title: "Hành động",
        key: "actions",
        render: (_, record) => (
          <div>
            {permissions.includes("vouchers_edit") && <VoucherGiftEdit record={record} />}
            {permissions.includes("vouchers_del") && (
              <DeleteItem record={record} typeDelete="voucher-gift" />
            )}
          </div>
        ),
      },
    ], [permissions, handleChangeStatus]);

  // 🧭 Render giao diện
  if (!permissions.includes("vouchers_view")) return <NoRole />;

  return (
    <Card title="Danh sách mẫu phiếu quá tặng">
      <Card style={{ marginTop: 10 }} type="inner">
        <Table
          dataSource={data}
          columns={columns}
          rowKey="_id"
          loading={voucherGiftsQuery.isFetching}
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

export default VoucherGiftList;
