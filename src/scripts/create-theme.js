#!/usr/bin/env node

/**
 * Script to create a new theme or a new store theme
 *
 * Usage:
 *   node src/scripts/create-theme.js --store=store123 --theme=theme789
 *   node src/scripts/create-theme.js --store=store456 --theme=theme123 --copyFrom=store123/theme123
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Parse arguments
const args = process.argv.slice(2).reduce((acc, arg) => {
  const [key, value] = arg.split("=");
  acc[key.replace(/^--/, "")] = value;
  return acc;
}, {});

// Default values and validation
const storeID = args.store || "default";
const themeID = args.theme;
const copyFrom = args.copyFrom || null;

if (!themeID) {
  console.error("Please provide a theme ID using --theme=<themeID>");
  process.exit(1);
}

const themesDir = path.join(__dirname, "..", "themes");
const targetDir = path.join(themesDir, storeID, themeID);
const componentsDir = path.join(targetDir, "components");
const hooksDir = path.join(targetDir, "hooks");

// Create directory structure
const createDirectories = () => {
  try {
    if (!fs.existsSync(themesDir)) {
      fs.mkdirSync(themesDir);
      console.log(`Created: ${themesDir}`);
    }

    if (!fs.existsSync(path.join(themesDir, storeID))) {
      fs.mkdirSync(path.join(themesDir, storeID));
      console.log(`Created: ${path.join(themesDir, storeID)}`);
    }

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir);
      console.log(`Created: ${targetDir}`);
    }

    if (!fs.existsSync(componentsDir)) {
      fs.mkdirSync(componentsDir);
      console.log(`Created: ${componentsDir}`);
    }

    if (!fs.existsSync(hooksDir)) {
      fs.mkdirSync(hooksDir);
      console.log(`Created: ${hooksDir}`);
    }
  } catch (err) {
    console.error("Error creating directories:", err);
    process.exit(1);
  }
};

// Copy from an existing theme
const copyFromExistingTheme = () => {
  if (!copyFrom) return;

  try {
    const [sourceStore, sourceTheme] = copyFrom.split("/");
    const sourceDir = path.join(themesDir, sourceStore, sourceTheme);

    if (!fs.existsSync(sourceDir)) {
      console.error(`Source theme ${sourceDir} does not exist`);
      return;
    }

    // Copy components
    const sourceComponentsDir = path.join(sourceDir, "components");
    const components = fs.readdirSync(sourceComponentsDir);

    components.forEach((file) => {
      const sourcePath = path.join(sourceComponentsDir, file);
      const targetPath = path.join(componentsDir, file);

      let content = fs.readFileSync(sourcePath, "utf8");

      // Update imports
      content = content.replace(
        new RegExp(`@/themes/${sourceStore}/${sourceTheme}`, "g"),
        `@/themes/${storeID}/${themeID}`
      );

      fs.writeFileSync(targetPath, content);
      console.log(`Created: ${targetPath}`);
    });

    // Copy hooks
    const sourceHooksDir = path.join(sourceDir, "hooks");
    const hooks = fs.readdirSync(sourceHooksDir);

    hooks.forEach((file) => {
      const sourcePath = path.join(sourceHooksDir, file);
      const targetPath = path.join(hooksDir, file);

      fs.copyFileSync(sourcePath, targetPath);
      console.log(`Created: ${targetPath}`);
    });

    // Copy README
    const sourceReadmePath = path.join(sourceDir, "README.md");
    if (fs.existsSync(sourceReadmePath)) {
      fs.copyFileSync(sourceReadmePath, path.join(targetDir, "README.md"));
      console.log(`Created: ${path.join(targetDir, "README.md")}`);
    }
  } catch (err) {
    console.error("Error copying from existing theme:", err);
  }
};

// Create README template if not copying
const createReadme = () => {
  if (copyFrom) return;

  const readmePath = path.join(targetDir, "README.md");

  const content = `# ${themeID} Theme

This is a theme for the mCartify application.

## Components

This theme implements the following components:

1. Navbar
2. Footer
3. AppEngage
4. Product
5. AddToCart
6. Banners
7. CategoryCard

## Implementation Notes

- All components are implemented with their corresponding hooks
- Each hook contains the business logic for its component
- Components focus on UI and presentation

## Using This Theme

To use this theme, use the ThemeProvider:

\`\`\`jsx
import { ThemeProvider } from "@/themes/ThemeProvider";

export default function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider initialStoreID="${storeID}" initialThemeID="${themeID}">
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
\`\`\`
`;

  fs.writeFileSync(readmePath, content);
  console.log(`Created: ${readmePath}`);
};

// Create minimal component templates if not copying
const createTemplates = () => {
  if (copyFrom) return;

  // Create Navbar component and hook
  const navbarComponent = `"use client";

import { StoreData } from "@/types/store";
import Image from "next/image";
import { useNavbar } from "@/themes/${storeID}/${themeID}/hooks/useNavbar";

const Navbar = ({ store }: { store: StoreData }) => {
  const { isLoggedIn, cart } = useNavbar(store);
  
  return (
    <header className="fixed top-0 z-30 w-full bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image 
              src={store.Store.logo} 
              alt={store.Channels.title}
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="font-bold">{store.Channels.title}</span>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative">
              <span>Cart ({cart?.CartItems?.length || 0})</span>
            </button>
            
            <button>
              {isLoggedIn ? 'Account' : 'Login'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;`;

  const navbarHook = `import { useSelector } from "react-redux";
import { RootState } from "@/store/StoreProvider";
import { StoreData } from "@/types/store";

export const useNavbar = (store: StoreData) => {
  const { data: cart } = useSelector((state: RootState) => state.cart);
  const { isLoggedIn } = useSelector((state: RootState) => state.user);
  const { store: storeDetails } = useSelector((state: RootState) => state.store);
  
  return {
    cart,
    isLoggedIn,
    storeDetails
  };
};`;

  fs.writeFileSync(path.join(componentsDir, "Navbar.tsx"), navbarComponent);
  console.log(`Created: ${path.join(componentsDir, "Navbar.tsx")}`);

  fs.writeFileSync(path.join(hooksDir, "useNavbar.tsx"), navbarHook);
  console.log(`Created: ${path.join(hooksDir, "useNavbar.tsx")}`);

  // Create Footer component template
  const footerComponent = `"use client";

import { useFooter } from "@/themes/${storeID}/${themeID}/hooks/useFooter";
import Link from "next/link";
import Image from "next/image";

interface FooterProps {
  name: string;
  image: string;
}

const Footer = ({ name, image }: FooterProps) => {
  const { year } = useFooter();
  
  return (
    <footer className="bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center mb-6">
          <Image 
            src={image} 
            alt={name}
            width={60}
            height={60}
            className="rounded-full"
          />
          <h2 className="text-xl font-bold ml-2">{name}</h2>
        </div>
        
        <p className="text-center mb-6">
          A supermarket is a self-service shop offering a wide variety of food, beverages & household products.
        </p>
        
        <div className="border-t border-gray-200 pt-4 text-center">
          <p>Copyright © {year} {name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;`;

  const footerHook = `import { useSelector } from "react-redux";
import { RootState } from "@/store/StoreProvider";

export const useFooter = () => {
  const { store } = useSelector((state: RootState) => state.store);
  const year = new Date().getFullYear();
  
  return {
    year,
    store
  };
};`;

  fs.writeFileSync(path.join(componentsDir, "Footer.tsx"), footerComponent);
  console.log(`Created: ${path.join(componentsDir, "Footer.tsx")}`);

  fs.writeFileSync(path.join(hooksDir, "useFooter.tsx"), footerHook);
  console.log(`Created: ${path.join(hooksDir, "useFooter.tsx")}`);
};

// Execute the script
console.log(`Creating theme: ${storeID}/${themeID}`);
createDirectories();

if (copyFrom) {
  console.log(`Copying from: ${copyFrom}`);
  copyFromExistingTheme();
} else {
  createTemplates();
}

createReadme();

console.log(`\nTheme created successfully! 🎉`);
console.log(`\nNext steps:`);
console.log(`1. Complete the implementation of all required components`);
console.log(`2. Update the README.md with specific theme details`);
console.log(`3. Test your theme with the ThemeProviderExample`);
