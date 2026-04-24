import { useEffect, useState } from "react";
import { getCookie } from "../../../helpers/cookie";
import { Card, message, Table, Tag } from "antd";
import DeleteItem from "../../../components/DeleteItem";
import { changeStatusUserGet, listUserGet } from "../../../services/admin/userServies";
import NoRole from "../../../components/NoRole";
import UserDetail from "./Detail";
import SendNotification from "./SendNotification";


function UserList() {
  const permissions = JSON.parse(localStorage.getItem('permissions'));

  const [users, setUsers] = useState([]);
  const token = getCookie("token");

  const fetchApi = async () => {
    try {
      const response = await listUserGet(token);
      setUsers(response.records)
    } catch (error) {
      message.error('Lỗi khi tải dữ liệu vai trò!');
    }
  }

  useEffect(() => {
    fetchApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleReload = () => {
    fetchApi();
  }

  // Data đổ vào table
  const columns = [
    {
      title: 'Họ tên',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      key: 'avatar',
      render: (_, record) => {
        return (
          <>
            <img
              src={record.avatar}
              alt="Uploaded"
              style={{ width: "70px", display: "block", marginTop: "10px" }}
            />
          </>
        )
      }
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'SĐT',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (_, record) => {
        return (
          <>
            {record.status === "inactive" ? (
              <Tag color={"#cd201f"} key={`inactive-${record._id}`} data-id={`active-${record._id}`} onClick={handleCLickStatus} style={{ cursor: "pointer" }} >
                Ngừng hoạt động
              </Tag>
            ) : (
              <Tag color={"#55acee"} key={`active-${record._id}`} data-id={`inactive-${record._id}`} onClick={handleCLickStatus} style={{ cursor: "pointer" }} >
                Hoạt động
              </Tag>
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
              <UserDetail user={record} user_id={record._id} key={`detail-${record._id}`}/>
              {permissions.includes("users_del") && (
                <DeleteItem record={record} key={`delete-${record._id}`} typeDelete="user" onReload={handleReload} />
              )}
            </div>
          </>
        )
      }
    }
  ];

  const handleCLickStatus = (e) => {
    const id = e.target.attributes[0].value.split("-")[1];
    const statusChange = e.target.attributes[0].value.split("-")[0];

    const fetchApiChangeStatus = async () => {
      const response = await changeStatusUserGet(token, statusChange, id);

      if (response.code === 200) {
        message.success("Thay đổi trạng thái thành công");
        handleReload();
      } else {
        message.error("Thay đổi trạng thái không thành công!")
      }
    }
    if (permissions.includes("users_edit")) {
      fetchApiChangeStatus();
    } else {
      message.error("Bạn không có quyền thay đổi trạng thái!")
    }
  }

  return (
    <>
      {permissions.includes("users_view") ?
        <Card title="Danh sách tài khoản khách hàng" style={{ height: "100vh" }}>
          <SendNotification records={users} />
          <Card
            style={{
              marginTop: 10,
              width: "100%"
            }}
            type="inner"
          >
            <Table
              dataSource={users}
              columns={columns}
              className='table-list'
              rowKey="_id" // Đảm bảo rằng mỗi hàng trong bảng có key duy nhất
              pagination={{
                pageSize: 5, // Số mục trên mỗi trang
                total: users.length, // Tổng số mục (dựa trên data)
                showSizeChanger: false, // Ẩn tính năng thay đổi số mục trên mỗi trang
                style: { display: 'flex', justifyContent: 'center' }, // Căn giữa phân trang
              }}
            />
          </Card>
        </Card> :
        <NoRole />
      }
    </>
  )
}

export default UserList;