import { FileType } from "@/pages/media-library/media-library-interface";

interface UserTableRows {
  _id: string;
  id?: string;
  status: boolean;
  username: string;
  email: string;
  roles: string[];
  updatedAt: string;
  actions?: string;
  edit?: any;
}
interface WedgetRowInterface {
  _id: string;
  actions?: string;
  edit?: string;
  updatedAt: string;
  description: string;
  templateName: string;
  mediaFilesCount: number;
  templateVideoUrl?: string;
  templateVideoThumbnailUrl?: string;
}

interface WidgetTableRows {
  name: string;
  active: boolean;
  _id: string;
  id?: string;
  status: boolean;
  role: string;
}

interface RowsInterface {
  _id: string;
  website?: string;
  isEditingProcess?: boolean;
  customeThumbnailUrl?: boolean;
  level?: string;
  category?: string;
  id?: string;
  role?: string;
  status?: boolean;
  username?: string;
  fullName?: string;
  email?: string;
  roles?: string[] | string;
  updatedAt?: string;
  actions?: string;
  edit?: string;
  name?: string;
  active?: boolean;
  count?: number;
  yourName?: string;
  projectName?: string;
  thumbnailUrl?: string;
  fileType?: string;
  categories?: FileType[] | string[];
  fileSize?: string;
  duration?: string | number;
  url?: string;
  s3Key?: string;
  themeName?: string;
  templateName?: string;
  description?: string;
  mediaFilesCount?: number;
  templateVideoUrl?: string;
  themesDescription?: string;
  templateVideoThumbnailUrl?: string;
  themeVideoThumbnailUrl?: string;
  videoProjectId?: { status: string };
}

export { UserTableRows, WidgetTableRows, RowsInterface, WedgetRowInterface };
