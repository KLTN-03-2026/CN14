import { get, patch, post, postAuth } from "../../utils/request";

export const orderUserPost = async (options, tokenUser) => {
  const result = await postAuth(`/checkout/order-user`, options, tokenUser);
  return result;
};

export const successOrderPatch = async (orderId, options) => {
  const result = await patch(`/checkout/success/${orderId}`, options);
  return result;
};

export const detailOrderGet = async (orderId) => {
  const result = await get(`/checkout/order/detail/${orderId}`);
  return result;
};

export const createQrPost = async (options) => {
  const result = await post(`/vn-pay/create-qr`, options);
  return result;
};

export const checkVoucherGiftPost = async (options, tokenUser) => {
  const result = await postAuth(`/checkout/check-voucher-gift`, options, tokenUser);
  return result;
};


export const checkVoucherPost = async (options) => {
  const result = await post(`/checkout/check-voucher`, options);
  return result;
};

// gửi mã opt để xác thực email để đặt hàng khi ko đăng nhập
export const sendEmailOTP = async (email) => {
  const result = await post(`/checkout/send-otp`, { email });
  return result;
};

// xác thực mã opt để xác thực email để đặt hàng khi ko đăng nhập
export const verifyEmailOTP = async (email, otp) => {
  const result = await post(`/checkout/verify-otp`, { email, otp });
  return result;
};

export const createPaymentMomo = async (options) => {
  const result = await post(`/momo-pay/create-payment`, options);
  return result;
};
