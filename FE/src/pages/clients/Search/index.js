import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ListProduct from "../../../components/ListProduct";
import { productsSearchGet } from "../../../services/client/searchServices";
import { message } from "antd";


function Search() {
  // eslint-disable-next-line no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "";

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const response = await productsSearchGet(keyword);

        if (response.code === 200) {
          setProducts(response.data);
        } else {
          if (Array.isArray(response.message)) {
            const allErrors = response.message.map(err => err.message).join("\n");
            message.error(allErrors);
          } else {
            message.error(response.message);
          }
        }
      } catch (error) {
        message.error(error.message);
      }
    }

    fetchApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword]);

  return (
    <>
      <ListProduct products={products} title={`Kết quả tìm kiếm: ${keyword}`} />
    </>
  )

}

export default Search;
