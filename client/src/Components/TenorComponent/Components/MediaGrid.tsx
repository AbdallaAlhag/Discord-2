import { MediaData, MediaType } from '../Types/tenor';
import clsx from 'clsx';

interface MediaGridProps {
  items: MediaData[];
  type: MediaType;
  onSelect: (item: MediaData) => void;
}

export function MediaGrid({ items, type, onSelect }: MediaGridProps) {
  return (
    <div className={clsx(
      'grid gap-2',
      type === 'Emoji' ? 'grid-cols-6' : 'grid-cols-2'
    )}>
      {items.map((item) => (
        <button
          key={item.id}
          className={clsx(
            'relative overflow-hidden rounded-md hover:opacity-80 transition-opacity',
            type === 'Emoji' ? 'aspect-square text-2xl' : 'aspect-video'
          )}
          onClick={() => onSelect(item)}
        >
          {type === 'Emoji' ? (
            <span className="flex items-center justify-center w-full h-full">
              {item.url}
            </span>
          ) : (
            <img
              src={item.preview}
              alt={item.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          )}
        </button>
      ))}
    </div>
  );
}