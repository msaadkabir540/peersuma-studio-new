import { UseFormRegister, Control, FieldErrors, UseFormWatch } from "react-hook-form";

interface CreateUserFormSchemaInterface {
  fullName: string;
  username: string;
  contactNumber?: string;
  email: string;
  confirmPassword: string;
  password: string;
  roles: string;
}

interface InfoInterface {
  watch: UseFormWatch<CreateUserFormSchemaInterface>;
  register: UseFormRegister<CreateUserFormSchemaInterface>;
  control: Control<CreateUserFormSchemaInterface>;
  errors: FieldErrors<CreateUserFormSchemaInterface>;
  isEditInfo: boolean;
}

interface CreateUserInterface {
  fullName?: string;
  username: string;
  email: string;
  confirmPassword: string;
  password: string;
  roles: string[];
}

export { CreateUserFormSchemaInterface, InfoInterface, CreateUserInterface };
