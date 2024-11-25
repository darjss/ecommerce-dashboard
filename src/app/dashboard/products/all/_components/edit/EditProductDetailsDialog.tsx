"use client";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Spinning from "@/lib/svg/Spinning";
import { updateProductDetails } from "@/server/db/queries";
import { ProductDetail } from "@/utils/types";

interface EditProductDetailsDialogProps {
  details: ProductDetail[];
}

interface ProductUpdate {
  id: number;
  quantity: number;
  name: string;
  price: number;
  imageUrl: string;
}

export default function EditProductDetailsDialog({ details }: EditProductDetailsDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [productUpdates, setProductUpdates] = useState<ProductUpdate[]>([]);

  const handleUpdateProduct = async () => {
    setIsLoading(true);
    try {
      const updatePromises = productUpdates.map((update) => 
        updateProductDetails({
          id: update.id,
          quantity: update.quantity,
          name: update.name,
          price: update.price,
          imageUrl: update.imageUrl,
        })
      );
      await Promise.all(updatePromises);
      setOpen(false); // Close dialog after successful update
      setProductUpdates([]); // Reset the form
    } catch (error) {
      console.error('Failed to update product details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductChange = (detailId: number, field: keyof ProductUpdate, value: string | number) => {
    setProductUpdates((prev) => {
      const exists = prev.find((update) => update.id === detailId);
      if (exists) {
        return prev.map((update) =>
          update.id === detailId
            ? { ...update, [field]: value }
            : update,
        );
      }
      return [...prev, { id: detailId, [field]: value } as ProductUpdate];
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          Edit Product Details
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Product Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          {details.map((detail) => (
            <div key={detail.id} className="grid gap-2">
              <Label className="font-medium">{detail.name}</Label>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={`name-${detail.id}`} className="text-right text-sm text-muted-foreground">
                  Name
                </Label>
                <Input
                  id={`name-${detail.id}`}
                  type="text"
                  value={detail.name}
                  onChange={(e) => handleProductChange(detail.id, 'name', e.target.value)}
                  className="col-span-3"
                />
                <Label htmlFor={`price-${detail.id}`} className="text-right text-sm text-muted-foreground">
                  Price
                </Label>
                <Input
                  id={`price-${detail.id}`}
                  type="number"
                  value={detail.price}
                  onChange={(e) => handleProductChange(detail.id, 'price', Number(e.target.value))}
                  className="col-span-3"
                />
                <Label htmlFor={`quantity-${detail.id}`} className="text-right text-sm text-muted-foreground">
                  Quantity
                </Label>
                <Input
                  id={`quantity-${detail.id}`}
                  type="number"
                  value={detail.stock}
                  onChange={(e) => handleProductChange(detail.id, 'quantity', Number(e.target.value))}
                  className="col-span-3"
                />
                <Label htmlFor={`image-${detail.id}`} className="text-right text-sm text-muted-foreground">
                  Image URL
                </Label>
                <Input
                  id={`image-${detail.id}`}
                  type="text"
                  value={detail.imageUrl}
                  onChange={(e) => handleProductChange(detail.id, 'imageUrl', e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button
            onClick={handleUpdateProduct}
            disabled={isLoading || productUpdates.length === 0}
          >
            {isLoading ? (
              <>
                <Spinning /> Updating...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 