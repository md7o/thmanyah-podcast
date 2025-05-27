import { notFound } from "next/navigation";
import { fetchPodcastById } from "@/src/lib/api";
import Image from "next/image";

interface PodcastPageProps {
  params: {
    id: string;
  };
}

export default async function PodcastPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const podcastId = Number(id);

  if (isNaN(podcastId)) return notFound();

  const podcast = await fetchPodcastById(podcastId);
  if (!podcast) return notFound();

  return (
    <div className="container mx-auto px-10 py-8 max-w-6xl animate-fade-in">
      <div className="flex md:flex-row flex-col gap-8 items-start">
        <div className="flex md:flex-col flex-row md:mx-0 w-full md:w-auto">
          <div className="relative w-auto md:w-60">
            <Image
              src={podcast.image_url}
              alt={podcast.title}
              width={150}
              height={150}
              className="md:w-full w-52 object-cover rounded-small"
              priority
            />
          </div>
          <div className="mt-5 md:mx-0 mx-5">
            <h1 className="text-lg md:text-xl font-bold text-white mb-2">
              {podcast.title}
            </h1>
            <p className="text-pink-400 mb-4">{podcast.publisher}</p>
            {podcast.description && (
              <div className="prose prose-invert max-w-none">
                <p className="text-white/80 text-sm md:text-base leading-relaxed">
                  {podcast.description}
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="bg-black/20 w-full h-screen">
          <p className="flex justify-center items-center h-screen text-3xl">
            جرّب راديو ثمانية ☕️
          </p>
        </div>
      </div>
    </div>
  );
}
