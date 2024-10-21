"use server";
import { addBrandQ, updateBrandQ, deleteBrandQ, getAllBrandQ } from "../db/queries";
import { BrandInsertType, BrandType } from "../db/schema";
export const addBrand=async (brand: BrandInsertType)=>{
    await addBrandQ(brand);
}
export const updateBrand= async (brand: BrandType)=>{
    await updateBrandQ(brand);
}
export const deleteBrand=async(id:number)=>{
    await deleteBrandQ(id);
}
export const getAllBrands= async ()=>{
    await getAllBrandQ();
}