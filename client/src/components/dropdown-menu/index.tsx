import { memo, useRef, useState } from "react";

import { DropDownInterface } from "./dropdown-menu";

import { useOutsideClickHook } from "@/utils/helper";

import styles from "./drop.module.scss";

const DropDown: React.FC<DropDownInterface> = ({ title, options }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState<boolean>(false);

  useOutsideClickHook(wrapperRef, () => {
    setOpen(false);
  });

  return (
    <div ref={wrapperRef} className={styles.container}>
      <div
        className={styles.title}
        onClick={() => {
          setOpen((prev) => !prev);
        }}
      >
        {title}
      </div>
      {open && (
        <div className={styles.main}>
          {options?.map((ele, index) => (
            <div className={styles.flex} key={index} onClick={ele.handleClick}>
              <p>{ele?.name || ""}</p>
              {ele?.icon && <img src={ele.icon} alt="menu-icon" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default memo(DropDown);
