import { useState } from "react";
import { getCookie } from "../../../helpers/cookie";
import { Card, message, Table, Tag } from "antd";
import DeleteItem from "../../../components/DeleteItem";
import NoRole from "../../../components/NoRole";
import useCampaigns from "../../../hooks/admin/useCampaigns";
import { useMemo } from "react";
import { useCallback } from "react";
import dayjs from "dayjs";
import CampaignEdit from "./Edit";

dayjs.locale("vi")

function CampaignList() {
  const permissions = useMemo(() => JSON.parse(localStorage.getItem("permissions")) || [], []);
  const token = getCookie("token");

  // 🧩 State quản lý phân trang, lọc, sắp xếp
  const [limit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const { campaignsQuery, updateStatus } = useCampaigns({
    token,
    currentPage,
    limit,
  });

  // Lấy dữ liệu sản phẩm
  const campaigns = campaignsQuery.data?.campaigns ?? [];
  const totalPage = campaignsQuery.data?.totalPage ?? 0;

  // 🧠 Handlers (memoized để tránh re-render)
  const handleChangeStatus = useCallback(
    (e) => {
      const [statusChange, id] = e.target.dataset.id.split("-");
      if (!permissions.includes("products_edit"))
        return message.error("Bạn không có quyền chỉnh sửa sản phẩm!");
      updateStatus.mutate({ statusChange, id });
    }, [permissions, updateStatus]);

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
              {permissions.includes("campaigns_edit") ? (
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
                {permissions.includes("campaigns_edit") && (
                  <CampaignEdit record={record} key={`edit-${record._id}`} />
                )}
                {permissions.includes("campaigns_del") && (
                  <DeleteItem record={record} key={`delete-${record._id}`} typeDelete="campaign" />
                )}
              </div>
            </>
          )
        }
      }
    ], [permissions, handleChangeStatus]);

  if (!permissions.includes("campaigns_view")) return <NoRole />;

  return (
    <>
      <Card title="Danh sách chiến dịch">
        <Card style={{ marginTop: 10 }} type="inner">
          <Table
            dataSource={campaigns}
            columns={columns}
            rowKey="_id"
            loading={campaignsQuery.isFetching}
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

export default CampaignList;