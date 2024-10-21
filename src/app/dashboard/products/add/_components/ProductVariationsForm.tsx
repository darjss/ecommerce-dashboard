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

interface Variation {
  id: number;
  name: string;
  capsuleCount: number;
  potency: string;
  price: string;
  stock: number;
  isDefault: boolean;
}

interface ProductVariationsFormProps {
  variations: Variation[];
  addVariation: () => void;
  removeVariation: (id: number) => void;
}

export default function ProductVariationsForm({
  variations,
  addVariation,
  removeVariation,
}: ProductVariationsFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Variations</CardTitle>
        <CardDescription>Manage the variations of your product</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {variations.map((variation, index) => (
          <div key={variation.id} className="space-y-4 rounded-lg border p-4">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor={`variation-name-${variation.id}`}>
                  Variation Name
                </Label>
                <Input
                  id={`variation-name-${variation.id}`}
                  name={`variations[${index}].name`}
                  type="text"
                  placeholder="Enter variation name"
                  defaultValue={variation.name}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`capsule-count-${variation.id}`}>
                  Capsule Count
                </Label>
                <Input
                  id={`capsule-count-${variation.id}`}
                  name={`variations[${index}].capsuleCount`}
                  type="number"
                  placeholder="Enter capsule count"
                  defaultValue={variation.capsuleCount}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`potency-${variation.id}`}>Potency</Label>
                <Input
                  id={`potency-${variation.id}`}
                  name={`variations[${index}].potency`}
                  type="text"
                  placeholder="Enter potency"
                  defaultValue={variation.potency}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`price-${variation.id}`}>Price</Label>
                <Input
                  id={`price-${variation.id}`}
                  name={`variations[${index}].price`}
                  type="number"
                  step="0.01"
                  placeholder="Enter price"
                  defaultValue={variation.price}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`stock-${variation.id}`}>Stock</Label>
                <Input
                  id={`stock-${variation.id}`}
                  name={`variations[${index}].stock`}
                  type="number"
                  placeholder="Enter stock"
                  defaultValue={variation.stock}
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
                    onClick={() => removeVariation(variation.id)}
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Remove
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full"
          onClick={addVariation}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Variation
        </Button>
      </CardFooter>
    </Card>
  );
}
