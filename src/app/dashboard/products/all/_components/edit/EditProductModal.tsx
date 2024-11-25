"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Product, ProductUpdateInput } from "@/utils/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EditProductDetails from "./EditProductDetails";
import EditProductVariations from "./EditProductVariations";
import EditProductImages from "./EditProductImages";
import { updateEntireProduct } from "@/server/db/queries";

interface EditProductModalProps {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditProductModal({ 
  product, 
  open, 
  onOpenChange 
}: EditProductModalProps) {
  const handleSubmit = async (data: ProductUpdateInput) => {
    try {
      await updateEntireProduct(data);
      onOpenChange(false); // Close modal on success
      // Add success toast
    } catch (error) {
      console.error('Failed to update product:', error);
      // Add error toast
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="variations">Variations</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
          </TabsList>
          <TabsContent value="details">
            <EditProductDetails product={product} />
          </TabsContent>
          <TabsContent value="variations">
            <EditProductVariations details={product.details} />
          </TabsContent>
          <TabsContent value="images">
            <EditProductImages images={product.images} productId={product.id} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
} 