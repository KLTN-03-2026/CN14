import { Form, Input, Button, message } from "antd";
import { postSendContact } from "../../../services/client/contactServies";

export default function Contact() {
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    const response = await postSendContact(values);
    if (response.code === 200) {
      message.success(response.message);
      form.resetFields();
    } else {
      message.error(response.message)
    }
  };

  return (
    <div className="max-w-2xl p-2 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-2 text-gray-800">
        Chúng tôi trân trọng ý kiến của quý khách.
      </h2>
      <p className="text-gray-600 mb-6">
        Quý khách vui lòng gửi thắc mắc, vấn đề hoặc ý kiến đóng góp qua biểu mẫu.
      </p>

      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        requiredMark={false}
      >
        {/* Tiêu đề */}
        <Form.Item
          label="Tiêu đề (*)"
          name="title"
          rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
        >
          <Input placeholder="Tiêu đề" />
        </Form.Item>

        {/* Chi tiết */}
        <Form.Item
          label="Chi tiết (*)"
          name="description"
          rules={[{ required: true, message: "Vui lòng nhập nội dung chi tiết!" }]}
        >
          <Input.TextArea rows={4} placeholder="Hãy mô tả chi tiết" />
        </Form.Item>

        {/* Tên */}
        <Form.Item
          label="Tên (*)"
          name="fullName"
          rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
        >
          <Input placeholder="Nhập đầy đủ họ và tên" />
        </Form.Item>

        {/* Số điện thoại & Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            label="Số điện thoại (*)"
            name="phone"
            rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
          >
            <Input placeholder="Số điện thoại" />
          </Form.Item>

          <Form.Item
            label="Email (*)"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input placeholder="Email liên hệ" />
          </Form.Item>
        </div>

        {/* Nút gửi */}
        <Form.Item className="mt-4">
          <Button
            type="primary"
            htmlType="submit"
            className="bg-green-700 hover:bg-green-800 text-white font-semibold px-6 py-2"
          >
            Gửi yêu cầu
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
