"use client";
import { useState } from "react";
import { Plus, Search, Edit, Trash2, ChevronDown } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BrandTable from "./_components/BrandTable";
import CategoryTable from "./_components/CategoryTable";

export default function Page() {
  const [activeTab, setActiveTab] = useState("brands");

  return (
    <div className="bg-background p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary">Brands & Categories</h1>
        <div className="flex space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add {activeTab === "brands" ? "Brand" : "Category"}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  Add {activeTab === "brands" ? "Brand" : "Category"}
                </DialogTitle>
                <DialogDescription>
                  Enter the details for the new{" "}
                  {activeTab === "brands" ? "brand" : "category"} here. Click
                  save when you're done.
                </DialogDescription>
              </DialogHeader>
              <form action={""}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input id="name" className="col-span-3" />
                  </div>
                  {activeTab === "brands" && (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="logo" className="text-right">
                        Logo URL
                      </Label>
                      <Input id="logo" type="text" className="col-span-3" />
                    </div>
                  )}
                </div>
              </form>
              <DialogFooter>
                <Button type="submit">Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative max-w-sm">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
          <Input
            type="search"
            placeholder={`Search ${activeTab}...`}
            className="pl-8"
          />
        </div>
      </div>

      <Tabs
        defaultValue="brands"
        className="w-full"
        onValueChange={setActiveTab}
      >
        <TabsList>
          <TabsTrigger value="brands">Brands</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>
        <TabsContent value="brands">
          <BrandTable />
        </TabsContent>
        <TabsContent value="categories">
          <CategoryTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}
