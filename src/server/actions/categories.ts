"use server";
import { addCategoryQ, updateCategoryQ, deleteCategoryQ, getAllCategoryQ, getCategoryQ } from "../db/queries";
import {CategoryInsertType, CategoryType } from "../db/schema";
export const addCategory=async (category: CategoryInsertType)=>{    
    await addCategoryQ(category);
}
export const updateCategory= async (category: CategoryType)=>{
    await updateCategoryQ(category);
}
export const deleteCategory=async(id:number)=>{
    await deleteCategoryQ(id);
}
export const getAllCategories= async ()=>{
    await getAllCategoryQ();
}
export const getCategory= async (id:number)=>{
    await getCategoryQ(id);
}