import { get } from "../../utils/request";

export const listBrand = async () => {
  const result = await get(`/brands`);
  return result;
}