import moment from "moment";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";

import Input from "@/components/input";
import Modal from "@/components/modal";
import Button from "@/components/button";
import TextArea from "@/components/textarea";

import createNotification from "@/common/create-notification";

import { addAlbumshot, deleteAlbumshot, updateAlbumshot } from "@/api-services/albumshot";

import {
  CreateUpdateShotInterface,
  FormDataInterface,
  AlbumShortInterface,
  CreateUpdateShotFormSchema,
} from "./create-update-shot-interface";

import styles from "./index.module.scss";

const CreateUpdateAlbumshot: React.FC<CreateUpdateShotInterface> = ({
  open,
  data = {},
  handleClickOpen,
  handleIncrementUpdatePage,
}) => {
  const { id } = useParams(); // album ID

  const {
    setValue,
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<CreateUpdateShotFormSchema>({});

  const { _id, media, name, dueDate, description } = data as AlbumShortInterface;

  useEffect(() => {
    if (_id) {
      setValue("name", name);
      setValue("dueDate", moment(dueDate).format("YYYY-MM-DD"));
      setValue("description", description);
    }
  }, [_id]);

  const onSubmit: SubmitHandler<CreateUpdateShotFormSchema> = async (data) => {
    const newShot = _id
      ? await updateAlbumshot(_id, data as FormDataInterface)
      : await addAlbumshot({ ...data, album: id } as FormDataInterface);
    if (newShot) {
      handleIncrementUpdatePage();
      handleClickOpen(false);
    }
  };

  const deleteHandler = async () => {
    if (media?.length) {
      handleClickOpen(false);
      return createNotification("error", "Please delete the media first!");
    }
    await deleteAlbumshot(_id);
    handleIncrementUpdatePage();
    handleClickOpen(false);
  };

  return (
    <Modal
      {...{
        open: open,
        handleClose: () => handleClickOpen(false),
      }}
      className={styles.modal}
    >
      <form onSubmit={handleSubmit(onSubmit)} className={styles.createContainer}>
        <div className={styles.heading}>{_id ? "Update" : "Create"} Scene </div>
        <div className={styles.fieldContainer}>
          <div className={styles.field}>
            <Input
              label="Name"
              name="name"
              register={register}
              required
              errorClass={styles.errorClass}
            />
          </div>
          <div className={styles.field}>
            <Input type="date" label="Due Date (optional)" name="dueDate" register={register} />
          </div>

          <div className={`${styles.textArea} ${styles.field}`}>
            <TextArea label="Description" name="description" register={register} />
          </div>

          <div className={styles.btnGroup}>
            <Button
              styles={{ background: "#1976d2" }}
              titleStyles={{ color: "white" }}
              title={_id ? "Update" : "Save"}
              type="submit"
              isLoading={isSubmitting}
            />
            {_id && (
              <Button
                handleClick={deleteHandler}
                title="Delete"
                type="button"
                className={styles.deleteBtn}
                titleStyles={{ color: "#b71c1c", fontWeight: 500 }}
              />
            )}
            <Button
              handleClick={() => handleClickOpen(false)}
              title="Cancel"
              type="button"
              titleStyles={{ fontWeight: 500 }}
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default CreateUpdateAlbumshot;
