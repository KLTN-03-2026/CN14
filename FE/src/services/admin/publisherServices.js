import { delAuth, getAuth, patchAuth, postAuth } from "../../utils/request";
const admin = "/admin";

export const listPublisher = async (token, page, limit, keyword, sortKey, sortType) => {
  const params = new URLSearchParams();

  if (page) params.append("page", page);
  if (limit) params.append("limit", limit);
  if (keyword) params.append("keyword", keyword);
  if (sortKey && sortKey !== "default") params.append("sortKey", sortKey);
  if (sortType) params.append("sortType", sortType);

  const result = await getAuth(`${admin}/publishers?${params.toString()}`, token);
  return result;
}

export const editPublisher = async (id, option, token) => {
  const result = await patchAuth(`${admin}/publishers/edit-item/${id}`, option, token);
  return result;
}

export const deletePublisher = async (id, token) => {
  const result = await delAuth(`${admin}/publishers/delete-item/${id}`, token);
  return result;
}

export const addPublisher = async (option, token) => {
  const result = await postAuth(`${admin}/publishers/create-item`, option, token);
  return result;
}

export const listAllPublisher = async (token) => {
  const result = await getAuth(`${admin}/publishers/all`, token);
  return result;
}