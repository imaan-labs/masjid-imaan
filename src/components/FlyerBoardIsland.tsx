"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { Flyer } from "@/src/lib/sanity";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "youth", label: "Youth" },
  { id: "sisters", label: "Sisters" },
  { id: "lectures", label: "Lectures" },
  { id: "fundraiser", label: "Fundraisers" },
] as const;

type FilterId = (typeof FILTERS)[number]["id"];

const CATEGORY_LABELS: Record<string, string> = {
  general: "General",
  youth: "Youth",
  sisters: "Sisters",
  lectures: "Lectures",
  fundraiser: "Fundraiser",
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
}: {
  flyers: Flyer[];
  status: "ready" | "unavailable";
}) {
  const [filter, setFilter] = useState<FilterId>("all");
  const [activeId, setActiveId] = useState<string | null>(null);
  const headingId = useId();

  const visible =
    filter === "all"
      ? flyers
      : flyers.filter((flyer) => flyer.category === filter);

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
      className="min-h-screen bg-[#F6F0E6] px-4 pb-20 pt-28 text-[#3F3428] sm:px-6"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#C6A15B]">
            Community bulletin
          </p>
          <h1
            id={headingId}
            className="mt-2 text-4xl font-semibold tracking-tight text-[#047857] sm:text-5xl"
          >
            Flyer Bulletin
          </h1>
          <p className="mt-3 text-base text-[#5C5146] sm:text-lg">
            Current announcements for the masjid. Tap a flyer to open it, then
            pinch or scroll to zoom.
          </p>
        </div>

        <div
          className="mt-8 flex flex-wrap items-center justify-center gap-2"
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
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A15B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F6F0E6] ${
                  selected
                    ? "border-[#047857] bg-[#047857] text-[#F6F0E6]"
                    : "border-[#C6A15B] bg-[#FFF9F0] text-[#047857] hover:bg-[#F3E2C4]"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {status === "unavailable" ? (
          <p className="mx-auto mt-10 max-w-xl rounded-2xl border border-[#C6A15B] bg-[#FFF9F0] px-5 py-8 text-center text-[#5C5146]">
            The bulletin could not be loaded. Check the Sanity project
            settings and try again.
          </p>
        ) : visible.length === 0 ? (
          <p className="mx-auto mt-10 max-w-xl rounded-2xl border border-dashed border-[#C6A15B] bg-[#FFF9F0] px-5 py-8 text-center text-[#5C5146]">
            No current flyers in this category.
          </p>
        ) : (
          <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((flyer) => (
              <li key={flyer._id}>
                <button
                  type="button"
                  onClick={() => setActiveId(flyer._id)}
                  className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-[#E4D3B4] bg-[#FFF9F0] text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#C6A15B] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#047857] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F6F0E6]"
                >
                  <span className="relative block aspect-[3/4] overflow-hidden bg-[#EFE4D2]">
                    <img
                      src={flyer.imageUrl}
                      alt=""
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-[#047857] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#F6E7C3]">
                      {categoryLabel(flyer.category)}
                    </span>
                  </span>
                  <span className="px-4 py-4 text-lg font-semibold leading-snug text-[#047857]">
                    {flyer.title}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
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
      className="fixed inset-0 z-[80] flex items-center justify-center bg-[#1C1917]/88 p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={onClose}
    >
      <div
        className="flex max-h-full w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-[#C6A15B] bg-[#1C1917] shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 border-b border-[#C6A15B]/40 px-4 py-3 text-[#F6F0E6]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#C6A15B]">
              {categoryLabel(flyer.category)}
            </p>
            <h2 id={titleId} className="text-lg font-semibold text-[#F6F0E6]">
              {flyer.title}
            </h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="rounded-full bg-[#047857] px-3 py-1.5 text-sm font-semibold text-[#F6F0E6] hover:bg-[#065F46] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A15B]"
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

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#C6A15B]/40 px-4 py-3">
          <p className="text-sm text-[#E7D7B8]">
            Pinch, scroll, or use the buttons to zoom. {Math.round(view.scale * 100)}%
          </p>
          <div className="flex items-center gap-2">
            {flyer.actionLink ? (
              <a
                href={flyer.actionLink}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-[#C6A15B] px-3 py-1.5 text-sm font-semibold text-[#F6E7C3] hover:bg-[#C6A15B] hover:text-[#1C1917]"
              >
                Open link
              </a>
            ) : null}
            <button
              type="button"
              onClick={() => updateScale(view.scale / 1.25)}
              className="rounded-full border border-[#C6A15B] px-3 py-1.5 text-sm font-semibold text-[#F6E7C3]"
              aria-label="Zoom out"
            >
              −
            </button>
            <button
              type="button"
              onClick={() => setView({ scale: 1, x: 0, y: 0 })}
              className="rounded-full border border-[#C6A15B] px-3 py-1.5 text-sm font-semibold text-[#F6E7C3]"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => updateScale(view.scale * 1.25)}
              className="rounded-full bg-[#047857] px-3 py-1.5 text-sm font-semibold text-[#F6F0E6]"
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
