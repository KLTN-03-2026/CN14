import { message, Modal } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { addProductReviewReplyByAdmin, delProductReplyByAdmin, delProductReviewByAdmin } from "../../../services/admin/productServies";

const { confirm } = Modal;

// Xóa review bất kì
export const handleDeleteReviewByAdmin = (reviewId, token, setReviews) => {
  confirm({
    title: `Bạn chắc chắn muốn xóa đánh giá này?`,
    icon: <ExclamationCircleFilled />,
    content: "Xác nhận xóa!",
    okText: "Yes",
    okType: "danger",
    cancelText: "No",
    async onOk() {
      try {
        const response = await delProductReviewByAdmin(reviewId, token);
        if (response.code === 200) {
          setReviews((prev) => prev.filter((review) => review._id !== reviewId));
          message.success(response.message);
        }
      } catch (error) {
        message.error("Không thể xóa đánh giá. Vui lòng thử lại!");
      }
    },
  });
};

// Xóa reply của admin
export const handleDeleteReplyByAdmin = (reviewId, replyId, token, fetchReviews) => {
  confirm({
    title: `Bạn chắc chắn muốn xóa trả lời này?`,
    icon: <ExclamationCircleFilled />,
    content: "Xác nhận xóa!",
    okText: "Yes",
    okType: "danger",
    cancelText: "No",
    async onOk() {
      try {
        const response = await delProductReplyByAdmin(reviewId, replyId, token);
        if (response.code === 200) {
          fetchReviews();
          message.success(response.message);
        }
      } catch (error) {
        message.error("Không thể xóa trả lời. Vui lòng thử lại!");
      }
    },
  });
};

// Gửi reply của admin
export const handleSubmitReplyByAdmin = async (replyingReviewAdmin, e, token, fetchReviews, replyFormAdmin, setReplyingReviewAdmin) => {
  const currentReviewId = replyingReviewAdmin._id;
  e.role = "admin";

  try {
    const response = await addProductReviewReplyByAdmin(currentReviewId, e, token);
    if (response.code === 200) {
      message.success(response.message);
      fetchReviews();
      replyFormAdmin.resetFields();
      setReplyingReviewAdmin(null);
    } else {
      message.error(response.message);
    }
  } catch (error) {
    message.error("Không thể gửi đánh giá. Vui lòng thử lại!");
  }
};
