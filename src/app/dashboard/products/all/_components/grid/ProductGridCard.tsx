"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/utils/types";
import EditStockDialog from "../edit/EditStockDialog";
import { getStatusVariant } from "@/utils/helper";
import { ProductDetailsType } from "@/server/db/schema";
import ProductActions from "../ProductActions";

interface GridCardProps {
  product: Product;
}

export function GridCard({ product }: GridCardProps) {
  const mainDetail = product.details[0] || ({} as ProductDetailsType);

  return (
    <Card>
      <CardHeader>
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-40 w-full rounded-t-lg object-contain"
        />
      </CardHeader>
      <CardContent>
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-sm text-muted-foreground">{product.brandName}</p>
        <div className="mt-2 flex items-center justify-between">
          <p className="font-medium">${mainDetail.price}</p>
          <Badge variant={getStatusVariant(mainDetail.status)}>
            {mainDetail.status}
          </Badge>
        </div>
        <p className="mt-2 text-sm">Stock: {mainDetail.stock}</p>
      </CardContent>
      <CardFooter>
        <EditStockDialog details={product.details} />
        <ProductActions product={product} />
      </CardFooter>
    </Card>
  );
}
