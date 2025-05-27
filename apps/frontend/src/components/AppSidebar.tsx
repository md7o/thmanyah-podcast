import { Rows3, Home, Rocket, LayoutGrid, Clock5, Box } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "../components/ui/sidebar";
import Link from "next/link";

const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Discover",
    url: "#",
    icon: Rocket,
  },
  {
    title: "My Queue",
    url: "#",
    icon: Rows3,
  },
  {
    title: "My Podcasts",
    url: "#",
    icon: LayoutGrid,
  },
  {
    title: "Recents",
    url: "#",
    icon: Clock5,
  },
];

export function AppSidebar() {
  return (
    <Sidebar className="p-1 shadow-md shadow-black">
      <SidebarContent>
        <SidebarGroup>
          <Link href="/">
            <Box className="w-14 h-14 mb-5 mt-1 text-oceanBlue hover:scale-90 duration-300" />
          </Link>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="hover:bg-gradient-to-l from-pink-400/10 to-transparent duration-300"
                  >
                    <a href={item.url} className="flex items-center gap-3">
                      <item.icon className="stroke-1 w-5 h-5 flex-shrink-0" />
                      <span className="text-sm whitespace-nowrap">
                        {item.title}
                      </span>
                    </a>
                  </SidebarMenuButton>

                  {item.title === "Discover" && (
                    <p className="text-sm pl-2 font-bold mt-5 opacity-50">
                      YOUR STUFF
                    </p>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="text-xs p-3 opacity-40 ">
          <p className=" pb-1">Podbay v2.9.6 by Fancy Soups.</p>
          <div className="flex gap-2">
            <a href="#" className="hover:underline">
              About
            </a>
            <a href="#" className="hover:underline">
              All Podcasts
            </a>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
