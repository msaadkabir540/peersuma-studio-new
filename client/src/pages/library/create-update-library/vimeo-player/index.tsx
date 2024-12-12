import ReactPlayer from "react-player";
import { useRef, memo, useState } from "react";

import Loading from "@/components/loading";

import createNotification from "@/common/create-notification";

import {
  CustomErrorSchema,
  ReactPlayerRefInterface,
  VimeoPlayerInterface,
} from "./vimeo-player-interface";

import styles from "./index.module.scss";

const VimeoPlayer: React.FC<VimeoPlayerInterface> = ({
  handleSetVideoTime,
  url,
  handleSetLoading,
}) => {
  const valueRef = useRef<ReactPlayerRefInterface | null>(null);
  const [isloading, setIsloading] = useState(true);

  const handleReady = () => {
    setTimeout(() => setIsloading(false), 400);
  };

  const handleError = (e: CustomErrorSchema) => {
    if (e?.message) {
      handleSetLoading();
      createNotification(
        "warn",
        "Please wait, video is being processed. Please check after few minutes.",
      );
      setTimeout(() => setIsloading(false), 100);
    }
  };

  return (
    <div className={styles.container}>
      {isloading && <Loading pageLoader={true} diffHeight={450} />}
      <ReactPlayer
        controls
        url={url}
        width="100%"
        ref={valueRef as any}
        playing={false}
        onReady={handleReady}
        onError={handleError}
        height={isloading ? "0px" : "100%"}
        onProgress={() => {
          const currentTime = valueRef.current?.getCurrentTime();
          const newTime = { value: currentTime !== undefined ? currentTime : null };
          handleSetVideoTime(newTime);
        }}
      />
    </div>
  );
};

export default memo(VimeoPlayer);
