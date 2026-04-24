import "./LayoutDefault.scss";
import { Content } from "antd/es/layout/layout";
import { Layout } from "antd";
import FooterClient from "./FooterClient";
import HeaderClient from "./HeaderClient";
import { Outlet } from "react-router-dom";
import { CartProvider } from "../../components/CartProvider";
import ChatBotAi from "../../components/ChatBotAi";
import { settingGeneralGet } from "../../services/client/settingServies";
import { useEffect, useState } from "react";

function LayoutDefault() {
  // Phần hiển thị thông tin trang web
  const [setting, setSetting] = useState([]);

  useEffect(() => {
    const fetchApi = async () => {
      // Lấy thông tin web
      const response = await settingGeneralGet();
      setSetting(response.settings);
    }

    fetchApi();
  }, [])

  return (
    <>
      <CartProvider>
        <Layout style={{ minHeight: '100vh' }}>
          <HeaderClient setting={setting}/>
          <Content className="container" style={{
            flex: 1,
            boxSizing: "border-box", // Đảm bảo padding không ảnh hưởng chiều rộng
          }}>
            <Outlet />
          </Content>
          <FooterClient setting={setting}/>
        </Layout>
      </CartProvider>
      <ChatBotAi />
    </>
  )
}

export default LayoutDefault;
