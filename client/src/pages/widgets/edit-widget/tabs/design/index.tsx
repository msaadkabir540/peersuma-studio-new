import { memo } from "react";

import Radio from "@/components/radio";
import Switch from "@/components/switch";

import { DesignInterface } from "./design-interface";

import styles from "./index.module.scss";

const Design: React.FC<DesignInterface> = ({ control, register, watch }) => {
  return (
    <>
      {widgetTemplate.map(({ id, name, description }) => (
        <div key={id}>
          <Radio
            className={styles.radioClassName}
            name={"widgetTemplate"}
            label={name}
            register={register}
            radioValue={id}
          />
          <p className={styles.description}>{description}</p>
        </div>
      ))}
      <hr />

      {customizations.map(({ name, title }, index) => (
        <div key={index} className={styles.customizations}>
          <label className={styles.lables} htmlFor={name}>
            {title}
          </label>
          <Switch
            id={name}
            name={name}
            silderClass={styles.silderClass}
            switchContainer={styles.switchContainer}
            control={control}
            defaultValue={watch("name" as any) ? true : false}
          />
        </div>
      ))}
    </>
  );
};

export default memo(Design);

const widgetTemplate = [
  {
    id: "carousel",
    name: "Carousel",
    description: "This style looks great in the center of a web page",
  },
  {
    id: "slideshow",
    name: "SlideShow",
    description: "Select this style if you are displaying a single video",
  },
  {
    id: "thumbnailGrid",
    name: "Thumbnail Grid",
    description:
      "Select this style if you are displaying all videos in large thumbnail without paginating or carrousel effect",
  },
  {
    id: "verticalStack",
    name: "Vertical Stack",
    description: "This style looks best when aligned along the right side of the web page",
  },
];

const customizations = [
  { title: "Show title", name: "showTitle" },
  { title: "Show description", name: "showDescription" },
  { title: "Enable social share", name: "enableShare" },
];
