"use client";

import type React from "react";
import type { StoreData } from "@/types/store";
import type ICategory from "@/types/category";
import type { ISubcategory } from "@/types/category";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ChangeEvent, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import type { AppDispatch } from "@/store/StoreProvider";
import { toast } from "react-toastify";
import { togglePopModal, updatePopModalData } from "@/store/slices/modal";
import { useNavbar } from "@/themes/hooks/useNavbar";
import { useSecondaryNav } from "@/themes/hooks/useSecondaryNav";
import { RootState } from "@/store/StoreProvider";

// Lucide Icons
import {
  Search,
  ShoppingCart,
  Menu,
  MapPin,
  Phone,
  ChevronDown,
  Grid3X3,
  LogOut,
  ChevronRight,
  Grid,
  X,
  User,
} from "lucide-react";

// UI Components
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
// HoverCard components removed - not needed for current implementation

// Import existing components
import Logout from "./auth/logout";
import CartPopup from "./custom/cart-popup";
import LoginModal from "./auth/LoginModal";

// Types
type MenuItem = {
  itemName: string;
  path: string;
  enabled: number;
  priority: number;
  icon?: string;
};

type ProfileLink = {
  lable: string;
  icon: string;
  onClick: () => void;
};

// Enhanced Search Box Component
const EnhancedSearchBox = memo(
  ({
    searchString,
    onSearchChange,
    showResults,
    setShowResults,
    searchResults,
    onProductClick,
    searchContainerRef,
    searchPlaceholder,
    isMobile = false,
  }: {
    searchString: string;
    onSearchChange: (value: string) => void;
    showResults: boolean;
    setShowResults: (show: boolean) => void;
    searchResults: Array<{ productId: string; name: string; slug: string }>;
    onProductClick: (id: string) => void;
    searchContainerRef:
      | React.RefObject<HTMLDivElement>
      | React.RefObject<HTMLDivElement | null>;
    searchPlaceholder?: string;
    isMobile?: boolean;
  }) => {
    const placeholder = searchPlaceholder || "Search for products...";
    console.log("dsadsads", searchResults);
    return (
      <div
        className={cn(
          "relative shadow-none",
          isMobile ? "w-full" : "flex-1 max-w-2xl"
        )}
        ref={searchContainerRef}
      >
        <div className="relative group shadow-none border rounded-(--radius-lg) bg-white">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-(color:--navbar-search-icon-color) h-(height:--navbar-search-icon-size) w-(width:--navbar-search-icon-size) group-focus-within:text-(color:--navbar-search-icon-focus-color) transition-colors duration-(--animation-normal)" />
          <Input
            type="search"
            placeholder={placeholder}
            className={cn(
              "pl-(spacing:--navbar-search-padding-left) pr-(spacing:--navbar-search-padding-right) border-(color:--navbar-search-border-color) border-2 focus:border-(color:--navbar-search-focus-border-color) focus:ring-2 focus:ring-(color:--navbar-search-focus-ring-color) focus:ring-opacity-(--navbar-search-focus-ring-opacity) bg-(color:--navbar-search-bg) hover:shadow-(--navbar-search-hover-shadow) transition-all duration-(--animation-normal) font-(weight:--navbar-search-font-weight)",
              isMobile
                ? "bg-transparent border-none h-(height:--navbar-search-mobile-height) rounded-(--radius-xl) text-(size:--navbar-search-font-size)"
                : "bg-transparent border-none h-(height:--navbar-search-height) rounded-(--navbar-search-border-radius) pr-(spacing:--navbar-search-button-padding)"
            )}
            value={searchString}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onSearchChange(e.target.value)
            }
            onFocus={() => setShowResults(true)}
          />
        </div>

        <AnimatePresence>
          {showResults && searchString.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="p-3 border-b bg-gradient-to-r from-primary-50 to-primary-hover">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Search className="h-4 w-4 text-primary" />
                    Search Results
                  </h3>
                  <Badge variant="outline" className="text-xs bg-white">
                    {searchResults.length} found
                  </Badge>
                </div>
              </div>
              <ScrollArea className="max-h-64">
                {searchResults.length > 0 ? (
                  searchResults.map((result, index) => (
                    <motion.div
                      key={result.productId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-3 p-3 hover:bg-(color:--primary-hover) cursor-pointer border-b last:border-b-0 group transition-all duration-200"
                      onClick={() => onProductClick(result.slug)}
                    >
                      <div className="p-2 bg-primary-100 rounded-lg group-hover:bg-primary-200 transition-colors duration-200">
                        <Search className="h-3 w-3 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 group-hover:text-primary transition-colors text-sm">
                          {result.name}
                        </p>
                        <p className="text-xs text-gray-500">Available</p>
                      </div>
                      <ChevronRight className="h-3 w-3 text-gray-400 group-hover:text-green-600 transition-colors" />
                    </motion.div>
                  ))
                ) : (
                  <div className="p-6 text-center">
                    <div className="p-3 bg-gray-100 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                      <Search className="h-6 w-6 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium text-sm">
                      No products found for &quot;{searchString}&quot;
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Try searching for something else
                    </p>
                  </div>
                )}
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

// Enhanced Category Dropdown Component
const EnhancedCategoryDropdown = memo(
  ({
    categories,
    onCategoryClick,
    onSubcategoryClick,
    isMobile = false,
  }: {
    categories: ICategory[];
    onCategoryClick: (slug: string) => void;
    onSubcategoryClick: (categorySlug: string, subcategoryId: number) => void;
    isMobile?: boolean;
  }) => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "flex items-center gap-2 border-(color:--navbar-category-border-color) border-1 hover:border-(color:--navbar-category-hover-border-color) hover:bg-(color:--navbar-category-hover-bg) transition-all duration-(--animation-normal) font-(weight:--navbar-category-font-weight) shadow-none  hover:shadow-(--navbar-category-hover-shadow)",
              isMobile
                ? "rounded-(--radius-lg) px-(spacing:--navbar-category-mobile-padding-x) h-(height:--navbar-category-mobile-height)"
                : "rounded-(--radius-lg) px-(spacing:--navbar-category-padding-x) h-(height:--navbar-category-height)"
            )}
          >
            <span className="font-(weight:--navbar-category-text-weight) text-white text-(size:--navbar-category-text-size) font-(family-name:--font-secondary)">
              <span className={cn(isMobile ? "inline" : "hidden md:inline")}>
                All{" "}
              </span>
              Categories
            </span>
            <ChevronDown className="h-(height:--navbar-category-chevron-size) w-(width:--navbar-category-chevron-size) text-(color:--navbar-category-chevron-color)" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          sideOffset={5}
          className="w-(width:--navbar-category-dropdown-width) p-(spacing:--navbar-category-dropdown-padding) shadow-(--navbar-category-dropdown-shadow) border-(color:--navbar-category-dropdown-border-color) border border-solid rounded-(--radius-xl) z-(index:--dropdown-z-index)"
        >
          <DropdownMenuLabel className="text-(color:--primary) !font-bold text-base flex items-center gap-2 mb-3 font-(family-name:--font-secondary)">
            Browse Categories
          </DropdownMenuLabel>
          <Separator className="mb-3" />
          <ScrollArea className="h-80">
            <div className="space-y-1">
              {categories?.map((category) =>
                category.subcategories &&
                Array.isArray(category.subcategories) &&
                category.subcategories.length > 0 ? (
                  <DropdownMenuSub key={category.categoryId}>
                    <DropdownMenuSubTrigger
                      onClick={() => onCategoryClick(category.slug)}
                      className="flex items-center gap-3 p-3 rounded-lg text-(color:--primary) hover:text-white hover:!bg-(color:--primary-hover) transition-all duration-200 cursor-pointer w-full"
                    >
                      <span className="font-medium  flex-1 text-left truncate max-w-[180px] text-sm">
                        {category.name}
                      </span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent className="w-64 p-3 shadow-2xl border-0 rounded-xl z-(index:--dropdown-z-index)">
                        <div className="space-y-1">
                          {category.subcategories.map(
                            (subcategory: ISubcategory) => (
                              <DropdownMenuItem
                                key={subcategory.subcategoryId}
                                onClick={() =>
                                  onSubcategoryClick(
                                    category.slug,
                                    subcategory.subcategoryId
                                  )
                                }
                                className="p-3 rounded-lg transition-all duration-200 cursor-pointer text-(color:--primary) hover:text-white hover:!bg-(color:--primary-hover)"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-2 h-2 bg-(color:--primary) rounded-full"></div>
                                  <span className="font-medium text-(color:--primary) text-sm">
                                    {subcategory.name}
                                  </span>
                                </div>
                              </DropdownMenuItem>
                            )
                          )}
                        </div>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                ) : (
                  <DropdownMenuItem
                    key={category.categoryId}
                    onClick={() => onCategoryClick(category.slug)}
                    className="flex items-center gap-3 p-3 rounded-lg transition-all duration-200 cursor-pointer"
                  >
                    <span className="font-medium text-(color:--primary) text-sm">
                      {category.name}
                    </span>
                  </DropdownMenuItem>
                )
              )}
            </div>
          </ScrollArea>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
);

// Mobile Category Dropdown Component
const MobileCategoryDropdown = memo(
  ({
    categories,
    onCategoryClick,
    onSubcategoryClick,
  }: {
    categories: ICategory[];
    onCategoryClick: (slug: string) => void;
    onSubcategoryClick: (categorySlug: string, subcategoryId: number) => void;
  }) => {
    const [openCategory, setOpenCategory] = useState<string | null>(null);

    const handleCategoryClick = (category: ICategory) => {
      // Check if subcategories exist and treat as an array
      const subcategories = category.subcategories as unknown as ISubcategory[];
      if (subcategories && subcategories.length > 0) {
        setOpenCategory(openCategory === category.slug ? null : category.slug);
      } else {
        onCategoryClick(category.slug);
      }
    };

    return (
      <div className="space-y-(spacing:--mobile-category-list-gap) max-h-(height:--mobile-category-dropdown-max-height) overflow-y-auto pr-1 mobile-category-scrollbar">
        {categories?.map((category) => (
          <div key={category.categoryId} className="relative">
            <button
              onClick={() => handleCategoryClick(category)}
              className={cn(
                "w-full flex items-center justify-between",
                "h-(height:--mobile-category-item-height) px-(spacing:--mobile-category-item-padding-x)",
                "text-(color:--mobile-category-item-text-color) text-(size:--mobile-category-item-font-size) font-(weight:--mobile-category-item-font-weight)",
                "bg-(color:--mobile-category-item-bg) hover:bg-(color:--mobile-category-item-hover-bg)",
                "border border-(color:--mobile-category-item-border) rounded-(--mobile-category-item-border-radius)",
                "transition-colors duration-(--animation-fast)",
                openCategory === category.slug &&
                  "border-(color:--primary) bg-(color:--primary-50) text-(color:--primary)"
              )}
            >
              <div className="flex items-center gap-(spacing:--mobile-category-item-gap)">
                <div className="p-1 rounded-md bg-(color:--mobile-category-icon-bg)">
                  {/* Use an icon from the image property or default to Grid3X3 */}
                  <Grid3X3 className="h-(height:--mobile-category-item-icon-size) w-(width:--mobile-category-item-icon-size) text-(color:--mobile-category-item-icon-color)" />
                </div>
                <span className="truncate">{category.name}</span>
              </div>
              {/* Cast subcategories to array for rendering */}
              {(category.subcategories as unknown as ISubcategory[])?.length >
                0 && (
                <ChevronDown
                  className={cn(
                    "h-(height:--mobile-subcategory-chevron-size) w-(width:--mobile-subcategory-chevron-size) text-(color:--mobile-subcategory-chevron-color)",
                    "transition-transform duration-(--animation-fast)",
                    openCategory === category.slug &&
                      "transform rotate-180 text-(color:--primary)"
                  )}
                />
              )}
            </button>

            {/* Subcategories */}
            {openCategory === category.slug &&
              (category.subcategories as unknown as ISubcategory[])?.length >
                0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden mt-1 pl-10 pr-2"
                >
                  <div className="space-y-0.5 max-h-(height:--mobile-category-subcategory-max-height) overflow-y-auto py-1 pr-1 mobile-category-scrollbar">
                    {(category.subcategories as unknown as ISubcategory[]).map(
                      (subcategory: ISubcategory) => (
                        <button
                          key={subcategory.subcategoryId}
                          onClick={() =>
                            onSubcategoryClick(
                              category.slug,
                              subcategory.subcategoryId
                            )
                          }
                          className={cn(
                            "w-full flex items-center justify-between",
                            "py-1.5 px-2 rounded-(--radius-md)",
                            "text-left text-(size:--fs-sm) text-(color:--foreground)",
                            "hover:bg-(color:--mobile-category-item-hover-bg) hover:text-(color:--primary)",
                            "transition-colors duration-(--animation-fast)"
                          )}
                        >
                          <span className="truncate">{subcategory.name}</span>
                          <ChevronRight className="h-3 w-3 text-(color:--muted-foreground)" />
                        </button>
                      )
                    )}
                  </div>
                </motion.div>
              )}
          </div>
        ))}
      </div>
    );
  }
);

MobileCategoryDropdown.displayName = "MobileCategoryDropdown";

// Enhanced Navbar Skeleton Component
const EnhancedNavbarSkeleton = () => {
  return (
    <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-18 py-2">
          {/* Logo Skeleton */}
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <div className="hidden sm:block">
              <Skeleton className="h-5 w-32" />
            </div>
          </div>

          {/* Search Bar Skeleton */}
          <div className="hidden md:block flex-1 max-w-xl mx-6">
            <Skeleton className="h-10 w-full rounded-full" />
          </div>

          {/* Actions Skeleton */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <Skeleton className="h-10 w-10 rounded-xl" />
            <Skeleton className="h-10 w-10 rounded-xl lg:hidden" />
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-r from-gray-50 to-green-50/30 border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14 py-2">
            <Skeleton className="h-10 w-36 rounded-xl" />
            <div className="hidden lg:flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-9 w-24 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Location Selector Component
const EnhancedLocationSelector = memo(
  ({
    location: userLocationText,
    handlePincode,
  }: {
    location: string;
    handlePincode: () => void;
  }) => (
    <Button
      variant="outline"
      size="sm"
      onClick={handlePincode}
      className="relative hidden items-center gap-2 md:flex border-none shadow-none bg-gray-100 hover:border-green-500 hover:bg-green-50 transition-all duration-200 rounded-lg px-3 h-10 font-medium  hover:shadow-md"
    >
      <MapPin className="h-4 w-4 text-(color:--primary)" />
      <span className="text-sm font-(family-name:--font-primary) font-bold max-w-24 truncate text-gray-700">
        {userLocationText}
      </span>
      <ChevronDown className="h-3 w-3 text-gray-500" />
    </Button>
  )
);

EnhancedLocationSelector.displayName = "EnhancedLocationSelector";

// Enhanced User Menu
const EnhancedUserMenu = ({
  customer,
  profileLinks,
  setIsLogoutPopup,
}: {
  customer: {
    name?: string;
    avatar?: string;
    customerId?: number;
    storeId?: number;
    gender?: string;
    dob?: string;
    email?: string;
    countryCode?: string;
    phone?: string;
    altCountryCode?: string | null;
    altPhone?: string | null;
    areaPincode?: string | null;
    city?: string | null;
    customerType?: number;
    genderValue?: string;
  };
  profileLinks: ProfileLink[];
  setIsLogoutPopup: (value: boolean) => void;
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button
        variant="ghost"
        className="relative h-10 w-10 rounded-xl hover:bg-primary transition-all duration-200 shadow-sm hover:shadow-md"
      >
        <Avatar className="h-8 w-8 ring-2 ring-primary-200 shadow-lg">
          <AvatarImage src={customer?.avatar || "/placeholder.svg"} />
          <AvatarFallback className="bg-gradient-to-br from-primary to-primary-foreground text-white font-bold text-sm">
            {customer?.name?.charAt(0) || "U"}
          </AvatarFallback>
        </Avatar>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent
      align="end"
      className="w-64 p-3 shadow-2xl border-0 rounded-xl"
    >
      <div className="p-4 bg-gradient-to-r from-primary to-primary-foreground/70 rounded-lg mb-3 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary-foreground"></div>
          <div className="absolute -left-6 -bottom-6 w-20 h-20 rounded-full bg-gradient-to-tr from-primary to-primary-foreground"></div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14 ring-2 ring-(color:--navbar-user-avatar-ring-color) shadow-lg">
              <AvatarImage src={customer?.avatar || "/placeholder.svg"} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary-foreground text-white font-bold text-xl">
                {customer?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <p className="font-bold text-lg text-gray-900 truncate leading-tight">
                {customer?.name || "User"}
              </p>
              <p className="text-xs text-emerald-700 flex items-center gap-1 mt-0.5 truncate">
                <span className="inline-block w-2 h-2 rounded-full bg-primary"></span>
                <span>{customer?.email || "Email not available"}</span>
              </p>
              {customer?.phone && (
                <p className="text-xs text-gray-600 flex items-center gap-1 mt-0.5 truncate">
                  <Phone className="h-3 w-3 text-gray-500" />
                  <span>
                    {customer?.countryCode || ""} {customer?.phone || ""}
                  </span>
                </p>
              )}
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-medium">
                  {customer?.gender || "--"}
                </span>
                <span className="text-xs text-gray-500">
                  ID: {customer?.customerId || "--"}
                </span>
                {/* {customer?.dob && (
                  <span className="text-xs text-gray-500">
                    DOB: {new Date(customer.dob).toLocaleDateString()}
                  </span>
                )} */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <DropdownMenuSeparator />
      <div className="space-y-1">
        {profileLinks.map((profile, i) => (
          <DropdownMenuItem
            key={i}
            onClick={profile.onClick}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-(color:--navbar-user-link-hover-bg) transition-all duration-200 cursor-pointer"
          >
            <div className="p-(spacing:--navbar-user-link-icon-padding) bg-(color:--navbar-user-link-icon-bg) rounded-(--radius-lg)">
              <span className="material-symbols-rounded text-(color:--navbar-user-link-icon-color) text-(size:--navbar-user-link-icon-size)">
                {profile.icon}
              </span>
            </div>
            <span className="font-medium text-white-700 text-sm">
              {profile.lable}
            </span>
          </DropdownMenuItem>
        ))}
      </div>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        onClick={() => setIsLogoutPopup(true)}
        className="flex items-center gap-3 p-3 rounded-lg text-(color:--error) hover:bg-(color:--error-light) focus:bg-(color:--error-light) transition-all duration-200 cursor-pointer"
      >
        <div className="p-2 bg-(color:--error-light) rounded-xl">
          <LogOut className="h-(height:--mobile-menu-item-icon-size) w-(width:--mobile-menu-item-icon-size) text-(color:--error)" />
        </div>
        <span className="font-(weight:--fw-medium) text-(size:--fs-sm)">
          Logout
        </span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

// Enhanced Cart Button
const EnhancedCartButton = ({
  cart,
  storeDetails,
  pathName,
  setCartPopupShowing,
  cartPopupShowing,
  isStoreClosed,
}: {
  cart: { CartItems: Array<unknown> };
  storeDetails: { loginTypes?: Array<{ allowGuest: boolean }> };
  pathName: string;
  setCartPopupShowing: (value: boolean) => void;
  cartPopupShowing: boolean;
  isStoreClosed?: boolean;
}) => {
  const router = useRouter();
  const [closeTimeout, setCloseTimeout] = useState<NodeJS.Timeout | null>(null);
  const cartItemCount = cart?.CartItems?.length || 0;

  // Hide cart button when store is closed
  if (isStoreClosed) {
    return null;
  }

  const handleCartClick = () => {
    if (pathName === "/cart") return;
    if (storeDetails?.loginTypes?.[0]?.allowGuest) {
      setCartPopupShowing(false);
      router.push("/cart");
    }
  };

  const handleMouseEnter = () => {
    if (pathName !== "/cart") {
      if (closeTimeout) {
        clearTimeout(closeTimeout);
        setCloseTimeout(null);
      }
      setCartPopupShowing(true);
    }
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    // Check if we're moving to a related element (child of the cart container)
    const relatedTarget = e.relatedTarget as Element;
    const currentTarget = e.currentTarget as Element;

    if (relatedTarget && currentTarget.contains(relatedTarget)) {
      return; // Don't close if moving to a child element
    }

    const timeout = setTimeout(() => {
      setCartPopupShowing(false);
    }, 2000); // Increased to 2 seconds for better UX
    setCloseTimeout(timeout);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="relative border-1 border-[var(--mobile-nav-border-color)] hover:border-[var(--primary)] hover:bg-[var(--mobile-nav-toggle-hover-bg)] transition-all duration-200 h-[var(--mobile-nav-toggle-size)] w-[var(--mobile-nav-toggle-size)] rounded-(--radius-lg) shadow-sm hover:shadow-md"
            onClick={handleCartClick}
          >
            <ShoppingCart className="text-white h-[var(--mobile-menu-item-icon-size)] w-[var(--mobile-menu-item-icon-size)]" />
            <AnimatePresence>
              {cartItemCount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center bg-[var(--error)] text-[var(--on-error)] text-xs font-[var(--fw-bold)] rounded-full shadow-md"
                  key="cart-badge"
                >
                  {cartItemCount}
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </TooltipTrigger>
      </Tooltip>

      <AnimatePresence>
        {cartPopupShowing && cartItemCount > 0 && (
          <>
            {/* Invisible hover bridge */}
            <div
              className="absolute right-0 top-full w-80 h-2 z-40"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute right-0 top-full mt-1 w-80 z-50"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Card className="shadow-2xl border-0 overflow-hidden rounded-xl">
                <CardHeader className="bg-gradient-to-r from-(color:--primary) to-(color:--primary)/30 text-white p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold flex items-center gap-2 text-sm">
                      <ShoppingCart className="h-4 w-4" />
                      Your Cart ({cartItemCount})
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20 rounded-lg h-8"
                      onClick={() => router.push("/cart")}
                    >
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <CartPopup />
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// Enhanced Mobile Sidebar
const EnhancedMobileSidebar = ({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  navigationItems,
  isLoggedIn,
  customer,
  userLocationText,
  handleLogin,
  handlePincode,
  setIsLogoutPopup,
  searchString,
  setSearchString,
  showResults,
  setShowResults,
  searchResults,
  onProductClick,
  searchContainerRef,
  categories,
  onCategoryClick,
  onSubcategoryClick,
  store,
}: {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  navigationItems: MenuItem[];
  isLoggedIn: boolean;
  customer: {
    name?: string;
    avatar?: string;
    location?: string;
    customerId?: number;
    storeId?: number;
    gender?: string;
    dob?: string;
    email?: string;
    countryCode?: string;
    phone?: string;
    altCountryCode?: string | null;
    altPhone?: string | null;
    areaPincode?: string | null;
    city?: string | null;
    customerType?: number;
    genderValue?: string;
  };
  userLocationText: string;
  setIsLogoutPopup: (value: boolean) => void;
  searchString: string;
  setSearchString: (value: string) => void;
  showResults: boolean;
  setShowResults: (show: boolean) => void;
  searchResults: Array<{ productId: string; name: string; slug?: string }>;
  onProductClick: (id: string) => void;
  searchContainerRef:
    | React.RefObject<HTMLDivElement>
    | React.RefObject<HTMLDivElement | null>;
  categories: ICategory[];
  onCategoryClick: (slug: string) => void;
  onSubcategoryClick: (categorySlug: string, subcategoryId: number) => void;
  handleLogin: () => void;
  handlePincode: () => void;
  store: StoreData;
}) => {
  const router = useRouter();
  const [showCategories, setShowCategories] = useState<boolean>(false);

  return (
    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="lg:hidden border-2 border-(color:--mobile-nav-border-color) hover:border-(color:--primary) hover:bg-(color:--mobile-nav-toggle-hover-bg) h-(height:--mobile-nav-toggle-size) w-(width:--mobile-nav-toggle-size) rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
        >
          <Menu className="h-(height:--mobile-nav-toggle-icon-size) w-(width:--mobile-nav-toggle-icon-size) text-(color:--mobile-nav-toggle-icon-color)" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-[90vw] max-w-sm p-0 flex flex-col h-full overflow-hidden"
      >
        {/* Enhanced Header */}
        <SheetHeader className="p-4 bg-gradient-to-br from-(color:--primary) via-(color:--primary) to-(color:--primary) text-(color:--primary-foreground) relative overflow-hidden shrink-0">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <SheetTitle className="text-(color:--primary-foreground) text-left font-bold text-xl">
                {store.Store.storeName}
              </SheetTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-(color:--primary-foreground) hover:bg-white/20 rounded-lg h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Always show user section - either logged in user or guest prompt */}
            {isLoggedIn && customer ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-3 bg-(color:--primary-foreground)/15 rounded-xl backdrop-blur-sm border border-(color:--primary-foreground)/20"
              >
                <Avatar className="h-10 w-10 ring-2 ring-(color:--primary-foreground)/30 shrink-0">
                  <AvatarImage src={customer?.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-(color:--primary-foreground)/20 text-(color:--primary-foreground) font-bold text-sm">
                    {customer?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden min-w-0">
                  <p className="font-bold text-sm text-(color:--primary-foreground) truncate">
                    {customer?.name || "User"}
                  </p>
                  {customer?.email && (
                    <p className="text-xs text-(color:--primary-foreground)/80 truncate mt-0.5">
                      {customer?.email}
                    </p>
                  )}
                  {customer?.phone && (
                    <p className="text-xs text-(color:--primary-foreground)/80 flex items-center gap-1 mt-0.5 truncate">
                      <Phone className="h-3 w-3 text-(color:--primary-foreground)/60 shrink-0" />
                      <span className="truncate">
                        {customer?.countryCode || ""} {customer?.phone}
                      </span>
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {customer?.gender && (
                      <span className="text-xs bg-(color:--primary-foreground)/20 text-(color:--primary-foreground) px-2 py-0.5 rounded-full font-medium">
                        {customer?.gender}
                      </span>
                    )}
                    {customer?.customerId && (
                      <span className="text-xs text-(color:--primary-foreground)/70">
                        ID: {customer?.customerId}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-3 bg-(color:--primary-foreground)/15 rounded-xl backdrop-blur-sm border border-(color:--primary-foreground)/20"
              >
                <Avatar className="h-10 w-10 ring-2 ring-(color:--primary-foreground)/30 shrink-0">
                  <AvatarFallback className="bg-(color:--primary-foreground)/20 text-(color:--primary-foreground) font-bold text-sm">
                    G
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden min-w-0">
                  <p className="font-bold text-sm text-(color:--primary-foreground)">
                    Guest User
                  </p>
                  <p className="text-xs text-(color:--primary-foreground)/80 mt-0.5">
                    Sign in for better experience
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </SheetHeader>

        {/* Scrollable Content */}
        <ScrollArea className="flex-1 bg-(color:--background)/50">
          <div className="space-y-1">
            {/* <div className="p-4 bg-(color:--card) border-b border-(color:--border)">
              <h3 className="text-base font-bold mb-3 text-(color:--foreground) flex items-center gap-2">
                <MapPin className="h-4 w-4 text-(color:--primary)" />
                Delivery Location
              </h3>
              <Button
                variant="outline"
                onClick={() => {
                  setIsMobileMenuOpen(false); // Close sidebar first
                  setTimeout(() => handlePincode(), 100); // Open location selector after sidebar closes
                }}
                className="w-full justify-start gap-3 h-11 rounded-lg border-2 border-(color:--border) hover:border-(color:--primary) hover:bg-(color:--primary)/10 transition-all duration-200 font-medium"
              >
                <div className="p-1.5 bg-(color:--primary)/10 rounded-md">
                  <MapPin className="h-3.5 w-3.5 text-(color:--primary)" />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="text-sm font-medium text-(color:--foreground) truncate">
                    {userLocationText}
                  </div>
                  <div className="text-xs text-(color:--muted-foreground)">
                    Choose your delivery area
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-(color:--muted-foreground) shrink-0" />
              </Button>
            </div> */}

            {/* Enhanced Search */}
            <div className="p-4 bg-(color:--card) border-b border-(color:--border)">
              <h3 className="text-base font-bold mb-3 text-(color:--foreground)">
                Search Products
              </h3>
              <EnhancedSearchBox
                searchString={searchString}
                onSearchChange={setSearchString}
                showResults={showResults}
                setShowResults={setShowResults}
                searchResults={searchResults.map((item) => ({
                  ...item,
                  slug: item.slug || item.productId,
                }))}
                onProductClick={onProductClick}
                searchContainerRef={searchContainerRef}
                searchPlaceholder="Search products..."
                isMobile={true}
              />
            </div>

            {/* Categories Section */}
            <div className="p-4 bg-(color:--card) border-b border-(color:--border)">
              <button
                onClick={() => setShowCategories(!showCategories)}
                className="w-full flex items-center justify-between text-base font-bold text-(color:--foreground) mb-2"
              >
                <div className="flex items-center gap-2">
                  <Grid className="h-4 w-4 text-(color:--primary)" />
                  Categories
                </div>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-(color:--muted-foreground)",
                    "transition-transform duration-200",
                    showCategories && "transform rotate-180"
                  )}
                />
              </button>

              <AnimatePresence>
                {showCategories && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden mt-3"
                  >
                    <div className="max-h-64 overflow-y-auto">
                      <MobileCategoryDropdown
                        categories={categories || []}
                        onCategoryClick={onCategoryClick}
                        onSubcategoryClick={onSubcategoryClick}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Enhanced Navigation */}
            <div className="p-4 bg-(color:--card)">
              <h3 className="text-base font-bold mb-3 text-(color:--foreground)">
                Navigation
              </h3>
              <nav className="space-y-1">
                {navigationItems.map((item, index) => (
                  <SheetClose asChild key={index}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-3 px-3 py-2.5 h-auto rounded-lg hover:bg-(color:--primary)/10 hover:text-(color:--primary) transition-all duration-200 cursor-pointer"
                      onClick={() => router.push(item.path)}
                    >
                      {item.icon ? (
                        <div className="p-1.5 bg-(color:--primary)/10 rounded-md">
                          <span className="material-symbols-rounded text-(color:--primary) text-base">
                            {item.icon}
                          </span>
                        </div>
                      ) : (
                        <div className="p-1.5 bg-(color:--primary)/10 rounded-md">
                          <ChevronRight className="h-3.5 w-3.5 text-(color:--primary)" />
                        </div>
                      )}
                      <span className="text-(color:--foreground) text-sm font-medium">
                        {item.itemName}
                      </span>
                    </Button>
                  </SheetClose>
                ))}
              </nav>
            </div>
          </div>
        </ScrollArea>

        {/* Enhanced Footer */}
        <SheetFooter className="p-4 border-t bg-(color:--card) mt-auto shrink-0">
          {isLoggedIn && customer ? (
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-11 rounded-lg text-(color:--destructive) border-2 border-(color:--destructive)/20 hover:bg-(color:--destructive)/10 transition-all duration-200 font-medium"
              onClick={() => {
                setIsMobileMenuOpen(false); // Close sidebar
                setIsLogoutPopup(true); // Open logout confirmation
              }}
            >
              <div className="p-1.5 bg-(color:--destructive)/10 rounded-md">
                <LogOut className="h-3.5 w-3.5 text-(color:--destructive)" />
              </div>
              <span>Logout</span>
            </Button>
          ) : (
            <Button
              variant="default"
              className="w-full justify-start gap-3 h-11 rounded-lg bg-gradient-to-r from-(color:--primary) to-(color:--primary) hover:from-(color:--primary)/90 hover:to-(color:--primary)/90 text-(color:--primary-foreground) shadow-lg hover:shadow-xl transition-all duration-200 font-medium"
              onClick={() => {
                setIsMobileMenuOpen(false); // Close sidebar first
                handleLogin(); // Then open login modal
              }}
            >
              <div className="p-1.5 bg-(color:--primary-foreground)/20 rounded-md">
                <User className="h-3.5 w-3.5 text-(color:--primary-foreground)" />
              </div>
              <span>Sign In</span>
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

// Add display names
EnhancedSearchBox.displayName = "EnhancedSearchBox";
EnhancedCategoryDropdown.displayName = "EnhancedCategoryDropdown";
EnhancedNavbarSkeleton.displayName = "EnhancedNavbarSkeleton";
EnhancedMobileSidebar.displayName = "EnhancedMobileSidebar";

const ANNOUNCEMENT =
  "🚚 Free delivery on orders above $50! Limited time offer.";

// Main Enhanced Navbar Component
const Navbar = ({
  store,
  searchPlaceholder,
}: {
  store: StoreData;
  searchPlaceholder?: string;
}) => {
  const router = useRouter();
  const pathName = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Use the real navbar hook
  const {
    location: userLocationText,
    cartPopupShowing,
    isLogoutPopup,
    cart,
    isLoggedIn,
    isGuest,
    customer,
    storeDetails,
    profileLinks,
    handlePincode,
    handleLogout,
    handleCancel,
    setCartPopupShowing,
    setIsLogoutPopup,
  } = useNavbar(store);

  // Store status checking
  const storeStatus = useSelector(
    (state: RootState) => state.store.storestatus
  );
  const isStoreOpen = useSelector(
    (state: RootState) => state.store.store?.isStoreOpen
  );

  // Check if store is closed due to being paused or outside business hours
  const isStoreClosed =
    storeStatus?.storePaused || !isStoreOpen?.isStoreOpenNow;

  console.log("customer in Navbar grocery", customer);
  // Simple login modal handler
  const handleSimpleLogin = () => {
    setIsMobileMenuOpen(false); // Close sidebar first
    setIsLoginModalOpen(true); // Open simple login modal
  };

  console.log("store in Navbar grocery", store);
  // Use the real secondary nav hook
  const {
    categories,
    searchString,
    setSearchString,
    showResults,
    setShowResults,
    searchContainerRef,
    matchedList,
    navigateToProduct,
    navigateToCategory,
    navigateToSubcategory,
  } = useSecondaryNav();

  // Clean up on navigation
  useEffect(() => {
    toast.dismiss();
    window.scrollTo(0, 0);
    dispatch(togglePopModal(false));
    dispatch(updatePopModalData({ title: "", content: null }));
    setIsMobileMenuOpen(false);
  }, [pathName, dispatch]);

  // Loading state
  if (!store?.Store || !store?.Channels) {
    return <EnhancedNavbarSkeleton />;
  }

  // Navigation items filtering

  // Filter navigation items
  const navigationItems = storeDetails?.menu
    ? storeDetails.menu
        .filter((item: MenuItem) => item.enabled === 1)
        .sort((a: MenuItem, b: MenuItem) => a.priority - b.priority)
    : [];

  // Animation variants
  const navbarVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  // Get announcements from Redux
  const announcements =
    useSelector((state: RootState) => state.store.announcement) || [];

  // Helper to render a bar
  const renderAnnouncementBar = (bar: any, key: string | number) => (
    <div
      key={key}
      style={{
        background: bar.background_color,
        color: bar.title_color,
        textAlign: bar.text_alignment,
        fontSize: bar.title_size,
        display: "flex",
        alignItems: "center",
        justifyContent: bar.text_alignment,
        padding: "0.5rem 1rem",
        fontWeight: 500,
        gap: "1rem",
        width: "100%",
      }}
    >
      <span>{bar.text}</span>
      {bar.button_enabled === 1 && (
        <a
          href={bar.button_link}
          target={bar.button_link?.startsWith("http") ? "_blank" : undefined}
          rel={
            bar.button_link?.startsWith("http")
              ? "noopener noreferrer"
              : undefined
          }
          style={{
            background: bar.button_color,
            color: bar.button_sub_text_color,
            fontSize: bar.button_sub_text_size,
            borderRadius: bar.button_corner_radius,
            padding: "0.25rem 1rem",
            fontWeight: 600,
            textDecoration: "none",
            marginLeft: "0.5rem",
            display: "inline-block",
          }}
        >
          Shop Now
        </a>
      )}
    </div>
  );

  return (
    <TooltipProvider>
      <div
        role="main"
        className=" fixed top-0 left-0 right-0 z-50 bg-(color:--primary)"
      >
        {/* Top Announcement Bars */}
        {announcements
          .filter(
            (bar: any) =>
              bar.status === "active" &&
              bar.bar_position === "top" &&
              // Only show if display_on_page matches current path
              (bar.display_on_page?.type === "All Pages" ||
                (bar.display_on_page?.type === "Home Page" &&
                  pathName === "/") ||
                (bar.display_on_page?.type === "Specific Pages" &&
                  Array.isArray(bar.display_on_page.pages) &&
                  bar.display_on_page.pages.includes(pathName)))
          )
          .map((bar: any, i: number) =>
            renderAnnouncementBar(bar, `top-${bar.id || i}`)
          )}
        {/* Main Navigation */}
        <motion.nav
          initial="hidden"
          animate="visible"
          variants={navbarVariants}
        >
          <div className="container mx-auto max-w-full px-4 md:px-8 lg:px-12">
            <div className="flex items-center justify-between h-16 md:h-18 py-2">
              {/* Left Section: Logo + Store Name + Location */}
              <motion.div
                className="flex items-center gap-2 md:gap-4 flex-shrink-0"
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
              >
                <div
                  className="flex items-center gap-2 cursor-pointer group"
                  onClick={() => router.push("/")}
                >
                  <div className="relative">
                    <Image
                      src={store.Store.logo || "/placeholder.svg"}
                      alt={`${store.Store.storeName} logo`}
                      className="relative object-contain"
                      width={32}
                      height={32}
                      priority
                    />
                  </div>
                  <div className="truncate">
                    <h1 className="text-base  md:text-lg font-(family-name:--font-primary) font-bold text-white truncate">
                      {store.Store.storeName}
                    </h1>
                  </div>
                </div>
                {/* <div className="hidden md:block">
                  <EnhancedLocationSelector
                    location={userLocationText}
                    handlePincode={handlePincode}
                  />
                </div> */}
              </motion.div>

              {/* Center Section: Search Bar */}
              <motion.div
                className="hidden lg:flex flex-1 justify-center px-4 md:px-8"
                variants={itemVariants}
                ref={searchContainerRef}
              >
                <div className="w-full max-w-2xl">
                  <EnhancedSearchBox
                    searchString={searchString}
                    onSearchChange={setSearchString}
                    showResults={showResults}
                    setShowResults={setShowResults}
                    searchResults={matchedList}
                    onProductClick={navigateToProduct}
                    searchContainerRef={searchContainerRef}
                    searchPlaceholder={searchPlaceholder}
                  />
                </div>
              </motion.div>

              {/* Right Section: Actions */}
              <motion.div
                className="flex items-center gap-1 md:gap-2 flex-shrink-0"
                variants={itemVariants}
              >
                {/* Enhanced Cart */}
                <EnhancedCartButton
                  cart={cart}
                  storeDetails={storeDetails}
                  pathName={pathName}
                  setCartPopupShowing={setCartPopupShowing}
                  cartPopupShowing={cartPopupShowing}
                  isStoreClosed={isStoreClosed}
                />

                {/* Enhanced User Menu */}
                {isLoggedIn && customer ? (
                  <EnhancedUserMenu
                    customer={{
                      name: customer?.name,
                      avatar: customer?.avatar,
                      customerId:
                        typeof customer?.customerId === "string"
                          ? parseInt(customer.customerId)
                          : customer?.customerId,
                      storeId:
                        typeof customer?.storeId === "string"
                          ? parseInt(customer.storeId)
                          : customer?.storeId,
                      gender: customer?.gender,
                      dob: customer?.dob,
                      email: customer?.email,
                      countryCode: customer?.countryCode,
                      phone: customer?.phone,
                      altCountryCode: customer?.altCountryCode,
                      altPhone: customer?.altPhone,
                      areaPincode: customer?.areaPincode,
                      city: customer?.city,
                      customerType: customer?.customerType,
                      genderValue: customer?.genderValue,
                    }}
                    profileLinks={profileLinks}
                    setIsLogoutPopup={setIsLogoutPopup}
                  />
                ) : (
                  <div className="hidden  md:flex items-center gap-2 ">
                    <LoginModal
                      storeImage={store.Store?.logo || ""}
                      storeName={store.Store?.storeName || ""}
                    />
                  </div>
                )}

                {/* Enhanced Mobile Sidebar */}
                <EnhancedMobileSidebar
                  isMobileMenuOpen={isMobileMenuOpen}
                  setIsMobileMenuOpen={setIsMobileMenuOpen}
                  navigationItems={navigationItems}
                  isLoggedIn={isLoggedIn && customer}
                  customer={{
                    name: customer?.name,
                    avatar: customer?.avatar,
                    location: customer?.location,
                    customerId:
                      typeof customer?.customerId === "string"
                        ? parseInt(customer.customerId)
                        : customer?.customerId,
                    storeId:
                      typeof customer?.storeId === "string"
                        ? parseInt(customer.storeId)
                        : customer?.storeId,
                    gender: customer?.gender,
                    dob: customer?.dob,
                    email: customer?.email,
                    countryCode: customer?.countryCode,
                    phone: customer?.phone,
                    altCountryCode: customer?.altCountryCode,
                    altPhone: customer?.altPhone,
                    areaPincode: customer?.areaPincode,
                    city: customer?.city,
                    customerType: customer?.customerType,
                    genderValue: customer?.genderValue,
                  }}
                  userLocationText={userLocationText}
                  handleLogin={handleSimpleLogin}
                  handlePincode={() => {
                    setIsMobileMenuOpen(false);
                    setTimeout(() => handlePincode(), 100);
                  }}
                  store={store}
                  setIsLogoutPopup={setIsLogoutPopup}
                  searchString={searchString}
                  setSearchString={setSearchString}
                  showResults={showResults}
                  setShowResults={setShowResults}
                  searchResults={matchedList}
                  onProductClick={navigateToProduct}
                  searchContainerRef={searchContainerRef}
                  categories={categories || []}
                  onCategoryClick={navigateToCategory}
                  onSubcategoryClick={
                    navigateToSubcategory as (
                      categorySlug: string,
                      subcategoryId: number
                    ) => void
                  }
                />
              </motion.div>
            </div>
          </div>
        </motion.nav>

        {/* Enhanced Categories Bar */}
        <motion.div
          className="hidden md:block bg-(color:--primary) border-t border-gray-200 shadow-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="container mx-auto max-w-full px-4 md:px-8 lg:px-12">
            <div className="flex items-center h-12 md:h-14 py-2">
              {/* Left Section: Categories Dropdown */}
              <div className="flex-shrink-0">
                <EnhancedCategoryDropdown
                  categories={categories || []}
                  onCategoryClick={navigateToCategory}
                  onSubcategoryClick={
                    navigateToSubcategory as (
                      categorySlug: string,
                      subcategoryId: number
                    ) => void
                  }
                />
              </div>

              {/* Center Section: Navigation Links */}
              <div className="hidden lg:flex flex-1 justify-center items-center gap-1">
                {navigationItems
                  .slice(0, 6)
                  .map((item: MenuItem, index: number) => {
                    const isActive =
                      pathName.split("/")[1] === item.path.split("/")[1];
                    return (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className={cn(
                            "relative overflow-hidden text-white hover:bg-(color:--secondary) transition-all duration-300 rounded-xl px-4 h-9 font-semibold text-sm group",
                            isActive
                              ? "border-white"
                              : "text-white hover:text-(color:--primary) "
                          )}
                          onClick={() => router.push(item.path)}
                        >
                          {/* Background animation */}
                          <div className="absolute inset-0 bg-gradient-to-r from-(color:--primary) to-(color:--primary-hover) opacity-0 group-hover:opacity-10 transition-opacity duration-300" />

                          {/* Icon */}
                          {item.icon && (
                            <span className="material-symbols-rounded mr-2 text-base transition-transform duration-200 group-hover:scale-110">
                              {item.icon}
                            </span>
                          )}

                          {/* Text */}
                          <span className="relative z-10">{item.itemName}</span>

                          {/* Active indicator */}
                          {isActive && (
                            <motion.div
                              layoutId="activeTab"
                              className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
                              initial={false}
                              transition={{
                                type: "spring",
                                stiffness: 500,
                                damping: 30,
                              }}
                            />
                          )}

                          {/* Hover indicator */}
                          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-(color:--primary) to-(color:--primary-hover) scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                        </Button>
                      </motion.div>
                    );
                  })}

                {/* More menu for additional items */}
                {navigationItems.length > 6 && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-600 hover:text-(color:--primary) hover:bg-(color:--primary-light) transition-all duration-200 rounded-xl px-3 h-9 font-medium text-sm"
                      >
                        More
                        <ChevronDown className="ml-1 h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-48 p-2 shadow-xl border-0 rounded-xl"
                    >
                      {navigationItems
                        .slice(6)
                        .map((item: MenuItem, index: number) => (
                          <DropdownMenuItem
                            key={index}
                            onClick={() => router.push(item.path)}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-(color:--primary-light) transition-all duration-200 cursor-pointer"
                          >
                            {item.icon && (
                              <span className="material-symbols-rounded text-(color:--primary) text-base">
                                {item.icon}
                              </span>
                            )}
                            <span className="font-medium text-gray-700 text-sm">
                              {item.itemName}
                            </span>
                          </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Logout Dialog */}
        {isLogoutPopup && (
          <Logout onLogout={handleLogout} onCancel={handleCancel} />
        )}

        {/* Simple Login Modal */}
        {isLoginModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
            <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
              <button
                onClick={() => setIsLoginModalOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="p-6">
                <LoginModal
                  storeImage={store.Store?.logo || ""}
                  storeName={store.Store?.storeName || ""}
                  asComponent={true}
                  onClose={() => setIsLoginModalOpen(false)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Bottom Announcement Bars */}
        {announcements
          .filter(
            (bar: any) =>
              bar.status === "active" &&
              bar.bar_position === "bottom" &&
              // Only show if display_on_page matches current path
              (bar.display_on_page?.type === "All Pages" ||
                (bar.display_on_page?.type === "Home Page" &&
                  pathName === "/") ||
                (bar.display_on_page?.type === "Specific Pages" &&
                  Array.isArray(bar.display_on_page.pages) &&
                  bar.display_on_page.pages.includes(pathName)))
          )
          .map((bar: any, i: number) =>
            renderAnnouncementBar(bar, `bottom-${bar.id || i}`)
          )}
      </div>
    </TooltipProvider>
  );
};

export default Navbar;
