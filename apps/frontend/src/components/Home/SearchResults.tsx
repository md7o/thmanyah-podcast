"use client";

import { fetchPodcasts, Podcast, Episode, fetchEpisodes } from "@/src/lib/api";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface SearchResultsProps {
  searchQuery: string;
}

export default function SearchResults({ searchQuery }: SearchResultsProps) {
  const [podcastResults, setPodcastResults] = useState<Podcast[]>([]);
  const [episodeResults, setEpisodeResults] = useState<Episode[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!searchQuery) return;

    setIsLoading(true);

    const searchAll = async () => {
      try {
        // Fetch podcasts and episodes in parallel
        const [podcasts, episodes] = await Promise.all([
          fetchPodcasts(searchQuery),
          fetchEpisodes(searchQuery), // You'll need to create this function
        ]);

        setPodcastResults(podcasts);
        setEpisodeResults(episodes);
      } catch (err) {
        console.error("Failed to fetch search results:", err);
      } finally {
        setIsLoading(false);
      }
    };

    searchAll();
  }, [searchQuery]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 animate-fade-in">
        <div className="w-14 h-14 border-2 border-t-bg1 border-gray-300 rounded-full animate-spin" />
      </div>
    );
  }

  const hasResults = podcastResults.length > 0 || episodeResults.length > 0;

  if (!hasResults) {
    return (
      <div className="flex justify-center items-center h-screen px-5 text-white animate-fade-in">
        <h3>No results found for "{searchQuery}".</h3>
      </div>
    );
  }

  return (
    <div className="mt-10 px-5">
      <h3 className="text-white text-lg mb-6">
        Search results for "{searchQuery}"
      </h3>

      {/* Podcasts Section */}
      {podcastResults.length > 0 && (
        <div className="mb-10">
          <h4 className="text-white text-md mb-4">Podcasts</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {podcastResults.map((podcast) => (
              <Link
                key={podcast.itunes_id}
                href={`/podcast/${podcast.itunes_id}`}
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
      )}

      {/* Episodes Section */}
      {episodeResults.length > 0 && (
        <div>
          <h4 className="text-white text-md mb-4">Episodes</h4>
          <div className="space-y-3">
            {episodeResults.map((episode) => (
              <Link
                key={episode.id}
                href={`/episode/${episode.id}`}
                className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded"
              >
                <div className="relative w-16 h-16 flex-shrink-0">
                  <Image
                    src={episode.imageUrl ?? "/file.svg"}
                    alt={episode.title}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover rounded-xSmall"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-sm font-semibold text-white truncate">
                    {episode.title}
                  </h2>
                  <p className="text-xs text-gray-400 truncate">
                    {episode.title || "Unknown Podcast"}
                  </p>
                  <p className="text-xs text-pink-400 truncate">
                    {new Date(episode.pubDate).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
