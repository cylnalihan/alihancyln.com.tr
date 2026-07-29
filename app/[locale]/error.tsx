"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { getClientErrorDictionary } from "@/i18n/client-errors";
import { getPath } from "@/i18n/routes";

export default function LocalizedError({ reset }: { error: Error; reset: () => void }) {
  const { locale, dictionary } = getClientErrorDictionary(usePathname());
  const content = dictionary.runtime;

  return (
    <main className="error-page">
      <section className="error-panel" aria-labelledby="error-title">
        <p className="error-code">{content.code}</p>
        <h1 id="error-title">{content.title}</h1>
        <p>{content.description}</p>
        <div className="error-actions">
          <button className="hero-cta hero-cta-primary" type="button" onClick={reset}>
            {content.retry}
          </button>
          <Link className="hero-cta hero-cta-secondary" href={getPath(locale, "home")}>
            {content.home}
          </Link>
        </div>
      </section>
    </main>
  );
}
