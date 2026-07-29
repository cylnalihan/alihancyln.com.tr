import { notFound } from "next/navigation";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { MatrixBackground } from "@/components/background/MatrixBackground";
import { Footer } from "@/components/footer/Footer";
import { Header } from "@/components/header/Header";
import { isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { siteConfig } from "@/i18n/site";

import "../globals.css";

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const dynamicParams = true;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: siteConfig.themeColor,
};

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale: value } = await params;
  if (!isLocale(value)) notFound();

  const dictionary = await getDictionary(value);

  return (
    <html lang={value}>
      <body>
        <MatrixBackground />
        <Header locale={value} dictionary={dictionary.common} />
        {children}
        <Footer locale={value} dictionary={dictionary.common} />
      </body>
    </html>
  );
}
