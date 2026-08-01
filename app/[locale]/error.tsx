"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { getClientErrorDictionary } from "@/i18n/client-errors";
import { getPath } from "@/i18n/routes";

export default function LocalizedError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { locale, dictionary } = getClientErrorDictionary(usePathname());
  const content = dictionary.runtime;

  useEffect(() => {
    console.error("Localized route error", {
      message: error.message,
      stack: error.stack,
      digest: error.digest,
    });
  }, [error]);

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
