import { Control, UseFormRegister, UseFormWatch } from "react-hook-form";

interface FormSchema {
  description: string;
  producers: string[];
  active?: string;
  colorPalette: string;
  widgetTemplate: string;
}

interface DesignInterface {
  control: Control<FormSchema>;
  register: UseFormRegister<FormSchema>;
  watch: UseFormWatch<FormSchema>;
}

export { DesignInterface };
