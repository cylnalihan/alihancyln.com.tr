"use client";

import { useId, useRef, useState, type ReactNode } from "react";

import type { Locale } from "@/i18n/config";
import type { services as trServices } from "@/i18n/dictionaries/tr/services";
import type { DeepWiden } from "@/i18n/types";

import { ProjectInquiryForm } from "./ProjectInquiryForm";
import styles from "./ServicesPage.module.css";

type ServicesDictionary = DeepWiden<typeof trServices>;

function MockBrowser({ children, variant }: { children: ReactNode; variant: string }) {
  return <div className={`${styles.mockBrowser} ${styles[variant]}`}><div className={styles.mockToolbar}><span /><span /><span /><i /></div><div className={styles.mockViewport}>{children}</div></div>;
}

function Corporate({ t }: { t: readonly string[] }) {
  return <MockBrowser variant="corporateMock"><div className={styles.corporateNav}><b>{t[0]}</b><span>{t[1]}</span><span>{t[2]}</span><i /></div><div className={styles.corporateHero}><div><small>{t[3]}</small><strong>{t[4]}</strong><i /></div><div className={styles.corporateOrb}><span /></div></div><div className={styles.corporateServices}><span><b>01</b>{t[5]}</span><span><b>02</b>{t[6]}</span><span><b>03</b>{t[7]}</span></div><div className={styles.corporateValues}><span><i />{t[8]}</span><span><i />{t[9]}</span></div></MockBrowser>;
}
function Commerce({ t }: { t: readonly string[] }) {
  return <MockBrowser variant="commerceMock"><div className={styles.shopNav}><b>{t[0]}</b><i>{t[1]}</i><span>{t[2]}</span></div><div className={styles.shopHeader}><strong>{t[3]}</strong><div><span>{t[4]}</span><span>{t[5]}</span><span>{t[6]}</span></div></div><div className={styles.productGrid}>{t.slice(7, 10).map((name, index) => <article key={name}><div data-shape={index}><i /></div><b>{name}</b><small>{t[10]}</small><button type="button" tabIndex={-1}>{t[11]}</button></article>)}</div></MockBrowser>;
}
function Landing({ t }: { t: readonly string[] }) {
  return <MockBrowser variant="landingMock"><div className={styles.landingNav}><b>{t[0]}</b><span>{t[1]}</span><i /></div><div className={styles.landingHero}><small>{t[2]}</small><strong>{t[3]}<br />{t[4]}</strong><p>{t[5]}</p><button type="button" tabIndex={-1}>{t[6]}</button></div><div className={styles.landingBottom}><div><b>01</b><span>{t[7]}</span></div><div><b>02</b><span>{t[8]}</span></div><form><span>{t[9]}</span><i>{t[10]}</i></form></div></MockBrowser>;
}
function Personal({ t }: { t: readonly string[] }) {
  return <MockBrowser variant="personalMock"><div className={styles.personalNav}><b>{t[0]}</b><span>{t[1]}</span><span>{t[2]}</span></div><div className={styles.personalHero}><div className={styles.profileArt}><i /><span /></div><div><small>{t[3]}</small><strong>{t[4]}</strong><div className={styles.skillTags}><span>{t[5]}</span><span>{t[6]}</span><span>{t[7]}</span></div><i className={styles.personalContact}>{t[8]}</i></div></div><div className={styles.personalWorks}><span /><span /><span /></div></MockBrowser>;
}
function Restaurant({ t }: { t: readonly string[] }) {
  return <MockBrowser variant="restaurantMock"><div className={styles.restaurantNav}><b>{t[0]}</b><span>{t[1]}</span><i>{t[2]}</i></div><div className={styles.restaurantHero}><small>{t[3]}</small><strong>{t[4]}<br />{t[5]}</strong><div className={styles.plate}><i /></div></div><div className={styles.menuStrip}><span><i />{t[6]}</span><span><i />{t[7]}</span><span><i />{t[8]}</span></div><div className={styles.reservation}><span><small>{t[9]}</small>{t[10]}</span><span><small>{t[11]}</small>{t[12]}</span><b>{t[13]}</b></div></MockBrowser>;
}
function Blog({ t }: { t: readonly string[] }) {
  return <MockBrowser variant="blogMock"><div className={styles.blogNav}><b>{t[0]}</b><span>{t[1]}</span><span>{t[2]}</span><span>{t[3]}</span></div><div className={styles.featuredArticle}><div className={styles.articleArt}><i /></div><div><small>{t[4]}</small><strong>{t[5]}</strong><span>{t[6]}</span></div></div><div className={styles.articleGrid}><article><small>{t[7]}</small><b>{t[8]}</b></article><article><small>{t[9]}</small><b>{t[10]}</b></article></div></MockBrowser>;
}
function EventMock({ t }: { t: readonly string[] }) {
  return <MockBrowser variant="eventMock"><div className={styles.eventNav}><b>{t[0]}</b><span>{t[1]}</span><i>{t[2]}</i></div><div className={styles.eventHero}><div className={styles.eventDate}><b>18</b><span>{t[3]}<br />2026</span></div><div><small>{t[4]}</small><strong>{t[5]}</strong><span>{t[6]}</span></div></div><div className={styles.eventSchedule}><small>{t[7]}</small><span><b>10:00</b>{t[8]}</span><span><b>11:30</b>{t[9]}</span><div className={styles.speakers}><i /><i /><i /></div></div></MockBrowser>;
}
function Application({ t }: { t: readonly string[] }) {
  return <MockBrowser variant="applicationMock"><div className={styles.dashboard}><aside><b>◇</b><i /><i /><i /><i /></aside><div className={styles.dashboardMain}><header><div><small>{t[0]}</small><strong>{t[1]}</strong></div><span /></header><div className={styles.dashboardCards}><article><small>{t[2]}</small><b>{t[3]}</b><i /></article><article><small>{t[4]}</small><b>{t[5]}</b><i /></article><article><small>{t[6]}</small><b>{t[7]}</b><i /></article></div><div className={styles.dashboardGrid}><div className={styles.chart}><span /><span /><span /><span /><span /></div><div className={styles.statusList}><span><i />{t[8]}</span><span><i />{t[9]}</span><span><i />{t[10]}</span></div></div><div className={styles.tableLines}><span /><span /><span /></div></div></div></MockBrowser>;
}

const mockups: Record<string, (text: readonly string[]) => ReactNode> = {
  corporate: (t) => <Corporate t={t} />, commerce: (t) => <Commerce t={t} />,
  landing: (t) => <Landing t={t} />, personal: (t) => <Personal t={t} />,
  restaurant: (t) => <Restaurant t={t} />, blog: (t) => <Blog t={t} />,
  event: (t) => <EventMock t={t} />, application: (t) => <Application t={t} />,
};

export function SolutionSelector({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: ServicesDictionary;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const formTriggerRef = useRef<HTMLButtonElement>(null);
  const instanceId = useId().replace(/:/g, "");
  const activeService = dictionary.items[activeIndex];

  function selectTab(index: number, moveFocus = false) {
    const next = (index + dictionary.items.length) % dictionary.items.length;
    setActiveIndex(next);
    if (moveFocus) buttonRefs.current[next]?.focus();
  }
  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    const keys: Record<string, number> = { ArrowDown: index + 1, ArrowRight: index + 1, ArrowUp: index - 1, ArrowLeft: index - 1, Home: 0, End: dictionary.items.length - 1 };
    if (event.key in keys) {
      event.preventDefault();
      selectTab(keys[event.key], true);
    }
  }
  const panelId = `service-panel-${instanceId}`;
  const formPanelId = `project-form-panel-${instanceId}`;
  function closeForm() {
    if (isFormDirty && !window.confirm(dictionary.selector.dirtyWarning)) return;
    setIsFormOpen(false);
  }

  return (
    <div className={styles.selector}>
      <div className={styles.serviceTabs} role="tablist" aria-label={dictionary.selector.tabsLabel} aria-orientation="vertical">
        {dictionary.items.map((service, index) => {
          const active = index === activeIndex;
          return <button ref={(node) => { buttonRefs.current[index] = node; }} id={`service-tab-${instanceId}-${service.id}`} className={styles.serviceTab} type="button" role="tab" aria-selected={active} aria-controls={panelId} tabIndex={active ? 0 : -1} onClick={() => selectTab(index)} onKeyDown={(event) => handleKeyDown(event, index)} key={service.id}><span className={styles.tabNumber}>{String(index + 1).padStart(2, "0")}</span><span>{service.label}</span><i aria-hidden="true">↗</i></button>;
        })}
      </div>
      <article id={panelId} className={styles.solutionPanel} role="tabpanel" aria-labelledby={`service-tab-${instanceId}-${activeService.id}`} tabIndex={0}>
        <div className={styles.panelContent} key={activeService.id}>
          <div className={styles.panelTop}><div className={styles.solutionCopy}><p className={styles.category}><span aria-hidden="true" />{activeService.category}</p><h3>{activeService.title}</h3><p className={styles.solutionDescription}>{activeService.description}</p></div><span className={styles.panelNumber} aria-hidden="true">/ {String(activeIndex + 1).padStart(2, "0")}</span></div>
          <div className={styles.featureArea}><p>{dictionary.selector.featuresLabel}</p><ul>{activeService.features.map((feature) => <li key={feature}><span aria-hidden="true">✓</span>{feature}</li>)}</ul></div>
          <div className={styles.mockupArea} aria-hidden="true"><div className={styles.mockupLabel}><span>{dictionary.selector.mockupLabel}</span><i>CSS / UI</i></div>{mockups[activeService.id]?.(dictionary.mockups[activeService.id as keyof typeof dictionary.mockups])}</div>
          <div className={styles.panelCta}><div><span>{dictionary.selector.ctaHint}</span><strong>{dictionary.selector.ctaTitle}</strong></div><button ref={formTriggerRef} className={`${styles.action} ${styles.actionPrimary}`} type="button" aria-expanded={isFormOpen} aria-controls={formPanelId} onClick={() => isFormOpen ? closeForm() : setIsFormOpen(true)}>{isFormOpen ? dictionary.selector.closeForm : dictionary.selector.openForm}<span aria-hidden="true">{isFormOpen ? "×" : "↘"}</span></button></div>
        </div>
        <ProjectInquiryForm panelId={formPanelId} isOpen={isFormOpen} locale={locale} projectTypes={dictionary.items.map(({ id, label }) => ({ id, label }))} initialProjectTypeId={activeService.id} dictionary={dictionary.form} triggerRef={formTriggerRef} onClose={closeForm} onDirtyChange={setIsFormDirty} />
      </article>
    </div>
  );
}
