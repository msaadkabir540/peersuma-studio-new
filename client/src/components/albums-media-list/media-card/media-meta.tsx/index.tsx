import React, { memo } from "react";

import styles from "./index.module.scss";

type MediaMetaType = {
  name: string;
  duration?: number;
  fileType: string;
};

const MediaMeta = ({ mediaListMap }: { mediaListMap: MediaMetaType }) => {
  return (
    <div className={styles.mainLabel} title={`${mediaListMap?.name}`}>
      <div className={styles.label}>{`${mediaListMap?.name}`}</div>
      {mediaListMap?.fileType === "video" && (
        <div style={{ marginRight: "4px" }}>{`(${mediaListMap?.duration?.toFixed(2) || 0} s)`}</div>
      )}
    </div>
  );
};

export default memo(MediaMeta);
