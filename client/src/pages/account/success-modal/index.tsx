//
import successLogo from "@/assets/tick-green.png";

import styles from "./index.module.scss";

const SuccessModal = ({ successMessage, heading }: { successMessage: string; heading: string }) => {
  return (
    <>
      <div className={styles.successContainer}>
        <div className={styles.imageContainer}>{<img src={successLogo} alt="" srcSet="" />}</div>
        <div className={styles.textContainer}>
          <div className={styles.heading}>{heading}</div>
          <div className={styles.successMessage}>{successMessage}</div>
        </div>
      </div>
    </>
  );
};

export default SuccessModal;
