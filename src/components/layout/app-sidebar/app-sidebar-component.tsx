"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import InlineSVG from "../../inline-svg/inline-svg-component";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/data-display/user-avatar/user-avatar-component";
import { SidebarProvider } from "@/components/common/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/common/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/common/drawer";

const navItems = [
  {
    label: "Home",
    href: "/",
    icon: '/icons/outlined/home-icon.svg',
  },
  {
    label: "Time Entry",
    href: "/calendar",
    icon: '/icons/outlined/calendar-icon.svg',
  },
  {
    label: "Reports",
    href: "/reports",
    icon: '/icons/outlined/document-icon.svg',
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Mock user data
  const user = {
    name: "Jackie Chan",
    email: "jackiechan@gmail.com",
    avatar: "/avatar.png", 
  };

  // Mobile header component
  const MobileHeader = () => (
    <div className="bg-primary sticky top-0 flex items-center justify-between px-4 py-3 border-b border-border">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-8 relative">
          <Image src="/logos/falcorp-logo.svg" alt="Falcorp Logo" width={24} height={32} className="w-auto h-auto object-contain" />
        </div>
        <span className=" text-lg font-gabarito font-bold">
          Project Midnight
        </span>
      </div>

      {/* Mobile Menu */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerTrigger asChild>
          <Button variant="ghost" size="sm" className="p-2">
            <Menu className="h-5 w-5 text-white" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DrawerTrigger>
        <DrawerContent className="h-[80vh] bg-primary">
          <DrawerHeader className="sr-only">
            <DrawerTitle>Navigation Menu</DrawerTitle>
          </DrawerHeader>
          {/* Close Button */}
          <DrawerClose asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute top-4 right-4 z-50 text-white hover:text-tertiary hover:bg-transparent"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close menu</span>
            </Button>
          </DrawerClose>
          <SidebarProvider>
            <div className="w-full h-full  flex flex-col items-center py-12 px-0 gap-8">
             

              {/* Navigation Links */}
              <nav className="flex-1 flex flex-col gap-4 items-start w-full px-6 pt-8 relative z-10">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-2 justify-center py-2 transition-colors ${
                        isActive ? "text-tertiary hover:text-tertiary" : "text-white hover:text-tertiary"
                      }`}
                    >
                      <InlineSVG src={item.icon} width={16} height={16} ariaHidden={true} className={cn(isActive ? "text-tertiary" : "text-white")} />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              {/* Profile Section */}
              <div className="relative z-10 w-full px-4">
                <UserAvatar user={user} />
              </div>
            </div>
          </SidebarProvider>
        </DrawerContent>
      </Drawer>
    </div>
  );

  // Desktop sidebar content
  const DesktopSidebar = () => (
    <SidebarProvider style={{width: '150px'}}>
      <div className="fixed z-40 left-2 top-2 bottom-2 w-[150px] bg-gradient-navy-to-blue rounded-2xl shadow-[0px_3px_16px_0px_rgba(15,38,67,0.2)] flex flex-col items-center gap-8 py-12 px-0 overflow-hidden">
        {/* Logo Section */}
        <div className="flex-shrink-0 flex flex-col items-center justify-center gap-4 px-8 pt-6 pb-4 relative z-10">
          <div className="w-[31px] h-[42px] relative">
            <Image src="/logos/falcorp-logo.svg" alt="Falcorp Logo" width={31} height={42} className="w-auto h-auto object-contain" />
          </div>
          <p className="text-white text-lg text-center leading-tight font-gabarito font-bold">
            Project Midnight
          </p>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 flex flex-col gap-4 items-start w-full px-6 pt-4 pb-4 overflow-y-auto no-scrollbar relative z-10">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 justify-center py-2 transition-colors flex-shrink-0 ${
                  isActive ? "text-tertiary hover:text-tertiary" : "text-white hover:text-tertiary"
                }`}
              >
                <InlineSVG src={item.icon} width={16} height={16} ariaHidden={true} className={cn(isActive ? "text-tertiary" : "text-white")} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Profile Section */}
        <div className="flex-shrink-0 relative z-10 w-full px-4 pb-4">
          <UserAvatar user={user} />
        </div>
      </div>
    </SidebarProvider>
  );

  // Return mobile header or desktop sidebar based on screen size
  return isMobile ? <MobileHeader /> : <DesktopSidebar />;
}

