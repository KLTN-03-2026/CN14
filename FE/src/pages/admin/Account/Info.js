import { useEffect, useState } from "react";
import { getCookie, setCookie } from "../../../helpers/cookie";
import { editMyAccount, infoAccountPatch, resetPasswordMyAccount } from "../../../services/admin/accountServies";
import { Button, Card, Col, Form, Input, message, Modal, Row } from "antd";
import Password from "antd/es/input/Password";
import { useNavigate } from "react-router-dom";


function AccountInfo() {
  const token = getCookie('token');
  const [info, setInfo] = useState({});

  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const response = await infoAccountPatch(token);
        if (response.code === 200) {
          setInfo(response.myAccount);
          form.setFieldsValue(response.myAccount);
        } else {
          message.error(response.message);
        }
      } catch (error) {

      }
    }
    fetchApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // xử lý thay đổi thông tin
  const handleChangeInfo = async (e) => {
    if (e.fullName === "" || e.phone === "" || e.email === "") {
      message.error("Không được để trống thông tin!");
      return;
    }
    try {
      const resChangeInfo = await editMyAccount(token, e);
      if (resChangeInfo.code === 200) {
        setCookie("name", e.fullName, 24)
        message.success(resChangeInfo.message);
      } else {
        if (Array.isArray(resChangeInfo.message)) {
          const allErrors = resChangeInfo.message.map(err => err.message).join("\n");
          message.error(allErrors);
        } else {
          message.error(resChangeInfo.message);
        }
      }
    } catch (error) {
      message.error(error);
    }
  }

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // xử lý đổi mật khẩu
  const handleResetPassword = async (e) => {
    try {
      const resResetPassword = await resetPasswordMyAccount(token, e);
      if (resResetPassword.code === 200) {
        message.success(resResetPassword.message);
        handleCancel();
        navigate("/auth/logout");
      } else {
        message.error(resResetPassword.message);
      }
    } catch (error) {

    }
  }

  return (
    <>
      {info && (
        <>
          <Card title="Thông tin cá nhân"
          >
            <Form onFinish={handleChangeInfo} layout="horizontal" form={form}
              labelCol={{
                span: 8,
              }}
              style={{
                maxWidth: 600,
              }}
            >
              <Row>
                <Col span={24}>
                  <Form.Item label="Họ tên" name="fullName">
                    <Input style={{ width: "400px" }} allowClear={true} />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Số điện thoại" name="phone">
                    <Input style={{ width: "400px" }} allowClear={true} />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Email" name="email">
                    <Input style={{ width: "400px" }} allowClear={true} type="email" />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <h3>Quyền: {info.titleRole}</h3>
                </Col>
                <Col span={24}>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" name="btn">
                      Cập nhập
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
            <Button onClick={() => { showModal() }}>Thay đổi mật khẩu?</Button>
          </Card>
        </>
      )}

      {/* Modal đổi mật khẩu  */}
      <Modal
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        width={"40%"}
      >
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px"
        }}>
          <Row>
            <Form className="reset__form" onFinish={handleResetPassword}
              labelCol={{
                span: 8,
              }}
              style={{
                maxWidth: 600,
                minWidth: 300
              }}
            >
              <Col span={24}>
                <Form.Item
                  name="passwordOld"
                  rules={[{ required: true, message: 'Nhập mật khẩu!!!' }]}
                >
                  <Password placeholder="Mật khẩu cũ" />
                </Form.Item>
                <Form.Item
                  name="passwordNew"
                  rules={[{ required: true, message: 'Nhập mật khẩu mới!!!' }]}
                >
                  <Password placeholder="Mật khẩu mới" />
                </Form.Item>
                <Form.Item
                  name="passwordNewComfirm"
                  rules={[{ required: true, message: 'Nhập mật khẩu xác nhận!!!' }]}
                >
                  <Password placeholder="Mật khẩu xác nhận" />
                </Form.Item>
                <Form.Item style={{ textAlign: "center" }}>
                  <Button type="primary" htmlType="submit">
                    Đổi mật khẩu
                  </Button>
                </Form.Item>
              </Col>
            </Form>
          </Row>
        </div>
      </Modal>
    </>
  )
}

export default AccountInfo;