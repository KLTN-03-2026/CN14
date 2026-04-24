import {
  getAuth,
  patchAuth,
  post,
  postAuth,
} from "../../utils/request";

// quên mật khẩu
export const forgotPasswordPost = async (options) => {
  const result = await post(`/users/password/forgot`, options);
  return result;
};

// nhập mã otp
export const optPasswordPost = async (email, options) => {
  const result = await post(`/users/password/otp/${email}`, options);
  return result;
};

// reset mật khẩu
export const resetPasswordPost = async (options, token) => {
  const result = await postAuth(
    `/users/password/reset-password`,
    options,
    token
  );
  return result;
};

// đăng ký tài khoản
export const registerPost = async (options) => {
  const result = await post(`/users/register`, options);
  return result;
};

// lấy thông tin cá nhân
export const infoGet = async (tokenUser) => {
  const result = await getAuth(`/users/info`, tokenUser);
  return result;
};

// lấy danh sách mẫu voucher gift để đổi mã
export const voucherGiftTemp = async (tokenUser) => {
  const result = await getAuth(`/users/voucher-gifts/templates`, tokenUser);
  return result;
};

// lấy danh sách voucher gift của tôi
export const myVoucherGifts = async (tokenUser) => {
  const result = await getAuth(`/users/voucher-gifts/my-voucher-gifts`, tokenUser);
  return result;
};

// lấy danh sách voucher gift của tôi
export const exchangeVoucherGift = async (options, tokenUser) => {
  const result = await patchAuth(`/users/voucher-gifts/exchange-voucher-gift`, options, tokenUser);
  return result;
};

// chỉnh sửa thông tin cá nhân
export const editInfoPatch = async (options, tokenUser) => {
  const result = await patchAuth(`/users/info/edit`, options, tokenUser);
  return result;
};

// đổi mật khẩu
export const resetPasswordPatch = async (options, tokenUser) => {
  const result = await patchAuth(
    `/users/info/reset-password`,
    options,
    tokenUser
  );
  return result;
};

// đặt mật khẩu cho tài khoản đăng ký với gg, fb
export const setPasswordPatch = async (options, tokenUser) => {
  const result = await patchAuth(
    `/users/info/set-password`,
    options,
    tokenUser
  );
  return result;
};

// lịch sử đơn hàng
export const historyOrderGet = async (tokenUser) => {
  const result = await getAuth(`/users/history-order`, tokenUser);
  return result;
};

// gửi mã opt để xác thực email đăng ký tài khoản
export const sendEmailOTP = async (email) => {
  const result = await post(`/users/send-otp`, { email });
  return result;
};

// xác thực mã otp để xác thực email đăng ký tài khoản
export const verifyEmailOTP = async (email, otp) => {
  const result = await post(`/users/verify-otp`, { email, otp });
  return result;
};

// gửi mã otp để cập nhật tài khoản
export const sendEmailOTPAcount = async (email, token) => {
  const result = await postAuth(`/users/info/send-otp`, { email }, token);
  return result;
};

// xác thực mã otp để cập nhật tài khoản
export const verifyEmailOTPAccount = async (email, otp, token) => {
  const result = await postAuth(
    `/users/info/verify-otp`,
    { email, otp },
    token
  );
  return result;
};
