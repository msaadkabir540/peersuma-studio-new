import { useEffect } from "react";
import { useForm } from "react-hook-form";

import Modal from "@/components/modal";
import Input from "@/components/input";
import Button from "@/components/button";

import { updateAlbumShotUrl } from "@/api-services/albumshot";

import {
  EditShortLinkFieldSchema,
  EditShortLinkModalInterface,
  FieldSchemaType,
} from "../../album-interface";

import styles from "./index.module.scss";

const EditShortLinkModal: React.FC<EditShortLinkModalInterface> = ({
  handleClose,
  currentShotId,
  shortLinkText,
  editAlbumShortLink,
  handleIncrementUpdatePage,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<EditShortLinkFieldSchema>();

  useEffect(() => {
    if (shortLinkText) {
      setValue("shotUrl", shortLinkText);
    }
  }, [shortLinkText]);

  const onSubmit = async (data: FieldSchemaType) => {
    const { shotUrl } = data;
    const isUpdated = await updateAlbumShotUrl({
      id: currentShotId,
      shotUrl,
    });
    if (isUpdated) {
      handleClose();
      handleIncrementUpdatePage();
    }
  };

  return (
    <Modal open={editAlbumShortLink} handleClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h4>Edit Link</h4>
        <div className={styles.field}>
          <div className={styles.inputBase}>
            <span>{import.meta.env?.VITE_ALBUM_SHORT_URL_BASE}</span>
            <Input
              name="shotUrl"
              register={register}
              className={styles.inputContainer}
              placeholder="Enter Something Unique"
            />
          </div>
        </div>
        <div className={styles.buttons}>
          <Button title="Save" type="submit" isLoading={isSubmitting} />
          <Button title="Cancel" type="button" handleClick={handleClose} />
        </div>
      </form>
    </Modal>
  );
};

export default EditShortLinkModal;
