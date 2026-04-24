import { get } from "../../utils/request";

export const listVouchers = async () => {
  const result = await get(`/vouchers`);
  return result;
}
