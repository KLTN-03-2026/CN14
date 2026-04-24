import { delAuth, getAuth, patchAuth, postAuth } from "../../utils/request";
const admin = "/admin";

export const listVouchers = async (token, page, litmit, keyword, sortKey, sortType) => {
  const result = await getAuth(`${admin}/vouchers?page=${page}&limit=${litmit}&keyword=${keyword}&sortKey=${sortKey}&sortType=${sortType}`, token);
  return result;
}

export const listBanners = async (token) => {
  const result = await getAuth(`${admin}/banners`, token);
  return result;
}

export const editVoucher = async (id, option, token) => {
  const result = await patchAuth(`${admin}/vouchers/edit/${id}`, option, token);
  return result;
}

export const deleteVoucher = async (id, token) => {
  const result = await delAuth(`${admin}/vouchers/delete/${id}`, token);
  return result;
}

export const createVoucher = async (option, token) => {
  const result = await postAuth(`${admin}/vouchers/create`, option, token);
  return result;
}

export const changeStatusVoucher = async (token, status, id) => {
  const result = await getAuth(`${admin}/vouchers/change-status/${status}/${id}`, token);
  return result;
}