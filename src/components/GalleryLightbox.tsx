"use client";

import { useEffect, useRef } from "react";
import { galleryCategoryLabel, type GalleryImage } from "@/src/lib/sanity";

export function formatGalleryDate(value: string | null) {
  if (!value) return null;
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return value;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function GalleryLightbox({
  images,
  index,
  onClose,
  onIndex,
}: {
  images: GalleryImage[];
  index: number;
  onClose: () => void;
  onIndex: (index: number) => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const image = images[index];

  useEffect(() => {
    closeRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") onIndex(Math.min(images.length - 1, index + 1));
      if (event.key === "ArrowLeft") onIndex(Math.max(0, index - 1));
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [images.length, index, onClose, onIndex]);

  if (!image) return null;
  const dateLabel = formatGalleryDate(image.date);

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/80 p-4" role="presentation">
      <button type="button" className="absolute inset-0 cursor-default" aria-label="Close photo" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={image.title}
        className="relative z-10 flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white text-slate-900 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 px-5 py-4">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
              {galleryCategoryLabel(image.category)}
            </p>
            <h2 className="mt-1 text-lg font-bold tracking-tight">{image.title}</h2>
            {dateLabel ? <p className="mt-1 text-sm text-slate-600">{dateLabel}</p> : null}
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Close
          </button>
        </div>
        <div className="relative flex min-h-0 flex-1 items-center justify-center bg-slate-100 p-3">
          <button
            type="button"
            aria-label="Previous photo"
            disabled={index === 0}
            onClick={() => onIndex(index - 1)}
            className="absolute left-3 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-lg font-bold text-slate-900 shadow-md hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span aria-hidden="true">‹</span>
          </button>
          <img
            src={image.imageUrl}
            alt={image.title}
            className="max-h-[70vh] w-auto max-w-full object-contain"
          />
          <button
            type="button"
            aria-label="Next photo"
            disabled={index >= images.length - 1}
            onClick={() => onIndex(index + 1)}
            className="absolute right-3 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-lg font-bold text-slate-900 shadow-md hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span aria-hidden="true">›</span>
          </button>
        </div>
      </div>
    </div>
  );
}
