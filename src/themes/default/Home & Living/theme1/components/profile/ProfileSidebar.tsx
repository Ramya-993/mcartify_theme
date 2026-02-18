"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent } from "@/components/ui/card";
import useProfileSidebar from "@/themes/hooks/profile/useProfileSidebar";
import { cn } from "@/lib/utils";

export default function ProfileSidebar() {
  const { allMenuItems, showLogoutPopup, setShowLogoutPopup, confirmLogout } =
    useProfileSidebar();
  const pathName = usePathname();

  return (
    <Card className="border-primary/20">
      <CardContent className="p-4">
        <nav className="space-y-1">
          {allMenuItems.map((menu, i: number) => {
            const IconComponent = menu.icon;
            const isActionItem = !!menu.onClick;

            const buttonContent = (
              <span className="flex items-center gap-2">
                <IconComponent className="h-4 w-4" />
                {menu.name}
              </span>
            );

            return (
              <div key={i}>
                {isActionItem ? (
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start",
                      "hover:bg-primary/10 hover:text-primary"
                    )}
                    onClick={menu.onClick}
                  >
                    {buttonContent}
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    asChild
                    className={cn(
                      "w-full justify-start",
                      pathName === menu.path
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-primary/10 hover:text-primary"
                    )}
                  >
                    <Link href={menu.path}>{buttonContent}</Link>
                  </Button>
                )}
              </div>
            );
          })}
        </nav>
      </CardContent>

      <AlertDialog open={showLogoutPopup} onOpenChange={setShowLogoutPopup}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Logout Confirmation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to logout?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmLogout}
              className="bg-destructive hover:bg-destructive/90"
            >
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
