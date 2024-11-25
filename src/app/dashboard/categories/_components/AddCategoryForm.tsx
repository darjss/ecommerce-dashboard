"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface AddCategoryFormProps {
  action: (formData: FormData) => void;
  isPending: boolean;
}

export default function AddCategoryForm({
  action,
  isPending,
}: AddCategoryFormProps) {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Add New Category</CardTitle>
        <CardDescription>Enter the details of the new category</CardDescription>
      </CardHeader>
      <form action={action}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name</Label>
            <Input id="name" name="name" required disabled={isPending} />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              "Add Category"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
