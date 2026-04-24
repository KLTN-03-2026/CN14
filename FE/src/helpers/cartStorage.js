// KEY lưu trong localStorage
const CART_KEY = "cart_items";

// Lấy danh sách sản phẩm trong giỏ
export const getCart = () => {
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
};

// Lưu giỏ hàng
const saveCart = (cart) => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

// Thêm sản phẩm vào giỏ
export const addToCart = (product) => {
  const cart = getCart();

  const index = cart.findIndex(
    (item) => item.product_id === product._id && item.size === product.size
  );

  if (index > -1) {
    // Nếu đã tồn tại (same _id + size) → cộng thêm quantity
    cart[index].quantity += product.quantity;
  } else {
    // Nếu chưa có thì push mới
    cart.push({
      product_id: product._id,
      title: product.title,
      price: product.price,
      discountPercentage: product.discountPercentage || 0,
      size: product.size || null,
      quantity: product.quantity,
      thumbnail: product.thumbnail,
      slug: product.slug
    });
  }

  saveCart(cart);
};

// Cập nhật số lượng sản phẩm
export const updateCartItem = (_id, size, quantity) => {
  const cart = getCart();
  const index = cart.findIndex(
    (item) => item.product_id === _id && item.size === size
  );

  if (index > -1) {
    if (quantity <= 0) {
      // Nếu số lượng <= 0 thì xóa luôn
      cart.splice(index, 1);
    } else {
      cart[index].quantity = quantity;
    }
    saveCart(cart);
  }
};

// Xóa sản phẩm khỏi giỏ
export const removeFromCart = (_id, size) => {
  const cart = getCart();
  const updated = cart.filter((item) => !(item.product_id === _id && item.size === size));
  saveCart(updated);
};

// Kiểm tra sản phẩm có trong giỏ chưa
export const isInCart = (_id, size) => {
  const cart = getCart();
  return cart.some((item) => item.product_id === _id && item.size === size);
};

// Xóa toàn bộ giỏ hàng
export const clearCart = () => {
  localStorage.setItem(CART_KEY, JSON.stringify([]));
};

// Tính tổng tiền giỏ hàng (có tính giảm giá)
export const getCartTotal = () => {
  const cart = getCart();
  return cart.reduce((total, item) => {
    const discount = item.discountPercentage
      ? (item.price * item.discountPercentage) / 100
      : 0;
    const finalPrice = item.price - discount;
    return total + finalPrice * item.quantity;
  }, 0);
};
