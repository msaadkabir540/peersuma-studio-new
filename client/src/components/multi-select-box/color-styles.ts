import chroma from "chroma-js";
import { ControlProps, OptionProps, StylesConfig } from "react-select";

const colorStyles = ({
  errorMessage,
  clearOption,
  mediaOption,
}: {
  errorMessage: string;
  clearOption: boolean;
  mediaOption?: boolean;
}): any => {
  return {
    control: (styles: StylesConfig, state: ControlProps) => ({
      ...styles,
      background: "transparent !important",
      border: errorMessage ? "1px solid red !important" : "1px solid #c0c0c0 !important",
      boxShadow: "none",
      borderRadius: "4px",
      display: "flex !important",
      alignItems: "center !important",
      padding: "0px 10px",
      minHeight: mediaOption ? "20px" : "36px",
      maxHeight: mediaOption ? "26px" : "",
      cursor: "pointer",
      "&:hover": {
        outline: state.isFocused ? 0 : 0,
      },
    }),
    option: (styles: any, { isDisabled, isFocused, isSelected }: OptionProps) => {
      const color = chroma("#333333");
      return {
        ...styles,
        backgroundColor: isDisabled
          ? undefined
          : isSelected
            ? "#fff"
            : isFocused
              ? color.alpha(0.1).css()
              : undefined,
        color: isDisabled
          ? "#ccc"
          : isSelected
            ? chroma.contrast(color, "#333333") > 2
              ? "white"
              : "#333333"
            : "#333333",
        cursor: isDisabled ? "not-allowed" : "#fff",
        ":active": {
          ...styles[":active"],
          backgroundColor: !isDisabled ? (isSelected ? "#fff" : color.alpha(0.3).css()) : "#fff",
          zIndex: "5000 !important",
        },
      };
    },
    placeholder: (styles: StylesConfig) => ({
      ...styles,
      fontSize: mediaOption ? "12px" : "13px",
      color: "#c0c0c0",
      fontWeight: 400,
      fontFamily: "Poppins",
      marginTop: mediaOption ? "-10px" : "",
    }),
    singleValue: (styles: StylesConfig) => ({
      ...styles,
      fontWeight: 400,
      marginTop: mediaOption ? "-10px" : "",
    }),
    multiValue: (styles: StylesConfig, { data }: any) => {
      // const color = chroma(data?.color || "black");
      return {
        ...styles,
        backgroundColor: "#d9d9d9",
        borderRadius: "30px",
      };
    },
    multiValueLabel: (styles: StylesConfig, { data }: any) => ({
      ...styles,
      color: data?.color || "#333333",
      overflow: "hidden",
      maxWidth: "150px ",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
    }),
    multiValueRemove: (styles: StylesConfig, { data }: any) => ({
      ...styles,
      display: !clearOption ? "none" : "flex",
      color: data?.color || "black",
      ":hover": {
        backgroundColor: data?.color || "black",
        borderRadius: "30px",
        color: "white",
        marginTop: "6px",
        height: "20px",
      },
    }),
    dropdownIndicator: (_: any, context: any) => {
      return {
        transform: `rotate(${context.selectProps.menuIsOpen ? "180deg" : "0deg"})`,
        transition: "transform 0.2s",
        color: "var(--primary-color)",
        padding: "8px 0 0 0",
      };
    },
    clearIndicator: () => {
      return {
        padding: "8px 0 0 0",
      };
    },
    valueContainer: (styles: StylesConfig) => {
      return {
        ...styles,
        padding: 0,
      };
    },
    indicatorsContainer: (styles: StylesConfig) => {
      return {
        ...styles,
        padding: mediaOption ? "0px !important" : "",
        marginTop: mediaOption ? "-8px" : "",
      };
    },
  };
};

export default colorStyles;
