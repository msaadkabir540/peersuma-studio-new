import { ReactNode } from "react";

import headerImage from "@/assets/bg-full-image.svg";

import styles from "./index.module.scss";

const ScreenContainer = ({ children }: { children: ReactNode | JSX.Element }) => {
  return (
    <>
      <div className={styles.headerContainer}>
        <div className={styles.leftContainer}>{children}</div>
        <div className={styles.rightContainer}>
          <img src={headerImage} alt="headerImage" />
        </div>
      </div>
    </>
  );
};

export default ScreenContainer;
