import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { EmailLink } from "@/components/contact/EmailLink";
import { WhatsAppLink } from "@/components/contact/WhatsAppLink";
import { ProjectFaq } from "@/components/project-faq/ProjectFaq";
import { JsonLd } from "@/components/seo/JsonLd";
import { SolutionSelector } from "@/components/services/SolutionSelector";
import styles from "@/components/services/ServicesPage.module.css";
import { isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { createPageMetadata } from "@/i18n/metadata";
import {
  getPageId,
  getPath,
  LEGACY_TR_PROJECT_INQUIRY_ANCHOR,
  pageIds,
  PROJECT_INQUIRY_ANCHOR,
  routeSlugs,
} from "@/i18n/routes";
import { siteConfig } from "@/i18n/site";

type PageProps = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    pageIds
      .filter((pageId) => pageId !== "home")
      .map((pageId) => ({ locale, slug: routeSlugs[pageId][locale] })),
  );
}

export const dynamicParams = true;

async function resolvePage(params: PageProps["params"]) {
  const { locale: value, slug } = await params;
  if (!isLocale(value)) notFound();
  const pageId = getPageId(value, slug);
  if (!pageId || pageId === "home") notFound();
  return { locale: value, pageId };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, pageId } = await resolvePage(params);
  const dictionary = await getDictionary(locale);
  const metadata =
    pageId === "services"
      ? dictionary.services.metadata
      : dictionary.contact.metadata;
  return createPageMetadata({ locale, pageId, ...metadata });
}

export default async function LocalizedPage({ params }: PageProps) {
  const { locale, pageId } = await resolvePage(params);
  const dictionary = await getDictionary(locale);
  const metadata =
    pageId === "services"
      ? dictionary.services.metadata
      : dictionary.contact.metadata;
  const url = new URL(getPath(locale, pageId), siteConfig.url).toString();

  if (pageId === "contact") {
    const contact = dictionary.contact;
    return (
      <main className="email-page">
        <JsonLd locale={locale} url={url} name={metadata.title} description={metadata.description} />
        <section className="contact-panel" aria-labelledby="contact-title">
          <div className="contact-panel-grid" aria-hidden="true" />
          <div className="contact-panel-intro">
            <p className="contact-panel-label">{contact.eyebrow}</p>
            <h1 id="contact-title">{contact.title}</h1>
            <p className="contact-panel-description">{contact.description}</p>
          </div>
          <div className="contact-panel-details">
            <div className="contact-meta" aria-label={contact.workInfoLabel}>
              <p><span className="status-dot" aria-hidden="true" />{contact.availability}</p>
              <p>{contact.location}</p>
            </div>
            <div className="contact-actions" aria-label={contact.optionsLabel}>
              <EmailLink dictionary={dictionary.common.contactLinks} />
              <WhatsAppLink dictionary={dictionary.common.contactLinks} />
            </div>
          </div>
        </section>
      </main>
    );
  }

  const services = dictionary.services;
  return (
    <main className={styles.page}>
      <JsonLd locale={locale} url={url} name={metadata.title} description={metadata.description} />
      <section className={styles.intro} aria-labelledby="services-title">
        <div className={styles.introGrid} aria-hidden="true" />
        <div className={styles.introGlow} aria-hidden="true" />
        <div className={styles.container}>
          <div className={styles.introCopy}>
            <p className={styles.eyebrow}><span aria-hidden="true" />{services.intro.eyebrow}</p>
            <h1 id="services-title" className={styles.title}>{services.intro.title} <span>{services.intro.titleAccent}</span>{services.intro.titleClosing}</h1>
            <p className={styles.lead}>{services.intro.lead}</p>
          </div>
        </div>
      </section>
      <section id={PROJECT_INQUIRY_ANCHOR} className={`${styles.section} ${styles.selectorSection}`} aria-labelledby="selector-title">
        {locale === "tr" && <span id={LEGACY_TR_PROJECT_INQUIRY_ANCHOR} className={styles.legacyAnchor} aria-hidden="true" />}
        <div className={styles.container}>
          <div className={styles.sectionHeading}>
            <p className={styles.sectionIndex}>{services.selector.index}</p>
            <h2 id="selector-title">{services.selector.title}</h2>
            <p>{services.selector.description}</p>
          </div>
          <SolutionSelector locale={locale} dictionary={services} />
        </div>
      </section>
      <section className={styles.process} aria-labelledby="process-title">
        <div className={styles.processGlow} aria-hidden="true" />
        <div className={styles.container}>
          <div className={styles.processHeading}>
            <div><p className={styles.sectionIndex}>{services.process.eyebrow}</p><h2 id="process-title">{services.process.title}</h2></div>
            <p>{services.process.description}</p>
          </div>
          <ol className={styles.timeline}>{services.process.steps.map((step, index) => <li key={step.title}><span className={styles.stepNumber} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><span className={styles.timelineNode} aria-hidden="true" /><div><h3>{step.title}</h3><p>{step.description}</p></div></li>)}</ol>
        </div>
      </section>
      <ProjectFaq dictionary={dictionary.home.faq} />
    </main>
  );
}
