import type { MetadataRoute } from "next";

import { siteConfig } from "@/i18n/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: "AC",
    description: "Alihan Ceylan",
    start_url: "/tr",
    display: "standalone",
    background_color: siteConfig.backgroundColor,
    theme_color: siteConfig.themeColor,
  };
}
