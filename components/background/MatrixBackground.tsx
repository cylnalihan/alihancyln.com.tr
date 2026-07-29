"use client";

import { useEffect, useRef } from "react";

const GLYPHS =
  "01<>/{}[];:=+*#@$%ABCDEFGHIJKLMNOPQRSTUVWXYZアイウエオカキクケコ";
const FRAME_INTERVAL = 1000 / 30;
const MAX_PIXEL_RATIO = 1.5;
const MOBILE_BREAKPOINT = 768;

export function MatrixBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d", { alpha: true });

    if (!context) {
      return;
    }

    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    let animationFrameId: number | null = null;
    let previousFrameTime = 0;
    let drops: number[] = [];
    let columnWidth = 22;
    let fontSize = 14;
    let cssWidth = 0;
    let cssHeight = 0;

    const randomGlyph = () =>
      GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

    const drawStaticFrame = () => {
      context.clearRect(0, 0, cssWidth, cssHeight);
      context.font = `${fontSize}px ui-monospace, SFMono-Regular, Consolas, monospace`;
      context.textBaseline = "top";

      const rows = Math.ceil(cssHeight / (fontSize * 1.8));
      const columns = Math.ceil(cssWidth / columnWidth);

      for (let column = 0; column < columns; column += 1) {
        for (let row = 0; row < rows; row += 1) {
          if (Math.random() > 0.34) {
            continue;
          }

          const isHighlight = Math.random() > 0.86;
          context.fillStyle = isHighlight
            ? "rgba(117, 240, 167, 0.25)"
            : "rgba(50, 255, 126, 0.13)";
          context.fillText(
            randomGlyph(),
            column * columnWidth,
            row * fontSize * 1.8,
          );
        }
      }
    };

    const resizeCanvas = () => {
      const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
      const pixelRatio = Math.min(
        window.devicePixelRatio || 1,
        MAX_PIXEL_RATIO,
      );

      cssWidth = window.innerWidth;
      cssHeight = window.innerHeight;
      columnWidth = isMobile ? 30 : 22;
      fontSize = isMobile ? 13 : 14;

      canvas.width = Math.floor(cssWidth * pixelRatio);
      canvas.height = Math.floor(cssHeight * pixelRatio);
      canvas.style.width = `${cssWidth}px`;
      canvas.style.height = `${cssHeight}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      const columnCount = Math.ceil(cssWidth / columnWidth);
      drops = Array.from(
        { length: columnCount },
        () => Math.random() * -(cssHeight / fontSize),
      );

      if (reducedMotionQuery.matches) {
        drawStaticFrame();
      } else {
        context.clearRect(0, 0, cssWidth, cssHeight);
      }
    };

    const drawAnimatedFrame = () => {
      context.fillStyle = "rgba(5, 7, 6, 0.15)";
      context.fillRect(0, 0, cssWidth, cssHeight);
      context.font = `${fontSize}px ui-monospace, SFMono-Regular, Consolas, monospace`;
      context.textBaseline = "top";

      drops.forEach((drop, column) => {
        const isHighlight = Math.random() > 0.91;
        context.fillStyle = isHighlight
          ? "rgba(117, 240, 167, 0.42)"
          : "rgba(50, 255, 126, 0.24)";
        context.fillText(
          randomGlyph(),
          column * columnWidth,
          drop * fontSize,
        );

        if (drop * fontSize > cssHeight && Math.random() > 0.985) {
          drops[column] = Math.random() * -18;
        } else {
          drops[column] = drop + 0.54;
        }
      });
    };

    const animate = (time: number) => {
      if (time - previousFrameTime >= FRAME_INTERVAL) {
        drawAnimatedFrame();
        previousFrameTime = time;
      }

      animationFrameId = window.requestAnimationFrame(animate);
    };

    const stopAnimation = () => {
      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    };

    const startAnimation = () => {
      if (
        animationFrameId === null &&
        !document.hidden &&
        !reducedMotionQuery.matches
      ) {
        previousFrameTime = performance.now();
        animationFrameId = window.requestAnimationFrame(animate);
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAnimation();
      } else {
        startAnimation();
      }
    };

    const handleMotionPreferenceChange = () => {
      stopAnimation();

      if (reducedMotionQuery.matches) {
        drawStaticFrame();
      } else {
        context.clearRect(0, 0, cssWidth, cssHeight);
        startAnimation();
      }
    };

    resizeCanvas();
    startAnimation();

    window.addEventListener("resize", resizeCanvas, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);
    reducedMotionQuery.addEventListener(
      "change",
      handleMotionPreferenceChange,
    );

    return () => {
      stopAnimation();
      window.removeEventListener("resize", resizeCanvas);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      reducedMotionQuery.removeEventListener(
        "change",
        handleMotionPreferenceChange,
      );
    };
  }, []);

  return (
    <div className="matrix-background" aria-hidden="true">
      <canvas className="matrix-canvas" ref={canvasRef} />
    </div>
  );
}
