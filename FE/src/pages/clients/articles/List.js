import { useState, useEffect, useCallback } from "react";
import { Typography } from "antd";
import {
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import "./article.scss";
import { listArticles } from "../../../services/client/articlesServies";

const { Title } = Typography;

export default function Article() {
  const [articles, setArticles] = useState([]);
  const itemsPerView = 4;
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalSlides = Math.max(0, articles.length - itemsPerView + 1);

  useEffect(() => {
    const fetchApi = async () => {
      const responseArticles = await listArticles();
      if (responseArticles.code === 200) {
        setArticles(responseArticles.data);
      }
    };
    fetchApi();
  }, []);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  }, [totalSlides]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  }, [totalSlides]);

  const goToSlide = useCallback((index) => {
    setCurrentIndex(index);
  }, []);

  const visibleArticles = articles.slice(currentIndex, currentIndex + itemsPerView);

  return (

    <div className="relative px-4 md:px-8">
      {/* Articles Grid */}
      <div className="flex items-center justify-center gap-4 md:gap-6">
        {/* Left Arrow */}
        <button
          onClick={goToPrevious}
          className="flex-shrink-0 p-2 rounded-full border border-gray-300 text-gray-600 hover:text-white hover:bg-gray-600 transition-colors shadow-sm"
          aria-label="Previous articles"
        >
          <LeftOutlined />
        </button>

        {/* Articles Container */}
        <div className="flex-1 flex gap-3 md:gap-4 overflow-hidden">
          {visibleArticles.map((article) => (
            <a key={article._id} href={`/articles/${article.slug}`} className="flex-shrink-0 w-1/4 group">
                <div className="flex flex-col h-full">
                  {/* Image */}
                  <div className="relative bg-gray-200 rounded-lg overflow-hidden mb-3">
                    <img
                      src={article.thumbnail || "/placeholder.svg"}
                      alt={article.title}
                      className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  {/* Title */}
                  <h3 className="text-sm md:text-base font-bold text-gray-900 leading-tight line-clamp-3 text-center">
                    {article.title}
                  </h3>
                </div>
              </a>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={goToNext}
          className="flex-shrink-0 p-2 rounded-full border border-gray-300 text-gray-600 hover:text-white hover:bg-gray-600 transition-colors shadow-sm"
          aria-label="Next articles"
        >
          <RightOutlined />
        </button>
      </div>

      {/* Pagination Dots */}
      {totalSlides > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all ${index === currentIndex
                ? "bg-gray-500 w-6"
                : "bg-gray-300 w-2 hover:bg-gray-400"
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}


// export default function Article() {

//   const [articles, setArticles] = useState([]);

//   useEffect(() => {

//     const fetchApi = async () => {
//       const responseArticles = await listArticles();
//       if (responseArticles.code === 200) {
//         setArticles(responseArticles.data);
//       }
//     }

//     fetchApi();

//   }, []);

//   return (
//     <div className="blog-slide-container" >
//       <div className="blog-header">
//         <Title level={2} className="blog-title">
//           TỪ BLOG CỦA CHÚNG TÔI
//         </Title>
//       </div>

//       <Row gutter={[24, 24]} className="blog-grid">
//         {articles.length > 0 && (
//           <>
//             {articles.map((art) => (
//               <Col xs={24} sm={12} lg={8} key={art._id}>
//                 <Card
//                   hoverable
//                   className="blog-card"
//                   cover={
//                     <div className="blog-card-image">
//                       <img
//                         alt={art.title}
//                         src={art.thumbnail || "/placeholder.svg"}
//                         style={{ width: "100%", height: "200px", objectFit: "cover" }}
//                       />
//                     </div>
//                   }
//                 >
//                   <div className="blog-card-content">
//                     <Text className="blog-author">Posted by {art.author}</Text>
//                     <a href={`/articles/${art.slug}`} target="_blank" rel="noopener noreferrer">
//                       <Title level={4} className="blog-card-title">
//                         {art.title}
//                       </Title>
//                     </a>
//                     <Paragraph className="blog-card-description">{art.excerpt}</Paragraph>
//                   </div>
//                 </Card>
//               </Col>
//             ))}
//           </>
//         )}
//       </Row>
//     </div>
//   )
// }