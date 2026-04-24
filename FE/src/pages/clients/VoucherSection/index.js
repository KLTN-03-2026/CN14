import { useState } from "react"
import { message } from "antd"
import VoucherCard from "../../../components/Voucher-card"

export default function VoucherSection({ vouchers }) {
  const [copiedCode, setCopiedCode] = useState(null)

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    message.success("Đã sao chép mã!")
    setTimeout(() => setCopiedCode(null), 2000)
  }

  return (
    <section className="w-full py-8 px-4 md:px-8 lg:px-16 ">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">VOUCHER</h1>
        <div className="mt-4 h-1 w-32 bg-red-400 mx-auto" style={{width: "100%"}}></div>
      </div>

      {/* Voucher Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {vouchers.slice(0,4).map((voucher) => (
          <VoucherCard key={voucher._id} {...voucher} isCopied={copiedCode === voucher.code} 
          onCopy={handleCopyCode} />
        ))}
      </div>
    </section>
  )
}
