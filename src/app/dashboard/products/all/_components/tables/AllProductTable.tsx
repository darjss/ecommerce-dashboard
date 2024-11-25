"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GridView } from "../grid/GridView";
import { TableView } from "./TableView";
import { Product, ViewMode } from "@/utils/types";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Link } from "next-view-transitions";
import { PlusCircle, List, Grid } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AllProductTable({ products }: { products: Product[] }) {
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [searchTerm, setSearchTerm] = useState<string>("");

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Products</CardTitle>
        <CardDescription>
          Manage your product catalog and inventory.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
            <Input
              placeholder="Search products..."
              className="w-full sm:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setViewMode("table")}
            >
              <List
                className={`h-4 w-4 ${viewMode === "table" ? "text-primary" : ""}`}
              />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <Grid
                className={`h-4 w-4 ${viewMode === "grid" ? "text-primary" : ""}`}
              />
            </Button>
            <Link href="/dashboard/products/add">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </Link>
          </div>
        </div>
        {(viewMode === "table" && (
          <TableView
            products={products}
            expandedProducts={new Set()}
            onToggleExpand={() => {}}
          />
        )) ||
          (viewMode === "grid" && <GridView products={products} />)}
      </CardContent>
    </Card>
  );
}
