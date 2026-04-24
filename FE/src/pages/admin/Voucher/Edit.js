import { Button, Col, DatePicker, Form, Input, message, Modal, Row, Select, Switch } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { getCookie } from "../../../helpers/cookie";
import NoRole from "../../../components/NoRole";
import UploadFile from "../../../components/UploadFile";
import dayjs from "dayjs";
import { editVoucher, listBanners } from "../../../services/admin/voucherServies";

const VoucherEdit = (props) => {
  const permissions = JSON.parse(localStorage.getItem('permissions'));

  const { record, onReload } = props;

  const [banners, setSetBanners] = useState([]);

  const token = getCookie("token");

  const [form] = Form.useForm();

  const [isModalOpen, setIsModalOpen] = useState(false);

  // upload img
  const [imageUrl, setImageUrl] = useState(record.image);
  // upload img

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchApi = async () => {
      if (!token) {
        message.error("Token không tồn tại, vui lòng đăng nhập!");
        return;
      }

      try {
        const response = await listBanners(token);
        if (response.code === 200) {
          setSetBanners(response.banners);
        }
      } catch (error) {
        message.error("Lỗi khi tải danh mục:", error.message);
      }
    };

    fetchApi();
  }, [])

  const onFinish = async (e) => {
    e.image = imageUrl ? imageUrl : "";
    e.status = e.status ? "active" : "inactive";

    try {
      const response = await editVoucher(record._id, e, token);
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
      message.error(error.message);
    }
  };

  // options cho Select
  const options = banners.map((banner) => ({
    label: banner.title, // Hiển thị title trong Select
    value: banner._id,   // Giá trị _id khi submit
  }));
  // end options cho Select

  return (
    <>
      {permissions.includes("vouchers_edit") ?
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

                <Col span={12}>
                  <Form.Item label="Mã Vouhcer" name="voucher_code"
                    rules={[{ required: true, message: 'Vui lòng nhập mã voucher!' }]}>
                    <Input onChange={(e) =>
                      form.setFieldsValue({ voucher_code: e.target.value.toUpperCase() })
                    } />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item label="Quảng cáo" name="banner_id"
                    rules={[{ required: true, message: 'Vui lòng chọn quảng cáo!' }]}>
                    <Select
                      options={options} // Cung cấp danh sách options
                      placeholder="Chọn danh mục"
                    />
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

                <Col span={8}>
                  <Form.Item label="Số lượng" name="quantity"
                    rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}>
                    <Input
                      allowClear
                      type="number"
                    />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="Giá trị giảm (<100 tính theo % || >100 tính giá)" name="discount_value"
                    rules={[{ required: true, message: 'Vui lòng nhập giá trị giảm giá' }]}
                  >
                    <Input
                      allowClear
                      type="number"
                      min={0}
                    />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="Giá trị đơn hàng tối thiểu được nhận" name="min_order_value"
                    rules={[{
                      required: true,
                      message: 'Vui lòng nhập giá trị đơn hàng tối thiểu!'
                    }]}
                  >
                    <Input
                      allowClear
                      type="number"
                      min={0}
                    />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="Số tiền tối đa được giảm" 
                  name="max_order_value"
                    rules={[{
                      required: true,
                      message: 'Vui lòng nhập số tiền tối đa được giảm!'
                    }]}
                  >
                    <Input
                      allowClear
                      type="number"
                      min={0}
                    />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item label="Ảnh" name="image">
                    <UploadFile onImageUrlsChange={setImageUrl} initialImageUrls={imageUrl} />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Nội dung" name="excerpt"
                    rules={[{ required: true, message: 'Vui lòng mô tả ngắn' }]}>
                    <Input />
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

export default VoucherEdit;