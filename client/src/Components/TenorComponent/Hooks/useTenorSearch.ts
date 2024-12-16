import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { MediaData, MediaType, TenorResult } from "../Types/tenor";
import { emojis } from "../Data/emojis";

const TENOR_API_KEY = import.meta.env.VITE_TENOR_API_KEY;
// const TENOR_API_URL = "https://tenor.googleapis.com/v2";
const VITE_CLIENT_KEY = import.meta.env.VITE_TENOR_CLIENT_KEY;

export function useMediaSearch(type: MediaType, searchQuery: string) {
  const [media, setMedia] = useState<MediaData[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch search suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!searchQuery || searchQuery.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const endpoint =
          searchQuery.length === 2
            ? "/tenor-api/autocomplete"
            : "/tenor-api/search_suggestions";

        const { data } = await axios.get(endpoint, {
          params: {
            key: TENOR_API_KEY,
            client_key: VITE_CLIENT_KEY,
            q: searchQuery,
            limit: 5,
          },
        });

        setSuggestions(data.results || []);
      } catch (err) {
        console.error("Failed to fetch suggestions:", err);
        setSuggestions([]);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // Fetch media content
  useEffect(() => {
    const fetchMedia = async () => {
      setLoading(true);
      setError(null);

      try {
        if (type === "Emoji") {
          const filteredEmojis = emojis
            .filter((emoji) =>
              searchQuery
                ? emoji.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                  emoji.character.includes(searchQuery)
                : true
            )
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

        const endpoint = searchQuery
          ? "/tenor-api/search"
          : "/tenor-api/featured";

        const params = {
          key: TENOR_API_KEY,
          client_key: VITE_CLIENT_KEY,
          q: searchQuery,
          limit: 20,
          searchFilter: type === "Stickers" ? "sticker,-static" : "",
          // Strongly recommended
          // string
          // Comma-separated list of GIF formats to filter the Response Objects. By default, media_filter returns all formats for each Response Object.
          // Example: media_filter=gif,tinygif,mp4,tinymp4
          // Doesn't have a default value.
          media_filter: "gif",
        };

        const { data } = await axios.get(endpoint, { params });

        const formattedMedia = data.results.map((item: TenorResult) => ({
          id: item.id,
          title: item.title,
          url: item.media_formats.gif.url,
          preview:
            item.media_formats.tinygif?.url || item.media_formats.gif.url,
          type,
        }));

        setMedia(formattedMedia);
        console.log("formattedMedia: ", formattedMedia);
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

  return { media, loading, error, suggestions };
}
