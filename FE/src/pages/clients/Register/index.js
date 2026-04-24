import { Button, Card, Form, Input, message, Typography, Divider } from "antd"
import {
  UserOutlined,
  LockOutlined,
  UserAddOutlined,
  MailOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  ShoppingOutlined,
  StarOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons"
import { useState } from "react"
import Link from "antd/es/typography/Link"
import { getCookie, setCookie } from "../../../helpers/cookie";
import { checkLoginUser } from "../../../actions/loginUser";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerPost, sendEmailOTP, verifyEmailOTP } from "../../../services/client/userServies";
import { useEffect } from "react";
const { Title, Text } = Typography

export default function Register() {
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token = getCookie("tokenUser");

  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (token) {
      navigate("/"); // đồng bộ Redux state từ cookie
    }
  }, [navigate, token]);

  const handleSubmit = async (e) => {
    if (!verified) {
      message.warning("Vui lòng xác thực email trước khi đăng ký!");
      return;
    }

    setLoading(true);
    try {
      const response = await registerPost(e);
      
      if (response.code === 200) {
        setCookie("email", e.email, 24);
        setCookie("fullName", e.fullName, 24);
        setCookie("tokenUser", response.tokenUser, 24);
        dispatch(checkLoginUser(true));
        message.success(response.message);
        navigate("/");
      } else if (response.code === 429) {
        message.error(response.message);
      } else {
        if (Array.isArray(response.message)) {
          const allErrors = response.message.map(err => err.message).join("\n");
          message.error(allErrors);
        } else {
          message.error(response.message);
        }
      }
    } catch (error) {
      message.error("Lỗi khi tạo tài khoản!");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async () => {
    try {
      const email = form.getFieldValue("email");
      if (!email) return message.warning("Vui lòng nhập email trước!");
      const response = await sendEmailOTP(email);
      if (response.code === 200) {
        message.success(`${response.message}`);
        setOtpSent(true);
      } else {
        message.error(response.message || "Gửi mã OTP thất bại!");
      }
    } catch (err) {
      message.error(err.response?.message || "Gửi mã OTP thất bại!");
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const email = form.getFieldValue("email");
      const otp = form.getFieldValue("otp");

      if (!otp) return message.warning("Vui lòng nhập mã xác thực!");
      const res = await verifyEmailOTP(email, otp);
      if (res.code === 200) {
        message.success("Xác thực email thành công!");
        setVerified(true);
      } else {
        message.error(res.message || "Mã xác thực không hợp lệ!");
      }
    } catch (err) {
      message.error(err.response?.message || "Xác thực thất bại!");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 border border-white/30 rounded-full"></div>
          <div className="absolute top-40 right-32 w-24 h-24 border border-white/20 rounded-full"></div>
          <div className="absolute bottom-32 left-32 w-40 h-40 border border-white/25 rounded-full"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <ShoppingOutlined className="text-4xl mr-3" />
              <span className="text-2xl font-bold">ShopHub</span>
            </div>
            <h1 className="text-4xl font-bold mb-4 leading-tight">Join Our Shopping Community</h1>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Create your account and discover thousands of products with exclusive deals and personalized
              recommendations.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <StarOutlined className="text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Exclusive Deals</h3>
                <p className="text-blue-100">Get access to member-only discounts and early sales</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                {/* <ShieldCheckOutlined className="text-xl" /> */}
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Secure Shopping</h3>
                <p className="text-blue-100">Your data and transactions are protected with enterprise-grade security</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <UserOutlined className="text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Personalized Experience</h3>
                <p className="text-blue-100">Tailored recommendations based on your preferences</p>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/20">
            <p className="text-blue-100 text-sm">
              "The best shopping experience I've ever had. Fast delivery and amazing customer service!"
              <span className="block mt-2 font-medium">- Sarah Johnson, Verified Customer</span>
            </p>
          </div>
        </div>
      </div>

      {/* Right Section - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <Card className="shadow-xl border-0 rounded-2xl">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserAddOutlined className="text-2xl text-blue-600" />
              </div>
              <Title level={2}>Tạo tài khoản</Title>
              <Text className="text-gray-600">
                Xác thực email của bạn để tiếp tục đăng ký
              </Text>
            </div>

            <Form
              form={form}
              name="register"
              onFinish={handleSubmit}
              layout="vertical"
              size="large"
              requiredMark={false}
            >
              <Form.Item
                name="fullName"
                label="Họ và tên"
                rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Họ và tên" />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Vui lòng nhập email" },
                  { type: "email", message: "Email không hợp lệ" },
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="Nhập email"
                  disabled={verified}
                  suffix={
                    !otpSent ? (
                      <Button type="link" onClick={handleSendOTP}>
                        Gửi mã
                      </Button>
                    ) : verified ? (
                      <SafetyCertificateOutlined className="text-green-600" />
                    ) : (
                      <Button type="link" onClick={handleSendOTP}>
                        Gửi lại
                      </Button>
                    )
                  }
                />
              </Form.Item>

              {otpSent && !verified && (
                <Form.Item
                  name="otp"
                  label="Mã xác thực"
                  rules={[{ required: true, message: "Vui lòng nhập mã OTP" }]}
                >
                  <Input
                    maxLength={6}
                    placeholder="Nhập mã 6 số"
                    suffix={
                      <Button type="link" onClick={handleVerifyOTP}>
                        Xác thực
                      </Button>
                    }
                  />
                </Form.Item>
              )}

              <Form.Item
                name="password"
                label="Mật khẩu"
                rules={[{ required: true, message: "Nhập mật khẩu!" }]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  iconRender={(v) => (v ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                  placeholder="Nhập mật khẩu"
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label="Xác nhận mật khẩu"
                dependencies={["password"]}
                rules={[
                  { required: true, message: "Xác nhận mật khẩu!" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value)
                        return Promise.resolve();
                      return Promise.reject(new Error("Mật khẩu không khớp!"));
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  iconRender={(v) => (v ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                  placeholder="Nhập lại mật khẩu"
                />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                disabled={!verified}
              >
                {loading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
              </Button>
            </Form>

            <div className="text-center mt-6">
              <Text className="text-gray-500 text-sm">
                Bằng cách tạo tài khoản, bạn đồng ý với{" "}
                <Link href="/terms" className="text-blue-600 hover:text-blue-700">
                  Điều khoản dịch vụ
                </Link>{" "} và{" "}
                <Link href="/privacy" className="text-blue-600 hover:text-blue-700">
                  Chính sách bảo mật
                </Link>
              </Text>
            </div>

            <Divider />
            <div className="text-center">
              <Link href="/login">
                <Button type="link">Đăng nhập thay thế</Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
