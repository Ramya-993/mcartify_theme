import { Variants } from "framer-motion";

export interface TopSellingProductsConfig {
  title?: string;
  layout?: "grid" | "carousel";
  max_items?: number;
  columns?: number;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showDots?: boolean;
  showArrows?: boolean;
}

export interface TopSellingProductsProps {
  config?: TopSellingProductsConfig;
}

export const defaultTopSellingConfig: TopSellingProductsConfig = {
  title: "Top Selling Products",
  layout: "grid",
  max_items: 8,
  columns: 4,
  autoPlay: false,
  autoPlayInterval: 3000,
  showDots: true,
  showArrows: true,
};

export const topSellingAnimationVariants = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  } as Variants,

  card: {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  } as Variants,
};
