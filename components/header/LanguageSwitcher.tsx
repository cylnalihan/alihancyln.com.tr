"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";

import { localeMeta, locales, type Locale } from "@/i18n/config";
import { getLocalizedPath } from "@/i18n/routes";

type LanguageSwitcherProps = {
  locale: Locale;
  ariaLabel: string;
  className?: string;
  tabIndex?: number;
  onNavigate?: () => void;
};

export function LanguageSwitcher({
  locale,
  ariaLabel,
  className = "",
  tabIndex,
  onNavigate,
}: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([]);

  const closeAndRestoreFocus = useCallback(() => {
    setIsOpen(false);
    buttonRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    function handleOutsideClick(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        closeAndRestoreFocus();
      }
    }

    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [closeAndRestoreFocus, isOpen]);

  function focusItem(index: number) {
    itemRefs.current[index]?.focus();
  }

  function handleKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape" && isOpen) {
      event.preventDefault();
      event.stopPropagation();
      closeAndRestoreFocus();
      return;
    }

    if (!isOpen) return;

    const currentIndex = itemRefs.current.indexOf(
      document.activeElement as HTMLAnchorElement,
    );

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const direction = event.key === "ArrowDown" ? 1 : -1;
      const nextIndex =
        currentIndex < 0
          ? direction > 0
            ? 0
            : locales.length - 1
          : (currentIndex + direction + locales.length) % locales.length;
      focusItem(nextIndex);
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      focusItem(event.key === "Home" ? 0 : locales.length - 1);
    }
  }

  return (
    <div
      ref={rootRef}
      className={`language-switcher ${className}`.trim()}
      onKeyDown={handleKeyDown}
    >
      <button
        ref={buttonRef}
        className="language-switcher-toggle"
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={menuId}
        aria-label={ariaLabel}
        tabIndex={tabIndex}
        onClick={() => setIsOpen((current) => !current)}
        onKeyDown={(event) => {
          if (
            !isOpen &&
            (event.key === "ArrowDown" || event.key === "ArrowUp")
          ) {
            event.preventDefault();
            setIsOpen(true);
            requestAnimationFrame(() =>
              focusItem(event.key === "ArrowDown" ? 0 : locales.length - 1),
            );
          }
        }}
      >
        <span>{locale.toUpperCase()}</span>
        <svg
          className="language-switcher-chevron"
          viewBox="0 0 12 8"
          aria-hidden="true"
        >
          <path d="m1.5 1.5 4.5 4 4.5-4" />
        </svg>
      </button>

      <div
        id={menuId}
        className="language-switcher-menu"
        role="menu"
        aria-label={ariaLabel}
        data-open={isOpen}
        aria-hidden={!isOpen}
      >
        {locales.map((targetLocale, index) => {
          const isActive = targetLocale === locale;

          return (
            <Link
              ref={(node) => {
                itemRefs.current[index] = node;
              }}
              role="menuitem"
              className="language-switcher-option"
              href={getLocalizedPath(pathname, targetLocale)}
              hrefLang={targetLocale}
              aria-current={isActive ? "page" : undefined}
              tabIndex={isOpen ? 0 : -1}
              onClick={() => {
                setIsOpen(false);
                onNavigate?.();
              }}
              key={targetLocale}
            >
              <span
                className="language-switcher-check"
                aria-hidden="true"
                data-visible={isActive}
              >
                ✓
              </span>
              <span>{localeMeta[targetLocale].label}</span>
              <span className="language-switcher-code" aria-hidden="true">
                {targetLocale.toUpperCase()}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
