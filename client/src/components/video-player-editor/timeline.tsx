import _ from "lodash";
import { memo, useCallback, useMemo, useRef, forwardRef, useImperativeHandle } from "react";

import { TimelinePropsInterface, TimelineRef } from "./interface";

const Timeline: React.ForwardRefRenderFunction<TimelineRef, TimelinePropsInterface> = (
  {
    style,
    selectionEnd,
    handleDragEnd,
    selectionStart,
    handleDragStart,
    videoCurrentTime,
    currentVideoDuration,
    videoCurrentDuration,
    clickOnCurrentTimeControl,
    setControlsOnSelectionEvent,
    setNewTimeToVideoCurrentTime,
  },
  ref,
) => {
  const progressRef = useRef<HTMLDivElement>(null);
  const playHeadWrapperRef = useRef<HTMLDivElement>(null);

  const moveNotchToStart = useCallback((value = 0) => {
    if (playHeadWrapperRef?.current) playHeadWrapperRef.current.style.left = `${value}px`;
  }, []);

  const moveNotchToEnd = useCallback((value = 0) => {
    if (playHeadWrapperRef?.current) playHeadWrapperRef.current.style.right = `${value}px`;
  }, []);

  useImperativeHandle(ref, () => ({
    moveNotchToStart,
    moveNotchToEnd,
  }));

  const calculatePosition = (e: React.MouseEvent<Element, MouseEvent>) => {
    e.stopPropagation();
    const progressBar = progressRef.current;
    const { left = 0, width = 0 } = progressBar?.getBoundingClientRect() || {};
    const clickPosition = e.pageX - left;
    const clickPercentage = clickPosition / width;
    return clickPercentage * (currentVideoDuration || videoCurrentDuration || 0);
  };

  // handles the progress bar click event to seek to a specific time
  const handleProgressClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.stopPropagation();
      const newTime = calculatePosition(e);

      setNewTimeToVideoCurrentTime({ value: newTime });
      clickOnCurrentTimeControl({ currentTime: newTime, controls: true });

      setControlsOnSelectionEvent({ controls: true });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setNewTimeToVideoCurrentTime, clickOnCurrentTimeControl],
  );
  // handles the start of scrubbing when the playhead is dragged
  const handleScrubStart = useCallback(() => {
    // Disable user selection
    if (document.body.style) {
      // document.body.style.webkitTouchCallout = "none";
      document.body.style.webkitUserSelect = "none";
      // document.body.style.khtmlUserSelect = "none";
      // document.body.style.mozUserSelect = "none";
      document.body.style.msUserSelect = "none";
      document.body.style.userSelect = "none";
    }

    const handle = (e: MouseEvent | any) => {
      e.stopPropagation();
      // If it's not the left mouse button, remove the listeners.
      if (e.which !== 1) {
        remove();
        return;
      }
      const newTime = calculatePosition(e);
      setNewTimeToVideoCurrentTime({ value: newTime });
      clickOnCurrentTimeControl({ currentTime: newTime });
    };

    const remove = () => {
      // Allow user selection back
      // document.body.style.webkitTouchCallout = "";
      document.body.style.webkitUserSelect = "";
      // document.body.style.khtmlUserSelect = "";
      // document.body.style.mozUserSelect = "";
      document.body.style.msUserSelect = "";
      document.body.style.userSelect = "";

      window.removeEventListener("mousemove", handle, false);
      window.removeEventListener("mouseup", remove, false);
      window.removeEventListener("mouseleave", remove, false);
    };

    // Add the event listeners to the window.
    window.addEventListener("mousemove", handle, false);
    window.addEventListener("mouseup", remove, false);
    window.addEventListener("mouseleave", remove, false);

    // Cleanup function to remove the event listeners.
    return () => {
      remove();
    };
  }, [setNewTimeToVideoCurrentTime, clickOnCurrentTimeControl]);

  // calculates the current selection percentage for the selection range
  const selectionLeft = useMemo(() => {
    const duration = currentVideoDuration || videoCurrentDuration || 0;
    const value = (selectionStart / duration) * 100 || 0;
    return _.isNaN(value) || !value ? 0 : value;
  }, [videoCurrentDuration, selectionStart, currentVideoDuration]);

  // calculates the current selection percentage for the selection range
  const selectionWidth = useMemo(() => {
    const duration = currentVideoDuration || videoCurrentDuration || 0;
    const value = ((selectionEnd - selectionStart) / duration) * 100 || 0;
    return _.isNaN(value) || !value ? 0 : value;
  }, [videoCurrentDuration, selectionEnd, selectionStart, currentVideoDuration]);

  const calculateProgress = useMemo(() => {
    const duration = currentVideoDuration || videoCurrentDuration || 0;
    const rawProgress = (videoCurrentTime / duration) * 100;
    const restrictedProgress = Math.min(100, Math.max(0, rawProgress));
    return _.isNaN(restrictedProgress) || !restrictedProgress ? 0 : restrictedProgress;
  }, [currentVideoDuration, videoCurrentDuration, videoCurrentTime]);

  return (
    <div className={style.progressBarClass} onMouseDown={handleScrubStart}>
      <div ref={progressRef} className={style.progressBar} onClick={handleProgressClick}>
        {selectionStart >= 0 && (
          <div
            className={style.selection}
            draggable
            onDragEnd={handleDragEnd}
            onDragStart={(e) => {
              e.stopPropagation();
              handleDragStart(e, false);
            }}
            onMouseDown={(e) => e.stopPropagation()}
            style={{
              left: `${selectionLeft}%`,
              width: selectionEnd ? `${selectionWidth}%` : "2px",
            }}
          />
        )}
        <div className={style.progress} style={{ width: `${calculateProgress}%` }}></div>
        <div
          ref={playHeadWrapperRef}
          className={style.playHeadWrapper}
          style={{ left: `${calculateProgress}%` }}
        >
          <div className={style.playHead}></div>
        </div>
      </div>
    </div>
  );
};

export default memo(forwardRef(Timeline));

declare global {
  interface CSSStyleDeclaration {
    msUserSelect: string;
    msOverflowStyle: string;
  }
}
Object.defineProperty(CSSStyleDeclaration, "msUserSelect", {
  get: function getter() {
    return this.userSelect;
  },
});
Object.defineProperty(CSSStyleDeclaration, "msOverflowStyle", {
  get: function getter() {
    return this.overflowStyle;
  },
});
