import { getAuth, postAuth } from "../../utils/request";
const admin = "/admin";

export const listContacts = async (token, page, litmit) => {
  const result = await getAuth(`${admin}/contacts?page=${page}&limit=${litmit}`, token);
  return result;
}

export const replyContact = async (token, option, contact_id) => {
  const result = await postAuth(`${admin}/contacts/reply/${contact_id}`, option, token);
  return result;
}

export const changeStatusContact = async (token, status, contact_id) => {
  const result = await getAuth(`${admin}/contacts/change-status/${status}/${contact_id}`, token);
  return result;
}
