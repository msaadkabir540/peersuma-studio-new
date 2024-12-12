import Modal from "@/components/modal";

import Button from "@/components/button";

import delIcon from "@/assets/del-icon.svg";

import style from "../clients.module.scss";

interface DeleteModalInterface {
  deleteAction: { action: any; name: string; id: string };
  handleDelete: (id: string) => void;
  handleDeleteAction: () => void;
}

const DeleteMoal: React.FC<DeleteModalInterface> = ({
  deleteAction,
  handleDelete,
  handleDeleteAction,
}) => {
  return (
    <>
      <Modal
        {...{
          open: deleteAction.action,
          handleClose: () => handleDeleteAction(),
        }}
        className={style.bodyModal}
        modalWrapper={style.opacityModal}
      >
        <div className={style.deleteModal}>
          <img src={delIcon} height={50} alt="delIcon" />
          <h2>Delete Client</h2>
          <p
            style={{
              fontSize: "14px",
              marginBottom: "10px",
            }}
          >
            Are you sure want to delete <strong>{deleteAction.name}</strong>?.
          </p>
          <div className={style.buttonContainer}>
            <Button
              type="button"
              title={"Cancel"}
              handleClick={() => {
                handleDeleteAction();
              }}
              className={style.cancelBtn}
            />
            <Button
              type="button"
              title={"Delete"}
              className={style.delBtn}
              loaderClass={style.loading}
              isLoading={false}
              handleClick={async () => {
                await handleDelete(deleteAction.id);
                handleDeleteAction();
              }}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};
export default DeleteMoal;
