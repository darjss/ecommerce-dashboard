import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import getQueryClient from "@/lib/getQueryClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import BrandsSection from "./_components/BrandsSection";
import CategoriesSection from "./_components/CategoriesSection";
import { getAllBrands } from "@/server/actions/brands";
import { getAllCategories } from "@/server/actions/categories";

export default async function Page() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["brands"],
    queryFn: getAllBrands,
  });
  await queryClient.prefetchQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
  });
  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <div className="bg-background p-6">
        <Tabs defaultValue="brands" className="w-full">
          <TabsList>
            <TabsTrigger value="brands">Brands</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>
          <TabsContent value="brands">
            <BrandsSection />
          </TabsContent>
          <TabsContent value="categories">
            <CategoriesSection />
          </TabsContent>
        </Tabs>
      </div>
    </HydrationBoundary>
  );
}
