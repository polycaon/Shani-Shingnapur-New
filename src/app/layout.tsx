import type { Metadata, Viewport } from "next";
import { Marcellus } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/data/site";
import { websiteSchema } from "@/lib/seo";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileActionBar } from "@/components/MobileActionBar";
import { JsonLd } from "@/components/JsonLd";
import { Analytics } from "@/components/Analytics";

const display = Marcellus({ weight: "400", subsets: ["latin"], display: "swap", variable: "--font-marcellus" });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: siteConfig.name, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  formatDetection: { telephone: false },
  verification: siteConfig.analytics.gscVerification ? { google: siteConfig.analytics.gscVerification } : undefined,
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#1b2338",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={display.variable}>
      <body className="min-h-screen antialiased">
        <a
          href="#main"
          className="sr-only z-[100] rounded-lg bg-night-800 px-4 py-2 text-white focus:not-sr-only focus:fixed focus:left-3 focus:top-3"
        >
          Skip to main content
        </a>
        <JsonLd data={websiteSchema()} />
        <Header />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer />
        <MobileActionBar />
        <Analytics />
      </body>
    </html>
  );
}
