import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Trash, Loader2 } from "lucide-react";
import { BrandType } from "@/server/db/schema";
import { useActionState } from "react";
import { updateBrand, deleteBrand } from "@/server/db/queries";

interface BrandActionsProps {
  brand: BrandType;
}

export default function BrandActions({
  brand,
}: BrandActionsProps) {
  const [updateState, updateAction, isPendingUpdate] = useActionState(updateBrand, null);
  const [deleteState, deleteAction, isPendingDelete] = useActionState(deleteBrand, null);
  return (
    <div className="flex items-center space-x-2">
      <Dialog >
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="mr-2"
            disabled={isPendingUpdate}
          >
            {isPendingUpdate ? (
              <Loader2 className="h-10 w-10 animate-spin" />
            ) : (
              <Pencil className="h-4 w-4" />
            )}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Brand</DialogTitle>
            <DialogDescription>
              Make changes to the brand here.
            </DialogDescription>
          </DialogHeader>
          <form action={updateAction}>
            <input type="hidden" name="id" value={brand.id} />
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`edit-name-${brand.id}`}>Brand Name</Label>
                <Input
                  id={`edit-name-${brand.id}`}
                  name="name"
                  defaultValue={brand.name}
                  required
                  disabled={isPendingUpdate}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`edit-logo-${brand.id}`}>Logo URL</Label>
                <Input
                  id={`edit-logo-${brand.id}`}
                  name="logoUrl"
                  defaultValue={brand.logoUrl}
                  required
                  disabled={isPendingUpdate}
                />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="submit" disabled={isPendingUpdate}>
                {isPendingUpdate ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <form action={deleteAction}>
        <input type="hidden" name="id" value={brand.id} />
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="hover:bg-destructive hover:text-destructive-foreground"
              disabled={isPendingDelete}
            >
              {isPendingDelete ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash className="h-4 w-4" aria-hidden="true" />
              )}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this brand? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => {}}>Cancel</Button>
              <Button
                type="submit"
                variant="destructive"
                disabled={isPendingDelete}
              >
                {isPendingDelete ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </form>
    </div>
  );
}
