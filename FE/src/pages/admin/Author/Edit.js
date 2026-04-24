import { Button, Col, DatePicker, Form, Input, message, Modal, Row } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { getCookie } from "../../../helpers/cookie";
import NoRole from "../../../components/NoRole";
import UploadFile from "../../../components/UploadFile";
import useAuthors from "../../../hooks/admin/userAuthors";
import MyEditor from "../../../components/MyEditor";
import dayjs from "dayjs";

function AuthorEdit(props) {
    const permissions = JSON.parse(localStorage.getItem('permissions'));

    const { record } = props;

    const token = getCookie("token");

    const { updateAuthor } = useAuthors({ token: token });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    // upload img
    const [avatarUrl, setAvatarUrl] = useState(record.avatar || "");
    // upload img

    useEffect(() => {
        if (!token) {
            message.error("Token không tồn tại, vui lòng đăng nhập!");
            return;
        }
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
        e.avatar = avatarUrl ? avatarUrl : "";
        e.bio = !e.bio ? "" : e.bio;

        updateAuthor.mutate({ id: record._id, data: e }, {
            onSuccess: (response) => {
                if (response?.code === 200) {
                    handleCancel();
                }
            }
        });
    };

    return (
        <>
            {permissions.includes("authors_edit") ?
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
                            initialValues={record}
                        >
                            <Row gutter={[16, 16]}>
                                <Col span={24}>
                                    <Form.Item label="Tên tác giả" name="fullName"
                                        rules={[{ required: true, message: 'Vui lòng nhập tên tác giả!' }]}>
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item label="Giới thiệu ngắn" name="excerpt"
                                        rules={[{ required: true, message: 'Vui lòng nhập giới thiệu ngắn!' }]}>
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

                                <Col span={24}>
                                    <Form.Item label="Ảnh chân dung" name="avatar">
                                        <UploadFile onImageUrlsChange={setAvatarUrl} initialImageUrls={avatarUrl} />
                                    </Form.Item>
                                </Col>

                                <Col span={24}>
                                    <Form.Item label="Tiểu sử" name="bio" >
                                        <MyEditor />
                                    </Form.Item>
                                </Col>

                                <Col span={24}>
                                    <Form.Item>
                                        <Button type="primary" htmlType="submit" name="btn">
                                            Cập nhật
                                        </Button>
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

export default AuthorEdit;
