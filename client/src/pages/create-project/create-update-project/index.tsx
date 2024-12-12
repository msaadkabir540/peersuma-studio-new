import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";

import { createProject, updateProjectNameById } from "@/api-services/projects";

import Input from "@/components/input";
import Modal from "@/components/modal";
import Button from "@/components/button";

import { ClientsStateInterface } from "@/interface/user-selector-interface";

import styles from "./index.module.scss";
import {
  CreateUpdateProjectInterface,
  ProjectFieldSchema,
  projectDataInterface,
} from "./create-update-interface";

const CreateUpdateProject: React.FC<CreateUpdateProjectInterface> = ({
  open,
  data = {},
  handleModalClose,
  handleUpdateProjectData,
  handleIncrementUpdatePage,
}) => {
  const { id } = useParams();
  const { selectedClient } = useSelector((state: ClientsStateInterface) => state.clients);

  const {
    setValue,
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<ProjectFieldSchema>({});

  const { yourName, projectName } = data as projectDataInterface;

  const onSubmit = async (data: ProjectFieldSchema) => {
    data.clientId = selectedClient as string;
    if (id) {
      try {
        const res = await updateProjectNameById({ id, data });
        if (res.status === 200) {
          handleUpdateProjectData &&
            handleUpdateProjectData({ responseData: res.data.newProject?.projectName });
          handleModalClose && handleModalClose();
        }
      } catch (error) {
        console.error(error);
      }
      handleModalClose && handleModalClose();
    } else {
      const res = await createProject({ data });
      if (res.status === 200) {
        handleModalClose && handleModalClose();
      }
    }
    handleModalClose && handleModalClose();
    handleIncrementUpdatePage && handleIncrementUpdatePage();
  };

  useEffect(() => {
    if (id) {
      setValue("yourName", yourName);
      setValue("projectName", projectName);
    }
  }, [id, yourName, projectName]);

  return (
    <Modal
      {...{
        open: open,
        handleClose: () => {
          handleModalClose && handleModalClose();
        },
      }}
      className={styles.modal}
    >
      <form onSubmit={handleSubmit(onSubmit)} className={styles.createContainer}>
        <div className={styles.heading}>{id ? "Update" : "Create"} Project </div>
        <div className={styles.fieldContainer}>
          <div>
            <div className={styles.form1}>
              <div className={styles.field} style={{ marginBottom: "15px" }}>
                <label htmlFor="projectName">Project Name</label>
                <Input
                  name="projectName"
                  register={register}
                  placeholder="Enter Project Name"
                  errorMessage={errors?.projectName?.message}
                />
              </div>
              <div className={styles.field} style={{ marginBottom: "15px" }}>
                <label htmlFor="yourName">Your Name</label>
                <Input
                  name="yourName"
                  placeholder={"Enter Your Name"}
                  register={register}
                  errorMessage={errors?.yourName?.message}
                />
              </div>
              <div className={styles.btnGroup}>
                <Button
                  styles={{ background: "#1976d2" }}
                  titleStyles={{ color: "white" }}
                  title={id ? "Update" : "Save"}
                  type="submit"
                  isLoading={isSubmitting}
                />
                <Button
                  handleClick={() => {
                    handleModalClose && handleModalClose();
                  }}
                  title="Cancel"
                  type="button"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default CreateUpdateProject;
