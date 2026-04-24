import { Typography } from "antd";

const { Title, Paragraph } = Typography;

function Packaging() {
  return (
    <div className="max-w-4xl mx-auto">
      <Typography>
        <Title level={3}>Quy cách đóng gói hàng hóa tại Hasaki.vn</Title>

        <Paragraph>
          Hasaki luôn cam kết mang đến cho Quý khách hàng trải nghiệm mua sắm tốt nhất,
          vì vậy công tác đóng gói hàng hóa được thực hiện cẩn thận,
          đảm bảo an toàn trong suốt quá trình vận chuyển.
        </Paragraph>

        <Title level={4}>1. Nguyên tắc chung khi đóng gói</Title>
        <ul className="list-disc ml-6 text-gray-700">
          <li>Tất cả sản phẩm đều được kiểm tra kỹ trước khi đóng gói.</li>
          <li>Hàng hóa được bọc bằng <strong>túi chống sốc</strong>, <strong>giấy đệm</strong>, hoặc <strong>màng xốp</strong> để hạn chế va đập.</li>
          <li>Với sản phẩm dễ vỡ (như chai lọ thủy tinh, mỹ phẩm dạng lỏng…), Hasaki sử dụng thêm lớp <strong>chống vỡ chuyên dụng</strong>.</li>
          <li>Đơn hàng sau khi đóng gói sẽ được <strong>niêm phong bằng tem Hasaki.vn</strong> để đảm bảo tính nguyên vẹn.</li>
        </ul>

        <Title level={4} className="mt-6">2. Quy cách đóng gói theo loại sản phẩm</Title>
        <ul className="list-disc ml-6 text-gray-700">
          <li><strong>Mỹ phẩm – Chăm sóc da:</strong> Đóng trong hộp carton cứng, có lớp đệm xốp bao quanh sản phẩm.</li>
          <li><strong>Dụng cụ làm đẹp:</strong> Dán tem niêm phong từng hộp, quấn màng co bảo vệ.</li>
          <li><strong>Thực phẩm chức năng:</strong> Đóng hộp riêng, kèm túi hút ẩm hoặc màng chống ẩm.</li>
        </ul>

        <Title level={4} className="mt-6">3. Kiểm tra khi nhận hàng</Title>
        <Paragraph>
          Khi nhận hàng, quý khách vui lòng <strong>kiểm tra kỹ bao bì, tem niêm phong và tình trạng sản phẩm</strong> trước khi ký nhận.
          Nếu phát hiện có dấu hiệu rách, móp, hoặc hàng hóa bị ướt, xin vui lòng
          <strong> từ chối nhận hàng</strong> và liên hệ <strong>Hotline 1800 6324</strong> để được hỗ trợ.
        </Paragraph>

        <Title level={4} className="mt-6">4. Mục tiêu của Hasaki</Title>
        <Paragraph>
          Đảm bảo 100% hàng hóa được giao đến tay khách hàng trong tình trạng
          <strong> nguyên vẹn, sạch sẽ và đúng sản phẩm đã đặt</strong>.
          Không chỉ là giao hàng, mà còn là gửi đến Quý khách
          <strong> sự trân trọng và an tâm</strong> trong từng đơn hàng.
        </Paragraph>
      </Typography>
    </div>
  );
}

export default Packaging;
