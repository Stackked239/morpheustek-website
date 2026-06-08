import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // AI crawlers are allowed by default for GEO (Google-Extended, GPTBot,
      // ClaudeBot, PerplexityBot). Confirm with the client before launch.
      { userAgent: "*", allow: "/" },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
