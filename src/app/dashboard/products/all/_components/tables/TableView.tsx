import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Product } from "@/utils/types"
import ProductRow from "./ProductRow"

interface TableViewProps {
  products: Product[]
  expandedProducts: Set<string>
  onToggleExpand: (productId: string) => void
}

export function TableView({
  products,
  expandedProducts,
  onToggleExpand,
}: TableViewProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]"></TableHead>
          <TableHead>Product</TableHead>
          <TableHead>Brand</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <ProductRow
            key={product.id}
            product={product}
            expanded={expandedProducts.has(product.id+"")}
            onToggle={() => onToggleExpand(product.id+"")}
          />
        ))}
      </TableBody>
    </Table>
  )
}