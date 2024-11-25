import { LucideIcon } from "lucide-react";
import {
  ProductInsertType,
  ProductDetailsInsertType,
  ProductImagesInsertType,
  ProductType,
  ProductDetailsType,
  ProductImagesType,
  CategoryType,
  BrandType,
} from "@/server/db/schema";

export interface AmazonScrapeProduct {
  productName: string;
  productUrl: string;
  thumbnailUrl: string;
}

export interface AmazonProductDetails {
  productName: string;
  price: string;
  description: string[];
  mainImageUrl: string | undefined;
  additionalImages: string[];
}


export interface AddProductType {
  name: string;
  description: string;
  brandId: string;
  categoryId: string;
  productId: string;
  price: string;
  stock: number;
  status: string;
  capsuleCount?: number;
  potency?: string;
  imageUrl: string;
  isMain: boolean;
}

export interface CompleteProductInsertType {
  general: ProductInsertType;
  variations: ProductDetailsInsertType[];
  images: ProductImagesInsertType[];
}
export interface CompleteProductType {
  general: ProductType;
  details: ProductDetailsType[];
  images: ProductImagesType[];
}

export interface ActionResult {
  error: string;
}

export interface ProductDetail{
  id: number;
  productId: number;
  price: string;
  stock: number;
  status: string;
  capsuleCount: number;
  potency: string;
  createdAt: string;  
  updatedAt: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  details: ProductDetail[];
  imageUrl: string;
  brandName: string;
  categoryName: string;
}
export interface NavItem {
  icon: LucideIcon;
  label: string;
}
export type SortField = keyof ProductDetailsType;

export type SortOrder = "asc" | "desc";

export type Sort = {
  field: SortField;
  order: SortOrder;
};

export type Filter = {
  category: string | null;
  status: string | null;
  brand: string | null;
};



export type ViewMode = "table" | "grid";
