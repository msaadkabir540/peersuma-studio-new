import moment from "moment";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useState, useEffect, useRef, useMemo } from "react";

import TryNow from "@/components/try-now";
import ViewAll from "@/components/view-all";
import TemplateShareSubscribe from "../components/template-share-subscribe";

import { ReactPlayerRefInterface, SlideShowTemplateInterface } from "./slide-show-interface";

import style from "./slideshow.module.scss";

const SlideShowTemplate: React.FC<SlideShowTemplateInterface> = ({ assets, widget }) => {
  const sliderRef = useRef<ReactPlayerRefInterface | null>(null);

  const [selected, setSelected] = useState<{
    _id: string;
    name: string;
    videoUrl: string;
    description: string;
    showHide?: boolean;
  }>({
    _id: "",
    name: "",
    videoUrl: "",
    description: "",
    showHide: false,
  });

  const { updatedAt, userId }: any = selected;
  const uploadedTime = moment(updatedAt).format("MMM DD, YYYY | HH:mm");
  const uploadedByUserName = userId?.username || userId?.fullName || "Superadmin";

  useEffect(() => {
    if (assets && assets.length) {
      setSelected({
        ...assets[0],
      });
    }
  }, [assets]);

  const handleAfterChange = (index: number) => {
    setSelected({
      ...assets[index],
    });
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
        {widget.showTitle && (
          <div
            style={{ color: widget.titleColor }}
            className={style.title}
            aria-label={`Title": ${selected.name}`}
          >
            {selected.name}
          </div>
        )}
        {widget.showDescription && (
          <div
            style={{ color: widget.textColor }}
            aria-label={"description"}
            onClick={() => setSelected((prev) => ({ ...prev, showHide: !prev?.showHide }))}
            className={`${selected?.showHide ? style?.showDescription : style.description}`}
          >
            {selected.description ? selected.description : ""}
          </div>
        )}
        <div className={style.slidShowVideoContainer}>
          <div className={style.sliderWrapper}>
            <div
              aria-hidden="true"
              className={style.btnLeft}
              style={{ backgroundColor: widget.buttonColor || widget.buttonTextColor }}
              aria-label="Slide Left Side Button"
              onClick={() => sliderRef?.current?.slickPrev()}
            >
              <div style={{ color: widget.textColor, width: "20px", height: "20px" }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 8 13"
                  fill="none"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M7.2183 0.807333C7.55744 1.14647 7.55744 1.69633 7.2183 2.03547L2.62184 6.63193L7.2183 11.2284C7.55744 11.5675 7.55744 12.1174 7.2183 12.4565C6.87916 12.7957 6.32931 12.7957 5.99017 12.4565L0.779643 7.24599C0.440503 6.90685 0.440503 6.357 0.779643 6.01786L5.99017 0.807333C6.32931 0.468194 6.87916 0.468194 7.2183 0.807333Z"
                    fill={widget.buttonTextColor}
                  />
                </svg>
              </div>
            </div>
            {
              <div className={style.SliderMain}>
                <Slider {...settings} ref={sliderRef} afterChange={handleAfterChange}>
                  {assets?.map(({ videoUrl }, index) => {
                    return (
                      videoUrl && (
                        <iframe
                          key={index}
                          className="embed-responsive-item"
                          src={`https://player.vimeo.com/video/${videoUrl?.split("/")?.pop()}`}
                          frameBorder="0"
                          title="videoFrame"
                          width="100%"
                          height="400"
                          aria-label="video Frame Player"
                        ></iframe>
                      )
                    );
                  })}
                </Slider>
              </div>
            }
            <div
              aria-hidden="true"
              className={style.btnRight}
              style={{ backgroundColor: widget.buttonColor || widget.buttonTextColor }}
              aria-label="Slide Right Button"
              onClick={() => sliderRef?.current?.slickNext()}
            >
              <div style={{ color: widget.textColor, width: "20px", height: "20px" }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 8 13"
                  fill="none"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M0.430136 0.807333C0.0909964 1.14647 0.0909964 1.69633 0.430136 2.03547L5.0266 6.63193L0.430136 11.2284C0.0909964 11.5675 0.0909964 12.1174 0.430136 12.4565C0.769275 12.7957 1.31913 12.7957 1.65827 12.4565L6.86879 7.24599C7.20793 6.90685 7.20793 6.357 6.86879 6.01786L1.65827 0.807333C1.31913 0.468194 0.769275 0.468194 0.430136 0.807333Z"
                    fill={widget.buttonTextColor}
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className={style.shareContainer}>
            <div className={style.viewContainer}>
              <ViewAll widget={widget} />
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
              </div>
            </div>
          </div>
          <div>
            <TryNow widget={widget} />
          </div>
        </div>
      </div>
    </>
  );
};

export default SlideShowTemplate;

const settings = {
  centerPadding: "100px",
  slidesToShow: 1,
  arrows: false,
  responsive: [
    {
      breakpoint: 1440,
      settings: {
        slidesToShow: 1,
      },
    },
    {
      breakpoint: 1000,
      settings: {
        slidesToShow: 1,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 1,
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
