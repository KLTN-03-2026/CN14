import { delAuth, getAuth, patchAuth, postAuth } from "../../utils/request";
const admin = "/admin";

export const listVoucherGift= async (token, page, limit) => {
  const params = new URLSearchParams();
  
    if (page) params.append("page", page);
    if (limit) params.append("limit", limit);
  
    const result = await getAuth(`${admin}/voucher-gifts?${params.toString()}`, token);
    return result;
}

export const editVoucherGift = async (id, option, token) => {
  const result = await patchAuth(`${admin}/voucher-gifts/edit-item/${id}`, option, token);
  return result;
}

export const deleteVoucherGift = async (id, token) => {
  const result = await delAuth(`${admin}/voucher-gifts/delete-item/${id}`, token);
  return result;
}

export const addVoucherGift = async (option, token) => {
  const result = await postAuth(`${admin}/voucher-gifts/create-item`, option, token);
  return result;
}

export const changeStatusVoucherGift = async (token, status, id) => {
  const result = await getAuth(`${admin}/voucher-gifts/change-status/${status}/${id}`, token);
  return result;
}