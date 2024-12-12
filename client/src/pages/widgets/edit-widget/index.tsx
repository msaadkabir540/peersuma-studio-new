import { useSelector } from "react-redux";
import { SubmitHandler, useForm } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Design from "./tabs/design";
import General from "./tabs/general";

import Tabs from "@/components/tabs";
import Button from "@/components/button";
import ColorTheme from "./tabs/color-theme";
import CarouselTemplate from "./widget-templates/carousel-widget";
import SlideShowTemplate from "./widget-templates/slide-show-widget";
import VerticalStackTemplate from "./widget-templates/vertical-stack-widget";
import ThumbnailGridTemplate from "./widget-templates/thumbnail-grid-widget";

import { assets } from "@/constants/assets_example";
import { getWidgetById, updateWidget } from "@/api-services/widget";

import { ClientsStateInterface } from "@/interface/user-selector-interface";
import {
  TabComponentInterface,
  WidgetDataType,
  WidgetInterface,
  widgetTemplateInterface,
} from "./update-widget-interface";
import { CarouselTemplateInterface } from "./widget-templates/carousel-widget/carousel-interface";
import { SlideShowTemplateInterface } from "./widget-templates/slide-show-widget/slide-show-interface";
import { ThumbnailGridTemplateInterface } from "./widget-templates/thumbnail-grid-widget/thumbnail-grid-interface";
import { VerticalStackTemplateInterface } from "./widget-templates/vertical-stack-widget/vertical-stack-interface";

import styles from "./index.module.scss";

interface FormSchema {
  description: string;
  producers: string[];
  active?: string;
  colorPalette: string;
  widgetTemplate: string;
}

const UpdateWidget = () => {
  const { _id } = useParams();
  const navigate = useNavigate();
  const { selectedClient } = useSelector((state: ClientsStateInterface) => state.clients);
  const {
    watch,
    reset,
    control,
    setValue,
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<FormSchema>();

  const [widget, setWidget] = useState<WidgetInterface>({ active: 0, data: {} as WidgetDataType });
  const { active } = widget;

  const onSubmit: SubmitHandler<FormSchema | any> = async (data: WidgetDataType) => {
    delete data?._id;
    try {
      const res = await updateWidget({
        _id,
        data: { ...data, clientId: selectedClient as string },
      } as any);
      if (res.status === 200) {
        setWidget((prev) => {
          prev.data = res.data.updatedWidget;
          return {
            ...prev,
            // loader: { ...prev.loader, createUpdateCategory: false },
          };
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const media = assets.map(
    ({
      asset: {
        id,
        public_name,
        public_description,
        version: { external_id, thumbnails },
      },
    }) => ({
      _id: id,
      name: public_name,
      description: public_description,
      thumbnailUrl: thumbnails[2].url_image,
      videoUrl: `${import.meta.env.VITE_LIBRARY_SHORT_URL_BASE}${external_id}`,
    }),
  );

  const templateProps = useMemo(() => {
    return {
      assets: media,
      widget: {
        ...watch(),
        subscribers: 107,
      },
    };
  }, [media, watch()]);

  const handleColorPalette = ({ colorPalette }: { colorPalette: any }) => {
    const { id, name, ...tempPalette } = colorPalette;
    setWidget((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        colorPalette: id,
        ...tempPalette,
      },
    }));
  };

  const tabsComponents = {
    0: <General {...{ watch, register, errors, control }} />,
    1: <Design {...{ control, register, watch }} />,
    2: (
      <ColorTheme
        {...{ control, register, watch, reset, setValue, widget }}
        handleColorPalette={handleColorPalette}
      />
    ),
  };

  const widgetTemplate: widgetTemplateInterface = {
    carousel: <CarouselTemplate {...(templateProps as CarouselTemplateInterface)} />,
    slideshow: <SlideShowTemplate {...(templateProps as SlideShowTemplateInterface)} />,
    thumbnailGrid: <ThumbnailGridTemplate {...(templateProps as ThumbnailGridTemplateInterface)} />,
    verticalStack: <VerticalStackTemplate {...(templateProps as VerticalStackTemplateInterface)} />,
  };

  const getWidgetByID = async () => {
    try {
      const res = await getWidgetById({ _id } as any);
      if (res.status === 200) {
        setWidget((prev: any) => ({ ...prev, data: res.data }));
        const { createdAt, updatedAt, __v, ...temp } = res.data;
        reset({
          ...temp,
          colorPalette: +temp?.colorPalette || 1,
          textColor: temp?.textColor || "#FFD6AF",
          buttonColor: temp?.buttonColor || "#1C1C20",
          thumbnailColor: temp?.thumbnailColor || "#EE5F1D",
          widgetTemplate: temp?.widgetTemplate || "carousel",
          backgroundColor: temp?.backgroundColor || "#1C1C20",
          buttonTextColor: temp?.buttonTextColor || "#FFD6AF",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getWidgetByID();
  }, []);

  const handleTabClick = ({ index }: { index: number }) =>
    setWidget((prev) => ({ ...prev, active: index }));

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <Tabs {...{ tabs: tabs({ handleTabClick }), active }} />
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.tabContainer}>
            {tabsComponents[active as keyof TabComponentInterface]}
          </div>
          <div className={styles.buttonContainer}>
            <Button
              type="button"
              title="Cancel"
              className={styles.cancelBtn}
              ariaLabel="Cancel"
              handleClick={() => {
                navigate("/widgets");
              }}
            />
            <Button
              className={styles.saveBtn}
              title="Save"
              ariaLabel="Save"
              type="submit"
              isLoading={isSubmitting}
            />
          </div>
        </form>
      </div>
      <div className={styles.widgetContainer}>
        {widgetTemplate[(watch("widgetTemplate") as keyof widgetTemplateInterface) || "showcase"]}
      </div>
    </div>
  );
};

export default UpdateWidget;

const tabs = ({ handleTabClick }: any) => {
  return [
    { title: "General", handleClick: handleTabClick },
    { title: "Design", handleClick: handleTabClick },
    { title: "Color Theme", handleClick: handleTabClick },
  ];
};
