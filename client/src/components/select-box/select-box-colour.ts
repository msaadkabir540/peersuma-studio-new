import chroma from "chroma-js";
import { ControlProps, OptionProps, StylesConfig, DropdownIndicatorProps } from "react-select";

const colorStyles = (errorMessage: string): any => {
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
      minHeight: "41px",
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
      fontSize: "13px",
      color: "#c0c0c0",
      fontWeight: 400,
      fontFamily: "Poppins",
    }),

    multiValue: (styles: StylesConfig, { data }: any) => {
      const color = chroma(data?.color || "black");
      return {
        ...styles,
        backgroundColor: color.alpha(0.1).css(),
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
      color: data?.color || "black",
      ":hover": {
        backgroundColor: data?.color || "black",
        color: "white",
      },
    }),
    dropdownIndicator: (context: DropdownIndicatorProps) => {
      return {
        transform: `rotate(${context?.selectProps?.menuIsOpen ? "180deg" : "0deg"})`,
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
        paddingLeft: 0,
        paddingRight: 0,
      };
    },
  };
};

export default colorStyles;
