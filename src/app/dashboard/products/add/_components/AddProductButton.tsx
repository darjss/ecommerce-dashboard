"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export default function AddProductButton() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Button
      type="submit"
      disabled={isLoading}
      className="w-full max-w-md rounded-full bg-primary px-8 py-6 text-lg font-semibold shadow-lg transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 md:text-xl"
      onClick={() => setIsLoading(true)}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Adding Product...</span>
        </div>
      ) : (
        "Add Product"
      )}
    </Button>
  );
}
