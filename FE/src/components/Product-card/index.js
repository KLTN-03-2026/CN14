import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Card, Typography, Rate, Button, message, Tag } from "antd";
import {
  HeartFilled,
  HeartOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import {
  addFavorite,
  getFavorites,
  removeFavorite,
} from "../../helpers/favorites";
import { getCookie } from "../../helpers/cookie";
import { productFavorite } from "../../services/client/productServies";

const { Text, Title } = Typography;

export default function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    setIsFavorite(getFavorites().includes(product._id));
  }, [product._id]);

  const discountedPrice = product.discountPercentage
    ? product.price * (1 - product.discountPercentage / 100)
    : product.price;

  const handleToggleFavorite = async () => {
    const tokenUser = getCookie("tokenUser");
    try {
      if (tokenUser) {
        const typeFavorite = isFavorite ? "unfavorite" : "favorite";
        const res = await productFavorite(typeFavorite, product._id, tokenUser);
        if (res.code === 200) {
          setIsFavorite(!isFavorite);
          addFavorite(product._id);
          message.success(res.message);
        } else if (res.code === 201) {
          setIsFavorite(!isFavorite);
          removeFavorite(product._id);
          message.success(res.message);
        } else {
          message.error(res.message);
        }
      } else {
        message.error("Vui lòng đăng nhập để thêm sản phẩm yêu thích");
      }
    } catch (err) {
      message.error(err);
    }
  };

  return (
    <div className="group relative h-full">
      <Card
        hoverable
        className="h-full border-0 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        cover={
          <div className="relative overflow-hidden aspect-square bg-gray-50">
            {/* Discount Badge */}
            {product.discountPercentage > 0 && (
              <div className="absolute top-3 left-3 z-10">
                <Tag
                  color="red"
                  className="text-sm font-semibold px-3 py-1 rounded-full border-0 shadow-md"
                >
                  -{product.discountPercentage}%
                </Tag>
              </div>
            )}

            {/* Favorite Button */}
            <Button
              type="text"
              shape="circle"
              size="large"
              icon={
                isFavorite ? (
                  <HeartFilled className="text-xl text-red-500" />
                ) : (
                  <HeartOutlined className="text-xl text-gray-600" />
                )
              }
              onClick={handleToggleFavorite}
              className={`absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-sm hover:bg-white shadow-md transition-all duration-300 ${isHovered
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-2"
                }`}
            />

            {/* Product Image */}
            <NavLink to={`/detail/${product.slug}`}>
              <img
                alt={product.title}
                src={
                  product.thumbnail ||
                  "https://via.placeholder.com/400x400?text=Product" ||
                  "/placeholder.svg"
                }
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </NavLink>

            {/* Hover Overlay */}
            <div
              className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end justify-center pb-6 transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"
                }`}
            >
              <NavLink to={`/detail/${product.slug}`}>
                <Button
                  type="primary"
                  size="large"
                  icon={<ShoppingCartOutlined />}
                  className="bg-white text-gray-900 hover:bg-gray-100 border-0 font-semibold px-8 rounded-full shadow-lg"
                >
                  Xem chi tiết
                </Button>
              </NavLink>
            </div>

            {/* Stock Badge */}
            {product.stock < 50 && product.stock > 0 && (
              <div className="absolute bottom-3 left-3 z-10">
                <Tag
                  color="orange"
                  className="text-xs font-medium px-2 py-1 rounded-md border-0"
                >
                  Chỉ còn {product.stock} sản phẩm
                </Tag>
              </div>
            )}

            {product.stock === 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                <Tag
                  color="default"
                  className="text-base font-semibold px-4 py-2 rounded-lg"
                >
                  Hết hàng
                </Tag>
              </div>
            )}
          </div>
        }
      >
        {/* Product Info */}
        <div className="space-y-3">
          {/* Brand & Category */}
          <div className="flex items-center gap-2 flex-wrap">
            {product.brand_id && (
              <Tag color="blue" className="text-xs font-medium m-0 rounded-md">
                {product.brand_id.title}
              </Tag>
            )}
            {product.categories && (
              <>
                {product.categories.slice(0, 2).map((cat) => (
                  <Tag
                    color="geekblue"
                    className="text-xs font-medium m-0 rounded-md"
                  >
                    {cat.title}
                  </Tag>
                ))}
              </>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <Rate disabled value={product.rating} className="text-sm" />
            <Text type="secondary" className="text-xs">
              ({product.reviews} đánh giá)
            </Text>
          </div>

          {/* Product Title */}
          <NavLink to={`/detail/${product.slug}`}>
            <Title
              level={5}
              className="!mb-0 !text-sm !font-semibold line-clamp-2 hover:text-blue-600 transition-colors duration-200 min-h-[40px]"
            >
              {product.title}
            </Title>
          </NavLink>

          {/* Price Section */}
          <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
            {product.discountPercentage > 0 ? (
              <div className="flex items-baseline gap-2 flex-wrap">
                <Text className="text-xl font-bold text-red-600">
                  {discountedPrice.toLocaleString()} đ
                </Text>
                <Text delete type="secondary" className="text-sm">
                  {product.price.toLocaleString()} đ
                </Text>
              </div>
            ) : (
              <Text className="text-xl font-bold text-gray-900">
                {product.price.toLocaleString()} đ
              </Text>
            )}
          </div>

          {/* Size Stock Info */}
          {product.sizeStock && product.sizeStock.length > 0 && (
            <div className="flex items-center gap-1 flex-wrap pt-2">
              <Text type="secondary" className="text-xs mr-1">
                Size:
              </Text>
              {product.sizeStock.slice(0, 4).map((sizeInfo, index) => {
                const [size] = sizeInfo.split("-");
                return (
                  <Tag key={index} className="text-xs m-0 rounded-md">
                    {size}
                  </Tag>
                );
              })}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
