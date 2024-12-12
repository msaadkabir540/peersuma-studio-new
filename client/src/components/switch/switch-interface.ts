import { FieldValues, Control } from "react-hook-form";

interface SwitchInterface {
  id?: string;
  name: string;
  label?: string;
  title?: string;
  className?: string;
  mainClass?: string;
  toolTip?: string;
  errorMessage?: string;
  silderClass?: string;
  defaultValue?: boolean;
  disabled?: boolean;
  switchContainer?: string;
  handleClick?: () => void;
  control: Control<FieldValues | any>;
  handleSwitchChange?: (argu: boolean) => void;
}

export { SwitchInterface };
