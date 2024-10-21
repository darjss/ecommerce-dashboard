import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Product, ProductDetail } from "@/utils/types";
import { ProductTableHead } from "@/utils/data";
import ProductRow from "./ProductRow";

interface TableViewProps {
  products: Product[];
  expandedProducts: Set<string>;
  onToggleExpand: (productId: string) => void;
  onSort: (field: keyof ProductDetail) => void;
}

export function TableView({
  products,
  expandedProducts,
  onToggleExpand,
  onSort,
}: TableViewProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]"></TableHead>
          {ProductTableHead.map((head) => (
            <TableHead key={head.id} className="text-left">
              {head.id === "price" || head.id === "stock" ? (
                <Button
                  variant="ghost"
                  onClick={() => onSort(head.id as keyof ProductDetail)}
                  className="flex items-center p-0 font-bold hover:bg-transparent"
                >
                  {head.name}
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <span className="font-bold">{head.name}</span>
              )}
            </TableHead>
          ))}
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <ProductRow
            key={product.id}
            product={product}
            expanded={expandedProducts.has(product.id)}
            onToggle={() => onToggleExpand(product.id)}
          />
        ))}
      </TableBody>
    </Table>
  );
}
