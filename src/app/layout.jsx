import { Josefin_Sans } from "next/font/google";
import "./globals.css";
import ClientLayout from "./components/ClientLayout";
import CustomSessionProvider from "./components/Providers/SessionProvider";
import { Suspense } from "react";

const JosefinSans = Josefin_Sans({
  variable: "--font-josefin-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "Pakistan Property Portal | Buy, Sell & Rent Properties",
    template: "%s | Pakistan Property Portal"
  },
  description: "Pakistan's leading property platform to buy, sell, or rent residential and commercial properties. Connect with verified dealers, explore city-wise listings, and find your dream property across Pakistan.",
  keywords: [
    "Pakistan property",
    "real estate Pakistan",
    "buy property in Pakistan",
    "sell property Pakistan",
    "rent property Pakistan",
    "commercial property Pakistan",
    "residential property Pakistan",
    "property dealers Pakistan",
    "real estate portal",
    "property listings Pakistan",
    "Lahore property",
    "Karachi property",
    "Islamabad property",
    "verified property dealers",
    "house for sale Pakistan",
    "apartment for rent Pakistan"
  ],
  authors: [{ name: "Pakistan Property Portal" }],
  openGraph: {
    title: "Pakistan Property Portal | Buy, Sell & Rent Properties",
    description: "Pakistan's leading property platform to buy, sell, or rent residential and commercial properties.",
    url: "https://yourwebsite.com",
    siteName: "Pakistan Property Portal",
    images: [
      {
        url: "https://yourwebsite.com/og-image.jpg",
        width: 800,
        height: 600,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pakistan Property Portal | Buy, Sell & Rent Properties",
    description: "Pakistan's leading property platform to buy, sell, or rent residential and commercial properties.",
    images: ["https://yourwebsite.com/twitter-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" sizes="any" />
        <link rel="icon" href="/icon?<generated>" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-icon?<generated>" type="image/png" sizes="180x180" />
      </head>
      <body
        className={`${JosefinSans.variable} antialiased`}
        cz-shortcut-listen="true"
      >
        <CustomSessionProvider>
          <ClientLayout>
            <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
          </ClientLayout>
        </CustomSessionProvider>
      </body>
    </html>
  );
}