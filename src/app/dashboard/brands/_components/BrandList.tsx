import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BrandType } from "@/server/db/schema";
import BrandActions from "./BrandActions";

interface BrandListProps {
  brands: BrandType[];
}

export default function BrandList({ brands }: BrandListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Brand List</CardTitle>
        <CardDescription>Manage your existing brands</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Logo URL</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {brands.map((brand) => (
              <TableRow key={brand.id}>
                <TableCell>{brand.id}</TableCell>
                <TableCell>{brand.name}</TableCell>
                <TableCell>
                  {brand.logoUrl.length > 30
                    ? brand.logoUrl.substring(0, 30) + "..."
                    : brand.logoUrl}
                </TableCell>
                <TableCell>
                  <BrandActions brand={brand} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
