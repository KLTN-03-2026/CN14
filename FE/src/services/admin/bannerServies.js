import { delAuth, getAuth, patchAuth, postAuth } from "../../utils/request";
const admin = "/admin";

export const listBanners = async (token, page, litmit, keyword, sortKey, sortType) => {
  const result = await getAuth(`${admin}/banners?page=${page}&limit=${litmit}&keyword=${keyword}&sortKey=${sortKey}&sortType=${sortType}`, token);
  return result;
}

export const editBanner = async (id, option, token) => {
  const result = await patchAuth(`${admin}/banners/edit/${id}`, option, token);
  return result;
}

export const deleteBanner = async (id, token) => {
  const result = await delAuth(`${admin}/banners/delete/${id}`, token);
  return result;
}

export const addBanner = async (option, token) => {
  const result = await postAuth(`${admin}/banners/create`, option, token);
  return result;
}

export const changeStatusBanner = async (token, status, id) => {
  const result = await getAuth(`${admin}/banners/change-status/${status}/${id}`, token);
  return result;
}