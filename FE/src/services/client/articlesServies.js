import { get } from "../../utils/request";

export const listArticles = async () => {
  const result = await get(`/articles`);
  return result;
}

export const detailArticle = async (slug) => {
  const result = await get(`/articles/detail/${slug}`);
  return result;
}