"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { getClientErrorDictionary } from "@/i18n/client-errors";
import { getPath } from "@/i18n/routes";

export default function LocalizedNotFound() {
  const { locale, dictionary } = getClientErrorDictionary(usePathname());
  const content = dictionary.notFound;

  return (
    <main className="error-page">
      <section className="error-panel" aria-labelledby="not-found-title">
        <p className="error-code">{content.code}</p>
        <h1 id="not-found-title">{content.title}</h1>
        <p>{content.description}</p>
        <div className="error-actions">
          <Link className="hero-cta hero-cta-primary" href={getPath(locale, "home")}>
            {content.home}
          </Link>
          <Link className="hero-cta hero-cta-secondary" href={getPath(locale, "services")}>
            {content.services}
          </Link>
        </div>
      </section>
    </main>
  );
}
