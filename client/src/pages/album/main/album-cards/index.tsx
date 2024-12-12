import { NavigateFunction, useNavigate } from "react-router-dom";

import audioIcons from "@/assets/file.svg";
import { useMemo } from "react";
import imageIcons from "@/assets/image.svg";
import videoIcons from "@/assets/video.svg";
import placeHolderImg from "@/assets/place_holder_image.png";

import { AlbumCardInterface } from "../album-interface";

import styles from "./index.module.scss";

const AlbumCard: React.FC<AlbumCardInterface> = ({ _id, name, status, albumshots = [] }) => {
  const navigate: NavigateFunction = useNavigate();

  const renderedData = useMemo(() => {
    return albumshots?.flatMap((shot) => shot?.media?.map((media) => media.fileType));
  }, [albumshots]);

  const mediaUrls = useMemo(() => {
    return albumshots
      ?.flatMap(
        (shot) =>
          shot?.media?.map((media) =>
            media?.fileType === "video"
              ? media?.thumbnailUrl
              : media?.fileType === "image"
                ? media?.url
                : null,
          ),
      )
      ?.find((url) => url);
  }, [albumshots]);

  const imageList = [
    {
      iconsImage: videoIcons,
      mediaLength: renderedData?.filter((x) => x === "video").length || 0,
    },
    {
      iconsImage: imageIcons,
      mediaLength: renderedData?.filter((x) => x === "image").length || 0,
    },
    {
      iconsImage: audioIcons,
      mediaLength: renderedData?.filter((x) => x === "audio").length || 0,
    },
  ];

  return (
    <div onClick={() => navigate(`/albums/${_id}`)} className={styles.cardContainer}>
      <div className={styles.alumContainer}>
        <div className={styles.albumImg}>
          <img src={mediaUrls || placeHolderImg} alt="placeHolderImg" />
        </div>
        <div className={styles.reals}>
          <div className={styles.realInner}>
            {imageList?.map(({ iconsImage, mediaLength }, index) => (
              <div className={styles.file} key={index}>
                <img src={iconsImage} alt="iconsImage" />
                <span>{mediaLength}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.cardContent}>
        <div className={styles.heading}>{name}</div>
        <div
          className={
            status === "open"
              ? styles.statusOpen
              : status === "closed"
                ? styles.statusClose
                : status === "inactive"
                  ? styles.statusInActive
                  : ""
          }
        >
          {status}
        </div>
      </div>
    </div>
  );
};

export default AlbumCard;
