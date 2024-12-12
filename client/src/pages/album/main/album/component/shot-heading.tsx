import Button from "@/components/button";

import { AlbumShortInterface } from "../albuminterface";

import editIcons from "@/assets/edit.svg";

import styles from "../index.module.scss";

type ShotHeadingType = {
  currentShot: AlbumShortInterface;
  handleAddUpdatedShot: ({ currentShot }: { currentShot: AlbumShortInterface }) => void;
  handleOpenUploadModal: () => void;
};
const ShotHeading: React.FC<ShotHeadingType> = ({
  currentShot,
  handleAddUpdatedShot,
  handleOpenUploadModal,
}) => {
  return (
    <div className={styles.ShotHeading}>
      <h2>{currentShot?.name}</h2>
      {!currentShot?.isDefault && (
        <img
          aria-hidden="true"
          onClick={() => handleAddUpdatedShot({ currentShot })}
          width={26}
          height={26}
          src={editIcons}
          alt="editIcons"
        />
      )}
      {currentShot?._id && (
        <Button
          title="Upload"
          type="button"
          styles={{ marginLeft: "auto", marginRight: "10px" }}
          handleClick={() => handleOpenUploadModal()}
        />
      )}
    </div>
  );
};
export default ShotHeading;
