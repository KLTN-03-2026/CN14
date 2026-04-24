import { get } from "../../utils/request";

export const productsSearchGet = async (slugCategory) => {
  const result = await get(`/search?keyword=${slugCategory}`);
  return result;
};

export const searchOrder = async (code, email) => {
  const result = await get(`/search/order/${code}/${email}`);
  return result;
};