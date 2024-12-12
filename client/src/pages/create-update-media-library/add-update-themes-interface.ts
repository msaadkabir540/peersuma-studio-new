import { FileType } from "../media-library/media-library-interface";

interface ThemesFieldsInterface {
  newFileName: string;
  description?: string;
  "new-categories"?: FileType[];
}

export { ThemesFieldsInterface };
