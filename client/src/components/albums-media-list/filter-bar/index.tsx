import { memo, useCallback, useMemo } from "react";
import Select from "react-select";

import Button from "@/components/button";
import colorStyles from "@/components/multi-select-box/color-styles";
import formatOptionLabel from "@/components/multi-select-box/format-option-label";

import { FilterBarInterface, SelectOptionType } from "../media-list-interface";

import VisibleIcon from "@/assets/eyeIcon.svg";
import inVisibleIcon from "@/assets/eyeclose.svg";

import styles from "./index.module.scss";

interface DataInterface {
  label: string;
  value: string;
  description: string;
}
interface MetaDataInterface {
  context: string;
  inputValue: string;
  selectValue: DataInterface[];
}

const FilterBar = ({
  mediaOptions,
  isVisibility,
  dispatchAlbum,
  selectedAlbumId,
  handleSearchEvent,
  handleSearchOption,
}: FilterBarInterface) => {
  const handleSelectValue = (selectedOption: SelectOptionType) => {
    const selectionValue = selectedOption ? selectedOption.value : "";
    handleSearchOption({ selectValue: selectionValue });
  };

  const optionsMediaList = useMemo(
    () => mediaOptions?.find((option: SelectOptionType) => option.value === selectedAlbumId),
    [mediaOptions, selectedAlbumId],
  );

  const formatOptionLabel1 = useCallback((data: DataInterface, metaData: MetaDataInterface) => {
    return formatOptionLabel({
      data: {
        data,
        metaData,
        badge: true,
        mediaOption: true,
      },
    });
  }, []);
  const styleColor = useMemo(() => {
    return colorStyles({
      errorMessage: "",
      clearOption: true,
      mediaOption: true,
    });
  }, []);

  return (
    <div className={styles.filterFieldContainer}>
      <input
        type="text"
        name="search"
        placeholder="search"
        className={styles.inputClassName}
        onChange={(e) => handleSearchEvent({ value: e.target.value })}
      />
      <div>
        <Select
          isClearable
          options={mediaOptions}
          placeholder="Select Album"
          className={styles.selectBox}
          onChange={handleSelectValue as () => void}
          formatOptionLabel={formatOptionLabel1 as () => React.ReactNode}
          styles={styleColor}
          value={optionsMediaList}
        />
      </div>
      <Button
        icon={VisibleIcon}
        className={`${isVisibility ? styles.btnActive : ""}`}
        tooltip={"Click here to see all visible media"}
        handleClick={() => dispatchAlbum({ type: "IS_VISIBILITY_STATE", isVisibility: true })}
      />
      <Button
        icon={inVisibleIcon}
        className={`${!isVisibility ? styles.btnActive : ""}`}
        tooltip={"Click here to see all hidden media"}
        handleClick={() => dispatchAlbum({ type: "IS_VISIBILITY_STATE", isVisibility: false })}
      />
    </div>
  );
};

export default memo(FilterBar);
