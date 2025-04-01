"use client";

import { useState } from "react";
import Image from "next/image";

type GalleryCategories = "Masjid" | "Location" | "Events" | "Recreation Center" | "Community" | "Flyers" | "All";

interface GalleryData {
  name: string;
  categories: GalleryCategories[];
}

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] =
    useState<GalleryCategories>("All");
  const categories: GalleryCategories[] = [
    "All",
    "Masjid",
    "Location",
    "Events",
    "Recreation Center",
    "Community",
    "Flyers"
  ];
  const gallery: GalleryData[] = [
    { name: "/images/birdeyeview.jpeg", categories: ["Location"] },
    { name: "/images/meneidsalah.jpg", categories: ["Masjid"] },
    { name: "/images/front.jpeg", categories: ["Location"] },
    { name: "/images/menoccupied.jpg", categories: ["Masjid"] },
    { name: "/images/menpraying.jpg", categories: ["Masjid"] },
    { name: "/images/earlydaysjummah.jpg", categories: ["Masjid"] },
    { name: "/images/menold.jpg", categories: ["Masjid"] },
    { name: "/images/menraw.jpg", categories: ["Masjid"] },
    { name: "/images/sistersentrance.jpg", categories: ["Masjid"] },
    { name: "/images/sistersnewcarpet.jpg", categories: ["Masjid"] },
    { name: "/images/sistersoldcarpet.jpg", categories: ["Masjid"] },
    { name: "/images/iftar20252.jpg", categories: ["Events"] },
    { name: "/images/iftar20251.jpg", categories: ["Events"] },
    { name: "/images/iftar2024.jpg", categories: ["Events"] },
    { name: "/images/playingpool.jpg", categories: ["Community"] },
    { name: "/images/kidsplayingfront.jpg", categories: ["Community"] },
    { name: "/images/kidswritingboard.jpg", categories: ["Community"] },
    { name: "/images/parkinggathering.jpg", categories: ["Community"] },
    { name: "/images/sunset.jpeg", categories: ["Location"] },
    { name: "/images/bonfire.jpg", categories: ["Recreation Center"] },
    { name: "/images/entrance.jpeg", categories: ["Location"] },
    { name: "/images/snowyday.jpg", categories: ["Location"] },
    { name: "/images/centergym1.jpg", categories: ["Recreation Center"] },
    { name: "/images/centergym2.jpg", categories: ["Recreation Center"] },
    { name: "/images/pooltable.jpeg", categories: ["Recreation Center"] },
    { name: "/images/eliptical.jpeg", categories: ["Recreation Center"] },
    { name: "/images/toyroom.jpeg", categories: ["Recreation Center"] },
    { name: "/images/fooseball.jpeg", categories: ["Recreation Center"] },
    { name: "/images/grills.jpeg", categories: ["Recreation Center"] },
    { name: "/images/basketball.jpeg", categories: ["Recreation Center"] },
    { name: "/images/parking1.jpeg", categories: ["Location"] },
    { name: "/images/parking2.jpeg", categories: ["Location"] },
    { name: "/images/eidgoodies.jpg", categories: ["Community"] },
    { name: "/images/bbq.jpg", categories: ["Community"] },
    { name: "/images/inflatable.jpg", categories: ["Masjid"] },
    { name: "/images/gravelvolunteer.jpg", categories: ["Community"] },
    { name: "/images/sisterscarpervolunteer.jpg", categories: ["Community"] },
    { name: "/images/centergymvolunteer.jpg", categories: ["Community"] },
    { name: "/images/centeroutsidevolunteer.jpg", categories: ["Community"] },
    { name: "/images/centerraw.jpg", categories: ["Recreation Center"] },
    { name: "/images/clock.jpeg", categories: ["Masjid"] },
    { name: "/images/perimeterinstructions.png", categories: ["Flyers"] },
    { name: "/images/recreationcenter.png", categories: ["Flyers"] }
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
      <div className="mx-auto max-w-screen-sm text-center">
        <a
          href="/"
          className="inline-flex text-white bg-primary-600 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4"
          >
          Back to Homepage
        </a>
      </div>
    </div>
  );
}
