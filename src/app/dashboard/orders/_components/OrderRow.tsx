import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";

interface OrderRowProps {
  customer: string;
  email: string;
  type: string;
  status: string;
  date: string;
  amount: string;
}

export function OrderRow({
  customer,
  email,
  type,
  status,
  date,
  amount,
}: OrderRowProps) {
  return (
    <TableRow className={status === "Fulfilled" ? "bg-accent" : ""}>
      <TableCell>
        <div className="font-medium">{customer}</div>
        <div className="hidden text-sm text-muted-foreground md:inline">
          {email}
        </div>
      </TableCell>
      <TableCell className="hidden sm:table-cell">{type}</TableCell>
      <TableCell className="hidden sm:table-cell">
        <Badge
          className="text-xs"
          variant={status === "Fulfilled" ? "secondary" : "outline"}
        >
          {status}
        </Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell">{date}</TableCell>
      <TableCell className="text-right">${amount}</TableCell>
    </TableRow>
  );
}
