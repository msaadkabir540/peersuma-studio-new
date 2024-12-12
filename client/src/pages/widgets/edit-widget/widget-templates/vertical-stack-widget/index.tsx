import moment from "moment";
import { useState, useEffect, useMemo } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import TryNow from "@/components/try-now";
import ViewAll from "@/components/view-all";
import EmbedWidgetThumb from "./embed-widget-thumb";
import TemplateShareSubscribe from "../components/template-share-subscribe";

import { VerticalStackTemplateInterface } from "./vertical-stack-interface";
import { EmbedWidgetInterface } from "./embed-widget-thumb/embed-widget-interface";

import { default as defaultStyle } from "./vertical-stack.module.scss";

const VerticalStackTemplate: React.FC<VerticalStackTemplateInterface> = ({
  assets,
  widget,
  customStyle,
  customEmbedStyle,
}) => {
  const style = customStyle || defaultStyle;

  const [selected, setSelected] = useState({
    _id: "",
    name: "",
    videoUrl: "",
    description: "",
    showHide: false,
  });

  useEffect(() => {
    if (assets && assets.length) {
      setSelected({ ...assets[0] });
    }
  }, [assets]);

  const { userId, updatedAt }: any = selected;
  const uploadedTime = moment(updatedAt).format("MMM DD, YYYY | HH:mm");
  const uploadedByUserName = userId?.username || userId?.fullName || "Superadmin";

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
    <>
      <div className={style.main} style={{ backgroundColor: widget.backgroundColor }}>
        <div className={style.rightPane}>
          {widget.showTitle && (
            <div style={{ color: widget.titleColor }} className={style.name} aria-label={"Title"}>
              {selected.name}
            </div>
          )}
          {widget.showDescription && (
            <div
              onClick={() => setSelected((prev) => ({ ...prev, showHide: !prev?.showHide }))}
              className={`${selected?.showHide ? style?.showDescription : style.description}`}
              style={{ color: widget.textColor }}
              aria-label={"description"}
            >
              {selected.description ? selected.description : ""}
            </div>
          )}
          <div className={style.widgetContainer}>
            {selected?.videoUrl && (
              <iframe
                className="embed-responsive-item"
                src={`https://player.vimeo.com/video/${selected?.videoUrl?.split("/")?.pop()}`}
                frameBorder="0"
                title="videoFrame"
                width="100%"
                height="100%"
                aria-label=" Video Player Vimeo"
              ></iframe>
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
            {shareButton && (
              <div className={style.shareViewClass}>
                <TemplateShareSubscribe widget={widget} />
              </div>
            )}
          </div>
          <div>
            <TryNow widget={widget} />
          </div>
        </div>
        <div className={style.leftDiv}>
          <div className={style.grid}>
            {assets?.map((item, index) => (
              <EmbedWidgetThumb
                key={index}
                item={item}
                handleSelect={handleSelect}
                textColor={widget.buttonTextColor}
                thumbnailColor={widget.textColor}
                avatarColor={widget.textColor}
                borderColor={widget?.textColor}
                thumbnailTitleColor={widget?.thumbnailTitleColor}
                customEmbedWidgetThumb={customEmbedStyle}
                WidgetBackgroundColor={widget?.thumbnailColor}
                selected={selected._id === item._id ? true : false}
              />
            ))}
          </div>
          <ViewAll widget={widget} />
        </div>
      </div>
    </>
  );
};

export default VerticalStackTemplate;
