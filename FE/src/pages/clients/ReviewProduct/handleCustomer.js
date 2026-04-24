import { message, Modal } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { productReplyDelete, productReviewAddReply, productReviewDelete, productReviewPost } from "../../../services/client/productServies";

const { confirm } = Modal;

// Xóa review của customer
export const handleDeleteReview = (reviewId, tokenUser, setReviews) => {
  confirm({
    title: `Bạn chắc chắn muốn xóa đánh giá này?`,
    icon: <ExclamationCircleFilled />,
    content: "Xác nhận xóa!",
    okText: "Yes",
    okType: "danger",
    cancelText: "No",
    async onOk() {
      try {
        const response = await productReviewDelete(reviewId, tokenUser);
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

// Xóa reply của customer
export const handleDeleteReply = (reviewId, replyId, tokenUser, fetchReviews) => {
  confirm({
    title: `Bạn chắc chắn muốn xóa trả lời này?`,
    icon: <ExclamationCircleFilled />,
    content: "Xác nhận xóa!",
    okText: "Yes",
    okType: "danger",
    cancelText: "No",
    async onOk() {
      try {
        const response = await productReplyDelete(reviewId, replyId, tokenUser);
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

// Gửi reply của customer
export const handleSubmitReplyCustomer = async (replyingReview, e, tokenUser, fetchReviews, replyForm, setReplyingReview, setSubmitting) => {
  const currentReviewId = replyingReview._id;
  e.role = "customer";

  try {
    const response = await productReviewAddReply(currentReviewId, e, tokenUser);
    if (response.code === 200) {
      message.success(response.message);
      fetchReviews();
      replyForm.resetFields();
      setReplyingReview(null);
    } else {
      message.error(response.message);
    }
  } catch (error) {
    message.error("Không thể gửi đánh giá. Vui lòng thử lại!");
  } finally {
    setSubmitting(false);
  }
};

export const handleSubmitReview = async (productId, e, setReviews, tokenUser, form, setSubmitting, fetchReviews) => {
  try {
    setSubmitting(true);
    const response = await productReviewPost(productId, e, tokenUser);

    if (response.code === 201) {
      // Thêm đánh giá mới vào đầu danh sách
      setReviews((prev) => [response.data, ...prev]);
      message.success(response.message);
      fetchReviews();
      // Reset form
      form.resetFields()
    } else {
      message.error(response.message)
    }
  } catch (error) {
    message.error("Không thể gửi đánh giá. Vui lòng thử lại!")
  } finally {
    setSubmitting(false)
  }
}