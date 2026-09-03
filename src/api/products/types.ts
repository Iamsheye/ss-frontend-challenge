export type ProductSortBy = "id" | "name" | "price";
export type ProductOrderBy = "ASC" | "DESC";

export interface GetProductsParams {
  /** 1-based page index. */
  page?: number;
  /** Number of products to return. Defaults to {@link PRODUCTS_PAGE_SIZE}. */
  rows?: number;
  /** Column used for sorting. */
  sortBy?: ProductSortBy;
  /** Sort direction. */
  orderBy?: ProductOrderBy;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  /** Numeric string, e.g. `"182.00000000"`. Parse with `Number.parseFloat`. */
  price: string;
  createdAt: string;
}

export interface ProductsResponse {
  products: Product[];
  /** Total number of products available server-side. */
  count: number;
}
