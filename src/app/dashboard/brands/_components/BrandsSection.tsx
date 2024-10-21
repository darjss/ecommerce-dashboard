"use client";
import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import BrandTable from "./BrandTable";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { addBrand, getAllBrands } from "@/server/actions/brands";
import Spinning from "@/lib/svg/Spinning";


export default function BrandsSection() {
  const [name, setName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const queryClient = useQueryClient();

  const { data: brands } = useQuery({
    queryKey: ["brands"],
    queryFn: getAllBrands,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: addBrand,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
      setName("");
      setLogoUrl("");
    },
  });

  const handleSubmit = () => {
    mutate({ name, logo_url: logoUrl });
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary">Brands</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Brand
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Brand</DialogTitle>
              <DialogDescription>
                Enter the details for the new brand here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="logo" className="text-right">
                  Logo URL
                </Label>
                <Input
                  id="logo"
                  type="text"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSubmit} type="submit" disabled={isPending}>
                {isPending ? (
                  <div>
                    <Spinning /> Saving...
                  </div>
                ) : (
                  "Save"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6">
        <div className="relative max-w-sm">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search brands..."
            className="pl-8"
          />
        </div>
      </div>

      <BrandTable />
    </div>
  );
}
