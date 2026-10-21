"use client";

import { useCallback, useEffect, useState } from "react";
import GalleryLightbox, { formatGalleryDate } from "@/src/components/GalleryLightbox";
import {
  galleryArchiveQuery,
  galleryCategoryLabel,
  galleryFromDocuments,
  getSanityClient,
  type GalleryDocument,
  type GalleryImage,
} from "@/src/lib/sanity";

const filters = [
  { id: "all", label: "All" },
  { id: "community", label: "Community & Gatherings" },
  { id: "prayers", label: "Prayers & Taraweeh" },
  { id: "eid", label: "Eid & Celebrations" },
  { id: "facility", label: "Masjid Facility" },
] as const;

export default function GalleryArchive() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [status, setStatus] = useState<"loading" | "ready">("loading");
  const [filter, setFilter] = useState<(typeof filters)[number]["id"]>("all");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const close = useCallback(() => setActiveIndex(null), []);
  const setIndex = useCallback((index: number) => setActiveIndex(index), []);

  useEffect(() => {
    let cancelled = false;
    getSanityClient()
      .fetch<GalleryDocument[]>(galleryArchiveQuery)
      .then((data) => {
        console.log("Sanity gallery:", data);
        if (cancelled) return;
        setImages(galleryFromDocuments(data));
        setStatus("ready");
      })
      .catch((error) => {
        console.log("Sanity gallery:", error);
        if (cancelled) return;
        setImages([]);
        setStatus("ready");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const visible = images.filter((image) => filter === "all" || image.category === filter);

  return (
    <section className="scroll-mt-24 py-16 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-brand-dark sm:text-5xl">Gallery</h1>
          <p className="mt-3 text-base text-slate-600 sm:text-lg">
            Photos from prayers, gatherings, Eid, and the masjid.
          </p>
        </div>

        <div
          className="mt-8 flex flex-wrap items-center justify-center gap-2"
          role="toolbar"
          aria-label="Filter gallery by category"
        >
          {filters.map((item) => {
            const selected = filter === item.id;
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={selected}
                onClick={() => {
                  setFilter(item.id);
                  setActiveIndex(null);
                }}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal ${
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

        {status === "loading" ? (
          <p className="mx-auto mt-10 max-w-xl rounded-3xl border border-slate-200 bg-white px-5 py-6 text-center text-slate-600">
            Loading gallery photos…
          </p>
        ) : visible.length === 0 ? (
          <p className="mx-auto mt-10 max-w-xl rounded-3xl border border-dashed border-slate-300 bg-white px-5 py-6 text-center text-slate-600">
            No photos in this category yet.
          </p>
        ) : (
          <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((image, index) => {
              const dateLabel = formatGalleryDate(image.date);
              return (
                <li key={image._id}>
                  <button
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className="flex h-full w-full flex-col rounded-3xl border border-slate-200/80 bg-white p-3 text-left shadow-sm transition hover:border-slate-300 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                  >
                    <span className="flex items-center justify-center overflow-hidden rounded-2xl bg-slate-100">
                      <img
                        src={image.imageUrl}
                        alt={image.title}
                        className="block h-auto max-h-[420px] w-full object-contain"
                        loading="lazy"
                      />
                    </span>
                    <span className="px-2 pb-2 pt-4">
                      <span className="block text-xs font-bold uppercase tracking-wide text-slate-500">
                        {galleryCategoryLabel(image.category)}
                      </span>
                      <span className="mt-1 block text-lg font-semibold text-slate-900">{image.title}</span>
                      {dateLabel ? (
                        <span className="mt-1 block text-sm text-slate-600">{dateLabel}</span>
                      ) : null}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      {activeIndex !== null ? (
        <GalleryLightbox images={visible} index={activeIndex} onClose={close} onIndex={setIndex} />
      ) : null}
    </section>
  );
}
