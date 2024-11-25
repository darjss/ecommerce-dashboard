"use server";
import "server-only";
import {
  CompleteProductInsertType,
  Product,
} from "@/utils/types";
import { db } from ".";
import {
  users,
  products,
  productDetails,
  productImages,
  ProductInsertType,
  brands,
  BrandType,
  categories,
  CategoryType,
  ProductDetailsType,
} from "./schema";
import { eq, and } from "drizzle-orm";
import { cache } from "react";
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
    id: Number(id),
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

export const addBrand = async (prevState: any, formData: FormData) => {
  try {
    const name = formData.get("name") as string;
    const logoUrl = formData.get("logoUrl") as string;
    await db.insert(brands).values({ name, logoUrl });
    revalidatePath("/dashboard/brands");
    return { message: "Brand added successfully" };
  } catch (error) {
    return { error: "Failed to add brand" };
  }
};

export const updateBrand = async (prevState: any, formData: FormData) => {
  try {
    const id = parseInt(formData.get("id") as string);
    const name = formData.get("name") as string;
    const logoUrl = formData.get("logoUrl") as string;
    await db.update(brands).set({ name, logoUrl }).where(eq(brands.id, id));
    revalidatePath("/dashboard/brands");
    return { message: "Brand updated successfully" };
  } catch (error) {
    return { error: "Failed to update brand" };
  }
};

export const deleteBrand = async (prevState: any, formData: FormData) => {
  try {
    const id = parseInt(formData.get("id") as string);
    await db.delete(brands).where(eq(brands.id, id));
    revalidatePath("/dashboard/brands");
    return { message: "Brand deleted successfully" };
  } catch (error) {
    return { error: "Failed to delete brand" };
  }
};

export const getAllBrands = cache(async (): Promise<BrandType[]> => {
  try {
    return await db.select().from(brands);
  } catch (error) {
    console.error("Failed to fetch brands:", error);
    return [];
  }
});

export const addCategory = async (prevState: any, formData: FormData) => {
  try {
    const name = formData.get("name") as string;
    await db.insert(categories).values({ name });
    revalidatePath("/dashboard/categories");
    return { message: "Category added successfully" };
  } catch (error) {
    return { error: "Failed to add category" };
  }
};

export const updateCategory = async (prevState: any, formData: FormData) => {
  try {
    const id = parseInt(formData.get("id") as string);
    const name = formData.get("name") as string;
    await db.update(categories).set({ name }).where(eq(categories.id, id));
    revalidatePath("/dashboard/categories");
    return { message: "Category updated successfully" };
  } catch (error) {
    return { error: "Failed to update category" };
  }
};

export const deleteCategory = async (prevState: any, formData: FormData) => {
  try {
    const id = parseInt(formData.get("id") as string);
    await db.delete(categories).where(eq(categories.id, id));
    revalidatePath("/dashboard/categories");
    return { message: "Category deleted successfully" };
  } catch (error) {
    return { error: "Failed to delete category" };
  }
};

export const getCategories = cache(async (): Promise<CategoryType[]> => {
  try {
    return await db.select().from(categories);
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
});

export const addProduct = async (
  productComplete: CompleteProductInsertType,
) => {
  try {
    const { general, variations, images } = productComplete;
    console.log("images", images);
    return await db.transaction(async (tx) => {
      // Insert the main product
      const result = await tx
        .insert(products)
        .values(general)
        .returning({ id: products.id });

      if (!result || result.length === 0) {
        throw new Error("Failed to insert product");
      }

      const newProductId = result[0]?.id as number;
      const variationImages = images.map((image) => ({
        imageUrl: image.imageUrl,
        isMain: image.isMain,
        productId: newProductId,
      }));
      for (const image of variationImages) {
        await tx.insert(productImages).values(image);
      }
      // Insert variations and store their IDs
      for (const variation of variations) {
        const detailResult = await tx
          .insert(productDetails)
          .values({
            ...variation,
            productId: newProductId,
          })
          .returning({ id: productDetails.id });
      }

      redirect("/dashboard/products");
      return true;
    });
  } catch (error) {
    console.error("Error adding product:", error);
    return false;
  }
};

export const getProducts = async (): Promise<Product[]> => {
  const rawData = await db
    .select({
      id: products.id,
      name: products.name,
      description: products.description,
      brandName: brands.name,
      categoryName: categories.name,
      detailId: productDetails.id,
      price: productDetails.price,
      stock: productDetails.stock,
      status: productDetails.status,
      capsuleCount: productDetails.capsuleCount,
      potency: productDetails.potency,
      imageUrl: productImages.imageUrl,
    })
    .from(products)
    .leftJoin(brands, eq(products.brandId, brands.id))
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .leftJoin(productDetails, eq(products.id, productDetails.productId))
    .leftJoin(
      productImages,
      and(
        eq(products.id, productImages.productId),
        eq(productImages.isMain, true),
      ),
    );

  // Convert to plain objects
  const productsMap = new Map<number, Product>();

  rawData.forEach((row) => {
    if (!productsMap.has(row.id)) {
      productsMap.set(row.id, {
        id: row.id,
        name: row.name,
        description: row.description,
        details: [],
        imageUrl: row.imageUrl || "placeholder.jpg",
        brandName: row.brandName || "",
        categoryName: row.categoryName || "",
      });
    }

    const product = productsMap.get(row.id)!;

    if (row.detailId && !product.details.some((d) => d.id === row.detailId)) {
      // Create a plain object for details
      product.details.push({
        id: row.detailId,
        price: row.price || "",
        stock: row.stock || 0,
        status: row.status || "",
        capsuleCount: row.capsuleCount || 0,
        potency: row.potency || "",
        productId: row.id,
        createdAt: "",
        updatedAt: "",
      });
    }
  });

  return Array.from(productsMap.values());
};
export const deleteProduct = async (id: number) => {
  try {
    const productPromise = db.delete(products).where(eq(products.id, id));
    const imagesPromise = db
      .delete(productImages)
      .where(eq(productImages.productId, id));
    const detailsPromise = db
      .delete(productDetails)
      .where(eq(productDetails.productId, id));
    await Promise.all([productPromise, imagesPromise, detailsPromise]);
  } catch (error) {
    console.error("Error deleting product:", error);
    return false;
  }

  revalidatePath("/dashboard/products");
};

export const updateProductDetails = async (details: ProductDetailsType) => {
  try {
    const productDetail = await db
      .update(productDetails)
      .set(details)
      .where(eq(productDetails.id, details.id));
    return productDetail;
  } catch (error) {
    console.error("Error updating product details:", error);
    return false;
  }
};
