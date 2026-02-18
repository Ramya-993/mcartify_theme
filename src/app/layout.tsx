import "@/app/globals.css";
// import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
// Dynamic components wrappers will be client-side only
import DynamicNavbarWrapper from "@/components/dynamic/DynamicNavbarWrapper";
import ClientFooter from "@/components/dynamic/ClientFooter";
import { ThemeProvider } from "@/components/theme-provider";
import StoreInitializer from "@/components/StoreInitializer";
import { ToastContainer, Zoom } from "react-toastify";
import ToastProvider from "@/utils/toastProvider";
import PopModal from "@/components/custom/ui/pop-modal";
import { FontGlobalStyle } from "@/components/FontGlobalStyle";
import React, { Suspense } from "react";
import { QueryProvider } from "@/providers/query-provider";
import StoreProvider from "@/store/StoreProvider";
import { AxiosFetcher } from "@/utils/axios";
import { TwentyFirstToolbar } from "@21st-extension/toolbar-next";
import { ReactPlugin } from "@21st-extension/react";

// const workSans = Work_Sans({
//   variable: "--font-work-sans",
//   subsets: ["latin"],
// });

// Static placeholder for SSR - NO loading animations visible to crawlers
// Remove SSRPlaceholder if not used

// Define Metadata type if not already globally available
import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import Script from "next/script";

// --- generateMetadata function ---
export async function generateMetadata(): Promise<Metadata> {
  // Fetch data within generateMetadata
  const headersList = await headers(); // Try awaiting headers()
  const host = headersList.get("host");
  const parts = host ? host.split(".") : [];
  const subdomain = parts.length >= 3 ? parts[0] : "prakash5555"; // Default or example subdomain
  let data = null;
  // console.log("subdomain123:", subdomain, parts);
  try {
    const response = await AxiosFetcher.get(
      `stores/info?channelType=1&subdomain=${subdomain}`,
      {
        headers: {
          "x-store-host": host,
        },
      }
    );
    data = response?.data;
  } catch (e) {
    console.error("Error fetching store data for metadata:", e);
  }

  if (!data || data.Status !== 1) {
    // Return default metadata or handle error case
    return {
      title: "Store Unavailable - mCartify",
      description: "This store is currently unavailable.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  // Construct metadata from fetched data
  const title = data.Channels?.title || "mCartify Store";
  const keywords = data.Channels?.keywords || "mCartify Store";
  const description =
    data.Channels?.description || "Your favorite items delivered fast.";
  const logoUrl = data.Store?.logo;
  const faviconUrl = data.Store?.favicon;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || `https://${host}`;

  // console.log("logowala", logoUrl);

  return {
    title: {
      default: title,
      template: `%s | ${title}`,
    },
    description: description,
    keywords: keywords.split(",").map((k: string) => k.trim()),
    authors: [{ name: title }],
    creator: title,
    publisher: title,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: "/",
    },
    icons: {
      icon: faviconUrl ? `${faviconUrl}?v=${Date.now()}` : "/favicon.ico", // Add timestamp to bust cache if needed
      shortcut: faviconUrl ? `${faviconUrl}?v=${Date.now()}` : "/favicon.ico",
      apple: logoUrl ? `${logoUrl}?v=${Date.now()}` : "/apple-icon.png",
    },
    manifest: "/manifest.json",
    openGraph: {
      type: "website",
      locale: "en_US",
      url: baseUrl,
      title: title,
      description: description,
      siteName: title,
      images: [
        {
          url: logoUrl ? `${logoUrl}?v=${Date.now()}` : "/default-og-image.png", // Provide a default OG image
          width: 1200, // Specify dimensions if known
          height: 630,
          alt: `${title} - ${description}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: [
        logoUrl ? `${logoUrl}?v=${Date.now()}` : "/default-og-image.png",
      ],
      creator: `@${title.replace(/\s+/g, "")}`,
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: data.Store?.analytics?.googleSearchConsole?.id || undefined,
      // Add other verification codes if available
    },
    // Add other metadata tags as needed
    // themeColor: '#12715b',
  };
}

// --- RootLayout Component ---
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch data again within RootLayout for component props
  const headersList = await headers(); // Try awaiting headers()
  const host = headersList.get("host");
  const parts = host ? host.split(".") : [];
  const subdomain = parts.length >= 3 ? parts[0] : "prakash5555";
  let data = null;
  try {
    const response = await AxiosFetcher.get(
      `stores/info?channelType=1&subdomain=${subdomain}`,
      {
        headers: {
          "x-store-host": host,
        },
      }
    );
    data = response?.data;
    // console.log("data12dsdasddasdassdasdasd3", data);
  } catch (e) {
    console.error("Error fetching store data for layout:", e);
    // Handle error appropriately, maybe redirect or show error page
    // For now, let the existing error handling below manage it
  }

  // Check for redirect requirement - OUTSIDE try/catch as per Next.js docs
  if (data && data.shouldRedirect === true && data.location) {
    console.log("Redirecting to:", data.location);
    redirect(data.location);
  }

  const analytics = data?.Store?.analytics || {};
  // console.log("analytics", analytics);
  // console.log("data1234213213213123213123", data);
  if (!data || data.Status !== 1) {
    // Return error layout with proper SEO
    return (
      <html lang="en">
        <head>
          <title>Store Unavailable - mCartify</title>
          <meta
            name="description"
            content="This store is currently unavailable."
          />
          <meta
            name="robots"
            content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
          />
        </head>
        <body>
          <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">
                Store Unavailable
              </h1>
              <p className="text-gray-600">
                This store is currently unavailable. Please try again later.
              </p>
            </div>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Metadata is now handled by generateMetadata */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />

        {/* Google Search Console Verification */}
        {analytics?.googleSearchConsole?.id && (
          <meta
            name="google-site-verification"
            content={analytics.googleSearchConsole.id}
          />
        )}

        {/* Enhanced crawler detection */}
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />
      </head>
      <body
        className={`antialiased text-foreground bg-background pt-16`}
        suppressHydrationWarning
      >
        {/* Dynamic Analytics Scripts */}
        {analytics?.metaPixel?.id && (
          <Script id="facebook-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${analytics.metaPixel.id}'); 
              fbq('track', 'PageView');
            `}
          </Script>
        )}

        {analytics?.googleAnaytics?.id && (
          <React.Fragment>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${analytics.googleAnaytics.id}`}
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${analytics.googleAnaytics.id}');
              `}
            </Script>
          </React.Fragment>
        )}

        {analytics?.bingWebmaster?.id && (
          <Script id="bing-webmaster" strategy="afterInteractive">
            {`
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${analytics.bingWebmaster.id}");
            `}
          </Script>
        )}

        <QueryProvider>
          <StoreProvider>
            {/* <StoreInitializer storeData={data} /> */}
            <ThemeProvider>
              <FontGlobalStyle />
              {/* 21st.dev Toolbar for AI-powered editing (dev only) */}
              {/* <TwentyFirstToolbar config={{ plugins: [ReactPlugin] }} /> */}
              {/* <ReactScan/> */}
              {/* <ThemeDebugger /> */}
              <ToastContainer
                position="bottom-right"
                autoClose={1500}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Zoom}
              />
              <ToastProvider />
              <Toaster />
              <PopModal />
              <div style={{ position: "relative" }}>
                <Suspense
                  fallback={
                    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
                      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                        <div className="font-bold text-lg">
                          {data.Store.storeName}
                        </div>
                      </div>
                    </nav>
                  }
                >
                  <DynamicNavbarWrapper storeData={data} />
                </Suspense>
                <div className="flex min-h-[calc(100vh-64px)] flex-col">
                  <div className="flex-grow md:mt-16">{children}</div>
                  <Suspense
                    fallback={
                      <footer className="bg-gray-100 py-8">
                        <div className="container mx-auto px-4 text-center">
                          <p>
                            &copy; 2024 {data.Store.storeName}. All rights
                            reserved.
                          </p>
                        </div>
                      </footer>
                    }
                  >
                    <ClientFooter
                      name={data.Store.storeName}
                      image={data.Store.logo}
                    />
                  </Suspense>
                </div>
                {/* Removed invalid script URL - replace with actual analytics scripts */}
                {/* <Script src="https://exampldsadsde.com/script.js" /> */}
              </div>
            </ThemeProvider>
          </StoreProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
