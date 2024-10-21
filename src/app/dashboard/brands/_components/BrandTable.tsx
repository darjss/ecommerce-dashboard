import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Plus, Search, Edit, Trash2, ChevronDown } from "lucide-react"
import { brands } from "@/utils/data";

const BrandTable = () => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead className="w-[100px]">Logo</TableHead>
        <TableHead>Name</TableHead>
        <TableHead>Products</TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {brands.map((brand) => (
        <TableRow key={brand.name}>
          <TableCell>
            <img
              src={brand.logo}
              alt={`${brand.name} logo`}
              className="h-10 w-10 rounded-full"
            />
          </TableCell>
          <TableCell className="font-medium">{brand.name}</TableCell>
          <TableCell>{brand.products}</TableCell>
          <TableCell className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);
export default BrandTable;
