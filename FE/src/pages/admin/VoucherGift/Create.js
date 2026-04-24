import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Switch,
  message,
  Spin,
} from "antd";
import { useEffect, useState, useMemo } from "react";
import { getCookie } from "../../../helpers/cookie";
import NoRole from "../../../components/NoRole";
import UploadFile from "../../../components/UploadFile";
import { useNavigate } from "react-router-dom";
import useVoucherGifts from "../../../hooks/admin/useVoucherGift";

function VoucherGiftCreate() {
  const permissions = useMemo(
    () => JSON.parse(localStorage.getItem("permissions")) || [],
    []
  );

  const token = getCookie("token");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState("");

  const { createVoucherGift } = useVoucherGifts({ token });

  useEffect(() => {
    if (!token) {
      message.error("Token không tồn tại, vui lòng đăng nhập!");
      return;
    }
  }, [token]);

  /** Xử lý khi submit */
  const onFinish = async (values) => {
    const data = {
      ...values,
      image: image || "",
      discount: Number(values.discount),
      minOrderValue: Number(values.minOrderValue),
      maxOrderValue: Number(values.maxOrderValue),
      pointCost: Number(values.pointCost),
    };

    setLoading(true);
    try {
      createVoucherGift.mutate(data, {
        onSuccess: (res) => {
          if (res?.code === 200) {
            navigate("/admin/voucher-gift");
          }
        },
        onError: (err) => {
          message.error(`Lỗi khi thêm : ${err.message}`);
        },
      });
    } finally {
      setLoading(false);
    }
  };

  if (!permissions.includes("vouchers_create")) return <NoRole />;

  return (
    <Card title="Thêm mới mẫu phiếu quà tặng">
      <Spin spinning={loading} tip="Đang xử lý...">
        <Card style={{ marginTop: 10, width: "100%" }} type="inner">
          <Form
            onFinish={onFinish}
            layout="vertical"
            initialValues={{
              discount: 0,
              minOrderValue: 0,
              pointCost: 0,
              expiredAfterDays: 0,
            }}
          >
            <Row gutter={[12, 12]}>
              <Col span={24}>
                <Form.Item
                  label="Tiêu đề"
                  name="title"
                  rules={[
                    { required: true, message: "Vui lòng nhập tiêu đề!" },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  label="Giới thiệu ngắn"
                  name="excerpt"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập giới thiệu ngắn!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item label="Giá trị giảm (<100 tính % || >100 tính giá)"
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
                <Form.Item label="Giá trị đơn hàng tối thiểu được nhận!" name="minOrderValue"
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

              <Col span={6}>
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

              {/* HÌNH ẢNH */}
              <Col span={24}>
                <Form.Item label="Ảnh nhỏ" name="image">
                  <UploadFile onImageUrlsChange={setImage} />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item label="Tắt hoạt động / Hoạt động " name="status">
                  <Switch />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 border-none rounded-lg font-semibold text-lg"
                  >
                    Thêm
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </Spin>
    </Card>
  );
}

export default VoucherGiftCreate;
