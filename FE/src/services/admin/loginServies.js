import { post } from "../../utils/request";


export const login = async (option) => {
  const result = await post(`/admin/auth/login`, option);
  return result;
}

// export const permissionsPost = async (option) => {
//   const result = await post(`/admin/auth/permissions`, option);
//   return result;
// }