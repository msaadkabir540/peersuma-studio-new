import { useContext, useImperativeHandle, useMemo, useRef } from "react";

import HighlightAbleText from "@/components/highlighted-text";
import VideoPlayerEditor from "@/components/video-player-editor";
import { CreateProjectContext } from "@/context/create-project/index";

import { UpdateProjectEnum } from "@/context/create-project/types";
import { formatVideoTime } from "@/components/video-player-editor/helper";

import { CurrentVideoInterface, PlayerContextInterface, PlayerPropsInterface } from "../interface";

import styles from "./index.module.scss";

const Player: React.FC<PlayerPropsInterface> = ({
  player,
  setPlayer,
  selection,
  currentVideo,
  setSelection,
  closeMediaRef,
  setCurrentVideo,
  moveMediaToField,
}) => {
  const { project, handleEmptyVideoPlayerClickEvent, dispatchProject } =
    useContext<PlayerContextInterface>(CreateProjectContext as unknown);

  const playerRef = useRef<unknown>(null);

  const {
    activeTab,
    templates = [],
    selectionClear,
    activeTemplateId,
    selectedFieldName,
  } = project;

  const { selectionStart, selectionEnd } = player;

  const templateIndex = useMemo(() => {
    return templates?.findIndex((x) => x?.id === activeTemplateId);
  }, [templates, activeTemplateId]);

  const fadeIn = selectionStart || 0;
  const fadeOut = selectionEnd || 0;

  // const handleDragStart = (event: React.DragEvent<HTMLDivElement> | null, noDrag = false) => {
  //   if (noDrag && selectedFieldName) {
  //     onDrop({
  //       noDrop: true,
  //       name: selectedFieldName || "",
  //       videoDataFromClip: {
  //         _currentVideo: currentVideo,
  //         startTime: fadeIn,
  //         endTime: fadeOut,
  //       },
  //     });
  //   } else {
  //     const crt = document.createElement("div");
  //     crt.id = "drag-player";
  //     crt.innerHTML = `
  //                 <img src="${currentVideo?.thumbnailUrl}" alt="video-thumbnail" />
  //                 <div>
  //                   <span>${Math.round((fadeOut - fadeIn) * 100) / 100} sec</span>
  //                 </div>
  //           `;
  //     crt.classList.add(styles.dragElement);
  //     document.body.appendChild(crt);
  //     event?.dataTransfer.setDragImage(crt, 0, 0);
  //     event?.dataTransfer.setData(
  //       "video_data",
  //       JSON.stringify({
  //         _currentVideo: currentVideo,
  //         startTime: fadeIn,
  //         endTime: fadeOut,
  //       }),
  //     );
  //   }
  // };

  const handleDragStart = (event: React.DragEvent<HTMLDivElement> | null) => {
    const crt = document.createElement("div");
    crt.id = "drag-player";

    const thumbnailUrl = currentVideo?.thumbnailUrl || "";
    const duration = Math.round((fadeOut - fadeIn) * 100) / 100;
    const durations = formatVideoTime(duration || 0);

    crt.innerHTML = `
    <img src="${thumbnailUrl}" alt="video-thumbnail" />
    <div>
      <span>${durations} sec</span>
    </div>
  `;

    crt.classList.add(styles.dragElement);

    document.body.appendChild(crt);

    if (event) {
      event.dataTransfer.setDragImage(crt, 0, 0);
      event?.dataTransfer?.setData(
        "video_data",
        JSON.stringify({
          _currentVideo: currentVideo,
          startTime: fadeIn,
          endTime: fadeOut,
        }),
      );
    }
  };

  const handleDragEnd = () => {
    document.getElementById("drag-player")?.remove();
  };

  const setStartValueOnPlayer = ({ startsTime }: { startsTime: number }) => {
    setPlayer((prev) => ({
      ...prev,
      videoStartFromTime: startsTime,
      currentTime: startsTime,
      isPlaying: true,
    }));
  };
  const clearAllTranscriptionSelection = () => {
    setSelection({ controls: false });
    setPlayer((prev) => ({
      ...prev,
      currentTime: 0,
      selectionEnd: undefined,
      selectionStart: undefined,
    }));
  };

  const selectionEvent = ({
    ...args
  }: {
    controls: boolean;
    currentSelection: { startSeconds: number };
  }) => {
    setSelection({
      ...args,
    });
    setPlayer((prev) => ({ ...prev, currentTime: args?.currentSelection?.startSeconds }));
  };
  const selectionControlEvent = ({ controls }: { controls: boolean }) => {
    setSelection((prev) => ({ ...prev, controls }));
  };

  const emptyVideoPlayerClickEvent = (event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event?.stopPropagation();
    playerRef?.current?.handleEmptyVideoRef() as unknown;
    setCurrentVideo({} as CurrentVideoInterface);
    setSelection({
      controls: false,
    });
    handleEmptyVideoPlayerClickEvent();
  };

  useImperativeHandle(closeMediaRef, () => ({
    handleCloseMedia() {
      emptyVideoPlayerClickEvent();
    },
  }));

  const handleUpdateStageTime = ({
    startTime,
    endTime,
    id,
    label,
    selectedFieldName,
    name,
  }: {
    startTime: number;
    endTime: number;
    id: string;
    label: string;
    selectedFieldName?: string | null | undefined;
    name?: string;
  }) => {
    const StagingFields = project?.stagingFields;
    const NewClipDuration = Math?.round((endTime - startTime) * 100) / 100;
    const currentIndex = StagingFields?.findIndex(
      (x) => x?.label === label && x?.name === (name ? name : selectedFieldName),
    );

    if (currentIndex !== -1) {
      const leftFiltered = StagingFields[currentIndex]?.value?.leftValue?.find(
        (x) => x && x?.id === id,
      );
      const rightFiltered = StagingFields[currentIndex]?.value?.rightValue?.find(
        (x) => x && x?.id === id,
      );
      leftFiltered &&
        ((leftFiltered.startTime = startTime),
        (leftFiltered.endTime = endTime),
        (leftFiltered.clipDuration = NewClipDuration));
      rightFiltered &&
        ((rightFiltered.startTime = startTime),
        (rightFiltered.endTime = endTime),
        (rightFiltered.clipDuration = NewClipDuration));
    }

    dispatchProject({
      type: UpdateProjectEnum.UPDATE_STAGING_SUB_CLIP,
      stagingFields: [...project.stagingFields],
    });
  };

  const updateVideoClipEvent = (event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event?.stopPropagation();
    let updatedFields;
    if (activeTab !== "stagingTab") {
      updatedFields =
        moveMediaToField({
          prev: project?.templateClip
            ? project?.templates[templateIndex]?.fields
            : (project?.stagingFields as []),
          id: currentVideo?.id,
          label: currentVideo?.label,
          _currentVideo: currentVideo,
          startTime: selectionStart || 0,
          endTime: selectionEnd || 0,
          side: currentVideo?.side as string,
        }) || [];
    } else {
      handleUpdateStageTime({
        startTime: selectionStart || 0,
        endTime: selectionEnd || currentVideo?.endTime || 0,
        id: currentVideo?.id,
        label: currentVideo?.label,
        selectedFieldName,
      });
    }

    dispatchProject({
      type: UpdateProjectEnum.UPDATE_SUBCLIP,
      payload: {
        updatedFields,
      },
    });
  };

  const handleSetCurrentTime = ({ currentTime }: { currentTime: number | undefined }) => {
    dispatchProject({
      type: UpdateProjectEnum.HANDLE_CLIP_CURRENT_TIME,
      subClipCurrentTime: currentTime,
    });
  };

  return (
    <>
      <div className={styles.playerMain}>
        <VideoPlayerEditor
          player={player}
          setPlayer={setPlayer}
          playerRef={playerRef}
          selection={selection}
          currentVideo={currentVideo}
          setSelection={setSelection}
          handleDragEnd={handleDragEnd}
          selectionClear={selectionClear}
          handleDragStart={handleDragStart}
          handleSetCurrentTime={handleSetCurrentTime}
          videoName={currentVideo?.name?.split(".")?.[0]}
          handleUpdateVideoClipEvent={updateVideoClipEvent}
          currentVideoLabel={currentVideo?.url || currentVideo?.label}
          handleEmptyVideoPlayerClickEvent={emptyVideoPlayerClickEvent}
        />
        <HighlightAbleText
          playerCurrentTime={player?.currentTime}
          sectionControl={selection?.controls}
          currentSelectionOfSelection={selection?.currentSelection || false}
          handleDragEnd={handleDragEnd}
          handleDragStart={handleDragStart}
          transcription={currentVideo?.transcription}
          setStartValueOnPlayer={setStartValueOnPlayer}
          clearAllTranscriptionSelection={clearAllTranscriptionSelection}
          selectionEvent={selectionEvent}
          selectionControlEvent={selectionControlEvent}
          clipStartTime={player?.selectionStart || 0}
          clipEndTime={player?.selectionEnd || 0}
        />
      </div>
    </>
  );
};

export default Player;
