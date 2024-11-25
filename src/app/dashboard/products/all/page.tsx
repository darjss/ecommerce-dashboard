import { Suspense } from "react";
import AllProductTable from "./_components/tables/AllProductTable";
import ProductDashboardSkeleton from "./_components/ProductDashboardSkeleton";
import { getProducts } from "@/server/db/queries";
import { Product } from "@/utils/types";

const AllProductPage = () => {
  return (
    <Suspense fallback={<ProductDashboardSkeleton />}>
      <AllProductDashboard />
    </Suspense>
  );
};
const AllProductDashboard = async () => {
  const products: Product[] = await getProducts();
  const serializedProducts = products.map((product) => ({
    ...product,
    details: product.details.map((detail) => ({
      ...detail,
      createdAt: detail.createdAt,
      updatedAt: detail.updatedAt,
    })),
  }));
  return (
    <div>
      <AllProductTable products={serializedProducts} />
    </div>
  );
};
export default AllProductPage;
