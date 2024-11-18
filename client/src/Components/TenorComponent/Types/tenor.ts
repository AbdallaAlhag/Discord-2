export interface TenorMedia {
  gif: {
    url: string;
    dims: [number, number];
    duration: number;
    size: number;
  };
  tinygif: {
    url: string;
    dims: [number, number];
    duration: number;
    size: number;
  };
  mediumgif?: {
    url: string;
    dims: [number, number];
    duration: number;
    size: number;
  };
}

export interface TenorResult {
  id: string;
  title: string;
  media_formats: TenorMedia;
  content_description: string;
  created: number;
  hasaudio: boolean;
  tags: string[];
}

export interface TenorResponse {
  next: string;
  results: TenorResult[];
}

export type MediaType = "GIFs" | "Stickers" | "Emoji";

export interface MediaData {
  id: string;
  title: string;
  url: string;
  preview: string;
  type: MediaType;
}
