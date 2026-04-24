import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Radio,
  Row,
  Select,
} from "antd";
import {
  EditOutlined,
} from "@ant-design/icons";
import { useState, useCallback } from "react";
import { getCookie } from "../../../helpers/cookie";
import useProducts from "../../../hooks/admin/useProducts";
import NoRole from "../../../components/NoRole";
import UploadFile from "../../../components/UploadFile";
import UploadFiles from "../../../components/UploadFiles";
import MyEditor from "../../../components/MyEditor";
import dayjs from "dayjs";


function ProductEdit(props) {
  const permissions = JSON.parse(localStorage.getItem("permissions") || "[]");
  const token = getCookie("token");
  const { updateProduct } = useProducts({ token });

  const { record, categoryOptions, authorOptions, publisherOptions } = props;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState(record.thumbnail);
  const [imageUrls, setImageUrls] = useState(record.images || []);
  const [valueRadio, setValueRadio] = useState(record.status);
  const [valueRadioFeatured, setValueRadioFeatured] = useState(record.featured);

  const [form] = Form.useForm();

  /** ✅ Dùng useCallback để tránh re-create hàm mỗi render */
  const showModal = useCallback(() => setIsModalOpen(true), []);
  const handleCancel = useCallback(() => setIsModalOpen(false), []);

  const onChange = useCallback((e) => setValueRadio(e.target.value), []);
  const onChangeFeatured = useCallback(
    (e) => setValueRadioFeatured(e.target.value),
    []
  );

  /** ✅ onFinish: không tạo lại object tạm không cần thiết */
  const onFinish = useCallback(
    async (values) => {
      const data = {
        ...values,
        thumbnail: thumbnailUrl || "",
        images: imageUrls || [],
        position: Number(values.position) || "",
        pageCount: Number(values.pageCount) || "",
        stock: Number(values.stock) || "",
        categories: values.categories || [],
        author_id: values.author_id || "",
        publisher_id: values.publisher_id || "",
        description: values.description || "",
        featured: valueRadioFeatured,
        price: Number(values.price) || 0,
        discountPercentage: Number(values.discountPercentage) || 0,
        status: valueRadio,
      };

      updateProduct.mutate(
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
    [
      thumbnailUrl,
      imageUrls,
      valueRadio,
      valueRadioFeatured,
      record._id,
      updateProduct,
      handleCancel,
    ]
  );

  if (!permissions.includes("products_edit")) return <NoRole />;

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
            ...record,
            publishDate: record?.publishDate ? dayjs(record.publishDate) : null,
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

            <Col span={8}>
              <Form.Item
                label="Thể loại"
                name="categories"
                rules={[{ required: true, message: "Chọn thể loại!" }]}
              >
                <Select
                  mode="multiple"
                  options={categoryOptions}
                  placeholder="Chọn thể loại" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Tác giả"
                name="author_id"
                rules={[{ required: true, message: "Chọn tác giả!" }]}
              >
                <Select options={authorOptions} placeholder="Chọn tác giả" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Nhà xuất bản"
                name="publisher_id"
                rules={[{ required: true, message: "Chọn nhà xuất bản!" }]}
              >
                <Select options={publisherOptions} placeholder="Chọn nhà xuất bản" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="Số lượng" name="stock">
                <Input type="number" min={0} />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="Tổng số trang" name="pageCount">
                <Input type="number" min={0} />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Ngày xuất bản"
                name="publishDate"
                rules={[{ required: true, message: 'Vui lòng chọn ngày xuất bản!' }]}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  disabledDate={(current) => current && current < dayjs().startOf('day')}
                />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Giá"
                name="price"
                rules={[{ required: true, message: "Nhập giá!" }]}
              >
                <Input type="number" min={0} />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Giảm giá (%)"
                name="discountPercentage"
                rules={[{ required: true, message: "Nhập phần trăm giảm!" }]}
              >
                <Input type="number" min={0} max={100} />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="Vị trí" name="position">
                <Input type="number" min={0} placeholder="Tự tăng" />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label="Nổi bật?" name="featured">
                <Radio.Group
                  onChange={onChangeFeatured}
                  value={valueRadioFeatured}
                >
                  <Radio value="1">Bật</Radio>
                  <Radio value="0">Tắt</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label="Ảnh nhỏ" name="thumbnail">
                <UploadFile
                  onImageUrlsChange={setThumbnailUrl}
                  initialImageUrls={thumbnailUrl}
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label="Ảnh mô tả" name="images">
                <UploadFiles
                  onImageUrlsChange={setImageUrls}
                  initialImageUrls={imageUrls}
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label="Mô tả" name="description">
                <MyEditor />
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

export default ProductEdit;
