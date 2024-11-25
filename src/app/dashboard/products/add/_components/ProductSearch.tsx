'use client'

import { useState, useTransition } from "react"
import { Search, Loader2, X, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getTopSearchResults, scrapeProductDetails } from "@/server/actions/images"
import useAddProductStore from "@/utils/stores/addProduct"
import { toast } from "sonner"

interface AmazonScrapeProduct {
  productName: string
  productUrl: string
  thumbnailUrl: string
}

export function ProductSearch() {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<AmazonScrapeProduct[]>([])
  const [isPending, startTransition] = useTransition()
  const { setName, addImage, reset } = useAddProductStore()

  const handleSearch = async (formData: FormData) => {
    const term = formData.get('searchTerm') as string
    if (!term.trim()) return

    startTransition(async () => {
      setSearchResults([])
      reset()

      try {
        const results = await getTopSearchResults(term)
        setSearchResults(results)
      } catch (err) {
        console.error("Search failed:", err)
        toast.error("Search Failed", {
          description: "An error occurred while searching for products. Please try again.",
        })
      }
    })
  }

  const handleProductSelect = async (product: AmazonScrapeProduct) => {
    startTransition(async () => {
      try {
        const details = await scrapeProductDetails(product.productUrl)
        
        setName(product.productName)
        
        if (details.mainImageUrl) {
          addImage({
            productId: 0,
            imageUrl: details.mainImageUrl,
            isMain: true,
          })
        }
        
        details.additionalImages?.forEach((imageUrl) => {
          addImage({
            productId: 0,
            imageUrl,
            isMain: false,
          })
        })

        setSearchResults([])
        setSearchTerm("")
        toast.success("Product Added", {
          description: "The selected product has been added successfully.",
        })
      } catch (err) {
        console.error("Failed to fetch product details:", err)
        toast.error("Error", {
          description: "Failed to fetch product details. Please try again.",
        })
      }
    })
  }

  return (
    <div className="space-y-6">
      <form action={handleSearch} className="flex gap-2">
        <div className="relative flex-grow">
          <Input
            type="text"
            name="searchTerm"
            placeholder="Search Amazon products"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
          {searchTerm && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={() => setSearchTerm("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Searching...
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Search
            </>
          )}
        </Button>
      </form>

      {(searchResults.length > 0 || isPending) && (
        <div className="rounded-lg bg-muted p-4">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <ShoppingBag className="h-5 w-5" />
            Search Results
          </h3>
          {isPending && searchResults.length === 0 ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {searchResults.map((product, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto flex-col space-y-2 p-4 transition-colors hover:bg-muted-foreground/10"
                  onClick={() => handleProductSelect(product)}
                  disabled={isPending}
                >
                  <div className="aspect-square w-full overflow-hidden rounded-lg bg-white">
                    <img
                      src={product.thumbnailUrl}
                      alt={product.productName}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <p className="line-clamp-3 text-left text-sm font-medium">
                    {product.productName.substring(0, 20)}...
                  </p>
                </Button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}