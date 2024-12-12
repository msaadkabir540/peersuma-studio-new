import { memo, useCallback, useEffect, useState } from "react";

import Modal from "@/components/modal";
import Button from "@/components/button";

import { RenameClipModalInterface } from "./rename-clip-interface";

import styles from "./index.module.scss";

const RenameClipModal = ({
  clipName,
  handleUpdate,
  isRenameModal,
  stagingFields,
  setRenameVideoClip,
}: RenameClipModalInterface) => {
  const [text, setText] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleRenameClip = useCallback(() => {
    const findClipName = stagingFields
      ?.filter((stagingField) => stagingField?.type === "video")
      ?.flatMap((data) => [data?.value.leftValue, data?.value.rightValue])
      ?.reduce((accumulator, currentValue) => accumulator.concat(currentValue), []);

    const isUniqueName = findClipName?.find((data) => data?.name === text);
    if (text.trim().length === 0) {
      setError("Clip name can't be empty");
    } else if (isUniqueName) {
      setError("clip name must be unique");
    } else {
      setRenameVideoClip((prev) => ({
        ...prev,
        isRenameModal: false,
        renameText: text,
      }));
      handleUpdate({ text });
    }
  }, [handleUpdate, setRenameVideoClip, stagingFields, text]);

  useEffect(() => {
    if (clipName) {
      setText(clipName);
    }
  }, [clipName]);

  return (
    <Modal
      {...{
        className: styles.renameModal,
        open: isRenameModal,
      }}
    >
      <h3 className={styles.clipHeading}>Rename Clip Name</h3>
      <input
        className={styles.renameClass}
        onChange={(e) => {
          const value = e.target.value;
          setText(value);
        }}
        value={text}
        placeholder="Enter Clip Name"
      />
      <p className={styles.error}>{error && error}</p>
      <div className={styles.renameBtnContainer}>
        <Button title="Save" handleClick={() => handleRenameClip()} />
        <Button
          title="Cancel"
          handleClick={() => {
            setRenameVideoClip((prev) => ({
              ...prev,
              isRenameModal: false,
              clipId: "",
              renameText: "",
              fieldName: "",
              label: "",
            }));
          }}
        />
      </div>
    </Modal>
  );
};

export default memo(RenameClipModal);
