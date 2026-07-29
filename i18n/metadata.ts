import type { Metadata } from "next";

import { localeMeta, locales, type Locale } from "./config";
import {
  getLanguageAlternates,
  getPath,
  type PageId,
} from "./routes";
import { siteConfig } from "./site";

export function createPageMetadata({
  locale,
  pageId,
  title,
  description,
}: {
  locale: Locale;
  pageId: PageId;
  title: string;
  description: string;
}): Metadata {
  const path = getPath(locale, pageId);
  const url = new URL(path, siteConfig.url).toString();
  const languageAlternates = Object.fromEntries(
    Object.entries(getLanguageAlternates(pageId)).map(([key, value]) => [
      key,
      new URL(value, siteConfig.url).toString(),
    ]),
  );

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: languageAlternates,
    },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      title,
      description,
      url,
      locale: localeMeta[locale].openGraph,
      alternateLocale: locales
        .filter((candidate) => candidate !== locale)
        .map((candidate) => localeMeta[candidate].openGraph),
    },
  };
}
