import { Card, Row, Col, Table, Tag, Input, Button, Progress, Space, Typography, Badge, Select, Spin, Empty } from "antd"
import {
  ShoppingCartOutlined,
  UserOutlined,
  FolderOpenOutlined,
  SearchOutlined,
  BellOutlined,
  SettingOutlined,
  BarChartOutlined,
  PieChartOutlined,
  TrophyOutlined,
  WarningOutlined,
  ShoppingOutlined,
} from "@ant-design/icons"
import { useEffect, useState } from "react"
import { Option } from "antd/es/mentions"
import { getLatestRevenue, getLowStockProducts, getpercentGrowthCategory, getpercentGrowthOrder, getpercentGrowthProduct, getpercentGrowthUser, getRerentOrders, getTimeStartWeb, getTopSellingCategories, getTopSellingProducts } from "../../../services/admin/dashboardServies"
import { getCookie } from "../../../helpers/cookie"
import OrderDetail from "../Order/Detail"
import StatCard from "../../../components/StatCard"

const { Title, Text } = Typography
const { Search } = Input

const formatDate = (isoString) => {
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

// Dữ liệu cho bảng đơn hàng
const orderColumns = [
  {
    title: "Mã Đơn",
    dataIndex: "code",
    key: "code",
    render: (text) => <Text strong>{text}</Text>,
  },
  {
    title: "Khách Hàng",
    dataIndex: "fullName",
    key: "fullName",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: 'Thanh toán',
    dataIndex: 'paymentMethod',
    key: 'paymentMethod',
  },
  {
    title: "Trạng Thái",
    dataIndex: "status",
    key: "status",
    render: (status) => {
      const statusConfig = {
        initialize: { color: "default", text: "Khởi tạo" },
        confirmed: { color: "gold", text: "Hoàn thành" },
        processing: { color: "orange", text: "Đang xử lý" },
        received: { color: "blue", text: "Đã xác nhận" },
        shipping: { color: "geekblue", text: "Đang giao hàng" },
        completed: { color: "green", text: "Hoàn thành" },
        cancelled: { color: "red", text: "Đã hủy" },
        returned: { color: "volcano", text: "Hoàn trả / Hoàn tiền" },
      }
      const config = statusConfig[status]
      return <Tag color={config.color}>{config.text}</Tag>
    },
  },
  {
    title: "Tổng Tiền",
    dataIndex: "totalMoney",
    key: "totalMoney",
    render: (amount) => <Text strong>{amount.toLocaleString()} VNĐ</Text>,
  },
  {
    title: "Ngày Đặt",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (text) => formatDate(text)
  },
  {
    title: 'Hành động',
    dataIndex: 'actions',
    key: 'actions',
    render: (_, record) => {
      return (
        <>
          <div key={`action-${record._id}`}>
            <OrderDetail record={record} />
          </div>
        </>
      )
    }
  }
]

const getCurrentMonth = () => {
  const now = new Date();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const year = now.getFullYear();
  return `${month}-${year}`;
};

// Hàm tính phần trăm tăng trưởng doanh thu theo tháng
function calculateGrowthPercentage(data, currentTime) {
  const current = data.find(item => item.time === currentTime);
  if (!current) {
    return { growth: 0, message: "Không tìm thấy tháng hiện tại trong dữ liệu" };
  }

  const maxRevenue = Math.max(...data.map(item => item.totalRevenue));

  if (maxRevenue === 0) {
    return { growth: 0, message: "Không có dữ liệu doanh thu nào lớn hơn 0 để tính phần trăm" };
  }

  const growth = (current.totalRevenue / maxRevenue) * 100;

  return Math.round(growth * 100) / 100;
}

function Dashboard() {
  const token = getCookie("token");
  const [loading, setLoading] = useState(true);
  // Dữ liệu tháng hiện tại
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  // Dữ liệu thời gian bắt đầu của trang web
  const [timeLine, setTimeLine] = useState([]);

  // Dữ liệu thống kê
  const [countProductCurrent, setCountProductCurrent] = useState(0);
  const [countProductLast, setCountProductLast] = useState(0);

  const [countOrderCurrent, setCountOrderCurrent] = useState(0);
  const [countOrderLast, setCountOrderLast] = useState(0);

  const [countUserCurrent, setCountUserCurrent] = useState(0);
  const [countUserLast, setCountUserLast] = useState(0);

  const [countCategoryCurrent, setCountCategoryCurrent] = useState(0);
  const [countCategoryLast, setCountCategoryLast] = useState(0);

  const [recentOrders, setRecentOrders] = useState([]);

  const [topSellingCategorys, setTopSellingCategorys] = useState([]);

  const [lowStockProducts, setLowStockProducts] = useState([]);

  const [topSellingProducts, setTopSellingProducts] = useState([]);
  // End dữ liệu thống kê

  const [latestRevenue, setLatestRevenue] = useState([]);

  const fetchApiPercentGrowthProduct = async (time) => {
    try {
      const response = await getpercentGrowthProduct(token, time);
      if (response.code === 200) {
        setCountProductCurrent(response.countProductCurrent);
        setCountProductLast(response.countProductLast);
      }
    } catch (error) {
      console.error("Lỗi khi lấy tỷ lệ tăng trưởng sản phẩm:", error);
    }
  }

  const fetchApiTopSellingCategory = async (time) => {
    try {
      const response = await getTopSellingCategories(token, time);
      if (response.code === 200) {
        setTopSellingCategorys(response.result);
      }
    } catch (error) {
      console.error("Lỗi khi lấy tỷ lệ tăng trưởng sản phẩm:", error);
    }
  }

  const fetchApiLowStockProducts = async () => {
    try {
      const response = await getLowStockProducts(token);
      if (response.code === 200) {
        setLowStockProducts(response.result);
      } else {
        setLowStockProducts([]);
      }
    } catch (error) {
      console.error("Lỗi khi lấy tỷ lệ tăng trưởng sản phẩm:", error);
    }
  }

  const fetchApiTopSellingProduct = async (time) => {
    try {
      const response = await getTopSellingProducts(token, time);
      if (response.code === 200) {
        setTopSellingProducts(response.result);
      }
    } catch (error) {
      console.error("Lỗi khi lấy tỷ lệ tăng trưởng sản phẩm:", error);
    }
  }

  const fetchApiPercentGrowthOrder = async (time) => {
    try {
      const response = await getpercentGrowthOrder(token, time);
      if (response.code === 200) {
        setCountOrderCurrent(response.countOrderCurrent);
        setCountOrderLast(response.countOrderLast);
      }
    } catch (error) {
      console.error("Lỗi khi lấy tỷ lệ tăng trưởng sản phẩm:", error);
    }
  }

  const fetchApiPercentGrowthUser = async (time) => {
    try {
      const response = await getpercentGrowthUser(token, time);
      if (response.code === 200) {
        setCountUserCurrent(response.countUserCurrent);
        setCountUserLast(response.countUserLast);
      }
    } catch (error) {
      console.error("Lỗi khi lấy tỷ lệ tăng trưởng người dùng:", error);
    }
  }

  const fetchApiPercentGrowthCategory = async (time) => {
    try {
      const response = await getpercentGrowthCategory(token, time);
      if (response.code === 200) {
        setCountCategoryCurrent(response.countCategoryCurrent);
        setCountCategoryLast(response.countCategoryLast);
      }
    } catch (error) {
      console.error("Lỗi khi lấy tỷ lệ tăng trưởng danh mục:", error);
    }
  }

  const fetchApiLatesRevenue = async () => {
    try {
      const response = await getLatestRevenue(token);
      if (response.code === 200) {
        setLatestRevenue(response.revenues);
      }
    } catch (error) {
      console.error("Lỗi khi lấy tỷ lệ tăng trưởng danh mục:", error);
    }
  }

  const fetchApiRecentOrders = async () => {
    try {
      const response = await getRerentOrders(token);
      if (response.code === 200) {
        // Biến đổi mảng
        const transformedOrders = response.orders.map(order => ({
          _id: order._id,
          fullName: order.userInfo.fullName,
          totalMoney: order.totalOrder,
          createdAt: order.createdAt,
          paymentMethod: order.paymentMethod,
          code: order.code,
          status: order.status,
          email: order.userInfo.email
        }));
        setRecentOrders(transformedOrders);
      }
    } catch (error) {
      console.error("Lỗi khi lấy tỷ lệ tăng trưởng danh mục:", error);
    }
  }

  // Màu sắc cố định cho các category
  const colors = ["#ff6b35", "#52c41a", "#722ed1", "#13c2c2", "#faad14"];

  useEffect(() => {
    const fetchApiTimeStart = async () => {
      try {
        const response = await getTimeStartWeb(token);
        if (response.code === 200) {
          setTimeLine(response.timeLine);
          // Thiết lập tháng được chọn mặc định là tháng hiện tại
          const currentMonth = getCurrentMonth();
          if (response.timeLine.includes(currentMonth)) {
            setSelectedMonth(currentMonth);
          } else if (response.timeLine.length > 0) {
            setSelectedMonth(response.timeLine[0]); // fallback nếu tháng hiện tại chưa có đơn
          }

        }
      } catch (error) {
        console.log(error);
      }
    }


    setLoading(true);
    Promise.all([
      fetchApiLowStockProducts(),
      fetchApiTopSellingProduct(selectedMonth),
      fetchApiTopSellingCategory(selectedMonth),
      fetchApiLatesRevenue(),
      fetchApiPercentGrowthUser(selectedMonth),
      fetchApiPercentGrowthCategory(selectedMonth),
      fetchApiPercentGrowthOrder(selectedMonth),
      fetchApiPercentGrowthProduct(selectedMonth),
      fetchApiRecentOrders(),
      fetchApiTimeStart()
    ]).finally(() => setLoading(false));
    // fetchApiLowStockProducts();
    // fetchApiTopSellingProduct(selectedMonth);
    // fetchApiTopSellingCategory(selectedMonth);
    // fetchApiLatesRevenue();
    // fetchApiPercentGrowthUser(selectedMonth);
    // fetchApiPercentGrowthCategory(selectedMonth);
    // fetchApiPercentGrowthOrder(selectedMonth);
    // fetchApiPercentGrowthProduct(selectedMonth);
    // fetchApiRecentOrders();
    // fetchApiTimeStart();
    // setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Tính tổng số sản phẩm bán
  const totalProductsSold = topSellingCategorys.reduce(
    (sum, cat) => sum + cat.totalQuantity, 0
  );

  const handleChange = (value) => {
    fetchApiTopSellingProduct(value);
    fetchApiTopSellingCategory(value);
    setSelectedMonth(value);
    fetchApiPercentGrowthProduct(value);
    fetchApiPercentGrowthOrder(value);
    fetchApiPercentGrowthUser(value);
    fetchApiPercentGrowthCategory(value);
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <Spin size="large" />
        <p>Đang tải...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      {/* Header */}
      <div
        style={{
          backgroundColor: "white",
          borderBottom: "1px solid #f0f0f0",
          padding: "16px 24px",
        }}
      >
        <Row justify="space-between" align="middle">
          <Col>
            <Space align="center">
              <Title level={2} style={{ margin: 0 }}>
                Bảng Thống Kê
              </Title>
              <Badge status="success" text="Cập nhật mới" />
            </Space>
          </Col>
          <Col>
            <Space>
              <Search placeholder="Tìm kiếm..." style={{ width: 300 }} prefix={<SearchOutlined />} />
              <Button icon={<BellOutlined />} />
              <Button icon={<SettingOutlined />} />
            </Space>
          </Col>
        </Row>
      </div>

      <div style={{ padding: "24px" }}>
        <Col xs={24}>
          <div>
            <label style={{ marginRight: 8 }}>Chọn tháng:</label>
            <Select
              placeholder="Chọn tháng"
              value={selectedMonth}
              onChange={(value) => {
                setSelectedMonth(value);
                handleChange(value, 'month');
              }}
              style={{
                marginBottom: 16,
                width: 150
              }}>
              {timeLine.slice().reverse().map((month) => (
                <Option value={month} key={month}>
                  Tháng {month}
                </Option>
              ))}
            </Select>
          </div>
        </Col>

        {/* Stats Cards */}
        <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
          <Col xs={24} sm={12} lg={4}>
            <StatCard
              title="Đơn Hàng"
              current={countOrderCurrent}
              last={countOrderLast}
              icon={<ShoppingCartOutlined style={{ color: "white" }} />}
              gradient="linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)"
            />
          </Col>

          <Col xs={24} sm={12} lg={4}>
            <StatCard
              title="Doanh Thu"
              current={countOrderCurrent} // TODO: nên thay = doanh thu thật
              last={countOrderLast}
              icon={<BarChartOutlined style={{ color: "white" }} />}
              gradient="linear-gradient(135deg, #f39c12 0%, #e67e22 100%)"
            />
          </Col>

          <Col xs={24} sm={12} lg={4}>
            <StatCard
              title="Sản Phẩm"
              current={countProductCurrent}
              last={countProductLast}
              icon={<ShoppingOutlined style={{ color: "white" }} />}
              gradient="linear-gradient(135deg, #52c41a 0%, #73d13d 100%)"
            />
          </Col>

          <Col xs={24} sm={12} lg={4}>
            <StatCard
              title="Khách Hàng"
              current={countUserCurrent}
              last={countUserLast}
              icon={<UserOutlined style={{ color: "white" }} />}
              gradient="linear-gradient(135deg, #722ed1 0%, #9254de 100%)"
            />
          </Col>

          <Col xs={24} sm={12} lg={4}>
            <StatCard
              title="Danh Mục"
              current={countCategoryCurrent}
              last={countCategoryLast}
              icon={<FolderOpenOutlined style={{ color: "white" }} />}
              gradient="linear-gradient(135deg, #13c2c2 0%, #36cfc9 100%)"
            />
          </Col>
        </Row>

        {/* Charts and Analytics */}
        {latestRevenue.length >= 4 && (
          <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
            {/* Doanh Thu Theo Tháng */}
            <Col xs={24} lg={12}>
              <Card
                title={
                  <Space>
                    <BarChartOutlined />
                    <span>Doanh Thu 4 Tháng Gần Nhất</span>
                  </Space>
                }
              >
                <div style={{ padding: "16px 0" }}>
                  {latestRevenue.map((item) => {
                    const percent = item.totalRevenue === 0 ? 0 : calculateGrowthPercentage(latestRevenue, item.time);
                    const displayRevenue = item.totalRevenue === 0 ? "0 VNĐ" : Number(item.totalRevenue).toLocaleString() + " VNĐ";
                    const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
                    return (
                      <>
                        <Row justify="space-between" style={{ marginBottom: 16 }}>
                          <Text strong>Tháng {item.time.split("-")[1]}</Text>
                          <Text type="secondary">{displayRevenue}</Text>
                        </Row>
                        <Progress percent={percent} strokeColor={randomColor} style={{ marginBottom: 24 }} />
                      </>
                    );
                  })}
                  {/* <Row justify="space-between" style={{ marginBottom: 16 }}>
                    <Text strong>Tháng {latestRevenue[0].time.split("-")[1]}</Text>
                    <Text type="secondary">{Number(latestRevenue[0].totalRevenue).toLocaleString()} VNĐ</Text>
                  </Row>
                  <Progress percent={calculateGrowthPercentage(latestRevenue, latestRevenue[0].time)} strokeColor="#ff6b35" style={{ marginBottom: 24 }} />
                  */}
                </div>
              </Card>
            </Col>

            {/* Top Danh Mục Bán Chạy */}
            <Col xs={24} lg={12}>
              <Card
                title={
                  <Space>
                    <PieChartOutlined />
                    <span>Top 5 Danh Mục Bán Chạy</span>
                  </Space>
                }
              >
                <div style={{ padding: "16px 0" }}>
                  {topSellingCategorys.map((cat, index) => {
                    const percentage = ((cat.totalQuantity / totalProductsSold) * 100).toFixed(1);
                    return (
                      <Row
                        key={cat._id}
                        justify="space-between"
                        align="middle"
                        style={{ marginBottom: index !== topSellingCategorys.length - 1 ? 16 : 0 }}
                      >
                        <Space>
                          <div
                            style={{
                              width: 12,
                              height: 12,
                              backgroundColor: colors[index % colors.length],
                              borderRadius: "50%",
                            }}
                          />
                          <Text strong>{cat.categoryTitle}</Text>
                        </Space>
                        <Text type="secondary">
                          {percentage}% ({cat.totalQuantity} SP)
                        </Text>
                      </Row>
                    );
                  })}
                </div>
              </Card>
            </Col>
          </Row>
        )}

        {/* Sản Phẩm Bán Chạy */}
        <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
          {/* Sản Phẩm Bán Chạy */}
          <Col xs={24} md={8}>
            <Card title="Sản Phẩm Bán Chạy">
              <Space direction="vertical" style={{ width: "100%" }}>
                {topSellingProducts.map((product) => (
                  <Row
                    key={product._id}
                    justify="space-between"
                    align="middle"
                  >
                    <Text>{product.title}</Text>
                    <Tag color="blue">{product.totalSold} đã bán</Tag>
                  </Row>
                ))}
              </Space>
            </Card>
          </Col>

          {/* Khách Hàng VIP */}
          <Col xs={24} md={8}>
            <Card title="Khách Hàng VIP">
              <Space direction="vertical" style={{ width: "100%" }}>
                <Row justify="space-between" align="middle">
                  <Text>Nguyễn Văn A</Text>
                  <Tag color="gold" icon={<TrophyOutlined />}>
                    VIP Gold
                  </Tag>
                </Row>
                <Row justify="space-between" align="middle">
                  <Text>Trần Thị B</Text>
                  <Tag color="silver">VIP Silver</Tag>
                </Row>
                <Row justify="space-between" align="middle">
                  <Text>Lê Văn C</Text>
                  <Tag color="orange">VIP Bronze</Tag>
                </Row>
              </Space>
            </Card>
          </Col>

          {/* Tồn Kho Thấp */}
          <Col xs={24} md={8}>
            <Card title="Tồn Kho Thấp">
              <Space direction="vertical" style={{ width: "100%" }}>
                {lowStockProducts.map((product) => (
                  <Row
                    key={product._id}
                    justify="space-between"
                    align="middle"
                  >
                    <Text>{product.title}</Text>
                    <Tag color="red" icon={<WarningOutlined />}>{product.stock} còn lại</Tag>
                  </Row>
                ))}
              </Space>
            </Card>
          </Col>
        </Row>

        {/* Recent Orders Table */}
        <Card
          title="Đơn Hàng Tháng Này"
          style={{ marginBottom: 32 }}
        >
          {recentOrders.length > 0 ? (
            <Table columns={orderColumns} dataSource={recentOrders} pagination={{ pageSize: 5 }} scroll={{ x: 800 }} />
          ) : (
            <Empty description="Không có đơn hàng nào" />
          )}
        </Card>
      </div >
    </div >
  )
}

export default Dashboard;