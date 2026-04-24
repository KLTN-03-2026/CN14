import { getAuth } from "../../utils/request";
const admin = "/admin";

export const listItem = async (token, typeItem, page, litmit, keyword) => {
  const result = await getAuth(`${admin}/trashs/${typeItem}?page=${page}
    &limit=${litmit}&keyword=${keyword}`, token);
  return result;
}

export const restoreItem = async (token, typeItem, idItem) => {
  const result = await getAuth(`${admin}/trashs/restore/${typeItem}/${idItem}`, token);
  return result;
}

export const permanentDelItem = async (token, typeItem, productId) => {
  const result = await getAuth(`${admin}/trashs/permanent-delete/${typeItem}/${productId}`, token);
  return result;
}