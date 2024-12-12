import { Control, UseFormWatch } from "react-hook-form";
import { LibraryMediaInterface, WidgetInterface } from "../library-interface";
import { DragMediainterface } from "./drop-zone/drop-zone-interface";

export interface WidgetListInterface {
  library: LibraryMediaInterface;
  watch: UseFormWatch<FromSchema>;
  control: Control<FromSchema>;
  handleRemove: ({ order }: { order: number }) => void;
  handleEmbedModal: ({ modalValue }: { modalValue: boolean }) => void;
  handelSetLibrary: ({ updatedWidget }: { updatedWidget: any }) => void;
  handleSelectedWidgetId: ({ updatedWidget }: { updatedWidget: undefined }) => void;
  handleRemoveWidgetMediaLibrary: ({ widgetID }: { widgetID: string }) => void;
  handleMoveWidgetMediaLibrary: ({ order }: { order: number }) => void;
  handleAddWidgetMediaNewOrder?: ({
    dragMedia,
    newOrder,
  }: {
    dragMedia: DragMediainterface;
    newOrder: number;
  }) => void | undefined;
  handleAddWidgetMediaOrder?: ({
    dragMedia,
    newOrder,
  }: {
    dragMedia: DragMediainterface;
    newOrder: number;
  }) => void | undefined;
}

interface SelectedWidgetInterface {
  order: number;
  type?: string;
  _id: SelectedWidgeMediatInterface;
}

interface SelectedWidgeMediatInterface {
  _id: string;
  name: string;
  description: string;
  thumbnailUrl: string;
  duration: number;
  videoUrl: string;
  assetId: string;
  shortLink: string;
  downloads: [];
  clientId: string;
  producers: [];
  active: boolean;
  shareable: boolean;
  createdAt: string;
  updatedAt: string;
}

interface SelectedWidgestInterface {
  _id: string;
  media: Array<SelectedWidgetInterface>;
}

interface LibraryWidgetMediaInterface {
  widgets: WidgetInterface[];
  embedModal?: any;
  selectedWidget: SelectedWidgestInterface;
}

interface FromSchema {
  size: string;
  width: string;
  type: string;
  active: number;
  search: string;
  description: string;
  selectedWidgetId: string;
}

interface DragDropResult {
  draggableId: string;
  type: string;
  source: {
    index: number;
    droppableId: string;
  };
  reason: string;
  mode: string;
  destination: {
    droppableId: string;
    index: number;
  };
  combine: null | any;
}

export {
  FromSchema,
  DragDropResult,
  SelectedWidgeMediatInterface,
  SelectedWidgestInterface,
  LibraryWidgetMediaInterface,
  SelectedWidgetInterface,
};
