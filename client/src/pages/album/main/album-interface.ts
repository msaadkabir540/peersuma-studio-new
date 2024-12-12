import { GetAllAlbumsInterface, MediaInterface } from "@/interface/album-interface";
import { ClientInterface } from "@/interface/client-interface";
import { MediaShortInterface } from "@/pages/media-library/media-library-interface";
import {
  Control,
  FieldValues,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormReset,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

interface CreateUpdateAlbumInterface {
  open?: boolean;
  data?: CreateUpdateAlbumDataInterface;
  updateAlbums?: () => void | undefined;
  onSubmit?: (data: FieldSchema) => void;
  handleModalClose?: () => void;
  handleIncrementUpdatePage?: () => void | undefined;
  setAlbumData?: ((argu: any) => void | undefined) | undefined;
  handleUpdateAlbumData?: ({ shortLink }: { shortLink: string }) => void;
}
interface CreateUpdateAlbumDataInterface {
  name?: string;
  producers?: [];
  status?: string | undefined;
  clientId?: string | undefined;
  description?: string | undefined;
  shortLink?: string;
}

interface FieldSchema {
  control: Control<FieldSchema>;
  handleSubmit: UseFormHandleSubmit<FieldSchema>;
  register?: UseFormRegister<FieldSchema>;
  name?: string;
  producers?: [];
  status?: string | undefined;
  clientId?: string | undefined;
  description?: string | undefined;
  shortLink: string;
}

interface HeaderAlbumInterface {
  control: Control<FieldValues>;
  register: UseFormRegister<FieldValues>;
  watch: UseFormWatch<FieldValues>;
  setValue: UseFormSetValue<FieldValues>;
  updateAlbums?: () => void;
}
///
interface AlbumShortInterface {
  _id: string;
  name: string;
  album?: GetAllAlbumsInterface;
  dueDate?: string;
  description: string;
  invites?: [];
  shotUrl?: string;
  isDefault?: boolean;
  media?: MediaShortInterface[];
  createdAt?: string;
  updatedAt?: string;
}

interface AlbumCardInterface {
  _id?: string;
  name?: string;
  status?: string;
  albumshots?: AlbumShortInterface[];
}

interface AlbumsDataInterface {
  _id: string;
  name: string;
  clientId: string;
  shortLink?: string;
  description: string;
  albumshots: AlbumShortInterface[];
  status: string;
  producers: [];
  createdAt?: string;
  updatedAt?: string;
  invites?: any[];
}

interface AlbumLinkInterface {
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
  mediaIds: string[];
}

interface EditShortLinkModalInterface {
  shortLinkText: string;
  currentShotId: string;
  editAlbumShortLink: boolean;
  handleClose: () => void;
  handleIncrementUpdatePage: () => void;
}

type FieldSchemaType = { shotUrl: string };

interface EditShortLinkFieldSchema {
  reset: UseFormReset<FieldSchemaType>;
  handleSubmit: UseFormHandleSubmit<FieldSchemaType>;
  register: UseFormRegister<FieldSchemaType>;
  shotUrl: string;
}
/// send Email interface

interface SendEmailDialogusInterface {
  open: boolean;
  shotCrewEmailId: string;
  user: SendEmailUserInterface;
  currentShot: AlbumLinkInterface;
  albumData: AlbumsDataInterface;
  submitHandler?: () => void;
  handleRemove?: () => void;
  handleClose: () => void;
  handleInviteAdd: (id: string) => void;
}

interface SendEmailUserInterface {
  _id?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  status?: boolean;
  roles?: any[];
  clientId?: ClientInterface;
  createdAt?: string;
  updatedAt?: string;
}
interface DataInterface {
  album: AlbumsDataInterface;
  client: ClientInterface | undefined;
  currentShot: AlbumLinkInterface;
  user: SendEmailUserInterface;
}

interface SendEmailField {
  body: string;
  subject: string;
}

interface SendEmailUserFieldSchema {
  watch?: UseFormWatch<SendEmailField | any>;
  reset?: UseFormReset<SendEmailField>;
  setValue?: UseFormSetValue<SendEmailField>;
  register?: UseFormRegister<SendEmailField>;
  handleSubmit?: UseFormHandleSubmit<SendEmailField>;
  control?: Control<SendEmailField>;
}

// Filter fields Component interface
interface FilterFieldInterface {
  control: Control<FieldValues>;
  mediaIds: string[];
  currentShotId: string;
  FilteredMedia: MediaShortInterface[];
  handleIncrementUpdatePage: () => void;
  handleClearSelection: () => void;
}

// media cards  interface
interface MediaCardField {
  multiDelete?: string;
  sort?: string;
}
interface MediaCardsInterface {
  watch?: UseFormWatch<MediaCardField | any>;
  mediaIds: [];
  register?: UseFormRegister<MediaCardField>;
  currentShot: AlbumLinkInterface;
  confirmation: boolean;
  isDeletingMedia?: boolean;
  // FilteredMedia: MediaInterface[];
  FilteredMedia: MediaShortInterface[];
  handleDelete: (id: string) => void;
  handleCloseModal: () => void;
  handleClearSelection: () => void;
  handleSelectDelete: (mediaId: []) => void;
  handleDeleteCurrentShot: (_id: string) => void;
  handleNoClick: () => void;
  handleSetFile: (fileType: string, url: string) => void;
  handleIncrementUpdatePage: () => void;
}

// sort interface
interface SortItemInterface {
  name?: string;
  updatedAt?: string;
  createdAt?: string;
  // Add other properties as needed
}

interface SortInterface {
  name?: string;
}

/// album index page interface
interface EmailDialogueInterface {
  open: boolean;
  subject: string;
  message: string;
  email: string;
  loading: boolean;
  user: SendEmailUserInterface;
}

interface ShotModalInterface {
  createShot: boolean;
  upload: boolean;
}

interface AlbumDataInterface {
  open: boolean;
  isOpen: boolean;
  data: AlbumShortInterface;
}
interface userDataInterface {
  id: string;
  lastInvited: string;
  _id: string;
}
interface UserHistoryInterface {
  open: boolean;
  openAt?: number;
  list?: userDataInterface[];
}

export {
  EmailDialogueInterface,
  ShotModalInterface,
  AlbumDataInterface,
  CreateUpdateAlbumDataInterface,
  FieldSchema,
  DataInterface,
  SortInterface,
  FieldSchemaType,
  SortItemInterface,
  AlbumCardInterface,
  AlbumLinkInterface,
  AlbumShortInterface,
  MediaCardsInterface,
  FilterFieldInterface,
  UserHistoryInterface,
  HeaderAlbumInterface,
  EditShortLinkFieldSchema,
  SendEmailUserFieldSchema,
  SendEmailDialogusInterface,
  CreateUpdateAlbumInterface,
  EditShortLinkModalInterface,
};
