"use client";
import { useFooter } from "@/themes/hooks/useFooter";
import React, { memo } from "react";
import FooterView from "../views/FooterView";

export interface FooterProps {
  name: string;
  image: string;
}

export interface Social {
  icon: string;
  href: string;
  name: string;
  color?: string;
}

export interface FooterMenuItem {
  itemName: string;
  path: string;
}

export interface FooterSection {
  sectionName: string;
  sectionItems: FooterMenuItem[];
}

export interface StoreFooter {
  footerSections?: FooterSection[];
  logoDescription?: string;
}

const Footer = memo(({ name, image }: FooterProps) => {
  const { year, store, socials } = useFooter() as {
    year: number;
    store: StoreFooter;
    socials: Social[];
  };

  // Get current year if not provided from hook
  const currentYear = year || new Date().getFullYear();

  return (
    <FooterView
      name={name}
      image={image}
      year={currentYear}
      store={store}
      socials={socials}
    />
  );
});

Footer.displayName = "Footer";

export default Footer;
