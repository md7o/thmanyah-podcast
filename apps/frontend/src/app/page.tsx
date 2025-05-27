"use client";

import TopEpisods from "../components/Home/TopEpisods";
import TopPodcasts from "../components/Home/TopPodcasts";
import SearchResults from "../components/Home/SearchResults";
import { useSearch } from "@/src/hooks/use-search";

export default function Home() {
  const { debouncedQuery } = useSearch();

  if (debouncedQuery) {
    return <SearchResults searchQuery={debouncedQuery} />;
  }

  return (
    <>
      <TopPodcasts />
      <TopEpisods />
    </>
  );
}
