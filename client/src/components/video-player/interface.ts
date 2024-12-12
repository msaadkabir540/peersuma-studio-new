import { TemplatesFieldValueInterface } from "@/pages/create-project/interface";

interface VideoPlayerPropsInterface {
  videos: TemplatesFieldValueInterface[];
  isPlaying: boolean;
  currentTime: number;
  currentIndex: number;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentTime: React.Dispatch<React.SetStateAction<number>>;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
}

export { VideoPlayerPropsInterface };
