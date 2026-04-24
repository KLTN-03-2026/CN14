import { useState, useEffect } from "react";
import { getCookie } from "../../../helpers/cookie";
import {voucherGiftTemp, myVoucherGifts, exchangeVoucherGift } from "../../../services/client/userServies";
import { message, Card, Button, Row, Col, Avatar, Tag, Tooltip } from "antd";

const ranks = [
  { name: "Đồng", min: 0, max: 999999, color: "#a0522d" },
  { name: "Bạc", min: 1000000, max: 4999999, color: "#c0c0c0" },
  { name: "Vàng", min: 5000000, max: 9999999, color: "#ffd700" },
  { name: "Kim cương", min: 10000000, max: Infinity, color: "#00bfff" },
];

function ExchangePoints(props) {
  const tokenUser = getCookie("tokenUser");
  
  const { infoUser } = props;

  const [vouchers, setVouchers] = useState([]);
  const [myVouchers, setMyVouchers] = useState([]);
  const [totalExpend, setTotalExpend] = useState(infoUser.totalExpend);

  const [copiedCode, setCopiedCode] = useState(null);

  const fetchApi = async () => {
    try {
      const resVouchers = await voucherGiftTemp(tokenUser);
      if (resVouchers.code === 200) setVouchers(resVouchers.data);
      else message.error(resVouchers.message);

      const resMyVoucherGifts = await myVoucherGifts(tokenUser);
      if (resMyVoucherGifts.code === 200) setMyVouchers(resMyVoucherGifts.data);
      else message.error(resMyVoucherGifts.message);

    } catch (error) {
      message.error(error.message);
    }
  };

  const handleExchange = async (voucher) => {
    if (infoUser.points < voucher.pointCost) {
      return message.warning("Bạn không đủ điểm để đổi voucher này!");
    }
    const response = await exchangeVoucherGift({ id: voucher._id }, tokenUser);

    if (response.code === 200) {
      message.success(response.message);
      fetchApi();
    } else {
      message.error(response.message);
    }
  };

  useEffect(() => {
    fetchApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCopy = (code) => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        setCopiedCode(code);
        // Reset sau 2 giây
        setTimeout(() => setCopiedCode(null), 2000);
      })
      .catch(() => {
        alert("Không thể sao chép mã!");
      });
  };

  const currentRank =
    ranks.find(r => totalExpend >= r.min && totalExpend <= r.max) || ranks[0];
  const nextRank = ranks[ranks.indexOf(currentRank) + 1];

  const percentToNext = nextRank
    ? ((totalExpend - currentRank.min) / (nextRank.min - currentRank.min)) * 100
    : 100;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Thông tin người dùng */}
      <div className="max-w-5xl mx-auto mb-8 bg-white rounded-2xl shadow p-6 flex items-center gap-4">
        <Avatar size={80} src={infoUser.avatar} />
        <div>
          <h2 className="text-xl font-semibold">{infoUser.fullName}</h2>
          <p className="text-gray-600">{infoUser.email}</p>

          {/* Điểm và Hạng */}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Tag color="blue" className="text-base py-1 px-3 rounded-full">
              Điểm hiện tại: <span className="font-bold">{infoUser.points ?? 0}</span>
            </Tag>
          </div>
        </div>
        {/* Hạng người dùng */}
        <div className="p-4 rounded-xl shadow-md bg-white space-y-2">
          <Tag
            className={`text-base py-1 px-3 rounded-full font-semibold border-none ${infoUser.rank === "Diamond"
              ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-white"
              : infoUser.rank === "Platinum"
                ? "bg-gray-300 text-gray-900"
                : infoUser.rank === "Gold"
                  ? "bg-yellow-400 text-white"
                  : infoUser.rank === "Silver"
                    ? "bg-gray-400 text-white"
                    : "bg-amber-700 text-white"
              }`}
          >
            Hạng: {infoUser.rank || "Member"}
          </Tag>

          <p>
            Tổng chi tiêu:{" "}
            <span className="font-semibold">
              {totalExpend.toLocaleString()}đ
            </span>
          </p>

          {nextRank ? (
            <>
              <div className="h-3 bg-gray-200 rounded-full">
                <div
                  className="h-3 rounded-full transition-all"
                  style={{
                    width: `${Math.min(percentToNext, 100)}%`,
                    backgroundColor: currentRank.color,
                  }}
                />
              </div>
              <p className="text-sm text-gray-600">
                Cần thêm{" "}
                <span className="font-medium text-blue-600">
                  {(nextRank.min - totalExpend).toLocaleString()}đ
                </span>{" "}
                để đạt hạng{" "}
                <span style={{ color: nextRank.color, fontWeight: "bold" }}>
                  {nextRank.name}
                </span>
              </p>
            </>
          ) : (
            <p className="text-sm text-green-600 font-medium">
              🎉 Bạn đã đạt hạng cao nhất: {currentRank.name}!
            </p>
          )}
        </div>
      </div>

      {/* Danh sách voucher đã đổi */}
      <div className="max-w-5xl mx-auto">
        <h3 className="text-2xl font-bold mb-4">🎫 Voucher của bạn</h3>
        <Row gutter={[12, 12]}>
          {myVouchers.length === 0 ? (
            <p className="text-gray-500 italic">Bạn chưa đổi voucher nào.</p>
          ) : (
            myVouchers.map((voucher) => (
              <Col xs={24} sm={12} md={8} lg={8} key={voucher._id}>
                <div
                  key={voucher._id}
                  className="border border-red-300 rounded-xl p-4 text-center shadow-sm hover:shadow-md transition"
                >
                  {/* Mã voucher */}
                  <div className="text-red-600 font-bold text-lg mb-2 uppercase tracking-wide">
                    {voucher.code}
                  </div>

                  {/* Giảm giá */}
                  {voucher.discount > 100 ? (
                    <div className="text-base text-gray-700 mb-1">
                      Giảm:{" "}
                      <span className="font-semibold text-gray-900">
                        {Number(voucher.discount).toLocaleString()}đ
                      </span>
                    </div>
                  ) : (
                    <div className="text-base text-gray-700 mb-1">
                      Giảm:{" "}
                      <span className="font-semibold text-gray-900">
                        {voucher.discount}%
                      </span>
                    </div>
                  )}

                  {/* Giá trị tối thiểu */}
                  <div className="text-sm text-gray-600 mb-2">
                    Đơn tối thiểu:{" "}
                    <span className="font-semibold text-gray-800">
                      {voucher.minOrderValue.toLocaleString()}đ
                    </span>
                  </div>

                  {/* Hạn sử dụng */}
                  <p className="text-sm text-gray-700 mb-3">
                    Hạn sử dụng:{" "}
                    <span className="font-semibold text-gray-900">
                      {new Date(voucher.expiredAt).toLocaleDateString("vi-VN")}
                    </span>
                  </p>

                  {/* Trạng thái */}
                  <div className="mb-3">
                    {voucher.used ? (
                      <Tag color="red" className="text-sm px-2 py-1 rounded-md">
                        Đã sử dụng
                      </Tag>
                    ) : (
                      <Tag color="green" className="text-sm px-2 py-1 rounded-md">
                        Chưa dùng
                      </Tag>
                    )}
                  </div>

                  {/* Nút sao chép */}
                  <Button
                    onClick={() => handleCopy(voucher.code)}
                    className={`mt-2 w-full text-white text-sm font-semibold py-2 rounded-lg transition 
                        ${copiedCode === voucher.code
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-red-600 hover:bg-red-700"
                      }`}
                  >
                    {copiedCode === voucher.code ? "ĐÃ SAO CHÉP" : "SAO CHÉP MÃ"}
                  </Button>
                </div>
              </Col>
            ))
          )}
        </Row>
      </div>

      {/* Danh sách voucher */}
      <div className="max-w-5xl mx-auto mt-4">
        <h3 className="text-2xl font-bold mb-4">🎁 Đổi điểm lấy voucher</h3>
        <Row gutter={[12, 12]}>
          {vouchers.map((voucher) => (
            <Col xs={24} sm={12} md={8} lg={8} key={voucher._id}>
              <Card
                hoverable
                className="rounded-xl shadow-sm hover:shadow-md transition-all"
                cover={
                  <img
                    alt={voucher.title}
                    src={voucher.image}
                    className="h-40 w-full object-cover rounded-t-xl"
                  />
                }
              >
                <div className="flex flex-col gap-2">
                  <Tooltip title={voucher.title}>
                    <h4 className="font-semibold text-base line-clamp-2">{voucher.title}</h4>
                  </Tooltip>
                  <p className="text-gray-600 text-sm">{voucher.excerpt}</p>
                  <p className="text-gray-600 text-sm">Đơn hàng tối thiểu: <b>{Number(voucher.minOrderValue).toLocaleString()}đ</b>
                  </p>
                  <p className="text-gray-600 text-sm">Giảm giá tối đa: <b>{Number(voucher.maxOrderValue).toLocaleString()}đ</b>
                  </p>
                  <div className="flex justify-between items-center mt-3">
                    <Tag color="green">{voucher.pointCost} điểm</Tag>
                    <Tag color="orange">HSD: {voucher.expiredAfterDays} ngày</Tag>
                  </div>

                  <Button
                    type="primary"
                    block
                    className={`mt-2 ${infoUser.points < voucher.pointCost ? "bg-gray-400 border-none" : ""}`}
                    disabled={infoUser.points < voucher.pointCost}
                    onClick={() => handleExchange(voucher)}
                  >
                    {infoUser.points < voucher.pointCost ? "Không đủ điểm" : "Đổi ngay"}
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}

export default ExchangePoints;
