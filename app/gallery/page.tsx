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
    { name: "/images/birdeyeview.jpeg", categories: ["Masjid","Location"] },
    { name: "/images/eidgoodies.jpg", categories: ["Events","Community"] },
    { name: "/images/meneidsalah.jpg", categories: ["Masjid"] },
    { name: "/images/iftar20252.jpg", categories: ["Events","Community","Recreation Center"] },
    { name: "/images/grills.jpg", categories: ["Events","Recreation Center"] },
    { name: "/images/iftar20251.jpg", categories: ["Events","Community","Recreation Center"] },
    { name: "/images/bonfire.jpg", categories: ["Recreation Center"] },
    { name: "/images/parkinggathering.jpg", categories: ["Community"] },
    { name: "/images/gravelvolunteer.jpg", categories: ["Community"] },
    { name: "/images/menoccupied.jpg", categories: ["Masjid"] },
    { name: "/images/sistersgreencarpet.jpg", categories: ["Masjid"] },
    { name: "/images/menpraying.jpg", categories: ["Masjid"] },
    { name: "/images/sistersentrance.jpg", categories: ["Masjid"] },
    { name: "/images/snowyday.jpg", categories: ["Masjid","Location"] },
    { name: "/images/zplextrip.jpg", categories: ["Events","Community"] },
    { name: "/images/zaddowparktrip.jpg", categories: ["Events","Community"] },
    { name: "/images/quranclass.jpg", categories: ["Masjid"] },
    { name: "/images/kidsondoodleboard.jpg", categories: ["Masjid","Community"] },
    { name: "/images/kidswritingboard.jpg", categories: ["Masjid","Community"] },
    { name: "/images/kidsplayingpatio1.jpg", categories: ["Community","Recreation Center"] },
    { name: "/images/kidsplayingpatio2.jpg", categories: ["Community","Recreation Center"] },
    { name: "/images/playingpool.jpg", categories: ["Community","Recreation Center"] },
    { name: "/images/bbq.jpg", categories: ["Events","Community","Recreation Center"] },
    { name: "/images/bbq2.jpg", categories: ["Events","Community","Recreation Center"] },
    { name: "/images/kidsplayingbasketball1.jpg", categories: ["Community","Recreation Center"] },
    { name: "/images/kidsplayingbasketball2.jpg", categories: ["Community","Recreation Center"] },
    { name: "/images/hadithreading.jpg", categories: ["Masjid"] },
    { name: "/images/pooltable.jpeg", categories: ["Recreation Center"] },
    { name: "/images/foosball.jpg", categories: ["Recreation Center"] },
    { name: "/images/basketball.jpg", categories: ["Recreation Center"] },
    { name: "/images/centergym1.jpg", categories: ["Recreation Center"] },
    { name: "/images/centergym2.jpg", categories: ["Recreation Center"] },
    { name: "/images/centergym3.jpg", categories: ["Recreation Center"] },
    { name: "/images/kidsplayingfront.jpg", categories: ["Community"] },
    { name: "/images/kidsplayingsandbox.jpg", categories: ["Community","Recreation Center"] },
    { name: "/images/inflatable.jpg", categories: ["Masjid"] },
    { name: "/images/iftar2024.jpg", categories: ["Events","Community","Recreation Center"] },
    { name: "/images/toyroom.jpeg", categories: ["Masjid","Recreation Center"] },
    { name: "/images/centerevent.jpg", categories: ["Events","Community","Recreation Center"] },
    { name: "/images/sisterscarpetvolunteer1.jpg", categories: ["Masjid","Community"] },
    { name: "/images/clock.jpeg", categories: ["Masjid"] },
    { name: "/images/parking1.jpeg", categories: ["Location"] },
    { name: "/images/parking2.jpg", categories: ["Location"] },
    { name: "/images/frontducks.jpg", categories: ["Masjid","Location"] },
    { name: "/images/frontdoorwashvolunteer.jpg", categories: ["Masjid","Community"] },
    { name: "/images/centergymvolunteer.jpg", categories: ["Community","Recreation Center"] },
    { name: "/images/centeroutsidevolunteer.jpg", categories: ["Community","Recreation Center"] },
    { name: "/images/earlydayslectures.jpg", categories: ["Masjid","Events"] },
    { name: "/images/earlydaysjummah.jpeg", categories: ["Masjid"] },
    { name: "/images/fencevolunteer.jpg", categories: ["Community"] },
    { name: "/images/menold.jpg", categories: ["Masjid"] },
    { name: "/images/sistersoldcarpet.jpg", categories: ["Masjid"] },
    { name: "/images/menraw.jpg", categories: ["Masjid"] },
    { name: "/images/front.jpeg", categories: ["Masjid","Location"] },
    { name: "/images/sunset.jpeg", categories: ["Location"] },
    { name: "/images/entrance.jpeg", categories: ["Location"] },
    { name: "/images/centerraw.jpeg", categories: ["Recreation Center"] },
    { name: "/images/jummah.jpg", categories: ["Events","Flyers"] },
    { name: "/images/firstsaturdaylecture.jpg", categories: ["Events","Flyers"] },
    { name: "/images/perimeterinstructions.png", categories: ["Flyers"] },
    { name: "/images/recreationcenter.png", categories: ["Recreation Center","Flyers"] },
    { name: "/images/jointeid2024.png", categories: ["Flyers"] }
  ];

  function categoryClass(category: GalleryCategories) {
    return activeCategory === category
      ? "text-blue-700 hover:text-white border border-blue-600 bg-white hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-full text-base font-medium px-5 py-2.5 text-center me-3 mb-3 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:bg-gray-900 dark:focus:ring-blue-800"
      : "text-gray-900 border border-white hover:border-gray-200 dark:border-gray-900 dark:bg-gray-900 dark:hover:border-gray-700 bg-white focus:ring-4 focus:outline-none focus:ring-gray-300 rounded-full text-base font-medium px-5 py-2.5 text-center me-3 mb-3 dark:text-white dark:focus:ring-gray-800";
  }

  return (
    <div className="pt-20">
    <div className="mx-auto max-w-screen-sm text-center">
      <a
        href="/"
        className="inline-flex text-white bg-primary-600 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4"
        >
        Back to Homepage
      </a>
    </div>
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
