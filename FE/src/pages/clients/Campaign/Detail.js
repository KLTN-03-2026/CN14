import {
  TagOutlined,
  ClockCircleOutlined,
  RightOutlined,
  LeftOutlined,
} from "@ant-design/icons"
import { Button, Card, Carousel } from "antd"
import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { detailCampiagn } from "../../../services/client/campaignServices";
import { useRef } from "react";
import dayjs from "dayjs";
import ListProduct from "../../../components/ListProduct";


export default function DetailCampaign() {
  const params = useParams();
  const [slug, setSlug] = useState(params.slug || "")
  const [campaign, setCampaign] = useState(null);
  const [products, setProducts] = useState([])
  const [brands, setBrands] = useState([])
  const [categories, setCategories] = useState([])
  const carouselRef = useRef(null)

  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [expired, setExpired] = useState(false);

  useEffect(() => {

    const fetchApi = async () => {
      const response = await detailCampiagn(slug);
      if (response.code === 200) {
        setCampaign(response.data.campaign);
        setProducts(response.data.products);
        setBrands(response.data.brands);
        setCategories(response.data.categories);

        const endTime = dayjs(response.data.campaign.end_date);

        const timer = setInterval(() => {
          const now = dayjs();
          const diff = endTime.diff(now, "second");

          if (diff <= 0) {
            clearInterval(timer);
            setExpired(true);
            return;
          }

          const hours = Math.floor(diff / 3600);
          const minutes = Math.floor((diff % 3600) / 60);
          const seconds = diff % 60;

          setTimeLeft({ hours, minutes, seconds });
        }, 1000);

        return () => clearInterval(timer);
      }
    }
    fetchApi()

  }, [slug]);

  const nextSlide = () => {
    carouselRef.current?.next()
  }

  const prevSlide = () => {
    carouselRef.current?.prev()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-purple-50">

      {/* FLASH SALE TIMELINE */}
      <div className="bg-[#F1F1F5] text-orange-500 py-2">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-3 overflow-x-auto">
          <TagOutlined className="text-xl text-orange-500" />
          <span className="text-xl font-bold">FLASH DEAL</span>
          <span className="text-gray-700 flex items-center gap-1">
            <ClockCircleOutlined />
            {expired ? (
              <span className="text-red-500 font-medium">Đã kết thúc</span>
            ) : (
              <>
                Kết thúc trong{" "}
                <span className="flex items-center gap-1">
                  <span className="bg-black text-white px-2 py-0.5 rounded-md text-sm font-mono">
                    {String(timeLeft.hours).padStart(2, "0")}
                  </span>
                  :
                  <span className="bg-black text-white px-2 py-0.5 rounded-md text-sm font-mono">
                    {String(timeLeft.minutes).padStart(2, "0")}
                  </span>
                  :
                  <span className="bg-black text-white px-2 py-0.5 rounded-md text-sm font-mono">
                    {String(timeLeft.seconds).padStart(2, "0")}
                  </span>
                  Giờ
                </span>
              </>
            )}
          </span>
        </div>
      </div>

      <div className="bg-white" style={{ position: "relative", overflow: "hidden", marginBottom: "20px" }}>
        <Carousel
          ref={carouselRef}
          autoplay
          autoplaySpeed={4000}
          dots={true}
          infinite={true}
          speed={500}
          slidesToShow={1}
          slidesToScroll={1}
          dotPosition="bottom"
        >
          {campaign && campaign.images.map((image, index) => (
            <div key={index}>
              <img
                src={image}
                alt={campaign.title}
                style={{
                  maxWidth: "100%",
                  width: "auto",
                  height: "400px",
                  objectFit: "cover",
                  borderRadius: "12px",
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
                }}
              />
            </div>
          ))}
        </Carousel>

        {/* Custom Navigation Arrows */}
        <Button
          type="text"
          icon={<LeftOutlined />}
          onClick={prevSlide}
          style={{
            position: "absolute",
            left: "20px",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 10,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            border: "none",
            borderRadius: "50%",
            width: "48px",
            height: "48px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          }}
        />
        <Button
          type="text"
          icon={<RightOutlined />}
          onClick={nextSlide}
          style={{
            position: "absolute",
            right: "20px",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 10,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            border: "none",
            borderRadius: "50%",
            width: "48px",
            height: "48px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          }}
        />
      </div>

      {/* CATEGORY GRID */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Danh mục ưu đãi
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, i) => (
            <Card
              key={i}
              className="p-0 text-center hover:shadow-lg transition-all cursor-pointer hover:-translate-y-1 border-2 overflow-hidden"
              bodyStyle={{ padding: 0 }}
            >
              <div className="w-full aspect-square">
                <img
                  src={cat.thumbnail}
                  alt={cat.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="py-3 bg-white">
                <p className="font-semibold text-gray-700">{cat.title}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* CATEGORY GRID */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Thương hiệu ưu đãi
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {brands.map((brand, i) => (
            <Card
              key={i}
              className="p-0 text-center hover:shadow-lg transition-all cursor-pointer hover:-translate-y-1 border-2 overflow-hidden"
              bodyStyle={{ padding: 0 }}
            >
              <div className="w-full aspect-square">
                <img
                  src={brand.thumbnail}
                  alt={brand.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="py-3 bg-white">
                <p className="font-semibold text-gray-700">{brand.title}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
      <h2 className="text-3xl font-bold text-gray-800">Ưu đãi hot nhất</h2>
      <ListProduct
        products={products || []}
        count={24}
      />

    </div>
  )
}
