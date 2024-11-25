"use client";

import { useActionState } from "react";
import {
  addCategory,
  updateCategory,
  deleteCategory,
} from "@/server/db/queries";
import { CategoryType } from "@/server/db/schema";
import AddCategoryForm from "./AddCategoryForm";
import CategoryList from "./CategoryList";
import ActionAlert from "../../../../components/ActionAlert";
import { Loader2 } from "lucide-react";

interface CategoryManagerProps {
  Categories: CategoryType[];
}

export default function CategoryManager({ Categories }: CategoryManagerProps) {
  const [addState, addAction, isPendingAdd] = useActionState(addCategory, null);
  const [updateState, updateAction, isPendingUpdate] = useActionState(
    updateCategory,
    null,
  );
  const [deleteState, deleteAction, isPendingDelete] = useActionState(
    deleteCategory,
    null,
  );

  return (
    <div>
      <AddCategoryForm action={addAction} isPending={isPendingAdd} />
      <ActionAlert state={addState} />

      {isPendingAdd && (
        <div className="mt-4 flex items-center justify-center">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Adding Category...</span>
        </div>
      )}

      <CategoryList
        Categories={Categories}
        updateAction={updateAction}
        deleteAction={deleteAction}
        isPendingUpdate={isPendingUpdate}
        isPendingDelete={isPendingDelete}
      />

      {updateState && <ActionAlert state={updateState} />}
      {deleteState && <ActionAlert state={deleteState} />}
    </div>
  );
}
