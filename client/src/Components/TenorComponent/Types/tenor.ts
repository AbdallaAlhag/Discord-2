export interface TenorMedia {
  gif: {
    url: string;
  };
  tinygif: {
    url: string;
  };
  mediumgif?: {
    url: string;
  };
  webm?: {
    url: string;
  };
}

export interface TenorResult {
  id: string;
  title: string;
  media_formats: TenorMedia;
  content_type?: 'gif' | 'sticker';
}

export interface TenorResponse {
  results: TenorResult[];
}

export interface EmojiData {
  id: string;
  character: string;
  name: string;
}

export type MediaType = 'GIFs' | 'Stickers' | 'Emoji';

export interface MediaData {
  id: string;
  title: string;
  url: string;
  preview: string;
  type: MediaType;
}