export const locales = ["tr", "en", "ru"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "tr";

export const localeMeta: Record<
  Locale,
  { hreflang: string; openGraph: string; label: string }
> = {
  tr: { hreflang: "tr-TR", openGraph: "tr_TR", label: "Türkçe" },
  en: { hreflang: "en", openGraph: "en_US", label: "English" },
  ru: { hreflang: "ru-RU", openGraph: "ru_RU", label: "Русский" },
};

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}
