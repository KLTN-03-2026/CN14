import { get } from "../../utils/request";

export const listAuthor = async () => {
  const result = await get(`/authors`);
  return result;
}