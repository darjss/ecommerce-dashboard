import { useState } from "react";
import { ChevronDown, ChevronRight, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableCell,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Product } from "@/utils/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { m } from "framer-motion";
import { deleteProduct } from "@/server/db/queries";
import Spinning from "@/lib/svg/Spinning";
import { ProductDetailsType } from "@/server/db/schema";
import ProductActions from "../ProductActions";
import { getStatusVariant } from "@/utils/helper";

interface ProductRowProps {
  product: Product;
  expanded: boolean;
  onToggle: () => void;
}

export default function ProductRow({
  product,
  expanded,
  onToggle,
}: ProductRowProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    await deleteProduct(product.id);
    setIsLoading(false);
    setIsDeleteModalOpen(false);
  };

  const mainDetail = product.details[0] || ({} as ProductDetailsType);

  return (
    <>
      <TableRow>
        <TableCell>
          <Button variant="ghost" onClick={onToggle} size="sm">
            {expanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </TableCell>
        <TableCell>
          <div className="flex items-center">
            <img
              src={product.imageUrl}
              alt={product.name.substring(0, 10)}
              className="mr-2 h-10 w-10 rounded-md object-cover"
            />
            <span>{product.name}</span>
          </div>
        </TableCell>
        <TableCell>{product.brandName}</TableCell>
        <TableCell>{product.categoryName}</TableCell>
        <TableCell>${mainDetail.price}</TableCell>
        <TableCell>{mainDetail.stock}</TableCell>
        <TableCell>
          <Badge variant={getStatusVariant(mainDetail.status)}>
            {mainDetail.status}
          </Badge>
        </TableCell>
        <TableCell className="text-right">
          <ProductActions product={product} />
        </TableCell>
      </TableRow>
      {expanded && (
        <TableRow>
          <TableCell colSpan={8}>
            <div className="rounded-md bg-muted p-4">
              <h4 className="mb-2 font-semibold">Product Details</h4>
              <p className="mb-4 text-sm">{product.description}</p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Variation</TableHead>
                    <TableHead>Capsule Count</TableHead>
                    <TableHead>Potency</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* {product.map((product) => (
                      <TableRow key={detail.id}>
                        <TableCell>{detail.variationName}</TableCell>
                        <TableCell>{detail.capsuleCount || "N/A"}</TableCell>
                        <TableCell>{detail.potency || "N/A"}</TableCell>
                        <TableCell>${detail.price}</TableCell>
                        <TableCell>{detail.stock}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(detail.status)}>
                            {detail.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))} */}
                </TableBody>
              </Table>
            </div>
          </TableCell>
        </TableRow>
      )}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to delete this product?
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              product and remove the data from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinning />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
