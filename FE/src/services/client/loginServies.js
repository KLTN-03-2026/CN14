import { get, post } from "../../utils/request";

export const loginUserPost = async (options) => {
  const result = await post(`/users/login`, options);
  return result;
}
