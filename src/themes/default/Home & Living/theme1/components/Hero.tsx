"use client";
import React from "react";
import HeroView from "../views/HeroView";

export interface HeroConfig {
  title?: string;
  subtitle?: string;
  button_text?: string;
  button_link?: string;
  background_image?: string;
}

export interface HeroProps {
  config?: HeroConfig;
}

const Hero: React.FC<HeroProps> = ({ config }) => {
  return <HeroView config={config} />;
};

export default Hero;
