import { useRef } from "react";
import { Carousel, Button } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const BrandSlider = ({ brands }) => {
  const navigate = useNavigate();
  const carouselRef = useRef(null);

  if (!brands || brands.length === 0) return null;

  // Lấy thương hiệu nổi bật (đầu tiên)
  const featuredBrand = brands[0];
  // Các thương hiệu còn lại
  const otherBrands = brands.slice(1);

  // Chia các brand thành nhóm 8 (mỗi slide 8 brand)
  const slides = [];
  for (let i = 0; i < otherBrands.length; i += 8) {
    slides.push(otherBrands.slice(i, i + 8));
  }

  const goToBrand = (id) => {
    navigate(`/danh-muc?danhmuc=ao&brand=${id}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-8">
      <div className="grid grid-cols-12 gap-4">
        {/* Bên trái: ảnh thương hiệu nổi bật */}
        <div
          className="col-span-4 cursor-pointer rounded-lg overflow-hidden relative group"
          onClick={() => goToBrand(featuredBrand._id)}
        >
          <img
            src={featuredBrand.thumbnail}
            alt={featuredBrand.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end justify-center p-2">
            <p className="text-white text-sm font-medium text-center">
              {featuredBrand.title}
            </p>
          </div>
        </div>

        {/* Bên phải: slider các thương hiệu */}
        <div className="col-span-8 relative">
          <Carousel dots={false} ref={carouselRef}>
            {slides.map((group, idx) => (
              <div key={idx}>
                <div className="grid grid-cols-4 gap-3">
                  {group.map((brand) => (
                    <div
                      key={brand._id}
                      onClick={() => goToBrand(brand._id)}
                      className="cursor-pointer rounded-lg overflow-hidden shadow-sm hover:shadow-md bg-white transition"
                    >
                      <div className="relative aspect-square">
                        <img
                          src={brand.thumbnail}
                          alt={brand.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end justify-center p-2">
                          <p className="text-white text-sm font-medium text-center">
                            {brand.title}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </Carousel>

          {/* Nút điều hướng */}
          <Button
            shape="circle"
            icon={<LeftOutlined />}
            className="absolute top-1/2 -left-3 transform -translate-y-1/2 z-10 bg-white shadow-md"
            onClick={() => carouselRef.current.prev()}
          />
          <Button
            shape="circle"
            icon={<RightOutlined />}
            className="absolute top-1/2 -right-3 transform -translate-y-1/2 z-10 bg-white shadow-md"
            onClick={() => carouselRef.current.next()}
          />
        </div>
      </div>
    </div>
  );
};

export default BrandSlider;
