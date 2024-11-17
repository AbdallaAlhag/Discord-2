import { MediaData } from '../Types/tenor';

interface GifGridProps {
  gifs: MediaData[];
  onSelect: (gif: MediaData) => void;
}

export function GifGrid({ gifs, onSelect }: GifGridProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {gifs.map((gif) => (
        <button
          key={gif.id}
          className="relative aspect-video overflow-hidden rounded-md hover:opacity-80 transition-opacity"
          onClick={() => onSelect(gif)}
        >
          <img
            src={gif.preview}
            alt={gif.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </button>
      ))}
    </div>
  );
}