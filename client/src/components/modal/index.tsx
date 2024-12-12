import { memo } from "react";

import { ModalInterface } from "./modal-interface";

import cross from "@/assets/cross.svg";

import style from "./modal.module.scss";

const Modal: React.FC<ModalInterface> = ({
  open,
  children,
  className,
  bodyClass,
  showCross,
  handleClose,
  bodyPadding,
  modalWrapper,
  iconClassName,
}) => {
  return (
    <>
      {open && (
        <div
          className={`${style.modalWrapper} ${modalWrapper}`}
          onClick={(e) => {
            e.nativeEvent.stopImmediatePropagation();
            handleClose?.();
          }}
        >
          <div
            className={`${style.modalContentWrapper} ${className}`}
            onClick={(e) => e.stopPropagation()}
          >
            {showCross && (
              <div className={`${style.showCrossCSS} ${iconClassName}`}>
                <img
                  height={12}
                  style={{ cursor: "pointer" }}
                  src={cross}
                  onClick={() => handleClose?.()}
                  alt="cross"
                />
              </div>
            )}
            <div
              className={`${style.body} ${bodyClass}`}
              {...(bodyPadding && { style: { padding: bodyPadding } })}
            >
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default memo(Modal);
