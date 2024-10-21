import { Filter, Sort } from "@/utils/types";
import { db } from ".";
import {
  users,
  products,
  productDetails,
  productImages,
  ProductType,
  ProductInsertType,
  ProductDetailsInsertType,
  ProductDetailsType,
  ProductImagesInsertType,
  ProductImagesType,
} from "./schema";
import { eq } from "drizzle-orm";

export const getUserByusername = async (username: string) => {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.username, username));
  return user;
};
export const createUser = async (
  id: string,
  username: string,
  password: string,
) => {
  const user = await db.insert(users).values({
    id: id,
    username: username,
    password: password,
  });
  return user;
};

export const insertProduct = async (product: ProductInsertType) => {
  const insertedProduct = await db
    .insert(products)
    .values(product)
    .returning({ id: products.id });
  return insertedProduct[0]?.id;
};

export const insertProductDetails = async (
  productDetailArray: ProductDetailsInsertType[],
) => {
  for (let productDetail of productDetailArray) {
    const insertedProductDetails = await db
      .insert(productDetails)
      .values(productDetail)
      .returning({ id: productDetails.id });
  }
};

export const insertProductImages = async (
  productImageArray: ProductImagesInsertType[],
) => {
  for (let productImage of productImageArray) {
    const insertedProductImages = await db
      .insert(productImages)
      .values(productImage)
      .returning({ id: productImages.id });
  }
};

// export const getProducts= async(filter: Filter, sort: Sort, page: number, limit: number) => {

// }

export const addBrand= async( brand:)