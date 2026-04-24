// KEY lưu trong localStorage
const VIEWED_KEY = "viewedProducts";
const EXPIRY_DAYS = 7; // Thời gian hết hạn 7 ngày

// Hàm lấy dữ liệu từ localStorage
export const getViewedProducts = () => {
  const data = localStorage.getItem(VIEWED_KEY);
  if (!data) return [];

  try {
    const parsed = JSON.parse(data);
    const now = Date.now();

    // Nếu hết hạn thì xóa
    if (parsed.expiry && now > parsed.expiry) {
      localStorage.removeItem(VIEWED_KEY);
      return [];
    }

    return parsed.items || [];
  } catch (error) {
    console.error("Lỗi khi parse viewedProducts:", error);
    localStorage.removeItem(VIEWED_KEY);
    return [];
  }
};

// Hàm thêm sản phẩm
export const addViewed = (productId) => {
  const existing = getViewedProducts();

  // Nếu sản phẩm chưa có trong danh sách
  if (!existing.includes(productId)) {
    existing.push(productId);

    const expiry = Date.now() + EXPIRY_DAYS * 24 * 60 * 60 * 1000; // thời gian hết hạn (7 ngày)

    localStorage.setItem(
      VIEWED_KEY,
      JSON.stringify({
        items: existing,
        expiry: expiry,
      })
    );
  }
};

// Kiểm tra sản phẩm đã xem chưa
export const isViewed = (productId) => {
  const vieweds = getViewedProducts();
  return vieweds.includes(productId);
};

// Xóa tất cả sản phẩm đã xem
export const removeAllViewed = () => {
  localStorage.removeItem(VIEWED_KEY);
};
