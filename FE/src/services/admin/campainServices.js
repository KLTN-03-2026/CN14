import { delAuth, getAuth, patchAuth, postAuth } from "../../utils/request";
const admin = "/admin";

export const listCampaign = async (token, page, limit) => {
    const params = new URLSearchParams();
  
    if (page) params.append("page", page);
    if (limit) params.append("limit", limit);
  
    const result = await getAuth(`${admin}/campaigns?${params.toString()}`, token);
    return result;
}

export const listMaterial = async (token) => {
  const result = await getAuth(`${admin}/campaigns/materials`, token);
  return result;
}

export const editCampaign = async (id, option, token) => {
  const result = await patchAuth(`${admin}/campaigns/edit/${id}`, option, token);
  return result;
}

export const changeStatusCampaign = async (token, status, id) => {  
  const result = await getAuth(`${admin}/campaigns/change-status/${status}/${id}`, token);
  return result;
}

export const deleteCampaign = async (id, token) => {
  const result = await delAuth(`${admin}/campaigns/delete/${id}`, token);
  return result;
}

export const addCampaign = async (option, token) => {
  const result = await postAuth(`${admin}/campaigns/create`, option, token);
  return result;
}

export const detailCampaign = async (token, id) => {
  const result = await getAuth(`${admin}/campaigns/${id}`, token);
  return result;
}