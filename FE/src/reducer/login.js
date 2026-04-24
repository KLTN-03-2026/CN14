const initialState = {
  isLogin: false,
  token: null
};

export const loginReducers = (state = initialState, actions) => {
  switch (actions.type) {
    case "CHECK_LOGIN":
      return {
        ...state,
        isLogin: true,
        token: actions.token
      };
    case "LOGOUT":
      return {
        ...state,
        isLogin: false,
        token: null
      };
    default:
      return state;
  }
}