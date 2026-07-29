import { defaultLocale, isLocale, type Locale } from "./config";

export const pageIds = ["home", "services", "contact"] as const;
export type PageId = (typeof pageIds)[number];

export const routeSlugs: Record<PageId, Record<Locale, string>> = {
  home: { tr: "", en: "", ru: "" },
  services: { tr: "hizmetler", en: "services", ru: "uslugi" },
  contact: { tr: "iletisim", en: "contact", ru: "kontakty" },
};

export const PROJECT_INQUIRY_ANCHOR = "project-inquiry";
export const LEGACY_TR_PROJECT_INQUIRY_ANCHOR = "fikrinizi-anlatin";

export function getPath(locale: Locale, pageId: PageId) {
  const slug = routeSlugs[pageId][locale];
  return slug ? `/${locale}/${slug}` : `/${locale}`;
}

export function resolvePathname(pathname: string): {
  locale: Locale;
  pageId: PageId;
} | null {
  const [localeValue, slug = "", ...rest] = pathname
    .split("/")
    .filter(Boolean);

  if (!localeValue || rest.length > 0 || !isLocale(localeValue)) return null;

  const pageId = pageIds.find(
    (candidate) => routeSlugs[candidate][localeValue] === slug,
  );

  return pageId ? { locale: localeValue, pageId } : null;
}

export function getLocalizedPath(
  pathname: string,
  targetLocale: Locale,
): string {
  const resolved = resolvePathname(pathname);
  return getPath(targetLocale, resolved?.pageId ?? "home");
}

export function getPageId(locale: Locale, slug: string): PageId | null {
  return (
    pageIds.find((pageId) => routeSlugs[pageId][locale] === slug) ?? null
  );
}

export function getLanguageAlternates(pageId: PageId) {
  return {
    "tr-TR": getPath("tr", pageId),
    en: getPath("en", pageId),
    "ru-RU": getPath("ru", pageId),
    "x-default": getPath(defaultLocale, pageId),
  };
}
