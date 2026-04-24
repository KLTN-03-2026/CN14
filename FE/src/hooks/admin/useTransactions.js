import { useQuery } from "@tanstack/react-query";
import { listTransaction } from "../../services/admin/transactionServies";

function useTransactions({ token, currentPage, limit, keyword, sortKey, sortType, status, provider } = {}) {

  // 🟢 GET transactions
  const transactionsQuery = useQuery({
    queryKey: ["transactions", currentPage, limit, keyword, sortKey, sortType, status, provider],
    queryFn: async () => {
      const res = await listTransaction(token, currentPage, limit, keyword, sortKey, sortType, status, provider);
      return res.data;
    },
    enabled: !!token,
    keepPreviousData: true,
    staleTime: 60 * 1000, // cache sống trong 1 phút
    retry: 1, // chỉ thử lại 1 lần nếu lỗi
  });


  return { transactionsQuery };
}

export default useTransactions;
