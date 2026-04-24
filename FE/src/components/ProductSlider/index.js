import { useRef } from "react";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useEffect } from "react";

export default function ProductSlider({ products, title }) {
  const scrollContainerRef = useRef(null);
  const scrollIntervalRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const container = scrollContainerRef.current;

      let newScrollLeft =
        container.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount);

      // Nếu đến cuối thì quay lại đầu
      if (
        direction === "right" &&
        newScrollLeft >= container.scrollWidth - container.clientWidth
      ) {
        newScrollLeft = 0;
      }

      container.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  // 🕒 Tự động scroll mỗi 3 giây
  useEffect(() => {
    const interval = setInterval(() => {
      scroll("right");
    }, 3000); // 3s mỗi lần cuộn
    return () => clearInterval(interval);
  }, []);

  const startAutoScroll = (direction) => {
    // Khi nhấn giữ
    if (!scrollIntervalRef.current) {
      scrollIntervalRef.current = setInterval(() => {
        scroll(direction);
      }, 10); // cuộn mỗi 20ms → mượt
    }
  };

  const stopAutoScroll = () => {
    // Khi thả chuột hoặc rời khỏi nút
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
  };

  return (
    <div className="w-full bg-white shadow-sm p-4 mb-4">
      <h2 className="text-2xl font-bold mb-6 text-[#2D7A5E]">{title}</h2>

      <div className="relative group">
        {/* Left Arrow */}
        <button
          onMouseDown={() => startAutoScroll("left")}
          onMouseUp={stopAutoScroll}
          onMouseLeave={stopAutoScroll}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-all opacity-0 group-hover:opacity-100"
          aria-label="Previous"
        >
          <LeftOutlined className="text-gray-600" />
        </button>

        {/* Products Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products.map((product) => (
            <Link
              key={product._id}
              to={`/detail/${product.slug}`}
              className="flex-shrink-0 w-[180px] bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="aspect-square mb-3 flex items-center justify-center">
                <img
                  src={product.thumbnail || "/placeholder.svg"}
                  alt={product.title}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-sm text-gray-500 mb-1">
                {product.sold} đã bán
              </div>
              <div className="font-medium text-gray-800 line-clamp-2">
                {product.title}
              </div>
            </Link>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onMouseDown={() => startAutoScroll("right")}
          onMouseUp={stopAutoScroll}
          onMouseLeave={stopAutoScroll}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-all opacity-0 group-hover:opacity-100"
          aria-label="Next"
        >
          <RightOutlined className="text-gray-600" />
        </button>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
