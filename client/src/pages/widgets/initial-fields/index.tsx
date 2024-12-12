import { useSelector } from "react-redux";
import { producerOptions } from "@/pages/library/create-update-library";

import Input from "@/components/input";
import TextArea from "@/components/textarea";
import SelectBox from "@/components/multi-select-box";

import { WidgetInitialFieldsInterface } from "../interface";
import { Users as UsersApiInterface } from "@/interface/account-interface";

import styles from "./index.module.scss";

const WidgetInitialFields: React.FC<WidgetInitialFieldsInterface> = ({
  watch,
  register,
  errors,
  control,
}) => {
  const { users = [] as UsersApiInterface[] } = useSelector((state: any) => state.users);

  return (
    <>
      <Input
        value={watch && watch("name")}
        name={"name"}
        label="Name"
        labelClass={styles.widgetLabelClass}
        register={register}
        className={styles.widgetNameField}
      />
      <TextArea
        name="description"
        label="Description"
        register={register}
        rows={4}
        className={styles.TextAreaField}
        placeholder={"Enter Description"}
        errorMessage={errors?.description?.message}
      />
      <SelectBox
        isMulti
        name="producers"
        control={control}
        isClearable={true}
        wrapperClass={styles.WidgetSelectionField}
        label="Permission to assign videos"
        options={producerOptions(users) || []}
      />
    </>
  );
};

export default WidgetInitialFields;
