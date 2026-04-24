import { Button, Card, Col, Form, Input, message, Row } from "antd";
import { useEffect, useState } from "react";
import { getCookie } from "../../../helpers/cookie";
import { settingGeneralGet, settingGeneralPatch } from "../../../services/admin/settingGeneralServies";
import NoRole from "../../../components/NoRole";
import UploadFile from "../../../components/UploadFile";

function SettingGeneral() {
  const permissions = JSON.parse(localStorage.getItem('permissions'));

  const token = getCookie("token");
  const [form] = Form.useForm();

  // upload img
  const [logo, setLogo] = useState("");
  // upload img

  const fetchApi = async () => {
    try {
      const response = await settingGeneralGet(token);
      if (response.code === 200) {
        form.setFieldsValue(response.setting[0]);
        setLogo(response.setting[0].logo);
      } else {
        if (Array.isArray(response.message)) {
          const allErrors = response.message.map(err => err.message).join("\n");
          message.error(allErrors);
        } else {
          message.error(response.message);
        }
      }
    } catch (error) {
      message.error("Lỗi khi tải cài đặt chung:", error.message);
    }
  }

  useEffect(() => {

    fetchApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onReload = () => {
    fetchApi();
  }

  const onFinish = async (e) => {
    e.logo = logo ? logo : "";
    e.facebook = e.facebook ? e.facebook : "";
    e.address = e.address ? e.address : "";
    e.instagram = e.instagram ? e.instagram : "";
    if (!e.websiteName) {
      message.error("Vui lòng nhập tên website!");
      return;
    }

    if (!e.email) {
      message.error("Vui lòng nhập email!");
      return;
    }

    // Kiểm tra số điện thoại
    if (!e.phone) {
      e.phone = "";
    } else {
      // Kiểm tra xem số điện thoại có phải là một chuỗi gồm toàn số và có độ dài 10 không
      const phoneRegex = /^[0-9]{10}$/;

      if (!phoneRegex.test(e.phone)) {
        message.error("Số điện thoại phải là 10 chữ số và không chứa ký tự!");
        return;
      }
    }

    if (!e.copyright) {
      message.error("Vui lòng nhập CopyRight!");
      return;
    }

    const response = await settingGeneralPatch(e, token);
    if (response.code === 200) {
      message.success("Cập nhật thành công")
      onReload();
    } else {
      if (Array.isArray(response.message)) {
        const allErrors = response.message.map(err => err.message).join("\n");
        message.error(allErrors);
      } else {
        message.error(response.message);
      }
    }

  }

  return (
    <>
      {permissions.includes("settings_general") ?
        <Card title="Cài đặt chung">
          <Card
            style={{
              marginTop: 10,
              width: "100%"
            }}
            type="inner"
          >
            <Form onFinish={onFinish} layout="vertical" form={form} >
              <Row>
                <Col span={24}>
                  <Form.Item label="Tên website" name="websiteName">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Email" name="email">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Số điện thoại" name="phone">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Địa chỉ" name="address">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Facebook" name="facebook">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Instagram" name="instagram">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Lazada" name="lazada">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Shopee" name="shopee">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Tiki" name="tiki">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="CopyRight" name="copyright">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Map" name="map_url">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <UploadFile
                    onImageUrlsChange={setLogo}
                    initialImageUrls={logo}
                  />
                </Col>
                <Col span={24}>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" >
                      Cập nhập
                    </Button>
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

export default SettingGeneral;