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
import { ProductDetailsType } from "@/server/db/schema";

interface EditStockDialogProps {
  details: ProductDetail[];
}



export default function EditStockDialog({ details }: EditStockDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [stockUpdates, setStockUpdates] = useState<ProductDetailsType[]>([]);

  const handleUpdateStock = async () => {
    setIsLoading(true);
    try {
      const updatePromises = stockUpdates.map((update) => 
        updateProductDetails(update)
      );
      await Promise.all(updatePromises);
      setOpen(false); // Close dialog after successful update
      setStockUpdates([]); // Reset the form
    } catch (error) {
      console.error('Failed to update stock:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStockChange = (detailId: number, newQuantity: number) => {
    setStockUpdates((prev) => {
      const exists = prev.find((update) => update.id === detailId);
      if (exists) {
        return prev.map((update) =>
          update.id === detailId
            ? { ...update, quantity: newQuantity }
            : update,
        );
      }
      return [...prev];
    });
  };

  const getUpdatedQuantity = (detailId: number, originalQuantity: number) => {
    const update = stockUpdates.find((update) => update.id === detailId);
    return update ? update.stock : originalQuantity;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          Edit Stock
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Stock Levels</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          {details.map((detail) => (
            <div key={detail.id} className="grid gap-2">
              <Label className="font-medium">
                {detail.potency && `${detail.potency} - `}
                {detail.capsuleCount && `${detail.capsuleCount} capsules`}
              </Label>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor={`stock-${detail.id}`}
                  className="text-right text-sm text-muted-foreground"
                >
                  Quantity
                </Label>
                <Input
                  id={`stock-${detail.id}`}
                  type="number"
                  value={getUpdatedQuantity(detail.id, detail.stock)}
                  onChange={(e) =>
                    handleStockChange(detail.id, Number(e.target.value))
                  }
                  className="col-span-3"
                />
              </div>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button
            onClick={handleUpdateStock}
            disabled={isLoading || stockUpdates.length === 0}
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
