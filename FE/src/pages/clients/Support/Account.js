import { Typography } from "antd";

const { Title, Paragraph } = Typography;

function Account() {
  return (
    <div className="max-w-4xl mx-auto">
      <Typography>
        <Title level={3}>Đăng ký thành viên của chúng tôi như thế nào?</Title>
        <Paragraph>
          Quý khách vui lòng nhấn vào nút <strong>“Đăng nhập/Đăng ký tài khoản”</strong>
          trên góc phải màn hình sau đó chọn <strong>“Đăng ký/Đăng ký ngay”</strong> (Đối với Desktop)
          hoặc tại góc trái màn hình, chọn biểu tượng Menu rồi chọn
          <strong> “Đăng nhập/Đăng ký”</strong> (Đối với Mobile).
          Vui lòng điền đầy đủ các thông tin được yêu cầu và nhấn nút <strong>“Đăng ký”</strong>.
          Hệ thống sẽ tự động gửi email thông báo về việc kích hoạt tài khoản đến tài khoản email cá nhân của quý khách.
          Quý khách vui lòng click vào đường link để được xác nhận đã tạo tài khoản thành công.
        </Paragraph>

        <Paragraph>
          Trường hợp không nhận được email kích hoạt, quý khách vui lòng kiểm tra kỹ trong hộp thư rác hoặc Spam
          hoặc liên hệ trực tiếp qua <strong>Hotline 1800 6324</strong> để được hỗ trợ.
        </Paragraph>

        <Title level={4}>Tại sao tôi không thể đăng nhập vào tài khoản của tôi?</Title>
        <Paragraph>
          Quý khách vui lòng kiểm tra kỹ về kiểu gõ hoặc phím <strong>Caps Lock</strong> trong quá trình điền thông tin đăng nhập.
          Trường hợp không thể đăng nhập thành công, quý khách vui lòng chọn nút
          <strong> “Quên mật khẩu”</strong> trên góc phải màn hình và nhập email hoặc số điện thoại đã đăng ký.
          Hệ thống sẽ tự động gửi một đường dẫn vào email hoặc SMS của quý khách,
          quý khách vui lòng nhấp vào đường dẫn để tạo lại mật khẩu mới.
          Sau khi hoàn tất, quý khách có thể đăng nhập bằng mật khẩu vừa tạo.
        </Paragraph>

        <Title level={4}>Tôi muốn thay đổi thông tin tài khoản thành viên như thế nào?</Title>
        <Paragraph>
          Để thay đổi thông tin cá nhân, quý khách vui lòng đăng nhập vào tài khoản của mình,
          chọn nút <strong>“Tài khoản của bạn”</strong> rồi chọn vào nút <strong>“Sửa”</strong> để thay đổi thông tin.
        </Paragraph>

        <Title level={4}>Tôi có thể sử dụng chung tài khoản với người khác được không?</Title>
        <Paragraph>
          Quý khách nên sử dụng tài khoản cá nhân để đảm bảo độ tin cậy cũng như quyền lợi của bản thân khi mua sắm.
          Việc sử dụng chung tài khoản có thể dẫn đến những sai sót mà người chịu ảnh hưởng trực tiếp chính là quý khách hàng.
        </Paragraph>

        <Title level={4}>
          Đăng ký thành viên tại cửa hàng của chúng tôi sẽ giúp ích gì cho bạn? Cửa hàng chúng tôi sẽ có chương trình ưu đãi nào hấp dẫn dành cho khách hàng thân thiết?
        </Title>
        <Paragraph>
          Đổi điểm lấy quà theo danh sách quà tặng có sẵn với các mức điểm tương ứng,
          quà sẽ được tặng kèm đơn hàng tiếp theo.
          <a href="#" className="text-blue-500 hover:underline"> Xem thêm hướng dẫn tại đây</a>.
        </Paragraph>
      </Typography>
    </div>
  );
}

export default Account;
