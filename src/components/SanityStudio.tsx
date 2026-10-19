"use client";

import { useEffect, useRef } from "react";
import { renderStudio } from "sanity";
import config from "@/sanity.config";

export default function SanityStudio() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    return renderStudio(element, config, { basePath: "/admin" });
  }, []);

  return <div ref={root} className="h-full w-full" />;
}
