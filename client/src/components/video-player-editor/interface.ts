import { PlayerInterface } from "@/pages/create-project/interface";
import { CurrentVideoInterface } from "@/pages/create-project/components/interface";

interface VideoPlayerEditorPropsInterface {
  playerRef: any | unknown;
  currentVideo: CurrentVideoInterface;
  player: PlayerInterface;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerInterface>>;
  selection?: {
    controls: boolean;
    currentSelection?: any;
  };
  setSelection: React.Dispatch<
    React.SetStateAction<{
      controls: boolean;
    }>
  >;
  handleDragEnd: () => void;
  selectionClear: boolean | undefined;
  handleDragStart: (e: React.DragEvent<HTMLDivElement> | null, noDrag: boolean) => void;
  videoName: string | undefined;
  handleEmptyVideoPlayerClickEvent: () => void;
  handleUpdateVideoClipEvent: () => void;
  handleSetCurrentTime: ({ currentTime }: { currentTime: number | undefined }) => void;
  currentVideoLabel: string | null | undefined;
}

interface VideoPlayerInterface {
  handleSelectionClear: () => void;
}

interface CustomVideoElement extends HTMLVideoElement {
  regularPlay?: boolean;
}

interface TimelineRef {
  moveNotchToStart: (value?: number) => void;
  moveNotchToEnd: (value?: number) => void;
}

interface StartAndEndPointIndicationPropsInterface {
  videoCurrentTime: number | undefined;
  selectionStart: number | undefined;
  selectionEnd: number | undefined;
  clickOnStartTimeToEdit: (value: { editableTime: string }) => void;
}

interface TimelinePropsInterface {
  //   style: React.CSSProperties;
  style: {
    [key: string]: string;
  };
  selectionEnd: number;
  handleDragEnd: () => void;
  selectionStart: number;
  handleDragStart: (e: React.DragEvent<HTMLDivElement> | null, noDrag: boolean) => void;
  videoCurrentTime: number;
  currentVideoDuration: number;
  videoCurrentDuration: number;
  clickOnCurrentTimeControl: (value: { currentTime: number; controls?: boolean }) => void;
  setControlsOnSelectionEvent: (value: { controls: boolean }) => void;
  setNewTimeToVideoCurrentTime: (value: { value: number }) => void;
}

interface VideoControlsPropsInterface {
  style: {
    [key: string]: string;
  };
  player: PlayerInterface;
  videoRef: React.RefObject<CustomVideoElement>;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerInterface>>;
  setSelection: React.Dispatch<
    React.SetStateAction<{
      controls: boolean;
    }>
  >;
  selectionEnd: number;
  selectionStart: number;
  oneFrameForward: (video: CustomVideoElement) => void;
  handlePlayPause: () => void;
  handleSelectedPlayPause: () => void;
  handleDragStart: (e: React.DragEvent<HTMLDivElement> | null, noDrag: boolean) => void;
  pauseVideoPlayer: (value: { value: boolean }) => void;
  oneFrameBackward: (video: CustomVideoElement) => void;
  videoCurrentTime: number;
  videoStartFromTime: number;
  videoCurrentDuration: number;
  currentVideoDuration: number;
  resetToStartPointEvent: () => void;
  setNewTimeToVideoCurrentTime: (value: { value: number }) => void;
}

interface VideoContext {
  handleSelectedVideoClip: () => void;
}

export {
  TimelineRef,
  VideoContext,
  CustomVideoElement,
  VideoPlayerInterface,
  TimelinePropsInterface,
  VideoControlsPropsInterface,
  VideoPlayerEditorPropsInterface,
  StartAndEndPointIndicationPropsInterface,
};
