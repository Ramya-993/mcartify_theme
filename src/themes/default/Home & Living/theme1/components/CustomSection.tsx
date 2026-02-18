"use client";
import React from "react";
import { Layouts, Layout } from "react-grid-layout";
import CustomSectionView from "../views/CustomSectionView";

// Type definitions
export interface CustomSectionImage {
  id: number | string;
  text?: string;
  image: string;
  layout: Layout;
  image_url: string;
  link_type?: "category" | "product" | "url";
  link_value?: string;
  generatedLink?: string | null; // Added for container processing
}

export interface CustomSectionConfig {
  title?: string;
  sub_title?: string;
  custom_section_images: CustomSectionImage[];
}

export interface CustomSectionProps {
  config: CustomSectionConfig;
}

export interface CustomSectionViewProps {
  title?: string;
  sub_title?: string;
  images: CustomSectionImage[];
  layouts: Layouts;
}

const CustomSection: React.FC<CustomSectionProps> = ({ config }) => {
  // Generates link based on link_type in the container
  const generateLink = (image: CustomSectionImage) => {
    if (!image.link_type || !image.link_value) return null;

    switch (image.link_type) {
      case "category":
        return `/products/category/${image.link_value}`;
      case "product":
        return `/products/${image.link_value}`;
      case "url":
        return image.link_value.startsWith("http")
          ? image.link_value
          : `https://${image.link_value}`;
      default:
        return null;
    }
  };

  // Validation and early return
  if (!config?.custom_section_images?.length) {
    return (
      <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">No custom section images configured</p>
      </div>
    );
  }

  const { title, sub_title, custom_section_images } = config;

  // Create layout array with proper IDs
  const layout: Layout[] = custom_section_images.map((img) => ({
    ...img.layout,
    i: String(img.id),
  }));

  const layouts: Layouts = { lg: layout };

  // Prepare images with links
  const processedImages = custom_section_images.map((img) => ({
    ...img,
    generatedLink: generateLink(img),
  }));

  return (
    <CustomSectionView
      title={title}
      sub_title={sub_title}
      images={processedImages}
      layouts={layouts}
    />
  );
};

export default CustomSection;
