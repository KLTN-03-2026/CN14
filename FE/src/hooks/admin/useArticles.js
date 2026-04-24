import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { listArticle, editArticle, addArticle, deleteArticle, changeStatusArticle } from "../../services/admin/articleServies";

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

function useArticles({ token, currentPage, limit, sortKey, sortType } = {}) {
  const queryClient = useQueryClient();

  // 🟢 GET 
  const articlesQuery = useQuery({
    queryKey: ["articles", currentPage, limit, sortKey, sortType],
    queryFn: async () => {
      const res = await listArticle(token, currentPage, limit, sortKey, sortType);
      return res.data;
    },
    enabled: !!token,
    keepPreviousData: true,
    staleTime: 60 * 1000, // cache sống trong 1 phút
    retry: 1, // chỉ thử lại 1 lần nếu lỗi
  });

  // 🟢 CREATE 
  const createArticle = useMutation({
    mutationFn: (newArticle) => addArticle(newArticle, token),
    onSuccess: (response) => {
      if (response.code === 200) {
        message.success(response.message);
        queryClient.invalidateQueries(["articles"]);
      } else handleErrorResponse(response);
    },
    onError: handleNetworkError,
  });

  // 🟠 UPDATE 
  const updateArticle = useMutation({
    mutationFn: ({ id, data }) => editArticle(id, data, token),
    onSuccess: (response) => {
      if (response?.code === 200) {
        message.success("Cập nhật thành công!");
        queryClient.invalidateQueries(["articles"]);
      } else handleErrorResponse(response);
    },
    onError: handleNetworkError,
  });

  // 🔴 UPDATE STATUS — render lại ngay lập tức, không cần refetch
  const updateStatus = useMutation({
    mutationFn: ({ statusChange, id }) => changeStatusArticle(token, statusChange, id),
    onSuccess: (response) => {
      if (response?.code === 200) {
        message.success("Thay đổi trạng thái thành công");

        // ⚡ Buộc query re-fetch để UI cập nhật lại
        queryClient.invalidateQueries({
          queryKey: ["articles"],
          exact: false,
        });
      } else handleErrorResponse(response);
    },
    onError: handleNetworkError,
  });

  const delArticle = useMutation({
    mutationFn: ({ id }) => deleteArticle(id, token),
    onSuccess: (response) => {
      if (response?.code === 200) {
        message.success(response.message);
        // ⚡ Buộc query re-fetch để UI cập nhật lại
        queryClient.invalidateQueries({
          queryKey: ["articles"],
          exact: false,
        });
      } else {
        handleErrorResponse(response);
      }
    },

    onError: (error) => handleNetworkError(error),
  });

  return { articlesQuery, createArticle, updateArticle, updateStatus, delArticle };
}

export default useArticles;
