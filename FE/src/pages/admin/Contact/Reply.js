import { Button, Col, Form, Input, message, Modal, Row } from "antd";
import { MessageOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { getCookie } from "../../../helpers/cookie";
import NoRole from "../../../components/NoRole";
import MyEditor from "../../../components/MyEditor";
import { replyContact } from "../../../services/admin/contactServies";

function ContactReply(props) {
  const permissions = JSON.parse(localStorage.getItem('permissions'));
  const { record } = props;
  const token = getCookie("token");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (!token) {
      message.error("Token không tồn tại, vui lòng đăng nhập!");
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = async (e) => {
    const contact_id = record._id;
    const response = await replyContact(token, e, contact_id);
    if (response.code === 200) {
      message.success(response.message);
      handleCancel();
      form.resetFields();
    } else {
      message.error(response.message)
    }
  };

  return (
    <>
      {permissions.includes("users_view") ?
        <>
          <Button icon={<MessageOutlined />} type="primary"
            style={{ marginLeft: "10px" }}
            ghost onClick={showModal} />
          <Modal
            title={`Phản hồi khách hàng '${record.fullName}' (${record.email})`}
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={null}
            width={"70%"}
          >
            <Form onFinish={onFinish} layout="vertical" form={form}
            >
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Form.Item label="Tiêu đề" name="title"
                    rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}>
                    <Input />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item label="Nội dung" name="content"
                    rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}>
                    <MyEditor />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" name="btn">
                      Gửi
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Modal>
        </>
        :
        <NoRole />
      }
    </>
  );
}

export default ContactReply;
