"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import GalleryLightbox from "@/src/components/GalleryLightbox";
import {
  galleryCarouselQuery,
  galleryCategoryLabel,
  galleryFromDocuments,
  getSanityClient,
  type GalleryDocument,
  type GalleryImage,
} from "@/src/lib/sanity";

export default function GalleryCarousel() {
  const headingId = useId();
  const scrollerRef = useRef<HTMLUListElement>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const close = useCallback(() => setActiveIndex(null), []);
  const setIndex = useCallback((index: number) => setActiveIndex(index), []);

  useEffect(() => {
    let cancelled = false;
    getSanityClient()
      .fetch<GalleryDocument[]>(galleryCarouselQuery)
      .then((data) => {
        console.log("Sanity gallery:", data);
        if (cancelled) return;
        setImages(galleryFromDocuments(data));
      })
      .catch((error) => {
        console.log("Sanity gallery:", error);
        if (!cancelled) setImages([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const updateEnds = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    setAtStart(scroller.scrollLeft <= 4);
    setAtEnd(scroller.scrollLeft + scroller.clientWidth >= scroller.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateEnds();
  }, [images, updateEnds]);

  function scrollByCard(direction: number) {
    const scroller = scrollerRef.current;
    const card = scroller?.querySelector("li");
    if (!scroller || !card) return;
    const styles = getComputedStyle(scroller);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || "0") || 0;
    scroller.scrollBy({
      left: direction * (card.getBoundingClientRect().width + gap),
      behavior: "smooth",
    });
  }

  return (
    <section aria-labelledby={headingId} className="scroll-mt-24">
      <div className="mx-auto w-full max-w-7xl px-4 pb-4 pt-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">COMMUNITY MOMENTS</p>
            <h2 id={headingId} className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Life at Imaan Masjid
            </h2>
            <p className="mt-3 text-base leading-7 text-slate-600">
              Capturing our gatherings, prayers, and milestones together.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Previous photos"
              disabled={atStart}
              onClick={() => scrollByCard(-1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-lg font-bold text-slate-900 shadow-sm hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <span aria-hidden="true">&lt;</span>
            </button>
            <button
              type="button"
              aria-label="Next photos"
              disabled={atEnd}
              onClick={() => scrollByCard(1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-lg font-bold text-slate-900 shadow-sm hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <span aria-hidden="true">&gt;</span>
            </button>
          </div>
        </div>

        <ul
          ref={scrollerRef}
          onScroll={updateEnds}
          className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2"
        >
          {images.map((image, index) => (
            <li key={image._id} className="snap-start">
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                className="group relative h-56 w-72 flex-shrink-0 cursor-pointer overflow-hidden rounded-2xl shadow-sm sm:w-80"
              >
                <img
                  src={image.imageUrl}
                  alt={image.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <span className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-slate-950/80 via-slate-950/15 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                  <span className="w-fit rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-800">
                    {galleryCategoryLabel(image.category)}
                  </span>
                  <span className="mt-2 text-sm font-semibold text-white">{image.title}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>

        <Link
          href="/gallery"
          className="mt-6 inline-flex rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
        >
          View All Photos & Full Gallery →
        </Link>
      </div>
      {activeIndex !== null ? (
        <GalleryLightbox images={images} index={activeIndex} onClose={close} onIndex={setIndex} />
      ) : null}
    </section>
  );
}
