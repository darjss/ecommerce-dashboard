"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ProductDetailsForm from "./ProductDetailsForm";
import ProductVariationsForm from "./ProductVariationsForm";
import ProductStatusForm from "./ProductStatusForm";
import ProductImagesForm from "./ProductImagesForm";

export default function AddProductForm() {
  const [variations, setVariations] = useState([
    {
      id: 1,
      name: "Default",
      capsuleCount: 30,
      potency: "500mg",
      price: "29.99",
      stock: 100,
      isDefault: true,
    },
  ]);

  const addVariation = () => {
    const newVariation = {
      id: variations.length + 1,
      name: `Variation ${variations.length + 1}`,
      capsuleCount: 30,
      potency: "",
      price: "",
      stock: 0,
      isDefault: false,
    };
    setVariations([...variations, newVariation]);
  };

  const removeVariation = (id: number) => {
    setVariations(variations.filter((v) => v.id !== id));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Here you would typically call your server action
    // For example: await addProduct(new FormData(event.currentTarget))
    console.log("Form submitted");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Add New Product</h1>
        <div className="flex items-center gap-4">
          <Badge variant="outline">Draft</Badge>
          <Button type="submit">Save Product</Button>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-[2fr_1fr]">
        <div className="space-y-8">
          <ProductDetailsForm />
          <ProductVariationsForm
            variations={variations}
            addVariation={addVariation}
            removeVariation={removeVariation}
          />
        </div>
        <div className="space-y-8">
          <ProductStatusForm />
          <ProductImagesForm />
        </div>
      </div>
    </form>
  );
}
