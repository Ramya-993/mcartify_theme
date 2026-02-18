"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Menu, ChevronRight } from "lucide-react";

interface PopMenuItem {
  label: string;
  href?: string;
  onClick?: () => void;
  submenu?: PopMenuItem[];
}

interface PopMenuProps {
  items: PopMenuItem[];
  trigger?: React.ReactNode;
  align?: "start" | "end" | "center";
  triggerClassName?: string;
}

const PopMenu = ({ 
  items, 
  trigger, 
  align = "end",
  triggerClassName 
}: PopMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger || (
          <Button 
            variant="outline" 
            size="sm"
            className={triggerClassName}
          >
            <span className="mr-1">Menu</span>
            <Menu className="h-4 w-4" />
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align={align}>
        {items.map((item, index) => {
          // If item has submenu, create a dropdown menu sub
          if (item.submenu && item.submenu.length > 0) {
            return (
              <DropdownMenuSub key={item.label + index}>
                <DropdownMenuSubTrigger className="flex items-center justify-between">
                  <span>{item.label}</span>
                  <ChevronRight className="h-4 w-4" />
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="w-48">
                    {item.submenu.map((subItem, subIndex) => (
                      <DropdownMenuItem
                        key={subItem.label + subIndex}
                        onClick={subItem.onClick}
                        asChild={!!subItem.href}
                      >
                        {subItem.href ? (
                          <a href={subItem.href}>{subItem.label}</a>
                        ) : (
                          <span>{subItem.label}</span>
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            );
          }
          
          // Otherwise, create a regular dropdown menu item
          return (
            <DropdownMenuItem
              key={item.label + index}
              onClick={item.onClick}
              asChild={!!item.href}
            >
              {item.href ? (
                <a href={item.href}>{item.label}</a>
              ) : (
                <span>{item.label}</span>
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PopMenu;

/* Example usage:

import PopMenu from '@/components/custom/popmenu';

const menuItems = [
  { label: 'Profile', href: '/profile' },
  {
    label: 'Settings',
    submenu: [
      { label: 'Account', href: '/settings/account' },
      { label: 'Preferences', href: '/settings/preferences' },
    ],
  },
  { label: 'Logout', onClick: () => handleLogout() },
];

<PopMenu items={menuItems} />
*/
