import { Link, useNavigate } from "react-router-dom";
import { getCookie } from "../../helpers/cookie";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { findCartByUserId } from "../../services/client/cartServies";
import { updateCartLength } from "../../actions/cart";
import { Badge, Button, Input, Dropdown, message } from "antd"
import { getCart } from "../../helpers/cartStorage";

import {
  SearchOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  BellOutlined,
  PhoneOutlined,
  HeartOutlined,
  LogoutOutlined,
  TruckFilled,
} from "@ant-design/icons"
import { searchOrder } from "../../services/client/searchServices";

function HeaderClient({ setting }) {
  // eslint-disable-next-line no-unused-vars
  const isLogin = useSelector(state => state.loginUserReducers);

  const tokenUser = getCookie("tokenUser");
  // const avatar = getCookie("avatar");
  const navigate = useNavigate();

  // eslint-disable-next-line no-unused-vars
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const componentRef = useRef(null);

  // Xử lý hiển thị số lượng sản phẩm trong giỏ hàng.
  const dispatch = useDispatch();
  const lengthCart = useSelector((state) => state.cartReducer.lengthCart);

  const [orderCode, setOrderCode] = useState("")
  const [email, setEmail] = useState("")

  // Get user data from cookies
  const fullName = getCookie("fullName")

  useEffect(() => {
    const fetchApiSetting = async () => {
      try {
        // Xử lý giỏ hàng
        if (tokenUser) {
          const resCart = await findCartByUserId(tokenUser);
          if (resCart.code === 200) {
            // Update số lượng sp giỏ hàng
            dispatch(updateCartLength(resCart.totalQuantity));
          }
        } else {
          dispatch(updateCartLength(getCart().reduce((sum, item) => sum + item.quantity, 0)));
        }
      } catch (error) {
        message.error(error.message);
      }
    };

    fetchApiSetting();

    // Gắn sự kiện click trên document
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Hủy gắn sự kiện khi component bị unmount
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  // Xử lý click ngoài để ẩn menu
  const handleClickOutside = (event) => {
    setTimeout(() => {
      if (componentRef.current && !componentRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }, 100); // đủ để Dropdown xử lý
  };


  const handleUserMenuClick = ({ key }) => {
    switch (key) {
      case "profile":
        navigate(`/info-user`);
        break;
      case "orders":
        navigate(`/order/history`);
        break;
      case "logout":
        navigate(`/logout`);
        break;
      default:
        break;
    }
    setIsMenuOpen(false); // Đóng menu sau khi chọn
  };

  const menuItems = [
    {
      title: "HOT DEALS",
      href: "campaign"
    },
    {
      title: "HÀNG MỚI VỀ",
      href: "danh-muc?danhmuc=ao&active=moi-nhat"
    },
    {
      title: "BÁN CHẠY",
      href: "danh-muc?danhmuc=ao&active=ban-chay"
    }
  ]

  const handleTrackOrder = async () => {
    const response = await searchOrder(orderCode, email);
    if (response.code === 200) {
      navigate(`/order/search/${orderCode}/${email}`);
    } else {
      message.error(response.message)
    }
  }

  return (
    <header className="w-full">
      {/* Top Pink Banner */}
      <div className="bg-[#ffa2b6] text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-4 text-sm md:text-base">
          <div className="bg-white text-[#ffa2b6] px-4 py-1 rounded font-bold">
            <div className="flex items-center gap-2 text-sm">
              <TruckFilled className="w-5 h-5 text-blue-600" />
              <span>
                Miễn phí vận chuyển đơn{" "}
                <span className="font-semibold text-blue-600">trên {Number(setting.shippingFee)/1000}k</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Green Header */}
      <div className="bg-[#2D7A5E] text-white">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="bg-white rounded-full p-2 w-12 h-12 flex items-center justify-center">
                <a href="/" className="text-[#2D7A5E] font-bold text-xl">
                  <img src={setting.logo} alt="Logo" />
                </a>
              </div>
              <div className="flex flex-col">
                <a href="/" className="text-[#fff] font-bold text-lg">{setting.websiteName}</a>
                <span className="text-xs opacity-90">Chất lượng thật - Giá trị thật</span>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-md mx-4">
              <Input
                placeholder="Tìm sản phẩm, thương hiệu bạn mong muốn..."
                prefix={<SearchOutlined className="text-gray-400" />}
                className="rounded-full"
                size="large"
                onPressEnter={(e) => {
                  const keyword = e.target.value;
                  navigate(`/search?keyword=${keyword || ""}`);
                }}
                allowClear
              />
            </div>

            {/* Account Menu */}
            <div className="flex items-center gap-4 flex-shrink-0">
              {tokenUser ? (
                <>
                  {/* User Menu */}
                  <Dropdown
                    menu={{
                      items: [
                        {
                          key: "profile",
                          label: `Thông tin tài khoản`,
                        },
                        {
                          key: "orders",
                          label: "Đơn hàng của bạn",
                        },
                        {
                          type: "divider",
                        },
                        {
                          key: "logout",
                          label: (
                            <>
                              <LogoutOutlined /> Đăng xuất
                            </>
                          ),
                        },
                      ],
                      onClick: handleUserMenuClick,
                    }}
                  >
                    <div className="flex items-center gap-2 hover:text-gray-200 transition-colors"
                      style={{ cursor: "pointer" }}>
                      <UserOutlined className="text-xl" />
                      <div className="hidden md:flex flex-col text-xs leading-tight">
                        <span>Chào,{fullName}</span>
                        <span className="font-semibold">Tài khoản ▼</span>
                      </div>
                    </div>
                  </Dropdown>
                </>
              ) : (
                <>
                  {/* Login/Register */}
                  <a href="/login" className="flex items-center gap-2 hover:text-gray-200 transition-colors">
                    <UserOutlined className="text-xl" />
                    <div className="hidden md:flex flex-col text-xs leading-tight">
                      <span>Đăng nhập / Đăng ký</span>
                      <span className="font-semibold">Tài khoản ▼</span>
                    </div>
                  </a>
                </>
              )}

              {/* Wishlist */}
              <Link to="/favorite-products" >
                <Button type="text"
                  className="flex items-center gap-2 hover:text-gray-200 transition-colors"
                  icon={<HeartOutlined style={{ fontSize: "20px", color: "#fff" }} />} />
              </Link>

              {/* Notifications */}
              <a href="/ho-tro/chinh-sach" className="flex items-center gap-2 hover:text-gray-200 transition-colors">
                <BellOutlined className="text-xl" />
                <div className="hidden md:flex flex-col text-xs leading-tight">
                  <span>Bảo</span>
                  <span className="font-semibold">hành</span>
                </div>
              </a>

              {/* Customer Support */}
              <a href="/ho-tro/tai-khoan" className="flex items-center gap-2 hover:text-gray-200 transition-colors">
                <PhoneOutlined className="text-xl" />
                <div className="hidden md:flex flex-col text-xs leading-tight">
                  <span>Hỗ trợ</span>
                  <span className="font-semibold">khách hàng</span>
                </div>
              </a>

              {/* Shopping Cart */}
              <a href="/order/cart" className="hover:text-gray-200 transition-colors">
                <Badge count={lengthCart} showZero className="[&_.ant-badge-count]:bg-red-500">
                  <ShoppingCartOutlined className="text-2xl text-white" />
                </Badge>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="text-white bg-[#E5FBF1]">
        <div className="max-w-7xl mx-auto px-3 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-4 text-sm md:text-base">
            <div className="flex items-center gap-4">
              {menuItems.map((item, index) => (
                <a
                  key={index}
                  href={`/${item.href}`}
                  className="text-sm text-gray-700 hover:text-emerald-600 transition-colors whitespace-nowrap"
                >
                  {item.title}
                </a>
              ))}
              {/* Order Tracking */}
              <Dropdown
                trigger={["click"]}
                dropdownRender={() => (
                  <div className="w-80 p-4 bg-white rounded shadow space-y-4">
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-gray-600 mb-1 block">Mã đơn hàng</label>
                        <Input
                          placeholder="Nhập mã đơn hàng"
                          value={orderCode}
                          onChange={(e) => setOrderCode(e.target.value)}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-600 mb-1 block">Email</label>
                        <Input
                          type="email"
                          placeholder="Nhập email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full"
                        />
                      </div>
                      <Button
                        onClick={handleTrackOrder}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        Tra cứu
                      </Button>
                    </div>
                  </div>
                )}
              >
                <span className="text-sm text-gray-700 hover:text-emerald-600 transition-colors whitespace-nowrap"
                  style={{ cursor: "pointer" }}
                >TRA CỨU ĐƠN HÀNG
                </span>
              </Dropdown>
            </div>
          </div>
        </div>
      </div>
    </header>
  )

}

export default HeaderClient;
