"use client";

import { useEffect, useRef, useState } from "react";

import styles from "./InteractiveMatrixTile.module.css";

const effects = ["rain", "orbit", "scanner", "assemble", "confirm"] as const;

type MatrixEffect = (typeof effects)[number];

export function InteractiveMatrixTile({ label }: { label: string }) {
  const [activeEffect, setActiveEffect] = useState<MatrixEffect | null>(null);
  const [nextEffect, setNextEffect] = useState(0);
  const [run, setRun] = useState(0);
  const cleanupTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (cleanupTimer.current) {
        clearTimeout(cleanupTimer.current);
      }
    };
  }, []);

  function handleActivate() {
    const effect = effects[nextEffect];
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (cleanupTimer.current) {
      clearTimeout(cleanupTimer.current);
    }

    setActiveEffect(effect);
    setNextEffect((nextEffect + 1) % effects.length);
    setRun((current) => current + 1);

    cleanupTimer.current = setTimeout(
      () => {
        setActiveEffect(null);
        cleanupTimer.current = null;
      },
      reducedMotion ? 160 : 820,
    );
  }

  return (
    <button
      className={styles.button}
      type="button"
      aria-label={label}
      data-effect={activeEffect ?? undefined}
      onClick={handleActivate}
    >
      <span className={styles.tile} aria-hidden="true" key={run}>
        <span className={styles.rain}>
          <span />
          <span />
          <span />
        </span>

        <span className={styles.orbit}>
          <span />
          <span />
          <span />
          <span />
        </span>

        <span className={styles.scanner} />

        <span className={styles.symbol}>
          <span>&lt;</span>
          <span>/</span>
          <span>&gt;</span>
        </span>

        <span className={styles.confirm}>✓</span>
      </span>
    </button>
  );
}
