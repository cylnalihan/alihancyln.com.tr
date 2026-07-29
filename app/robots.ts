import type { MetadataRoute } from "next";

import { siteConfig } from "@/i18n/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/tr", "/en", "/ru"],
      disallow: ["/api/"],
    },
    sitemap: new URL("/sitemap.xml", siteConfig.url).toString(),
    host: siteConfig.url,
  };
}
