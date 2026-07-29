import { isLocale, type Locale } from "./config";
import { errors as tr } from "./dictionaries/tr/errors";
import { errors as en } from "./dictionaries/en/errors";
import { errors as ru } from "./dictionaries/ru/errors";

const errorDictionaries = { tr, en, ru };

export function getClientErrorDictionary(pathname: string) {
  const value = pathname.split("/").filter(Boolean)[0] ?? "";
  const locale: Locale = isLocale(value) ? value : "tr";
  return { locale, dictionary: errorDictionaries[locale] };
}
