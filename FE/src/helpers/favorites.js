// KEY lưu trong localStorage
const FAVORITE_KEY = "favorites";

// Lấy danh sách yêu thích
export const getFavorites = () => {
  const favorites = localStorage.getItem(FAVORITE_KEY);
  return favorites ? JSON.parse(favorites) : [];
};

// Thêm sản phẩm vào favorites
export const addFavorite = (productId) => {
  const favorites = getFavorites();
  if (!favorites.includes(productId)) {
    favorites.push(productId);
    localStorage.setItem(FAVORITE_KEY, JSON.stringify(favorites));
  }
};

// Xóa sản phẩm khỏi favorites
export const removeFavorite = (productId) => {
  const favorites = getFavorites();
  const updated = favorites.filter((id) => id !== productId);
  localStorage.setItem(FAVORITE_KEY, JSON.stringify(updated));
};

// Kiểm tra 1 sản phẩm đã được yêu thích chưa
export const isFavorite = (productId) => {
  const favorites = getFavorites();
  return favorites.includes(productId);
};

// Xóa sản phẩm khỏi favorites
export const removeAllFavorite = () => {
  localStorage.setItem(FAVORITE_KEY, JSON.stringify([]));
};