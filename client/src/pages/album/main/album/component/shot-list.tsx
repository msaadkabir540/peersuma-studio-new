import Button from "@/components/button";

import { AlbumShortInterface } from "../albuminterface";

import plusIcon from "@/assets/plusIcon.png";

import styles from "../index.module.scss";

type ShotListInterface = {
  albumShots: AlbumShortInterface[];
  currentShotId: string;
  handleAddShot: () => void;
  handleSetCurrentShot: ({ shot }: { shot: AlbumShortInterface }) => void;
};

const ShotList: React.FC<ShotListInterface> = ({
  albumShots,
  currentShotId,
  handleAddShot,
  handleSetCurrentShot,
}) => {
  return (
    <div className={styles.shotArea}>
      {albumShots?.map((shot) => {
        return (
          <Button
            key={shot._id}
            title={shot.name}
            handleClick={() => handleSetCurrentShot({ shot })}
            className={styles.addShot}
            styles={{
              background: currentShotId === shot?._id ? "#1976d2" : "rgba(25, 118, 210, 0.05)",
            }}
            titleStyles={{ color: currentShotId === shot?._id ? "white" : "black" }}
          />
        );
      })}

      <Button
        icon={plusIcon}
        handleClick={() => handleAddShot()}
        className={styles.addShot}
        iconSize={{ width: 14, height: 14 }}
      />
    </div>
  );
};

export default ShotList;
