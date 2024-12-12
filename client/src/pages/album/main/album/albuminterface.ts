import { Dispatch, SetStateAction } from "react";

import { Control, FieldValues, UseFormRegister, UseFormWatch } from "react-hook-form";
import { ClientInterface } from "@/interface/client-interface";
import { GetAllAlbumsInterface } from "@/interface/album-interface";
import { MediaShortInterface } from "@/pages/media-library/media-library-interface";

import { Users as UsersApiInterface } from "@/interface/account-interface";

interface LoadingType {
  main?: boolean;
  isLoadingMain?: boolean;
}

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
  mediaIds: [];
  setCurrentShot: (currentShortResult: []) => void;
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

interface AlbumDataResultInterface {
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

interface AlbumDataInterface {
  open: boolean;
  isOpen: boolean;
  openMedia: { fileType: string; url: string };
  loading?: LoadingType;
  data: AlbumDataResultInterface;
}

// User List compenent interface

interface UserListInterface {
  register: UseFormRegister<FieldValues>;
  watch: UseFormWatch<FieldValues>;
  users: UsersApiInterface[];
  control: Control<FieldValues>;
  handleDragEnd: () => void;
  handleDragStart: (e: React.DragEvent<HTMLInputElement>, user: SendEmailUserInterface) => void;
  getLetter: (firstName: string) => React.ReactNode;
  invites: any[] | undefined;
}

interface UploadsMediaInterface {
  name: string;
  url: string;
  fileType: string;
  fileSize: number;
  duration: number;
  s3Key: string;
  thumbnailUrl?: string | undefined;
  thumbnailS3Key?: string | undefined;
}

interface InvitesBoxInterface {
  users: UsersApiInterface[];
  shotUrl: string;
  invites: any[];
  handleDragEnd: () => void;
  getLetter: (name: string) => string;
  emailDialogue: EmailDialogueInterface;
  setEmailDialogue: Dispatch<SetStateAction<EmailDialogueInterface>>;
}
export {
  UserListInterface,
  AlbumDataInterface,
  ShotModalInterface,
  AlbumShortInterface,
  InvitesBoxInterface,
  UploadsMediaInterface,
  SendEmailUserInterface,
  EmailDialogueInterface,
  AlbumDataResultInterface,
};
