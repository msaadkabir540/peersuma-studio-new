import { RowsInterface } from "@/interface/tables-interface";
import { Control, FieldValues, UseFormWatch } from "react-hook-form";

interface TableActionInterface {
  row: RowsInterface;
  watch: UseFormWatch<FieldValues>;
  isDeleting: string;
  handleDelete: ({ _id }: { _id: string }) => void;
  handleProjectStatusClick: ({
    projectStatus,
    row,
  }: {
    projectStatus: boolean;
    row: RowsInterface;
  }) => void;
}

interface StatusInterface {
  _id: string;
  projectName: string;
  yourName: string;
  templateIds: string[];
  albumId: string;
  templates?: any[];
  projectStatus: "Opened" | "Closed";
  clientId: string;
  templateStyleIds?: string[];
  finalVideos?: any[];
  finalVideosToMerge?: any[];
  createdAt?: string;
  updatedAt?: string;
}

export { TableActionInterface, StatusInterface };
