import { useState } from "react"
import ListProduct from "../ListProduct"
import { useEffect } from "react"
import { productsCategoryGet } from "../../services/client/productServies"

function ProductsRelated(props) {
  const { slug } = props;

  const [productRelated, setProductRelated] = useState([])

  useEffect(() => {

    const fetchApi = async () => {
      const response = await productsCategoryGet(slug, "", "", "");
      if (response.code === 200) {
        setProductRelated(response.products);
      }
    }

    fetchApi();

  }, [slug])

  return (
    <>
      {/* Sản phẩm liên quan */}
      <div>
        <ListProduct products={productRelated} filter={false} title={`Sản phẩm liên quan`} />
      </div>
    </>
  )
}

export default ProductsRelated