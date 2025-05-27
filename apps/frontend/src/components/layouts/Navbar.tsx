"use client";

import {
  Box,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Search,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { useSearch } from "@/src/hooks/use-search";
import Link from "next/link";

export function Navbar() {
  const router = useRouter();

  const { query, setQuery } = useSearch();

  const buttonStyle =
    "md:block hidden opacity-70 hover:opacity-100 hover:scale-110 transition-all duration-300";

  return (
    <nav className="flex items-center justify-between w-full px-4 h-20 ">
      {/* Logo */}
      <div className="lg:hidden ">
        <Link href="/">
          <Box className="w-12 h-12 mr-4  text-oceanBlue hover:scale-90 duration-300" />
        </Link>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center gap-1 ">
        <Button
          variant="ghost"
          size="xl"
          onClick={() => router.back()}
          className={buttonStyle}
        >
          <ChevronRight />
        </Button>
        <Button
          variant="ghost"
          size="xl"
          onClick={() => router.forward()}
          className={buttonStyle}
        >
          <ChevronLeft />
        </Button>
      </div>

      {/* Search Bar */}

      <div className="flex-1 w-full mx-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50 sca" />
          <Input
            type="search"
            placeholder="Search through over 70 millon podcasts and episods"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent border border-layoutLine hover:border-white/20 focus:border-active focus:bg-primaryTheme rounded-small px-12 placeholder:text-white/50 [&::-webkit-search-cancel-button]:appearance-none"
            aria-label="Search podcasts"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Signin & login buttons */}

        <div className="md:flex hidden gap-2">
          <Button className=" bg-oceanBlue">Log in</Button>
          <Button className="bg-oceanBlue">Sign up</Button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="hover:bg-white/5">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48 bg-gradient-to-tr from-[#392d60] to-[#6a3385ff] border-0"
          >
            <DropdownMenuItem className="md:hidden block">
              Log in
            </DropdownMenuItem>
            <DropdownMenuItem className="md:hidden block">
              Sign up
            </DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <DropdownMenuItem>About podbay</DropdownMenuItem>
            <DropdownMenuItem>What's new</DropdownMenuItem>
            <DropdownMenuItem>Podcaster FAQ</DropdownMenuItem>
            <DropdownMenuItem>Privacy</DropdownMenuItem>
            <DropdownMenuItem> Terms</DropdownMenuItem>
            <DropdownMenuSeparator className=" bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <DropdownMenuItem> Contact & Feedback </DropdownMenuItem>
            <DropdownMenuItem> Clear Data... </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
