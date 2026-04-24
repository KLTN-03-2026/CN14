import { useEffect, useState } from "react";
import { infoGet } from "../../../services/client/userServies";
import { getCookie } from "../../../helpers/cookie";
import { Avatar, Card, Col, message, Row, Tabs, } from "antd";
import { UserOutlined } from "@ant-design/icons";
import "./InfoUser.scss";
import { useNavigate } from "react-router-dom";
import ChangePassword from "./ChangePassword";
import Info from "./Info";
import ExchangePoints from "./ExchangePoints";

function InfoUser() {
  const tokenUser = getCookie("tokenUser");
  const [infoUser, setInfoUser] = useState({});

  const navigate = useNavigate();

  const fetchApi = async () => {
    try {
      const response = await infoGet(tokenUser);
      if (response.code === 200) {
        setInfoUser(response.data);

      } else if (response.code === 404) {
        navigate("/logout");
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  useEffect(() => {
    fetchApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const items = [
    {
      key: "1",
      label: <>Thông tin cá nhân</>,
      children: (
        <>
          <Info />
        </>
      ),
    },
    {
      key: "2",
      label: <>Thay đổi mật khẩu?</>,
      children: (
        <>
          <ChangePassword />
        </>
      ),
    },
    {
      key: "3",
      label: <>Đổi điểm lấy quà</>,
      children: (
        <>
          <ExchangePoints infoUser={infoUser} />
        </>
      ),
    }
  ];

  return (
    <>
      <Row gutter={[24, 24]}>
        {infoUser && (
          <>
            <Col span={24}>
              <div className="card-info__menu">
                <Card
                  title={
                    <>
                      <Avatar
                        size={50}
                        src={infoUser.avatar}
                        icon={<UserOutlined />}
                      />{" "}
                      {infoUser.fullName}
                    </>
                  }
                >
                  <Tabs
                    defaultActiveKey="cod"
                    tabPosition={"left"}
                    items={items}
                    type="card"
                    onChange={onchange}
                  />
                </Card>
              </div>
            </Col>
          </>
        )}
      </Row>
    </>
  );
}

export default InfoUser;
