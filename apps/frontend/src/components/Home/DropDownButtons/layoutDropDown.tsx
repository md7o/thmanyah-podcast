import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { Button } from "../../ui/button";
import {
  MoreVertical,
  LayoutGrid,
  List,
  ScrollText,
  Grid3x3,
} from "lucide-react";
import { cn } from "@/src/lib/utils";

export type LayoutType = "scroll" | "grid" | "list" | "compact";

interface LayoutDropDownProps {
  availableLayouts?: LayoutType[];
  currentLayout: LayoutType;
  //   onLayoutChange: (layout: LayoutType) => void;
}

const layoutIcons = {
  scroll: ScrollText,
  grid: LayoutGrid,
  list: List,
  compact: Grid3x3,
};

const layoutLabels = {
  scroll: "Scroll",
  grid: "Grid",
  list: "List",
  compact: "compact",
};

export default function LayoutDropDown({
  availableLayouts = ["scroll", "grid", "list", "compact"],
  currentLayout,
  //   onLayoutChange,
}: LayoutDropDownProps) {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-white/5 text-white/50 hover:text-white/90"
          >
            <MoreVertical className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className={cn(
            "w-48 bg-gradient-to-tr from-[#392d60] to-[#6a3385ff] border-0",
            "text-white/90 rounded-lg shadow-xl",
            "animate-in fade-in-0 zoom-in-95 duration-100"
          )}
        >
          {availableLayouts.map((layout, index) => (
            <React.Fragment key={layout}>
              <DropdownMenuItem
                className={cn(
                  "focus:bg-white/10 cursor-pointer flex items-center gap-2",
                  currentLayout === layout && "bg-white/10"
                )}
                // onClick={() => onLayoutChange(layout)}
              >
                {React.createElement(layoutIcons[layout], {
                  className: "h-4 w-4",
                })}
                <span className="text-xs">
                  Switch layout to {layoutLabels[layout]}
                </span>
              </DropdownMenuItem>
              {index < availableLayouts.length - 1 && (
                <DropdownMenuSeparator className="bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              )}
            </React.Fragment>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
