"use client";

import { useState } from "react";
import { Package2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { NavItem } from "./NavItem";
import { navItems } from "@/utils/data";

export function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 flex flex-col border-r bg-background transition-all duration-300 ease-in-out ${
        isExpanded ? "w-56" : "w-14"
      } hidden sm:flex`}
    >
      <div className="flex items-center justify-between p-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsExpanded(!isExpanded)}
          className="group flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground"
        >
          <Package2 className="h-4 w-4 transition-all group-hover:scale-110" />
        </Button>
      </div>
      <TooltipProvider>
        <nav className="flex flex-col items-start gap-4 px-2 py-5">
          {navItems.map((item) => (
            <NavItem key={item.label} {...item} isExpanded={isExpanded} />
          ))}
        </nav>
      </TooltipProvider>
    </aside>
  );
}
