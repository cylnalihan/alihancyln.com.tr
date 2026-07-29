"use client";

import { useEffect, useId, useRef, useState } from "react";

import styles from "./DigitalWorldTile.module.css";

type DigitalWorldDictionary = {
  buttonLabel: string;
  eyebrow: string;
  message: string;
  location: string;
};

function DigitalGlobe() {
  return (
    <svg
      className={styles.globe}
      viewBox="0 0 36 36"
      fill="none"
      aria-hidden="true"
    >
      <circle className={styles.globeEdge} cx="18" cy="18" r="11.5" />
      <ellipse className={styles.longitude} cx="18" cy="18" rx="5.2" ry="11.5" />
      <path className={styles.latitude} d="M7.5 14.2h21M7.5 21.8h21" />
      <g className={styles.connections}>
        <path d="m12.2 13.1 11.4 3.2-7.7 6.4 10-1.3" />
      </g>
      <g className={styles.nodes}>
        <circle cx="12.2" cy="13.1" r="1.15" />
        <circle cx="23.6" cy="16.3" r="1.15" />
        <circle cx="15.9" cy="22.7" r="1.15" />
        <circle cx="25.9" cy="21.4" r="1.15" />
      </g>
    </svg>
  );
}

export function DigitalWorldTile({
  dictionary,
}: {
  dictionary: DigitalWorldDictionary;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [run, setRun] = useState(0);
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleDismiss(event: KeyboardEvent | PointerEvent) {
      if (event instanceof KeyboardEvent && event.key === "Escape") {
        setIsOpen(false);
        return;
      }

      if (
        event instanceof PointerEvent &&
        rootRef.current &&
        !rootRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", handleDismiss);
    document.addEventListener("pointerdown", handleDismiss);

    return () => {
      document.removeEventListener("keydown", handleDismiss);
      document.removeEventListener("pointerdown", handleDismiss);
    };
  }, [isOpen]);

  function handleActivate() {
    setRun((current) => current + 1);
    setIsOpen((current) => !current);
  }

  return (
    <div className={styles.root} ref={rootRef}>
      <button
        className={styles.button}
        type="button"
        aria-label={dictionary.buttonLabel}
        aria-expanded={isOpen}
        aria-controls={panelId}
        data-connected={run > 0 ? "" : undefined}
        onClick={handleActivate}
      >
        <span className={styles.tile} aria-hidden="true" key={run}>
          <DigitalGlobe />
          <span className={styles.scan} />
          <span className={styles.signal} />
        </span>
      </button>

      <div
        className={styles.popover}
        id={panelId}
        role="status"
        data-open={isOpen}
        aria-hidden={!isOpen}
      >
        <span className={styles.popoverLabel}>{dictionary.eyebrow}</span>
        <strong>{dictionary.message}</strong>
        <span className={styles.location}>{dictionary.location}</span>
      </div>
    </div>
  );
}

export function DigitalWorldMobileInfo({
  dictionary,
}: {
  dictionary: DigitalWorldDictionary;
}) {
  return (
    <div className={styles.mobileInfo}>
      <span className={styles.mobileGlobe} aria-hidden="true">
        <DigitalGlobe />
      </span>
      <span>
        <strong>{dictionary.message}</strong>
        <small>{dictionary.location}</small>
      </span>
    </div>
  );
}
