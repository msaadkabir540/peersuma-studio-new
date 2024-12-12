import React, { useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Modal from "@/components/modal";
import Input from "@/components/input";
import Button from "@/components/button";
import Loading from "@/components/loading";
import DraftSubCard from "./draft-sub-card";

import style from "./index.module.scss";

const DraftCarouselSection: React.FC<any> = ({
  assets,
  widget,
  handleChangeVideoName,
  videoDraftId,
  handleDownload,
}) => {
  const sliderRef = useRef<null>(null);

  const [selected, setSelected] = useState<{
    _id: string;
    name: string;
    url: string;
    thumbnailUrl: string;
  }>({
    _id: "",
    url: "",
    name: "",
    thumbnailUrl: "",
  });

  useEffect(() => {
    if (assets && assets?.length) {
      setSelected({ ...assets[0] } as any);
    }
  }, [assets]);

  const handleSelect = ({ item }: { item: any }) => {
    setSelected({ ...item } as any);
  };

  const [value, setValue] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isClipOpen, setIsClipOpen] = useState<{ isOpen: boolean; videoUrl: string }>({
    isOpen: false,
    videoUrl: "",
  });
  const [isVideoRename, setIsVideoRename] = useState<boolean>(false);
  const [isRename, setIsRename] = useState<boolean>(false);

  const handleChangeName = async ({
    value,
    videoDraftId,
    mediaId,
  }: {
    value: string;
    videoDraftId: string;
    mediaId: string;
  }) => {
    if (value.trim().length === 0) {
      setError("Enter the Comment");
    } else {
      setIsRename(true);
      await handleChangeVideoName({ value, videoDraftId, mediaId });
      setIsRename(false);
      setIsVideoRename(false);
    }
  };

  return (
    <>
      <div className={style.main} aria-label={` Title": ${selected?.name}`}>
        <div className={style.widgetContainer} aria-label={"Video Player"}>
          <div className={style.flexBetween}>
            <div className={style.textLarge}>{selected?.name}</div>
          </div>

          <video key={selected?.url} controls className={style.video}>
            <source src={selected?.url} type="video/mp4" />
            <track kind="captions" src={selected?.url} />
          </video>
        </div>

        <div className={style.sliderWrapper}>
          <div className={style.SliderMain}>
            <div className={style.textTitle}>Previous Drafts</div>

            <Slider {...settings(assets)} ref={sliderRef}>
              {assets?.map((item: any) => (
                <div key={item?._id}>
                  <div
                    style={{
                      margin: "0px 5px",
                      width: "200px",
                    }}
                  >
                    <DraftSubCard
                      item={item}
                      handleSelect={handleSelect}
                      thumbnailTitleColor={widget?.thumbnailTitleColor}
                      selected={selected?._id === item?._id}
                    />
                  </div>
                </div>
              ))}
            </Slider>
          </div>

          <div className={style.mobileClass}>
            <div className={style.textTitle}>Previous Drafts</div>

            {assets?.map((item: any) => (
              <div key={item?._id}>
                <DraftSubCard
                  item={item}
                  handleSelect={handleSelect}
                  thumbnailTitleColor={widget?.thumbnailTitleColor}
                  selected={selected?._id === item?._id}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals for Rename and Clip */}
      {isVideoRename && (
        <Modal
          showCross={true}
          className={style.modalContentWrapper}
          open={isVideoRename}
          handleClose={() => setIsVideoRename(false)}
        >
          <div>
            <div className={style.textLarge}>Rename Draft</div>
          </div>
          <Input
            name="videoDraftName"
            onChange={(e) => setValue(e.target.value)}
            value={value}
            required
            inputField={style.input}
            errorMessage={error}
            type="text"
          />
          <div className={style.flexBetween}>
            <Button title="Cancel" handleClick={() => setIsVideoRename(false)} />
            <Button
              isLoading={isRename}
              title={isRename ? `${(<Loading loaderClass={style.loaderSaveClass} />)}` : "Save"}
              handleClick={() => handleChangeName({ value, videoDraftId, mediaId: selected?._id })}
            />
          </div>
        </Modal>
      )}
    </>
  );
};

export default DraftCarouselSection;

const settings = (assets = []) => {
  return {
    centerMode: true,
    centerPadding: "40px", // Ensures cards are aligned centrally with padding
    slidesToShow: assets.length > 4 ? 4 : assets.length,
    slidesToScroll: 4,
    dots: true,
    arrows: true,
    autoplay: false,
    autoplaySpeed: 300,
    infinite: assets.length > 1 ? true : false,
    speed: 300,
    responsive: [
      {
        breakpoint: 1440,
        settings: {
          slidesToShow: assets.length > 4 ? 4 : assets.length,
          centerPadding: "30px",
        },
      },
      {
        breakpoint: 1000,
        settings: {
          slidesToShow: assets.length > 3 ? 3 : assets.length,
          centerPadding: "20px",
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: assets.length > 2 ? 2 : assets.length,
          centerPadding: "10px",
        },
      },
      {
        breakpoint: 500,
        settings: {
          slidesToShow: 1,
          centerPadding: "0px",
        },
      },
    ],
  };
};
