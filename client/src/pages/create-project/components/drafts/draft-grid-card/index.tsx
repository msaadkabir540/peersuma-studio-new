import styles from "./index.module.scss";

const DraftGridCard = ({ name, imageUrl }: { name: string; imageUrl: string }) => {
  return (
    <div className={styles.draftBox}>
      <div className={styles.headerBox}>
        <div className={styles.text}>{name}</div>
        <div>
          <div className={styles.btnBox}>
            {/* <Button
              icon={leftArrow}
              className={styles.btnClass}
              type="button"
              handleClick={() => {
                // setIsOpen(true);
              }}
            /> */}
            {/* 
            <Button
              className={styles.btnClass}
              icon={downloadIcon}
              type="button"
              handleClick={() => {
                // navigate(`/themes/${row?._id}`);
              }}
            /> */}
          </div>
        </div>
      </div>
      <div className={styles.cardImage}>
        <img src={imageUrl} height={323} alt={name} />
      </div>
    </div>
  );
};

export default DraftGridCard;
