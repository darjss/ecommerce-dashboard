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
import { Pencil, Trash } from "lucide-react";
import { CategoryType } from "@/server/db/schema";
import { Loader2 } from "lucide-react";

interface CategoryActionsProps {
  Category: CategoryType;
  updateAction: (formData: FormData) => void;
  deleteAction: (formData: FormData) => void;
  isPendingUpdate: boolean;
  isPendingDelete: boolean;
}

export default function CategoryActions({
  Category,
  updateAction,
  deleteAction,
  isPendingUpdate,
  isPendingDelete,
}: CategoryActionsProps) {
  return (
    <div className="flex items-center space-x-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            disabled={isPendingUpdate}
          >
            {isPendingUpdate ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Pencil className="h-4 w-4" />
            )}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Make changes to the Category here.
            </DialogDescription>
          </DialogHeader>
          <form action={updateAction}>
            <input type="hidden" name="id" value={Category.id} />
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`edit-name-${Category.id}`}>
                  Category Name
                </Label>
                <Input
                  id={`edit-name-${Category.id}`}
                  name="name"
                  defaultValue={Category.name}
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
        <input type="hidden" name="id" value={Category.id} />
        <Button
          type="submit"
          variant="outline"
          size="icon"
          disabled={isPendingDelete}
        >
          {isPendingDelete ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash className="h-4 w-4" aria-hidden="true" />
          )}
        </Button>
      </form>
    </div>
  );
}
