import { CurrentVideoInterface } from "@/pages/create-project/components/interface";
import { TemplatesFieldValueInterface } from "@/pages/create-project/interface";

interface HorizontalDNDListPropsInterface {
  direction: "horizontal" | "vertical";
  items: TemplatesFieldValueInterface[];
  renderItem: (args: TemplatesFieldValueInterface, index: number) => JSX.Element | JSX.Element[];
  index: number;
  height?: string;
  disable?: boolean;
  sideActive?: boolean;
  handleDragEnd?: () => void;
  handleDragStart?: ({
    e,
    video,
  }: {
    e: React.DragEvent<HTMLDivElement>;
    video: CurrentVideoInterface;
  }) => void;
}

export { HorizontalDNDListPropsInterface };
