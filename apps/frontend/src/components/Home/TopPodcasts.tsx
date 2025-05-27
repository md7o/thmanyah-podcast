"use client";

import { fetchPodcasts, Podcast } from "@/src/lib/api";
import { useEffect, useState, useRef } from "react";
import LayoutDropDown from "./DropDownButtons/layoutDropDown";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";

export default function TopPodcasts() {
  const [results, setResults] = useState<Podcast[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [clickedPodcastId, setClickedPodcastId] = useState<number | null>(null);

  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchPodcasts("فنجان");
        setResults(data);
        cardsRef.current = [];
      } catch (error) {
        console.error("Failed to fetch podcasts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!isLoading && results.length > 0) {
      gsap.fromTo(
        cardsRef.current,
        { opacity: 0, x: -50 },
        {
          opacity: 1,

          x: 0,
          ease: "power2.out",
          duration: 0.7,
          stagger: 0.1,
        }
      );
    }
  }, [isLoading, results]);

  if (isLoading) {
    return (
      <div className="mt-10 px-5">
        <div className="flex justify-between items-center">
          <h3 className="pb-5 text-white">Loading podcasts...</h3>
        </div>
        <div className="border-b-[0.5px] border-layoutLine" />
        <div className="flex gap-4 py-4 overflow-x-auto overflow-y-hidden">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-52 animate-pulse">
              <div className="w-full h-52 bg-gray-700 rounded-md mb-4" />
              <div className="h-4 bg-gray-700 rounded mb-2" />
              <div className="h-3 bg-gray-700 rounded w-3/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-10">
      {clickedPodcastId && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 animate-fade-in">
          <div className="w-14 h-14 border-2 border-t-bg1 border-gray-300 rounded-full animate-spin" />
        </div>
      )}
      <div className="flex justify-between items-center px-5">
        <h3 className="pb-5">أفضل البودكاستات لفنجان</h3>
        <LayoutDropDown
          currentLayout="scroll"
          availableLayouts={["scroll", "grid"]}
        />
      </div>
      <div className="border-b-[0.5px] border-layoutLine" />

      <div className="relative">
        <div className="overflow-x-auto py-4">
          <div className="flex gap-4 px-5 pb-2">
            {results.map((podcast, index) => (
              <div
                key={podcast.itunes_id}
                ref={(el) => {
                  if (el) cardsRef.current[index] = el;
                }}
                className="flex-shrink-0 w-52"
              >
                <Link
                  href={`/podcast/${podcast.itunes_id}`}
                  onClick={() => setClickedPodcastId(podcast.itunes_id)}
                  className="text-white group block hover:scale-[1.02] transition-transform duration-300"
                  aria-label={`View ${podcast.title} podcast`}
                >
                  <div className="relative">
                    <Image
                      src={podcast.image_url ?? "/file.svg"}
                      alt={podcast.title}
                      width={200}
                      height={200}
                      className="w-full h-auto object-cover rounded-md mb-4 group-hover:opacity-90 transition-opacity"
                      priority={index < 3}
                    />
                  </div>
                  <h2 className="text-sm font-bold mb-1 truncate">
                    {podcast.title}
                  </h2>
                  <p className="text-xs text-gray-400 truncate">
                    {podcast.publisher}
                  </p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
