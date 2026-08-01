"use client";

import type { FocusEvent, KeyboardEvent, PointerEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

type HeroMessage = {
  leading: string;
  accent: string;
  trailing: string;
};

type HeroMessagesProps = {
  label: string;
  support: string;
  messages: readonly HeroMessage[];
  previousLabel: string;
  nextLabel: string;
  messageLabel: string;
};

type Direction = "forward" | "backward";

const ROTATION_DELAY = 3200;
const TRANSITION_DURATION = 580;
const SWIPE_THRESHOLD = 42;

function getMessageText(message: HeroMessage) {
  return `${message.leading}${message.accent}${message.trailing}`;
}

export function HeroMessages({
  label,
  support,
  messages,
  previousLabel,
  nextLabel,
  messageLabel,
}: HeroMessagesProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [outgoingIndex, setOutgoingIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<Direction>("forward");
  const [cycleKey, setCycleKey] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const transitionTimerRef = useRef<number | null>(null);
  const swipeStartRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => {
      setReducedMotion(query.matches);
      if (query.matches) {
        setOutgoingIndex(null);
        setActiveIndex(0);
        setCycleKey((current) => current + 1);
      }
    };

    updateMotionPreference();
    if (query.addEventListener) {
      query.addEventListener("change", updateMotionPreference);
      return () => query.removeEventListener("change", updateMotionPreference);
    }

    query.addListener(updateMotionPreference);
    return () => query.removeListener(updateMotionPreference);
  }, []);

  useEffect(() => {
    const updateVisibility = () => {
      const visible = !document.hidden;
      setIsPageVisible(visible);
      if (visible) setCycleKey((current) => current + 1);
    };

    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    return () => document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  useEffect(() => {
    return () => {
      if (transitionTimerRef.current !== null) {
        window.clearTimeout(transitionTimerRef.current);
      }
    };
  }, []);

  const showMessage = useCallback(
    (nextIndex: number, nextDirection: Direction) => {
      if (nextIndex === activeIndex) {
        setCycleKey((current) => current + 1);
        return;
      }

      if (transitionTimerRef.current !== null) {
        window.clearTimeout(transitionTimerRef.current);
      }

      setDirection(nextDirection);
      setOutgoingIndex(reducedMotion ? null : activeIndex);
      setActiveIndex(nextIndex);
      setCycleKey((current) => current + 1);

      if (!reducedMotion) {
        transitionTimerRef.current = window.setTimeout(() => {
          setOutgoingIndex(null);
          transitionTimerRef.current = null;
        }, TRANSITION_DURATION);
      }
    },
    [activeIndex, reducedMotion],
  );

  const showPrevious = useCallback(() => {
    showMessage((activeIndex - 1 + messages.length) % messages.length, "backward");
  }, [activeIndex, messages.length, showMessage]);

  const showNext = useCallback(() => {
    showMessage((activeIndex + 1) % messages.length, "forward");
  }, [activeIndex, messages.length, showMessage]);

  useEffect(() => {
    if (isPaused || !isPageVisible || reducedMotion || messages.length < 2) return;

    const timer = window.setTimeout(showNext, ROTATION_DELAY);
    return () => window.clearTimeout(timer);
  }, [cycleKey, isPageVisible, isPaused, messages.length, reducedMotion, showNext]);

  const resumeRotation = () => {
    setIsPaused(false);
    setCycleKey((current) => current + 1);
  };

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      resumeRotation();
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showPrevious();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      showNext();
    }
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") {
      swipeStartRef.current = { x: event.clientX, y: event.clientY };
    }
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const start = swipeStartRef.current;
    swipeStartRef.current = null;
    if (!start || event.pointerType !== "touch") return;

    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    if (Math.abs(deltaX) < SWIPE_THRESHOLD || Math.abs(deltaX) <= Math.abs(deltaY)) return;

    if (deltaX < 0) showNext();
    else showPrevious();
  };

  return (
    <div
      className="hero-message-region"
      data-direction={direction}
      data-paused={isPaused || !isPageVisible}
      data-reduced-motion={reducedMotion}
      onPointerEnter={(event) => {
        if (event.pointerType !== "touch") setIsPaused(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType !== "touch") resumeRotation();
      }}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={handleBlur}
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      onPointerCancel={() => {
        swipeStartRef.current = null;
      }}
      onPointerUp={handlePointerUp}
    >
      <h1 id="hero-title" className="hero-message-accessible">
        {getMessageText(messages[0])}
      </h1>
      <p className="hero-message-accessible">{support}</p>

      <p className="hero-message-label" aria-hidden="true">{label}</p>

      <div className="hero-message-stage" aria-hidden="true">
        <div className="hero-message-sizer" aria-hidden="true">
          {messages.map((message) => (
            <p className="hero-message-title" key={`sizer-${getMessageText(message)}`}>
              <span className="hero-message-leading">{message.leading}</span>
              <span className="hero-message-accent">{message.accent}</span>
              <span className="hero-message-trailing">{message.trailing}</span>
            </p>
          ))}
        </div>

        {messages.map((message, index) => {
          const state = index === activeIndex ? "active" : index === outgoingIndex ? "outgoing" : "inactive";
          return (
            <div className="hero-message-slide" data-state={state} key={getMessageText(message)}>
              <p className="hero-message-title">
                <span className="hero-message-leading">{message.leading}</span>
                <span className="hero-message-accent">{message.accent}</span>
                <span className="hero-message-trailing">{message.trailing}</span>
              </p>
            </div>
          );
        })}
      </div>

      <p className="hero-message-support" aria-hidden="true">{support}</p>

      <div className="hero-message-controls">
        <button type="button" className="hero-message-chevron" aria-label={previousLabel} onClick={showPrevious}>
          <span aria-hidden="true">‹</span>
        </button>

        <div className="hero-message-indicators">
          {messages.map((message, index) => (
            <button
              type="button"
              aria-label={`${messageLabel} ${index + 1}`}
              aria-pressed={index === activeIndex}
              data-active={index === activeIndex}
              onClick={() => showMessage(index, index < activeIndex ? "backward" : "forward")}
              key={getMessageText(message)}
            >
              <span aria-hidden="true">
                {index === activeIndex && <i key={`${activeIndex}-${cycleKey}`} />}
              </span>
            </button>
          ))}
        </div>

        <button type="button" className="hero-message-chevron" aria-label={nextLabel} onClick={showNext}>
          <span aria-hidden="true">›</span>
        </button>
      </div>
    </div>
  );
}
