import { delAuth, getAuth, patchAuth, postAuth } from "../../utils/request";
const admin = "/admin";

export const listAuthor = async (token, page, limit, keyword, sortKey, sortType) => {
  const params = new URLSearchParams();

  if (page) params.append("page", page);
  if (limit) params.append("limit", limit);
  if (keyword) params.append("keyword", keyword);
  if (sortKey && sortKey !== "default") params.append("sortKey", sortKey);
  if (sortType) params.append("sortType", sortType);

  const result = await getAuth(`${admin}/authors?${params.toString()}`, token);
  return result;
}

export const editAuthor = async (id, option, token) => {
  const result = await patchAuth(`${admin}/authors/edit-item/${id}`, option, token);
  return result;
}

export const deleteAuthor = async (id, token) => {
  const result = await delAuth(`${admin}/authors/delete-item/${id}`, token);
  return result;
}

export const addAuthor = async (option, token) => {
  const result = await postAuth(`${admin}/authors/create-item`, option, token);
  return result;
}

export const listAllAuthors = async (token) => {
  const result = await getAuth(`${admin}/authors/all`, token);
  return result;
}