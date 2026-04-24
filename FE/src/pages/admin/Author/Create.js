import {
    Button,
    Card,
    Col,
    Form,
    Input,
    Row,
    message,
    Spin,
    DatePicker,
} from "antd";
import { useEffect, useState, useMemo } from "react";
import { getCookie } from "../../../helpers/cookie";
import NoRole from "../../../components/NoRole";
import UploadFile from "../../../components/UploadFile";
import { useNavigate } from "react-router-dom";
import useAuthors from "../../../hooks/admin/userAuthors";
import MyEditor from "../../../components/MyEditor";
import dayjs from "dayjs";

function AuthorCreate() {
    const permissions = useMemo(
        () => JSON.parse(localStorage.getItem("permissions")) || [],
        []
    );

    const token = getCookie("token");
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [avatar, setAvatar] = useState("");

    const { createAuthor } = useAuthors({ token });

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
            avatar: avatar || "",
            bio: values.bio || "",
        };
        console.log(data);
        
        setLoading(true);
        try {
            createAuthor.mutate(data, {
                onSuccess: (res) => {
                    if (res?.code === 200) {
                        navigate("/admin/authors");
                    }
                },
                onError: (err) => {
                    message.error(`Lỗi khi thêm tác giả: ${err.message}`);
                },
            });
        } finally {
            setLoading(false);
        }
    };

    if (!permissions.includes("authors_create")) return <NoRole />;

    return (
        <Card title="Thêm mới tác giả">
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
                                    label="Tên tác giả"
                                    name="fullName"
                                    rules={[
                                        { required: true, message: "Vui lòng nhập tên tác giả!" },
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
                            <Col span={12}>
                                <Form.Item
                                    label="Ngày sinh"
                                    name="birthday"
                                    rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
                                >
                                    <DatePicker
                                        style={{ width: '100%' }}
                                        disabledDate={(current) => current && current > dayjs().startOf('day')}
                                    />
                                </Form.Item>
                            </Col>

                            {/* HÌNH ẢNH */}
                            <Col span={24}>
                                <Form.Item label="Ảnh chân dung" name="avatar">
                                    <UploadFile onImageUrlsChange={setAvatar} />
                                </Form.Item>
                            </Col>

                            {/* TEXT EDITOR */}
                            <Col span={24}>
                                <Form.Item label="Tiểu sử" name="bio">
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
                                        Thêm tác giả
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

export default AuthorCreate;
