import { Button, Card, Input, Table, Tag, Form, Row, Col, message } from 'antd';
import { useEffect, useState } from 'react';
import { getCookie } from "../../../helpers/cookie";
import DeleteItem from '../../../components/DeleteItem';
import NoRole from '../../../components/NoRole';
import { changeStatusBanner, listBanners } from '../../../services/admin/bannerServies';
import { formatDate } from '../../../helpers/dateTime';
import BannerEdt from './Edit';


const BannerList = () => {
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

  // sort
  // eslint-disable-next-line no-unused-vars
  const [sortKey, setSortKey] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [sortType, setSortType] = useState("asc");


  const fetchApi = async () => {
    const response = await listBanners(token, currentPage, limit, keyword, sortKey, sortType);
    if (response.code === 200) {
      console.log(response);

      setData(response.banners);
      setTotalPage(response.totalPage);
    } else {
      setData([]);
    }
  }

  useEffect(() => {
    fetchApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, keyword, sortKey, sortType])

  const handleReload = () => {
    fetchApi();
  }

  // Data đổ vào table
  const columns = [
    {
      title: 'Tiêu đề QC',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Ảnh',
      dataIndex: 'image',
      key: 'image',
      render: (_, record) => {
        return (
          <>
            <img
              src={record.image}
              alt="Uploaded"
              style={{ width: "150px", display: "block", marginTop: "10px" }}
            />
          </>
        )
      }
    },
    {
      title: 'Mô tả ngắn',
      dataIndex: 'excerpt',
      key: 'excerpt',
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'start_date',
      key: 'start_date',
      render: (text) => formatDate(text)
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'end_date',
      key: 'end_date',
      render: (text) => formatDate(text)
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
            {permissions.includes("banners_edit") ? (
              <>
                <Tag
                  color={record.status === "inactive" ? "#cd201f" : "#55acee"}
                  data-id={
                    record.status === "inactive"
                      ? `active-${record._id}`
                      : `inactive-${record._id}`
                  }
                  onClick={handleCLickStatus}
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
              {permissions.includes("banners_edit") && (
                <BannerEdt record={record} key={`edit-${record._id}`} onReload={handleReload} />
              )}
              {permissions.includes("banners_del") && (
                <DeleteItem record={record} key={`delete-${record._id}`} typeDelete="banner" onReload={handleReload} />
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
      const response = await changeStatusBanner(token, statusChange, id);

      if (response.code === 200) {
        message.success("Thay đổi trạng thái thành công");
        handleReload();
      } else {
        message.error("Thay đổi trạng thái không thành công!")
      }
    }
    if (permissions.includes("products_edit")) {
      fetchApiChangeStatus();
    } else {
      message.error("Bạn không có quyền chỉnh sửa sản phẩm!")
    }
  }

  const onFinish = (e) => {
    setKeyword(e.keyword);
  }
  return (
    <>
      {permissions.includes("banners_view") ?
        <Card title="Danh sách quảng cáo">
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

export default BannerList;