// import { useEffect } from "react";
// import { Widget, addResponseMessage, renderCustomComponent } from "react-chat-widget";
// import { Card, Button, Tag, Typography } from "antd";
// import { ShoppingOutlined, EyeOutlined, PercentageOutlined } from "@ant-design/icons";
// import { chatBot } from "../../services/client/chatBotServies";
// import "./ChatBotAi.scss";
// import "react-chat-widget/lib/styles.css";

// const { Title } = Typography;

// const ChatBotAi = () => {
//   const STORAGE_KEY = "chatbot_messages";

//   // Hàm lưu tin nhắn vào localStorage
//   const saveMessages = (messages) => {
//     const data = {
//       messages,
//       timestamp: Date.now(),
//     };
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
//   };

//   // Hàm load tin nhắn
//   const loadMessages = () => {
//     const data = localStorage.getItem(STORAGE_KEY);
//     if (!data) return [];

//     try {
//       const parsed = JSON.parse(data);
//       // Kiểm tra thời gian < 1 ngày (24h)
//       const oneDay = 24 * 60 * 60 * 1000;
//       if (Date.now() - parsed.timestamp > oneDay) {
//         localStorage.removeItem(STORAGE_KEY);
//         return [];
//       }
//       return parsed.messages || [];
//     } catch (err) {
//       console.error("Lỗi parse messages:", err);
//       return [];
//     }
//   };

//   // Parse products từ text
//   const parseProducts = (text) => {
//     const productRegex =
//       /###\s\d+\.\s(.*?)\n- \*\*Giá\*\*: ([\d,]+) VNĐ\n- \*\*Giảm giá\*\*: (\d+)%\n- \*\*Size còn hàng\*\*: (.*?)\n- !\[.*?\]\((.*?)\)\n- \[Xem chi tiết sản phẩm\]\((.*?)\)/g;
//     const products = [];
//     let match;
//     while ((match = productRegex.exec(text)) !== null) {
//       const [, name, price, discount, sizes, image, link] = match;
//       products.push({
//         name,
//         price: Number(price.replace(/,/g, "")),
//         discount: Number(discount),
//         sizes,
//         image,
//         link,
//       });
//     }
//     return products;
//   };

//   // Render product cards
//   const renderProductCards = (products) => (
//     <div className="space-y-4">
//       {products.map((p, i) => (
//         <Card
//           key={i}
//           className="product-card hover:shadow-lg transition-all duration-300 border-0 bg-gray-50"
//           bodyStyle={{ padding: "12px" }}
//         >
//           <div className="flex gap-3">
//             <img
//               src={p.image}
//               alt={p.name}
//               className="w-16 h-16 object-cover rounded-lg border border-gray-200"
//             />
//             <div className="flex-1 min-w-0">
//               <Title level={5} className="!mb-1 !text-sm font-semibold line-clamp-2">
//                 {p.name}
//               </Title>
//               <div className="flex items-center gap-2 mb-2">
//                 <span className="text-lg font-bold text-red-600">
//                   {p.price.toLocaleString("vi-VN")}đ
//                 </span>
//                 {p.discount > 0 && (
//                   <Tag color="red" className="text-xs px-1 py-0">
//                     <PercentageOutlined className="text-xs mr-1" />-{p.discount}%
//                   </Tag>
//                 )}
//               </div>
//               <div className="text-xs text-gray-500 mb-2">
//                 <ShoppingOutlined className="mr-1" /> Size: {p.sizes}
//               </div>
//               <Button
//                 type="primary"
//                 size="small"
//                 icon={<EyeOutlined />}
//                 className="bg-blue-500 hover:bg-blue-600 border-0 text-xs h-7"
//                 onClick={() => window.open(p.link, "_blank")}
//               >
//                 Xem chi tiết
//               </Button>
//             </div>
//           </div>
//         </Card>
//       ))}
//     </div>
//   );

//   // Khi load component
//   useEffect(() => {
//     const oldMessages = loadMessages();
//     if (oldMessages.length > 0) {
//       oldMessages.forEach((msg) => {
//         if (msg.type === "user") {
//           // user message hiển thị tự động
//         } else if (msg.type === "bot") {
//           addResponseMessage(msg.text);
//         } else if (msg.type === "products") {
//           renderCustomComponent(renderProductCards, { products: msg.products }, true);
//         }
//       });
//     } else {
//       addResponseMessage("Xin chào! Tôi có thể giúp gì cho bạn? 👋");
//     }
//   }, []);

//   // Khi user gửi tin nhắn
//   const handleNewUserMessage = async (message) => {
//     try {
//       const current = loadMessages();
//       const newMessages = [...current, { type: "user", text: message }];
//       saveMessages(newMessages);

//       const res = await chatBot({ question: message });
//       const reply = res.answer;
//       const products = parseProducts(reply);

//       if (products.length > 0) {
//         renderCustomComponent(renderProductCards, { products }, true);
//         saveMessages([...newMessages, { type: "products", products }]);
//       } else {
//         addResponseMessage(reply);
//         saveMessages([...newMessages, { type: "bot", text: reply }]);
//       }
//     } catch (err) {
//       console.error(err);
//       addResponseMessage("Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.");
//     }
//   };

//   return (
//     <Widget
//       handleNewUserMessage={handleNewUserMessage}
//       title="Hỗ trợ AI"
//       subtitle="Chat với bot của chúng tôi"
//       senderPlaceHolder="Nhập tin nhắn..."
//     />
//   );
// };

const ChatBotAi = () => {
  return (
    <></>
  )
}

export default ChatBotAi;
