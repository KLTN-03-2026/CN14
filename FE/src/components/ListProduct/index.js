import "./SlideProducts.scss";
import { Typography, Row, Col, Button } from "antd";
import ProductCard from "./../../components/Product-card";
import { useMemo, useState } from "react";

const { Title } = Typography;

function ListProduct(props) {
  const { products, count, title } = props;
  const [visibleCount, setVisibleCount] = useState(count || 8);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 8);
      setIsLoading(false);
    }, 500);
  };

  const visibleProducts = useMemo(() => {
    return Array.isArray(products) ? products.slice(0, visibleCount) : [];
  }, [products, visibleCount]);

  const hasMoreProducts = visibleCount < products.length;

  return (
    <>
      <div className="w-full bg-white shadow-sm p-4 mb-4">
        <h2 className="text-2xl font-bold mb-6 text-[#2D7A5E]">{title}</h2>
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Main Content */}
          <div className="flex-1">
            {/* Products Grid */}
            {visibleProducts.length > 0 ? (
              <>
                <Row gutter={[16, 16]} className="mb-2">
                  {visibleProducts.map((product, index) => (
                    <Col
                      key={product._id || index}
                      xs={24}
                      sm={12}
                      lg={6}
                      xl={6}
                    >
                      <ProductCard product={product} />
                    </Col>
                  ))}
                </Row>

                {/* Load More Button */}
                {hasMoreProducts && (
                  <div className="text-center mb-8">
                    <Button
                      type="primary"
                      size="small"
                      loading={isLoading}
                      onClick={handleLoadMore}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0 px-8 py-2 h-auto text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {isLoading ? "Đang tải..." : `Xem thêm`}
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20 bg-white rounded-lg shadow-sm mb-8">
                <div className="mb-6">
                  <svg
                    className="mx-auto h-24 w-24 text-gray-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.5-.816-6.208-2.18C3.926 11.46 3 9.81 3 8c0-3.866 3.582-7 8-7s8 3.134 8 7c0 1.81-.926 3.46-2.792 4.82A7.962 7.962 0 0112 15z"
                    />
                  </svg>
                </div>
                <Title level={3} className="text-gray-400 mb-4">
                  Không tìm thấy sản phẩm
                </Title>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .ant-slider-rail {
          background-color: #f1f5f9;
        }
        
        .ant-slider-track {
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
        }
        
        .ant-slider-handle {
          border-color: #3b82f6;
        }
        
        .ant-slider-handle:hover {
          border-color: #2563eb;
        }
        
        .ant-checkbox-wrapper {
          display: flex;
          align-items: center;
          padding: 4px 0;
        }
        
        .ant-radio-wrapper {
          display: flex;
          align-items: center;
          padding: 4px 0;
        }
        
        .ant-card {
          border-radius: 12px;
        }
        
        .ant-divider {
          margin: 16px 0;
        }
        
        .product-card:hover {
          transform: translateY(-4px);
          transition: all 0.3s ease;
        }

        @media (max-width: 1024px) {
          .sticky {
            position: relative !important;
            top: auto !important;
          }
        }
      `}</style>
    </>
  );
}

export default ListProduct;
