"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";

const SearchContext = createContext<
  | {
      query: string;
      setQuery: (val: string) => void;
      isLoading: boolean;
      debouncedQuery: string;
    }
  | undefined
>(undefined);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [isLoading] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const trimmed = query.trim();
      setDebouncedQuery(trimmed);

      const params = new URLSearchParams();
      if (trimmed) params.set("q", trimmed);
      else params.delete("q");

      router.replace(`/?${params.toString()}`);
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <SearchContext.Provider
      value={{ query, setQuery, isLoading, debouncedQuery }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useSearch must be used inside SearchProvider");
  return ctx;
};
