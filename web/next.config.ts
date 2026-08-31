import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["mammoth"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  // Legacy WordPress URLs (pre-relaunch morpheustek.com) → new routes.
  // Specific rules first; catch-alls last. Next.js matches in order.
  async redirects() {
    return [
      // Pages
      { source: "/about-us", destination: "/about", permanent: true },
      { source: "/mtek-blog", destination: "/blog", permanent: true },
      { source: "/mtek-blog/:path*", destination: "/blog", permanent: true },
      { source: "/downloads", destination: "/resources", permanent: true },
      { source: "/privacy-policy", destination: "/privacy", permanent: true },
      { source: "/terms-and-conditions", destination: "/terms", permanent: true },
      { source: "/wpautoterms/:path*", destination: "/terms", permanent: true },
      { source: "/refund_returns", destination: "/terms", permanent: true },
      { source: "/my-account", destination: "/contact", permanent: true },

      // Old WooCommerce category pages → keyword pillar pages
      { source: "/products/2d-lidar", destination: "/lidar-for-robotics", permanent: true },
      { source: "/products/3d-lidar", destination: "/3d-lidar-for-robotics", permanent: true },
      { source: "/products/3d-camera", destination: "/3d-cameras-for-robotics", permanent: true },
      { source: "/products/1d-rangefinders", destination: "/rangefinders", permanent: true },
      { source: "/products/3d-mapping", destination: "/3d-mapping", permanent: true },

      // Old WooCommerce product pages → new product pages
      { source: "/product/olei-gs1-5-2d-safety-lidar", destination: "/products/gs1-5-safety-lidar", permanent: true },
      { source: "/product/olei-2d-lr-1bs2-series-mini-lidar", destination: "/products/lr-1bs2-mini-zone-lidar", permanent: true },
      { source: "/product/olei-2d-lr-1bs5-mini-lidar-series", destination: "/products/lr-1bs5-mini-lidar", permanent: true },
      { source: "/product/olei-a090-rangefinder", destination: "/products/a090-laser-rangefinder", permanent: true },
      { source: "/product/olei-lc-m50g", destination: "/products/lc-m50g-mobile-slam-mapper", permanent: true },
      { source: "/product/olei-lr-16f-100-3d", destination: "/products/lr-16f-100-3d-lidar", permanent: true },
      { source: "/product/olei-lr-16fis-3d-lidar", destination: "/products/lr-16fis-explosion-proof-3d-lidar", permanent: true },
      { source: "/product/olei-lr-1f-lidar", destination: "/products/lr-1f-2d-lidar", permanent: true },
      { source: "/product/olei-lr-dds-2-3d-mapper", destination: "/products/lr-dds-2-tripod-3d-mapper", permanent: true },
      { source: "/product/olei-lr-v240-3d-solid-state-obstacle-avoidance-lidar", destination: "/products/lr-f240-solid-state-lidar", permanent: true },
      { source: "/product/olei-thermal-camera", destination: "/products/thermal-camera", permanent: true },
      { source: "/product/olei-vbd1-10", destination: "/products/vbd1-10-2d-lidar", permanent: true },
      { source: "/product/olei-vss-50", destination: "/products/vss-50-solid-state-3d-lidar", permanent: true },
      { source: "/product/sintrones-ibox-602p", destination: "/products/sintrones-ibox-602p-edge-ai", permanent: true },
      { source: "/product/sintrones-sbox-2624p", destination: "/products/sintrones-sbox-2624p-embedded", permanent: true },
      // Percipio line discontinued — closest current equivalents
      { source: "/product/percipio-gm461-e1", destination: "/3d-cameras-for-robotics", permanent: true },
      { source: "/product/percipio-gm465-e1", destination: "/3d-cameras-for-robotics", permanent: true },
      // Any other old product URL → products hub
      { source: "/product/:slug*", destination: "/products", permanent: true },
    ];
  },
};

export default nextConfig;
