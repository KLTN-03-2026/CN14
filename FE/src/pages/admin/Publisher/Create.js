import {
    Button,
    Card,
    Col,
    Form,
    Input,
    Row,
    message,
    Spin,
} from "antd";
import { useEffect, useState, useMemo } from "react";
import { getCookie } from "../../../helpers/cookie";
import NoRole from "../../../components/NoRole";
import UploadFile from "../../../components/UploadFile";
import { useNavigate } from "react-router-dom";
import usePublishers from "../../../hooks/admin/usePublishers";
import MyEditor from "../../../components/MyEditor";

function PublisherCreate() {
    const permissions = useMemo(
        () => JSON.parse(localStorage.getItem("permissions")) || [],
        []
    );

    const token = getCookie("token");
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [thumbnail, setThumbnail] = useState("");

    const { createPublisher } = usePublishers({ token });

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
            thumbnail: thumbnail || "",
            description: values.description || "",
        };

        setLoading(true);
        try {
            createPublisher.mutate(data, {
                onSuccess: (res) => {
                    if (res?.code === 200) {
                        navigate("/admin/publishers");
                    }
                },
                onError: (err) => {
                    message.error(`Lỗi khi thêm nhà xuất bản: ${err.message}`);
                },
            });
        } finally {
            setLoading(false);
        }
    };

    if (!permissions.includes("publishers_create")) return <NoRole />;

    return (
        <Card title="Thêm mới nhà xuất bản">
            <Spin spinning={loading} tip="Đang xử lý...">
                <Card style={{ marginTop: 10, width: "100%" }} type="inner">
                    <Form
                        onFinish={onFinish}
                        layout="vertical"
                        initialValues={{
                            discountPercentage: 0,
                            featured: 1,
                            sex: 0,
                            status: true,
                            sizeStock: [{ size: "", quantity: 0 }],
                        }}
                    >
                        <Row gutter={[12, 12]}>
                            <Col span={24}>
                                <Form.Item
                                    label="Tên nhà xuất bản"
                                    name="name"
                                    rules={[
                                        { required: true, message: "Vui lòng nhập tên nhà xuất bản!" },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>

                            <Col span={24}>
                                <Form.Item
                                    label="Địa chỉ"
                                    name="address"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Vui lòng nhập địa chỉ!",
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>

                            <Col span={24}>
                                <Form.Item
                                    label="Số điện thoại"
                                    name="phone"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Vui lòng nhập số điện thoại!",
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>

                            <Col span={24}>
                                <Form.Item
                                    label="Email"
                                    name="email"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Vui lòng nhập email!",
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>

                            {/* HÌNH ẢNH */}
                            <Col span={24}>
                                <Form.Item label="Ảnh nhỏ" name="thumbnail">
                                    <UploadFile onImageUrlsChange={setThumbnail} />
                                </Form.Item>
                            </Col>

                            {/* TEXT EDITOR */}
                            <Col span={24}>
                                <Form.Item label="Thông tin chi tiết" name="description">
                                    <MyEditor />
                                </Form.Item>
                            </Col>

                            <Col span={24}>
                                <Form.Item>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        className="w-full h-12 bg-blue-600 hover:bg-blue-700 border-none rounded-lg font-semibold text-lg"
                                    >
                                        Thêm nhà xuất bản
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

export default PublisherCreate;
