import Link from "next/link";

import type { Locale } from "@/i18n/config";
import type { common as trCommon } from "@/i18n/dictionaries/tr/common";
import { getPath } from "@/i18n/routes";
import type { DeepWiden } from "@/i18n/types";

export function Footer({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: DeepWiden<typeof trCommon>;
}) {
  const footerLinks = [
    { label: dictionary.navigation.home, pageId: "home" as const },
    { label: dictionary.navigation.services, pageId: "services" as const },
    { label: dictionary.navigation.contact, pageId: "contact" as const },
  ];

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="footer-monogram" aria-hidden="true">
            AC
          </span>
          <div>
            <strong>Alihan Ceylan</strong>
            <span>
              © {new Date().getFullYear()} · {dictionary.footer.copyright}
            </span>
          </div>
        </div>

        <nav aria-label={dictionary.footer.ariaLabel}>
          <ul className="footer-links">
            {footerLinks.map((item) => (
              <li key={item.pageId}>
                <Link href={getPath(locale, item.pageId)}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
