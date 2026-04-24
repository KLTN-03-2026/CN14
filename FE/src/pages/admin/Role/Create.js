import { Button, Card, Col, Form, Input, message, Row } from "antd";
import TextArea from "antd/es/input/TextArea";
import { createRolePost } from '../../../services/admin/rolesServies';
import { getCookie } from "../../../helpers/cookie";
import { useNavigate } from "react-router-dom";
import NoRole from "../../../components/NoRole";



const RoleCreate = () => {
  const permissions = JSON.parse(localStorage.getItem('permissions'));

  const navigate = useNavigate();
  const token = getCookie("token");

  const onFinish = (e) => {

    e.title = e.title ? e.title : "";
    e.description = e.description ? e.description : "";

    const fetchApiCreate = async () => {
      const response = await createRolePost(e, token);
      if (response.code === 200) {
        message.success("Thêm mới thành công");
        navigate(`/admin/roles`);
      } else {
        message.error(response.message);
      }
    }

    fetchApiCreate();
  }

  return (
    <>
      {permissions.includes("roles_create") ?
        <Card title="Thêm quyền">
          <Card
            style={{
              marginTop: 10,
              width: "100%"
            }}
            type="inner"
          >
            <Form onFinish={onFinish} layout="vertical">
              <Row gutter={[12, 12]}>
                <Col span={24}>
                  <Form.Item label="Tiêu đề" name="title" >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Mô tả" name="description" >
                    <TextArea rows={6} />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item name="btn">
                    <Button type="primary" htmlType="submit">Thêm</Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </Card>
        :
        <NoRole />
      }
    </>
  )
}

export default RoleCreate;