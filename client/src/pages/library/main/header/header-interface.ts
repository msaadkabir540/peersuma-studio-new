import {
  Control,
  FieldValues,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { LibraryFieldSchema } from "../library-interface";

interface LibraryHeaderInterface {
  watch?: UseFormWatch<LibraryFieldSchema | any>;
  setValue?: UseFormSetValue<LibraryFieldSchema>;
  register?: UseFormRegister<LibraryFieldSchema>;
  control: Control<LibraryFieldSchema>;
  setnewLibraryMedia: (newLibraryMedia: any) => void;
}

interface UploadMediaInterface {
  uploads: uploadedTranscriptionMediaInterface;
}

interface uploadedTranscriptionMediaInterface {
  id?: string;
  name: string;
  url?: string;
  fileType?: string;
  fileSize?: number;
  duration: number;
  s3Key?: string;
  thumbnailUrl?: string | undefined;
  thumbnailS3Key?: string | undefined;
}

interface UploadsMediaInterface {
  id?: string;
  duration: number;
}

export {
  UploadMediaInterface,
  UploadsMediaInterface,
  LibraryHeaderInterface,
  uploadedTranscriptionMediaInterface,
};
