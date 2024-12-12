interface SortColumnInterface {
  sortBy: string;
  sortOrder: "asc" | "desc";
}

interface ThemesRowInterface {
  _id: string;
  actions?: string;
  updatedAt: string;
  description: string;
  templateName: string;
  mediaFilesCount: number;
  templateVideoUrl?: string;
  templateVideoThumbnailUrl?: string;
}

export { SortColumnInterface, ThemesRowInterface };
