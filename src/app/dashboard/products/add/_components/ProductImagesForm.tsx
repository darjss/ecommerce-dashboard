'use client'

import { useState } from 'react'
import { Upload, Search, Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getTopSearchResults, scrapeProductImages } from '@/server/actions/images'
import { AmazonProductImages, AmazonScrapeProduct } from '@/utils/types'

export default function ProductImagesForm() {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [searchResults, setSearchResults] = useState<AmazonScrapeProduct[]>([])
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    try {
      const results = await getTopSearchResults(searchTerm)
      setSearchResults(results)
    } catch (err) {
      setError('Failed to fetch search results. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleProductSelect = async (product: AmazonScrapeProduct) => {
    setIsLoading(true)
    setError('')
    try {
      const images: AmazonProductImages = await scrapeProductImages(product.productUrl)
      setSelectedImages(prevImages => [...prevImages, images.mainImageUrl, ...images.additionalImages])
    } catch (err) {
      setError('Failed to fetch product images. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleManualUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).map(file => URL.createObjectURL(file))
      setSelectedImages(prevImages => [...prevImages, ...newImages])
    }
  }

  const removeImage = (index: number) => {
    setSelectedImages(prevImages => prevImages.filter((_, i) => i !== index))
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Product Images</CardTitle>
        <CardDescription>Upload or search for product images</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Search Amazon products"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
          />
          <Button onClick={(e) => handleSearch(e as any)} disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          </Button>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        {searchResults.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {searchResults.map((product, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-20 p-1"
                onClick={() => handleProductSelect(product)}
              >
                <img src={product.thumbnailUrl} alt={product.productName} className="w-full h-full object-contain" />
              </Button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-4 gap-2">
          {selectedImages.map((image, index) => (
            <div key={index} className="relative aspect-square">
              <img src={image} alt={`Product ${index + 1}`} className="w-full h-full object-cover rounded-md" />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-0 right-0 h-6 w-6"
                onClick={() => removeImage(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {selectedImages.length < 8 && (
            <div className="flex aspect-square items-center justify-center rounded-md border border-dashed">
              <label htmlFor="image-upload" className="cursor-pointer">
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleManualUpload}
                />
                <Upload className="h-6 w-6 text-muted-foreground" />
              </label>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}