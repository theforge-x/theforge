import type * as React from "react";

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
