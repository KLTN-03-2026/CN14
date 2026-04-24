import { Button, Col, Form, Input, message, Modal, Row } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useState } from "react";
import { EditOutlined } from "@ant-design/icons";
import { editRolePatch } from "../../../services/admin/rolesServies";
import { getCookie } from "../../../helpers/cookie";
import NoRole from "../../../components/NoRole";


const RoleEdit = (props) => {
  const permissions = JSON.parse(localStorage.getItem('permissions'));

  const { record, onReload } = props;
  const token = getCookie("token");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form] = Form.useForm();

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
    e.description = !e.description ? "" : e.description;
    if (e.title === "") {
      message.error("Vui lòng nhập tiêu đề!");
    } else {
      const response = await editRolePatch(record._id, e, token);
      if (response.code === 200) {
        message.success("Cap nhap thanh cong");
        onReload();
        handleCancel();
      } else if (response.code === 403) {
        message.error(response.message);
      } else {
        message.error(response.message);
      }
    }
  }

  return (
    <>
      {permissions.includes("roles_edit") ?
        <>
          <Button icon={<EditOutlined />} type="primary" ghost onClick={showModal} />
          <Modal
            title="Chỉnh sửa"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={null}
            width={"70%"}
          >
            <Form onFinish={onFinish} layout="vertical" form={form} initialValues={record}>
              <Row>
                <Col span={24}>
                  <Form.Item label="Tiêu đề" name="title">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Mô tả" name="description">
                    <TextArea rows={6} />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item name="btn">
                    <Button type="primary" htmlType="submit" >
                      Cập nhập
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
  )
}

export default RoleEdit;