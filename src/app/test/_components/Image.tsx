"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Search, Image as ImageIcon } from "lucide-react";

// Import the server actions
import {
  getTopSearchResults,
  scrapeProductImages,
} from "@/server/actions/images";
import { AmazonProductImages, AmazonScrapeProduct } from "@/utils/types";

export default function AmazonProductScraper() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<AmazonScrapeProduct[]>([]);
  const [selectedProduct, setSelectedProduct] =
    useState<AmazonScrapeProduct | null>(null);
  const [productImages, setProductImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSelectedProduct(null);
    setProductImages([]);
    try {
      const results = await getTopSearchResults(searchTerm);
      setSearchResults(results);
    } catch (err) {
      setError("Failed to fetch search results. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductSelect = async (product: AmazonScrapeProduct) => {
    setSelectedProduct(product);
    setProductImages([]);
    setIsLoading(true);
    setError("");
    try {
      const images: AmazonProductImages = await scrapeProductImages(
        product.productUrl,
      );
      setProductImages([images.mainImageUrl, ...images.additionalImages]);
    } catch (err) {
      setError("Failed to fetch product images. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-6xl p-4">
      <h1 className="mb-4 text-2xl font-bold">Amazon Product Scraper</h1>

      <form onSubmit={handleSearch} className="mb-4 flex gap-2">
        <Input
          type="text"
          placeholder="Enter product name"
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearchTerm(e.target.value)
          }
          className="flex-grow"
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Search className="mr-2 h-4 w-4" />
          )}
          Search
        </Button>
      </form>

      {error && <p className="mb-4 text-red-500">{error}</p>}

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {searchResults.map((product, index) => (
          <Card key={index} className="flex flex-col">
            <CardHeader>
              <CardTitle className="line-clamp-2 text-sm">
                {product.productName}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <img
                src={product.thumbnailUrl}
                alt={product.productName}
                className="h-48 w-full object-contain"
              />
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => handleProductSelect(product)}
                className="w-full"
              >
                <ImageIcon className="mr-2 h-4 w-4" />
                View Images
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {selectedProduct && (
        <div className="mt-8">
          <h2 className="mb-4 text-xl font-bold">
            Images for {selectedProduct.productName}
          </h2>
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : productImages.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {productImages.map((imageUrl, index) => (
                <div
                  key={index}
                  className="aspect-square overflow-hidden rounded-lg"
                >
                  <img
                    src={imageUrl}
                    alt={`Product image ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center">No images available</p>
          )}
        </div>
      )}
    </div>
  );
}
