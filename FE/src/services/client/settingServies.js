import { get } from "../../utils/request";

export const settingGeneralGet = async () => {
  const result = await get(`/settings`);
  return result;
}