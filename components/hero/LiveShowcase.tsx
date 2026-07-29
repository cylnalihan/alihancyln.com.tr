"use client";

import type { FocusEvent, ReactNode } from "react";
import { useEffect, useState } from "react";

type ShowcaseDictionary = {
  technicalLabel: string;
  previewLabel: string;
  exampleLabel: string;
  controlsLabel: string;
  showConceptSuffix: string;
  designs: readonly { id: string; label: string }[];
  previews: Record<string, readonly string[]>;
};

function Corporate({ t }: { t: readonly string[] }) {
  return <div className="preview-site concept-corporate"><div className="concept-nav"><b>{t[0]}</b><span>{t[1]}</span><span>{t[2]}</span><i /></div><div className="corporate-layout"><div className="concept-copy"><small>{t[3]}</small><strong>{t[4]}</strong><button>{t[5]}</button></div><div className="service-stack"><span>{t[6]}</span><span>{t[7]}</span><span>{t[8]}</span></div></div><div className="metric-row"><span><b>01</b> {t[9]}</span><span><b>02</b> {t[10]}</span><span><b>03</b> {t[11]}</span></div></div>;
}

function Commerce({ t }: { t: readonly string[] }) {
  return <div className="preview-site concept-commerce"><div className="concept-nav"><b>{t[0]}</b><span>{t[1]}</span><span>{t[2]}</span><i className="cart-pill">{t[3]}</i></div><div className="category-pills"><span>{t[4]}</span><span>{t[5]}</span><span>{t[6]}</span><span>{t[7]}</span></div><div className="shop-grid">{t.slice(8, 11).map((item, index) => <article key={item}><div data-product={index}><i /></div><b>{item}</b><small>₺{["1.290", "540", "2.150"][index]}</small></article>)}</div></div>;
}

function Landing({ t }: { t: readonly string[] }) {
  return <div className="preview-site concept-landing"><div className="landing-badge">{t[0]}</div><div className="landing-offer"><small>{t[1]}</small><strong>{t[2]}</strong><button>{t[3]}</button></div><div className="benefit-grid"><span><i>01</i>{t[4]}</span><span><i>02</i>{t[5]}</span><span><i>03</i>{t[6]}</span></div></div>;
}

function Personal({ t }: { t: readonly string[] }) {
  return <div className="preview-site concept-personal"><div className="personal-top"><b>{t[0]}</b><span>{t[1]}</span><span>{t[2]}</span></div><div className="personal-profile"><div className="avatar-art"><i /></div><div><small>{t[3]}</small><strong>{t[4]}</strong><div className="skill-list"><span>{t[5]}</span><span>{t[6]}</span><span>{t[7]}</span></div></div></div><div className="content-lines"><span /><span /><span /></div></div>;
}

function Restaurant({ t }: { t: readonly string[] }) {
  return <div className="preview-site concept-restaurant"><div className="restaurant-top"><b>{t[0]}</b><span>{t[1]}</span><button>{t[2]}</button></div><div className="restaurant-main"><small>{t[3]}</small><strong>{t[4]}</strong><div className="reservation-card"><span>{t[5]}</span><b>{t[6]}</b><span>{t[7]}</span><b>{t[8]}</b></div></div><div className="dish-row"><span><i />{t[9]}</span><span><i />{t[10]}</span><span><i />{t[11]}</span></div></div>;
}

function Blog({ t }: { t: readonly string[] }) {
  return <div className="preview-site concept-blog"><div className="blog-top"><b>{t[0]}</b><span>{t[1]}</span><span>{t[2]}</span><span>{t[3]}</span></div><div className="featured-post"><div className="post-art" /><div><small>{t[4]}</small><strong>{t[5]}</strong><span>{t[6]}</span></div></div><div className="post-row"><article><b>{t[7]}</b><small>{t[1]}</small></article><article><b>{t[8]}</b><small>{t[2]}</small></article></div></div>;
}

function Event({ t }: { t: readonly string[] }) {
  return <div className="preview-site concept-event"><div className="event-date"><b>18</b><span>{t[0]}<br />2026</span></div><div className="event-hero"><small>{t[1]}</small><strong>{t[2]}</strong><button>{t[3]}</button></div><div className="event-bottom"><div><small>{t[4]}</small><b>{t[5]}</b></div><div className="speaker-stack"><i /><i /><i /><span>{t[6]}</span></div></div></div>;
}

function Custom({ t }: { t: readonly string[] }) {
  return <div className="preview-site concept-custom"><aside className="custom-sidebar"><b>◇</b><i /><i /><i /><i /></aside><div className="custom-main"><div className="custom-head"><div><small>{t[0]}</small><strong>{t[1]}</strong></div><span /></div><div className="custom-cards"><article><small>{t[2]}</small><b>{t[3]}</b><i /></article><article><small>{t[4]}</small><b>{t[5]}</b><i /></article><article><small>{t[6]}</small><b>{t[7]}</b><i /></article></div><div className="custom-panel"><div className="panel-lines"><span /><span /><span /><span /></div><div className="panel-ring" /></div></div></div>;
}

const renderers: Record<string, (text: readonly string[]) => ReactNode> = {
  corporate: (text) => <Corporate t={text} />,
  commerce: (text) => <Commerce t={text} />,
  landing: (text) => <Landing t={text} />,
  personal: (text) => <Personal t={text} />,
  restaurant: (text) => <Restaurant t={text} />,
  blog: (text) => <Blog t={text} />,
  event: (text) => <Event t={text} />,
  custom: (text) => <Custom t={text} />,
};

export function LiveShowcase({ dictionary }: { dictionary: ShowcaseDictionary }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setReducedMotion(query.matches);
      if (query.matches) setActiveIndex(0);
    };
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (isPaused || reducedMotion) return;
    const id = window.setInterval(
      () => setActiveIndex((current) => (current + 1) % dictionary.designs.length),
      7000,
    );
    return () => window.clearInterval(id);
  }, [dictionary.designs.length, isPaused, reducedMotion]);

  const active = dictionary.designs[activeIndex];
  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsPaused(false);
  };

  return (
    <div className="showcase-shell" onPointerEnter={() => setIsPaused(true)} onPointerLeave={() => setIsPaused(false)} onFocusCapture={() => setIsPaused(true)} onBlurCapture={handleBlur}>
      <div className="showcase-technical-label" aria-hidden="true">{dictionary.technicalLabel}</div>
      <div className="browser-frame" aria-label={`${dictionary.previewLabel}: ${active.label}`}>
        <div className="browser-toolbar" aria-hidden="true"><div className="browser-dots"><span /><span /><span /></div><div className="browser-address"><span />concept.preview</div><div className="browser-control" /></div>
        <div className="showcase-viewport">
          {dictionary.designs.map((design, index) => <div className="showcase-slide" data-active={index === activeIndex} aria-hidden={index !== activeIndex} key={design.id}>{renderers[design.id]?.(dictionary.previews[design.id])}</div>)}
        </div>
      </div>
      <div className="showcase-meta">
        <div><span>{dictionary.exampleLabel}</span><strong>{active.label}</strong></div>
        <div className="showcase-controls" aria-label={dictionary.controlsLabel}>
          {dictionary.designs.map((design, index) => <button type="button" className="showcase-control" aria-label={`${design.label}: ${dictionary.showConceptSuffix}`} aria-pressed={index === activeIndex} onClick={() => setActiveIndex(index)} key={design.id}><span /></button>)}
        </div>
      </div>
    </div>
  );
}
