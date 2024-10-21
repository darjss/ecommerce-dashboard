import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/utils/types";

interface GridCardProps {
  product: Product;
}

export function GridCard({ product }: GridCardProps) {
  const router = useRouter();

  const getStatusVariant = (
    status: string,
  ): "default" | "secondary" | "destructive" => {
    switch (status.toLowerCase()) {
      case "in stock":
        return "default";
      case "low stock":
        return "secondary";
      case "out of stock":
        return "destructive";
      default:
        return "default";
    }
  };

  const mainDetail = product.details[0]; // Assuming the first detail is the main one

  return (
    <Card>
      <CardHeader>
        <img
          src={product.image_url}
          alt={product.name}
          className="h-40 w-full rounded-t-lg object-cover"
        />
      </CardHeader>
      <CardContent>
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-sm text-muted-foreground">{product.brand}</p>
        <div className="mt-2 flex items-center justify-between">
          <p className="font-medium">${mainDetail?.price}</p>
          <Badge variant={getStatusVariant(mainDetail?.status || "")}>
            {mainDetail?.status}
          </Badge>
        </div>
        <p className="mt-2 text-sm">Stock: {mainDetail?.stock}</p>
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => router.push(`/dashboard/products/edit/${product.id}`)}
        >
          Edit
        </Button>
      </CardFooter>
    </Card>
  );
}
