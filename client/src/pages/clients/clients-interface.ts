import { RowsInterface } from "@/interface/tables-interface";
import { Control, FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

interface SortColumnInterface {
  sortBy: string;
  sortOrder: "asc" | "desc";
}

interface deleteActionInterface {
  action: boolean;
  id: string;
  name: string;
}
// table interface
interface ColumnInterface {
  control: Control<FieldValues | any>;
  handleStatusChange: ({ id, status }: { id: string; status: boolean | undefined }) => void;
}

// action interface
interface ActionInterface {
  row: RowsInterface;
  isDeleting: boolean;
  handleDeleteActionActive: ({
    action,
    id,
    name,
  }: {
    action: boolean;
    id: string;
    name: string;
  }) => void;
}

type CreateFormSchemaInterface = {
  name: string;
  state: string;
  website: string;
  district: string;
  excProdName: string;
  vimeoFolderName: string;
  url?: string | undefined;
  S3Key?: string | undefined;
  executiveProducerEmail: string;
  executiveProducerContact: string;
  thumbnailUrl?: string | undefined;
};

interface InfoInterface {
  register: UseFormRegister<CreateFormSchemaInterface>;
  control: Control<CreateFormSchemaInterface>;
  errors: FieldErrors<CreateFormSchemaInterface>;
}

interface ExcInfoInterface {
  register: UseFormRegister<CreateFormSchemaInterface>;
  errors: FieldErrors<CreateFormSchemaInterface>;
}

// create page interface

interface OnSubmitInterface {
  _id?: string;
  name: string;
  website: string;
  vimeoFolderId?: string;
  vimeoFolderName: string;
  createdAt?: string;
  updatedAt?: string;
  state?: string;
  district?: string;
  executiveProducerContact?: string;
}

interface RouteParamsInterface {
  id: string;
  [key: string]: string;
}

interface CreateUpdateInterface {
  _id?: string;
  name: string;
  website: string;
  vimeoFolderId?: string;
  vimeoFolderName: string;
}

interface GetAllClientsInterfacae {
  sortBy: string;
  sortOrder: string;
  [key: string]: string;
}

export {
  InfoInterface,
  ColumnInterface,
  ActionInterface,
  ExcInfoInterface,
  OnSubmitInterface,
  SortColumnInterface,
  RouteParamsInterface,
  CreateUpdateInterface,
  deleteActionInterface,
  GetAllClientsInterfacae,
  CreateFormSchemaInterface,
};
