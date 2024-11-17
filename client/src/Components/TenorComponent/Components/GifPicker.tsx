import { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { MediaData, MediaType, TenorResult } from '../Types/tenor';
import { emojis } from '../Data/emojis';
import axios, { AxiosError } from 'axios';

const TENOR_API_KEY = import.meta.env.VITE_TENOR_API_KEY;
const TENOR_API_URL = 'https://tenor.googleapis.com/v2';

const tabs: MediaType[] = ['GIFs', 'Stickers', 'Emoji'];

interface GifPickerProps {
  onSelect: (media: MediaData) => void;
}

export function GifPicker({ onSelect }: GifPickerProps) {
  const [activeTab, setActiveTab] = useState<MediaType>('GIFs');
  const [searchQuery, setSearchQuery] = useState('');
  const [media, setMedia] = useState<MediaData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    setLoading(true);
    setError(null);
    setSearchQuery(query);

    try {
      if (activeTab === 'Emoji') {
        const filteredEmojis = emojis
          .filter(emoji => 
            query ? 
              emoji.name.toLowerCase().includes(query.toLowerCase()) ||
              emoji.character.includes(query)
            : true
          )
          .slice(0, 20)
          .map(emoji => ({
            id: emoji.id,
            title: emoji.name,
            url: emoji.character,
            preview: emoji.character,
            type: 'Emoji' as MediaType
          }));
        
        setMedia(filteredEmojis);
        setLoading(false);
        return;
      }

      const endpoint = query ? `${TENOR_API_URL}/search` : `${TENOR_API_URL}/featured`;
      const params = {
        key: TENOR_API_KEY,
        q: query,
        limit: 20,
        contentfilter: 'medium',
        media_filter: activeTab === 'Stickers' ? 'sticker' : 'gif'
      };

      const { data } = await axios.get(endpoint, { params });
      
      const formattedMedia = data.results.map((item: TenorResult) => ({
        id: item.id,
        title: item.title,
        url: item.media_formats.gif.url,
        preview: item.media_formats.tinygif?.url || item.media_formats.gif.url,
        type: activeTab
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

  return (
    <div className="w-[400px] bg-gray-800 rounded-lg shadow-xl">
      <div className="flex border-b border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={clsx(
              'px-4 py-2 text-sm font-medium',
              activeTab === tab
                ? 'text-white border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-gray-200'
            )}
            onClick={() => {
              setActiveTab(tab);
              handleSearch(searchQuery);
            }}
          >
            {tab}
          </button>
        ))}
      </div>
      
      <div className="p-2">
        <div className="relative">
          <input
            type="text"
            placeholder="Search Tenor"
            className="w-full bg-gray-900 text-white rounded-md py-1.5 pl-8 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <MagnifyingGlassIcon className="absolute left-2 top-2 h-5 w-5 text-gray-400" />
        </div>
      </div>

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
          <div className={clsx(
            'grid gap-2',
            activeTab === 'Emoji' ? 'grid-cols-6' : 'grid-cols-2'
          )}>
            {media.map((item) => (
              <button
                key={item.id}
                className={clsx(
                  'relative overflow-hidden rounded-md hover:opacity-80 transition-opacity',
                  activeTab === 'Emoji' ? 'aspect-square text-2xl' : 'aspect-video'
                )}
                onClick={() => onSelect(item)}
              >
                {activeTab === 'Emoji' ? (
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
        )}
      </div>
    </div>
  );
}