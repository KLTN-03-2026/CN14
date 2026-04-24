import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { addCategory, changeStatusCategory, deleteCategory, editCategory, listCategory } from "../../services/admin/categoryServies";

// 🧩 Helper: Xử lý lỗi phản hồi API
const handleErrorResponse = (response) => {
  if (!response) return message.error("Không nhận được phản hồi từ server!");
  if (Array.isArray(response.message)) {
    const errors = response.message.map((err) => err.message).join("\n");
    message.error(errors);
  } else {
    message.error(response.message || "Có lỗi xảy ra, vui lòng thử lại!");
  }
};

// 🧩 Helper: Xử lý lỗi mạng
const handleNetworkError = (error) => {
  console.error("❌ Network Error:", error);
  message.error(error?.message || "Không thể kết nối đến server!");
};

function useCategories({ token, currentPage, limit, sortKey, sortType, status } = {}) {
  const queryClient = useQueryClient();

  // 🟩 1. Lấy danh sách
  const categoriesQuery = useQuery({
    queryKey: ["categories", { currentPage, limit, sortKey, sortType, status }],
    queryFn: async () => {
      const res = await listCategory(token, currentPage, limit, sortKey, sortType, status);
      return res.data; // Chỉ trả về data cần thiết
    },
    enabled: !!token, // chỉ chạy khi có token
    keepPreviousData: true, // giữ data cũ khi phân trang
  });

  // CREATE
  const createCategory = useMutation({
    mutationFn: (newBrand) => addCategory(newBrand, token),
    onSuccess: (response) => {
      if (response?.code === 200) {
        message.success("Thêm mới danh mục thành công");
        // Chỉ invalid danh sách, không xoá cache khác
        queryClient.invalidateQueries({ queryKey: ["categories"] });
      } else {
        handleErrorResponse(response);
      }
    },
    onError: (error) => handleNetworkError(error),
  });

  // UPDATE
  const updateCategory = useMutation({
    mutationFn: ({ id, data }) => editCategory(id, data, token),
    onSuccess: (response) => {
      if (response?.code === 200) {
        message.success(response.message);
        // Cập nhật cache trực tiếp, tránh refetch toàn bộ
        queryClient.invalidateQueries({ queryKey: ["categories"] });
      } else {
        handleErrorResponse(response);
      }
    },
    onError: (error) => handleNetworkError(error),
  });

  // UPDATE status
  const updateStatus = useMutation({
    mutationFn: ({ statusChange, id }) => changeStatusCategory(token, statusChange, id),

    onSuccess: (response) => {
      if (response?.code === 200) {
        message.success("Thay đổi trạng thái thành công");

        // ⚡ Buộc query re-fetch để UI cập nhật lại
        queryClient.invalidateQueries({
          queryKey: ["categories"],
          exact: false,
        });
      } else {
        handleErrorResponse(response);
      }
    },

    onError: (error) => handleNetworkError(error),
  });

  const delCategory = useMutation({
    mutationFn: ({ id }) => deleteCategory(id, token),
    onSuccess: (response) => {
      if (response?.code === 200) {
        message.success(response.message);
        // ⚡ Buộc query re-fetch để UI cập nhật lại
        queryClient.invalidateQueries({
          queryKey: ["categories"],
          exact: false,
        });
      } else {
        handleErrorResponse(response);
      }
    },

    onError: (error) => handleNetworkError(error),
  });


  return { categoriesQuery, createCategory, updateCategory, updateStatus, delCategory };
}

export default useCategories;