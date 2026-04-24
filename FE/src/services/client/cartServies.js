import { getAuth, patchAuth } from "../../utils/request";

export const findCartByUserId = async (tokenUser) => {
  const result = await getAuth(`/cart/get-cart`, tokenUser);
  return result;
}

export const addCartPatch = async (productId, options, tokenUser) => {
  const result = await patchAuth(`/cart/add/${productId}`, options, tokenUser);
  return result;
}

export const updateCartPatch = async (productId, options, tokenUser) => {
  const result = await patchAuth(`/cart/update/${productId}`, options, tokenUser);
  return result;
}

export const delCartPatch = async (productId, options, tokenUser) => {
  const result = await patchAuth(`/cart/delete/${productId}`, options, tokenUser);
  return result;
}

export const mergeCartPatch = async (options, tokenUser) => {
  const result = await patchAuth(`/cart/merge-cart`, options, tokenUser);
  return result;
}
