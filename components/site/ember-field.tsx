"use client";

import type * as React from "react";
import { useEffect, useRef } from "react";

const EMBERS = [
  { left: "6%", size: 3, duration: 9, delay: 0, drift: 30 },
  { left: "14%", size: 2, duration: 7.5, delay: 1.2, drift: -20 },
  { left: "23%", size: 4, duration: 11, delay: 2.4, drift: 40 },
  { left: "31%", size: 2, duration: 8.2, delay: 0.6, drift: -15 },
  { left: "40%", size: 3, duration: 10, delay: 3.1, drift: 25 },
  { left: "49%", size: 2, duration: 7, delay: 1.8, drift: -35 },
  { left: "58%", size: 4, duration: 12, delay: 0.2, drift: 15 },
  { left: "67%", size: 2, duration: 8.8, delay: 2.9, drift: -25 },
  { left: "76%", size: 3, duration: 9.6, delay: 1.1, drift: 35 },
  { left: "85%", size: 2, duration: 7.8, delay: 3.6, drift: -10 },
  { left: "92%", size: 3, duration: 10.6, delay: 0.9, drift: 20 },
  { left: "18%", size: 2, duration: 13, delay: 4.2, drift: -30 },
];
export function EmberField({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {EMBERS.map((e, i) => (
        <span
          // biome-ignore lint/suspicious/noArrayIndexKey: static decorative array, never reordered
          key={i}
          className="animate-ember-rise absolute bottom-0 rounded-full bg-gradient-to-t from-accent to-primary"
          style={
            {
              left: e.left,
              width: e.size,
              height: e.size,
              animationDuration: `${e.duration}s`,
              animationDelay: `${e.delay}s`,
              "--drift": `${e.drift}px`,
              boxShadow: "0 0 6px 1px var(--ember)",
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

export function EmberCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let pixelRatio = 1;

    const resize = () => {
      const bounds = parent.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };
    resize();

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      decay: number;
      hue: number;
    }> = [];

    const spawn = () => {
      particles.push({
        x: Math.random() * width,
        y: height + 10,
        vx: (Math.random() - 0.5) * 0.9,
        vy: -(Math.random() * 2.2 + 0.8),
        size: Math.random() * 3 + 0.8,
        alpha: Math.random() * 0.65 + 0.2,
        decay: Math.random() * 0.002 + 0.002,
        hue: Math.random() > 0.45 ? 22 : 38,
      });
    };

    let frame: number;
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      if (Math.random() < 0.9) spawn();
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;
        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 3);
        ctx.fillStyle = `hsla(${p.hue},100%,60%,${p.alpha})`;
        ctx.fill();
      }
      frame = requestAnimationFrame(draw);
    };
    draw();

    const observer = new ResizeObserver(resize);
    observer.observe(parent);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 size-full"
      style={{ opacity: 0.6 }}
    />
  );
}
