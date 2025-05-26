import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { Button } from "../../ui/button";
import { MoreVertical } from "lucide-react";
import { cn } from "@/src/lib/utils";

export default function EpisdosDropDown() {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className=" text-white/50 hover:text-white/90"
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
          <DropdownMenuItem className="focus:bg-white/10 cursor-pointer">
            Add To My Queue
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <DropdownMenuItem className="focus:bg-white/10 cursor-pointer">
            Go To Episode
          </DropdownMenuItem>
          <DropdownMenuItem className="focus:bg-white/10 cursor-pointer">
            Go To Podcast
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <DropdownMenuItem className="focus:bg-white/10 cursor-pointer">
            Download File
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
