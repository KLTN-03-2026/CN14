import { get } from "../../utils/request";

export const listBanner = async () => {
  const result = await get(`/banners`);
  return result;
}

export const detailBanner = async (slug) => {
  const result = await get(`/banners/detail/${slug}`);
  return result;
}

export const vouchersBanner = async (banner_id) => {
  const result = await get(`/banners/vouchers/${banner_id}`);
  return result;
}