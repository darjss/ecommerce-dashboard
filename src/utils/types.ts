import { LucideIcon } from "lucide-react";
import {
  ProductInsertType,
  ProductDetailsInsertType,
  ProductImagesInsertType,
  ProductType,
  ProductDetailsType,
  ProductImagesType,
} from "@/server/db/schema";

export interface AmazonScrapeProduct {
  productName: string;
  productUrl: string;
  thumbnailUrl: string;
}

export interface AmazonProductImages {
  mainImageUrl: string;
  additionalImages: string[];
}

export interface CompleteProductInsertType {
  general: ProductInsertType;
  details: ProductDetailsInsertType[];
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
export interface ProductDetail {
  id: string;
  variationName: string;
  capsuleCount: number | null;
  potency: string | null;
  price: string;
  stock: number;
  status: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  brand: string;
  category: string;
  image_url: string;
  details: ProductDetail[];
}
export interface NavItem {
  icon: LucideIcon;
  label: string;
}
export type SortField = keyof ProductDetail;

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
