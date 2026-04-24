import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addAuthor, deleteAuthor, editAuthor, listAuthor } from "../../services/admin/authorServices";
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
    console.error("❌ Lỗi mạng:", error);
    message.error(error?.message || "Không thể kết nối đến máy chủ!");
};

function useAuthors({ token, currentPage, limit, keyword, sortKey, sortType } = {}) {
    const queryClient = useQueryClient();

    // GET products
    const authorsQuery = useQuery({
        queryKey: ["authors", currentPage, limit, keyword, sortKey, sortType],
        queryFn: async () => {
            const res = await listAuthor(token, currentPage, limit, keyword, sortKey,
                sortType);
            return res.data;
        },
        enabled: !!token,
        keepPreviousData: true,
        staleTime: 60 * 1000, // cache sống trong 1 phút
        retry: 1, // chỉ thử lại 1 lần nếu lỗi
    });

    // CREATE
    const createAuthor = useMutation({
        mutationFn: (newAuthor) => addAuthor(newAuthor, token),
        onSuccess: (response) => {
            if (response.code === 200) {
                message.success("Thêm tác giả thành công!");
                queryClient.invalidateQueries(["authors"]);
            } else handleErrorResponse(response);
        },
        onError: handleNetworkError,
    });

    // UPDATE product
    const updateAuthor = useMutation({
        mutationFn: ({ id, data }) => editAuthor(id, data, token),
        onSuccess: (response) => {
            if (response?.code === 200) {
                message.success("Cập nhật thành công!");
                queryClient.invalidateQueries(["authors"]);
            } else handleErrorResponse(response);
        },
        onError: handleNetworkError,
    });

    // UPDATE STATUS — render lại ngay lập tức, không cần refetch

    const delAuthor = useMutation({
        mutationFn: ({ id }) => deleteAuthor(id, token),
        onSuccess: (response) => {
            if (response?.code === 200) {
                message.success(response.message);
                // ⚡ Buộc query re-fetch để UI cập nhật lại
                queryClient.invalidateQueries({
                    queryKey: ["authors"],
                    exact: false,
                });
            } else {
                handleErrorResponse(response);
            }
        },

        onError: (error) => handleNetworkError(error),
    });

    return {
        authorsQuery, createAuthor, updateAuthor, delAuthor
    };
}

export default useAuthors;
