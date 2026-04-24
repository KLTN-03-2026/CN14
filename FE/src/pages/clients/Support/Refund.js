import { Typography, Collapse, Table } from "antd";

const { Title, Paragraph } = Typography;
const { Panel } = Collapse;

function Refund() {
  const columns = [
    {
      title: "Thời gian",
      dataIndex: "time",
      key: "time",
      align: "center",
    },
    {
      title: "Sản phẩm lỗi (Từ phía nhà cung cấp)",
      dataIndex: "supplierFault",
      key: "supplierFault",
      align: "center",
    },
    {
      title: "Sản phẩm lỗi (Từ phía người sử dụng)",
      dataIndex: "userFault",
      key: "userFault",
      align: "center",
    },
    {
      title: "Sản phẩm không lỗi",
      dataIndex: "noFault",
      key: "noFault",
      align: "center",
    },
  ];

  const dataSource = [
    {
      key: "1",
      time: "1 – 30 ngày",
      supplierFault: "Đổi mới – Trả không thu phí",
      userFault: "Không hỗ trợ đổi trả",
      noFault: "Đổi mới",
    },
    {
      key: "2",
      time: "31 ngày trở đi",
      supplierFault: "Không hỗ trợ đổi trả",
      userFault: "Không hỗ trợ đổi trả",
      noFault: "Không hỗ trợ đổi trả",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <Typography>
        <Title level={3}>Chính sách đổi trả – hoàn tiền tại Hasaki</Title>

        {/* Bảng chính sách đổi trả */}
        <div className="mt-6 mb-4">
          <Table
            bordered
            pagination={false}
            columns={columns}
            dataSource={dataSource}
            className="text-center"
          />
          <Paragraph className="text-red-600 mt-3">
            <strong>
              Lưu ý: Từ ngày 01/06/2024, Hasaki áp dụng chính sách đổi trả mới trong vòng 30 ngày.
            </strong>
          </Paragraph>
        </div>

        <Collapse defaultActiveKey={["1"]} accordion>
          <Panel header="✅ Quy định đổi trả" key="1">
            <Paragraph>
              Hasaki áp dụng **đổi trả trong vòng 30 ngày** kể từ ngày mua hoặc nhận hàng.
            </Paragraph>
            <Paragraph>
              <strong>Được đổi trả nếu:</strong>
            </Paragraph>
            <ul className="list-disc ml-6 text-gray-700">
              <li>Sản phẩm lỗi do nhà sản xuất (hỏng, đổ vỡ, lỗi kỹ thuật).</li>
              <li>Hư hỏng, trầy xước do quá trình vận chuyển.</li>
              <li>Sản phẩm hết hoặc gần hết hạn sử dụng.</li>
              <li>Sản phẩm không đúng loại/màu/loại theo đơn đặt hàng.</li>
              <li>Sản phẩm còn nguyên vỏ hộp, tem nhãn và chưa qua sử dụng.</li>
            </ul>
            <Paragraph>
              <strong>Không áp dụng đổi trả nếu:</strong>
            </Paragraph>
            <ul className="list-disc ml-6 text-gray-700">
              <li>Sản phẩm quà tặng hoặc chương trình khuyến mãi đặc biệt.</li>
              <li>Hết hạn đổi trả (qua 30 ngày).</li>
              <li>Tem, nhãn, seal bị bóc hoặc hư hỏng do khách hàng.</li>
              <li>Sản phẩm đã thử dùng hoặc đã qua sử dụng.</li>
              <li>Sản phẩm không mua từ Hasaki.</li>
            </ul>
          </Panel>

          <Panel header="📦 Cách thức đổi trả" key="2">
            <Paragraph>
              Quý khách cần thông báo lý do đổi trả kèm địa chỉ & số điện thoại liên hệ để Hasaki xử lý.
            </Paragraph>
            <Paragraph>
              Nếu có quà tặng kèm, xin gửi kèm để đổi theo đúng quy định.
            </Paragraph>
            <Paragraph>
              – Với khách tại TP.HCM: có thể mang sản phẩm đến showroom để kiểm tra & đổi trực tiếp.
            </Paragraph>
            <Paragraph>
              – Với khách tỉnh: gửi hàng qua bưu điện & thông báo mã vận đơn cho Hasaki để xử lý.
            </Paragraph>
          </Panel>

          <Panel header="💰 Phương thức hoàn tiền & phí xử lý" key="3">
            <Paragraph>
              <strong>Trả hàng tại chi nhánh Hasaki:</strong>
            </Paragraph>
            <ul className="list-disc ml-6 text-gray-700">
              <li>Thanh toán tiền mặt → hoàn tiền mặt.</li>
              <li>Thanh toán thẻ ngân hàng → chuyển khoản trong 3-5 ngày làm việc (không tính thứ Bảy, Chủ Nhật, ngày lễ).</li>
              <li>Thanh toán qua VNPay → hoàn qua hệ thống VNPay trong 3-8 ngày (nội địa), với thẻ Visa: 15-90 ngày làm việc.</li>
            </ul>
            <Paragraph>
              <strong>Trả hàng tại nhà:</strong> Hasaki sẽ chuyển lại tiền vào tài khoản mà khách dùng để thanh toán sau khi nhận hàng trả.
            </Paragraph>
            <Paragraph>
              Nếu đơn hàng sử dụng gift card, Hasaki hỗ trợ chuyển mã sử dụng cho đơn hàng tiếp theo.
            </Paragraph>
          </Panel>

          <Panel header="📞 Liên hệ & hỗ trợ" key="4">
            <Paragraph>
              Mọi thắc mắc xin liên hệ Hotline: <strong>1800 6324</strong>
            </Paragraph>
          </Panel>
        </Collapse>
      </Typography>
    </div>
  );
}

export default Refund;