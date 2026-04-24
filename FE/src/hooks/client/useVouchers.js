import { useQuery } from "@tanstack/react-query";
import { listVouchers } from "../../services/client/voucherService";

function useVouchers() {

  // GET vouchers
  const vouchersQuery = useQuery({
    queryKey: ["vouchers"],
    queryFn: () =>
      listVouchers().then(res => res.data)
  });

  return { vouchersQuery };
}

export default useVouchers;