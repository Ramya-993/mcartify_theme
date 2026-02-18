"use client";
import { RootState } from "@/store/StoreProvider";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";

const socials = [
  {
    icon: "/images/default/facebook.svg",
    href: "/#",
    name: "facebook",
  },
  {
    icon: "/images/default/instagram.svg",
    href: "/#",
    name: "instagram",
  },
];

const Footer = ({ name, image }: { name: string; image: string }) => {
  const year = new Date().getFullYear();
  const { channel, store } = useSelector((state: RootState) => state.store);
  // console.log(store);
  console.log( "store", store);
  return (
    <div className="border-t border-emerald-200 bg-white dark:bg-emerald-50">
      <div className="container px-8">
        <div className="py-6 xl:py-16">
          <div className="grid gap-x-6 gap-y-10 xl:grid-cols-8">
            <div className="xl:col-span-2">
              <Link href="/" className="logo flex items-center gap-2">
                <Image
                  height={100}
                  width={300}
                  src={image}
                  alt={name}
                  className="size-20 rounded-xl"
                />
                <p className="text-xl font-bold text-emerald-600">{name}</p>
              </Link>

              <p className="mt-4 max-w-xs text-base font-medium text-gray-600">
                {store?.logoDescription ||
                  "A supermarket is a self-service shop offering a wide variety of food, beverages & household products."}
              </p>
              <div className="mt-4 flex gap-4">
                <Image
                  src={"/images/default/playstore.png"}
                  width={150}
                  height={30}
                  alt={"playstore"}
                ></Image>
                <Image
                  src={"/images/default/appstore.png"}
                  width={150}
                  height={30}
                  alt={"appstore"}
                ></Image>
              </div>
            </div>
            <div className="xl:col-span-6">
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
                {store?.footerSections.map((footerMenu: any, i: number) => {
                  return (
                    <div key={i}>
                      <ul className="flex flex-col gap-3">
                        <h5 className="mb-2 font-semibold lg:text-lg xl:text-xl">
                          {footerMenu?.sectionName}
                        </h5>
                        {footerMenu.sectionItems.map(
                          (sectionItem: any, ind: number) => {
                            return (
                              <li key={ind}>
                                <Link
                                  href={sectionItem.path}
                                  className="hover:text-emerald inline-flex items-center gap-2 text-base font-semibold text-gray-600 transition-all"
                                >
                                  {sectionItem.itemName}
                                </Link>
                              </li>
                            );
                          },
                        )}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-emerald-200">
        <div className="container md:px-10 px-4">
          <div className="grid items-center gap-6 py-4 lg:grid-cols-3">
            <p className="flex md:text-center flex-col md:flex-row lg:col-span-2 lg:text-start">
              Copyright © {year} {name}. All rights reserve.
              <Link className="md:ml-4 hover:underline" href={"privacy-policy"}>
                Privacy Policy
              </Link>
            </p>
            <ul className="flex flex-wrap items-center justify-center gap-2 lg:justify-end">
              {socials.map((item, i) => (
                <li key={i}>
                  <Link
                    href={item.href}
                    className="group inline-flex h-10 w-10 items-center justify-center rounded-2xl text-emerald-500 backdrop-blur-xl transition-all duration-500 hover:bg-emerald-500/30"
                  >
                    <Image
                      src={item.icon}
                      width={24}
                      height={24}
                      alt={item.name}
                    ></Image>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
