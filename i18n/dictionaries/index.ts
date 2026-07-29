import "server-only";

import type { Locale } from "@/i18n/config";

const loaders = {
  tr: async () => ({
    common: (await import("./tr/common")).common,
    home: (await import("./tr/home")).home,
    services: (await import("./tr/services")).services,
    contact: (await import("./tr/contact")).contact,
    errors: (await import("./tr/errors")).errors,
  }),
  en: async () => ({
    common: (await import("./en/common")).common,
    home: (await import("./en/home")).home,
    services: (await import("./en/services")).services,
    contact: (await import("./en/contact")).contact,
    errors: (await import("./en/errors")).errors,
  }),
  ru: async () => ({
    common: (await import("./ru/common")).common,
    home: (await import("./ru/home")).home,
    services: (await import("./ru/services")).services,
    contact: (await import("./ru/contact")).contact,
    errors: (await import("./ru/errors")).errors,
  }),
} satisfies Record<Locale, () => Promise<unknown>>;

export async function getDictionary(locale: Locale) {
  return loaders[locale]();
}

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;
