"use client";
import React from "react";
import Link from "next/link";

interface HeroConfig {
  title?: string;
  subtitle?: string;
  button_text?: string;
  button_link?: string;
  background_image?: string;
}

interface HeroProps {
  config?: HeroConfig;
}

const Hero: React.FC<HeroProps> = ({ config = {} }) => {
  const {
    title = "Welcome to Our Store",
    subtitle = "Discover amazing products at great prices",
    button_text = "Shop Now",
    button_link = "/products",
    background_image = "https://images.pexels.com/photos/1005638/pexels-photo-1005638.jpeg",
  } = config;

  return (
    <section
      className="relative min-h-[500px] flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url(${background_image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "500px",
        position: "relative",
      }}
    >
      {/* Dark overlay for better text readability */}
      <div
        className="absolute inset-0 bg-black bg-opacity-40 z-0"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          zIndex: 1,
        }}
      ></div>

      {/* Content */}
      <div
        className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 text-center text-white"
        style={{
          position: "relative",
          zIndex: 10,
          color: "white",
          textAlign: "center",
        }}
      >
        <h1
          className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
          style={{
            color: "white",
            fontSize: "clamp(2rem, 5vw, 4rem)",
            fontWeight: "bold",
            marginBottom: "1.5rem",
            lineHeight: "1.2",
          }}
        >
          {title}
        </h1>
        <p
          className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed"
          style={{
            color: "white",
            fontSize: "clamp(1.125rem, 2.5vw, 1.5rem)",
            marginBottom: "2rem",
            maxWidth: "48rem",
            margin: "0 auto 2rem auto",
            lineHeight: "1.6",
          }}
        >
          {subtitle}
        </p>
        {button_link && button_text && (
          <Link
            href={button_link}
            className="inline-block bg-(color:--primary) hover:bg-(color:--primary-hover) text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
            style={{
              display: "inline-block",
              color: "white",
              fontWeight: "600",
              padding: "1rem 2rem",
              borderRadius: "0.5rem",
              fontSize: "1.125rem",
              textDecoration: "none",
              transition: "all 0.2s ease",
              boxShadow:
                "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            }}
          >
            {button_text}
          </Link>
        )}
      </div>
    </section>
  );
};

export default Hero;
