import {
  Home,
  ShoppingCart,
  Package,
  Users2,
  LineChart,
  Settings,
  Tags
} from "lucide-react";
import { NavItem, Product } from "@/utils/types";

export const navItems: NavItem[] = [
  { icon: Home, label: "Home" },
  { icon: ShoppingCart, label: "Orders" },
  { icon: Package, label: "Product" },
  { icon: Users2, label: "Customers" },
  {icon: Tags, label: "Brands"},
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
  {
    id: "1",
    name: "Premium Vitamin C",
    description: "High-quality Vitamin C supplement for immune support",
    brand: "HealthPlus",
    category: "Vitamins",
    image_url: "/placeholder.svg",
    details: [
      {
        id: "1a",
        variationName: "Standard",
        capsuleCount: 60,
        potency: "500mg",
        price: "29.99",
        stock: 500,
        status: "In Stock",
      },
      {
        id: "1b",
        variationName: "High Potency",
        capsuleCount: 30,
        potency: "1000mg",
        price: "39.99",
        stock: 250,
        status: "Low Stock",
      },
    ],
  },
  {
    id: "2",
    name: "Omega-3 Fish Oil",
    description:
      "Pure and potent Omega-3 fatty acids for heart and brain health",
    brand: "OceanLife",
    category: "Supplements",
    image_url: "/placeholder.svg",
    details: [
      {
        id: "2a",
        variationName: "Regular",
        capsuleCount: 90,
        potency: "1000mg",
        price: "19.99",
        stock: 250,
        status: "Low Stock",
      },
    ],
  },
  {
    id: "3",
    name: "Probiotic Complex",
    description: "Advanced probiotic blend for digestive health",
    brand: "GutHealth",
    category: "Digestive Health",
    image_url: "/placeholder.svg",
    details: [
      {
        id: "3a",
        variationName: "Daily",
        capsuleCount: 30,
        potency: "50 Billion CFU",
        price: "34.99",
        stock: 0,
        status: "Out of Stock",
      },
    ],
  },
  {
    id: "4",
    name: "Multivitamin Daily",
    description: "Comprehensive daily multivitamin for overall health",
    brand: "VitaEssentials",
    category: "Vitamins",
    image_url: "/placeholder.svg",
    details: [
      {
        id: "4a",
        variationName: "Men",
        capsuleCount: 60,
        potency: null,
        price: "24.99",
        stock: 750,
        status: "In Stock",
      },
      {
        id: "4b",
        variationName: "Women",
        capsuleCount: 60,
        potency: null,
        price: "24.99",
        stock: 800,
        status: "In Stock",
      },
    ],
  },
  {
    id: "5",
    name: "Protein Powder",
    description:
      "High-quality protein supplement for muscle recovery and growth",
    brand: "FitFuel",
    category: "Sports Nutrition",
    image_url: "/placeholder.svg",
    details: [
      {
        id: "5a",
        variationName: "Chocolate",
        capsuleCount: null,
        potency: "25g per serving",
        price: "39.99",
        stock: 100,
        status: "Low Stock",
      },
      {
        id: "5b",
        variationName: "Vanilla",
        capsuleCount: null,
        potency: "25g per serving",
        price: "39.99",
        stock: 150,
        status: "In Stock",
      },
    ],
  },
];
