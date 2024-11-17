import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { MediaData, MediaType, TenorResponse } from "../Types/tenor";
import { emojis } from "../Data/emojis";

const TENOR_API_KEY = import.meta.env.VITE_TENOR_API_KEY;
const TENOR_API_URL = "https://tenor.googleapis.com/v2";

export function useMediaSearch(type: MediaType, searchQuery: string) {
  const [media, setMedia] = useState<MediaData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMedia = async () => {
      setLoading(true);
      setError(null);

      try {
        if (type === "Emoji") {
          // Filter emojis based on search query
          const filteredEmojis = emojis
            .filter((emoji) =>
              searchQuery
                ? emoji.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                  emoji.character.includes(searchQuery)
                : true
            )
            .slice(0, 20)
            .map((emoji) => ({
              id: emoji.id,
              title: emoji.name,
              url: emoji.character,
              preview: emoji.character,
              type: "Emoji" as MediaType,
            }));

          setMedia(filteredEmojis);
          return;
        }

        // Handle GIFs and Stickers
        const endpoint = searchQuery
          ? `${TENOR_API_URL}/search`
          : `${TENOR_API_URL}/featured`;
        const params = {
          key: TENOR_API_KEY,
          q: searchQuery,
          limit: 20,
          contentfilter: "medium",
          media_filter: type === "Stickers" ? "sticker" : "gif",
        };

        const { data } = await axios.get<TenorResponse>(endpoint, { params });

        const formattedMedia = data.results.map((item) => ({
          id: item.id,
          title: item.title,
          url: item.media_formats.gif.url,
          preview:
            item.media_formats.tinygif?.url || item.media_formats.gif.url,
          type,
        }));

        setMedia(formattedMedia);
      } catch (err) {
        const error = err as Error | AxiosError;
        setError(error.message);
        setMedia([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchMedia, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, type]);

  return { media, loading, error };
}
