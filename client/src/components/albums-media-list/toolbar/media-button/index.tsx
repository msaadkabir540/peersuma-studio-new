import { memo, useRef, useState } from "react";

import List from "../list";
import Loading from "@/components/loading";

import { useOutsideClickHook } from "@/utils/helper";

import { MediaButtonInterface } from "../../media-list-interface";

import styles from "../index.module.scss";

const MediaButton = ({
  media,
  title,
  icons,
  index,
  altText,
  mainClass,
  fileFields,
  isListOpen,
  handlClickEvent,
  isButtonLoading,
  clickOnFieldFields,
}: MediaButtonInterface) => {
  const MediaRef = useRef<HTMLDivElement>(null);
  const [isList, setIsList] = useState<boolean>(false);

  const handleListShow = () => {
    setIsList(!isList);
  };

  useOutsideClickHook(MediaRef, () => {
    setIsList(false);
  });

  return isButtonLoading?.isLoading && index === isButtonLoading?.loadingIndex ? (
    <Loading loaderClass={styles.loaderClassDelete} pageLoader={true} diffHeight={20000} />
  ) : (
    <>
      <div className={`${altText === "arrow" && styles.menu}`} ref={MediaRef}>
        <img
          className={mainClass}
          aria-hidden="true"
          alt={altText}
          title={title}
          src={icons}
          onClick={
            isListOpen
              ? () => handleListShow()
              : (e) => {
                  e?.stopPropagation();
                  handlClickEvent && handlClickEvent({ index });
                }
          }
        />
        {isList && (
          <List fileFields={fileFields} clickOnFieldFields={clickOnFieldFields} media={media} />
        )}
      </div>
    </>
  );
};
export default memo(MediaButton);
