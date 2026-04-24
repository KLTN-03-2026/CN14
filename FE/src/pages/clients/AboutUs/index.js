import React from 'react';
import { Card, Timeline, Avatar, Statistic, Row, Col } from 'antd';
import { 
  HeartOutlined, 
  StarOutlined, 
  TrophyOutlined, 
  TeamOutlined,
  GlobalOutlined,
  ShoppingOutlined,
  UserOutlined,
  CalendarOutlined
} from '@ant-design/icons';

const AboutUs = () => {
  const timelineItems = [
    {
      dot: <CalendarOutlined className="text-pink-500" />,
      children: (
        <div className="pb-4">
          <h4 className="font-semibold text-gray-800">2018</h4>
          <p className="text-gray-600">Thành lập công ty với ước mơ mang đến phong cách thời trang độc đáo</p>
        </div>
      ),
    },
    {
      dot: <GlobalOutlined className="text-blue-500" />,
      children: (
        <div className="pb-4">
          <h4 className="font-semibold text-gray-800">2019</h4>
          <p className="text-gray-600">Mở rộng ra thị trường online và ra mắt website chính thức</p>
        </div>
      ),
    },
    {
      dot: <ShoppingOutlined className="text-green-500" />,
      children: (
        <div className="pb-4">
          <h4 className="font-semibold text-gray-800">2021</h4>
          <p className="text-gray-600">Khai trương cửa hàng đầu tiên tại TP.HCM</p>
        </div>
      ),
    },
    {
      dot: <TrophyOutlined className="text-yellow-500" />,
      children: (
        <div className="pb-4">
          <h4 className="font-semibold text-gray-800">2024</h4>
          <p className="text-gray-600">Đạt 50,000+ khách hàng tin yêu và 5 cửa hàng trên toàn quốc</p>
        </div>
      ),
    },
  ];

  const teamMembers = [
    {
      name: "Nguyễn Minh Anh",
      role: "CEO & Founder",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      description: "10+ năm kinh nghiệm trong ngành thời trang"
    },
    {
      name: "Trần Thị Lan",
      role: "Creative Director",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      description: "Chuyên gia thiết kế với tầm nhìn sáng tạo"
    },
    {
      name: "Lê Văn Đức",
      role: "Marketing Manager",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      description: "Chiến lược marketing hiệu quả và sáng tạo"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="relative inline-block">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              Về Chúng Tôi
            </h1>
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-pink-200 rounded-full opacity-60 animate-pulse"></div>
            <div className="absolute -bottom-2 -left-6 w-8 h-8 bg-purple-200 rounded-full opacity-40 animate-bounce"></div>
          </div>
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Chúng tôi là những người đam mê thời trang, mang đến cho bạn những sản phẩm chất lượng cao với phong cách hiện đại và tinh tế.
          </p>
        </div>
        <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full opacity-20 animate-float"></div>
        <div className="absolute bottom-10 right-10 w-16 h-16 bg-gradient-to-r from-blue-300 to-indigo-300 rounded-full opacity-20 animate-float" style={{animationDelay: '1s'}}></div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <Row gutter={[32, 32]}>
            <Col xs={24} lg={12}>
              <Card className="h-full border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-pink-500 to-rose-600">
                <div className="text-center text-white">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                    <HeartOutlined className="text-3xl text-white" />
                  </div>
                  <h3 className="text-3xl font-bold mb-4">Sứ Mệnh</h3>
                  <p className="text-lg leading-relaxed opacity-95">
                    Mang đến cho khách hàng những sản phẩm thời trang chất lượng cao, 
                    giúp mọi người tự tin thể hiện phong cách riêng và tỏa sáng trong cuộc sống.
                  </p>
                </div>
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card className="h-full border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-purple-500 to-indigo-600">
                <div className="text-center text-white">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                    <StarOutlined className="text-3xl text-white" />
                  </div>
                  <h3 className="text-3xl font-bold mb-4">Tầm Nhìn</h3>
                  <p className="text-lg leading-relaxed opacity-95">
                    Trở thành thương hiệu thời trang hàng đầu Việt Nam, 
                    được yêu thích bởi chất lượng vượt trội và dịch vụ khách hàng xuất sắc.
                  </p>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      {/* Company Stats */}
      <section className="py-16 px-4 bg-white bg-opacity-70 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Con Số Ấn Tượng
          </h2>
          <Row gutter={[32, 32]}>
            <Col xs={12} md={6}>
              <div className="text-center group cursor-pointer">
                <div className="bg-gradient-to-r from-pink-500 to-rose-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <UserOutlined className="text-3xl text-white" />
                </div>
                <Statistic
                  value={50000}
                  suffix="+"
                  className="text-2xl font-bold text-gray-800"
                  formatter={(value) => <span className="text-3xl font-bold text-gray-800">{value.toLocaleString()}</span>}
                />
                <p className="text-gray-600 font-medium mt-2">Khách hàng hài lòng</p>
              </div>
            </Col>
            <Col xs={12} md={6}>
              <div className="text-center group cursor-pointer">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <ShoppingOutlined className="text-3xl text-white" />
                </div>
                <Statistic
                  value={5}
                  className="text-2xl font-bold text-gray-800"
                  formatter={(value) => <span className="text-3xl font-bold text-gray-800">{value}</span>}
                />
                <p className="text-gray-600 font-medium mt-2">Cửa hàng</p>
              </div>
            </Col>
            <Col xs={12} md={6}>
              <div className="text-center group cursor-pointer">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <TrophyOutlined className="text-3xl text-white" />
                </div>
                <Statistic
                  value={6}
                  className="text-2xl font-bold text-gray-800"
                  formatter={(value) => <span className="text-3xl font-bold text-gray-800">{value}</span>}
                />
                <p className="text-gray-600 font-medium mt-2">Năm kinh nghiệm</p>
              </div>
            </Col>
            <Col xs={12} md={6}>
              <div className="text-center group cursor-pointer">
                <div className="bg-gradient-to-r from-purple-500 to-violet-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <GlobalOutlined className="text-3xl text-white" />
                </div>
                <Statistic
                  value={100}
                  suffix="+"
                  className="text-2xl font-bold text-gray-800"
                  formatter={(value) => <span className="text-3xl font-bold text-gray-800">{value.toLocaleString()}</span>}
                />
                <p className="text-gray-600 font-medium mt-2">Sản phẩm</p>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Hành Trình Phát Triển
          </h2>
          <Card className="border-0 shadow-xl bg-white bg-opacity-80 backdrop-blur-sm">
            <Timeline
              mode="alternate"
              items={timelineItems}
              className="px-4"
            />
          </Card>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 px-4 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Đội Ngũ Của Chúng Tôi
          </h2>
          <p className="text-xl text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Những con người tài năng và đam mê, luôn nỗ lực để mang đến trải nghiệm tốt nhất cho khách hàng
          </p>
          <Row gutter={[32, 32]} justify="center">
            {teamMembers.map((member, index) => (
              <Col xs={24} md={8} key={index}>
                <Card className="text-center border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 bg-white">
                  <div className="relative inline-block mb-6">
                    <Avatar
                      size={120}
                      src={member.avatar}
                      className="border-4 border-gradient-to-r from-pink-300 to-purple-300 shadow-lg"
                    />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <h4 className="text-2xl font-bold text-gray-800 mb-2">{member.name}</h4>
                  <p className="text-lg text-pink-600 font-semibold mb-3">{member.role}</p>
                  <p className="text-gray-600 leading-relaxed">{member.description}</p>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Giá Trị Cốt Lõi
          </h2>
          <p className="text-xl text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Những nguyên tắc định hướng mọi hoạt động của chúng tôi
          </p>
          <Row gutter={[32, 32]}>
            <Col xs={24} md={8}>
              <Card className="h-full border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-amber-400 via-orange-500 to-red-500">
                <div className="text-center text-white">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                    <TrophyOutlined className="text-3xl text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Chất Lượng</h3>
                  <p className="text-base leading-relaxed opacity-95">
                    Cam kết mang đến sản phẩm chất lượng cao nhất, 
                    từ chất liệu đến thiết kế và hoàn thiện.
                  </p>
                </div>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card className="h-full border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600">
                <div className="text-center text-white">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                    <HeartOutlined className="text-3xl text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Tận Tâm</h3>
                  <p className="text-base leading-relaxed opacity-95">
                    Luôn lắng nghe và đặt khách hàng làm trung tâm 
                    trong mọi quyết định và hành động.
                  </p>
                </div>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card className="h-full border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600">
                <div className="text-center text-white">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                    <StarOutlined className="text-3xl text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Sáng Tạo</h3>
                  <p className="text-base leading-relaxed opacity-95">
                    Không ngừng đổi mới và sáng tạo để mang đến 
                    những trải nghiệm mới mẻ và thú vị.
                  </p>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default AboutUs;