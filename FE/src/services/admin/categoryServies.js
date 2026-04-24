import { delAuth, getAuth, patchAuth, postAuth } from "../../utils/request";
const admin = "/admin";


export const listCategory = async (token, page, limit, sortKey, sortType, status) => {
  const params = new URLSearchParams();

  if (page) params.append("page", page);
  if (limit) params.append("limit", limit);
  if (limit) params.append("status", status);
  if (sortKey && sortKey !== "default") params.append("sortKey", sortKey);
  if (sortType) params.append("sortType", sortType);

  const result = await getAuth(`${admin}/products-category?${params.toString()}`, token);
  return result;
};

export const listAllCategory = async (token) => {
  const result = await getAuth(`${admin}/products-category/all`, token);
  return result;
}

export const addCategory = async (option, token) => {
  const result = await postAuth(`${admin}/products-category/create`, option, token);
  return result;
}

export const editCategory = async (id, option, token) => {
  const result = await patchAuth(`${admin}/products-category/edit/${id}`, option, token);
  return result;
}
export const changeStatusCategory = async (token, status, id) => {
  const result = await getAuth(`${admin}/products-category/change-status/${status}/${id}`, token);
  return result;
}

export const deleteCategory = async (id, token) => {
  const result = await delAuth(`${admin}/products-category/delete-item/${id}`, token);
  return result;
}