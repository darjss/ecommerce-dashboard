"use client";

import { useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PlusCircle, List, Grid } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SortField, Filter, ViewMode } from "@/utils/types";
import { Link } from "next-view-transitions";
import { GridView } from "./GridView";
import { TableView } from "./TableView";
import { ITEMS_PER_PAGE } from "@/utils/constants";
import { useProductStore } from "@/utils/store";

export default function ProductDashboard() {
  const router = useRouter();

  const {
    expandedProducts,
    searchTerm,
    filters,
    sortField,
    sortOrder,
    currentPage,
    viewMode,
    filteredAndSortedProducts,
    setSearchTerm,
    setFilters,
    setSortField,
    setSortOrder,
    setCurrentPage,
    setViewMode,
    toggleProductExpansion,
  } = useProductStore();

  const categories = useMemo(() => {
    return Array.from(
      new Set(filteredAndSortedProducts.map((product) => product.category)),
    );
  }, [filteredAndSortedProducts]);

  const brands = useMemo(() => {
    return Array.from(
      new Set(filteredAndSortedProducts.map((product) => product.brand)),
    );
  }, [filteredAndSortedProducts]);

  const statuses = useMemo(() => {
    return Array.from(
      new Set(
        filteredAndSortedProducts.flatMap((product) =>
          product.details.map((detail) => detail.status),
        ),
      ),
    );
  }, [filteredAndSortedProducts]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedProducts.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE,
    );
  }, [filteredAndSortedProducts, currentPage]);

  const totalPages = Math.ceil(
    filteredAndSortedProducts.length / ITEMS_PER_PAGE,
  );

  const updateQueryParams = () => {
    const params = new URLSearchParams();
    if (searchTerm) params.set("search", searchTerm);
    if (filters.category) params.set("category", filters.category);
    if (filters.status) params.set("status", filters.status);
    if (filters.brand) params.set("brand", filters.brand);
    params.set("sort", sortField);
    params.set("order", sortOrder);
    params.set("page", currentPage.toString());
    params.set("view", viewMode);
    router.push(`?${params.toString()}`);
  };

  useEffect(() => {
    updateQueryParams();
  }, [searchTerm, filters, sortField, sortOrder, currentPage, viewMode]);

  const handleSort = (field: SortField) => {
    setSortField(field);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleFilterChange = (key: keyof Filter, value: string | null) => {
    setFilters({ ...filters, [key]: value });
    setCurrentPage(1);
  };

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
            <Select
              value={filters.category || "all"}
              onValueChange={(value) =>
                handleFilterChange("category", value === "all" ? null : value)
              }
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filters.status || "all"}
              onValueChange={(value) =>
                handleFilterChange("status", value === "all" ? null : value)
              }
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filters.brand || "all"}
              onValueChange={(value) =>
                handleFilterChange("brand", value === "all" ? null : value)
              }
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by brand" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Brands</SelectItem>
                {brands.map((brand) => (
                  <SelectItem key={brand} value={brand}>
                    {brand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              <Button type="submit">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </Link>
          </div>
        </div>
        {viewMode === "table" ? (
          <TableView
            products={paginatedProducts}
            expandedProducts={expandedProducts}
            onToggleExpand={toggleProductExpansion}
            onSort={handleSort}
          />
        ) : (
          <GridView products={paginatedProducts} />
        )}
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {paginatedProducts.length} of{" "}
          {filteredAndSortedProducts.length} products
        </p>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
