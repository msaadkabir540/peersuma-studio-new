import { AssetsInterface } from "@/pages/library/embed/embed-interface";
import { MediaFileInterface } from "@/pages/library/showcase/showcase-interface";

interface MediaItem {
  order: number;
  _id: MediaFileInterface;
}
interface widgetInterface {
  subscribers: number;
  backgroundColor: string;
  thumbnailTitleColor: string;
  colorPalette: string;
  textColor: string;
  thumbnailColor: string;
  show_statistic?: string;
  _id: string;
  name: string;
  description?: string;
  clientId?: string;
  producers?: string[];
  active?: boolean;
  showTitle?: boolean;
  showDescription?: boolean;
  showSubscribers?: boolean;
  enableShare: boolean;
  enableSubscribe?: boolean;
  titleColor?: string;
  widgetTemplate?: string;
  media?: MediaItem[];
  createdAt?: string;
  updatedAt?: string;
  buttonColor: string;
  leafColor: string;
  buttonTextColor?: string;
  video_name?: string;
  video_url?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  //
  thumbnailTextColor?: string;
}

interface CustomStyle {
  main: string;
  name: string;
  video: string;
  title?: string;
  grid?: string;
  tryNowDiv?: string;
  description: string;
  sliderWrapper: string;
  SliderMain: string;
  btnLeft: string;
  btnRight: string;
  widgetContainer: string;
  embedResponsiveItem: string;
  subText: string;
  EmbedWidgetThumb: string;
  shareBox: string;
  uploadedNameClass?: string;
  avatar?: string;
  uploadedTimeClass?: string;
  uploadedheadingClass?: string;
  leafColor?: string;
  shareViewClass?: string;
  viewAllClass?: string;
  showDescription?: string;
}

interface CarouselTemplateInterface {
  assets: AssetsInterface[];
  // assets: WidgetDataType[],
  widget: widgetInterface;
  customStyle?: CustomStyle | CSSModuleClasses;
}

interface ReactPlayerRefInterface {
  slickNext: () => void | null;
  slickPrev: () => void | null;
}

export {
  CarouselTemplateInterface,
  CustomStyle,
  ReactPlayerRefInterface,
  widgetInterface,
  AssetsInterface,
};
