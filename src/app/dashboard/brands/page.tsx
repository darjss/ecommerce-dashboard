
import { getAllBrands } from '@/server/db/queries'
import BrandManager from './_components/BrandManager'

export default async function BrandsPage() {
  const brands = await getAllBrands();

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Brand Management</h1>
      <BrandManager brands={brands} />
    </div>
  )
}
