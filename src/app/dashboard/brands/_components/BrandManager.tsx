'use client'

import { useActionState } from "react"
import { addBrand, updateBrand, deleteBrand } from "@/server/db/queries"
import { BrandType } from "@/server/db/schema"
import AddBrandForm from "./AddBrandForm"
import BrandList from "./BrandList"
import ActionAlert from "@/components/ActionAlert"
import { Loader2 } from "lucide-react"

interface BrandManagerProps {
  brands: BrandType[]
}

export default function BrandManager({ brands }: BrandManagerProps) {
  const [addState, addAction, isPendingAdd] = useActionState(addBrand, null)

  return (
    <div>
      <AddBrandForm action={addAction} isPending={isPendingAdd} />
      <ActionAlert state={addState} />

      {isPendingAdd && (
        <div className="mt-4 flex items-center justify-center">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Adding brand...</span>
        </div>
      )}

      <BrandList brands={brands} />
    </div>
  )
}
