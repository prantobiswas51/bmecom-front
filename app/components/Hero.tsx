"use client";

import { useEffect, useState } from "react";
import { slides, tones } from "../data";
import { Art } from "./Art";
import { Icon } from "./icons";
import { Button } from "./ui/Button";

export function Hero() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setI((v) => (v + 1) % slides.length), 5500);
    return () => clearInterval(t);
  }, [paused]);

  const go = (n: number) => setI((n + slides.length) % slides.length);
  const s = slides[i];

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured offers"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="mx-auto mt-5 w-full max-w-[1440px] px-4 sm:px-6"
    >
      <div
        className="relative grid overflow-hidden rounded-[1.75rem] transition-colors duration-500 md:grid-cols-2"
        style={{ backgroundColor: tones[s.tone].bg }}
      >
        <div className="relative z-10 flex flex-col justify-center gap-4 p-7 sm:p-12 lg:p-16" aria-live="polite">
          <span className="w-fit rounded-full bg-white/70 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-accent-dark">
            {s.eyebrow}
          </span>
          <h1 className="text-balance text-3xl font-extrabold leading-[1.15] text-brand sm:text-4xl lg:text-[2.75rem]">
            {s.title}
          </h1>
          <p className="max-w-md text-muted">{s.body}</p>
          <div className="mt-2 h-1 w-14 rounded-full bg-accent" />
          <Button href={s.href} icon="cart" className="mt-2 w-fit">
            {s.cta}
          </Button>
        </div>

        <div className="relative hidden min-h-[320px] md:block">
          <div className="absolute inset-y-6 right-6 left-0 overflow-hidden rounded-[2.5rem] rounded-l-[8rem]">
            <Art kind={s.kind} tone={s.tone} className="h-full w-full object-cover" />
          </div>
        </div>

        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 backdrop-blur md:left-7 md:translate-x-0 sm:md:left-12">
          <button onClick={() => go(i - 1)} aria-label="Previous slide" className="text-brand"><Icon name="chevronLeft" width={16} height={16} /></button>
          {slides.map((_, n) => (
            <button
              key={n}
              onClick={() => setI(n)}
              aria-label={`Go to slide ${n + 1}`}
              aria-current={n === i}
              className={`h-2 rounded-full transition-all ${n === i ? "w-6 bg-brand" : "w-2 bg-brand/30"}`}
            />
          ))}
          <button onClick={() => go(i + 1)} aria-label="Next slide" className="text-brand"><Icon name="chevronRight" width={16} height={16} /></button>
        </div>
      </div>
    </section>
  );
}
