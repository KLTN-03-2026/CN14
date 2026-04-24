
export default function VoucherCard({ voucher_code, discount_value, min_order_value, max_order_value, isCopied, onCopy }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 border-2 border-gray-300 rounded-3xl bg-white hover:shadow-lg transition-shadow duration-300">
      {/* Voucher Code */}
      <div className="text-center">
        <p className="text-red-500 font-bold text-2xl tracking-wider">{voucher_code}</p>
      </div>

      {/* Discount Amount */}
      <div className="text-center">
        <p className="text-gray-600 text-sm">
          Giảm:
          {discount_value > 100 ? (
            <span className="font-semibold">
              {" "}
              {Number(discount_value).toLocaleString()}đ
            </span>
          ) : (
            <span className="font-semibold">
              {" "}
              {discount_value}%
            </span>
          )}
        </p>
      </div>

      {/* Minimum Purchase */}
      <div className="text-center">
        <p className="text-gray-600 text-sm">
          Đơn tối thiểu: <span className="font-semibold">{Number(min_order_value).toLocaleString()}đ</span>
        </p>
      </div>

      <div className="text-center">
        <p className="text-gray-600 text-sm">
          Tối đa: <span className="font-semibold">{Number(max_order_value).toLocaleString()}đ</span>
        </p>
      </div>

      {/* Copy Button */}
      <button
        onClick={() => onCopy(voucher_code)}
        className={`w-full px-6 py-3 rounded-full font-bold text-white transition-all duration-300 ${isCopied ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600 active:scale-95"
          }`}
      >
        {isCopied ? "✓ ĐÃ COPY" : "SAO CHÉP MÃ"}
      </button>
    </div>
  )
}
