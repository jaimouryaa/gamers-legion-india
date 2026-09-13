import type { Metadata } from "next";
import { Chakra_Petch, Inter } from "next/font/google";
import Script from "next/script";
import { Toaster } from "sonner";
import { THEME_INIT_SCRIPT } from "@/lib/theme-store";
import "./globals.css";

const chakra = Chakra_Petch({
  variable: "--font-chakra",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Gamers Legion India | Games, Deals & Bundles",
    template: "%s | Gamers Legion India",
  },
  description:
    "Discover games, gaming deals and bundles at Gamers Legion India. Your next game starts here.",
  openGraph: {
    title: "Gamers Legion India | Games, Deals & Bundles",
    description:
      "Discover games, gaming deals and bundles at Gamers Legion India.",
    siteName: "Gamers Legion India",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gamers Legion India | Games, Deals & Bundles",
    description:
      "Discover games, gaming deals and bundles at Gamers Legion India.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${chakra.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-void" suppressHydrationWarning>
        {children}
        <Toaster
          theme="dark"
          position="top-right"
          toastOptions={{
            style: {
              background: "var(--surface-elevated)",
              border: "1px solid var(--border-glass-strong)",
              color: "var(--text-primary)",
            },
          }}
        />
      </body>
    </html>
  );
}
