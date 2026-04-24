import { Typography } from "antd";

const { Title, Paragraph } = Typography;

function Ordering() {
  return (
    <div className="max-w-4xl mx-auto">
      <Typography>
        <Title level={3}>Tôi có thể đặt hàng qua điện thoại được không?</Title>
        <Paragraph>
          Quý khách có thể liên hệ trực tiếp qua <strong>Hotline 1800 6324</strong> để được hướng dẫn đặt hàng.
          Hasaki luôn khuyến khích quý khách tạo tài khoản và đặt hàng online để được hưởng
          các chính sách ưu đãi thành viên tốt hơn.
        </Paragraph>
        <Paragraph>
          Hoặc quý khách có thể kiểm tra lại email Hasaki thông báo bạn đã đặt hàng thành công.
        </Paragraph>

        <Title level={4}>Có giới hạn về số lượng sản phẩm khi đặt hàng không?</Title>
        <Paragraph>
          Quý khách có thể đặt hàng với số lượng sản phẩm tùy ý.
          Hasaki sẽ cảnh báo giới hạn số lượng sản phẩm trong giỏ hàng của quý khách.
        </Paragraph>
        <Paragraph>
          <strong>Lưu ý:</strong> Đối với các sản phẩm đã có giới hạn về số lượng,
          nếu hệ thống ghi nhận đơn hàng vượt quá số lượng trong tài khoản của bạn,
          hệ thống sẽ tự động hủy các đơn hàng trùng lặp mã sản phẩm này và không gửi thông báo qua số điện thoại đặt hàng.
        </Paragraph>
        <Paragraph>
          Nhằm tạo điều kiện cho tất cả khách hàng có cơ hội mua hàng,
          những đơn hàng có dấu hiệu <strong>mua đi bán lại</strong>,
          Hasaki toàn quyền quyết định xử lý đơn hàng này.
        </Paragraph>

        {/* --- Kiểm tra & hủy đơn hàng --- */}
        <Title level={4}>Tôi muốn kiểm tra lại đơn hàng đã mua?</Title>
        <Paragraph>
          Quý khách bấm vào nút <strong>“Tài khoản”</strong> trên góc phải màn hình
          sau đó chọn vào mục <strong>“Tài khoản của bạn”</strong> rồi chọn
          ô <strong>“Đơn hàng của tôi”</strong> để kiểm tra lại các sản phẩm đã đặt mua.
        </Paragraph>
        <Paragraph>
          Hoặc quý khách có thể kiểm tra lại email Hasaki thông báo bạn đã đặt hàng thành công.
        </Paragraph>

        <Title level={4}>Tôi muốn thay đổi hoặc hủy bỏ đơn hàng đã mua thì sao?</Title>
        <Paragraph>
          Việc thay đổi sản phẩm trong đơn hàng, quý khách vui lòng liên hệ <strong>Hasaki Care</strong>
          qua Hotline <strong>1800 6324</strong> để được hướng dẫn chi tiết.
        </Paragraph>
        <Paragraph>
          Đơn hàng chỉ được hủy khi đơn hàng của quý khách
          <strong> chưa chuyển trạng thái cho đơn vị vận chuyển.</strong>
        </Paragraph>
      </Typography>
    </div>
  );
}

export default Ordering;
