"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductDetail } from "@/utils/types";
import { updateProductDetails } from "@/server/db/queries";
import { useState } from "react";
import Spinning from "@/lib/svg/Spinning";
import { Trash2 } from "lucide-react";

const variationSchema = z.object({
  variations: z.array(z.object({
    id: z.number(),
    price: z.string().min(1, "Price is required"),
    stock: z.string().min(1, "Stock is required"),
    status: z.string().min(1, "Status is required"),
    potency: z.string().optional(),
    capsuleCount: z.string().optional(),
  }))
});

interface EditProductVariationsProps {
  details: ProductDetail[];
}

const statusOptions = ["In Stock", "Low Stock", "Out of Stock"];

export default function EditProductVariations({ details }: EditProductVariationsProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof variationSchema>>({
    resolver: zodResolver(variationSchema),
    defaultValues: {
      variations: details.map(detail => ({
        id: detail.id,
        price: detail.price.toString(),
        stock: detail.stock.toString(),
        status: detail.status,
        potency: detail.potency || "",
        capsuleCount: detail.capsuleCount?.toString() || "",
      }))
    },
  });

  const { fields, remove } = useFieldArray({
    control: form.control,
    name: "variations"
  });

  const onSubmit = async (values: z.infer<typeof variationSchema>) => {
    setIsLoading(true);
    try {
      const updatePromises = values.variations.map(variation => 
        updateProductDetails({
          id: variation.id,
          price: parseFloat(variation.price),
          stock: parseInt(variation.stock),
          status: variation.status,
          potency: variation.potency || null,
          capsuleCount: variation.capsuleCount ? parseInt(variation.capsuleCount) : null,
        })
      );
      await Promise.all(updatePromises);
      // Add success toast
    } catch (error) {
      console.error('Failed to update variations:', error);
      // Add error toast
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {fields.map((field, index) => (
          <div key={field.id} className="relative grid gap-4 rounded-lg border p-4">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2"
              onClick={() => remove(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name={`variations.${index}.price`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name={`variations.${index}.stock`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name={`variations.${index}.status`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {statusOptions.map(status => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`variations.${index}.potency`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Potency</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`variations.${index}.capsuleCount`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capsule Count</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        ))}

        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Spinning /> Updating...
            </>
          ) : (
            "Update Variations"
          )}
        </Button>
      </form>
    </Form>
  );
} 