import {
  Control,
  UseFormRegister,
  UseFormWatch,
  UseFormReset,
  UseFormSetValue,
} from "react-hook-form";

import { WidgetInterface } from "../../update-widget-interface";

interface FormSchema {
  description: string;
  producers: string[];
  active?: string;
  colorPalette: string;
  widgetTemplate: string;
}

interface ColorThemeInterface {
  widget: WidgetInterface;
  control: Control<FormSchema>;
  register: UseFormRegister<FormSchema>;
  watch: UseFormWatch<FormSchema>;
  reset: UseFormReset<FormSchema>;
  setValue: UseFormSetValue<FormSchema>;
  handleColorPalette?: ({ colorPalette }: { colorPalette: any }) => void;
}

export { ColorThemeInterface };
