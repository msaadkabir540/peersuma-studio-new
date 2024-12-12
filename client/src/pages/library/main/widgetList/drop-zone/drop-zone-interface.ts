import { WidgetInterface } from "../../library-interface";

interface DragMediainterface {
  _id: string;
  name: string;
  thumbnailUrl: string;
  duration: number;
}

interface DropZOneInterface {
  order?: number | undefined;
  library: LibraryWidgetMediaInterface;
  handleRemove?: ({ order }: { order: number }) => void;
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
  media: SelectedWidgetInterface[];
}

interface LibraryWidgetMediaInterface {
  widgets: WidgetInterface[];
  embedModal?: any;
  selectedWidget: SelectedWidgestInterface;
}

export { DropZOneInterface, LibraryWidgetMediaInterface, DragMediainterface };
