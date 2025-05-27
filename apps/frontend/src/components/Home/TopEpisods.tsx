"use client";

import { fetchPodcasts, Podcast } from "@/src/lib/api";
import { useEffect, useRef, useState } from "react";
import EpisdosDropDown from "./DropDownButtons/episdosDropDown";
import LayoutDropDown from "./DropDownButtons/layoutDropDown";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";

export default function TopEpisods() {
  const [results, setResults] = useState<Podcast[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const [clickedPodcastId, setClickedPodcastId] = useState<number | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        setIsLoading(true);
        const data = await fetchPodcasts("فنجان");
        setResults(data);
        cardsRef.current = [];
      } catch (err) {
        console.error("Error fetching podcasts:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, []);

  useEffect(() => {
    if (!isLoading && results.length > 0) {
      gsap.fromTo(
        cardsRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,

          y: 0,
          ease: "power2.out",
          stagger: 0.04,
          duration: 0.5,
        }
      );
    }
  }, [isLoading, results]);

  // useEffect(() => {
  //   const hasAnimated = sessionStorage.getItem("topEpisodesAnimated");

  //   if (!isLoading && results.length > 0 && !hasAnimated) {
  //     sessionStorage.setItem("topEpisodesAnimated", "true");

  //     requestAnimationFrame(() => {
  //       const targets = cardsRef.current.filter(Boolean);
  //       gsap.fromTo(
  //         targets,
  //         { opacity: 0, y: 50 },
  //         {
  //           opacity: 1,
  //           y: 0,
  //           ease: "power2.out",
  //           stagger: 0.04,
  //           duration: 0.5,
  //         }
  //       );
  //     });
  //   }
  // }, [isLoading, results]);

  if (isLoading) {
    return (
      <div className="mt-10 px-5">
        <div className="flex justify-between items-center">
          <h3 className="pb-5 text-white">Loading podcasts...</h3>
        </div>
        <div className="border-b-[0.5px] border-layoutLine mb-5" />

        <div className="grid grid-cols-3 gap-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="group rounded-xSmall p-3 animate-pulse ">
              <div className="flex items-center gap-1">
                <div className="w-10 h-10 bg-zinc-700 rounded-xSmall" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-3/4 bg-zinc-700 rounded" />
                  <div className="h-2 w-1/2 bg-zinc-700 rounded" />
                </div>
              </div>
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
        <h3 className="pb-5 text-white">أفضل الحلقات لفنجان</h3>
        <LayoutDropDown currentLayout="compact" />
      </div>
      <div className="border-b-[0.5px] border-layoutLine" />

      <div className="relative">
        <div className="grid md:grid-cols-3 grid-cols-1 gap-x-2 md:px-5 py-5">
          {results.map((podcast, index) => (
            <div
              key={podcast.id}
              className="group border-b border-layoutLine  "
              ref={(el) => {
                if (el) cardsRef.current[index] = el;
              }}
            >
              <Link
                href={`/podcast/${podcast.itunes_id}`}
                onClick={() => setClickedPodcastId(podcast.itunes_id)}
                className="flex justify-between items-center py-3 rounded-xSmall hover:bg-active duration-300"
              >
                <div className="flex items-center flex-1 gap-3 min-w-0 px-3">
                  <div className="flex-shrink-0 w-10 h-10 relative">
                    <Image
                      src={podcast.image_url ?? "/file.svg"}
                      alt={podcast.title}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover rounded-xSmall"
                    />
                  </div>

                  <div className="flex flex-col min-w-0 w-full">
                    <h2 className="text-sm truncate w-full ">
                      {podcast.title}
                    </h2>
                    <p className="text-xs text-pink-400 truncate w-full">
                      {podcast.publisher}
                    </p>
                  </div>
                </div>

                <div
                  className="flex-shrink-0"
                  onClick={(e) => e.preventDefault()}
                >
                  <EpisdosDropDown />
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
