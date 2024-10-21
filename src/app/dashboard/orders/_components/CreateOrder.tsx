import { Button } from "@/components/ui/button";
import {
  Card,
  CardFooter,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
const CreateOrder = () => {
  return (
    <Card className="mb-4 sm:col-span-2">
      <CardHeader className="pb-3"></CardHeader>
      <CardFooter className="flex justify-center">
        <Button>Create New Order</Button>
      </CardFooter>
    </Card>
  );
};
export default CreateOrder;
