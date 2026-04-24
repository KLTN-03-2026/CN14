import { useEffect, useState } from "react";
import { listRoleGet } from "../../../services/admin/rolesServies";
import { getCookie } from "../../../helpers/cookie";
import { Card, message, Table } from 'antd';
import DeleteItem from '../../../components/DeleteItem';
import RoleEdit from "./Edit";
import NoRole from "../../../components/NoRole";


const RoleList = () => {
  const permissions = JSON.parse(localStorage.getItem('permissions'));

  const [roles, setRoles] = useState([]);
  const token = getCookie("token");

  const fetchApi = async () => {
    try {
      const response = await listRoleGet(token);
      if (response.code === 200) {
        setRoles(response.roles);
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
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Hành động',
      dataIndex: 'actions',
      key: 'actions',
      render: (_, record) => {
        return (
          <>
            <div>
              {permissions.includes("roles_edit") && (
                <RoleEdit record={record} key={`edit-${record._id}`} onReload={handleReload} />
              )}
              {permissions.includes("roles_del") && (
                <DeleteItem record={record} key={`delete-${record._id}`} typeDelete="role" onReload={handleReload} />
              )}
            </div>
          </>
        )
      }
    }
  ];


  return (
    <>
      {permissions.includes("roles_view") ?
        <Card title="Danh sách quyền">
          <Card
            style={{
              marginTop: 10,
              width: "100%"
            }}
            type="inner"
          >
            <Table
              dataSource={roles}
              columns={columns}
              className='table-list'
              rowKey="_id" // Đảm bảo rằng mỗi hàng trong bảng có key duy nhất
              pagination={{
                pageSize: 5, // Số mục trên mỗi trang
                total: roles.length, // Tổng số mục (dựa trên data)
                showSizeChanger: false, // Ẩn tính năng thay đổi số mục trên mỗi trang
                style: { display: 'flex', justifyContent: 'center' }, // Căn giữa phân trang
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

export default RoleList;