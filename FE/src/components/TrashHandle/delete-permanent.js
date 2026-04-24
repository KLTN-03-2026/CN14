import { DeleteOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import { Button, message, Modal } from "antd";
import { getCookie } from "../../helpers/cookie";
import { permanentDelItem } from "../../services/admin/trashServices";
const { confirm } = Modal;

export default function DeletePermanetItem(props) {
  const { record, onReload, typeDelete } = props;

  const token = getCookie("token");

  let handle;
  let item;

  switch (typeDelete) {
    case "product":
      item = "sản phẩm";
      handle = async () => {
        const response = await permanentDelItem(token, typeDelete, record._id);

        if (response.code === 200) {
          message.success(response.message);
          onReload();
        } else {
          message.error(response.message);
          return;
        }
      }
      break;

    case "category":
      item = "danh mục";
      handle = async () => {
        const response = await permanentDelItem(token, typeDelete, record._id);
        if (response.code === 200) {
          message.success(response.message);
          onReload();
        } else {
          message.error(response.message);
          return;
        }
      }
      break;

    case "article":
      item = "bài viết";
      handle = async () => {
        const response = await permanentDelItem(token, typeDelete, record._id);
        if (response.code === 200) {
          message.success(response.message);
          onReload();
        } else {
          message.error(response.message);
          return;
        }
      }
      break;

    case "banner":
      item = "quảng cáo";
      handle = async () => {
        const response = await permanentDelItem(token, typeDelete, record._id);
        if (response.code === 200) {
          message.success(response.message);
          onReload();
        } else {
          message.error(response.message);
          return;
        }
      }
      break;

    case "voucher":
      item = "voucher";
      handle = async () => {
        const response = await permanentDelItem(token, typeDelete, record._id);
        if (response.code === 200) {
          message.success(response.message);
          onReload();
        } else {
          message.error(response.message);
          return;
        }
      }
      break;

    case "account":
      item = "tài khoản";
      handle = async () => {
        const response = await permanentDelItem(token, typeDelete, record._id);
        if (response.code === 200) {
          message.success(response.message);
          onReload();
        } else {
          message.error(response.message);
          return;
        }
      }
      break;

    case "user":
      item = "khách hàng";
      handle = async () => {
        const response = await permanentDelItem(token, typeDelete, record._id);
        if (response.code === 200) {
          message.success(response.message);
          onReload();
        } else {
          message.error(response.message);
          return;
        }
      }
      break;

    case "brand":
      item = "thương hiệu";
      handle = async () => {
        const response = await permanentDelItem(token, typeDelete, record._id);
        if (response.code === 200) {
          message.success(response.message);
          onReload();
        } else {
          message.error(response.message);
          return;
        }
      }
      break;

    case "campaign":
      item = "chiến lược";
      handle = async () => {
        const response = await permanentDelItem(token, typeDelete, record._id);
        if (response.code === 200) {
          message.success(response.message);
          onReload();
        } else {
          message.error(response.message);
          return;
        }
      }
      break;

    case "voucher-gift":
      item = "phiếu quà tặng";
      handle = async () => {
        const response = await permanentDelItem(token, typeDelete, record._id);
        if (response.code === 200) {
          message.success(response.message);
          onReload();
        } else {
          message.error(response.message);
          return;
        }
      }
      break;

    default:
      break;
  }

  const showDeleteConfirm = () => {
    confirm({
      title: `Bạn chắc chắn muốn xóa vĩnh viễn ${item} này?`,
      icon: <ExclamationCircleFilled />,
      content: 'Xác nhận xóa!',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        handle();
      },
      onCancel() {

      },
    });
  };
  return (
    <>
      <Button style={{ marginLeft: 8 }} icon={<DeleteOutlined />} type="primary" ghost danger onClick={showDeleteConfirm} />
    </>
  )
}
