import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Hero } from "@/components/hero/Hero";
import { ProjectFaq } from "@/components/project-faq/ProjectFaq";
import { JsonLd } from "@/components/seo/JsonLd";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { createPageMetadata } from "@/i18n/metadata";
import { getPath } from "@/i18n/routes";
import { siteConfig } from "@/i18n/site";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale: value } = await params;
  if (!isLocale(value)) notFound();
  const { home } = await getDictionary(value);
  return createPageMetadata({ locale: value, pageId: "home", ...home.metadata });
}

export default async function HomePage({ params }: PageProps) {
  const { locale: value } = await params;
  if (!isLocale(value)) notFound();
  const { home } = await getDictionary(value);
  const url = new URL(getPath(value, "home"), siteConfig.url).toString();

  return (
    <main id="home">
      <JsonLd
        locale={value}
        url={url}
        name={home.metadata.title}
        description={home.metadata.description}
      />
      <Hero locale={value} dictionary={home} />
      <section className="about-section" aria-labelledby="about-title">
        <div className="about-section-inner">
          <p className="about-section-label">{home.about.eyebrow}</p>
          <h2 id="about-title" className="about-section-statement">
            {home.about.opening} <span>{home.about.name}</span>;{" "}
            {home.about.bridge} <em>{home.about.emphasis}</em>{" "}
            {home.about.closing}
          </h2>
        </div>
      </section>
      <ProjectFaq dictionary={home.faq} />
    </main>
  );
}
