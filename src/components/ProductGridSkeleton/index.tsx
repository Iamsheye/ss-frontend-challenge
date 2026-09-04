import { PRODUCTS_PAGE_SIZE } from "@/api";
import ProductGridSkeletonStyles from "./ProductGridSkeletonStyles";

const SKELETON_KEYS = Array.from(
  { length: PRODUCTS_PAGE_SIZE },
  (_, index) => `skeleton-${index}`,
);

const ProductGridSkeleton = () => {
  return (
    <ProductGridSkeletonStyles
      className="grid-container"
      role="status"
      aria-busy="true"
      aria-label="Carregando produtos"
    >
      <span className="visually-hidden">Carregando produtos...</span>
      {SKELETON_KEYS.map((key) => (
        <div key={key} className="skeleton-card" aria-hidden="true">
          <div className="skeleton-image" />
          <div className="skeleton-info">
            <div className="skeleton-line title" />
            <div className="skeleton-line desc" />
            <div className="skeleton-line desc short" />
            <div className="skeleton-price" />
            <div className="skeleton-button" />
          </div>
        </div>
      ))}
    </ProductGridSkeletonStyles>
  );
};

export default ProductGridSkeleton;
