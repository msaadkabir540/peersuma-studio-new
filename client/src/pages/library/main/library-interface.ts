// Library interface  files
interface WidgetInterface {
  label: string;
  value: string;
}

interface MediaInterface {
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

// extends MediaInterface

// interface SelectedMediaChildInterface {
//     _id: string;
//     name: string;
//     thumbnailUrl: string;
//     duration: number;
// }

interface SelectedMediaChildInterface {
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

interface SelectedMediaInterface {
  order: number;
  type?: string;
  _id: SelectedMediaChildInterface;
}

interface SelectedWidgetInterface {
  _id: string;
  id?: string;
  media: SelectedMediaInterface[];
}

/// library interface
interface LibraryMediaInterface {
  widgets: WidgetInterface[];
  embedModal?: any;
  media?: MediaInterface[];
  selectedWidget: SelectedWidgetInterface;
}

// form schema interface

interface LibraryFieldSchema {
  size: string;
  width: string;
  type: string;
  active: number;
  search: string;
  description: string;
  selectedWidgetId: string;
}

export {
  LibraryMediaInterface,
  LibraryFieldSchema,
  SelectedMediaInterface,
  SelectedWidgetInterface,
  WidgetInterface,
};
