"use client";

import Breadcrumb from "@/components/ui/breadcrumbs";
import { deleteAllFromCart } from "@/store/slices/cart";
import { fetchCustomer, logout } from "@/store/slices/user";
import { AppDispatch, RootState } from "@/store/StoreProvider";
import Ichild from "@/types/react-children";
import { usePathname, useRouter } from "next/navigation";
import React, { Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const DynamicProfileSidebarWrapper = dynamic(
  () => import("@/components/dynamic/DynamicProfileSidebarWrapper"),
  {
    ssr: false,
    loading: () => (
      <div className="flex flex-col gap-2 p-4">
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    ),
  }
);

const DynamicProfileHeaderWrapper = dynamic(
  () => import("@/components/dynamic/DynamicProfileHeaderWrapper"),
  {
    ssr: false,
    loading: () => (
      <div className="flex flex-col items-center p-6">
        <Skeleton className="size-24 rounded-full" />
        <Skeleton className="mt-4 h-6 w-32" />
        <Skeleton className="mt-2 h-4 w-24" />
      </div>
    ),
  }
);

const ProfileLayout = ({ children }: Ichild) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const pathname = usePathname();

  // Generate breadcrumb items based on the current path
  const generateBreadcrumbs = () => {
    const pathSegments = pathname.split('/').filter(Boolean);
    let breadcrumbs = [
      {
        href: "/",
        label: "Home",
        isCurrent: false,
        isDisabled: false,
      },
    ];

    // Skip the first segment if it's just the base path
    if (pathSegments.length === 0) return breadcrumbs;

    // Add profile breadcrumb
    breadcrumbs.push({
      href: "/profile/",
      label: "Profile",
      isCurrent: pathname === "/profile/",
      isDisabled: pathname === "/profile/",
    });

    // Add dynamic segments
    if (pathSegments.length > 1) {
      const currentPath = `/${pathSegments.slice(0, 2).join('/')}`;
      const currentLabel = pathSegments[1]
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      breadcrumbs.push({
        href: currentPath,
        label: currentLabel,
        isCurrent: true,
        isDisabled: true,
      });
    }

    return breadcrumbs;
  };

  const breadcrumbItems = generateBreadcrumbs();

  useEffect(() => {
    dispatch(fetchCustomer());
  }, [dispatch]);

  const { customer } = useSelector((state: RootState) => state.user);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.clear();
    router.push("/");
    dispatch(deleteAllFromCart());
  };

  return (
    <div className="container mx-auto px-4">
      <section className="py-6 lg:py-10">
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Sidebar Column */}
          <div className="hidden lg:col-span-3 lg:block">
            <div className="space-y-6">
              <Suspense
                fallback={
                  <Card className="border-primary/20">
                    <CardContent className="flex flex-col items-center p-6">
                      <Skeleton className="size-24 rounded-full" />
                      <Skeleton className="mt-4 h-6 w-32" />
                      <Skeleton className="mt-2 h-4 w-24" />
                    </CardContent>
                  </Card>
                }
              >
                <DynamicProfileHeaderWrapper />
              </Suspense>

              <Suspense
                fallback={
                  <Card className="border-primary/20">
                    <CardContent className="flex flex-col gap-2 p-4">
                      <Skeleton className="h-10 w-full rounded-lg" />
                      <Skeleton className="h-10 w-full rounded-lg" />
                      <Skeleton className="h-10 w-full rounded-lg" />
                    </CardContent>
                  </Card>
                }
              >
                <DynamicProfileSidebarWrapper />
              </Suspense>
            </div>
          </div>

          {/* Main Content Column */}
          <div className="lg:col-span-9">
            <Card className="border-primary/20">
              <CardHeader className="border-b border-border/40 px-6">
                <Breadcrumb crumbItems={breadcrumbItems} />
              </CardHeader>
              <CardContent className="p-6">{children}</CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProfileLayout;
