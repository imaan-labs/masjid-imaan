"use client";

import { useState } from "react";
import Image from "next/image";

type GalleryCategories = "Location" | "Events" | "Center" | "Community" | "All";

interface GalleryData {
  name: string;
  categories: GalleryCategories[];
}

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] =
    useState<GalleryCategories>("All");
  const categories: GalleryCategories[] = [
    "All",
    "Location",
    "Events",
    "Center",
  ];
  const gallery: GalleryData[] = [
    { name: "/images/location-bird-eye-view.jpeg", categories: ["Location"] },
    { name: "/images/masjid-front.jpeg", categories: ["Location"] },
    { name: "/images/men_full.jpg", categories: ["Location"] },
    { name: "/images/men_full2.jpg", categories: ["Location"] },
    { name: "/images/masjid-sisters.jpg", categories: ["Location"] },
    { name: "/images/new_sisters.jpg", categories: ["Location"] },
    { name: "/images/iftar.jpg", categories: ["Location"] },
    { name: "/images/backyard-sunset.jpeg", categories: ["Location"] },
    { name: "/images/bonfire.jpg", categories: ["Location"] },
    { name: "/images/entrance.jpeg", categories: ["Location"] },
    { name: "/images/snowy_day.jpg", categories: ["Location"] },
    { name: "/images/masjid-mens-old.jpg", categories: ["Location"] },
    { name: "/images/center-1.jpeg", categories: ["Center"] },
    /*{ name: "/images/masjid-clock.jpeg", categories: ["Location"] },
    { name: "/images/masjid-parking-1.jpeg", categories: ["Location"] },
    { name: "/images/masjid-sisters-1.jpeg", categories: ["Location"] },
    { name: "/images/center-3.jpeg", categories: ["Center"] },
    { name: "/images/center-4.jpeg", categories: ["Center"] },
    { name: "/images/backyard-day-1.jpeg", categories: ["Location"] },
    { name: "/images/backyard-sunset-1.jpeg", categories: ["Location"] },
    { name: "/images/backyard-sunset-2.jpeg", categories: ["Location"] },
    { name: "/images/backyard-sunset-3.jpeg", categories: ["Location"] },
    { name: "/images/bayan-3-9-24.jpeg", categories: ["Events"] },
    { name: "/images/carpet-mens.jpeg", categories: ["Location"] },
    { name: "/images/center-2.jpeg", categories: ["Center"] },
    { name: "/images/firstkhutba.jpeg", categories: ["Events"] },
    { name: "/images/firstsaturdaylecture.jpeg", categories: ["Events"] },
    { name: "/images/janmaz.jpeg", categories: ["Location"] },
    { name: "/images/jumah-1.jpeg", categories: ["Community"] },
    { name: "/images/masjid-mens.jpeg", categories: ["Location"] },*/
  ];

  function categoryClass(category: GalleryCategories) {
    return activeCategory === category
      ? "text-blue-700 hover:text-white border border-blue-600 bg-white hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-full text-base font-medium px-5 py-2.5 text-center me-3 mb-3 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:bg-gray-900 dark:focus:ring-blue-800"
      : "text-gray-900 border border-white hover:border-gray-200 dark:border-gray-900 dark:bg-gray-900 dark:hover:border-gray-700 bg-white focus:ring-4 focus:outline-none focus:ring-gray-300 rounded-full text-base font-medium px-5 py-2.5 text-center me-3 mb-3 dark:text-white dark:focus:ring-gray-800";
  }

  return (
    <div className="pt-20">
      <div className="flex items-center justify-center py-4 md:py-8 flex-wrap">
        {categories.map((category, index) => (
          <button
            key={index}
            type="button"
            className={categoryClass(category)}
            onClick={() =>
              activeCategory === category ? null : setActiveCategory(category)
            }
          >
            {category}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap justify-evenly items-center gap-4">
        {gallery
          .filter(
            (picture) =>
              activeCategory === "All" ||
              picture.categories.includes(activeCategory)
          )
          .map((gallery, index) => (
            <div key={index}>
              <Image
                className="max-w-full rounded-lg h-75"
                src={gallery.name}
                alt={gallery.name}
                width={350}
                height={350}
              />
            </div>
          ))}
      </div>
    </div>
  );
}
