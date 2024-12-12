import editIcons from "@/assets/edit.svg";

import styles from "../index.module.scss";

type HeaderType = {
  name: string;
  createdAt: string;
  createdBy: string;
  handleUpdateName: () => void;
};

const MainHeading: React.FC<HeaderType> = ({ name, handleUpdateName, createdAt, createdBy }) => {
  const date = new Date(createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className={styles.albumHeader}>
      <div className={styles.headingContainer}>
        <div className={styles.heading}>
          <h1>{name}</h1>
          <img
            aria-hidden="true"
            onClick={() => handleUpdateName()}
            src={editIcons}
            alt="edit Image"
          />
        </div>
        <div>
          <div className={styles.userNameDate}>Created By: {createdBy}</div>
          <div className={styles.userNameDate}>Created On: {date}</div>
        </div>
      </div>
    </div>
  );
};

export default MainHeading;
