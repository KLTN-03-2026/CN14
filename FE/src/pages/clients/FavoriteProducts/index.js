import { useState } from "react";
import { productsFavorite } from "../../../services/client/productServies";
import { useEffect } from "react";
import { getCookie } from "../../../helpers/cookie";
import ListProduct from "../../../components/ListProduct";
import { message } from "antd";


export default function FavoriteProducts() {

  const [products, setProducts] = useState([]);

  const tokenUser = getCookie("tokenUser");

  const fetchApi = async () => {
    try {
      const response = await productsFavorite(tokenUser);
      if (response.code === 200) {
        setProducts(response.data);
      } else {
        message.error("Đăng nhập để thêm sản phẩm yêu thích ^^");
      }
    } catch (error) {
      message.error (error.message);
    }
  };

  useEffect(() => {
    fetchApi();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <ListProduct products={products} filter={false} title={`Danh sách yêu thích`} />
    </>
  )
}