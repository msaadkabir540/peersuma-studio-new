import { useEffect } from "react";
import { useParams } from "react-router-dom";

import Modal from "@/components/modal";
import Input from "@/components/input";
import Button from "@/components/button";

import { updateShortLink } from "@/api-services/library";

import { EditShortLinkModalInterface, FormSchemaInterface } from "./edit-short-link-interface";

import styles from "./index.module.scss";

const EditShortLinkModal: React.FC<EditShortLinkModalInterface> = ({
  register,
  setValue,
  handleClose,
  handleSubmit,
  isSubmitting,
  shortLinkText,
  editShortLink,
  handleShotLink,
}) => {
  const { id } = useParams();

  const handleSetShortLink = ({ data }: { data: FormSchemaInterface }) => {
    setValue("shortLink", data?.shortLink);
  };

  const onSubmit = async (data: FormSchemaInterface) => {
    try {
      if (id) {
        const res = await updateShortLink({ id, data });
        if (res.status === 200) {
          setValue("shortLink", res?.updatedLibrary?.shortLink);
        } else {
          handleSetShortLink({ data: res?.updatedLibrary?.shortLink });
        }
        handleShotLink({ shotLink: res?.updatedLibrary?.shortLink });
      }
    } catch (error) {
      console.error(error);
    }
    handleClose();
  };

  useEffect(() => {
    setValue("shortLink", shortLinkText);
  }, []);

  return (
    <Modal open={editShortLink} handleClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h4>Edit Link</h4>
        <div className={styles.field}>
          <div className={styles.inputBase}>
            <span>{import.meta.env.VITE_LIBRARY_SHORT_URL_BASE}</span>
            <Input
              name={"shortLink"}
              register={register}
              className={styles.inputContainer}
              placeholder="Enter Something Unique"
            />
          </div>
        </div>
        <div className={styles.buttons}>
          <Button title="Save" type={"submit"} isLoading={isSubmitting} />
          <Button title="Cancel" type="button" handleClick={handleClose} />
        </div>
      </form>
    </Modal>
  );
};

export default EditShortLinkModal;
