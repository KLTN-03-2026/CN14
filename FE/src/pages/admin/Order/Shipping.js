import { Button, Col, Form, Input, message, Modal, Row, } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { getCookie } from "../../../helpers/cookie";
import NoRole from "../../../components/NoRole";
import { shippingSettingsGet, shippingSettingsPatch } from "../../../services/admin/orderServies";

function ShippingSettings() {
  const permissions = JSON.parse(localStorage.getItem('permissions'));

  const token = getCookie("token");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form] = Form.useForm();

  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const response = await shippingSettingsGet(token);
      if (response.code === 200) {
        setData(response.data[0]);
      }
    };
    fetchData();
  }, [token]);

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
    try {
      const response = await shippingSettingsPatch(token, e);
      if (response.code === 200) {
        message.success("Cập nhật thành công");
        setIsModalOpen(false);
      } else {
        if (Array.isArray(response.message)) {
          const allErrors = response.message.map((err) => err.message).join("\n");
          message.error(allErrors);
        } else {
          message.error(response.message || "Có lỗi xảy ra, vui lòng thử lại!");
        }
      }
    } catch (error) {
      message.error("Cập nhật thất bại");
    }
  };

  return (
    <>
      {permissions.includes("orders_view") ?
        <>
          <Button icon={<EditOutlined />} type="primary" ghost onClick={showModal} >Phí vận chuyển

          </Button>
          <Modal
            title="Cài đặt phí vận chuyển"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={null}
            width={"50%"}
          >
            <Form onFinish={onFinish} layout="vertical" form={form} initialValues={data}>
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Form.Item label="Phí vận chuyển" name="defaultFee">
                    <Input type="number" min={1} />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Ngưỡng miễn phí" name="freeThreshold">
                    <Input type="number" min={1} />
                  </Form.Item>
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
          </Modal>
        </>
        :
        <NoRole />
      }
    </>
  );
}

export default ShippingSettings;
