import { getAuth } from "../../utils/request";
const admin = "/admin";

export const listTransaction = async (token, page, limit, keyword, sortKey, sortType, status, provider) => {
  const params = new URLSearchParams();

  if (page) params.append("page", page);
  if (limit) params.append("limit", limit);
  if (status) params.append("status", status);
  if (provider) params.append("provider", provider);
  if (keyword) params.append("keyword", keyword);
  if (sortKey && sortKey !== "default") params.append("sortKey", sortKey);
  if (sortType) params.append("sortType", sortType);

  const result = await getAuth(`${admin}/transactions?${params.toString()}`, token);
  return result;
}