import { Typography } from 'antd';
const { Title } = Typography;

function NoRole() {

  return (
    <>
      <Title level={2} type='danger' style={{ textAlign: "center", margin: "100px 0" }}>
        BẠN ĐANG CỐ TRUY CẬP VÀO MỤC BẠN KHÔNG CÓ QUYỀN HẠN?
      </Title>
    </>
  )
}

export default NoRole;