"use client";

import { Link } from "next-view-transitions";
import { LucideIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePathname } from "next/navigation";

interface NavItemProps {
  icon: LucideIcon;
  label: string;
  isExpanded?: boolean;
}

export function NavItem({
  icon: Icon,
  label,
  isExpanded = false,
}: NavItemProps) {
  const currentUrl = usePathname();
  const urlToRedirect =
    label === "Home"
      ? "/dashboard"
      : label === "Product"
        ? `/dashboard/products/all`
        : `/dashboard/${label.toLowerCase()}`;
  const isActive = currentUrl === urlToRedirect;

  const content = (
    <Link
      href={urlToRedirect}
      className={`flex h-9 items-center rounded-lg px-2 ${
        isActive
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      } transition-colors ${isExpanded ? "w-full justify-start gap-2" : "w-9 justify-center"}`}
    >
      <Icon className="h-5 w-5" />
      {isExpanded && <span>{label}</span>}
      {!isExpanded && <span className="sr-only">{label}</span>}
    </Link>
  );

  if (isExpanded) {
    return content;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild={true}>{content}</TooltipTrigger>
        <TooltipContent side="right">
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
