type JsonLdProps = {
  locale: string;
  url: string;
  name: string;
  description: string;
};

export function JsonLd({ locale, url, name, description }: JsonLdProps) {
  const value = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebPage",
    inLanguage: locale,
    url,
    name,
    description,
  }).replace(/</g, "\\u003c");

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: value }} />;
}
