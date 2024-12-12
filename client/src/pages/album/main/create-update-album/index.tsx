import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import Radio from "@/components/radio";
import Input from "@/components/input";
import Modal from "@/components/modal";
import Button from "@/components/button";
import TextArea from "@/components/textarea";
import SelectBox from "@/components/multi-select-box";
import { producerOptions } from "@/pages/library/create-update-library";

import {
  FieldSchema,
  CreateUpdateAlbumInterface,
  CreateUpdateAlbumDataInterface,
} from "../album-interface";

import { addAlbum, updateAlbum } from "@/api-services/album";

import { Users as UsersApiInterface } from "@/interface/account-interface";
import { ClientsStateInterface } from "@/interface/user-selector-interface";

import styles from "./index.module.scss";

const CreateUpdateAlbum: React.FC<CreateUpdateAlbumInterface> = ({
  open,
  data = {},
  updateAlbums,
  handleModalClose,
  handleUpdateAlbumData,
  handleIncrementUpdatePage,
}) => {
  const { id } = useParams();
  const { users = [] as UsersApiInterface[], loggedInUser } = useSelector(
    (state: any) => state.users,
  );
  const { selectedClient } = useSelector((state: ClientsStateInterface) => state.clients);

  const {
    control,
    setValue,
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FieldSchema>({});

  const {
    name,
    description,
    producers = [],
    status: initialStatus,
  } = data as CreateUpdateAlbumDataInterface;

  const onSubmit = async (data: FieldSchema) => {
    data.clientId = selectedClient;
    data.createdByUser = loggedInUser?._id;
    if (id) {
      try {
        const res = await updateAlbum({ id, data });
        if (res.status === 200) {
          handleUpdateAlbumData && handleUpdateAlbumData({ shortLink: data.shortLink });
          handleModalClose && handleModalClose();
        }
      } catch (error) {
        console.error(error);
      }
      handleModalClose && handleModalClose();
    } else {
      const res = await addAlbum({ data });
      if (res.status === 200) {
        handleModalClose && handleModalClose();
      }
    }
    handleModalClose && handleModalClose();
    updateAlbums && updateAlbums();
    handleIncrementUpdatePage && handleIncrementUpdatePage();
  };

  useEffect(() => {
    if (id) {
      setValue("name", name);
      setValue("producers", producers);
      setValue("description", description);
      setValue("status", initialStatus);
    }
  }, [id]);

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
        <div className={styles.heading}>{id ? "Update" : "Create"} Album </div>
        <div className={styles.fieldContainer}>
          <div className={styles.field}>
            <Input label="Name" name={"name"} required register={register} />
          </div>

          <div className={styles.selectBox}>
            <SelectBox
              showSelected
              isMulti
              selectBoxClass={styles.height}
              control={control}
              label="Producers"
              name="producers"
              placeholder={"Select"}
              options={producerOptions(users) || []}
            />
          </div>

          <div className={styles.textArea}>
            <TextArea
              label="Description (Optional)"
              name="description"
              placeholder={"Tell the Story behind the video"}
              register={register}
            />
          </div>

          {id && (
            <div className={styles.radioContainer}>
              {statusTemplate?.map(({ id, name }, index) => {
                return (
                  <div className={styles.radioContainer} key={index}>
                    <Radio name="status" label={name} radioValue={id} register={register} />
                  </div>
                );
              })}
            </div>
          )}
          <div className={styles.btnGroup}>
            <Button
              styles={{ background: "#1976d2" }}
              titleStyles={{ color: "white" }}
              title="Save"
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
      </form>
    </Modal>
  );
};

export default CreateUpdateAlbum;

const statusTemplate = [
  {
    id: "open",
    name: "Open",
  },
  {
    id: "closed",
    name: "Closed",
  },
  {
    id: "inactive",
    name: "InActive",
  },
];
