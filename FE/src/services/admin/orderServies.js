import { getAuth, patchAuth } from "../../utils/request";
const admin = "/admin";

export const listOrderGet = async (token, page, limit, day, month, keyword) => {
  const params = new URLSearchParams();

  if (page) params.append("page", page);
  if (limit) params.append("limit", limit);
  if (keyword) params.append("keyword", keyword);
  if (day) params.append("day", day);
  if (keyword) params.append("month", month);

  const result = await getAuth(`${admin}/orders?${params.toString()}`, token);
  return result;
}

export const detailOrderGet = async (id, token) => {
  const result = await getAuth(`${admin}/orders/detail/${id}`, token);
  return result;
}

export const productsGet = async (token) => {
  const result = await getAuth(`${admin}/orders/products`, token);
  return result;
}

export const changeStatusOrderGet = async (token, status, code) => {
  const result = await getAuth(`${admin}/orders/change-status/${status}/${code}`, token);
  return result;
}

export const shippingSettingsGet = async (token) => {
  const result = await getAuth(`${admin}/orders/shipping-settings`, token);
  return result;
}

export const shippingSettingsPatch = async (token, data) => {
  const result = await patchAuth(`${admin}/orders/shipping-settings`, data, token);
  return result;
}

export const updateProductToOrder = async (token, data) => {
  const result = await patchAuth(`${admin}/orders/update-order`, data, token);
  return result;
}

export const removeProductToOrder = async (token, data) => {
  const result = await patchAuth(`${admin}/orders/remove-product`, data, token);
  return result;
}