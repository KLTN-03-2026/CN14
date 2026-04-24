const initialState = {
  status: false // Giá trị mặc định của số lượng sản phẩm
};

export const loginUserReducers = (state = initialState, actions) => {
  switch (actions.type) {
    case "CHECK_LOGIN_USER":
      return actions.status;

    default:
      return state;
  }
}