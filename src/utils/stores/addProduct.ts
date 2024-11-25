import { create } from "zustand";
import { 
  ProductInsertType,
  ProductDetailsInsertType,
  ProductImagesInsertType,
  BrandType,
  CategoryType,
} from "@/server/db/schema";
import { CompleteProductInsertType } from "../types";

interface AddProductState extends ProductInsertType {
  // Product data
  variations: ProductDetailsInsertType[];
  images: ProductImagesInsertType[];
  productId: number;
  
  // Reference data
  brands: BrandType[];
  categories: CategoryType[];

  // Basic setters
  setName: (name: string) => void;
  setDescription: (description: string) => void;
  setBrandId: (brandId: number) => void;
  setCategoryId: (categoryId: number) => void;

  // Variation actions
  addVariation: (variation: Omit<ProductDetailsInsertType, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateVariation: (index: number | undefined, variation: Partial<ProductDetailsInsertType>) => void;
  removeVariation: (index: number) => void;

  // Image actions
  addImage: (image: ProductImagesInsertType) => void;
  updateImage: (index: number, image: ProductImagesInsertType) => void;
  removeImage: (index: number) => void;

  // Reference data actions
  setBrands: (brands: BrandType[]) => void;
  setCategories: (categories: CategoryType[]) => void;

  // Getters
  getBrands: () => BrandType[];
  getCategories: () => CategoryType[];
  getProduct: () => CompleteProductInsertType;
  getGeneralProduct: () => ProductInsertType;
  getDetailsProducts: () => ProductDetailsInsertType[];
  getImagesProducts: () => ProductImagesInsertType[];

  // Reset
  reset: () => void;
}

const initialState = {
  name: "",
  description: "",
  brandId: 0,
  categoryId: 0,
  variations: [],
  images: [],
  productId: 0,
  brands: [],
  categories: [],
};

const useAddProductStore = create<AddProductState>((set, get) => ({
  ...initialState,

  // Basic setters
  setName: (name) => set({ name }),
  setDescription: (description) => set({ description }),
  setBrandId: (brandId) => set({ brandId }),
  setCategoryId: (categoryId) => set({ categoryId }),

  // Variation actions
  addVariation: (variation) => 
    set((state) => ({
      variations: [...state.variations, {
        ...variation,
        id: undefined,
        createdAt: new Date(),
        updatedAt: null,
      }],
    })),

  updateVariation: (index, variation) =>
    set((state) => ({
      variations: state.variations.map((v, i) =>
        i === index ? { ...v, ...variation } : v
      ),
    })),

  removeVariation: (index) =>
    set((state) => ({
      variations: state.variations.filter((_, i) => i !== index),
    })),

  // Image actions
  addImage: (image) =>
    set((state) => ({ 
      images: [...state.images, image] 
    })),

  updateImage: (index, image) =>
    set((state) => ({
      images: state.images.map((img, i) => (i === index ? image : img)),
    })),

  removeImage: (index) =>
    set((state) => ({
      images: state.images.filter((_, i) => i !== index),
    })),

  // Reference data actions
  setBrands: (brands) => set({ brands }),
  setCategories: (categories) => set({ categories }),

  // Getters
  getBrands: () => get().brands,
  getCategories: () => get().categories,

  getGeneralProduct: () => {
    const { name, description, brandId, categoryId } = get();
    return { name, description, brandId, categoryId };
  },

  getProduct: () => {
    const { name, description, brandId, categoryId, variations, images } = get();
    return {
      general: { name, description, brandId, categoryId },
      variations,
      images,
    };
  },

  getDetailsProducts: () => get().variations,
  getImagesProducts: () => get().images,

  // Reset
  reset: () => set(initialState),
}));

export default useAddProductStore;