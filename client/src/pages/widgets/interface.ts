import { Control, FieldValues, UseFormRegister, FieldErrors, UseFormWatch } from "react-hook-form";

import { RowsInterface } from "@/interface/tables-interface";

interface ColumnInterface {
  control: Control<FieldValues | any>;
  handleStatusChange: (data: { row: RowsInterface }) => void;
}

interface FormSchema {
  name?: string | undefined;
  description: string;
  producers: string[];
  colorPalette: string;
  widgetTemplate: string;
}

interface WidgetInitialFieldsInterface {
  watch?: UseFormWatch<FormSchema> | undefined;
  register: UseFormRegister<FormSchema>;
  errors: FieldErrors<FormSchema>;
  control: Control<FormSchema>;
}
export { ColumnInterface, WidgetInitialFieldsInterface, FormSchema };
