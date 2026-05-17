"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Slide = {
  title: string;
  caption: string;
  tag: string;
  image: string;
  accent: string;
};

const SLIDES: Slide[] = [
  {
    tag: "Vegetables",
    title: "Harvest-fresh greens, from Nuwara Eliya to Colombo",
    caption:
      "Up-country growers ship same-day spinach, carrots, leeks and beans straight to your kitchen.",
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1600&q=80",
    accent: "bg-mint text-forest-deep",
  },
  {
    tag: "Tropical fruits",
    title: "Sun-ripened mangoes, papaya and king coconut",
    caption:
      "Smallholder orchards across the dry zone — picked, packed and listed for live bidding.",
    image:
      "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&w=1600&q=80",
    accent: "bg-weather/30 text-foreground",
  },
  {
    tag: "Tea & spices",
    title: "Ceylon tea, cinnamon, pepper and cardamom",
    caption:
      "Hill-country estates and spice gardens auction their freshest lots to local roasters and exporters.",
    image:
      "https://images.unsplash.com/photo-1582793988951-9aed5509eb97?auto=format&fit=crop&w=1600&q=80",
    accent: "bg-soil/25 text-foreground",
  },
  {
    tag: "Rice & grains",
    title: "Paddy from the cultivation heartlands",
    caption:
      "Polonnaruwa, Anuradhapura and Hambantota farmers list each harvest with floor-price protection.",
    image:
      "https://images.unsplash.com/photo-1568097214834-deb6c7d61c84?auto=format&fit=crop&w=1600&q=80",
    accent: "bg-growth/25 text-forest-deep",
  },
  {
    tag: "From the farm",
    title: "Real farmers. Fair prices. Live competition.",
    caption:
      "AgriMarket lets buyers across 25 districts bid against each other so growers earn what their harvest is worth.",
    image:
      "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1600&q=80",
    accent: "bg-water/25 text-info",
  },
];

const AUTO_ADVANCE_MS = 5000;

export function LandingCarousel() {
  const [index, setIndex] = useState(0);
  const [isPaused, setPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const go = useCallback((next: number) => {
    setIndex(((next % SLIDES.length) + SLIDES.length) % SLIDES.length);
  }, []);

  const next = useCallback(() => go(index + 1), [go, index]);
  const prev = useCallback(() => go(index - 1), [go, index]);

  useEffect(() => {
    if (isPaused) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, AUTO_ADVANCE_MS);
    return () => window.clearInterval(id);
  }, [isPaused]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!trackRef.current) return;
      const active = document.activeElement;
      if (!trackRef.current.contains(active)) return;
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  return (
    <section className="mx-auto max-w-7xl px-4 pb-4 pt-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="inline-flex w-fit items-center gap-2 rounded-full border border-leaf-soft bg-mint px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-forest-deep">
            <Sparkles className="h-3.5 w-3.5" />
            From the farm
          </p>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            What&apos;s growing on AgriMarket right now
          </h2>
          <p className="max-w-2xl text-muted-foreground">
            A snapshot of the fresh produce, spices and grains Sri Lankan farmers
            list every week.
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Previous slide"
            onClick={prev}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Next slide"
            onClick={next}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="relative overflow-hidden rounded-3xl border border-border bg-surface shadow-[var(--shadow-soft)]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        role="region"
        aria-roledescription="carousel"
        aria-label="Featured produce categories"
        tabIndex={0}
      >
        <div
          className="flex transition-transform duration-[700ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {SLIDES.map((slide, i) => (
            <div
              key={slide.title}
              className="relative aspect-[16/9] w-full shrink-0 sm:aspect-[21/9]"
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${SLIDES.length}`}
              aria-hidden={i !== index}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slide.image}
                alt={slide.title}
                draggable={false}
                className="h-full w-full select-none object-cover"
                loading={i === 0 ? "eager" : "lazy"}
              />
              {/* Solid color tint — no gradient */}
              <div className="absolute inset-0 bg-forest-deep/55" />
              <div className="absolute inset-0 flex items-end p-6 sm:items-center sm:p-12">
                <div className="max-w-xl space-y-4 text-primary-foreground">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]",
                      slide.accent,
                    )}
                  >
                    {slide.tag}
                  </span>
                  <h3 className="text-2xl font-extrabold leading-tight sm:text-3xl lg:text-4xl">
                    {slide.title}
                  </h3>
                  <p className="text-sm leading-6 text-primary-foreground/90 sm:text-base">
                    {slide.caption}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Progress dots */}
        <div className="absolute inset-x-0 bottom-4 z-10 flex justify-center gap-2">
          {SLIDES.map((slide, i) => {
            const active = i === index;
            return (
              <button
                key={slide.title}
                type="button"
                onClick={() => go(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={active}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  active
                    ? "w-8 bg-weather"
                    : "w-3 bg-primary-foreground/60 hover:bg-primary-foreground",
                )}
              />
            );
          })}
        </div>
      </div>

      {/* Compact thumbnail strip */}
      <div className="scroll-soft mt-4 flex gap-3 overflow-x-auto pb-2">
        {SLIDES.map((slide, i) => {
          const active = i === index;
          return (
            <button
              key={`thumb-${slide.title}`}
              type="button"
              onClick={() => go(i)}
              aria-label={`Show ${slide.tag}`}
              className={cn(
                "group relative h-16 w-28 shrink-0 overflow-hidden rounded-xl border transition-all sm:h-20 sm:w-36",
                active
                  ? "border-primary ring-2 ring-primary/40"
                  : "border-border opacity-70 hover:opacity-100",
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slide.image}
                alt=""
                draggable={false}
                className="h-full w-full select-none object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <span className="absolute inset-x-0 bottom-0 bg-forest-deep/80 px-2 py-1 text-left text-[10px] font-semibold uppercase tracking-wide text-primary-foreground">
                {slide.tag}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
