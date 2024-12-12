import { RowsInterface } from "@/interface/tables-interface";
import { FieldValues, UseFormRegister, UseFormReset } from "react-hook-form";

interface CategoriesInterface {
  _id: string;
  name: string;
  count: number;
}

interface CategoryLoader {
  deleteCategoryId: string;
  createTemplateLoader: boolean;
  createUpdateCategory: boolean;
  deleteCategoryLoading: boolean;
  getAllLoading: boolean;
}

interface FormSchema {
  name: string;
}

interface ColumnsCategoryInterface {
  register: UseFormRegister<FieldValues>;
}

interface DeleteModalInterface {
  _id: string;
  del?: string;
  count?: number;
  deleteCategoryId: string;
  handleSetDelModalClose: () => void;
  hanldeCancelClick: () => void;
  handleDeleteClick: ({ _id }: { _id: string }) => void;
}

interface ActionInterface {
  row: RowsInterface;
  del: string;
  editing: string;
  deleteCategoryId: string;
  createUpdateCategory: boolean;
  hanldeCancelClick: () => void;
  handleCreateUpdate: () => void;
  handleSetDelModalClose: (_id?: string) => void;
  handleEditClick: (_id: string, name: string) => void;
  handleDeleteClick: ({ _id }: { _id: string }) => void;
}

export {
  CategoriesInterface,
  CategoryLoader,
  ColumnsCategoryInterface,
  DeleteModalInterface,
  ActionInterface,
};
