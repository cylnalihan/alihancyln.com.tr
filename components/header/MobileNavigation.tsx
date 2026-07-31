"use client";

import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";

import type { Locale } from "@/i18n/config";
import type { common as trCommon } from "@/i18n/dictionaries/tr/common";
import { getPath, resolvePathname } from "@/i18n/routes";
import type { DeepWiden } from "@/i18n/types";

import { DigitalWorldMobileInfo } from "./DigitalWorldTile";
import { LanguageSwitcher } from "./LanguageSwitcher";

type NavigationItem = {
  pageId: "home" | "services";
  label: string;
};

type MobileNavigationProps = {
  locale: Locale;
  items: readonly NavigationItem[];
  dictionary: DeepWiden<typeof trCommon>;
};

export function MobileNavigation({
  locale,
  items,
  dictionary,
}: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();
  const pathname = usePathname();

  const currentPage = resolvePathname(pathname)?.pageId;

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <div className="mobile-navigation">
      <button
        className="menu-toggle"
        type="button"
        aria-expanded={isOpen}
        aria-controls={menuId}
        aria-label={
          isOpen
            ? dictionary.navigation.closeMenu
            : dictionary.navigation.openMenu
        }
        onClick={() => setIsOpen((current) => !current)}
      >
        <span className="menu-icon" aria-hidden="true">
          <span />
          <span />
        </span>
      </button>

      <nav
        id={menuId}
        className="mobile-menu"
        aria-label={dictionary.navigation.mobileAriaLabel}
        data-open={isOpen}
        aria-hidden={!isOpen}
      >
        <ul className="mobile-nav-list">
          {items.map((item) => (
            <li key={item.pageId}>
              <a
                className="mobile-nav-link"
                href={getPath(locale, item.pageId)}
                aria-current={currentPage === item.pageId ? "page" : undefined}
                tabIndex={isOpen ? 0 : -1}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            </li>
          ))}
          <li>
            <DigitalWorldMobileInfo dictionary={dictionary.digitalWorld} />
          </li>
          <li>
            <LanguageSwitcher
              className="mobile-language-switcher"
              locale={locale}
              ariaLabel={dictionary.languageSwitcher.ariaLabel}
              tabIndex={isOpen ? 0 : -1}
              onNavigate={() => setIsOpen(false)}
            />
          </li>
          <li>
            <a
              className="contact-link mobile-contact-link"
              href={getPath(locale, "contact")}
              aria-current={currentPage === "contact" ? "page" : undefined}
              tabIndex={isOpen ? 0 : -1}
              onClick={() => setIsOpen(false)}
            >
              {dictionary.navigation.contact}
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}
