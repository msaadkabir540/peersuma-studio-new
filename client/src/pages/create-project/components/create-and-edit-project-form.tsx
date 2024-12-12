import { memo } from "react";

import Button from "@/components/button";

import { CreateAndEditProjectFormPropsInterface } from "./interface";

import styles from "../index.module.scss";

const CreateAndEditProjectForm: React.FC<CreateAndEditProjectFormPropsInterface> = ({
  selectTemplateEvent,
}) => {
  return (
    <div className={styles.form1}>
      <Button title="Select Template" handleClick={selectTemplateEvent} />
    </div>
  );
};

export default memo(CreateAndEditProjectForm);
