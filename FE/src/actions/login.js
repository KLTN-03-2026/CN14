export const checkLogin = (token) => {
  return {
    type: "CHECK_LOGIN",
    token: token
  }
}
export const logout = () => ({
  type: "LOGOUT"
});