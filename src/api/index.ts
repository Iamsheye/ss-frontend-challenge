export { API_BASE_URL, PRODUCTS_PAGE_SIZE } from "./config";
export { ApiError, apiFetch } from "./client";

export { fetchProducts, type ProductsPage } from "./products";
export type {
  GetProductsParams,
  Product,
  ProductOrderBy,
  ProductSortBy,
  ProductsResponse,
} from "./products/types";
