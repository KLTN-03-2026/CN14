import { Button, Col, DatePicker, Divider, Form, Input, message, Modal, Row, Select, Switch } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { getCookie } from "../../../helpers/cookie";
import NoRole from "../../../components/NoRole";
import UploadFile from "../../../components/UploadFile";
import dayjs from "dayjs";
import MyEditor from "../../../components/MyEditor";
import { editBanner } from "../../../services/admin/bannerServies";
const { Option } = Select;

const directions = [
  'to right',
  'to left',
  'to bottom',
  'to top',
  'to bottom right',
  'to bottom left',
  'to top right',
  'to top left'
];

// Hàm tách chuỗi gradient ra thành hướng và 2 màu
const parseGradient = (gradientString) => {
  const regex = /linear-gradient\(([^,]+),\s*([^,]+),\s*([^)]+)\)/;
  const match = gradientString.match(regex);

  if (match) {
    return {
      direction: match[1].trim(),
      color1: match[2].trim(),
      color2: match[3].trim()
    };
  }

  return {
    direction: 'to right',
    color1: '#ff7e5f',
    color2: '#feb47b'
  };
};

const BannerEdt = (props) => {
  const permissions = JSON.parse(localStorage.getItem('permissions'));

  const { record, onReload } = props;

  const token = getCookie("token");

  const [form] = Form.useForm();

  const [isModalOpen, setIsModalOpen] = useState(false);

  // upload img
  const [imageUrl, setImageUrl] = useState(record.image);
  // upload img

  // Màu nền
  const [color1, setColor1] = useState('#ff7e5f');
  const [color2, setColor2] = useState('#feb47b');
  const [direction, setDirection] = useState('to right');
  const [gradient, setGradient] = useState('');

  // Set màu nếu có từ record
  useEffect(() => {
    if (record.backgroundColor) {
      const parsed = parseGradient(record.backgroundColor);
      setColor1(parsed.color1);
      setColor2(parsed.color2);
      setDirection(parsed.direction);
    }
  }, [record.backgroundColor]);

  // Cập nhật gradient mỗi khi màu hoặc hướng đổi
  useEffect(() => {
    const result = `linear-gradient(${direction}, ${color1}, ${color2})`;
    setGradient(result);

    // Chỉ set nếu form đã mount
    if (form) {
      form.setFieldsValue({ backgroundColor: result });
    }
  }, [color1, color2, direction]);

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
    e.image = imageUrl ? imageUrl : "";
    e.status = e.status ? "active" : "inactive";
    e.position = !e.position ? "" : Number(e.position);
    e.content = !e.content ? "" : e.content;
    e.backgroundColor = gradient;

    try {
      const response = await editBanner(record._id, e, token);
      if (response.code === 200) {
        message.success("Cập nhật thành công");
        onReload();
        handleCancel();
      } else {
        if (Array.isArray(response.message)) {
          const allErrors = response.message.map(err => err.message).join("\n");
          message.error(allErrors);
        } else {
          message.error(response.message);
        }
      }
    } catch (error) {
      message.error(error.message)
    }
  };

  return (
    <>
      {permissions.includes("banners_edit") ?
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
            <Form onFinish={onFinish} layout="vertical" form={form}
              initialValues={{
                ...record,
                start_date: record?.start_date ? dayjs(record.start_date) : null,
                end_date: record?.end_date ? dayjs(record.end_date) : null
              }}>
              <Row gutter={[12, 12]}>
                <Col span={24}>
                  <Form.Item label="Tiêu đề" name="title"
                    rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Trích đoạn" name="excerpt"
                    rules={[{ required: true, message: 'Vui lòng nhập mô tả ngắn!' }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Ngày bắt đầu"
                    name="start_date"
                    rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu!' }]}
                  >
                    <DatePicker
                      style={{ width: '100%' }}
                      disabledDate={(current) => current && current < dayjs().startOf('day')}
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    label="Ngày kết thúc"
                    name="end_date"
                    dependencies={['start_date']}
                    rules={[
                      { required: true, message: 'Vui lòng chọn ngày kết thúc!' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          const startDate = getFieldValue('start_date');
                          if (!value || !startDate || value.isAfter(startDate)) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('Ngày kết thúc phải sau ngày bắt đầu!'));
                        },
                      }),
                    ]}
                  >
                    <DatePicker
                      style={{ width: '100%' }}
                      disabledDate={(current) => current && current < dayjs().startOf('day')}
                    />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    label="Màu nền"
                    name="backgroundColor"
                    rules={[{ required: true, message: 'Vui lòng chọn màu nền!' }]}
                  >
                    <div>
                      <Row gutter={8}>
                        <Col span={8}>
                          <label>Màu 1</label>
                          <Input
                            type="color"
                            value={color1}
                            onChange={(e) => setColor1(e.target.value)}
                          />
                        </Col>
                        <Col span={8}>
                          <label>Màu 2</label>
                          <Input
                            type="color"
                            value={color2}
                            onChange={(e) => setColor2(e.target.value)}
                          />
                        </Col>
                        <Col span={8}>
                          <label>Hướng</label>
                          <Select
                            value={direction}
                            onChange={setDirection}
                            style={{ width: '100%' }}
                          >
                            {directions.map((dir) => (
                              <Option key={dir} value={dir}>{dir}</Option>
                            ))}
                          </Select>
                        </Col>
                      </Row>

                      <Divider />

                      <div style={{
                        height: '40px',
                        border: '1px solid #ddd',
                        borderRadius: '6px',
                        background: gradient,
                        textAlign: 'center',
                        lineHeight: '40px',
                        color: '#fff',
                        fontWeight: 'bold'
                      }}>
                        {gradient}
                      </div>
                    </div>
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item label="Vị trí" name="position" >
                    <Input
                      allowClear
                      type="number"
                      placeholder="Tự tăng"
                    />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Ảnh" name="image">
                    <UploadFile onImageUrlsChange={setImageUrl} initialImageUrls={imageUrl} />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Nội dung" name="content" >
                    <MyEditor />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Tắt hoạt động / Hoạt động " name="status">
                    <Switch />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">Cập nhật</Button>
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

export default BannerEdt;