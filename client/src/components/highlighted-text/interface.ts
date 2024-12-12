import { CSSProperties } from "react";

interface HighlightAbleTextPropsInterface {
  // player,
  playerCurrentTime: number;
  // selection,
  sectionControl: boolean;
  currentSelectionOfSelection: any;
  transcription: any;
  handleDragEnd: () => void;
  handleDragStart: (e: React.DragEvent<HTMLDivElement>, noDrag: boolean) => void;
  setStartValueOnPlayer: (args: { startsTime: number }) => void;
  clearAllTranscriptionSelection: () => void;
  selectionEvent: (args: any) => void;
  selectionControlEvent: ({ controls }: { controls: boolean }) => void;
  //
  clipStartTime: number;
  clipEndTime: number;
}

interface GetCalculationsFunctionArgs {
  text: string;
  index: number;
  speakerIndex: number;
  speakerList: Array<any>;
  startTime: string;
  endTime: string;
  clipStartTime: number;
  clipEndTime: number;
}

interface SpeakerTranscription {
  startTime: string;
  endTime: string;
  type: string;
  speakerLabel: string;
  text: string;
  textIndex?: string;
  getTextStyles?: (startTime: string) => React.CSSProperties;
  currentSelection?: boolean;
  nextElementIsPunctuation?: boolean;
}

interface TextInterface {
  text: string;
  index: number;
  endTime: string;
  startTime: string;
  textIndex: string | undefined;
  speakerIndex: number;
  getTextStyles: ((startTime: string) => CSSProperties) | undefined;
  handleDragEnd: () => void;
  handleDragStart: (e: React.DragEvent<HTMLDivElement>, noDrag: boolean) => void;
  currentSelection: boolean | undefined;
  setStartValueOnPlayer: (args: { startsTime: number }) => void;
  nextElementIsPunctuation: boolean | undefined;
}

export {
  HighlightAbleTextPropsInterface,
  GetCalculationsFunctionArgs,
  SpeakerTranscription,
  TextInterface,
};
