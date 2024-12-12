import { useState } from "react";

import TryNowModal from "./try-now-modal";

import { TryNowType } from "./try-now-interface";

import styles from "./index.module.scss";

const TryNow = ({ widget }: TryNowType) => {
  const [openModal, setOpenModal] = useState<boolean>(false);

  return (
    <div
      className={`${
        widget?.widgetTemplate === "verticalStack" ? styles.mainClass : styles.mainContainer
      }`}
    >
      <div style={{ color: widget.hyperTextColor }} className={styles.readyClass}>
        Ready to create your own video?
      </div>
      <button
        className={styles.buttonClass}
        style={{ color: widget?.hyperTextColor }}
        onClick={() => setOpenModal(true)}
      >
        Get started!
      </button>
      {openModal && (
        <TryNowModal
          openModal={openModal}
          widgetName={widget?.name}
          setOpenModal={setOpenModal}
          clientId={widget?.clientId}
          buttonColor={widget?.tryNowButtonColor}
          buttonTextColor={widget?.tryNowButtonTextColor}
        />
      )}
    </div>
  );
};

export default TryNow;
