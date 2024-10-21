"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronRight, Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Product, ProductDetail } from "@/utils/types";
import { ProductTableHead } from "@/utils/data";
import { setTimeout } from "timers/promises";

const ProductRow = ({
  product,
  expanded,
  onToggle,
}: {
  product: Product;
  expanded: boolean;
  onToggle: () => void;
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleteModalOpen(false);
    router.refresh();
  };

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

  return (
    <>
      <TableRow>
        <TableCell>
          <Button variant="ghost" onClick={onToggle}>
            {expanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </TableCell>
        <TableCell className="font-medium">
          <div className="flex items-center">
            <img
              src={product.image_url}
              alt="Product Image"
              className="mr-2 h-10 w-10 rounded-md object-cover"
            />
            {product.name}
          </div>
        </TableCell>
        <TableCell>{product.brand}</TableCell>
        <TableCell>{product.category}</TableCell>
        <TableCell>${product.details[0]?.price}</TableCell>
        <TableCell>{product.details[0]?.stock}</TableCell>
        <TableCell>
          <Badge variant={getStatusVariant(product.details[0]?.status || "")}>
            {product.details[0]?.status}
          </Badge>
        </TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() =>
                  router.push(`/dashboard/products/edit/${product.id}`)
                }
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsDeleteModalOpen(true)}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
                    {ProductTableHead.map((head) => (
                      <TableHead key={head.id}>{head.name}</TableHead>
                    ))}
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {product.details.map((detail: ProductDetail) => (
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
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="fledx h-8 w-8 justify-center p-0"
                            >
                              <span className="sr-only">Open menu</span>
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(
                                  `/dashboard/products/edit/${product.id}/${detail.id}`,
                                )
                              }
                            >
                              Edit Variation
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setIsDeleteModalOpen(true)}
                            >
                              Delete Variation
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
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
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductRow;
