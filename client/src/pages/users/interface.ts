import {
  Control,
  FieldValues,
  UseFormHandleSubmit,
  UseFormRegister,
  FieldErrors,
} from "react-hook-form";

interface ColumnInterface {
  control: Control<FieldValues | any>;
  handleStatusChange: (data: { id: string; status?: boolean }) => void;
}

interface ActionInterface {
  action: boolean;
  id: string;
  _id?: string;
  name: string;
}

interface FormSchema {
  mySwitch?: boolean;
  search: string;
  role: string;
  pageSize: number;
  totalCount: number;
  page: number;
  password: string;
  confirmPassword: string;
}

interface ResetPasswordModalInterface {
  changeAction: ActionInterface;
  setChangeAction: (action: ActionInterface) => void;
  handleSubmit: UseFormHandleSubmit<FormSchema>;
  onSubmit: (data: FormSchema) => void;
  register: UseFormRegister<FormSchema>;
  errors: FieldErrors<FormSchema>;
  loader: boolean;
  password: string;
  confirmPassword: string;
}

export { ColumnInterface, ActionInterface, FormSchema, ResetPasswordModalInterface };
