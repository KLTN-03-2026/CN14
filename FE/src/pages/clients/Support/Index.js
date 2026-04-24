import { useState } from 'react';
import { Menu, Button } from 'antd';
import {
  UserOutlined,
  ShoppingOutlined,
  SyncOutlined,
  DollarOutlined,
  FileProtectOutlined,
  QuestionCircleOutlined,
  PhoneOutlined,
  MessageOutlined
} from '@ant-design/icons';
import Account from './Account';
import Ordering from './Ordering';
import { useNavigate, useParams } from 'react-router-dom';
import Packaging from './Packaging';
import ShippingFee from './ShippingFee';
import WarrantyPolicy from './WarrantyPolicy';
import Refund from './Refund';
import Contact from './Contact';
import { Breadcrumb } from "antd";

export default function Support() {
  const params = useParams();
  const [slug, setSlug] = useState(params.slug || "tai-khoan")
  const [selectedKey, setSelectedKey] = useState(params.slug);
  const navigate = useNavigate();

  const menuItems = [
    {
      key: 'tai-khoan',
      icon: <UserOutlined />,
      label: 'Tài khoản',
    },
    {
      key: 'dat-hang',
      icon: <ShoppingOutlined />,
      label: 'Đặt hàng',
    },
    {
      key: 'quy-cach',
      icon: <SyncOutlined />,
      label: 'Quy cách đóng gói',
    },
    {
      key: 'phi-van-chuyen',
      icon: <DollarOutlined />,
      label: 'Phí vận chuyển',
    },
    {
      key: 'chinh-sach',
      icon: <FileProtectOutlined />,
      label: 'Chính sách bảo hành',
    },
    {
      key: 'doi-tra',
      icon: <QuestionCircleOutlined />,
      label: 'Đổi trả, hoàn tiền',
    },
    {
      key: 'lien-he',
      icon: <QuestionCircleOutlined />,
      label: 'Liên hệ',
    }
  ];

  const contentData = {
    'dat-hang': {
      sections: <Ordering />
    },
    'tai-khoan': {
      sections: <Account />
    },
    'quy-cach': {
      sections: <Packaging />
    },
    'phi-van-chuyen': {
      sections: <ShippingFee />
    },
    'chinh-sach': {
      sections: <WarrantyPolicy />
    },
    'doi-tra': {
      sections: <Refund />
    },
    'lien-he': {
      sections: <Contact />
    }
  };

  const selectedContent = contentData[selectedKey] || contentData[slug];

  const supportLinks = [
    'Giới thiệu Hasaki',
    'Liên hệ',
    'Hệ thống của hàng Hasaki trên toàn quốc',
    'Các kênh chính thức của Hasaki',
    'Hướng dẫn đặt hàng',
    'Hướng dẫn đặt hàng 2H',
  ];

  const changeMenu = (e) => {
    setSelectedKey(e.key);
    setSlug(e.key);
    navigate(`/ho-tro/${e.key}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-500 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-medium text-center mb-6">
            Xin chào! Chúng tôi có thể giúp gì cho bạn?
          </h1>
          <div className="flex justify-center gap-6 mt-6">
            <Button
              type="text"
              className="text-white hover:text-white"
              icon={<PhoneOutlined />}
            >
              1800 6324 <span className="text-sm">(Miễn phí)</span>
            </Button>
            <Button
              type="text"
              className="text-white hover:text-white"
              icon={<MessageOutlined />}
            >
              Chat
            </Button>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <Breadcrumb separator="›">
            <Breadcrumb.Item>
              <a href="/" className="text-gray-600 hover:text-teal-600">Trang chủ</a>
            </Breadcrumb.Item>
            <Breadcrumb.Item className="text-gray-800 font-medium">
              {menuItems.find((item) => item.key === selectedKey)?.label || "Tài khoản"}
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* Sidebar Menu */}
          <div className="w-64 flex-shrink-0">
            <Menu
              mode="inline"
              selectedKeys={[selectedKey]}
              onClick={changeMenu}
              items={menuItems}
              className="bg-white shadow-sm"
            />

            {/* Support Links */}
            <div className="mt-6 bg-white shadow-sm p-4">
              <h3 className="font-semibold mb-3">Thông tin hỗ trợ</h3>
              <ul className="space-y-2">
                {supportLinks.map((link, idx) => (
                  <li key={idx}>
                    <a href="/" className="text-sm text-gray-700 hover:text-teal-600">
                      • {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1">
            <div className="bg-white shadow-sm">
              <div className="space-y-6">
                {selectedContent.sections}
              </div>
            </div>

            {/* Quick Links on Right */}
            <div className="mt-6 bg-white shadow-sm p-4">
              <div className="space-y-2 text-sm">
                <a href="/" className="block text-gray-700 hover:text-teal-600 py-2 border-b">
                  Tôi có thể đặt hàng qua điện thoại được không?
                </a>
                <a href="/" className="block text-gray-700 hover:text-teal-600 py-2 border-b">
                  Có giới hạn về số lượng sản phẩm khi đặt hàng không?
                </a>
                <a href="/" className="block text-gray-700 hover:text-teal-600 py-2 border-b">
                  Tôi muốn kiểm tra lại đơn hàng đã mua?
                </a>
                <a href="/" className="block text-gray-700 hover:text-teal-600 py-2">
                  Tôi muốn thay đổi hoặc hủy bỏ đơn hàng đã mua thì sao?
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}