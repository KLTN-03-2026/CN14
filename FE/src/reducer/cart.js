
const initialState = {
  lengthCart: 0, // Giá trị mặc định của số lượng sản phẩm
};

export const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case "UPDATE_CART_LENGTH":
      return {
        ...state,
        lengthCart: action.payload, // Cập nhật số lượng sản phẩm
      };
    default:
      return state;
  }
};

