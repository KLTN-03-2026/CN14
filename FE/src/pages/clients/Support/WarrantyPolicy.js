import { Card, Typography, Divider } from "antd";

const { Title, Paragraph } = Typography;

export default function WarrantyPolicy() {
  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-2xl shadow-md">
      <Title level={2} className="text-center text-blue-600 mb-6">
        CHÍNH SÁCH BẢO HÀNH SẢN PHẨM HAVATEK
      </Title>

      {/* I. Chính sách bảo hành */}
      <Card className="mb-6">
        <Title level={3}>I. CHÍNH SÁCH BẢO HÀNH</Title>

        <Title level={4}>1. Điều kiện bảo hành</Title>
        <Paragraph>
          Để được bảo hành, khách hàng phải điền Yêu cầu bảo hành{" "}
          <a href="/" className="text-blue-500 underline">TẠI ĐÂY</a> và gửi sản phẩm lại cho Hasaki bằng cách:
          <br />- (1) Điền thông tin để shipper Hasaki đến lấy hàng, hoặc
          <br />- (2) Đem sản phẩm bảo hành đến trực tiếp tại các cửa hàng của Hasaki trên toàn quốc
          <br />
          Khách hàng cần cung cấp bằng chứng mua hàng như hóa đơn, đơn hàng, mã đặt hàng hoặc bằng chứng phát hành bởi cửa hàng chính thức của Hasaki.
        </Paragraph>

        <Title level={4}>2. Chính sách bảo hành</Title>
        <Paragraph>
          - Bảo hành <strong>1 đổi 1 trong 2 năm</strong> kể từ ngày mua hoặc nhận hàng.
          <br />- Trong thời gian bảo hành, sản phẩm được đổi trả miễn phí nếu phát sinh lỗi kỹ thuật.
          <br />- Sau thời hạn bảo hành, HAVATEK không nhận sửa chữa, bảo hành với bất kỳ lý do nào.
        </Paragraph>

        <Title level={4}>3. Trường hợp từ chối bảo hành</Title>
        <ul className="list-disc pl-6">
          <li>Không có bằng chứng mua hàng.</li>
          <li>Sản phẩm hết thời hạn bảo hành.</li>
          <li>Sử dụng sai cách, rơi, va chạm, lỗi vận chuyển.</li>
          <li>Lỗi bề mặt (nứt, trầy xước...) được báo sau 48 giờ.</li>
          <li>Hao mòn tự nhiên (pin, bộ lọc...) hoặc sự kiện bất khả kháng.</li>
          <li>Tự ý sửa chữa hoặc thay linh kiện không thuộc HAVATEK.</li>
          <li>Không đầy đủ phụ kiện hoặc hư hỏng do ngoại lực.</li>
        </ul>
      </Card>

      {/* II. Kích hoạt bảo hành */}
      <Card className="mb-6">
        <Title level={3}>II. KÍCH HOẠT BẢO HÀNH</Title>
        <Paragraph>
          - Bảo hành 1 đổi 1 có hiệu lực trong vòng 2 năm kể từ khi nhận hàng.
          <br />- Sau khi nhận hàng, hệ thống tự động kích hoạt bảo hành.
          <br />- Khách hàng nhận email hoặc tin nhắn Zalo xác nhận, kèm link kiểm tra thông tin.
          <br />- Có thể quét mã QR trên nắp hộp để kiểm tra bảo hành.
        </Paragraph>
      </Card>

      {/* III. Thủ tục bảo hành */}
      <Card className="mb-6">
        <Title level={3}>III. THỦ TỤC BẢO HÀNH</Title>

        <Title level={4}>1. Khách hàng tạo phiếu yêu cầu bảo hành</Title>
        <Paragraph>
          Sau khi điền phiếu yêu cầu trực tuyến, bộ phận CSKH sẽ liên hệ trong 1 giờ để tiếp nhận thông tin và xác nhận phương thức thu hồi sản phẩm.
        </Paragraph>

        <Title level={4}>2. Xác nhận và gửi hàng</Title>
        <Paragraph>
          Sau khi xác nhận, khách hàng gửi sản phẩm về HAVATEK trong vòng 3–5 ngày làm việc.
        </Paragraph>

        <Title level={4}>3. Phản hồi sau khi nhận sản phẩm</Title>
        <Paragraph>
          Bộ phận kỹ thuật kiểm tra và phản hồi trong vòng 1 ngày làm việc để thông báo kết quả.
        </Paragraph>

        <Title level={4}>4. Xử lý bảo hành</Title>
        <ul className="list-disc pl-6">
          <li>
            <strong>Chấp nhận bảo hành:</strong> Đổi sản phẩm mới và gửi lại trong 5–7 ngày làm việc.
          </li>
          <li>
            <strong>Từ chối bảo hành:</strong> Hoàn trả sản phẩm cùng thông báo lý do trong 5–7 ngày.
          </li>
        </ul>
      </Card>

      {/* IV. Tổng đài hỗ trợ */}
      <Card>
        <Title level={3}>IV. TỔNG ĐÀI HỖ TRỢ</Title>
        <Paragraph>
          <strong>Số Hotline hỗ trợ chung:</strong> 1800 6324 <br />
          <strong>Số Hotline bảo hành:</strong> 1800 8115
        </Paragraph>
      </Card>

      <Divider />
      <p className="text-center text-gray-500 text-sm mt-4">
        © 2025 HAVATEK — Chính sách bảo hành sản phẩm
      </p>
    </div>
  );
}
