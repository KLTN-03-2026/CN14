import { Button, Card, message, Modal, Tag } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { getCookie } from "../../../helpers/cookie";
import NoRole from "../../../components/NoRole";
import { changeStatusContact } from "../../../services/admin/contactServies";

const statusColors = {
  pending: "orange",
  processing: "blue",
  resolved: "green",
  closed: "gray",
  spam: "red",
};

function ContactDetail(props) {
  const permissions = JSON.parse(localStorage.getItem('permissions'));
  const { record, onReload } = props;
  const token = getCookie("token");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!token) {
      message.error("Token không tồn tại, vui lòng đăng nhập!");
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleChangeStatus = (newStatus, contact_id) => {
    const fetchApiChangeStatus = async () => {
      // eslint-disable-next-line no-unused-vars
      const response = await changeStatusContact(token, newStatus, contact_id);
      onReload();
    };

    fetchApiChangeStatus();
  }

  const showModal = () => {
    setIsModalOpen(true);
    if (record.status === "pending") {
      handleChangeStatus("processing", record._id,)
    }
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {permissions.includes("users_view") ?
        <>
          <Button
            icon={<EyeOutlined />} title="Chi tiết"
            type="primary" ghost onClick={showModal} />
          <Modal
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={null}
            width={"70%"}
          >
            <Card title="Chi tiết liên hệ">
              <Card
                style={{ marginTop: 10 }}
                type="inner"
                title="Thông tin người gửi"
              >
                <p>
                  <strong>Họ tên:</strong> {record.fullName}
                </p>
                <p>
                  <strong>Email:</strong> {record.email}
                </p>
                <p>
                  <strong>Điện thoại:</strong> {record.phone}
                </p>
                <p>
                  <strong>Trạng thái:</strong>{" "}
                  <Tag color={statusColors[record.status]}>
                    {record.status.toUpperCase()}
                  </Tag>
                </p>
              </Card>

              <Card
                style={{ marginTop: 10 }}
                type="inner"
                title="Nội dung liên hệ"
              >
                <p>{record.description}</p>
              </Card>
            </Card>
          </Modal>
        </>
        :
        <NoRole />
      }
    </>
  );
}

export default ContactDetail;
