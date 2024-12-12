import Modal from "@/components/modal";
import Button from "@/components/button";

interface EmailModalInterface {
  styles: any;
  mailBox: any;
  modalMessage: any;
  setAlbumData: (argu: any) => void;
}

const EmailModal: React.FC<EmailModalInterface> = ({
  styles,
  mailBox,
  modalMessage,
  setAlbumData,
}) => {
  return (
    <Modal
      className={styles.modalWidth}
      {...{
        open: mailBox,
        handleClose: () => setAlbumData((prev: any) => ({ ...prev, mailBox: false })),
      }}
    >
      <div className={styles.confirmModalContainer}>
        <div className={styles.modalText}>{modalMessage}</div>
        <div className={styles.modalBUtton}>
          <Button
            title="Ok"
            type="button"
            className={styles.cancelBtn}
            handleClick={() => setAlbumData((prev: any) => ({ ...prev, mailBox: false }))}
          />
        </div>
      </div>
    </Modal>
  );
};

export default EmailModal;
