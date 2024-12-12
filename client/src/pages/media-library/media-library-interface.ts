// eslint-disable-next-line @typescript-eslint/no-explicit-any

import { RowsInterface } from "@/interface/tables-interface";
import {
  Control,
  FieldValues,
  UseFormRegister,
  UseFormReset,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

export interface FilterFieldsInterface {
  watch: UseFormWatch<FieldValues>;
  reset: UseFormReset<FieldValues>;
  handelSetFileName: () => void;
  control: Control<FieldValues | any>;
  register: UseFormRegister<FieldValues>;
  setValue: UseFormSetValue<FieldValues>;
  fileTypes: FileType[];
  categories: FileType[];
}

export interface ColumnInterface {
  handlePassDataModal: (url: string, fileType: string) => void;
}

interface RowMediaLibraryInterface {
  row: RowsInterface;
  media: MediaShortInterface[];
  loader: any;
  editing: unknown;
  // description: string;
  watch: UseFormWatch<FieldValues>;
  handleDownload: ({ url, name, s3Key }: { s3Key: string; url: string; name: string }) => void;
  handelUpdateTemplate: ({
    newFileName,
    categories,
    url,
    description,
    media,
  }: {
    newFileName: string;
    description: string;
    categories: FileType[];
    url: string;
    media: unknown[];
  }) => void;
  handelClose: () => void;
  handleDeleteMedia: ({ url, s3Key }: { url: string; s3Key: string }) => void;

  handelUpdateMedia: ({
    uploadFileName,
    id,
    key,
    url,
    name,
  }: {
    uploadFileName: string;
    id: string;
    key: string;
    url: string;
    name: string;
  }) => void;
  handleClickCopy: ({ id }: { id: string }) => void;
}

interface MediaShortInterface {
  createdAt?: string;
  duration?: number;
  fileType?: string;
  isVisible?: boolean;
  name: string;
  s3Key: string;
  thumbnailS3Key?: string;
  thumbnailUrl?: string;
  updatedAt?: string;
  url: string;
  _id?: string;
}

interface MediaUploadFileType {
  createdAt?: string;
  duration?: number;
  fileType?: string;
  isVisible?: boolean;
  name?: string;
  s3Key?: string;
  thumbnailS3Key?: string;
  thumbnailUrl?: string;
  updatedAt?: string;
  url?: string;
  shotUrl?: string;
  _id?: string;
}

type FileType = {
  label: string;
  value: string;
};

type ViewFieldType = {
  isView: boolean;
  fileType?: string;
  url?: string;
};

type SortColumnsTypes = {
  sortBy: string;
  sortOrder: "asc" | "desc";
};

type ValidType = { isValid: boolean; ValidMessage: string };

type UploadMediaType = { id: string; key: string; url: string; name: string };
type UploadMediaTypes = {
  open: boolean;
  mediaId: string;
  key: string;
  url: string;
  name: string;
  uploads?: any;
  isFileUpload?: boolean;
};

type LoaderType = {
  getAllTemplateMedia: boolean;
  addTemplateMedia: boolean;
  download: string;
  deleteFile: string;
  updateFile: string;
};

// default values
const LoaderDefalutValue = {
  getAllTemplateMedia: false,
  addTemplateMedia: false,
  download: "",
  deleteFile: "",
  updateFile: "",
};
const ValidDefaultValues = { isValid: false, ValidMessage: "" };

interface FileNameInterface {
  isOpenFileName: boolean;
  isFileName: string;
}

interface EditMediaInterface {
  url: string;
  open: boolean;
  uploadMedia: UploadMediaType;
  loader: unknown;
  media: MediaShortInterface[];
  watch: UseFormWatch<FieldValues>;
  register: UseFormRegister<FieldValues>;
  control: Control<FieldValues | any>;
  categories: FileType[];
  newFileName: string;
  ValidMessage: string;
  handelUpdateMedia: ({
    uploadFileName,
    id,
    key,
    url,
    name,
  }: {
    uploadFileName: string;
    id: string;
    key: string;
    url: string;
    name: string;
  }) => void;
  handelUpdateTemplate: ({
    newFileName,
    categories,
    url,
    description,
    media,
  }: {
    newFileName: string;
    description: string;
    categories: FileType[];
    url: string;
    media: unknown[];
  }) => void;

  handleModalClose: () => void;
}

export {
  FileType,
  ValidType,
  LoaderType,
  ViewFieldType,
  UploadMediaType,
  UploadMediaTypes,
  SortColumnsTypes,
  FileNameInterface,
  EditMediaInterface,
  LoaderDefalutValue,
  ValidDefaultValues,
  MediaUploadFileType,
  MediaShortInterface,
  RowMediaLibraryInterface,
};
