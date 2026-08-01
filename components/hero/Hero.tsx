import Link from "next/link";
import { Manrope } from "next/font/google";

import type { Locale } from "@/i18n/config";
import type { home as trHome } from "@/i18n/dictionaries/tr/home";
import {
  getPath,
  PROJECT_INQUIRY_ANCHOR,
} from "@/i18n/routes";
import type { DeepWiden } from "@/i18n/types";

import { HeroMessages } from "./HeroMessages";
import { LiveShowcase } from "./LiveShowcase";

const heroFont = Manrope({
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
  variable: "--font-hero",
});

export function Hero({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: DeepWiden<typeof trHome>;
}) {
  return (
    <section className={`hero ${heroFont.variable}`} aria-labelledby="hero-title">
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-glow" aria-hidden="true" />

      <div className="hero-inner">
        <div className="hero-copy">
          <HeroMessages
            label={dictionary.hero.label}
            support={dictionary.hero.support}
            messages={dictionary.hero.messages}
            previousLabel={dictionary.hero.previousLabel}
            nextLabel={dictionary.hero.nextLabel}
            messageLabel={dictionary.hero.messageLabel}
          />

          <div className="hero-actions">
            <Link
              className="hero-cta hero-cta-primary"
              href={`${getPath(locale, "services")}#${PROJECT_INQUIRY_ANCHOR}`}
            >
              {dictionary.hero.primaryCta}
              <span aria-hidden="true">↗</span>
            </Link>
            <Link
              className="hero-cta hero-cta-secondary"
              href={getPath(locale, "services")}
            >
              {dictionary.hero.secondaryCta}
            </Link>
          </div>

        </div>

        <LiveShowcase dictionary={dictionary.showcase} />
      </div>
    </section>
  );
}
