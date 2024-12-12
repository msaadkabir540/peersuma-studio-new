import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import Container from "@/components/container";

import { getLibraryWidgetById } from "@/api-services/library";

import TemplateShareSubscribe from "@/pages/widgets/edit-widget/widget-templates/components/template-share-subscribe";

import { MediaFileInterface } from "../showcase/showcase-interface";

import styles from "./index.module.scss";

const Player = () => {
  const { search } = useLocation();

  const [widgetData, setWidgetData] = useState<MediaFileInterface>({} as MediaFileInterface);

  const data = {
    name: widgetData?.name,
    enableShare: true,
    buttonTextColor: "black",
    buttonColor: "white",
    video_name: widgetData?.name,
    video_url: window.location.href,
  };

  const query = new URLSearchParams(search);
  const id = query.get("id") || undefined;
  const shortLink = query.get("v") || undefined;

  const getLibraryWidget = async () => {
    try {
      const res = await getLibraryWidgetById({ params: { id, shortLink } });
      if (res.status === 200) {
        setWidgetData({ ...res.data });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    (id || shortLink) && getLibraryWidget();
  }, [id, shortLink]);

  return (
    <div className={styles.container}>
      <div className={styles.mainContainer}>
        {widgetData?.videoUrl && (
          <iframe
            src={`https://player.vimeo.com/video/${widgetData?.videoUrl
              ?.split(".com/")?.[1]
              ?.split("/")?.[0]}?h=${
              widgetData?.videoUrl?.split(".com/")?.[1]?.split("/")?.[1] || undefined
            }&amp;title=0&amp;amp;byline=0&amp;amp;portrait=0&amp;amp;autoplay=0&amp;amp;loop=0`}
            width="400"
            height="500"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title="New Digital Media Class at Amity Middle School Orange"
            data-ready="true"
            style={{ width: "100%", height: "500px" }}
          ></iframe>
        )}
      </div>
      <Container>
        <div className={styles.textContainer}>
          <div className={styles.name}>{widgetData?.name}</div>
          <div className={styles.description}>{widgetData?.description}</div>
          {widgetData?.shareable && (
            <div className={styles.btnContainer}>
              <TemplateShareSubscribe widget={data as any} />
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default Player;
