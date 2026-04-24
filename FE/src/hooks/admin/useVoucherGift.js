import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addVoucherGift, changeStatusVoucherGift, deleteVoucherGift, editVoucherGift, listVoucherGift } from "../../services/admin/voucherGiftServies";
import { message } from "antd";

// 🔧 Hàm xử lý lỗi chung
const handleErrorResponse = (response) => {
  if (!response) return message.error("Lỗi không xác định!");

  if (Array.isArray(response.message)) {
    const allErrors = response.message.map((err) => err.message).join("\n");
    message.error(allErrors);
  } else {
    message.error(response.message || "Có lỗi xảy ra, vui lòng thử lại!");
  }
};

const handleNetworkError = (error) => {
  console.error("❌ Lỗi mạng:", error);
  message.error(error?.message || "Không thể kết nối đến máy chủ!");
};

function useVoucherGifts({ token, currentPage, limit } = {}) {
  const queryClient = useQueryClient();

  // 🟢 GET 
  const voucherGiftsQuery = useQuery({
    queryKey: ["voucher-gifts", currentPage, limit],
    queryFn: async () => {
      const res = await listVoucherGift(token, currentPage, limit);
      return res.data;
    },
    enabled: !!token,
    keepPreviousData: true,
    staleTime: 60 * 1000, // cache sống trong 1 phút
    retry: 1, // chỉ thử lại 1 lần nếu lỗi
  });

  // 🟢 CREATE product
  const createVoucherGift = useMutation({
    mutationFn: (newProduct) => addVoucherGift(newProduct, token),
    onSuccess: (response) => {
      if (response.code === 200) {
        message.success(response.message);
        queryClient.invalidateQueries(["voucher-gifts"]);
      } else handleErrorResponse(response);
    },
    onError: handleNetworkError,
  });

  // 🟠 UPDATE product
  const updateVoucherGift = useMutation({
    mutationFn: ({ id, data }) => editVoucherGift(id, data, token),
    onSuccess: (response) => {
      if (response?.code === 200) {
        message.success(response.message);
        queryClient.invalidateQueries(["voucher-gifts"]);
      } else handleErrorResponse(response);
    },
    onError: handleNetworkError,
  });

  // 🔴 UPDATE STATUS — render lại ngay lập tức, không cần refetch
  const updateStatus = useMutation({
    mutationFn: ({ statusChange, id }) => changeStatusVoucherGift(token, statusChange, id),
    onSuccess: (response) => {
      if (response?.code === 200) {
        message.success(response.message);

        // ⚡ Buộc query re-fetch để UI cập nhật lại
        queryClient.invalidateQueries({
          queryKey: ["voucher-gifts"],
          exact: false,
        });
      } else handleErrorResponse(response);
    },
    onError: handleNetworkError,
  });

  const delVoucherGift = useMutation({
    mutationFn: ({ id }) => deleteVoucherGift(id, token),
    onSuccess: (response) => {
      if (response?.code === 200) {
        message.success(response.message);
        // ⚡ Buộc query re-fetch để UI cập nhật lại
        queryClient.invalidateQueries({
          queryKey: ["voucher-gifts"],
          exact: false,
        });
      } else {
        handleErrorResponse(response);
      }
    },

    onError: (error) => handleNetworkError(error),
  });

  return { voucherGiftsQuery, createVoucherGift, updateVoucherGift, updateStatus, delVoucherGift };
}

export default useVoucherGifts;
