import type { Metadata, Viewport } from "next";
import { Roboto_Condensed, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SensorOverlay } from "@/components/effects/SensorOverlay";

// Official brand fonts: Roboto Condensed (headlines + body), Roboto Mono for specs.
const robotoCondensed = Roboto_Condensed({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-condensed",
  display: "swap",
});
const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono-rc",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline} | LiDAR, 3D Cameras & Edge Compute for Robotics`,
    template: `%s · ${site.name}`,
  },
  description: site.oneLiner,
  applicationName: site.name,
  keywords: [
    "LiDAR for robotics",
    "2D LiDAR for robot navigation",
    "3D LiDAR for obstacle avoidance",
    "safety LiDAR for AMR",
    "SIL2 safety LiDAR",
    "custom LiDAR for robotics",
    "LiDAR alternative to SICK",
    "Hokuyo LiDAR alternative",
    "LiDAR supplier North America",
    "3D cameras for robotics",
    "robot perception sensor supplier",
  ],
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.oneLiner,
    url: site.url,
    locale: "en_US",
    images: [
      {
        url: "/media/hero-pointcloud.jpg",
        width: 1376,
        height: 768,
        alt: "A 3D LiDAR point-cloud view of a warehouse aisle in depth-mapped color",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.oneLiner,
    images: ["/media/hero-pointcloud.jpg"],
  },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#06163a" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${robotoCondensed.variable} ${robotoMono.variable}`}
    >
      <body className="font-body antialiased">
        {/* Parser-blocking no-flash theme init (runs before paint). */}
        <script src="/theme-init.js" />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:font-semibold focus:text-accent-text"
        >
          Skip to content
        </a>
        <TopBar />
        <Header />
        <main id="main" className="min-h-[60vh]">
          {children}
        </main>
        <Footer />
        <SensorOverlay />
      </body>
    </html>
  );
}
