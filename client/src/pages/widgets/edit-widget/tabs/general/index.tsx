import { Control, UseFormRegister, UseFormWatch, FieldErrors } from "react-hook-form";

import Switch from "@/components/switch";

import WidgetInitialFields from "../../../initial-fields";

import styles from "./index.module.scss";

interface FormSchema {
  description: string;
  producers: string[];
  active?: string;
  colorPalette: string;
  widgetTemplate: string;
}
interface GeneralInterface {
  control: Control<FormSchema>;
  register: UseFormRegister<FormSchema>;
  watch: UseFormWatch<FormSchema>;
  errors: FieldErrors<FormSchema>;
}

const General: React.FC<GeneralInterface> = ({ watch, register, errors, control }) => {
  return (
    <>
      <WidgetInitialFields {...{ watch, register, errors, control }} />
      <div className={styles.switchContainer}>
        <div>Widget Status (Active)</div>
        <Switch
          mainClass={styles.switchMainClass}
          id="active"
          name="active"
          control={control}
          defaultValue={watch("active") ? true : false}
        />
      </div>
    </>
  );
};

export default General;
