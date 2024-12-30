import { useEffect, useState } from "react";
import { MediaData, MediaType } from "../Types/tenor";
import { TabBar } from "./TabBar";
import { SearchBar } from "./SearchBar";
import { MediaGrid } from "./MediaGrid";
import { useMediaSearch } from "../Hooks/useTenorSearch";

// const TENOR_API_KEY = import.meta.env.VITE_TENOR_API_KEY;
// const TENOR_API_URL = "https://tenor.googleapis.com/v2";

const tabs: MediaType[] = ["GIFs", "Stickers", "Emoji"];

interface GifPickerProps {
  onSelect: (media: MediaData) => void;
  tabOnOpen: MediaType;
}

export function GifPicker({ onSelect, tabOnOpen }: GifPickerProps) {
  const [activeTab, setActiveTab] = useState<MediaType>("GIFs");
  const [searchQuery, setSearchQuery] = useState("");

  const { media, loading, error, suggestions } = useMediaSearch(
    activeTab,
    searchQuery
  );
  useEffect(() => {
    setActiveTab(tabOnOpen);
  }, [tabOnOpen]);
  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
  };

  useEffect(() => {
    console.error("An error occurred:", error);
  }, [error]);

  return (
    <div className="w-[400px] bg-gray-800 rounded-lg shadow-xl">
      <TabBar
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as MediaType)}
      />

      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        suggestions={suggestions}
        onSuggestionClick={handleSuggestionClick}
      />

      <div className="h-[400px] overflow-y-auto p-2">
        {error ? (
          <div className="flex items-center justify-center h-full text-red-400">
            {error}
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        ) : (
          <MediaGrid items={media} type={activeTab} onSelect={onSelect} />
        )}
      </div>
    </div>
  );
}
