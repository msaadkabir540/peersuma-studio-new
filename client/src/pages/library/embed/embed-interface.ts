import { MediaFileInterface } from "../showcase/showcase-interface";

interface MediaItem {
  order: number;
  _id: MediaFileInterface;
}

interface ShowcaseDataInterface {
  data: AssetsInterface;
}

interface RouteParamsInterface {
  id: string;
  [key: string]: string;
}

interface DownloadInterface {
  quality: string;
  link: string;
  _id: string;
}

interface AssetsInterface {
  _id: string;
  name: string;
  description?: string;
  clientId?: string;
  producers?: string[];
  active?: boolean;
  showTitle?: boolean;
  showDescription?: boolean;
  showSubscribers?: boolean;
  enableShare?: boolean;
  enableSubscribe?: boolean;
  widgetTemplate?: string;
  media?: MediaItem[];
  createdAt?: string;
  updatedAt?: string;
  buttonColor?: string;
  buttonTextColor?: string;
  video_name?: string;
  video_url?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
}

interface widgetTemplateInterface {
  carousel: React.ReactElement;
  slideshow: React.ReactElement;
  thumbnailGrid: React.ReactElement;
  verticalStack: React.ReactElement;
}

export {
  ShowcaseDataInterface,
  RouteParamsInterface,
  AssetsInterface,
  widgetTemplateInterface,
  MediaItem,
};
