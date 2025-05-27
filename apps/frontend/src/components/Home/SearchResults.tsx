"use client";

import { fetchPodcasts, Podcast } from "@/src/lib/api";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface SearchResultsProps {
  searchQuery: string;
}

export default function SearchResults({ searchQuery }: SearchResultsProps) {
  const [results, setResults] = useState<Podcast[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [clickedPodcastId, setClickedPodcastId] = useState<number | null>(null);

  useEffect(() => {
    if (!searchQuery) return;

    setIsLoading(true);
    fetchPodcasts(searchQuery)
      .then(setResults)
      .catch((err) => console.error("Failed to fetch search results:", err))
      .finally(() => setIsLoading(false));
  }, [searchQuery]);

  const skeletons = Array.from({ length: 10 });

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 animate-fade-in">
        <div className="w-14 h-14 border-2 border-t-bg1 border-gray-300 rounded-full animate-spin" />
      </div>
    );
  }

  if (!results.length || !results) {
    return (
      <div className="flex justify-center items-center h-screen px-5 text-white animate-fade-in">
        <h3>No results found for "{searchQuery}".</h3>
      </div>
    );
  }

  return (
    <div className="mt-10 px-5">
      {clickedPodcastId && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 animate-fade-in">
          <div className="w-14 h-14 border-2 border-t-bg1 border-gray-300 rounded-full animate-spin" />
        </div>
      )}
      <h3 className="text-white text-lg mb-6">
        Search results for "{searchQuery}"
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5 animate-fade-in">
        {results.map((podcast) => (
          <Link
            key={podcast.itunes_id}
            href={`/podcast/${podcast.itunes_id}`}
            onClick={() => setClickedPodcastId(podcast.itunes_id)}
            className="group"
          >
            <div className="relative aspect-square">
              <Image
                src={podcast.image_url ?? "/file.svg"}
                alt={podcast.title}
                width={200}
                height={200}
                className="w-full h-full object-cover rounded-xSmall"
              />
            </div>
            <h2 className="text-sm font-semibold text-white mt-2 truncate">
              {podcast.title}
            </h2>
            {podcast.publisher && (
              <p className="text-xs text-pink-400 truncate">
                {podcast.publisher}
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
