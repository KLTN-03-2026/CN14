import { get } from "../../utils/request";

export const listCampiagn = async () => {
  const result = await get(`/campaigns`);
  return result;
}

export const detailCampiagn = async (slug) => {
  const result = await get(`/campaigns/detail/${slug}`);
  return result;
}
