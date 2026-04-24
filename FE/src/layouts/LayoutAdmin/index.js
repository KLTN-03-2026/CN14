import { Button, Layout } from "antd";
import { useEffect, useState } from "react";
import { CaretLeftOutlined, CaretRightOutlined, HomeOutlined } from "@ant-design/icons";
import "./LayoutAdmin.scss";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import MenuSider from "../../components/MenuSider";
import logo from "../../images/BunzDev.png";
import logoFold from "../../images/B.png";
import { getCookie } from "../../helpers/cookie";

const { Sider, Content } = Layout;

function LayoutAdmin() {
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const name = getCookie('name');
    if (name) {
      setFullName(name);
    }
  }, []);

  return (
    <>
      <Layout>
        <header>
          <div className="header">
            <div className={"header__logo" + (loading ? "header__logo-collapsed" : "")} >
              <img src={loading ? logoFold : logo} alt="logo" />
            </div>
            <div className="header__nav" >
              <div className="header__nav-left">
                <div className="header__nav-menu">
                  {loading ?
                    <CaretRightOutlined onClick={() => setLoading(!loading)} />
                    :
                    <CaretLeftOutlined  onClick={() => setLoading(!loading)} />}
                </div>
              </div>
              <div className="header__nav-right">
                <div className="header__nav-right-title">
                  <Button style={{ marginBottom: "3px" }} onClick={() => { navigate(`/admin/account-info`) }}>
                    <HomeOutlined className="icons_home" /> Xin chào , <b>{fullName}</b>
                  </Button>
                </div>
                <div className="header__nav-right-link">
                  <NavLink to="/" target="_blank"><Button>Trang chủ</Button></NavLink>
                  <NavLink to="/auth/logout"><Button>Đăng xuất</Button></NavLink>
                </div>
              </div>
            </div>
          </div>
        </header>
        <Layout>
          <Sider collapsed={loading} theme="light" style={{ height: "100vh" }} >
            <MenuSider />
          </Sider>
          <Content style={{ height: "100vh" }}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </>
  )
}

export default LayoutAdmin;