"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { HeroProps } from "../components/Hero";

const HeroView: React.FC<HeroProps> = ({ config = {} }) => {
    const {
        title = "Welcome to Our Store",
        subtitle = "Discover amazing products at great prices",
        button_text = "Shop Now",
        button_link = "/products",
        background_image = "https://images.pexels.com/photos/1005638/pexels-photo-1005638.jpeg",
    } = config;

    return (
        <section className="relative w-full h-[60vh] min-h-[400px] max-h-[900px] overflow-hidden">
            {/* Background Image */}
            <Image
                src={background_image}
                alt="Hero background"
                fill
                className="object-cover object-center"
                priority
                sizes="100vw"
            />

            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-black/40 z-10"></div>

            {/* Fade effect at the bottom */}
            <div
                className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/50 to-transparent z-20"
                style={{
                    background:
                        "linear-gradient(to top, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.5) 50%, rgba(255, 255, 255, 0) 100%)",
                }}
            ></div>

            {/* Content */}
            <div className="absolute inset-0 z-30 flex items-center justify-center">
                <div className="max-w-7xl mx-auto px-4 md:px-6 text-center text-white">
                    <h1
                        className="text-4xl md:text-6xl font-bold mb-6 leading-tight drop-shadow-lg"
                        style={{
                            color: "white",
                            fontSize: "clamp(2rem, 5vw, 4rem)",
                            fontWeight: "bold",
                            marginBottom: "1.5rem",
                            lineHeight: "1.2",
                            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
                        }}
                    >
                        {title}
                    </h1>
                    <p
                        className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow-lg"
                        style={{
                            color: "white",
                            fontSize: "clamp(1.125rem, 2.5vw, 1.5rem)",
                            marginBottom: "2rem",
                            maxWidth: "48rem",
                            margin: "0 auto 2rem auto",
                            lineHeight: "1.6",
                            textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)",
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
            </div>
        </section>
    );
};

export default HeroView;