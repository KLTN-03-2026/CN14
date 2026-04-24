import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { listCampaign, editCampaign, addCampaign, deleteCampaign, changeStatusCampaign } from "../../services/admin/campainServices";

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

function useCampaigns({ token, currentPage, limit } = {}) {
  const queryClient = useQueryClient();

  // 🟢 GET 
  const campaignsQuery = useQuery({
    queryKey: ["campaigns", currentPage, limit],
    queryFn: async () => {
      const res = await listCampaign(token, currentPage, limit);
      return res.data;
    },
    enabled: !!token,
    keepPreviousData: true,
    staleTime: 60 * 1000, // cache sống trong 1 phút
    retry: 1, // chỉ thử lại 1 lần nếu lỗi
  });

  // 🟢 CREATE 
  const createCampain = useMutation({
    mutationFn: (newArticle) => addCampaign(newArticle, token),
    onSuccess: (response) => {
      if (response.code === 200) {
        message.success(response.message);
        queryClient.invalidateQueries(["campaigns"]);
      } else handleErrorResponse(response);
    },
    onError: handleNetworkError,
  });

  // 🟠 UPDATE 
  const updateCampain = useMutation({
    mutationFn: ({ id, data }) => editCampaign(id, data, token),
    onSuccess: (response) => {
      if (response?.code === 200) {
        message.success("Cập nhật thành công!");
        queryClient.invalidateQueries(["campaigns"]);
      } else handleErrorResponse(response);
    },
    onError: handleNetworkError,
  });

  // 🔴 UPDATE STATUS — render lại ngay lập tức, không cần refetch
  const updateStatus = useMutation({
    mutationFn: ({ statusChange, id }) => changeStatusCampaign(token, statusChange, id),
    onSuccess: (response) => {
      if (response?.code === 200) {
        message.success("Thay đổi trạng thái thành công");

        // ⚡ Buộc query re-fetch để UI cập nhật lại
        queryClient.invalidateQueries({
          queryKey: ["campaigns"],
          exact: false,
        });
      } else handleErrorResponse(response);
    },
    onError: handleNetworkError,
  });

  const delCampain = useMutation({
    mutationFn: ({ id }) => deleteCampaign(id, token),
    onSuccess: (response) => {
      if (response?.code === 200) {
        message.success(response.message);
        // ⚡ Buộc query re-fetch để UI cập nhật lại
        queryClient.invalidateQueries({
          queryKey: ["campaigns"],
          exact: false,
        });
      } else {
        handleErrorResponse(response);
      }
    },

    onError: (error) => handleNetworkError(error),
  });

  return { campaignsQuery, createCampain, updateCampain, updateStatus, delCampain };
}

export default useCampaigns;
