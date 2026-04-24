import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Radio,
  Row,
} from "antd";
import {
  EditOutlined,
} from "@ant-design/icons";
import { useState, useCallback } from "react";
import { getCookie } from "../../../helpers/cookie";
import NoRole from "../../../components/NoRole";
import UploadFile from "../../../components/UploadFile";
import useVoucherGifts from "../../../hooks/admin/useVoucherGift";


function VoucherGiftEdit({ record }) {
  const permissions = JSON.parse(localStorage.getItem("permissions") || "[]");
  const token = getCookie("token");
  const { updateVoucherGift } = useVoucherGifts({ token });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [image, setImage] = useState(record.image || "");
  const [valueRadio, setValueRadio] = useState(record.status);

  const [form] = Form.useForm();

  /** ✅ Dùng useCallback để tránh re-create hàm mỗi render */
  const showModal = useCallback(() => setIsModalOpen(true), []);
  const handleCancel = useCallback(() => setIsModalOpen(false), []);

  const onChange = useCallback((e) => setValueRadio(e.target.value), []);

  /** ✅ onFinish: không tạo lại object tạm không cần thiết */
  const onFinish = useCallback(
    async (values) => {
      const data = {
        ...values,
        image: image || "",
        status: valueRadio,
        discount: Number(values.discount),
        minOrderValue: Number(values.minOrderValue),
        maxOrderValue: Number(values.maxOrderValue),
        pointCost: Number(values.pointCost),
      };

      updateVoucherGift.mutate(
        { id: record._id, data },
        {
          onSuccess: (response) => {
            if (response?.code === 200) {
              handleCancel();
            }
          },
        }
      );
    },
    [handleCancel, image, record._id, updateVoucherGift, valueRadio]
  );

  if (!permissions.includes("vouchers_edit")) return <NoRole />;

  return (
    <>
      <Button
        icon={<EditOutlined />}
        type="primary"
        ghost
        onClick={showModal}
      />

      <Modal
        title="Chỉnh sửa sản phẩm"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width="70%"
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            ...record
          }}
        >
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Form.Item
                label="Tiêu đề"
                name="title"
                rules={[{ required: true, message: "Nhập tiêu đề!" }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                label="Giới thiệu ngắn"
                name="excerpt"
                rules={[{ required: true, message: "Nhập giới thiệu ngắn!" }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item label="Giá trị giảm (<100 tính theo % || >100 tính giá)"
                name="discount"
                rules={[{
                  required: true,
                  message: 'Vui lòng nhập giá trị giảm giá'
                }]}
              >
                <Input
                  allowClear
                  type="number"
                  min={0}
                />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item label="Giá trị đơn hàng tối thiểu được nhận" name="minOrderValue"
                rules={[{
                  required: true,
                  message: 'Vui lòng nhập số lượng giá trị đơn hàng tối thiểu'
                }]}
              >
                <Input
                  allowClear
                  type="number"
                  min={0}
                />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item label="Số tiền tối đa được giảm" name="maxOrderValue"
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

            <Col span={6}>
              <Form.Item label="Điểm qui đổi" name="pointCost"
                rules={[{
                  required: true,
                  message: 'Vui lòng nhập điểm qui đổi!'
                }]}
              >
                <Input
                  allowClear
                  type="number"
                  min={0}
                />
              </Form.Item>
            </Col>

            <Col span={4}>
              <Form.Item label="Số ngày hết hạn" name="expiredAfterDays"
                rules={[{
                  required: true,
                  message: 'Vui lòng nhập số ngày hết hạn!'
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
              <Form.Item label="Ảnh mô tả" name="images">
                <UploadFile
                  onImageUrlsChange={setImage}
                  initialImageUrls={image}
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label="Trạng thái" name="status">
                <Radio.Group onChange={onChange} value={valueRadio}>
                  <Radio value="active">Bật</Radio>
                  <Radio value="inactive">Tắt</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Cập nhật
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
}

export default VoucherGiftEdit;
