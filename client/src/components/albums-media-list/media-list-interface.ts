import { GetAllAlbumsInterface } from "@/interface/album-interface";
import { stagingFieldsInterface } from "@/pages/create-project/interface";
import { MediaShortInterface } from "@/pages/media-library/media-library-interface";
import { ActionInterface } from "./reducer/reducer-interface";

type FileFieldsinterface = {
  name: string;
  label: string;
};

type SelectOptionType = {
  label: string;
  value: string;
  description: string;
};

type ToolBarType = {
  toolBarData: {
    altText: string;
    title: string;
    icons: string;
    handlClickEvent: () => void;
    isListOpen?: boolean;
    fileFields?: FileFieldsinterface[] | undefined;
    mainClass?: string;
  }[];
  isButtonLoading?: LoadingButtonInterface;
  media: MediaType;
  clickOnFieldFields: ((e: any, name: string, label: string, media: MediaType) => void) | undefined;
};

type MediaType = {
  isVisible: boolean;
  url: string;
  name: string;
  s3Key: string;
  fileType: string;
  duration: number;
  _id: string;
  thumbnailUrl?: string;
  createdAt: string;
  updatedAt: string;
};

interface AlbumShortInterface {
  _id: string;
  name: string;
  album: GetAllAlbumsInterface;
  dueDate?: string;
  description: string;
  invites: [];
  shotUrl: string;
  isDefault: boolean;
  media: MediaShortInterface[];
  createdAt: string;
  updatedAt: string;
  confirmation?: boolean;
  transcription?: any;
  mediaIds: [];
}

interface AlbumDataInterface {
  _id: string;
  name: string;
  clientId: string;
  shortLink?: string;
  description: string;
  albumshots: AlbumShortInterface[];
  status: string;
  producers: [];
  createdAt: string;
  updatedAt: string;
  invites?: any[];
  createdByUser: string;
}

interface MediaButtonInterface {
  icons: string;
  index?: number;
  title?: string;
  altText: string;
  mainClass?: string;
  isListOpen?: boolean;
  isButtonLoading?: LoadingButtonInterface;
  fileFields?: FileFieldsinterface[] | undefined;
  handlClickEvent?: (({ index }: { index?: number }) => void) | undefined;
  media: MediaType;
  clickOnFieldFields: ((e: any, name: string, label: string, media: MediaType) => void) | undefined;
}

interface LoadingButtonInterface {
  isLoading: boolean;
  loadingIndex: number;
}

interface DataToolBarInterface {
  isVisibility: boolean;
  isAssembly: boolean | undefined;
  filePath: string;
  selectedAlbumId: string;
  fileId: string;
  dispatchAlbum: React.Dispatch<ActionInterface>;
  fileName?: string;
  fileS3Key?: string;
  fileFields?: FileFieldsinterface[];
  handleDeleteFile?: (({ name, s3Key }: { name: string; s3Key: string }) => void) | undefined;
  setIsButtonLoading?: ((argu: any) => void) | undefined;
}

interface AlbumMediaListInterface {
  albumId?: string;
  clickMediaColor?: number | null | undefined;
  selectedClientId: string | null;
  isAssembly?: boolean | undefined;
  loadingHeight?: number;
  fileFields?: FileFieldsinterface[] | undefined;
  finalVideos?: any | null;
  handleDragEnd?: (() => void) | undefined;
  stageTypeFields?: (fileType: string) => stagingFieldsInterface[];
  handleDeleteFile?: ({ name, s3Key }: { name: string; s3Key: string }) => void;
  handleDragStart?: ((e: React.DragEvent<HTMLDivElement>, video: any) => void) | undefined;
  clickOnFieldFields?: (e: any, name: string, label: string, media: MediaType) => void;
  clickOnListMedia?: ({ index, media }: { index: number; media: MediaType }) => void;
  handleAlbumIdEvent?: ({ newAlbumId }: { newAlbumId: string }) => void;
}

interface StateInterface {
  albumsData: AlbumDataInterface[] | undefined;
  isVisibility?: boolean | undefined;
  mediaOptions?: SelectOptionType;
  selectionId?: string | undefined;
}

interface MediaCardInterface {
  media: MediaType;
  selectedAlbumId: string;
  index: number;
  clickMediaColor: number | null | undefined;
  isAssembly: boolean | undefined;
  fileFields?: FileFieldsinterface[] | undefined;
  isVisibility: boolean;
  dispatchAlbum: React.Dispatch<ActionInterface>;
  handleDragEnd: (() => void) | undefined;
  handleDragStart: ((e: any, media: MediaType) => void) | undefined;
  handleDeleteFile: (({ name, s3Key }: { name: string; s3Key: string }) => void) | undefined;
  clickOnFieldFields: ((e: any, name: string, label: string, media: MediaType) => void) | undefined;
  clickToSelectedAlbumMedia: ({ index, media }: { index: number; media: MediaType }) => void;
}

interface FilterBarInterface {
  isVisibility: boolean;
  selectedAlbumId: string;
  mediaOptions: SelectOptionType[];
  handleSearchEvent: ({ value }: { value: string }) => void;
  handleSearchOption: ({ selectValue }: { selectValue: string }) => void;
  dispatchAlbum: React.Dispatch<ActionInterface>;
}

export {
  MediaType,
  ToolBarType,
  StateInterface,
  SelectOptionType,
  AlbumDataInterface,
  FilterBarInterface,
  MediaCardInterface,
  FileFieldsinterface,
  AlbumShortInterface,
  DataToolBarInterface,
  MediaButtonInterface,
  LoadingButtonInterface,
  AlbumMediaListInterface,
};
