import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Row,
  Col,
  Image,
  Typography,
  Button,
  InputNumber,
  Tag,
  Carousel,
  Radio,
  Space,
  Divider,
  Badge,
  Rate,
  message,
} from "antd";
import {
  HeartFilled,
  HeartOutlined,
  LeftOutlined,
  RightOutlined,
  ShoppingCartOutlined,
  TagOutlined
} from "@ant-design/icons";
import parse from "html-react-parser";
import ReviewProduct from "../ReviewProduct";
import ProductsRelated from "../../../components/Products-Related";
import { useCart } from "../../../hooks/client/useCart";
import useProducts from "../../../hooks/client/useProducts";
import useVouchers from "../../../hooks/client/useVouchers";
import { addViewed } from "../../../helpers/viewedProducts";
import { productFavorite } from "../../../services/client/productServies";
import { getCookie } from "../../../helpers/cookie";
import { addFavorite, removeFavorite } from "../../../helpers/favorites";

const { Title, Text } = Typography;

const tabs = [
  { id: "description", label: "MÔ TẢ" },
  // { id: "additional", label: "THÔNG TIN BỔ SUNG" },
  // { id: "size", label: "BẢNG KÍCH THƯỚC SẢN PHẨM" },
  // { id: "styling", label: "✨GỢI Ý PHỐI ĐỒ" },
];

function DetailProduct() {
  const params = useParams();
  const { add } = useCart();

  const navigate = useNavigate();

  const [product, setProduct] = useState({});
  const [quantity, setQuantity] = useState(1);
  const { productQuery } = useProducts({ slugProduct: params.slug });
  const [images, setImages] = useState([]);

  const carouselRef = useRef(null);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [productId, setProductId] = useState("");

  const [activeTab, setActiveTab] = useState("description");

  const { vouchersQuery } = useVouchers();
  const [copiedCode, setCopiedCode] = useState(null);

  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Handle windo w resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    console.log(productQuery.data);

    if (productQuery.data) {
      setProductId(productQuery.data._id);
      setProduct(productQuery.data);
      setImages(productQuery.data.images || []);

      //  Thêm vào đã xem
      addViewed(productQuery.data._id);
    }
  }, [productQuery.data]);

  const addCart = () => {
    const productAdd = {
      _id: product._id,
      title: product.title,
      price: product.price,
      discountPercentage: product.discountPercentage,
      quantity: quantity,
      thumbnail: product.thumbnail,
      slug: product.slug,
    };
    add(productAdd);
  };

  const handleChangeQuantity = (e) => {
    setQuantity(e);
  };

  const handlePrev = () => {
    carouselRef.current?.prev();
  };

  const handleNext = () => {
    carouselRef.current?.next();
  };

  const handleCopy = (code) => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        setCopiedCode(code);
        // Reset sau 2 giây
        setTimeout(() => setCopiedCode(null), 2000);
      })
      .catch(() => {
        alert("Không thể sao chép mã!");
      });
  };

  async function handleBuyNow() {
    const productAdd = {
      product_id: product._id,
      title: product.title,
      price: product.price,
      discountPercentage: product.discountPercentage,
      quantity: quantity,
      thumbnail: product.thumbnail,
      slug: product.slug,
    };

    localStorage.setItem("checkout-now", JSON.stringify([productAdd]));
    navigate("/order/info-checkout?mode=buynow");
  }

  const handleToggleFavorite = async () => {
    const tokenUser = getCookie("tokenUser");
    try {
      if (tokenUser) {
        const typeFavorite = isFavorite ? "unfavorite" : "favorite";
        const res = await productFavorite(typeFavorite, productId, tokenUser);
        if (res.code === 200) {
          setIsFavorite(prev => !prev);
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
    <div
      style={{
        padding: isMobile ? "16px" : "24px",
        backgroundColor: "#fff",
        minHeight: "100vh",
      }}
    >
      <Row gutter={[24, 24]} justify="center">
        {/* Hình ảnh sản phẩm */}
        <Col xs={24} md={12} lg={10}>
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: isMobile ? "100%" : 400,
              margin: "0 auto",
              borderRadius: 12,
              overflow: "hidden",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            <Carousel
              ref={carouselRef}
              dotPosition="bottom"
              autoplay={!isMobile}
              autoplaySpeed={3000}
              style={{ width: "100%" }}
            >
              {images.map((url, idx) => (
                <div key={idx}>
                  <Image
                    width="100%"
                    height={isMobile ? 300 : 400}
                    src={url || "/placeholder.svg"}
                    style={{
                      objectFit: "cover",
                      background: "#f5f5f5",
                      borderRadius: 12,
                    }}
                    preview={true}
                    placeholder={
                      <div
                        style={{
                          height: isMobile ? 300 : 400,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "#f5f5f5",
                        }}
                      >
                        Đang tải...
                      </div>
                    }
                  />
                </div>
              ))}
            </Carousel>

            {/* Navigation arrows - only show on desktop or when there are multiple images */}
            {images.length > 1 && !isMobile && (
              <>
                <LeftOutlined
                  onClick={handlePrev}
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: 12,
                    transform: "translateY(-50%)",
                    fontSize: 20,
                    color: "#fff",
                    background: "rgba(0,0,0,0.5)",
                    padding: 8,
                    borderRadius: "50%",
                    cursor: "pointer",
                    zIndex: 2,
                    transition: "all 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "rgba(0,0,0,0.7)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "rgba(0,0,0,0.5)";
                  }}
                />
                <RightOutlined
                  onClick={handleNext}
                  style={{
                    position: "absolute",
                    top: "50%",
                    right: 12,
                    transform: "translateY(-50%)",
                    fontSize: 20,
                    color: "#fff",
                    background: "rgba(0,0,0,0.5)",
                    padding: 8,
                    borderRadius: "50%",
                    cursor: "pointer",
                    zIndex: 2,
                    transition: "all 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "rgba(0,0,0,0.7)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "rgba(0,0,0,0.5)";
                  }}
                />
              </>
            )}
          </div>

          {/* Mobile image counter */}
          {isMobile && images.length > 1 && (
            <div style={{ textAlign: "center", marginTop: 8 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {images.length} hình ảnh
              </Text>
            </div>
          )}
        </Col>

        {/* Thông tin sản phẩm */}
        <Col xs={24} md={12} lg={14}>
          <div style={{ padding: isMobile ? 0 : "0 24px" }}>
            {/* Product Title */}

            <div className="flex items-start justify-between gap-3 mb-4">
              <Title
                level={isMobile ? 2 : 1}
                style={{
                  margin: 0,
                  fontSize: isMobile ? 24 : 32,
                  lineHeight: 1.3,
                  flex: 1,
                }}
              >
                {product.title}
              </Title>

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
                className="flex items-center justify-center bg-gray-100 hover:bg-red-50 hover:scale-110 transition-all duration-200 shadow-sm"
              />
            </div>

            {/* Rating & Sales */}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1 mb-2">
                <span className="font-semibold">{product.rating}</span>
                <div className="flex">
                  <Rate disabled value={product.rating} className="text-sm" />
                </div>
              </div>
              <span className="text-gray-600">
                ({product.reviews} đánh giá) || Đã bán {product.sold}
              </span>
            </div>

            {/* Category */}
            <div>
              <TagOutlined style={{ marginRight: 8, color: "#1890ff" }} />
              <Text type="secondary">Danh mục: </Text>
              {product.categoriesDetail && (
                <>
                  {product.categoriesDetail.map((category) => (
                    <a
                      href={`/danh-muc?danhmuc=${category.slug}`}
                      style={{ color: "#1890ff", fontWeight: 500 }}
                    >
                      {category.title}
                    </a>
                  ))}
                </>
              )}
            </div>

            {/* Price Section - Styled */}
            <div style={{ marginBottom: 24 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 12,
                  marginBottom: 8,
                }}
              >
                {product.discountPercentage > 0 && (
                  <>
                    <span
                      style={{
                        color: "#b0b0b0",
                        textDecoration: "line-through",
                        fontSize: isMobile ? 16 : 20,
                        fontWeight: 400,
                        marginRight: 8,
                      }}
                    >
                      {Number(product.price).toLocaleString()}đ
                    </span>
                  </>
                )}
                <span
                  style={{
                    color: "#ff4d4f",
                    fontSize: isMobile ? 24 : 32,
                    fontWeight: 700,
                    marginRight: 8,
                  }}
                >
                  {Number(product.newPrice).toLocaleString()}đ
                </span>
                {product.discountPercentage > 0 && (
                  <Badge
                    count={`-${product.discountPercentage}%`}
                    style={{
                      backgroundColor: "#ff4d4f",
                      fontSize: 14,
                      fontWeight: "bold",
                      borderRadius: 8,
                      boxShadow: "0 2px 8px rgba(255,77,79,0.15)",
                      padding: "0 8px",
                    }}
                  />
                )}
              </div>
              <div
                style={{
                  background: "#f6f8fa",
                  borderRadius: 8,
                  padding: "10px 8px",
                  fontSize: isMobile ? 13 : 15,
                  color: "#444",
                  marginBottom: 0,
                }}
              >
                {product.excerpt}

              </div>
            </div>

            {/* Quantity Selection */}
            <div style={{ marginBottom: 24 }}>
              <Space align="center" size={16}>
                <Text strong style={{ fontSize: 16 }}>
                  Số lượng:
                </Text>
                {product.stock > 0 ? (
                  <InputNumber
                    min={1}
                    max={product.stock || 1}
                    value={quantity}
                    onChange={handleChangeQuantity}
                    style={{
                      width: isMobile ? 100 : 120,
                    }}
                    size="large"
                  />
                ) : (
                  <Tag
                    color="#cd201f"
                    style={{ fontSize: 14, padding: "4px 12px" }}
                  >
                    Hết hàng
                  </Tag>
                )}
              </Space>
              {product.stock > 0 && (
                <div style={{ marginTop: 8 }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Còn lại {product.stock} sản phẩm
                  </Text>
                </div>
              )}
            </div>

            <Divider />

            {/* Action Buttons */}
            {product.stock > 0 ? (
              <Space
                direction={isMobile ? "vertical" : "horizontal"}
                size={12}
                style={{ width: "100%" }}
              >
                {product.status === "active" && product.deleted === false ? (
                  <>
                    <Button
                      size="large"
                      icon={<ShoppingCartOutlined />}
                      onClick={addCart}
                      style={{
                        height: 48,
                        width: isMobile ? "100%" : 200,
                        borderRadius: 8,
                        fontWeight: 500,
                        background: "#fff",
                        color: "#1890ff",
                        border: "2px solid #1890ff",
                        boxShadow: "0 2px 8px rgba(24,144,255,0.08)",
                      }}
                    >
                      THÊM VÀO GIỎ
                    </Button>
                    <Button
                      size="large"
                      icon={<ShoppingCartOutlined />}
                      onClick={handleBuyNow}
                      style={{
                        height: 48,
                        width: isMobile ? "100%" : 200,
                        borderRadius: 8,
                        fontWeight: 500,
                        background:
                          "linear-gradient(90deg, #FFC234 0%, #ff7a45 100%)",
                        color: "#fff",
                        border: "none",
                        boxShadow: "0 2px 8px rgba(255,77,79,0.12)",
                      }}
                    >
                      MUA HÀNG NGAY
                    </Button>
                  </>
                ) : (
                  <>
                    <Tag
                      color="#cd201f"
                      style={{ fontSize: 18, padding: "6px 6px" }}
                    >
                      Sản phẩm ngừng hoạt động!
                    </Tag>
                  </>
                )}
              </Space>
            ) : (
              <Button
                size="large"
                disabled
                style={{
                  height: 48,
                  width: "100%",
                  borderRadius: 8,
                }}
              >
                HẾT HÀNG
              </Button>
            )}
            {/* Vouchers */}
            <div className="border-t pt-6 mt-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-red-600 text-xl">✦</span>
                <h3 className="font-semibold">
                  Áp dụng ngay voucher cho đơn hàng
                </h3>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {vouchersQuery.data &&
                  vouchersQuery.data.map((voucher) => (
                    <div
                      key={voucher._id}
                      className="border border-red-200 rounded-lg p-3 text-center"
                    >
                      <div className="text-red-600 font-bold text-sm mb-1">
                        {voucher.voucher_code}
                      </div>
                      {voucher.discount_value > 100 ? (
                        <div className="text-xs text-gray-600">
                          Giảm:{" "}
                          {Number(voucher.discount_value).toLocaleString()}đ
                        </div>
                      ) : (
                        <div className="text-xs text-gray-600">
                          {" "}
                          Giảm: {voucher.discount_value}%
                        </div>
                      )}
                      <div className="text-xs text-gray-500">
                        Đơn tối thiểu:{" "}
                        {voucher.min_order_value.toLocaleString()}đ
                      </div>
                      <Button
                        onClick={() => handleCopy(voucher.voucher_code)}
                        className={`mt-2 w-full text-white text-xs py-1 rounded transition 
                          ${copiedCode === voucher.voucher_code
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-red-600 hover:bg-red-700"
                          }`}
                      >
                        {copiedCode === voucher.voucher_code
                          ? "ĐÃ SAO CHÉP"
                          : "SAO CHÉP MÃ"}
                      </Button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {/* Mô tả sản phẩm */}
      <div className=" mx-auto p-6 border-b border-gray-200 mb-6">
        {/* Tab Navigation */}
        <div className="flex w-full justify-center gap-2 border-b border-gray-200 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 text-sm font-medium transition-colors relative 
                  ${activeTab === tab.id
                  ? "text-white bg-gray-900 rounded-t-lg"
                  : "text-gray-600 hover:text-gray-900"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="py-4">
          {activeTab === "description" && (
            <div className="space-y-4">
              {parse(product.description || "<p></p>")}
            </div>
          )}
        </div>
      </div>

      {product.slugCategory && (
        <>
          {/* Related Products */}
          <ProductsRelated slug={product.slugCategory} />
        </>
      )}
      {/* Reviews Section */}
      {productId && <ReviewProduct key={productId} productId={productId} />}
    </div>
  );
}

export default DetailProduct;
