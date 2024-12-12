import { useRef } from "react";

import { useOutsideClickHook } from "@/utils/helper";

import delIcon from "@/assets/del-icon.svg";
import renameIcon from "@/assets/rename.png";
import editIcon from "@/assets/edit-video.png";
import goTODraftsIcons from "@/assets/editing.png";

import { ContextMenuInterface } from "./video-transcription";

import styles from "./styles.module.scss";

const ContextMenu = ({
  id,
  name,
  label,
  fieldName,
  activeTab,
  setIsOpen,
  renameAllow,
  readyToDraft,
  handleMenuOpen,
  getMenuPosition,
  handleClipClick,
  handleClipDelete,
  handleReadyToDraft,
  stagingHandleEvent,
}: ContextMenuInterface) => {
  const contextMenuRef = useRef<HTMLDivElement>(null);

  useOutsideClickHook(contextMenuRef, () => {
    setIsOpen(false);
  });

  return (
    <div className={styles.modalContainer} ref={contextMenuRef} style={getMenuPosition}>
      <ul>
        {renameAllow && (
          <>
            <li
              onClick={(e) => {
                stagingHandleEvent();
                setIsOpen(false);
                handleClipClick && handleClipClick(e as React.MouseEvent<Element, MouseEvent>);
              }}
            >
              Edit
              <img
                aria-hidden="true"
                src={renameIcon}
                className={styles.iconClass}
                style={{ marginLeft: "auto" }}
                alt="delete-icon"
              />
            </li>
            {activeTab && (
              <li
                onClick={(e) => {
                  e.stopPropagation();
                  handleMenuOpen && handleMenuOpen({ id, fieldName, label, name });
                  setIsOpen(false);
                }}
              >
                Rename
                <img
                  aria-hidden="true"
                  className={styles.iconClass}
                  src={editIcon}
                  style={{ marginLeft: "auto" }}
                  alt="delete-icon"
                />
              </li>
            )}
          </>
        )}
        {readyToDraft && (
          <li
            onClick={(e) => {
              e.stopPropagation();
              handleReadyToDraft && handleReadyToDraft(e as React.MouseEvent<Element, MouseEvent>);
              // handleClipDelete(e as React.MouseEvent<Element, MouseEvent>);
            }}
          >
            Add to Draft
            <img
              title=" ready to drafts"
              aria-hidden="true"
              src={goTODraftsIcons}
              className={styles.iconClass}
              style={{ marginLeft: "auto" }}
              alt="delete-icon"
            />
          </li>
        )}
        <li
          onClick={(e) => {
            e.stopPropagation();
            handleClipDelete(e as React.MouseEvent<Element, MouseEvent>);
          }}
        >
          Delete
          <img
            aria-hidden="true"
            src={delIcon}
            className={styles.iconClass}
            style={{ marginLeft: "auto" }}
            alt="delete-icon"
          />
        </li>
      </ul>
    </div>
  );
};

export default ContextMenu;
