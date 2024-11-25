import { getAllBrands, getCategories } from "@/server/db/queries"
import AddProductForm from "./_components/AddProductForm"

const AddProductPage = async () => {
  const [brands, categories] = await Promise.all([getAllBrands(), getCategories()])

  return (  
    <div>
      <AddProductForm brands={brands} categories={categories} />
    </div>
  )
}

export default AddProductPage