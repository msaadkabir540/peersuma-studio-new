import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate, NavigateFunction } from "react-router-dom";

import Button from "@/components/button";
import WidgetInitialFields from "../initial-fields";

import { createWidget } from "@/api-services/widget";

import { FormSchema } from "../interface";

import styles from "./index.module.scss";

const CreateWidget = () => {
  const navigate: NavigateFunction = useNavigate();
  const { selectedClient } = useSelector((state: any) => state.clients);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    formState: { isSubmitting },
  } = useForm<FormSchema>({
    defaultValues: {
      name: "",
      description: "",
      producers: [],
    },
  });

  const onSubmit = async (data: FormSchema) => {
    await createWidget({ data: { ...data, clientId: selectedClient }, navigate });
  };

  return (
    <div className={styles.container}>
      <h3>Create Widget</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <WidgetInitialFields {...{ register, errors, control }} />
        <div className={styles.buttonContainer}>
          <Button
            type="button"
            title="Cancel"
            className={styles.cancelClass}
            ariaLabel="Cancel"
            handleClick={() => {
              navigate("/widgets");
            }}
          />
          <Button title="Save" type="submit" ariaLabel="Save" isLoading={isSubmitting} />
        </div>
      </form>
    </div>
  );
};

export default CreateWidget;
