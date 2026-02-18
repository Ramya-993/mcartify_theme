"use client";

import { Suspense } from "react";
import DynamicFooterWrapper from "./DynamicFooterWrapper";

interface ClientFooterProps {
  name: string;
  image: string;
}

const ClientFooter = ({ name, image }: ClientFooterProps) => {
  return (
    <Suspense fallback={<div className="w-full h-40 bg-card animate-pulse" />}>
      <DynamicFooterWrapper name={name} image={image} />
    </Suspense>
  );
};

export default ClientFooter;
