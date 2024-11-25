import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SubmitButtonProps {
  isPending: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ isPending }) => {
  return (
    <Button type="submit" disabled={isPending}>
      {isPending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Adding...
        </>
      ) : (
        "Add "
      )}
    </Button>
  );
};

export default SubmitButton;
