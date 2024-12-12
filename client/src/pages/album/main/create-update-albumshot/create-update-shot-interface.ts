import { GetAllAlbumsInterface } from "@/interface/album-interface";
import { MediaShortInterface } from "@/pages/media-library/media-library-interface";
import {
  Control,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormReset,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

interface FormDataInterface {
  id: string;
  album: string;
  name: string;
  dueDate?: string;
  description?: string;
}

interface AlbumShortInterface {
  _id: string;
  name?: string;
  album: GetAllAlbumsInterface;
  dueDate?: string;
  description: string;
  invites?: [];
  shotUrl: string;
  isDefault: boolean;
  media: MediaShortInterface[];
  createdAt?: string;
  updatedAt?: string;
}

interface CreateUpdateShotInterface {
  open: boolean;
  data: AlbumShortInterface[];
  handleClickOpen: (argu: boolean) => void;
  handleIncrementUpdatePage: () => void;
}
interface CreateUpdateShotFieldSchema {
  name: string;
  dueDate?: string;
  description?: string;
}

interface CreateUpdateShotFormSchema {
  setValue?: UseFormSetValue<CreateUpdateShotFieldSchema>;
  register?: UseFormRegister<CreateUpdateShotFieldSchema>;
  handleSubmit?: UseFormHandleSubmit<CreateUpdateShotFieldSchema>;
  name?: string;
  dueDate?: string;
  description?: string;
}

export {
  CreateUpdateShotInterface,
  FormDataInterface,
  AlbumShortInterface,
  CreateUpdateShotFormSchema,
};
