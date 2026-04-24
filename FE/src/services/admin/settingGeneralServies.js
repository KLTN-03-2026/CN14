import { getAuth, patchAuth } from "../../utils/request";
const admin = "/admin";

export const settingGeneralGet = async (token) => {
  const result = await getAuth(`${admin}/settings/general`, token);
  return result;
}

export const settingGeneralPatch = async (option, token) => {
  const result = await patchAuth(`${admin}/settings/general`, option, token);
  return result;
}