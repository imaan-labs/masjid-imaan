"use client";

import { useEffect, useState } from "react";
import FlyerBoardIsland from "@/src/components/FlyerBoardIsland";
import {
  flyersFromDocuments,
  flyersQuery,
  getSanityClient,
  type Flyer,
  type FlyerDocument,
} from "@/src/lib/sanity";

export default function FlyerBoard({
  limit,
  previewOnly = false,
}: {
  limit?: number;
  previewOnly?: boolean;
}) {
  const [flyers, setFlyers] = useState<Flyer[]>([]);
  const [status, setStatus] = useState<"loading" | "ready">("loading");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const categoryParam = params.get("category");
    if (categoryParam) {
      setSelectedCategory(categoryParam.toLowerCase());
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    getSanityClient()
      .fetch<FlyerDocument[]>(flyersQuery)
      .then((data) => {
        console.log("Sanity flyers:", data);
        if (cancelled) return;
        setFlyers(flyersFromDocuments(data));
        setStatus("ready");
      })
      .catch((error) => {
        console.log("Sanity flyers:", error);
        if (cancelled) return;
        setFlyers([]);
        setStatus("ready");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <FlyerBoardIsland
      flyers={flyers}
      status={status}
      limit={limit}
      previewOnly={previewOnly}
      initialCategory={selectedCategory}
    />
  );
}
