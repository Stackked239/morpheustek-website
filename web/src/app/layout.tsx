import type { Metadata, Viewport } from "next";
import { Saira, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SensorOverlay } from "@/components/effects/SensorOverlay";

const saira = Saira({ subsets: ["latin"], variable: "--font-saira", display: "swap" });
const plex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex",
  display: "swap",
});
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-plex-mono",
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
        url: "/media/hero-warehouse.jpg",
        width: 1376,
        height: 768,
        alt: "An autonomous mobile robot scanning a warehouse aisle with a glowing LiDAR point cloud",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.oneLiner,
    images: ["/media/hero-warehouse.jpg"],
  },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#061626" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${saira.variable} ${plex.variable} ${plexMono.variable}`}
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
