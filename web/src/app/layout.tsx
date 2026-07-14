import type { Metadata, Viewport } from "next";
import { Roboto_Condensed, Roboto_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { site } from "@/lib/site";
import { getContent } from "@/lib/cms";
import { defaultLayoutMetadata } from "@/lib/cms/home-defaults";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { JsonLd } from "@/components/seo/JsonLd";

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

export async function generateMetadata(): Promise<Metadata> {
  const meta = await getContent("layout.metadata", defaultLayoutMetadata);

  return {
    metadataBase: new URL(site.url),
    title: {
      default: meta.titleDefault,
      template: meta.titleTemplate,
    },
    description: meta.description,
    applicationName: site.name,
    keywords: meta.keywords,
    openGraph: {
      type: "website",
      siteName: site.name,
      title: `${site.name} — ${site.tagline}`,
      description: meta.description,
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
      description: meta.description,
      images: ["/media/hero-pointcloud.jpg"],
    },
    alternates: { canonical: "/" },
    robots: { index: true, follow: true },
  };
}

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
        <script src="/theme-init.js" />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: site.name,
            url: site.url,
            logo: `${site.url}/brand/morpheustek-logo.png`,
            description: site.oneLiner,
            email: site.email,
            telephone: site.phoneHref,
            sameAs: ["https://www.linkedin.com/company/morpheustek"],
          }}
        />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: site.name,
            url: site.url,
          }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:font-semibold focus:text-accent-text"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="min-h-[60vh]">
          {children}
        </main>
        <SiteFooter />
        <Script
          id="vtag-ai-js"
          src="https://r2.leadsy.ai/tag.js"
          strategy="afterInteractive"
          data-pid="FXPn93H0lUabmQS3"
          data-version="062024"
        />
        {/* HubSpot tracking — sets the hubspotutk cookie that /api/lead forwards for attribution. */}
        <Script
          id="hs-script-loader"
          src="https://js.hs-scripts.com/22485651.js"
          strategy="afterInteractive"
        />
        {/* Google tag (GA4) — same GT container the previous WordPress site used, so
            analytics history continues across the relaunch. */}
        <Script
          id="gtag-js"
          src="https://www.googletagmanager.com/gtag/js?id=GT-NFJ9PT8"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag("set", "linker", {"domains": ["morpheustek.com"]});
            gtag("js", new Date());
            gtag("config", "GT-NFJ9PT8");`}
        </Script>
      </body>
    </html>
  );
}
