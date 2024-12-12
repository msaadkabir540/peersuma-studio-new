import { SetStateAction } from "react";

import { TemplatesFieldValueInterface } from "@/pages/create-project/interface";
import { RenameClipInterface } from "../../staging/staging-interface";

export interface TemplateVideoFieldComponentInterface {
  index: number;
  value: TemplatesFieldValueInterface[];
  setRenameVideoClip: React.Dispatch<SetStateAction<RenameClipInterface>>;
  selectedVideoClip: string | null | undefined;
  dispatchProject: React.Dispatch<
    React.SetStateAction<{ selectedVideoClip: string; type: string }>
  >;
  handleClipClicks: ({
    e,
    item,
    label,
    name,
    templateClip,
    currentVideoHeadTime,
  }: {
    e: React.DragEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement, MouseEvent>;
    item: TemplatesFieldValueInterface;
    label: string;
    name: string;
    templateClip?: boolean | undefined;
    currentVideoHeadTime?: number | false | null | undefined;
  }) => void;
  label: string;
  name: string;
  handleClipDelete: ({
    e,
    item,
    label,
    name,
  }: {
    e: React.MouseEvent<HTMLDivElement, MouseEvent>;
    item: {
      id: string;
      startTime: number;
      endTime: number;
      url: string;
      duration: number;
    };
    label: string;
    name: string;
  }) => void;
}
