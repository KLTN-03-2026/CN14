import { useRef } from "react";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import CategoryCard from "../Category-card";

export default function CategorySlider({ categories }) {
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 500;
      const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === "left" ? -scrollAmount : scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };
  return (
    <div className="w-full bg-white shadow-sm p-4 mb-4">
      <div className="relative group">
        {/* Left Arrow */}
        <button onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full w-10 h-10 flex items-center 
        justify-center hover:bg-gray-100 transition-all opacity-0 group-hover:opacity-100" a
          ria-label="Previous" >
          <LeftOutlined className="text-gray-600" />
        </button>

        {/* Products Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.map((category, i) => (
            <div
              className="flex-shrink-0 w-[180px] bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
              key={category._id}>
              <CategoryCard name={category.title} image={category.thumbnail}
                itemCount={category.totalProducts} slug={category.slug} />
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full w-10 h-10 flex items-center 
          justify-center hover:bg-gray-100 transition-all opacity-0 group-hover:opacity-100"
          aria-label="Next" > <RightOutlined className="text-gray-600" />
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
