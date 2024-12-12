import { memo, useCallback, useMemo, useState } from "react";

import Loading from "../loading";
import MediaCard from "./media-card";
import FilterBar from "./filter-bar";
import VideoModal from "./video-modal";
import { useMediaList } from "./useMediaList";

import { AlbumMediaListInterface, FileFieldsinterface, MediaType } from "./media-list-interface";

import styles from "./index.module.scss";

const AlbumsMediaList = ({
  albumId,
  isAssembly,
  finalVideos,
  handleDragEnd,
  loadingHeight,
  handleDragStart,
  stageTypeFields,
  handleDeleteFile,
  selectedClientId,
  handleAlbumIdEvent,
  clickOnListMedia,
  clickMediaColor,
  clickOnFieldFields,
}: AlbumMediaListInterface) => {
  const [viewFile, setViewFile] = useState<
    | {
        url: string;
        fileType: string;
      }
    | boolean
  >(false);

  const {
    mediaList,
    isLoading,
    inputValue,
    isVisibility,
    mediaOptions,
    dispatchAlbum,
    selectedAlbumId,
    handleSearchEvent,
    handleSearchOption,
  } = useMediaList({
    albumId,
    finalVideos,
    selectedClientId,
    handleAlbumIdEvent,
  });

  const loadingDiffHedight = loadingHeight ? loadingHeight : 500;

  const mediaResult = useMemo(() => {
    return mediaList?.filter(
      ({ name }: { name: string }) => name?.toLowerCase()?.includes(inputValue?.toLowerCase()),
    );
  }, [mediaList, inputValue]);

  const handleFilterFields = useCallback(
    ({ fileType }: { fileType: string }) => {
      return stageTypeFields && stageTypeFields(fileType);
    },
    [stageTypeFields],
  );

  const clickToSelectedAlbumMedia = useCallback(
    ({ index, media }: { index: number; media: MediaType }) => {
      if (clickOnListMedia) {
        clickOnListMedia && clickOnListMedia({ index, media });
      } else {
        media?.fileType != "font" &&
          media?.fileType != "document" &&
          setViewFile({ url: media?.url, fileType: media?.fileType });
      }
    },
    [clickOnListMedia],
  );

  return (
    <div className={styles.mediaContainer}>
      {isLoading ? (
        <Loading pageLoader={true} diffHeight={loadingDiffHedight} />
      ) : (
        <>
          {!isAssembly && (
            <FilterBar
              mediaOptions={mediaOptions}
              isVisibility={isVisibility}
              dispatchAlbum={dispatchAlbum}
              selectedAlbumId={selectedAlbumId}
              handleSearchEvent={handleSearchEvent}
              handleSearchOption={handleSearchOption}
            />
          )}
          <div className={styles.divName}>
            {/* useMemo to make an object of props. */}

            {mediaResult?.map((media: MediaType | any, index: number) => {
              const fileFields = handleFilterFields({ fileType: media?.fileType } as {
                fileType: string;
              }) as FileFieldsinterface[];
              return (
                <MediaCard
                  media={media}
                  index={index}
                  key={media?._id}
                  fileFields={fileFields}
                  isAssembly={isAssembly}
                  isVisibility={isVisibility}
                  handleDragEnd={handleDragEnd}
                  dispatchAlbum={dispatchAlbum}
                  selectedAlbumId={selectedAlbumId}
                  handleDragStart={handleDragStart}
                  clickMediaColor={clickMediaColor}
                  handleDeleteFile={handleDeleteFile}
                  clickOnFieldFields={clickOnFieldFields}
                  clickToSelectedAlbumMedia={clickToSelectedAlbumMedia}
                />
              );
            })}
          </div>
        </>
      )}
      {!clickOnListMedia && <VideoModal {...{ setViewFile, viewFile }} />}
    </div>
  );
};

export default memo(AlbumsMediaList);
