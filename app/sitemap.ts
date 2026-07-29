import type { MetadataRoute } from "next";

import { localeMeta, locales } from "@/i18n/config";
import { getPath, pageIds } from "@/i18n/routes";
import { siteConfig } from "@/i18n/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return pageIds.flatMap((pageId) => {
    const languages = Object.fromEntries([
      ...locales.map((locale) => [
        localeMeta[locale].hreflang,
        new URL(getPath(locale, pageId), siteConfig.url).toString(),
      ]),
      ["x-default", new URL(getPath("tr", pageId), siteConfig.url).toString()],
    ]);

    return locales.map((locale) => ({
      url: new URL(getPath(locale, pageId), siteConfig.url).toString(),
      lastModified: new Date(),
      changeFrequency: pageId === "home" ? "monthly" : "weekly",
      priority: pageId === "home" ? 1 : 0.8,
      alternates: { languages },
    }));
  });
}
