"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, ShoppingBag, Home, HelpCircle, LogOut } from "lucide-react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/StoreProvider";
import { logout } from "@/store/slices/user";
import { deleteAllFromCart } from "@/store/slices/cart";

// Define the structure for a menu item
interface MenuItem {
  name: string;
  path: string;
  icon: React.ElementType;
  onClick?: () => void;
}

export default function useProfileSidebar() {
  const dispatch = useDispatch<AppDispatch>();
  const [activeMenu] = useState("/profile");
  const router = useRouter();
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  // Define menu items
  const menuItems: MenuItem[] = [
    {
      name: "Profile",
      path: "/profile",
      icon: User,
    },
    {
      name: "My Orders",
      path: "/profile/orders",
      icon: ShoppingBag,
    },
    {
      name: "Manage Addresses",
      path: "/profile/addressess",
      icon: Home,
    },
    {
      name: "Help & Support",
      path: "/profile/support",
      icon: HelpCircle,
    },
  ];

  // Logout Item (separate for clarity or specific handling)
  const logoutItem: MenuItem = {
    name: "Logout",
    path: "#logout",
    icon: LogOut,
    onClick: () => setShowLogoutPopup(true),
  };

  const allMenuItems = [...menuItems, logoutItem];

  const handleLogout = () => {
    try {
      console.log("Logging out...");
      dispatch(logout());
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      dispatch(deleteAllFromCart());
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const confirmLogout = () => {
    handleLogout();
    setShowLogoutPopup(false);
  };

  return {
    allMenuItems,
    activeMenu,
    showLogoutPopup,
    setShowLogoutPopup,
    confirmLogout,
    handleLogoutClick: () => setShowLogoutPopup(true),
  };
}
