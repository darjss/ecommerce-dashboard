import { create } from "zustand";
import { Product, SortField, SortOrder, Filter, ViewMode } from "@/utils/types";
import { products } from "@/utils/data";




interface ProductState {
  expandedProducts: Set<string>;
  searchTerm: string;
  filters: Filter;
  sortField: SortField;
  sortOrder: SortOrder;
  currentPage: number;
  viewMode: ViewMode;
  filteredAndSortedProducts: Product[];
  setSearchTerm: (term: string) => void;
  setFilters: (filters: Filter) => void;
  setSortField: (field: SortField) => void;
  setSortOrder: (order: SortOrder) => void;
  setCurrentPage: (updater: number | ((prev: number) => number)) => void;
  setViewMode: (mode: ViewMode) => void;
  toggleProductExpansion: (productId: string) => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
  expandedProducts: new Set<string>(),
  searchTerm: "",
  filters: {
    category: null,
    status: null,
    brand: null,
  },
  sortField: "price",
  sortOrder: "asc",
  currentPage: 1,
  viewMode: "table",
  filteredAndSortedProducts: [],

  setSearchTerm: (term) => set({ searchTerm: term }),

  setFilters: (filters) => set({ filters, currentPage: 1 }),

  setSortField: (field) => set({ sortField: field }),

  setSortOrder: (order) => set({ sortOrder: order }),

  setCurrentPage: (updater) =>
    set((state) => ({
      currentPage:
        typeof updater === "function" ? updater(state.currentPage) : updater,
    })),

  setViewMode: (mode) => set({ viewMode: mode }),

  toggleProductExpansion: (productId) =>
    set((state) => {
      const newExpandedProducts = new Set(state.expandedProducts);
      if (newExpandedProducts.has(productId)) {
        newExpandedProducts.delete(productId);
      } else {
        newExpandedProducts.add(productId);
      }
      return { expandedProducts: newExpandedProducts };
    }),
}));

// Add a selector to compute filteredAndSortedProducts
useProductStore.subscribe((state) => {
  const { searchTerm, filters, sortField, sortOrder } = state;
  const filteredAndSortedProducts = products
    .filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    .filter((product) =>
      filters.status
        ? product.details.some((detail) => detail.status === filters.status)
        : true,
    )
    .sort((a, b) => {
      const aDetail = a.details[0];
      const bDetail = b.details[0];

      if (!aDetail || !bDetail) return 0;

      const aValue = aDetail[sortField];
      const bValue = bDetail[sortField];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      }

      return sortOrder === "asc"
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });

  useProductStore.setState({ filteredAndSortedProducts });
});

// Utility function to get paginated products
export const getPaginatedProducts = (
  state: ProductState,
  itemsPerPage: number,
) => {
  const startIndex = (state.currentPage - 1) * itemsPerPage;
  return state.filteredAndSortedProducts.slice(
    startIndex,
    startIndex + itemsPerPage,
  );
};

// Utility function to get total pages
export const getTotalPages = (state: ProductState, itemsPerPage: number) => {
  return Math.ceil(state.filteredAndSortedProducts.length / itemsPerPage);
};
