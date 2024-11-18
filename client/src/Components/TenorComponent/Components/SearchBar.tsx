import { MagnifyingGlassIcon } from "@heroicons/react/24/outline/index.js";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
}

export function SearchBar({
  value,
  onChange,
  suggestions,
  onSuggestionClick,
}: SearchBarProps) {
  return (
    <div className="p-2">
      <div className="relative">
        <input
          type="text"
          placeholder="Search Tenor"
          className="w-full bg-gray-900 text-white rounded-md py-1.5 pl-8 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <MagnifyingGlassIcon className="absolute left-2 top-2 h-5 w-5 text-gray-400" />

        {suggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-gray-900 rounded-md shadow-lg">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                className="w-full px-4 py-2 text-left text-sm text-gray-200 hover:bg-gray-800"
                onClick={() => onSuggestionClick(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
