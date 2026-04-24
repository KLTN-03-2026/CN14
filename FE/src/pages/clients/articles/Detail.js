import { Row, Col, Typography, List } from "antd"
import { CalendarOutlined, UserOutlined } from "@ant-design/icons"
import { useParams } from "react-router-dom";
import parse from 'html-react-parser';
import "./ArticleDetail.scss"
import { useEffect } from "react";
import { detailArticle, listArticles } from "../../../services/client/articlesServies";
import { useState } from "react";
import dayjs from 'dayjs';

const { Title, Text } = Typography

const ArticleDetail = () => {

  const params = useParams();
  const [slug, setSlug] = useState(params.slug || "");

  const [article, setArticle] = useState({});
  const [recentArticles, setRecentArticles] = useState([]);

  useEffect(() => {
    const fetchArticle = async () => {
      const response = await detailArticle(slug);
      
      if (response.code === 200) {
        setArticle(response.data);
      }

      const responseArticles = await listArticles();
      if (responseArticles.code === 200) {
        setRecentArticles(responseArticles.data);
      }
    }
    fetchArticle();
  }, [slug])
  
  return (
    <div className="blog-detail-container">
      <Row gutter={[32, 32]}>
        {/* Main Content */}
        <Col xs={24} lg={16}>
          <div className="blog-main-content">
            {/* Hero Image */}
            <div className="blog-hero-image">
              <img
                src={article.thumbnail || "/placeholder.svg"}
                alt="Blog hero"
                style={{ width: "100%", height: "400px", objectFit: "cover", borderRadius: "8px" }}
              />
            </div>

            {/* Blog Header */}
            <div className="blog-header">
              <Title level={1} className="blog-title">
                {article.title}
              </Title>
              <div className="blog-meta">
                <Text className="blog-author">
                  <UserOutlined /> Tác giả: {article.author}
                </Text>
                <Text className="blog-date">
                  <CalendarOutlined /> {dayjs(article.createdAt).format('DD/MM/YYYY')}
                </Text>
              </div>
            </div>

            {/* Article Content */}
            <div className="blog-content">
              {parse(article.description || "<p>No content available</p>")}
            </div>
          </div>
        </Col>

        {/* Sidebar */}
        <Col xs={24} lg={8}>
          <div className="blog-sidebar">
            {/* Recent Posts */}
            <h3>Bài viết khác</h3>
            <List
              dataSource={recentArticles?.slice(0, 5) || []}
              renderItem={(item) => (
                <List.Item className="recent-post-item">
                  <div className="recent-post-content">
                    <div className="recent-post-image">
                      <img src={item.thumbnail || "/placeholder.svg"} alt={item.title} />
                    </div>
                    <div className="recent-post-info">
                      <Title level={5} className="recent-post-title" onClick={() => { setSlug(item.slug) }}>
                        {item.title}
                      </Title>
                      <Text className="recent-post-date">
                        <CalendarOutlined /> {dayjs(item.createdAt).format('DD/MM/YYYY')}
                      </Text>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </div>
          <div className="lg:col-span-2">
            <h3 className="font-bold text-sm mb-4 uppercase">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {article.categories.map((item, index) => (
                <a
                  key={index}
                  href={`/danh-muc?danhmuc=${item.slug}`}
                  className="px-3 py-1 bg-white border border-gray-300 rounded text-xs hover:border-green-700 hover:text-green-700"
                >
                  {item.title}
                </a>
              ))}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default ArticleDetail
