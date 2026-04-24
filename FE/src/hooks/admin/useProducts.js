import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addProduct, changeDeletedReview, changeStatusProduct, deleteProduct, delPermanentReview, editProduct, listProducts } from "../../services/admin/productServies";
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

function useProducts({ token, currentPage, limit, keyword, sortKey, sortType, status, category, author, publisher } = {}) {
  const queryClient = useQueryClient();

  // 🟢 GET products
  const productsQuery = useQuery({
    queryKey: ["products", currentPage, limit, keyword, sortKey, sortType, status, category, author, publisher],
    queryFn: async () => {
      const res = await listProducts(token, currentPage, limit, keyword, sortKey,
        sortType, status, category, author, publisher);
      return res.data;
    },
    enabled: !!token,
    keepPreviousData: true,
    staleTime: 60 * 1000, // cache sống trong 1 phút
    retry: 1, // chỉ thử lại 1 lần nếu lỗi
  });

  // 🟢 CREATE product
  const createProduct = useMutation({
    mutationFn: (newProduct) => addProduct(newProduct, token),
    onSuccess: (response) => {
      if (response.code === 200) {
        message.success("Thêm sản phẩm thành công!");
        queryClient.invalidateQueries(["products"]);
      } else handleErrorResponse(response);
    },
    onError: handleNetworkError,
  });

  // 🟠 UPDATE product
  const updateProduct = useMutation({
    mutationFn: ({ id, data }) => editProduct(id, data, token),
    onSuccess: (response) => {
      if (response?.code === 200) {
        message.success("Cập nhật thành công!");
        queryClient.invalidateQueries(["products"]);
      } else handleErrorResponse(response);
    },
    onError: handleNetworkError,
  });

  // 🔴 UPDATE STATUS — render lại ngay lập tức, không cần refetch
  const updateStatus = useMutation({
    mutationFn: ({ statusChange, id }) => changeStatusProduct(token, statusChange, id),
    onSuccess: (response) => {
      if (response?.code === 200) {
        message.success("Thay đổi trạng thái thành công");
        // ⚡ Buộc query re-fetch để UI cập nhật lại
        queryClient.invalidateQueries({
          queryKey: ["products"],
          exact: false,
        });
      } else handleErrorResponse(response);
    },
    onError: handleNetworkError,
  });

  // 🔴 UPDATE STATUS — render lại ngay lập tức, không cần refetch
  const updateDeletedReview = useMutation({
    mutationFn: ({ status, id }) => changeDeletedReview(token, status, id),
    onSuccess: (response) => {
      if (response?.code === 200) {
        message.success("Thay đổi trạng thái thành công");
        // ⚡ Buộc query re-fetch để UI cập nhật lại
        queryClient.invalidateQueries({
          queryKey: ["review"],
          exact: false,
        });
      } else handleErrorResponse(response);
    },
    onError: handleNetworkError,
  });

  const delProduct = useMutation({
    mutationFn: ({ id }) => deleteProduct(id, token),
    onSuccess: (response) => {
      if (response?.code === 200) {
        message.success(response.message);
        // ⚡ Buộc query re-fetch để UI cập nhật lại
        queryClient.invalidateQueries({
          queryKey: ["products"],
          exact: false,
        });
      } else {
        handleErrorResponse(response);
      }
    },

    onError: (error) => handleNetworkError(error),
  });

  const delPerReview = useMutation({
    mutationFn: ({ id }) => delPermanentReview(id, token),
    onSuccess: (response) => {
      if (response?.code === 200) {
        message.success(response.message);
        // ⚡ Buộc query re-fetch để UI cập nhật lại
        queryClient.invalidateQueries({
          queryKey: ["review"],
          exact: false,
        });
      } else {
        handleErrorResponse(response);
      }
    },

    onError: (error) => handleNetworkError(error),
  });

  return {
    productsQuery, createProduct, updateProduct,
    updateStatus, delProduct, updateDeletedReview, delPerReview
  };
}

export default useProducts;
