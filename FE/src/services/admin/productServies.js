import { delAuth, getAuth, patchAuth, postAuth } from "../../utils/request";
const admin = "/admin";

export const listProducts = async (token, page, limit, keyword, sortKey, sortType, status, category, author, publisher) => {
  const params = new URLSearchParams();

  if (page) params.append("page", page);
  if (limit) params.append("limit", limit);
  if (keyword) params.append("keyword", keyword);
  if (sortKey && sortKey !== "default") params.append("sortKey", sortKey);
  if (status) params.append("status", status);
  if (category) params.append("category", category);
  if (author) params.append("author", author);
  if (publisher) params.append("publisher", publisher);
  if (sortType) params.append("sortType", sortType);

  const result = await getAuth(`${admin}/products?${params.toString()}`, token);
  return result;
}



export const editProduct = async (id, option, token) => {
  const result = await patchAuth(`${admin}/products/edit-item/${id}`, option, token);
  return result;
}

export const deleteProduct = async (id, token) => {
  const result = await delAuth(`${admin}/products/delete-item/${id}`, token);
  return result;
}

export const addProduct = async (option, token) => {
  const result = await postAuth(`${admin}/products/create-item`, option, token);
  return result;
}

export const changeStatusProduct = async (token, status, id) => {
  const result = await getAuth(`${admin}/products/change-status/${status}/${id}`, token);
  return result;
}

export const getReviewsOfProduct = async (token, id) => {
  const result = await getAuth(`${admin}/products/reviews/${id}`, token);
  return result;
}

export const changeDeletedReview = async (token, status, id) => {
  const result = await getAuth(`${admin}/products/reviews/change-deleted/${status}/${id}`, token);
  return result;
}

export const addProductReviewReplyByAdmin = async (reviewId, options, token) => {
  const result = await postAuth(`${admin}/products/reviews/replies/${reviewId}`, options, token);
  return result;
}

export const delProductReviewByAdmin = async (reviewId, token) => {
  const result = await delAuth(`${admin}/products/reviews/delete/${reviewId}`, token);
  return result;
}

export const delProductReplyByAdmin = async (reviewId, replyId, token) => {
  const result = await delAuth(`${admin}/products/reviews/delete/${reviewId}/${replyId}`, token);
  return result;
}

export const delPermanentReview = async (reviewId, token) => {
  const result = await delAuth(`${admin}/products/reviews/delete-permanent/${reviewId}/`, token);
  return result;
}