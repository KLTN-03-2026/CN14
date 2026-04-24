import { Button, Divider, Form, Input, message, Space, Typography } from "antd";
import { FacebookOutlined, TikTokOutlined, InstagramOutlined } from "@ant-design/icons"
import { postSendContact } from "../../services/client/contactServies";
const { Text } = Typography

const benefits = [
  {
    icon: (
      <svg
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27,6.96 12,12.01 20.73,6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
    title: "Phí vận chuyển",
    description: "Miễn phí vận chuyển cho đơn hàng trên 500k",
  },
  {
    icon: (
      <svg
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <path d="m12 17 .01 0" />
      </svg>
    ),
    title: "Bảo đảm tiền",
    description: "Trong vòng 30 ngày để đổi hàng.",
  },
  {
    icon: (
      <svg
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M9 12l2 2 4-4" />
        <path d="M21 12c.552 0 1-.448 1-1V8c0-.552-.448-1-1-1h-3c-.552 0-1-.448-1-1V3c0-.552-.448-1-1-1H8c-.552 0-1 .448-1 1v3c0 .552-.448 1-1 1H3c-.552 0-1 .448-1 1v3c0 .552.448 1 1 1h3c.552 0 1 .448 1 1v3c0 .552.448 1 1 1h3c.552 0 1 .448 1 1v3c0 .552.448 1 1 1h3c.552 0 1-.448 1-1v-3c0-.552.448-1 1-1h3z" />
      </svg>
    ),
    title: "Hỗ trợ trực tuyến",
    description: "24 giờ một ngày, 7 ngày một tuần",
  },
  {
    icon: (
      <svg
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <rect width="20" height="14" x="2" y="5" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </svg>
    ),
    title: "Thanh toán linh hoạt",
    description: "Thanh toán nhiều hình thức",
  },
];

function FooterClient({ setting }) {
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    values.title = "Đăng ký nhận tin";
    values.fullName = "Đăng ký nhận tin";
    values.phone = "0123456789";
    values.description = "Đăng ký nhận tin";
    
    const response = await postSendContact(values);
    if (response.code === 200) {
      message.success("Đăngy ký nhận tin thành công!");
      form.resetFields();
    } else {
      message.error(response.message)
    }
  };

  return (
    <>
      <footer className="w-full">
        {/* Top Features Section */}
        <div className="bg-gray-50 py-6 border-t border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Feature Items */}
              <div className="flex flex-wrap items-center gap-8">
                {/* Benefits */}
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex flex-col items-center gap-2 text-center">
                    <div className="text-gray-600 mb-2">{benefit.icon}</div>
                    <div>
                      <p className="text-sm font-semibold text-green-700">
                        {benefit.title}
                      </p>
                      <p className="text-xs text-gray-600">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Contact Buttons */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div>
                    <p className="text-xs text-gray-600">HOTLINE CSKH</p>
                    <p className="text-lg font-bold text-white bg-green-700 px-4 py-1 rounded-full">1800 6324</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div>
                    <p className="text-xs text-gray-600">TÌM CHI NHÁNH</p>
                    <p className="text-lg font-bold text-white bg-green-700 px-4 py-1 rounded-full">Hệ thống {setting.websiteName}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Section */}
        <div className="bg-green-800 text-white py-8">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Customer Support */}
              <div>
                <h3 className="font-bold text-sm mb-4 uppercase">Hỗ trợ khách hàng</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <span className="text-yellow-400">Hotline: 1800 6324</span>
                    <br />
                    <span className="text-xs">(miễn phí, 08-22h kể cả T7, CN)</span>
                  </li>
                  <li>
                    <a href="/" className="hover:text-yellow-400">
                      Các câu hỏi thường gặp
                    </a>
                  </li>
                  <li>
                    <a href="/ho-tro/lien-he" className="hover:text-yellow-400">
                      Liên hệ
                    </a>
                  </li>
                  <li>
                    <a href="/ho-tro/dat-hang" className="hover:text-yellow-400">
                      Hướng dẫn đặt hàng
                    </a>
                  </li>
                  <li>
                    <a href="/" className="hover:text-yellow-400">
                      Phương thức vận chuyển
                    </a>
                  </li>
                  <li>
                    <a href="/ho-tro/doi-tra" className="hover:text-yellow-400">
                      Chính sách đổi trả
                    </a>
                  </li>
                </ul>
              </div>

              {/* About Hasaki */}
              <div>
                <h3 className="font-bold text-sm mb-4 uppercase">Về {setting.websiteName}.vn</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="/about-us" className="hover:text-yellow-400">
                      Giới thiệu
                    </a>
                  </li>
                  <li>
                    <a href="/" className="hover:text-yellow-400">
                      Chính sách bảo mật
                    </a>
                  </li>
                  <li>
                    <a href="/" className="hover:text-yellow-400">
                      Điều khoản sử dụng
                    </a>
                  </li>
                  <li>
                    <a href="/" className="hover:text-yellow-400">
                      Cẩm nang
                    </a>
                  </li>
                  <li>
                    <a href="/" className="hover:text-yellow-400">
                      Tuyển dụng
                    </a>
                  </li>
                </ul>
              </div>

              {/* Partnership */}
              <div>
                <h3 className="font-bold text-sm mb-4 uppercase">Hợp tác & liên kết</h3>
                <ul className="space-y-2 text-sm mb-4">
                  <li>
                    <a href="/" className="hover:text-yellow-400">
                      {setting.websiteName}
                    </a>
                  </li>
                  <li>
                    <a href="/" className="hover:text-yellow-400">
                      DermaHair
                    </a>
                  </li>
                </ul>

                {/* Social Media */}
                <div className="flex gap-3 mb-4">
                  <a href={setting.facebook} target="_blank"
                    className="w-10 h-10 bg-white rounded flex items-center justify-center hover:bg-gray-100"
                    rel="noreferrer">
                    <FacebookOutlined className="text-green-800 text-xl" />
                  </a>
                  <a href={setting.facebook} target="_blank" rel="noreferrer"
                    className="w-10 h-10 bg-white rounded flex items-center justify-center hover:bg-gray-100">
                    <TikTokOutlined className="text-green-800 text-xl" />
                  </a>
                  <a href={setting.instagram} target="_blank" rel="noreferrer"
                    className="w-10 h-10 bg-white rounded flex items-center justify-center hover:bg-gray-100">
                    <InstagramOutlined className="text-green-800 text-xl" />
                  </a>
                </div>

                {/* Payment Methods */}
                <div>
                  <p className="text-xs font-bold mb-2">THANH TOÁN</p>
                  <div className="flex gap-2">
                    <div className="bg-white px-2 py-1 rounded text-xs font-bold text-green-700">Mastercard</div>
                    <div className="bg-white px-2 py-1 rounded text-xs font-bold text-blue-600">ATM</div>
                    <div className="bg-white px-2 py-1 rounded text-xs font-bold text-blue-700">VISA</div>
                  </div>
                </div>
              </div>

              {/* Newsletter */}
              <div>
                <h3 className="font-bold text-sm mb-4 uppercase">Cập nhật thông tin khuyến mãi</h3>

                <Form
                  layout="vertical"
                  form={form}
                  onFinish={handleSubmit}
                  requiredMark={false}
                >
                  <div className="flex gap-2 mb-4">
                    <Form.Item
                      name="email"
                      rules={[
                        { required: true, message: "Vui lòng nhập email!" },
                        { type: "email", message: "Email không hợp lệ!" },
                      ]}
                    >
                      <Input placeholder="Email của bạn" />
                    </Form.Item>
                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded transition-colors"
                      >
                        Gửi yêu cầu
                      </Button>
                    </Form.Item>
                  </div>
                </Form>

                {/* QR Code and App Store */}
                <div className="flex gap-4 items-start">
                  <div className="w-20 h-20 bg-white p-1">
                    <div className="w-full h-full bg-black"></div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="bg-black text-white px-3 py-1 rounded text-xs flex items-center gap-2">
                      <span>🍎</span>
                      <span>App Store</span>
                    </div>
                    <div className="bg-black text-white px-3 py-1 rounded text-xs flex items-center gap-2">
                      <span>▶</span>
                      <span>Google play</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div >

        {/* Brand Logos */}
        <div div className="bg-green-700 py-6" >
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-around items-center flex-wrap gap-8">
              <div className="text-white text-center">
                <div className="text-2xl font-bold">{setting.websiteName}</div>
                <div className="text-xs">Fashion & BEAUTY</div>
              </div>
              <div className="text-white text-center">
                <div className="text-xl">🍃</div>
                <div className="text-xs">Dermalogica</div>
              </div>
              <div className="text-white text-center">
                <div className="text-xl">◉</div>
                <div className="text-xs">Brand Name</div>
              </div>
              <div className="text-white text-center">
                <div className="text-xl font-bold">Mastige</div>
              </div>
            </div>
          </div>
        </div >

        {/* Bottom Section */}
        <div div className="bg-gray-100 py-8" >
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Top Searches */}
              <div className="lg:col-span-2">
                <h3 className="font-bold text-sm mb-4 uppercase">Top tìm kiếm</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    "áo sơ mi",
                    "áo cardigan",
                    "bomber",
                    "jogger",
                    "quần short",
                    "hoodie",
                    "áo polo",
                    "legging",
                    "jeans",
                    "áo giữ nhiệt",
                  ].map((keyword, index) => (
                    <a
                      key={index}
                      href={`/search?keyword=${keyword || ""}`}
                      className="px-3 py-1 bg-white border border-gray-300 rounded text-xs hover:border-green-700 hover:text-green-700"
                    >
                      {keyword}
                    </a>
                  ))}
                </div>
              </div>

              {/* Certification */}
              <div>
                <h3 className="font-bold text-sm mb-4 uppercase">Vị trí cửa hàng</h3>
                <div
                  style={{
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                    border: "2px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <iframe
                    src={setting.map_url}
                    width="100%"
                    height="200"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Vị trí cửa hàng"
                  />
                </div>

                <div className="mt-4 text-xs text-gray-600">
                  <p className="font-bold mb-2">Bản quyền © 2016 {setting.websiteName}.vn</p>
                  <p className="mb-2">Công Ty Cổ phần {setting.websiteName} Fashion & BEAUTY</p>
                  <p className="mb-2">
                    Giấy chứng nhận Đăng ký Kinh doanh số 0313612829 do Sở Kế hoạch và Đầu tư Thành phố Hồ Chí Minh cấp
                    ngày 13/01/2016
                  </p>
                  <p>Trụ sở: {setting.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div >
        <Divider />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
          <Text type="secondary">{setting.copyright}</Text>
          <Space>
            <Button
              type="text"
              icon={
                <span role="img" aria-label="facebook">
                  📘
                </span>
              }
            />
            <Button
              type="text"
              icon={
                <span role="img" aria-label="instagram">
                  📷
                </span>
              }
            />
            <Button
              type="text"
              icon={
                <span role="img" aria-label="twitter">
                  🐦
                </span>
              }
            />
            <Button
              type="text"
              icon={
                <span role="img" aria-label="linkedin">
                  💼
                </span>
              }
            />
          </Space>
        </div>
      </footer >
    </>
  )
}

export default FooterClient;