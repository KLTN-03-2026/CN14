import {
  Button,
  Col,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Divider,
  Spin,
} from "antd";
import {
  NotificationOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { getCookie } from "../../../helpers/cookie";
import NoRole from "../../../components/NoRole";
import MyEditor from "../../../components/MyEditor";
import { sendNotifications } from "../../../services/admin/userServies";

function SendNotification(props) {
  const permissions = JSON.parse(localStorage.getItem("permissions"));
  const { records } = props;
  const token = getCookie("token");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [type, setType] = useState("manual"); // manual | rank | filter

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      message.error("Token không tồn tại, vui lòng đăng nhập!");
    }
  }, [token]);

  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const onFinish = async (values) => {
    if (values.type === "rank") {
      if (values.rank === "all") {
        values.emails = records
          .filter(record => 1)
          .map(record => record.email);
      } else {
        values.emails = records
          .filter(record => record.rank === values.rank)
          .map(record => record.email);
      }

    }

    setIsLoading(true);
    try {
      const response = await sendNotifications(token, values);
      if (response.code === 200) {
        message.success(response.message);
        handleCancel();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error("Đã xảy ra lỗi khi gửi thông báo!" + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Options cho Select người dùng
  const optionsUsers = records?.map((user) => ({
    label: user.email,
    value: user.email,
  }));

  const rankOptions = [
    { label: "Tất cả", value: "all" },
    { label: "Thành viên", value: "Member" },
    { label: "Bạc", value: "Silver" },
    { label: "Vàng", value: "Gold" },
    { label: "Bạch kim", value: "Platinum" },
    { label: "Kim cương", value: "Diamond" },
  ];

  return (
    <>
      {permissions?.includes("users_view") ? (
        <>
          <Button
            icon={<NotificationOutlined />}
            type="primary"
            ghost
            style={{ marginLeft: "10px" }}
            onClick={showModal}
          >
            Gửi thông báo
          </Button>

          <Modal
            title="Gửi thông báo đến khách hàng"
            open={isModalOpen}
            onCancel={handleCancel}
            footer={null}
            width={"70%"}
          >
            <Spin spinning={isLoading} tip="Đang xử lý...">
              <Form
                layout="vertical"
                form={form}
                onFinish={onFinish}
                initialValues={{ type: "manual" }}
              >
                {/* ===== Hình thức gửi ===== */}
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Form.Item
                      label="Hình thức gửi"
                      name="type"
                      rules={[{ required: true }]}
                    >
                      <Select
                        onChange={(value) => setType(value)}
                        options={[
                          { label: "Chọn thủ công", value: "manual" },
                          { label: "Theo xếp hạng thành viên", value: "rank" },
                        ]}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                {/* ===== THỦ CÔNG ===== */}
                {type === "manual" && (
                  <Row gutter={[16, 16]}>
                    <Col span={24}>
                      <Form.Item
                        label="Khách hàng"
                        name="emails"
                        rules={[
                          { required: true, message: "Vui lòng chọn khách hàng!" },
                        ]}
                      >
                        <Select
                          mode="multiple"
                          placeholder="Chọn khách hàng cần gửi"
                          options={optionsUsers}
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                )}

                {/* ===== THEO RANK ===== */}
                {type === "rank" && (
                  <Row gutter={[16, 16]}>
                    <Col span={24}>
                      <Form.Item
                        label="Chọn hạng thành viên"
                        name="rank"
                        rules={[
                          { required: true, message: "Vui lòng chọn hạng!" },
                        ]}
                      >
                        <Select
                          placeholder="Chọn hạng người dùng"
                          options={rankOptions}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                )}

                <Divider />

                {/* ===== NỘI DUNG ===== */}
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <Form.Item
                      label="Tiêu đề"
                      name="title"
                      rules={[
                        { required: true, message: "Vui lòng nhập tiêu đề!" },
                      ]}
                    >
                      <Input placeholder="Nhập tiêu đề thông báo" />
                    </Form.Item>
                  </Col>

                  <Col span={24}>
                    <Form.Item
                      label="Nội dung"
                      name="content"
                      rules={[
                        { required: true, message: "Vui lòng nhập nội dung!" },
                      ]}
                    >
                      <MyEditor />
                    </Form.Item>
                  </Col>

                  <Col span={24} className="flex justify-end">
                    <Button type="primary" htmlType="submit">
                      Gửi thông báo
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Spin>
          </Modal>
        </>
      ) : (
        <NoRole />
      )}
    </>
  );
}

export default SendNotification;
