import {
  Control,
  UseFormReset,
  UseFormWatch,
  UseFormRegister,
  UseFormHandleSubmit,
  UseFormSetValue,
} from "react-hook-form";

interface LoadingSchemaInterface {
  updateFrame: boolean;
  libraryWidget: boolean;
  handleShowProcessing: boolean;
}

interface DownloadInterface {
  quality: string;
  link: string;
  _id: string;
}

interface CreateUpdateDataInterface {
  _id: string;
  name: string;
  description: string;
  thumbnailUrl: string;
  duration: number;
  videoUrl: string;
  assetId: string;
  shortLink: string;
  downloads?: DownloadInterface[] | [];
  clientId: string | undefined;
  producers?: [];
  active: boolean;
  shareable: boolean;
  createdAt?: string;
  updatedAt?: string;
}

type AddMediaType = {
  id?: string;
  duration: number;
};

interface AddMultipleLibraryMediaInterface {
  uploads: AddMediaType;
  clientId: string | undefined;
  userId: string | undefined;
  folderId: string;
}

interface FormSchema {
  shortLink: string;
  thumbnailUrl: string;
  videoUrl: string;
  downloads: any;
  name: string;
  duration: number;
}
interface FormSchemaLibrary {
  reset: UseFormReset<FormSchema>;
  watch: UseFormWatch<FormSchema>;
  control: Control<FormSchema>;
  register: UseFormRegister<FormSchema>;
  setValue: UseFormSetValue<FormSchema>;
  handleSubmit: UseFormHandleSubmit<FormSchema>;
}

export {
  LoadingSchemaInterface,
  CreateUpdateDataInterface,
  FormSchemaLibrary,
  AddMultipleLibraryMediaInterface,
};
