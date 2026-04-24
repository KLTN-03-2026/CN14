import { delAuth, getAuth, patchAuth, postAuth } from "../../utils/request";
const admin = "/admin";

export const listArticle = async (token, page, limit, sortKey, sortType) => {
    const params = new URLSearchParams();
  
    if (page) params.append("page", page);
    if (limit) params.append("limit", limit);
    if (sortKey && sortKey !== "default") params.append("sortKey", sortKey);
    if (sortType) params.append("sortType", sortType);
  
    const result = await getAuth(`${admin}/articles?${params.toString()}`, token);
    return result;
}

export const editArticle = async (id, option, token) => {
  const result = await patchAuth(`${admin}/articles/edit/${id}`, option, token);
  return result;
}

export const changeStatusArticle = async (token, status, id) => {  
  const result = await getAuth(`${admin}/articles/change-status/${status}/${id}`, token);
  return result;
}

export const deleteArticle = async (id, token) => {
  const result = await delAuth(`${admin}/articles/delete/${id}`, token);
  return result;
}

export const addArticle = async (option, token) => {
  const result = await postAuth(`${admin}/articles/create`, option, token);
  return result;
}

export const detailArticle = async (token, id) => {
  const result = await getAuth(`${admin}/articles/${id}`, token);
  return result;
}