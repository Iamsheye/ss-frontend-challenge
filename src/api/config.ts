/**
 * Centralised access to the public API base URL.
 *
 * The value comes from `NEXT_PUBLIC_API_BASE_URL` so it is available in both
 * Server and Client Components. Trailing slashes are stripped so callers can
 * safely concatenate paths like `${API_BASE_URL}/products`.
 */
export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? ""
).replace(/\/+$/, "");

/** Number of products requested per page. */
export const PRODUCTS_PAGE_SIZE = 8;
