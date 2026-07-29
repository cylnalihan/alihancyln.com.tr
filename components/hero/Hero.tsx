import Link from "next/link";

import type { Locale } from "@/i18n/config";
import type { home as trHome } from "@/i18n/dictionaries/tr/home";
import {
  getPath,
  PROJECT_INQUIRY_ANCHOR,
} from "@/i18n/routes";
import type { DeepWiden } from "@/i18n/types";

import { LiveShowcase } from "./LiveShowcase";

export function Hero({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: DeepWiden<typeof trHome>;
}) {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-glow" aria-hidden="true" />

      <div className="hero-inner">
        <div className="hero-copy">
          <h1 id="hero-title" className="hero-title">
            {dictionary.hero.titleBefore}{" "}
            <span className="hero-title-accent">
              {dictionary.hero.titleAccent}
            </span>{" "}
            {dictionary.hero.titleAfter}
          </h1>

          <p className="hero-description">
            {dictionary.hero.description}
          </p>

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
