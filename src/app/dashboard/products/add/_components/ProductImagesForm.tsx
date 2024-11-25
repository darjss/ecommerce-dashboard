'use client'

import { useState, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { X, Upload, Image as ImageIcon } from "lucide-react"
import useAddProductStore from "@/utils/stores/addProduct"
import { useDropzone } from 'react-dropzone'

function ImagePreview() {
  const { images, removeImage } = useAddProductStore()

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
      {images.map((image, index) => (
        <div key={index} className="relative aspect-square group">
          <img
            src={image.imageUrl}
            alt={`Product ${index + 1}`}
            className="h-full w-full rounded-lg object-fit transition-opacity group-hover:opacity-75"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => removeImage(index)}
          >
            <X className="h-4 w-4" />
          </Button>
          {image.isMain && (
            <span className="absolute bottom-2 left-2 bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-full">
              Main Image
            </span>
          )}
        </div>
      ))}
    </div>
  )
}

export default function ProductImagesForm() {
  const { addImage, images } = useAddProductStore()
  const [isDragging, setIsDragging] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file, index) => {
      const imageUrl = URL.createObjectURL(file)
      addImage({
        productId: 0,
        imageUrl,
        isMain: images.length === 0 && index === 0,
      })
    })
  }, [addImage, images.length])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {'image/*': []},
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
  })

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging ? 'border-primary bg-primary/10' : 'border-muted-foreground/25'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center text-muted-foreground">
          <Upload className="h-12 w-12 mb-4" />
          <p className="text-lg font-medium mb-1">Drag & drop product images here</p>
          <p className="text-sm">or click to select files</p>
        </div>
      </div>

      {images.length > 0 && (
        <div className="bg-muted p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Uploaded Images
          </h3>
          <ImagePreview />
        </div>
      )}
    </div>
  )
}