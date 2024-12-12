import React, { useContext } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";

import Button from "@/components/button";
import VerticalHorizontalDNDList from "@/components/horizontal-vertical-dnd";
import VideoClipCard from "../fields-pane/video-clip-card";
import AlbumsMediaList from "@/components/albums-media-list";

import { addVideoToDraft } from "@/api-services/video-draft";
import { deleteFinalVideoFile, mergeFinalVideo } from "@/api-services/projects";

import { UpdateProjectEnum } from "@/context/create-project/types";
import { CreateProjectContext } from "@/context/create-project/index";

import { formatVideoTime } from "@/components/video-player-editor/helper";

import { AssemblyContextInterface, AssemblyPropsInterface } from "../interface";
import { TemplatesFieldValueInterface, VideoProjectInterface } from "../../interface";

import renderdIcons from "@/assets/render.png";

import styles from "../fields-pane/index.module.scss";

const Assembly: React.FC<AssemblyPropsInterface> = ({ loading, setLoading }) => {
  const { id, project, dispatchProject, selectedClient, setAddIncrement } =
    useContext<AssemblyContextInterface>(CreateProjectContext as any);

  const { finalVideosToMerge = [], finalVideos, videoProjectId } = project;

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, video: any) => {
    const duration = formatVideoTime(video?.duration || 0);
    // Set the data to be transferred during the drag operation
    // let crt;
    const crt = document.createElement("div");
    crt.id = "drag-player";
    crt.innerHTML = `
    <div class="${styles.dragElementInner}">
    <img src="${video?.thumbnailUrl}" alt="video-thumbnail" />
    <div>
    <span>${duration}</span>
    </div>
    </div>
    `;
    crt.classList.add(styles.dragElement);
    document.body.appendChild(crt);
    e.dataTransfer.setDragImage(crt, 0, 0);
    e.dataTransfer.setData("video_data", JSON.stringify(video));
  };

  const handleDragEnd = () => {
    document.getElementById("drag-player")?.remove();
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    // Prevent the default behavior (usually not allowing drops)
    e.preventDefault();
  };
  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    // Prevent the default behavior (usually open as a link)
    e.preventDefault();
    // Get the data that was transferred during the drag operation
    const video_data = JSON.parse(e.dataTransfer.getData("video_data"));
    // Place video in the selected template field
    const finalVideoToMergeResult = [
      ...(project?.finalVideosToMerge || []),
      { ...video_data, id: Math.random().toString(), clipDuration: video_data.duration },
    ];
    dispatchProject({ type: UpdateProjectEnum.FINAL_VIDEOTO_MERGED, finalVideoToMergeResult });
  };

  const onDragEnd = (result: DropResult) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    const startIndex = result.source.index;
    const endIndex = result.destination.index;

    const temp = [...finalVideosToMerge];
    temp.slice;
    const [removed] = temp.splice(startIndex, 1);
    temp.splice(endIndex, 0, removed);
    if (result?.destination)
      if (+result.source.droppableId !== -1 && +result?.destination?.droppableId !== -1) {
        project.finalVideosToMerge = [...temp];
      }
    dispatchProject({
      type: UpdateProjectEnum.FINAL_VIDEO_TOMERGED,
      finalVideosToMerge: [...temp],
    });
  };

  const handleClipDelete = ({
    e,
    item,
  }: {
    e: React.MouseEvent<HTMLDivElement, MouseEvent>;
    item: TemplatesFieldValueInterface;
  }) => {
    e.stopPropagation();
    const { id } = item;
    dispatchProject({
      type: UpdateProjectEnum.DELETE_FINAL_MERGED_VIDEO,
      finalVideosToMerge: finalVideosToMerge.filter((x: any) => x.id !== id) as [],
    });
  };

  const handleMergeFinalVideo = async (finalFileName: any) => {
    setLoading((prev) => ({ ...prev, mergeFinalVideo: true }));
    await mergeFinalVideo({
      id,
      finalFileName,
      finalVideosToMerge: finalVideosToMerge?.map(
        ({ s3Key, duration }: { s3Key: string; duration: number }) => ({ s3Key, duration }),
      ),
    });
    setLoading((prev) => ({ ...prev, mergeFinalVideo: false }));
  };

  const handleDeleteFile = async ({ name, s3Key }: { name: string; s3Key: string }) => {
    try {
      const res = await deleteFinalVideoFile({ s3Key, id });
      if (res) {
        const projectCopy = { ...project };
        projectCopy.finalVideos = projectCopy?.finalVideos?.filter?.((x) => x?.name !== name);
        dispatchProject({ type: UpdateProjectEnum.MEDIA_DELETE_FILE, payload: { ...projectCopy } });
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const handleReadyToDraft = async ({
    e,
    item,
    videoProjectId,
  }: {
    e: React.MouseEvent<HTMLLIElement, MouseEvent>;
    item: VideoProjectInterface;
    videoProjectId: string | undefined;
    selectedClient: string;
  }) => {
    const finalData = {
      item,
      videoProjectId,
      clientId: selectedClient,
    };
    try {
      const res = await addVideoToDraft({ data: finalData });
      if (res) {
        setAddIncrement((prev) => prev + 1);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <div className={styles.assemblyContainer}>
      <div className={styles.assemblyHeader}>
        <div>Rendered Videos: </div>
        <Button
          tooltip={"Render"}
          icon={renderdIcons}
          iconSize={{ width: 25, height: 25 }}
          className={styles.createButton}
          loaderClass={styles.loaderClass}
          isLoading={loading?.mergeFinalVideo ? true : false}
          disabled={finalVideosToMerge?.length === 0}
          handleClick={() => {
            dispatchProject({
              type: UpdateProjectEnum.FINAL_VIDEO_RENDERED,
              mergeFileName: { callback: handleMergeFinalVideo },
            });
          }}
        />
      </div>
      <div className={styles.assembly}>
        <AlbumsMediaList
          isAssembly={true}
          selectedClientId={null}
          finalVideos={finalVideos}
          handleDragEnd={handleDragEnd}
          handleDragStart={handleDragStart}
          handleDeleteFile={handleDeleteFile}
        />
        <div className={styles.mergeContainer}>
          <div className={styles.heading}>Final Videos to merge: </div>
          <DragDropContext onDragEnd={onDragEnd}>
            <div
              onDrop={onDrop}
              onDragOver={onDragOver}
              className={`${styles.field} ${styles.mergePane}`}
            >
              <VerticalHorizontalDNDList
                direction="horizontal"
                index={0}
                height="130px"
                items={finalVideosToMerge as any}
                renderItem={(item) => (
                  <VideoClipCard
                    readyToDraft={true}
                    isStaging={false}
                    {...{
                      item,
                      handleReadyToDraft: (e) => {
                        handleReadyToDraft({ e, item, videoProjectId, selectedClient });
                      },
                    }}
                    {...{
                      item,
                      handleClipDelete: (e) => {
                        handleClipDelete({ e, item });
                      },
                    }}
                  />
                )}
              />
            </div>
          </DragDropContext>
        </div>
      </div>
    </div>
  );
};

export default Assembly;
