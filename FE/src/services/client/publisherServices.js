import { get } from "../../utils/request";

export const listPublisher = async () => {
  const result = await get(`/publishers`);
  return result;
}