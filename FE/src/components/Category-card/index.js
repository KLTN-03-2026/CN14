import { Link } from 'react-router-dom';
import { Card, Typography } from "antd"

const { Text, Title } = Typography

export default function CategoryCard({ name, image, itemCount, slug }) {
  return (
    <Link to={`/danh-muc?danhmuc=${slug}`}>
      <Card
        hoverable
        cover={
          <div style={{ position: "relative", height: "200px", overflow: "hidden" }}>
            <img
              alt={name}
              src={image || "/placeholder.svg"}
              style={{ width: "100%", height: "auto", objectFit: "cover" }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
                padding: "16px",
              }}
            >
              <Title level={5} style={{ color: "white", margin: 0 }}>
                {name}
              </Title>
              <Text style={{ color: "rgba(255, 255, 255, 0.85)" }}>{itemCount} sản phẩm</Text>
            </div>
          </div>
        }
        bodyStyle={{ display: "none" }}
      />
    </Link>
  )
}
