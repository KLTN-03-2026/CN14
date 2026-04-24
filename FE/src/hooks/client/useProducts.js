import { useQuery } from "@tanstack/react-query";

import {
  detailProductGet,
  productsCategoryGet,
} from "../../services/client/productServies";
import { listCategoriesGet } from "../../services/client/categoriesServies";
import { listBrand } from "../../services/client/brandServices";
import { listHomeGet } from "../../services/client/homeServies";
import { listAuthor } from "../../services/client/authorServices";
import { listPublisher } from "../../services/client/publisherServices";

function useProducts({
  slug,
  sortKey,
  sortType,
  priceRange,
  slugProduct,
  author_id,
  publisher_id,
} = {}) {
  // GET products
  const productsQuery = useQuery({
    queryKey: ["products", slug, sortKey, sortType, priceRange, author_id, publisher_id],
    queryFn: () =>
      productsCategoryGet(
        slug,
        sortKey,
        sortType,
        priceRange,
        author_id,
        publisher_id
      ).then((res) => res.products),
    enabled: !!slug, // chỉ chạy khi slug có giá trị
    keepPreviousData: true,
  });

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: () => listCategoriesGet().then((res) => res.data),
  });

  const authorsQuery = useQuery({
    queryKey: ["authors"],
    queryFn: () => listAuthor().then((res) => res.data),
  });

  const publishersQuery = useQuery({
    queryKey: ["publishers"],
    queryFn: () => listPublisher().then((res) => res.data),
  });

  const productQuery = useQuery({
    queryKey: ["product", slugProduct],
    queryFn: () => detailProductGet(slugProduct).then((res) => res.data),
    enabled: !!slugProduct, // chỉ chạy query khi có slugProduct
  });

  const homeQuery = useQuery({
    queryKey: ["home"],
    queryFn: () => listHomeGet().then((res) => res.data),
  });

  return {
    productsQuery,
    categoriesQuery,
    productQuery,
    publishersQuery,
    authorsQuery,
    homeQuery,
  };
}

export default useProducts;
