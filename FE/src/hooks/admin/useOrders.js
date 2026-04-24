import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { changeStatusOrderGet, listOrderGet, removeProductToOrder, updateProductToOrder } from "../../services/admin/orderServies";

// Hàm xử lý lỗi chung
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

function useOrders({ token, currentPage, limit, day, month, keyword } = {}) {
  const queryClient = useQueryClient();

  // GET orders
  const ordersQuery = useQuery({
    queryKey: ["orders", currentPage, limit, day, month, keyword],
    queryFn: async () => {
      const res = await listOrderGet(token, currentPage, limit, day, month, keyword);
      return res.data;
    },
    enabled: !!token,
    keepPreviousData: true,
    staleTime: 60 * 1000, // cache sống trong 1 phút
    retry: 1, // chỉ thử lại 1 lần nếu lỗi
  });

  // 🔴 UPDATE STATUS — render lại ngay lập tức, không cần refetch
  const updateStatus = useMutation({
    mutationFn: ({ statusChange, code }) => changeStatusOrderGet(token, statusChange, code),
    onSuccess: (response) => {
      if (response?.code === 200) {
        message.success("Thay đổi trạng thái thành công");
        // ⚡ Buộc query re-fetch để UI cập nhật lại
        queryClient.invalidateQueries({
          queryKey: ["orders"],
          exact: false,
        });
      } else handleErrorResponse(response);
    },
    onError: handleNetworkError,
  });

  // 🔴 UPDATE PRODUCTS — render lại ngay lập tức, không cần refetch
  const updateProducts = useMutation({
    mutationFn: ({ payload }) => updateProductToOrder(token, payload),
    onSuccess: (response) => {
      if (response?.code === 200) {
        message.success(response.message);
        // ⚡ Buộc query re-fetch để UI cập nhật lại
        queryClient.invalidateQueries({
          queryKey: ["orders"],
          exact: false,
        });
      } else handleErrorResponse(response);
    },
    onError: handleNetworkError,
  });

  // 🔴 REMOVE PRODUCTS — render lại ngay lập tức, không cần refetch
  const removeProducts = useMutation({
    mutationFn: ({ payload }) => removeProductToOrder(token, payload),
    onSuccess: (response) => {
      if (response?.code === 200) {
        message.success(response.message);
        // ⚡ Buộc query re-fetch để UI cập nhật lại
        queryClient.invalidateQueries({
          queryKey: ["orders"],
          exact: false,
        });
      } else handleErrorResponse(response);
    },
    onError: handleNetworkError,
  });

  return {
    ordersQuery, updateStatus, updateProducts, removeProducts
  };
}

export default useOrders;
