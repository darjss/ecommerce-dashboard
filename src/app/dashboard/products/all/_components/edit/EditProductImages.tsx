"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Upload } from "lucide-react";
import { updateProductImages } from "@/server/db/queries";
import Spinning from "@/lib/svg/Spinning";

interface EditProductImagesProps {
  images: string[];
  productId: number;
}

export default function EditProductImages({ images, productId }: EditProductImagesProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [currentImages, setCurrentImages] = useState<string[]>(images);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setNewImages(prev => [...prev, ...files]);
      
      // Create preview URLs for new images
      const newPreviewUrls = files.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    }
  };

  const removeExistingImage = (index: number) => {
    setCurrentImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(previewUrls[index]); // Clean up preview URL
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('productId', productId.toString());
      formData.append('currentImages', JSON.stringify(currentImages));
      newImages.forEach(file => {
        formData.append('newImages', file);
      });

      await updateProductImages(formData);
      // Add success toast
    } catch (error) {
      console.error('Failed to update images:', error);
      // Add error toast
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Existing Images */}
      <div className="space-y-4">
        <Label>Current Images</Label>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {currentImages.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image}
                alt={`Product ${index + 1}`}
                className="h-40 w-full rounded-lg object-cover"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeExistingImage(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* New Images */}
      {previewUrls.length > 0 && (
        <div className="space-y-4">
          <Label>New Images</Label>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
                  alt={`New ${index + 1}`}
                  className="h-40 w-full rounded-lg object-cover"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeNewImage(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Button */}
      <div className="space-y-4">
        <Label htmlFor="images">Add Images</Label>
        <div className="flex items-center gap-4">
          <Input
            id="images"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageChange}
          />
          <Button
            variant="outline"
            onClick={() => document.getElementById('images')?.click()}
            className="w-full"
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Images
          </Button>
        </div>
      </div>

      {/* Submit Button */}
      <Button 
        onClick={handleSubmit} 
        disabled={isLoading || (currentImages.length === 0 && newImages.length === 0)}
        className="w-full"
      >
        {isLoading ? (
          <>
            <Spinning /> Updating...
          </>
        ) : (
          "Save Changes"
        )}
      </Button>
    </div>
  );
} 