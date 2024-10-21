import { GridCard } from "./ProductGridCard";
import { Product } from "@/utils/types";

interface GridViewProps {
  products: Product[];
}

export function GridView({ products }: GridViewProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <GridCard key={product.id} product={product} />
      ))}
    </div>
  );
}
