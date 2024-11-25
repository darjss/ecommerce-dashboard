
import { getCategories } from '@/server/db/queries'
import CategoryManager from './_components/CategoryManager'

export default async function CategorysPage() {
  const categories = await getCategories();

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Category Management</h1>
      <CategoryManager Categories={categories} />
    </div>
  )
}
