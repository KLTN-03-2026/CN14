import { useEffect, useState } from "react";
import { listAccountGet } from "../../../services/admin/accountServies";
import { getCookie } from "../../../helpers/cookie";
import { listRoleGet } from "../../../services/admin/rolesServies";
import { Card, message, Table } from "antd";
import DeleteItem from "../../../components/DeleteItem";
import AccountEdit from "./Edit";
import NoRole from "../../../components/NoRole";


function AccountList() {
  const permissions = JSON.parse(localStorage.getItem('permissions'));

  const [accounts, setAccounts] = useState([]);
  const token = getCookie("token");

  const fetchApi = async () => {
    try {
      const responseRole = await listRoleGet(token);
      const responseAccount = await listAccountGet(token);

      if (responseAccount.code === 200 && responseRole.code === 200) {
        // Thêm title từ role vào accounts
        const updatedAccounts = responseAccount.accounts.map(item => {
          const role = responseRole.roles.find(role => role._id === item.role_id);
          if (role) {
            return {
              ...item,
              "title": role.title
            };
          } else {
            return {
              ...item,
              "title": "Quyền không tồn tại / đã xóa"
            }
          }

        });

        setAccounts(updatedAccounts);
      } else {
        // Xử lý các mã lỗi khác
        message.error(responseAccount.message);
        message.error(responseRole.message);
      }
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
      title: 'Quyền',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Hành động',
      dataIndex: 'actions',
      key: 'actions',
      render: (_, record) => {
        return (
          <>
            <div>
              {permissions.includes("accounts_edit") && (
                <AccountEdit record={record} key={`edit-${record._id}`} onReload={handleReload} />
              )}
              {permissions.includes("accounts_del") && (
                <DeleteItem record={record} key={`delete-${record._id}`} typeDelete="account" onReload={handleReload} />
              )}
            </div>
          </>
        )
      }
    }
  ];

  return (
    <>
      <>
        {permissions.includes("accounts_view") ? (
          <Card title="Danh sách tài khoản nhân viên" style={{ height: "100vh" }}>
            <Card
              style={{
                marginTop: 10,
                width: "100%"
              }}
              type="inner"
            >
              <Table
                dataSource={accounts}
                columns={columns}
                className='table-list'
                rowKey="_id" // Đảm bảo rằng mỗi hàng trong bảng có key duy nhất
                pagination={{
                  pageSize: 5, // Số mục trên mỗi trang
                  total: accounts.length, // Tổng số mục (dựa trên data)
                  showSizeChanger: false, // Ẩn tính năng thay đổi số mục trên mỗi trang
                  style: { display: 'flex', justifyContent: 'center' }, // Căn giữa phân trang
                }}
              />
            </Card>
          </Card>
        ) :
          <NoRole />
        }
      </>
    </>
  )
}

export default AccountList;