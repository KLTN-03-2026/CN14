import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addPublisher, deletePublisher, editPublisher, listPublisher } from "../../services/admin/publisherServices";
import { message } from "antd";

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
    console.error("Lỗi mạng:", error);
    message.error(error?.message || "Không thể kết nối đến máy chủ!");
};

function usePublishers({ token, currentPage, limit, keyword, sortKey, sortType } = {}) {
    const queryClient = useQueryClient();

    // GET
    const publishersQuery = useQuery({
        queryKey: ["publishers", currentPage, limit, keyword, sortKey, sortType],
        queryFn: async () => {
            const res = await listPublisher(token, currentPage, limit, keyword, sortKey,
                sortType);
            return res.data;
        },
        enabled: !!token,
        keepPreviousData: true,
        staleTime: 60 * 1000, // cache sống trong 1 phút
        retry: 1, // chỉ thử lại 1 lần nếu lỗi
    });

    // CREATE
    const createPublisher = useMutation({
        mutationFn: (newPublisher) => addPublisher(newPublisher, token),
        onSuccess: (response) => {
            if (response.code === 200) {
                message.success("Thêm nhà xuất bản thành công!");
                queryClient.invalidateQueries(["publishers"]);
            } else handleErrorResponse(response);
        },
        onError: handleNetworkError,
    });

    // UPDATE product
    const updatePublisher = useMutation({
        mutationFn: ({ id, data }) => editPublisher(id, data, token),
        onSuccess: (response) => {
            if (response?.code === 200) {
                message.success("Cập nhật thành công!");
                queryClient.invalidateQueries(["publishers"]);
            } else handleErrorResponse(response);
        },
        onError: handleNetworkError,
    });

    // UPDATE STATUS — render lại ngay lập tức, không cần refetch

    const delPublisher = useMutation({
        mutationFn: ({ id }) => deletePublisher(id, token),
        onSuccess: (response) => {
            if (response?.code === 200) {
                message.success(response.message);
                // ⚡ Buộc query re-fetch để UI cập nhật lại
                queryClient.invalidateQueries({
                    queryKey: ["publishers"],
                    exact: false,
                });
            } else {
                handleErrorResponse(response);
            }
        },

        onError: (error) => handleNetworkError(error),
    });

    return {
        publishersQuery, createPublisher, updatePublisher, delPublisher
    };
}

export default usePublishers;
