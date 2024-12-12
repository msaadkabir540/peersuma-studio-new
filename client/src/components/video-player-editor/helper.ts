export const formatVideoTime = (timeInSeconds: number): string => {
  const totalFrames = Math.floor(timeInSeconds * 30); // Assuming 30 frames per second

  const hours = Math.floor(totalFrames / (30 * 60 * 60)); // 1 hour = 30 frames * 60 seconds * 60 minutes
  const minutes = Math.floor((totalFrames % (30 * 60 * 60)) / (30 * 60)); // 1 minute = 30 frames * 60 seconds
  const seconds = Math.floor((totalFrames % (30 * 60)) / 30); // 1 second = 30 frames
  const frames = totalFrames % 30;

  const formattedTime = `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}:${padZero(
    frames,
  )}`;
  return formattedTime;
};

const padZero = (num: number) => {
  return num.toString().padStart(2, "0");
};

export const handleSelectionStartService = ({
  videoRefCurrentTime,
  videoRefCurrentDuration,
  selectionEnd,
  selectionStart,
}: {
  videoRefCurrentTime: number;
  videoRefCurrentDuration: number;
  selectionEnd: number;
  selectionStart: number;
}) => {
  if (videoRefCurrentTime >= selectionEnd) {
    return {
      selectionStart: videoRefCurrentTime,
      selectionEnd: videoRefCurrentDuration,
      selectionStartOnClick: videoRefCurrentTime,
    };
  } else if (selectionEnd !== undefined && selectionEnd > 0) {
    if (selectionEnd === videoRefCurrentTime && selectionStart <= videoRefCurrentTime) {
      return {
        selectionStart: videoRefCurrentTime,
        selectionEnd: videoRefCurrentDuration,
        selectionStartOnClick: videoRefCurrentTime,
      };
    } else {
      return {
        selectionStart: videoRefCurrentTime,
        selectionStartOnClick: videoRefCurrentTime,
      };
    }
  } else if (selectionEnd === 0 && selectionStart === 0) {
    return {
      selectionStart: videoRefCurrentTime,
      selectionEnd: videoRefCurrentDuration,
      selectionStartOnClick: videoRefCurrentTime,
    };
  }
};

export const handleSelectionEndService = ({
  videoRefCurrentTime,
  videoRefCurrentDuration,
  selectionEnd,
  selectionStart,
}: {
  videoRefCurrentTime: number;
  videoRefCurrentDuration: number;
  selectionEnd: number;
  selectionStart: number;
}) => {
  if (videoRefCurrentTime < selectionStart) {
    return {
      selectionStart: videoRefCurrentDuration - videoRefCurrentDuration,
      selectionEnd: videoRefCurrentTime,
      selectionStartOnClick: videoRefCurrentTime,
    };
  } else if (
    selectionStart <= videoRefCurrentTime &&
    selectionStart <= selectionEnd &&
    (selectionEnd <= videoRefCurrentTime || selectionEnd >= videoRefCurrentTime)
  ) {
    if (selectionStart === videoRefCurrentTime && selectionEnd > videoRefCurrentTime) {
      return {
        selectionStart: videoRefCurrentDuration - videoRefCurrentDuration,
        selectionEnd: videoRefCurrentTime,
        selectionStartOnClick: videoRefCurrentTime,
      };
    } else {
      return {
        selectionEnd: videoRefCurrentTime,
        selectionStartOnClick: videoRefCurrentTime,
      };
    }
  } else if (selectionEnd === 0 && selectionStart === 0) {
    return {
      selectionStart: videoRefCurrentDuration - videoRefCurrentDuration,
      selectionEnd: videoRefCurrentTime,
      selectionStartOnClick: videoRefCurrentTime,
    };
  }
};

export const parseTime = (timeString: string) => {
  const timeParts = timeString.split(":");
  if (timeParts.length === 4) {
    const hours = parseInt(timeParts[0]);
    const minutes = parseInt(timeParts[1]);
    const seconds = parseInt(timeParts[2]);
    const frames = parseInt(timeParts[3]);
    if (
      !isNaN(hours) &&
      !isNaN(minutes) &&
      !isNaN(seconds) &&
      !isNaN(frames) &&
      hours >= 0 &&
      minutes >= 0 &&
      seconds >= 0 &&
      frames >= 0 &&
      frames <= 30
    ) {
      const errorCorrection = 0.8;
      const totalFrames =
        frames + seconds * 30 + minutes * 30 * 60 + hours * 30 * 60 * 60 + errorCorrection;
      return totalFrames / 30;
    }
  }
  return null;
};
