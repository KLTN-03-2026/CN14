import { useState } from "react";
import {
  Button,
  Input,
  Checkbox,
  Form,
  Divider,
  message,
} from "antd";
import {
  MailOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  ShoppingOutlined,
  StarOutlined,
  UserOutlined,
  SafetyOutlined,
  GoogleOutlined,
  FacebookOutlined,
} from "@ant-design/icons";
import Link from "antd/es/typography/Link";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { loginUserPost } from "../../../services/client/loginServies";
import { mergeCartPatch } from "../../../services/client/cartServies";
import { addFavorite } from "../../../helpers/favorites";
import { setCookie } from "../../../helpers/cookie";
import { clearCart, getCart } from "../../../helpers/cartStorage";
import { checkLoginUser } from "../../../actions/loginUser";
import { updateCartLength } from "../../../actions/cart";

export default function LoginUser() {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await loginUserPost(values);

      if (response.code === 200) {
        message.success("Đăng nhập thành công");

        // Đồng bộ yêu thích
        response.favorites?.forEach((item) => addFavorite(item.product_id));

        // Đồng bộ giỏ hàng
        const cartItems = getCart();
        const responseMergeCart = await mergeCartPatch(
          { cartItems },
          response.tokenUser
        );

        if (responseMergeCart.code === 200) {
          dispatch(updateCartLength(responseMergeCart.totalQuantity));
          clearCart();
        } else {
          message.warning(responseMergeCart.message);
        }

        // Lưu cookie
        setCookie("email", values.email, 24);
        setCookie("avatar", response.avatar, 24);
        setCookie("tokenUser", response.tokenUser, 24);
        setCookie("fullName", response.fullName, 24);
        setCookie("userId", response.userId, 24);

        dispatch(checkLoginUser(true));
        navigate("/");
      } else {
        message.error(response.message);
      }
    } catch (err) {
      console.error(err);
      message.error("Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="max-w-md">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <ShoppingOutlined className="text-2xl" />
              </div>
              <h1 className="text-3xl font-bold">ShopHub</h1>
            </div>
            <h2 className="text-4xl font-bold mb-6">
              Chào mừng trở lại với cửa hàng của chúng tôi
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Khám phá hàng ngàn sản phẩm chất lượng cao với giá cả tốt nhất.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <StarOutlined className="text-lg" />
                </div>
                <span className="text-lg">10,000+ sản phẩm chất lượng</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <UserOutlined className="text-lg" />
                </div>
                <span className="text-lg">Tin tưởng bởi 50,000+ khách hàng</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <SafetyOutlined className="text-lg" />
                </div>
                <span className="text-lg">Bảo mật thanh toán 100%</span>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl" />
      </div>

      {/* Right Side */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Đăng nhập
              </h1>
              <p className="text-lg text-gray-600">
                Nhập thông tin để truy cập tài khoản
              </p>
            </div>

            <Form
              form={form}
              onFinish={handleSubmit}
              layout="vertical"
              size="large"
              className="space-y-4"
            >
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Vui lòng nhập email!" },
                  { type: "email", message: "Email không hợp lệ!" },
                ]}
              >
                <Input
                  prefix={<MailOutlined className="text-gray-400" />}
                  placeholder="Nhập email"
                  className="h-12 rounded-lg"
                />
              </Form.Item>

              <Form.Item
                name="password"
                label="Mật khẩu"
                rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-gray-400" />}
                  placeholder="Nhập mật khẩu"
                  iconRender={(v) =>
                    v ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                  className="h-12 rounded-lg"
                />
              </Form.Item>

              <div className="flex items-center justify-between mb-6">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox className="text-sm text-gray-600">
                    Ghi nhớ đăng nhập
                  </Checkbox>
                </Form.Item>

                <Link
                  href="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                >
                  Quên mật khẩu?
                </Link>
              </div>

              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 border-none rounded-lg font-semibold text-lg"
              >
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>
            </Form>

            <Divider className="my-6">
              <span className="text-xs uppercase text-gray-500">
                Hoặc tiếp tục với
              </span>
            </Divider>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <Button
                icon={<GoogleOutlined />}
                className="h-12 flex items-center justify-center gap-2 border-gray-300 hover:border-gray-400"
              >
                Google
              </Button>

              <Button
                icon={<FacebookOutlined />}
                className="h-12 flex items-center justify-center gap-2 border-gray-300 hover:border-gray-400"
              >
                Facebook
              </Button>
            </div>

            <div className="text-center">
              <span className="text-gray-600">Chưa có tài khoản? </span>
              <Link
                href="/register"
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                Đăng ký ngay
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
