"use client";

import Image from "next/image";
import { useRef } from "react";

type TeamMemberCardProps = {
  name: string;
  role: string;
  image: string;
  index: string;
  summary: string;
  strength: string;
};

export function TeamMemberCard({
  name,
  role,
  image,
  index,
  summary,
  strength,
}: TeamMemberCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const card = cardRef.current;
    if (!card) return;

    const bounds = card.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;

    card.style.setProperty("--rotate-x", `${y * -7}deg`);
    card.style.setProperty("--rotate-y", `${x * 9}deg`);
    card.style.setProperty("--glow-x", `${(x + 0.5) * 100}%`);
    card.style.setProperty("--glow-y", `${(y + 0.5) * 100}%`);
  };

  const resetTilt = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty("--rotate-x", "0deg");
    card.style.setProperty("--rotate-y", "0deg");
    card.style.setProperty("--glow-x", "50%");
    card.style.setProperty("--glow-y", "35%");
  };

  return (
    <article
      className="group [perspective:1200px]"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
    >
      <div
        ref={cardRef}
        className="relative overflow-hidden rounded-2xl border border-border/70 bg-card transition-[transform,border-color,box-shadow] duration-300 ease-out [--glow-x:50%] [--glow-y:35%] [--rotate-x:0deg] [--rotate-y:0deg] [transform-style:preserve-3d] [transform:rotateX(var(--rotate-x))_rotateY(var(--rotate-y))] group-hover:border-primary/40 group-hover:shadow-[0_28px_90px_-45px_var(--primary)] motion-reduce:transform-none motion-reduce:transition-none"
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
          <Image
            src={image}
            alt={`Conceptual 3D portrait of ${name}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="animate-team-portrait object-cover"
            style={{ animationDelay: `${Number(index) * -1.25}s` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/5 to-transparent" />
          <div
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:hidden"
            style={{
              background:
                "radial-gradient(circle at var(--glow-x) var(--glow-y), color-mix(in srgb, var(--primary) 22%, transparent), transparent 35%)",
            }}
          />
          <div className="absolute left-5 top-5 rounded-full border border-white/15 bg-black/25 px-3 py-1 font-mono text-[10px] tracking-[0.2em] text-white/70 backdrop-blur-md">
            {index}
          </div>
          <div className="absolute bottom-5 left-5 right-5 [transform:translateZ(28px)]">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
              {role}
            </div>
            <h3 className="mt-2 font-display text-3xl font-semibold tracking-tight text-white">
              {name}
            </h3>
          </div>
        </div>

        <div className="relative space-y-5 p-6">
          <p className="text-sm leading-7 text-muted-foreground">{summary}</p>
          <div className="flex items-center justify-between border-t border-border/60 pt-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Superpower
            </span>
            <span className="text-right text-sm font-medium text-foreground">
              {strength}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
