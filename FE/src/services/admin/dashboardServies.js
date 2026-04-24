import {getAuth } from "../../utils/request";
const admin = "/admin";


// export const listCategory = async (token, sortKey, sortType) => {
//   try {
//     const result = await getAuth(`${admin}/products-category?sortKey=${sortKey}&sortType=${sortType}`, token);
//     return result;
//   } catch (error) {
//     console.error("Error in listCategory:", error.message);
//     throw error;
//   }
// };

export const getTimeStartWeb = async (token) => {
  const result = await getAuth(`${admin}/dashboard/timestart`, token);
  return result;
}

export const getpercentGrowthProduct = async (token, time) => {
  const result = await getAuth(`${admin}/dashboard/product/percentGrowth/${time}`, token);
  return result;
}

export const getpercentGrowthOrder = async (token, time) => {
  const result = await getAuth(`${admin}/dashboard/order/percentGrowth/${time}`, token);
  return result;
}

export const getpercentGrowthUser = async (token, time) => {
  const result = await getAuth(`${admin}/dashboard/user/percentGrowth/${time}`, token);
  return result;
}

export const getpercentGrowthCategory = async (token, time) => {
  const result = await getAuth(`${admin}/dashboard/category/percentGrowth/${time}`, token);
  return result;
}

export const getLatestRevenue = async (token) => {
  const result = await getAuth(`${admin}/dashboard/latest-revenue`, token);
  return result;
}

export const getRerentOrders = async (token) => {
  const result = await getAuth(`${admin}/dashboard/recent-orders`, token);
  return result;
}

export const getTopSellingCategories = async (token, time) => {
  const result = await getAuth(`${admin}/dashboard/top-selling-category/${time}`, token);
  return result;
}


export const getTopSellingProducts = async (token, time) => {
  const result = await getAuth(`${admin}/dashboard/top-selling-product/${time}`, token);
  return result;
}

export const getLowStockProducts = async (token) => {
  const result = await getAuth(`${admin}/dashboard/low-stock-products`, token);
  return result;
}

// export const editCategory = async (id, option, token) => {
//   const result = await patchAuth(`${admin}/products-category/edit/${id}`, option, token);
//   return result;
// }
// export const changeStatusCategory = async (token, status, id) => {
//   const result = await getAuth(`${admin}/products-category/change-status/${status}/${id}`, token);
//   return result;
// }

// export const deleteCategory = async (id, token) => {
//   const result = await delAuth(`${admin}/products-category/delete-item/${id}`, token);
//   return result;
// }