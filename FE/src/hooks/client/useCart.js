import { useDispatch } from 'react-redux'
import { addCartPatch, delCartPatch, updateCartPatch } from "../../services/client/cartServies"
import { updateCartLength } from "../../actions/cart"
import { message } from 'antd'
import { getCookie } from '../../helpers/cookie'
import { addToCart, removeFromCart, updateCartItem, getCart } from '../../helpers/cartStorage'

export function useCart() {
  const dispatch = useDispatch()
  const tokenUser = getCookie("tokenUser");

  // Hàm thêm sản phẩm
  const add = async (product) => {
    const { _id, quantity } = product

    if (tokenUser) {
      // ✅ Khi user đã login
      try {
        const resAddToCart = await addCartPatch(_id, {
          quantity,
        }, tokenUser);

        if (resAddToCart.code === 200) {
          const newLength = resAddToCart.totalQuantity
          dispatch(updateCartLength(newLength))
          message.success("Thêm vào giỏ hàng thành công!")
        } else {
          message.error("Thêm vào giỏ hàng thất bại")
        }
      } catch (error) {
        message.error("Có lỗi xảy ra, vui lòng thử lại")
      }
    } else {
      // ✅ Khi chưa login → dùng localStorage
      addToCart(product);
      const newLength = getCart().reduce((sum, item) => sum + item.quantity, 0);
      dispatch(updateCartLength(newLength));
      message.success("Thêm vào giỏ hàng thành công!");
    }
  }

  const update = async (productId, quantity) => {

    if (tokenUser) {
      // ✅ Khi user đã login
      const resUpdateToCart = await updateCartPatch(productId, {
        quantity,
      }, tokenUser);

      if (resUpdateToCart.code === 200) {
        dispatch(updateCartLength(resUpdateToCart.totalQuantity));
        message.success(resUpdateToCart.message);
        return 1;
      } else {
        message.error(resUpdateToCart.message);
        return 0;
      }
    } else {
      // ✅ Khi chưa login
      updateCartItem(productId, quantity);
      const newLength = getCart().reduce((sum, item) => sum + item.quantity, 0);
      dispatch(updateCartLength(newLength));
      message.success("Cập nhật giỏ hàng thành công!");
      return 1;
    }
  }

  const remove = async (productId) => {

    if (tokenUser) {
      // ✅ Khi user đã login
      const response = await delCartPatch(productId, tokenUser)
      if (response.code === 200) {
        dispatch(updateCartLength(response.totalQuantity));
        message.success(response.message);
        return 1;
      } else {
        message.error(response.message);
        return 0;
      }
    } else {
      // ✅ Khi chưa login
      removeFromCart(productId);
      const newLength = getCart().reduce((sum, item) => sum + item.quantity, 0);
      dispatch(updateCartLength(newLength));
      message.success("Xóa sản phẩm thành công!!");
      return 1;
    }
  }

  return { add, update, remove }
}
