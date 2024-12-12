import { formatVideoTime } from "./helper";

import { StartAndEndPointIndicationPropsInterface } from "./interface";

import style from "./video-player.module.scss";

const StartAndEndPointIndication: React.FC<StartAndEndPointIndicationPropsInterface> = ({
  videoCurrentTime = 0,
  selectionStart = 0,
  selectionEnd,
  clickOnStartTimeToEdit,
}) => {
  return (
    <div className={style.timeParts}>
      <div>
        <div
          style={{ cursor: "pointer" }}
          onClick={() => {
            clickOnStartTimeToEdit({ editableTime: formatVideoTime(videoCurrentTime || 0) });
          }}
        >
          {videoCurrentTime >= 0 ? formatVideoTime(videoCurrentTime) : "00:00:00:00"}
        </div>
      </div>
      {/* selected time  */}
      <div>
        <div style={{ cursor: "pointer" }} title="SubClip time">
          {selectionStart >= 0 && selectionEnd
            ? formatVideoTime(Math.round((selectionEnd - selectionStart) * 100) / 100)
            : "00:00:00:00"}
        </div>
      </div>
    </div>
  );
};

export default StartAndEndPointIndication;
