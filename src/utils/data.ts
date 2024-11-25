import {
  Home,
  ShoppingCart,
  Package,
  Users2,
  LineChart,
  Settings,
  Tags,
  ListTree
} from "lucide-react";
import { NavItem, Product } from "@/utils/types";

export const navItems: NavItem[] = [
  { icon: Home, label: "Home" },
  { icon: ShoppingCart, label: "Orders" },
  { icon: Package, label: "Product" },
  { icon: Users2, label: "Customers" },
  { icon: Tags, label: "Brands" },
  { icon: ListTree, label: "Categories" },
  { icon: LineChart, label: "Analytics" },
  { icon: Settings, label: "Settings" },
];
export const brands=[
  {
    name: "Apple",
    products: 120,
    logo: "/placeholder.svg?height=40&width=40",
  },
  {
    name: "Samsung",
    products: 95,
    logo: "/placeholder.svg?height=40&width=40",
  },
  {
    name: "Sony",
    products: 78,
    logo: "/placeholder.svg?height=40&width=40",
  },
]
export const categories=[
  { name: "Electronics", products: 250 },
  { name: "Clothing", products: 180 },
  { name: "Home & Garden", products: 120 },
]
interface Order {
  customer: string;
  email: string;
  type: string;
  status: string;
  date: string;
  amount: string;
}

export const orders: Order[] = [
  {
    customer: "Liam Johnson",
    email: "liam@example.com",
    type: "Sale",
    status: "Fulfilled",
    date: "2023-06-23",
    amount: "250.00",
  },
  {
    customer: "Olivia Smith",
    email: "olivia@example.com",
    type: "Refund",
    status: "Declined",
    date: "2023-06-24",
    amount: "150.00",
  },
  {
    customer: "Noah Williams",
    email: "noah@example.com",
    type: "Subscription",
    status: "Fulfilled",
    date: "2023-06-25",
    amount: "350.00",
  },
  {
    customer: "Emma Brown",
    email: "emma@example.com",
    type: "Sale",
    status: "Fulfilled",
    date: "2023-06-26",
    amount: "450.00",
  },
  {
    customer: "Liam Johnson",
    email: "liam@example.com",
    type: "Sale",
    status: "Fulfilled",
    date: "2023-06-23",
    amount: "250.00",
  },
  {
    customer: "Liam Johnson",
    email: "liam@example.com",
    type: "Sale",
    status: "Fulfilled",
    date: "2023-06-23",
    amount: "250.00",
  },
  {
    customer: "Olivia Smith",
    email: "olivia@example.com",
    type: "Refund",
    status: "Declined",
    date: "2023-06-24",
    amount: "150.00",
  },
  {
    customer: "Emma Brown",
    email: "emma@example.com",
    type: "Sale",
    status: "Fulfilled",
    date: "2023-06-26",
    amount: "450.00",
  },
];

export const ProductTableHead = [
  { name: "Product", id: "product" },
  { name: "Brand", id: "brand" },
  { name: "Category", id: "category" },
  { name: "Price", id: "price" },
  { name: "Stock", id: "stock" },
  { name: "Status", id: "status" },
  { name: "Actions", id: "actions" },
];

export const products: Product[] = [
];
