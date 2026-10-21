"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import type { Flyer } from "@/src/lib/sanity";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "sessions", label: "Sessions" },
  { id: "ramadan", label: "Ramadan" },
  { id: "eid", label: "Eid" },
  { id: "youth", label: "Youth" },
  { id: "sisters", label: "Sisters" },
  { id: "fundraiser", label: "Fundraiser" },
  { id: "general", label: "General" },
] as const;

type FilterId = (typeof FILTERS)[number]["id"];

function isFilterId(value: string): value is FilterId {
  return FILTERS.some((item) => item.id === value);
}

const CATEGORY_LABELS: Record<string, string> = {
  general: "General Announcement",
  sessions: "Interactive Sessions / Lectures",
  ramadan: "Ramadan Services & Taraweeh",
  eid: "Eid Celebrations & Prayers",
  youth: "Youth & Kids",
  sisters: "Sisters Program",
  fundraiser: "Fundraiser",
  classes: "Classes",
  schedule: "Schedule",
  lectures: "Lectures",
};

type View = {
  scale: number;
  x: number;
  y: number;
};

const MIN_SCALE = 1;
const MAX_SCALE = 5;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function categoryLabel(category: string | null) {
  if (!category) return "General";
  return CATEGORY_LABELS[category] ?? category;
}

export default function FlyerBoardIsland({
  flyers,
  status,
  limit,
  previewOnly = false,
  initialCategory = null,
}: {
  flyers: Flyer[];
  status: "loading" | "ready";
  limit?: number;
  previewOnly?: boolean;
  initialCategory?: string | null;
}) {
  const [filter, setFilter] = useState<FilterId>("all");

  useEffect(() => {
    if (initialCategory && isFilterId(initialCategory)) {
      setFilter(initialCategory);
    }
  }, [initialCategory]);
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const headingId = useId();

  const searched = flyers.filter((flyer) => {
    const categoryOk = previewOnly || filter === "all" || flyer.category === filter;
    const needle = query.trim().toLowerCase();
    const textOk = previewOnly || needle.length === 0 || flyer.title.toLowerCase().includes(needle);
    return categoryOk && textOk;
  });
  const visible = typeof limit === "number" ? searched.slice(0, limit) : searched;

  const active = flyers.find((flyer) => flyer._id === activeId) ?? null;
  const closeLightbox = useCallback(() => setActiveId(null), []);

  useEffect(() => {
    if (!activeId) return;
    const stillVisible =
      filter === "all" ||
      flyers.some(
        (flyer) => flyer._id === activeId && flyer.category === filter
      );
    if (!stillVisible) setActiveId(null);
  }, [activeId, filter, flyers]);

  return (
    <section
      aria-labelledby={headingId}
      id={previewOnly ? "flyer-preview" : "flyer-board"}
      className={
        previewOnly
          ? "flex w-full flex-col rounded-3xl border border-slate-200/80 bg-white p-6 text-slate-900 shadow-xl"
          : "scroll-mt-24 py-16 text-slate-900"
      }
    >
      <div className={previewOnly ? "flex w-full flex-col" : "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"}>
        <div className={previewOnly ? "" : "mx-auto max-w-2xl text-center"}>
          {previewOnly ? (
            <h2
              id={headingId}
              className="font-heading text-2xl font-extrabold tracking-tight text-slate-900"
            >
              Bulletin Board
            </h2>
          ) : (
            <h1
              id={headingId}
              className="text-4xl font-semibold tracking-tight text-brand-dark sm:text-5xl"
            >
              Bulletin Board
            </h1>
          )}
          <p className={previewOnly ? "mt-1 text-sm text-slate-600" : "mt-3 text-base text-slate-600 sm:text-lg"}>
            {previewOnly
              ? "The latest announcements from the masjid."
              : "Current announcements for the masjid. Tap a flyer to open it, then pinch or scroll to zoom."}
          </p>
        </div>

        {previewOnly ? null : (
        <div className="mx-auto mt-8 max-w-xl">
          <label className="block text-sm font-semibold text-brand-teal" htmlFor="flyer-search">
            Search flyers
          </label>
          <input
            id="flyer-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by title"
            className="mt-2 w-full rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-900 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
          />
        </div>
        )}

        {previewOnly ? null : (
        <div
          className="mt-6 flex flex-wrap items-center justify-center gap-2"
          role="toolbar"
          aria-label="Filter flyers by category"
        >
          {FILTERS.map((item) => {
            const selected = filter === item.id;
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={selected}
                onClick={() => setFilter(item.id)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg ${
                  selected
                    ? "border-brand-teal bg-brand-teal text-white"
                    : "border-slate-200 bg-white text-brand-teal hover:border-brand-teal"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
        )}

        {status === "loading" ? (
          <p className={`mx-auto max-w-xl rounded-2xl border px-5 py-6 text-center ${previewOnly ? "mt-4 border-slate-200 bg-slate-50 text-slate-600" : "mt-10 border-slate-200 bg-white text-slate-600"}`}>
            Loading current flyers…
          </p>
        ) : visible.length === 0 ? (
          <p className={`rounded-2xl border px-5 py-6 text-center ${previewOnly ? "mt-4 border-dashed border-slate-300 bg-slate-50 text-slate-600" : "mx-auto mt-10 max-w-xl border-dashed border-slate-300 bg-white text-slate-600"}`}>
            No announcements posted right now.
          </p>
        ) : (
          <ul className={previewOnly ? "mt-4 grid grid-cols-1 gap-3" : "mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"}>
            {visible.map((flyer) => (
              <li key={flyer._id}>
                <button
                  type="button"
                  onClick={() => setActiveId(flyer._id)}
                  className={`flex h-full w-full flex-col text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 ${previewOnly ? "rounded-2xl" : "rounded-3xl border border-slate-200/80 bg-white shadow-sm hover:border-slate-300 hover:shadow-xl"}`}
                >
                  <span className="relative flex w-full items-center justify-center overflow-hidden rounded-2xl bg-slate-900/5 p-2">
                    <img
                      src={flyer.imageUrl}
                      alt={flyer.title}
                      className={`block h-auto w-full rounded-xl object-contain ${previewOnly ? "" : "max-h-[580px]"}`}
                      loading="lazy"
                    />
                    <span className="absolute left-3 top-3 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-800">
                      {categoryLabel(flyer.category)}
                    </span>
                  </span>
                  <span className={`font-semibold leading-snug ${previewOnly ? "px-1 py-3 text-sm text-slate-900" : "px-4 py-4 text-lg text-slate-900"}`}>
                    {flyer.title}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {previewOnly ? (
          <div className="pt-6">
            <Link
              href="/bulletin"
              className="inline-flex rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-slate-800"
            >
              Browse Full Bulletin Board →
            </Link>
          </div>
        ) : null}
      </div>

      {active ? (
        <FlyerLightbox flyer={active} onClose={closeLightbox} />
      ) : null}
    </section>
  );
}

function FlyerLightbox({
  flyer,
  onClose,
}: {
  flyer: Flyer;
  onClose: () => void;
}) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<View>({ scale: 1, x: 0, y: 0 });
  const viewRef = useRef(view);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef<
    | {
        type: "pinch" | "pan";
        startDistance: number;
        startScale: number;
        startX: number;
        startY: number;
        originX: number;
        originY: number;
      }
    | null
  >(null);

  viewRef.current = view;

  useEffect(() => {
    closeRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const direction = event.deltaY < 0 ? 1.12 : 0.89;
      const nextScale = clamp(
        viewRef.current.scale * direction,
        MIN_SCALE,
        MAX_SCALE
      );
      setView({
        scale: nextScale,
        x: nextScale === 1 ? 0 : viewRef.current.x,
        y: nextScale === 1 ? 0 : viewRef.current.y,
      });
    };

    stage.addEventListener("wheel", onWheel, { passive: false });
    return () => stage.removeEventListener("wheel", onWheel);
  }, []);

  function updateScale(nextScale: number) {
    const scale = clamp(nextScale, MIN_SCALE, MAX_SCALE);
    setView({
      scale,
      x: scale === 1 ? 0 : viewRef.current.x,
      y: scale === 1 ? 0 : viewRef.current.y,
    });
  }

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Some browsers reject capture until the pointer is active. Tracking still works.
    }
    pointers.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });

    const points = Array.from(pointers.current.values());
    if (points.length >= 2) {
      const [first, second] = points;
      gesture.current = {
        type: "pinch",
        startDistance: Math.max(
          1,
          Math.hypot(first.x - second.x, first.y - second.y)
        ),
        startScale: viewRef.current.scale,
        startX: 0,
        startY: 0,
        originX: viewRef.current.x,
        originY: viewRef.current.y,
      };
      return;
    }

    if (viewRef.current.scale > 1) {
      gesture.current = {
        type: "pan",
        startDistance: 0,
        startScale: viewRef.current.scale,
        startX: event.clientX,
        startY: event.clientY,
        originX: viewRef.current.x,
        originY: viewRef.current.y,
      };
    }
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!pointers.current.has(event.pointerId) || !gesture.current) return;
    pointers.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });

    if (gesture.current.type === "pinch" && pointers.current.size >= 2) {
      const [first, second] = Array.from(pointers.current.values());
      const distance = Math.hypot(first.x - second.x, first.y - second.y);
      const nextScale = clamp(
        gesture.current.startScale * (distance / gesture.current.startDistance),
        MIN_SCALE,
        MAX_SCALE
      );
      setView({
        scale: nextScale,
        x: nextScale === 1 ? 0 : gesture.current.originX,
        y: nextScale === 1 ? 0 : gesture.current.originY,
      });
      return;
    }

    if (gesture.current.type === "pan") {
      const limit = 320 * (viewRef.current.scale - 1) + 48;
      setView({
        scale: gesture.current.startScale,
        x: clamp(
          gesture.current.originX + (event.clientX - gesture.current.startX),
          -limit,
          limit
        ),
        y: clamp(
          gesture.current.originY + (event.clientY - gesture.current.startY),
          -limit,
          limit
        ),
      });
    }
  }

  function onPointerUp(event: React.PointerEvent<HTMLDivElement>) {
    pointers.current.delete(event.pointerId);
    if (pointers.current.size < 2) gesture.current = null;
  }

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-brand-dark/80 p-3 transition-all duration-200 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={onClose}
    >
      <div
        className="flex max-h-full w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-brand-dark shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 border-b border-white/10 px-4 py-3 text-white">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-gold">
              {categoryLabel(flyer.category)}
            </p>
            <h2 id={titleId} className="text-lg font-semibold text-white">
              {flyer.title}
            </h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="rounded-full bg-brand-teal px-3 py-1.5 text-sm font-semibold text-white hover:bg-brand-gold hover:text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
          >
            Close
          </button>
        </div>

        <div
          ref={stageRef}
          className="relative flex min-h-[62vh] flex-1 touch-none items-center justify-center overflow-hidden bg-[#14110E]"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onDoubleClick={() =>
            updateScale(viewRef.current.scale > 1 ? 1 : 2.5)
          }
        >
          <img
            src={flyer.fullImageUrl}
            alt={flyer.title}
            draggable={false}
            className="max-h-[70vh] max-w-[92vw] select-none object-contain sm:max-w-full"
            style={{
              transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})`,
            }}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-4 py-3">
          <p className="text-sm text-[#E7D7B8]">
            Pinch, scroll, or use the buttons to zoom. {Math.round(view.scale * 100)}%
          </p>
          <div className="flex items-center gap-2">
            {flyer.actionLink ? (
              <a
                href={flyer.actionLink}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/20 px-3 py-1.5 text-sm font-semibold text-slate-200 hover:bg-brand-gold hover:text-brand-dark"
              >
                Open link
              </a>
            ) : null}
            <button
              type="button"
              onClick={() => updateScale(view.scale / 1.25)}
              className="rounded-full border border-white/20 px-3 py-1.5 text-sm font-semibold text-slate-200"
              aria-label="Zoom out"
            >
              −
            </button>
            <button
              type="button"
              onClick={() => setView({ scale: 1, x: 0, y: 0 })}
              className="rounded-full border border-white/20 px-3 py-1.5 text-sm font-semibold text-slate-200"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => updateScale(view.scale * 1.25)}
              className="rounded-full bg-brand-teal px-3 py-1.5 text-sm font-semibold text-white"
              aria-label="Zoom in"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
