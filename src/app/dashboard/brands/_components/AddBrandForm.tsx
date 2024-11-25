import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import SubmitButton from "@/components/SubmitButton"; 
interface AddBrandFormProps {
  action: (formData: FormData) => void;
  isPending: boolean;
}

export default function AddBrandForm({ action, isPending }: AddBrandFormProps) {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Add New Brand</CardTitle>
        <CardDescription>Enter the details of the new brand</CardDescription>
      </CardHeader>
      <form action={action}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Brand Name</Label>
            <Input id="name" name="name" required disabled={isPending} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="logoUrl">Logo URL</Label>
            <Input id="logoUrl" name="logoUrl" required disabled={isPending} />
          </div>
        </CardContent>
        <CardFooter>
          <SubmitButton isPending={isPending} /> 
        </CardFooter>
      </form>
    </Card>
  );
}
