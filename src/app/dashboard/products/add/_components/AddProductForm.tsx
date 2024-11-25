import { ProductDetailsForm } from "./ProductDetailsForm";
import ProductVariationsForm from "./ProductVariationsForm";
import ProductImagesForm from "./ProductImagesForm";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ProductSearch } from "./ProductSearch";
import { BrandType, CategoryType } from "@/server/db/schema";
import AddProductButton from "./AddProductButton";

interface AddProductFormProps {
  brands: BrandType[];
  categories: CategoryType[];
}

export default async function AddProductForm({
  brands,
  categories,
}: AddProductFormProps) {
  return (
    <div className="container mx-auto max-w-4xl space-y-8 px-4 py-6">
      <Card>
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl md:text-3xl">
            Add New Product
          </CardTitle>
          <CardDescription className="text-sm md:text-base">
            Search Amazon or upload your own images
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <ProductSearch />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or
              </span>
            </div>
          </div>

          <div className="space-y-8">
            <ProductDetailsForm brands={brands} categories={categories} />
            <ProductVariationsForm />
            <ProductImagesForm />
          </div>

          <div className="sticky bottom-4 mt-8 flex justify-center pt-4">
            <AddProductButton />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
