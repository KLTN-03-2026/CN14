import { Card, Statistic } from "antd"
import { RiseOutlined, FallOutlined } from "@ant-design/icons"

function StatCard({ 
  title, 
  current, 
  last, 
  icon, 
  gradient 
}) {
  const diff = current - last
  const growth = last > 0 ? ((diff / last) * 100).toFixed(2) : 100
  const isUp = diff >= 0

  return (
    <Card
      style={{
        background: gradient,
        border: "none",
      }}
    >
      <Statistic
        title={
          <span style={{ color: "rgba(255,255,255,0.9)" }}>
            {title}
          </span>
        }
        value={current}
        valueStyle={{ color: "white", fontSize: "32px", fontWeight: "bold" }}
        prefix={icon}
        suffix={
          <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.9)" }}>
            {isUp ? <RiseOutlined /> : <FallOutlined />}
            {growth}%
          </div>
        }
      />
    </Card>
  )
}

export default StatCard
