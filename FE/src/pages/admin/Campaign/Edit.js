import { Button, Col, DatePicker, Form, Input, message, Modal, Radio, Row, Select } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import TextArea from "antd/es/input/TextArea";
import { getCookie } from "../../../helpers/cookie";
import UploadFile from "../../../components/UploadFile";
import UploadFiles from "../../../components/UploadFiles";
import { listMaterial } from "../../../services/admin/campainServices";
import dayjs from "dayjs";
import useCampaigns from "../../../hooks/admin/useCampaigns";

function CampaignEdit(props) {
  const { record } = props;
  const token = getCookie("token");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const [valueRadio, setValueRadio] = useState(record.status === "active" ? "active" : "inactive");

  const [imagesUrl, setImagesUrl] = useState(record.images || []);
  const [thumbnail, setThumnail] = useState(record.thumbnail);

  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const { updateCampain } = useCampaigns({ token: token });

  const onChange = (e) => {
    setValueRadio(e.target.value);
  };


  useEffect(() => {
    const fetchApi = async () => {
      if (!token) {
        message.error("Token không tồn tại, vui lòng đăng nhập!");
        return;
      }

      try {
        const response = await listMaterial(token); // Truyền token vào hàm
        if (response.code === 200) {
          setCategories(response.data.categories);
          setBrands(response.data.brands);
          setProducts(response.data.products);
        }
      } catch (error) {
        message.error("Lỗi khi tải danh mục:", error.message);
      }
    };

    fetchApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    e.images = imagesUrl ? imagesUrl : [];
    e.thumbnail = thumbnail ? thumbnail : "";
    e.status = e.status ? "active" : "inactive";
    e.position = !e.position ? "" : Number(e.position);

    updateCampain.mutate({ id: record._id, data: e }, {
      onSuccess: (response) => {
        if (response?.code === 200) {
          handleCancel();
        }
      }
    });
  };

  return (
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
          <Row>

            <Col span={24}>
              <Form.Item label="Tiêu đề" name="title" rules={[{ required: true, message: "Nhập tiêu đề" }]}>
                <Input />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label="Danh mục" name="categories_id"
                rules={[{ required: true, message: "Chọn danh sách thương hiệu" }]}>
                <Select
                  mode="multiple"
                  style={{ width: '100%' }}
                  placeholder="Chọn danh sách danh mục"
                  options={categories.map(opt => ({ value: opt._id, label: opt.title }))}
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label="Sản phẩm" name="products_id"
                rules={[{ required: true, message: "Chọn danh sách thương hiệu" }]}>
                <Select
                  mode="multiple"
                  style={{ width: '100%' }}
                  placeholder="Chọn danh sách sản phẩm"
                  options={products.map(opt => ({ value: opt._id, label: opt.title }))}
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

            <Col span={5}>
              <Form.Item label="Vị trí" name="position" >
                <Input
                  allowClear
                  type="number"
                  placeholder="Tự tăng"
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label="Ảnh nhỏ" name="thumbnail">
                <UploadFile onImageUrlsChange={setThumnail} initialImageUrls={thumbnail} />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label="Ảnh chi tiết" name="images">
                <UploadFiles onImageUrlsChange={setImagesUrl} initialImageUrls={imagesUrl} />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label="Trích đoạn" name="excerpt" rules={[{ required: true, message: "Nhập trích đoạn" }]}>
                <TextArea></TextArea>
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
                <Button type="primary" htmlType="submit" name="btn">
                  Cập nhập
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
}

export default CampaignEdit;
