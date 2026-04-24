import { delAuth, getAuth, patchAuth, postAuth } from "../../utils/request";
const admin = "/admin";

export const listRoleGet = async (token) => {
  const result = await getAuth(`${admin}/roles`, token);
  return result;
}

export const editPermissionsPatch = async (option, token) => {
  const result = await patchAuth(`${admin}/roles/permissions`, option, token);
  return result;
}

export const createRolePost = async (option, token) => {
  const result = await postAuth(`${admin}/roles/create`, option, token);
  return result;
}

export const deleteRole = async (id, token) => {
  const result = await delAuth(`${admin}/roles/delete-item/${id}`, token);
  return result;
}

export const editRolePatch = async (id, option, token) => {
  const result = await patchAuth(`${admin}/roles/edit/${id}`, option, token);
  return result;
}