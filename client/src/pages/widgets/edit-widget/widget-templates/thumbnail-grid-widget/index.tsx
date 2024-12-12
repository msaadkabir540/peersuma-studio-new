import moment from "moment";
import { useState, useEffect, useMemo } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import TryNow from "@/components/try-now";
import ViewAll from "@/components/view-all";
import EmbedWidgetThumb from "../components/embed-widget-thumb";
import TemplateShareSubscribe from "../components/template-share-subscribe";

import { ThumbnailGridTemplateInterface } from "./thumbnail-grid-interface";
import { EmbedWidgetInterface } from "../components/embed-widget-thumb/embed-widget-thumb-interface";

import style from "./thumbnail-grid.module.scss";

const ThumbnailGridTemplate: React.FC<ThumbnailGridTemplateInterface> = ({
  assets,
  widget,
  height,
}) => {
  const [selected, setSelected] = useState({
    _id: "",
    name: "",
    videoUrl: "",
    description: "",
    showHide: false,
  });

  const { userId, updatedAt }: any = selected;

  const uploadedTime = moment(updatedAt).format("MMM DD, YYYY | HH:mm");
  const uploadedByUserName = userId?.username || userId?.fullName || "Superadmin";

  useEffect(() => {
    if (assets && assets.length) {
      setSelected({
        ...(assets[0] as any),
      });
    }
  }, [assets]);

  const handleSelect = ({ item }: { item: EmbedWidgetInterface }) => {
    setSelected({ ...item } as any);
  };

  const shareButton = useMemo(() => {
    return (
      widget.enableShare ||
      widget.show_statistic ||
      widget.showSubscribers ||
      widget.enableSubscribe
    );
  }, [widget]);

  return (
    <div className={style.main} style={{ backgroundColor: widget.backgroundColor }}>
      <div
        className={height ? ` ${height} ${style.widgetContainer} ` : style.widgetContainer}
        aria-label="video player vimeo"
      >
        {selected?.videoUrl && (
          <iframe
            className="embed-responsive-item"
            src={`https://player.vimeo.com/video/${selected?.videoUrl?.split("/")?.pop()}`}
            frameBorder="0"
            title="videoFrame"
            width="100%"
            height="100%"
            aria-label="video player vimeo"
          ></iframe>
        )}
      </div>
      <div>
        {widget.showTitle && (
          <div style={{ color: widget.titleColor }} className={style.title} aria-label={"Title"}>
            {selected?.name}
          </div>
        )}
        {widget.showDescription && (
          <div
            className={`${selected?.showHide ? style?.showDescription : style.description}`}
            style={{ color: widget.textColor }}
            aria-label={"description"}
            onClick={() => setSelected((prev) => ({ ...prev, showHide: !prev?.showHide }))}
          >
            {selected.description ? selected.description : ""}
          </div>
        )}
      </div>

      <div className={style.shareBox}>
        <div style={{ color: widget.textColor }} className={style.uploadedNameClass}>
          <div
            style={{ backgroundColor: widget.textColor, color: widget.backgroundColor }}
            className={style.avatar}
          >
            {uploadedByUserName?.charAt(0)}
          </div>
          <div>
            <div className={style.uploadedheadingClass}>{uploadedByUserName}</div>
            <div className={style.uploadedTimeClass}>{uploadedTime}</div>
          </div>
        </div>
        <div className={style.shareViewClass}>
          {shareButton && <TemplateShareSubscribe widget={widget} />}
          <ViewAll widget={widget} />
        </div>
      </div>
      <div className={style.grid}>
        {assets?.map((item, index) => (
          <EmbedWidgetThumb
            key={index}
            item={item}
            handleSelect={handleSelect}
            avatarColor={widget.textColor}
            thumbnailColor={widget.thumbnailColor}
            textColor={widget.buttonTextColor as string}
            thumbnailTitleColor={widget?.thumbnailTitleColor}
            selected={selected._id === item._id ? true : false}
          />
        ))}
      </div>
      <div className={style.tryNowDiv}>
        <TryNow widget={widget} />
      </div>
    </div>
  );
};

export default ThumbnailGridTemplate;
