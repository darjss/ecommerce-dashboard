import "server-only";
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
  BrandInsertType,
  brands,
  BrandType,
  CategoryInsertType,
  categories,
  CategoryType,
} from "./schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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

export const addBrandQ= async( brand:BrandInsertType)=>{
  try{
    const insertedBrand=await db.insert(brands).values(brand);
    redirect("/");  
  } catch (error: unknown) { 
    if (error instanceof Error) {
      throw new Error(error.message); // Properly handle the error
    } else {
      throw new Error('Unknown error occurred');
    }
  }
}

export const getBrandQ= async (id:number)=>{
  try {
    return await db.select().from(brands).where(eq(brands.id, id));
    redirect("/");
  } catch (error: unknown) { 
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('Unknown error occurred');
    }
  }
}

export const updateBrandQ= async (brand: BrandType)=>{
  try{
    const updatedBrand=await db.update(brands).set({
      name:brand.name,
      logo_url:brand.logo_url
    }).where(eq(brands.id,brand.id))
      redirect("/");
  } catch (error: unknown) { 
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('Unknown error occurred');
    }
  }
}
export const getAllBrandQ= async ()=>{
  try {
    return await db.select().from(brands);
  }catch (error: unknown) { 
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('Unknown error occurred');
    }
  }
}
export const deleteBrandQ= async (id: number)=>{
  try {
    await db.delete(brands).where(eq(brands.id, id))
    redirect("/");
  }catch (error: unknown) { 
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('Unknown error occurred');
    }
  }
}
export const addCategoryQ= async(category: CategoryInsertType)=>{
  try{
    await db.insert(categories).values(category);
    redirect("/");
  }catch (error: unknown) { 
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('Unknown error occurred');
    }
  }
}

export const getCategoryQ= async (id:number)=>{
  try {
    return await db.select().from(categories).where(eq(categories.id, id));
    redirect("/");
  } catch (error: unknown) { 
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('Unknown error occurred');
    }
  }
}

export const updateCategoryQ=async (category: CategoryType)=>{
    try{
      await db.update(categories).set({
        name: category.name
      }).where(eq(categories.id, category.id));
      redirect("/");
    }catch (error: unknown) { 
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error('Unknown error occurred');
      }
    }
}
export const deleteCategoryQ=async(id:number)=>{
  try{
    await db.delete(brands).where(eq(brands.id, id)); 
    redirect("/");
  }catch (error: unknown) { 
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('Unknown error occurred');
    }
  }
}

export const getAllCategoryQ= async ()=>{
  try {
    return await db.select().from(categories)
  }catch (error: unknown) { 
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('Unknown error occurred');
    }
  }
}