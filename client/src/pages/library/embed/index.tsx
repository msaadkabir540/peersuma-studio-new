import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { MediaFileInterface } from "../showcase/showcase-interface";
import CarouselTemplate from "@/pages/widgets/edit-widget/widget-templates/carousel-widget";
import SlideShowTemplate from "@/pages/widgets/edit-widget/widget-templates/slide-show-widget";
import ThumbnailGridTemplate from "@/pages/widgets/edit-widget/widget-templates/thumbnail-grid-widget";
import VerticalStackTemplate from "@/pages/widgets/edit-widget/widget-templates/vertical-stack-widget";

import { getWidgetById } from "@/api-services/widget";

import {
  ShowcaseDataInterface,
  RouteParamsInterface,
  AssetsInterface,
  widgetTemplateInterface,
} from "./embed-interface";
import {
  CarouselTemplateInterface,
  widgetInterface,
} from "@/pages/widgets/edit-widget/widget-templates/carousel-widget/carousel-interface";
import { SlideShowTemplateInterface } from "@/pages/widgets/edit-widget/widget-templates/slide-show-widget/slide-show-interface";
import { ThumbnailGridTemplateInterface } from "@/pages/widgets/edit-widget/widget-templates/thumbnail-grid-widget/thumbnail-grid-interface";
import { VerticalStackTemplateInterface } from "@/pages/widgets/edit-widget/widget-templates/vertical-stack-widget/vertical-stack-interface";

import styles from "./index.module.scss";
import { default as verticalStack } from "./verticalt-stack.module.scss";
import { default as carouselTemplate } from "./carousel-template.module.scss";
import { default as verticalStackEmbedWidget } from "./vertical-stack-embed-widget.module.scss";

const Embed: React.FC = () => {
  const { id } = useParams<RouteParamsInterface>();
  const [showCase, setShoWCase] = useState<ShowcaseDataInterface>({
    data: {} as AssetsInterface,
  });

  const assets = showCase?.data?.media?.map(({ _id }) => _id) as AssetsInterface[];

  useEffect(() => {
    id && handleGetWidgetById();
    const body = document?.getElementById("body");
    if (body) {
      body.style.backgroundColor = "transparent";
    }
  }, [id]);

  const handleGetWidgetById = async () => {
    try {
      const res = await getWidgetById({ _id: id as string });
      if (res?.status === 200) {
        const now = new Date();
        const fromDate = new Date(now.getFullYear(), 0, 1).getTime();
        const toDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999).getTime();

        const filteredData =
          res.data?.media?.filter(({ _id }: { _id: MediaFileInterface }) => {
            const updatedAtTime = new Date(_id.updatedAt).getTime();
            return updatedAtTime >= fromDate && updatedAtTime <= toDate;
          }) ?? [];

        const finalData = { ...res.data, media: filteredData };

        setShoWCase((prev) => ({ ...prev, data: finalData }));

        setShoWCase((prev) => ({ ...prev, data: finalData }));
      }
    } catch (error) {
      console.error(error);
    }
  };
  const widgetData = { ...showCase?.data, subscribers: 107 };

  const widgetTemplate: widgetTemplateInterface = {
    carousel: (
      <CarouselTemplate
        {...({
          assets,
          widget: widgetData as widgetInterface,
          customStyle: carouselTemplate,
        } as CarouselTemplateInterface)}
      />
    ),
    slideshow: (
      <SlideShowTemplate
        {...({
          assets,
          widget: {
            ...showCase?.data,
            subscribers: 107,
          },
        } as SlideShowTemplateInterface)}
      />
    ),
    thumbnailGrid: (
      <ThumbnailGridTemplate
        {...({
          assets,
          widget: {
            ...showCase?.data,
            subscribers: 107,
          },
          height: styles.thumbnailGridHeight,
        } as ThumbnailGridTemplateInterface)}
      />
    ),
    verticalStack: (
      <VerticalStackTemplate
        {...({
          assets,
          widget: {
            ...showCase?.data,
            subscribers: 107,
          },
          customStyle: verticalStack as React.CSSProperties,
          customEmbedStyle: verticalStackEmbedWidget as React.CSSProperties,
        } as VerticalStackTemplateInterface)}
      />
    ),
  };

  return (
    <div>
      {widgetTemplate[showCase?.data?.widgetTemplate as keyof widgetTemplateInterface] ||
        widgetTemplate["verticalStack"]}
    </div>
  );
};

export default Embed;
