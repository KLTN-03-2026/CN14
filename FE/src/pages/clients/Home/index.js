import { useEffect, useState } from "react";
import ListProduct from "../../../components/ListProduct";
import {
  Layout,
  Spin,
} from "antd";
import Article from "../articles/List";
import TopBanner from "../TopBanner";
import useProducts from "../../../hooks/client/useProducts";
import ProductSlider from "../../../components/ProductSlider";
import CategorySlider from "../../../components/CategorySlider";
import { productViewed } from "../../../services/client/productServies";
import { getViewedProducts } from "../../../helpers/viewedProducts";
import VoucherSection from "../VoucherSection";
import SectionBanner from "../../../components/SectionBanner";

const { Content } = Layout;

function Home() {
  const [productVieweds, setProductVieweds] = useState([]);
  const [loading, setLoading] = useState(true); // 👈 Thêm loading
  const { categoriesQuery, homeQuery } = useProducts();

  const fetchApi = async () => {
    try {
      setLoading(true); // 👈 Bắt đầu loading
      const idsViewd = getViewedProducts();
      const responseViewed = await productViewed({ ids: idsViewd });

      if (responseViewed.code === 200) {
        setProductVieweds(responseViewed.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // 👈 Kết thúc loading
    }
  };

  useEffect(() => {
    fetchApi();
  }, []);

  // 👇 Hiển thị loading spinner nếu đang tải dữ liệu
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </div>
    );
  }
  // 🟡 Sau khi gọi tất cả useEffect, mới return JSX có điều kiện
  if (categoriesQuery.isLoading || homeQuery.isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </div>
    );
  }
  return (
    <>
      <Layout className="min-h-screen">
        <Content>

          <TopBanner />

          {/* Vouchers */}
          <VoucherSection vouchers={homeQuery.data.vouchers} />

          {/* Categories */}
          <SectionBanner title={"Mua sắm theo thể loại"} />
          
          <CategorySlider categories={categoriesQuery.data || []} />

          {/* Best Selling Products */}
          <SectionBanner title={"Bán chạy"} />
          <ProductSlider
            products={homeQuery.data.bestSellingProducts || []}
          />

          {/* Featured Products */}
          <SectionBanner title={"Sản phẩm nỗi bật"} />
          <ListProduct
            products={homeQuery.data.featuredProducts}
          />


          {/* Best Selling Products */}
          <ProductSlider products={productVieweds || []} title={"Đã xem"} />

          {/* Bài viết */}
          <SectionBanner title={"CÁC BÀI VIẾT CHỦ ĐỀ"} />
          <Article />


        </Content>
      </Layout>
    </>
  );
}

export default Home;
