import moment from "moment";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useState, useEffect, useRef, useMemo } from "react";

import TryNow from "@/components/try-now";
import ViewAll from "@/components/view-all";
import EmbedWidgetThumb from "../components/embed-widget-thumb";
import TemplateShareSubscribe from "../components/template-share-subscribe";

import {
  CarouselTemplateInterface,
  CustomStyle,
  ReactPlayerRefInterface,
} from "./carousel-interface";
import { EmbedWidgetInterface } from "../components/embed-widget-thumb/embed-widget-thumb-interface";

import { default as defaultStyle } from "./carousel.module.scss";

const CarouselTemplate: React.FC<CarouselTemplateInterface> = ({ assets, widget, customStyle }) => {
  const sliderRef = useRef<ReactPlayerRefInterface | null>(null);
  const style = (customStyle || defaultStyle) as CustomStyle;

  const [selected, setSelected] = useState({
    _id: "",
    name: "",
    videoUrl: "",
    description: "",
    showHide: false,
    thumbnailUrl: "",
  });
  const { userId, updatedAt }: any = selected;

  const uploadedTime = moment(updatedAt).format("MMM DD, YYYY | HH:mm");
  const uploadedByUserName = userId?.username || userId?.fullName || "Superadmin";

  useEffect(() => {
    if (assets && assets.length) {
      setSelected({ ...assets[0] } as any);
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
  }, [widget, style.shareBox]);

  return (
    <>
      <div
        className={style.main}
        style={{ backgroundColor: widget.backgroundColor }}
        aria-label={` Title": ${selected.name}`}
      >
        {widget.showTitle && (
          <div style={{ color: widget?.titleColor }} className={style.name} aria-label={"Title"}>
            {selected.name}
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
        <div className={style.widgetContainer} aria-label={"Video Player"}>
          {selected?.videoUrl && (
            <iframe
              className={style.embedResponsiveItem}
              src={`https://player.vimeo.com/video/${selected?.videoUrl?.split("/")?.pop()}`}
              frameBorder="0"
              title="videoFrame"
              width="100%"
              height="100%"
              aria-label="video player"
            ></iframe>
          )}
        </div>
        {shareButton && (
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
              <TemplateShareSubscribe widget={widget} />
              <ViewAll widget={widget} />
            </div>
          </div>
        )}
        {/* / */}
        <div className={style.sliderWrapper}>
          <div
            aria-hidden="true"
            className={style.btnLeft}
            style={{ backgroundColor: widget.buttonColor || widget.buttonTextColor }}
            aria-label={"Shift Left Side Button"}
            onClick={() => sliderRef?.current?.slickPrev?.()}
          >
            <p style={{ color: widget.textColor }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="8"
                height="13"
                viewBox="0 0 8 13"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M7.2183 0.807333C7.55744 1.14647 7.55744 1.69633 7.2183 2.03547L2.62184 6.63193L7.2183 11.2284C7.55744 11.5675 7.55744 12.1174 7.2183 12.4565C6.87916 12.7957 6.32931 12.7957 5.99017 12.4565L0.779643 7.24599C0.440503 6.90685 0.440503 6.357 0.779643 6.01786L5.99017 0.807333C6.32931 0.468194 6.87916 0.468194 7.2183 0.807333Z"
                  fill={widget.leafColor || widget.buttonTextColor}
                />
              </svg>
            </p>
          </div>

          <div className={style.SliderMain}>
            <Slider {...(settings(assets as any) as any)} ref={sliderRef}>
              {assets?.map((item) => {
                return (
                  <div key={item._id}>
                    <div
                      style={{
                        margin: "0px 5px",
                      }}
                    >
                      <EmbedWidgetThumb
                        item={item}
                        thumbnailTitleColor={widget?.thumbnailTitleColor}
                        selected={selected?._id === item?._id ? true : false}
                        handleSelect={handleSelect}
                        avatarColor={widget.textColor}
                        textColor={widget.buttonTextColor as string}
                        thumbnailColor={widget.thumbnailColor}
                      />
                    </div>
                  </div>
                );
              })}
            </Slider>
          </div>

          <div
            aria-hidden="true"
            className={style.btnRight}
            style={{ backgroundColor: widget.buttonColor || widget.buttonTextColor }}
            aria-label={"Shift Right Side Button"}
            onClick={() => {
              sliderRef?.current?.slickNext?.();
            }}
          >
            <p style={{ color: widget.textColor }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="8"
                height="13"
                viewBox="0 0 8 13"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0.430136 0.807333C0.0909964 1.14647 0.0909964 1.69633 0.430136 2.03547L5.0266 6.63193L0.430136 11.2284C0.0909964 11.5675 0.0909964 12.1174 0.430136 12.4565C0.769275 12.7957 1.31913 12.7957 1.65827 12.4565L6.86879 7.24599C7.20793 6.90685 7.20793 6.357 6.86879 6.01786L1.65827 0.807333C1.31913 0.468194 0.769275 0.468194 0.430136 0.807333Z"
                  fill={widget.leafColor || widget.buttonTextColor}
                />
              </svg>
            </p>
          </div>
        </div>
        <div>
          <TryNow widget={widget} />
        </div>
      </div>
    </>
  );
};

export default CarouselTemplate;

const settings = (assets = []) => {
  return {
    centerPadding: "60px",
    centerMode: true,
    slidesToShow: assets.length > 4 ? 4 : assets.length,
    dots: true,
    arrows: false,
    autoplay: false,
    autoplaySpeed: 500,
    responsive: [
      {
        breakpoint: 1440,
        settings: {
          slidesToShow: assets.length > 4 ? 4 : assets.length,
        },
      },
      {
        breakpoint: 1000,
        settings: {
          slidesToShow: assets.length > 3 ? 3 : assets.length,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: assets.length > 2 ? 2 : assets.length,
        },
      },
      {
        breakpoint: 500,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };
};
