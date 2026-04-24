import { post } from "../../utils/request";

export const postSendContact = async (option) => {
  const result = await post(`/contacts/send`, option);
  return result;
}
