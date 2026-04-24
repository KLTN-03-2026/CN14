import { DeleteOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import { Button, message, Modal } from "antd";
import { getCookie } from "../../helpers/cookie";
import { deleteRole } from "../../services/admin/rolesServies";
import { deleteAccountDel } from "../../services/admin/accountServies";
import { deleteUserDel } from "../../services/admin/userServies";
import { deleteBanner } from "../../services/admin/bannerServies";
import { deleteVoucher } from "../../services/admin/voucherServies";
import useProducts from "../../hooks/admin/useProducts";
import useCategories from "../../hooks/admin/useCategories";
import useArticles from "../../hooks/admin/useArticles";
import useVoucherGifts from "../../hooks/admin/useVoucherGift";
import useCampaigns from "../../hooks/admin/useCampaigns";
import usePublishers from "../../hooks/admin/usePublishers";
import userAuthors from "../../hooks/admin/userAuthors";
const { confirm } = Modal;

function DeleteItem(props) {
  const { record, onReload, typeDelete } = props;

  const token = getCookie("token");

  const { delProduct, delPerReview } = useProducts({ token });
  const { delCategory } = useCategories({ token });
  const { delArticle } = useArticles({ token });
  const { delVoucherGift } = useVoucherGifts({ token });
  const { delCampain } = useCampaigns({ token });
  const { delPublisher } = usePublishers({ token });
  const { delAuthor } = userAuthors({ token });

  let deleteItem;
  let item;

  switch (typeDelete) {
    case "product-category":
      item = "danh mục";
      deleteItem = async () => {
        delCategory.mutate({ id: record._id });
      }
      break;

    case "product":
      item = "sản phẩm"
      deleteItem = async () => {
        delProduct.mutate({ id: record._id });
      }
      break;

    case "permanent-review":
      item = "vĩnh viễn đánh giá"
      deleteItem = async () => {
        delPerReview.mutate({ id: record._id });
      }
      break;

    case "role":
      item = "quyền"
      deleteItem = async () => {
        const response = await deleteRole(record._id, token);
        if (response.code === 200) {
          message.success(`Xóa ${item} thành công`);
          onReload();
        } else {
          message.error(response.message);
          return;
        }
      }
      break;

    case "account":
      item = "tài khoản"
      deleteItem = async () => {
        const response = await deleteAccountDel(record._id, token);
        if (response.code === 200) {
          message.success(`Xóa ${item} thành công`);
          onReload();
        } else {
          message.error(response.message);
          return;
        }
      }
      break;

    case "user":
      item = "khách hàng"
      deleteItem = async () => {
        const response = await deleteUserDel(record._id, token);
        if (response.code === 200) {
          message.success(`Xóa ${item} thành công`);
          onReload();
        } else {
          message.error(response.message);
          return;
        }
      }
      break;

    case "article":
      item = "bài viết"
      deleteItem = async () => {
        delArticle.mutate({ id: record._id });
      }
      break;

    case "banner":
      item = "quảng cáo"
      deleteItem = async () => {
        const response = await deleteBanner(record._id, token);
        if (response.code === 200) {
          message.success(`Xóa ${item} thành công`);
          onReload();
        } else {
          message.error(response.message);
          return;
        }
      }
      break;

    case "voucher":
      item = "voucher"
      deleteItem = async () => {
        const response = await deleteVoucher(record._id, token);
        if (response.code === 200) {
          message.success(`Xóa ${item} thành công`);
          onReload();
        } else {
          message.error(response.message);
          return;
        }
      }
      break;

    case "voucher-gift":
      item = "phiếu quà tặng"
      deleteItem = async () => {
        delVoucherGift.mutate({ id: record._id });
      }
      break;

    case "campaign":
      item = "chiến dịch"
      deleteItem = async () => {
        delCampain.mutate({ id: record._id });
      }
      break;

    case "publisher":
      item = "nhà xuất bản"
      deleteItem = async () => {
        delPublisher.mutate({ id: record._id });
      }
      break;

    case "author":
      item = "tác giả"
      deleteItem = async () => {
        delAuthor.mutate({ id: record._id });
      }
      break;

    default:
      break;
  }


  const showDeleteConfirm = () => {
    confirm({
      title: `Bạn chắc chắn muốn xóa ${item} này?`,
      icon: <ExclamationCircleFilled />,
      content: 'Xác nhận xóa!',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        deleteItem();
      },
      onCancel() {

      },
    });
  };
  return (
    <>
      <Button style={{ marginLeft: 8 }} icon={<DeleteOutlined />}
        type="primary" ghost danger onClick={showDeleteConfirm} />
    </>
  )
}

export default DeleteItem;