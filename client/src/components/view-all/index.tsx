import { ViewAllInterface } from "./view-all-interface";

import style from "./index.module.scss";

const ViewAll = ({ widget }: ViewAllInterface) => {
  return (
    <div
      style={{ color: widget.buttonColor, borderColor: widget.buttonColor }}
      className={style.viewAllClass}
      onClick={() => {
        window.open(
          `${import.meta.env.VITE_VIDEO_PROJECT_URL}/video-view/${widget?._id}`,
          "_blank",
        );
      }}
    >
      View All
    </div>
  );
};

export default ViewAll;
