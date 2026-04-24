import { Button, Col, Form, Input, message, Modal, Row } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { getCookie } from "../../../helpers/cookie";
import NoRole from "../../../components/NoRole";
import UploadFile from "../../../components/UploadFile";
import usePublishers from "../../../hooks/admin/usePublishers";
import MyEditor from "../../../components/MyEditor";

function PublisherEdit(props) {
    const permissions = JSON.parse(localStorage.getItem('permissions'));

    const { record } = props;

    const token = getCookie("token");

    const { updatePublisher } = usePublishers({ token: token });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    // upload img
    const [thumbnailUrl, setThumbnailUrl] = useState(record.thumbnail || "");
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
        e.thumbnail = thumbnailUrl ? thumbnailUrl : "";
        e.bio = !e.bio ? "" : e.bio;

        updatePublisher.mutate({ id: record._id, data: e }, {
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

                                <Col span={24}>
                                    <Form.Item label="Ảnh chân dung" name="thumbnail">
                                        <UploadFile onImageUrlsChange={setThumbnailUrl} initialImageUrls={thumbnailUrl} />
                                    </Form.Item>
                                </Col>

                                <Col span={24}>
                                    <Form.Item label="Thông tin chi tiết" name="description">
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

export default PublisherEdit;
