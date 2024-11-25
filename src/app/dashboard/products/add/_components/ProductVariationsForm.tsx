'use client';

import { z } from 'zod';
import { PlusCircle, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAddProductStore from "@/utils/stores/addProduct";
import { useState } from "react";
import { ProductDetailsInsertType } from "@/server/db/schema";

type VariationFormType = {
  price: string;
  stock: number;
  status: "active" | "inactive";
  capsuleCount: number;
  potency: string;
};

export default function ProductVariationsForm() {
  const { variations, addVariation, updateVariation, removeVariation } = useAddProductStore();

  const [newVariation, setNewVariation] = useState<VariationFormType>({
    price: "",
    stock: 0,
    status: "active",
    capsuleCount: 0,
    potency: "",
  });

  const variationSchema = z.object({
    price: z.string().nonempty().refine((data) => !isNaN(parseFloat(data)), 'Price must be a number'),
    stock: z.number().int().positive(),
    status: z.string().nonempty().refine((data) => ['active', 'inactive'].includes(data), 'Status must be active or inactive'),
    capsuleCount: z.number().int().positive(),
    potency: z.string().nonempty(),
  });

  const validateVariation = (variation: VariationFormType): boolean => {
    return variationSchema.safeParse(variation).success;
  };


  const handleAddVariation = () => {
    console.log('Attempting to add variation:', newVariation);
    
    if (validateVariation(newVariation)) {
      addVariation({
        ...newVariation,
        productId: 0,
        price: parseFloat(newVariation.price).toString(),
      });
      
      // Reset form
      setNewVariation({
        price: "",
        stock: 0,
        status: "active",
        capsuleCount: 0,
        potency: "",
      });
    } else {
      alert("Please ensure:\n- Price is greater than 0\n- Stock is 0 or more\n- Capsule count is greater than 0\n- Potency is not empty");
    }
  };

  const handleUpdateVariation = (index: number, field: keyof VariationFormType, value: string | number) => {
    // For price, keep it as string but ensure it's a valid number
    if (field === 'price') {
      const numValue = value.toString();
      if (!isNaN(parseFloat(numValue))) {
        updateVariation(index, { [field]: numValue });
      }
      return;
    }
    
    // For number fields, ensure we're passing numbers
    if (field === 'stock' || field === 'capsuleCount') {
      const numValue = typeof value === 'string' ? parseInt(value, 10) : value;
      if (!isNaN(numValue)) {
        updateVariation(index, { [field]: numValue });
      }
      return;
    }
    
    // For other fields, pass the value as is
    updateVariation(index, { [field]: value });
  };

  const handleInputChange = (field: keyof VariationFormType, value: string | number) => {
    let processedValue: string | number = value;
    
    // Handle numeric fields
    if (field === 'stock' || field === 'capsuleCount') {
      processedValue = typeof value === 'string' ? parseInt(value, 10) || 0 : value;
    }
    
    setNewVariation(prev => ({
      ...prev,
      [field]: processedValue
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Variations</CardTitle>
        <CardDescription>Manage the variations of your product</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Existing variations */}
        {variations.map((variation, index) => (
          <div key={index} className="space-y-4 rounded-lg border p-4">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor={`capsule-count-${index}`}>Capsule Count</Label>
                <Input
                  id={`capsule-count-${index}`}
                  type="number"
                  min="1"
                  value={variation.capsuleCount ?? ""}
                  onChange={(e) => handleUpdateVariation(index, 'capsuleCount', e.target.value)}
                  placeholder="Enter capsule count"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`potency-${index}`}>Potency</Label>
                <Input
                  id={`potency-${index}`}
                  type="text"
                  value={variation.potency ?? ""}
                  onChange={(e) => handleUpdateVariation(index, 'potency', e.target.value)}
                  placeholder="Enter potency"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`price-${index}`}>Price</Label>
                <Input
                  id={`price-${index}`}
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={variation.price ?? ""}
                  onChange={(e) => handleUpdateVariation(index, 'price', e.target.value)}
                  placeholder="Enter price"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`stock-${index}`}>Stock</Label>
                <Input
                  id={`stock-${index}`}
                  type="number"
                  min="0"
                  value={variation.stock ?? ""}
                  onChange={(e) => handleUpdateVariation(index, 'stock', e.target.value)}
                  placeholder="Enter stock"
                  required
                />
              </div>
              <div className="flex items-end">
                {index === 0 ? (
                  <Badge>Default Variation</Badge>
                ) : (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeVariation(index)}
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Remove
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* New variation form */}
        <div className="space-y-4 rounded-lg border p-4 bg-gray-50">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="new-capsule-count">Capsule Count</Label>
              <Input
                id="new-capsule-count"
                type="number"
                min="1"
                value={newVariation.capsuleCount}
                onChange={(e) => handleInputChange('capsuleCount', e.target.value)}
                placeholder="Enter capsule count"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-potency">Potency</Label>
              <Input
                id="new-potency"
                type="text"
                value={newVariation.potency}
                onChange={(e) => handleInputChange('potency', e.target.value)}
                placeholder="Enter potency"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-price">Price</Label>
              <Input
                id="new-price"
                type="number"
                step="0.01"
                min="0.01"
                value={newVariation.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                placeholder="Enter price"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-stock">Stock</Label>
              <Input
                id="new-stock"
                type="number"
                min="0"
                value={newVariation.stock}
                onChange={(e) => handleInputChange('stock', e.target.value)}
                placeholder="Enter stock"
                required
              />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full"
          onClick={handleAddVariation}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Variation
        </Button>
      </CardFooter>
    </Card>
  );
}