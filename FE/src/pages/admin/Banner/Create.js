import { Button, Card, Col, Form, Input, Row, Switch, message, DatePicker, Divider, Select } from "antd";
import { useEffect, useState } from "react";
import { getCookie } from "../../../helpers/cookie";
import NoRole from "../../../components/NoRole";
import UploadFile from "../../../components/UploadFile";
import MyEditor from "../../../components/MyEditor";
import { useNavigate } from "react-router-dom";
import dayjs from 'dayjs';
import { addBanner } from "../../../services/admin/bannerServies";

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

const BannerCreate = () => {
  const permissions = JSON.parse(localStorage.getItem('permissions'));

  const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng

  const token = getCookie("token"); // Lấy token từ cookie

  const [image, setImage] = useState("");

  const [form] = Form.useForm();

  // Màu nền
  const [color1, setColor1] = useState('#ff7e5f');
  const [color2, setColor2] = useState('#feb47b');
  const [direction, setDirection] = useState('to right');
  const [gradient, setGradient] = useState('');

  useEffect(() => {
    const result = `linear-gradient(${direction}, ${color1}, ${color2})`;
    setGradient(result);
    form.setFieldsValue({ backgroundColor: result });
  }, [color1, color2, direction, form]);



  // xử lý submit
  const onFinish = async (e) => {
    e.image = image ? image : "";
    e.status = e.status ? "active" : "inactive";
    e.position = !e.position ? "" : Number(e.position);
    e.content = !e.content ? "" : e.content;
    e.backgroundColor = gradient;
    
    try {
      const response = await addBanner(e, token); // Truyền token vào hàm

      if (response.code === 200) {
        navigate("/admin/banners"); // Điều hướng đến trang sản phẩm
        message.success("Thêm mới thành công");
      } else {
        if (Array.isArray(response.message)) {
          const allErrors = response.message.map(err => err.message).join("\n");
          message.error(allErrors);
        } else {
          message.error(response.message);
        }
      }
    } catch (error) {
      message.error("Lỗi: ", error.message);
    }

  }
  // end xử lý submit

  return (
    <>
      {permissions.includes("banners_create") ?
        <Card title="Thêm mới quảng cáo">
          <Card
            style={{
              marginTop: 10,
              width: "100%"
            }}
            type="inner"
          >
            <Form onFinish={onFinish} layout="vertical" initialValues={{ discountPercentage: 0 }}>
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
                    <UploadFile onImageUrlsChange={setImage} />
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

export default BannerCreate;