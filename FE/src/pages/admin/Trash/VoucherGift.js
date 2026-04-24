import { Button, Card, Input, Table, Form, Row, Col, message } from 'antd';
import { useEffect, useState } from 'react';
import { getCookie } from "../../../helpers/cookie";
import NoRole from '../../../components/NoRole';
import { listItem } from '../../../services/admin/trashServices';
import RestoreItem from '../../../components/TrashHandle/restore';
import DeletePermanetItem from '../../../components/TrashHandle/delete-permanent';
import dayjs from 'dayjs';
dayjs.locale("vi")

export default function VoucherGiftTrash() {
  const permissions = JSON.parse(localStorage.getItem('permissions'));

  const [data, setData] = useState([]);
  const token = getCookie("token");

  // tổng số trang để phân trang
  const [totalPage, setTotalPage] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [limit, setLimit] = useState(10);
  // page hiện tại đang đứng
  const [currentPage, setCurrentPage] = useState(1);
  // keyword tìm kiếm
  const [keyword, setKeyword] = useState("");

  const fetchApi = async () => {
    const response = await listItem(token, "voucher-gifts", currentPage, limit, keyword);
    if (response.code === 200) {
      setData(response.data);
      setTotalPage(response.totalPage);
    } else {
      setData([]);
      message.error(response.message)
    }
  }

  useEffect(() => {
    fetchApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, keyword])

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
      title: 'Xóa bởi',
      dataIndex: 'deletedBy',
      key: 'deletedBy',
      render: (_, record) => {
        return (
          <>
            {record.deletedBy && (
              <>
                <p>{record.deletedBy?.fullName || 'N/A'}</p>
                <b>{dayjs(record.deletedBy.deletedAt).format("DD/MM/YYYY HH:mm")}</b>
              </>
            )}
          </>
        );
      }
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
      title: 'Hành động',
      dataIndex: 'actions',
      key: 'actions',
      render: (_, record) => {
        return (
          <>
            <div>
              {permissions.includes("trashs_restore") && (
                <RestoreItem record={record} key={`restore-${record._id}`} typeDelete="voucher-gift" onReload={handleReload} />
              )}
              {permissions.includes("trashs_permanent_del") && (
                <DeletePermanetItem record={record} key={`delete-permanent-${record._id}`} typeDelete="voucher-gift" onReload={handleReload} />
              )}
            </div>
          </>
        )
      }
    }
  ];

  const onFinish = (e) => {
    setKeyword(e.keyword);
  }

  return (
    <>
      {permissions.includes("trashs_view") ?
        <Card title="Phiếu quà tặng">
          <Form onFinish={onFinish} layout="vertical">
            <Row gutter={[12, 12]}>
              <Col span={22}>
                <Form.Item name="keyword" >
                  <Input
                    allowClear
                    type="text"
                    placeholder='Tìm kiếm'
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                </Form.Item>
              </Col>
              <Col span={2}>
                <Form.Item name='btnSearch'>
                  <Button type="primary" htmlType="submit" >Tìm kiếm</Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <Card
            style={{
              marginTop: 10,
              width: "100%"
            }}
            type="inner"
          >
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