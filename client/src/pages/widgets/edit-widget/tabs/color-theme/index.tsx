import { useEffect } from "react";

import Input from "@/components/input";
import SelectBox from "@/components/multi-select-box";

import { palettes } from "@/constants/widget-color-templates";

import { ColorThemeInterface } from "./color-theme-interface";

import styles from "./index.module.scss";

const ColorTheme: React.FC<ColorThemeInterface> = ({
  watch,
  reset,
  widget,
  control,
  setValue,
  register,

  handleColorPalette,
}) => {
  const palette = palettes[+watch("colorPalette")];

  useEffect(() => {
    if (palette) {
      handleColorPalette?.({ colorPalette: palette });
      const { id, name, ...tempPalette } = palette;
      reset({ ...watch(), ...tempPalette });
    }
  }, [palette, watch, reset]);

  useEffect(() => {
    const handleSetValue = () => {
      customizations?.map((customization) => {
        const { name } = customization;
        if (widget?.data[name]) {
          setValue(name, widget?.data[name]);
        }
      });
    };
    setValue("colorPalette", widget?.data?.colorPalette);
    handleSetValue();
  }, [setValue, widget?.data]);

  return (
    <>
      <div className={styles.colorPaletteContainer}>
        <div className={styles.colorPalettes}>Color Palette</div>
        <SelectBox
          wrapperClass={styles.wrapperClass}
          control={control}
          isClearable={true}
          name="colorPalette"
          placeholder="Select Color Palette"
          options={
            palettes?.map(({ id, name }: { id: string; name: string }) => ({
              label: name,
              value: id,
            })) || []
          }
        />
      </div>
      <hr />
      {customizations?.map(({ name, title }, index) => (
        <div key={index} className={styles.colorFields}>
          <label htmlFor={name}>{title}</label>
          <Input
            id={name}
            name={name}
            type={"color"}
            register={register}
            className={styles.inputContainer}
            onChange={(e) => {}}
          />
        </div>
      ))}
    </>
  );
};

export default ColorTheme;

export const customizations = [
  { title: "Background Color", name: "backgroundColor" },
  { title: "Title Color", name: "titleColor" },
  { title: "Text Color", name: "textColor" },
  { title: "Button Color", name: "buttonColor" },
  { title: "Button Text Color", name: "buttonTextColor" },
  { title: "Thumbnail Title Color", name: "thumbnailTitleColor" },
  { title: "Thumbnail Color", name: "thumbnailColor" },
  { title: "Hyper Text Color", name: "hyperTextColor" },
];
