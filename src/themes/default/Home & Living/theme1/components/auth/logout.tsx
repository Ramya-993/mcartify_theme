"use client";

import { LogOut } from "lucide-react";
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

interface LogoutModalProps {
  /** Function to call when user confirms logout */
  onLogout: () => void;
  /** Function to call when user cancels */
  onCancel: () => void;
  /** Optional message to show in the dialog */
  message?: string;
  /** Show icon in the title */
  showIcon?: boolean;
}

/**
 * Logout confirmation dialog component
 * 
 * @param onLogout - Function to call when user confirms logout
 * @param onCancel - Function to call when user cancels
 * @param message - Optional custom message (defaults to standard logout confirmation)
 * @param showIcon - Whether to show the logout icon (default: true)
 */
const Logout = ({
  onLogout,
  onCancel,
  message = "Are you sure you want to logout from your account?",
  showIcon = true,
}: LogoutModalProps) => {
  return (
    <AlertDialog defaultOpen>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            {showIcon && <LogOut className="h-4 w-4 text-destructive" />}
            Logout Confirmation
          </AlertDialogTitle>
          <AlertDialogDescription className="py-2">
            {message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:space-x-2">
          <AlertDialogCancel 
            onClick={onCancel}
            className="mt-2 sm:mt-0"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onLogout} 
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Yes, Logout
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Logout;
