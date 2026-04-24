import { Card, Select, Table, message } from 'antd';
import { useEffect, useState } from 'react';
import { getCookie } from "../../../helpers/cookie";
import NoRole from '../../../components/NoRole';
import { changeStatusContact, listContacts } from '../../../services/admin/contactServies';
import ContactDetail from './Detail';
import dayjs from 'dayjs';
import ContactReply from './Reply';
import confirm from 'antd/es/modal/confirm';
import { ExclamationCircleFilled } from '@ant-design/icons';
import SendNotification from './SendNotification';

const ContactList = () => {
  const permissions = JSON.parse(localStorage.getItem('permissions'));
  const [data, setData] = useState([]);
  const token = getCookie("token");

  // tổng số trang để phân trang
  const [totalPage, setTotalPage] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [limit, setLimit] = useState(10);
  // page hiện tại đang đứng
  const [currentPage, setCurrentPage] = useState(1);


  const fetchApi = async () => {
    const response = await listContacts(token, currentPage, limit);
    if (response.code === 200) {
      setData(response.data.contacts);
      setTotalPage(response.data.totalPage);
    } else {
      setData([]);
    }
  }

  useEffect(() => {
    fetchApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage])

  const handleReload = () => {
    fetchApi();
  }

  const handleChangeStatus = (newStatus, contact_id) => {
    confirm({
      title: 'Bạn chắc chắn muốn thay đổi trạng thái?',
      icon: <ExclamationCircleFilled />,
      onOk() {
        const fetchApiChangeStatus = async () => {
          const response = await changeStatusContact(token, newStatus, contact_id);

          if (response.code === 200) {
            message.success(response.message);
            handleReload();
          } else {
            message.error(response.message);
          }
        };

        fetchApiChangeStatus();
      },
      onCancel() { },
    });
  };

  // Data đổ vào table
  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Tên khách hàng',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'SĐT',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Gửi lúc',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (_, record) => {
        return (
          <>
            <b>{record.createdAt ? dayjs(record.createdAt).format("DD/MM/YYYY HH:mm") : 'N/A'}</b>
          </>
        );
      }
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (_, record) => {
        // Tính toán option cần disable
        const disabledOptions = {
          pending: ['pending', 'processing', 'resolved'],
          processing: ['pending', 'processing'],
          resolved: ['pending', 'pending', 'closed', 'spam', 'resolved'],
          closed: ['closed'],
          spam: ['spam']
        };

        return (
          <Select
            defaultValue={record.status}
            style={{ width: 180 }}
            onChange={(value) => handleChangeStatus(value, record._id)}
          >
            <Select.Option
              value="pending"
              disabled={disabledOptions[record.status].includes("pending")}
            >
              <span>Chờ xử lý</span>
            </Select.Option>

            <Select.Option
              value="processing"
              disabled={disabledOptions[record.status].includes("processing")}
            >
              <span >Đã xem</span>
            </Select.Option>

            <Select.Option
              value="resolved"
              disabled={disabledOptions[record.status].includes("resolved")}
            >
              <span>Đã phản hồi</span>
            </Select.Option>

            <Select.Option
              value="closed"
              disabled={disabledOptions[record.status].includes("closed")}
            >
              <span>Đóng</span>
            </Select.Option>

            <Select.Option
              value="spam"
              disabled={disabledOptions[record.status].includes("spam")}
            >
              <span>Spam</span>
            </Select.Option>
          </Select>
        );
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
              {permissions.includes("users_view") && (
                <ContactDetail
                  record={record} key={`detail-${record._id}`}
                  onReload={handleReload} />
              )}
              {permissions.includes("users_view") && (
                <ContactReply record={record} key={`reply-${record._id}`} />
              )}
            </div>
          </>
        )
      }
    }
  ];

  return (
    <>
      {permissions.includes("users_view") ?
        <Card title="Danh sách liên hệ">
          <Card
            style={{
              marginTop: 10,
              width: "100%"
            }}
            type="inner"
          >
            <SendNotification records={data} />
            <Table
              dataSource={data}
              columns={columns}
              className='table-list'
              rowKey="_id" // Đảm bảo rằng mỗi hàng trong bảng có key duy nhất
              pagination={{
                pageSize: limit, // Số mục trên mỗi trang
                total: limit * totalPage, // Tổng số mục (dựa trên data)
                showSizeChanger: false, // Ẩn tính năng thay đổi số mục trên mỗi trang
                style: { display: 'flex', justifyContent: 'center' }, // Căn giữa phân trang
              }}
              onChange={(page, pageSize) => {
                setCurrentPage(page.current); // Cập nhật trang hiện tại
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

export default ContactList;