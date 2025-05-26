import axios from "axios";

export interface Podcast {
  id: number;
  itunes_id: number;
  title: string;
  description?: string;
  publisher?: string;
  image_url: string;
  itunes_url: string;
}

export async function fetchPodcasts(term: string): Promise<Podcast[]> {
  try {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_API_URL +
        `/search?term=${encodeURIComponent(term)}`
    );
    return response.data || [];
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return [];
    }

    console.error("Error fetching podcasts:", error);
    throw new Error("Failed to fetch podcasts");
  }
}

export async function fetchPodcastById(id: number): Promise<Podcast | null> {
  try {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_API_URL + `/search?id=${id}`
    );
    return response.data || null;
  } catch (error) {
    console.error("Error fetching podcast by id:", error);
    return null;
  }
}
// interface
export interface Episode {
  id: number;
  title: string;
  description?: string;
  audioUrl: string;
  pubDate: string;
  imageUrl?: string;
}

export async function fetchEpisodes(searchTerm: string): Promise<Episode[]> {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/search/episodes?term=${encodeURIComponent(searchTerm)}`
    );
    return response.data || [];
  } catch (error) {
    console.error("Error searching episodes:", error);
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return [];
    }
    throw new Error("Failed to search episodes");
  }
}
export async function fetchEpisodesByPodcastId(
  podcastId: number
): Promise<Episode[]> {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/search/podcast/${podcastId}/episodes`
    );
    return response.data || [];
  } catch (error) {
    console.error("Error fetching episodes:", error);
    return [];
  }
}
