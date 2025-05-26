"use client";

import {
  fetchPodcasts,
  fetchEpisodesByPodcastId,
  Podcast,
  Episode,
} from "@/src/lib/api";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import EpisdosDropDown from "./DropDownButtons/episdosDropDown";

export default function TopEpisodes() {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        setIsLoading(true);
        // First fetch podcasts (assuming "فنجان" is the podcast we want)
        const podcasts = await fetchPodcasts("فنجان");
        if (podcasts.length > 0) {
          // Then fetch episodes for the first podcast found
          const eps = await fetchEpisodesByPodcastId(podcasts[0].id);
          // Take first 16 episodes
          setEpisodes(eps.slice(0, 16));
        }
      } catch (err) {
        console.error("Error fetching episodes:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEpisodes();
  }, []);

  useEffect(() => {
    const hasAnimated = sessionStorage.getItem("topEpisodesAnimated");

    if (!isLoading && episodes.length > 0 && !hasAnimated) {
      sessionStorage.setItem("topEpisodesAnimated", "true");

      requestAnimationFrame(() => {
        const targets = cardsRef.current.filter(Boolean);
        gsap.fromTo(
          targets,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            ease: "power2.out",
            stagger: 0.04,
            duration: 0.5,
          }
        );
      });
    }
  }, [isLoading, episodes]);

  if (isLoading) {
    return (
      <div className="mt-10 px-5">
        <h3 className="pb-5 text-white">جاري تحميل الحلقات...</h3>
        <div className="grid grid-cols-3 gap-4">
          {[...Array(16)].map((_, i) => (
            <div key={i} className="group rounded-xSmall p-3 animate-pulse">
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
      <div className="flex justify-between items-center px-5">
        <h3 className="pb-5 text-white">أفضل حلقات لفنجان</h3>
      </div>
      <div className="border-b-[0.5px] border-layoutLine" />

      <div className="relative">
        <div className="grid md:grid-cols-3 grid-cols-1 gap-x-2 md:px-5 py-5">
          {episodes.map((episode, index) => (
            <div
              key={episode.id}
              className="group border-b border-layoutLine"
              ref={(el) => {
                if (el) cardsRef.current[index] = el;
              }}
            >
              <div className="w-full flex justify-between items-center py-3 rounded-xSmall hover:bg-active duration-300 px-3">
                <Link
                  href={`/podcast/${episode.id}`}
                  className="flex items-center flex-1 gap-3 min-w-0"
                >
                  <div className="flex-shrink-0 w-10 h-10 relative">
                    <Image
                      src={episode.imageUrl ?? "/file.svg"}
                      alt={episode.title}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover rounded-xSmall"
                    />
                  </div>
                  <div className="flex flex-col min-w-0 w-full">
                    <h2 className="text-sm truncate w-full">{episode.title}</h2>
                    <p className="text-xs text-pink-400 truncate w-full">
                      {new Date(episode.pubDate).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
                <EpisdosDropDown />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
