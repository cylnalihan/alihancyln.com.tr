"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { common as trCommon } from "@/i18n/dictionaries/tr/common";
import type { DeepWiden } from "@/i18n/types";
import { getPath, resolvePathname } from "@/i18n/routes";
import type { Locale } from "@/i18n/config";

import { DigitalWorldTile } from "./DigitalWorldTile";
import digitalWorldStyles from "./DigitalWorldTile.module.css";
import { InteractiveMatrixTile } from "./InteractiveMatrixTile";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileNavigation } from "./MobileNavigation";

type CommonDictionary = DeepWiden<typeof trCommon>;

export function Header({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: CommonDictionary;
}) {
  const pathname = usePathname();
  const currentPage = resolvePathname(pathname)?.pageId;
  const navigationItems = [
    { pageId: "home" as const, label: dictionary.navigation.home },
    { pageId: "services" as const, label: dictionary.navigation.services },
  ];

  const isActive = (pageId: "home" | "services" | "contact") =>
    currentPage === pageId;

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link
          className="brand"
          href={getPath(locale, "home")}
          aria-label={dictionary.navigation.brandHome}
        >
          <span className="brand-monogram" aria-hidden="true">
            <span className="brand-letters">AC</span>
          </span>
        </Link>

        <div className="header-controls">
          <div className={digitalWorldStyles.toolGroup}>
            <InteractiveMatrixTile label={dictionary.matrix.buttonLabel} />
            <DigitalWorldTile dictionary={dictionary.digitalWorld} />
          </div>

          <nav className="desktop-nav" aria-label={dictionary.navigation.ariaLabel}>
            <ul className="nav-list">
              {navigationItems.map((item) => (
                <li key={item.pageId}>
                  <Link
                    className="nav-link"
                    href={getPath(locale, item.pageId)}
                    aria-current={isActive(item.pageId) ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  className="contact-link"
                  href={getPath(locale, "contact")}
                  aria-current={isActive("contact") ? "page" : undefined}
                >
                  {dictionary.navigation.contact}
                </Link>
              </li>
            </ul>
          </nav>

          <LanguageSwitcher
            className="desktop-language-switcher"
            locale={locale}
            ariaLabel={dictionary.languageSwitcher.ariaLabel}
          />

          <MobileNavigation
            locale={locale}
            items={navigationItems}
            dictionary={dictionary}
          />
        </div>
      </div>
    </header>
  );
}
