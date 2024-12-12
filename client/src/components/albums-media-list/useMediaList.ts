import { useCallback, useEffect, useMemo, useReducer, useState } from "react";

import { reducer } from "./reducer";

import { getAllAlbums1 } from "@/api-services/album";
import { AlbumDataInterface, AlbumShortInterface } from "./media-list-interface";

const initialState = {
  albumsData: null,
  isVisibility: true,
};

export const useMediaList = ({
  albumId,
  finalVideos,
  selectedClientId,
  handleAlbumIdEvent,
}: {
  albumId?: string;
  selectedClientId: string | null;
  finalVideos: any | null;
  handleAlbumIdEvent?: ({ newAlbumId }: { newAlbumId: string }) => void;
}) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [selectedAlbumId, setSelectedAlbumId] = useState<string>(albumId || "");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [albumData, dispatchAlbum] = useReducer(reducer, initialState);

  const { albumsData, isVisibility, mediaOptions } = albumData;

  const handleSearchEvent = ({ value }: { value: string }) => {
    setInputValue(value);
  };

  const handleSearchOption = ({ selectValue }: { selectValue: string }) => {
    setSelectedAlbumId(selectValue);
    handleAlbumIdEvent && handleAlbumIdEvent({ newAlbumId: selectValue });
    dispatchAlbum({ type: "SET_SELECTED_ID", selectionId: selectValue });
  };

  const getAllMediaData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getAllAlbums1({
        params: {
          clientId: selectedClientId,
        },
      });
      if (response) {
        dispatchAlbum({ type: "ADD_ALBUM_DATA", payload: response });
      }
    } catch {
      console.error("error");
      setIsLoading(false);
    }
    setIsLoading(false);
  }, [selectedClientId]);

  const mediaList = useMemo(() => {
    const dataAlbumsMedia = albumsData
      ?.find(({ _id }: { _id: string }) => selectedAlbumId === _id)
      ?.albumshots?.flatMap((shot: AlbumShortInterface) => shot?.media);
    const albumMediaList = finalVideos ? finalVideos : dataAlbumsMedia;
    return (albumMediaList
      ?.filter((shot: AlbumShortInterface) => {
        const searchTerm = inputValue;
        const nameMatch = new RegExp(searchTerm, "i").test(shot?.name);
        const transcriptionMatch = new RegExp(searchTerm, "i").test(
          shot?.transcription?.flatMap((x: any) => `${x?.text}`)?.join(" "),
        );

        return nameMatch || transcriptionMatch;
      })
      .sort((shotMedia1: any, shotMedia2: any) => {
        const searchTerm = inputValue;
        const transcriptionTextA =
          shotMedia1?.transcription?.flatMap((x: any) => `${x?.text}`)?.join(" ") || "";
        const transcriptionTextB =
          shotMedia2?.transcription?.flatMap((x: any) => `${x?.text}`)?.join(" ") || "";

        const transcriptionMatchesA = (transcriptionTextA.match(new RegExp(searchTerm, "gi")) || [])
          .length;
        const transcriptionMatchesB = (transcriptionTextB.match(new RegExp(searchTerm, "gi")) || [])
          .length;

        return transcriptionMatchesB - transcriptionMatchesA;
      }) || []) as AlbumDataInterface[];
  }, [albumsData, selectedAlbumId, inputValue, finalVideos]);

  const mediaListMap = useMemo(() => {
    return mediaList?.filter((x: any) => {
      if (isVisibility === true) {
        return x?.isVisible === true || x?.isVisible === undefined;
      } else if (isVisibility === false) {
        return x?.isVisible === false;
      }
    });
  }, [mediaList, isVisibility]);

  useEffect(() => {
    selectedClientId && getAllMediaData();
  }, [selectedClientId, getAllMediaData]);

  useEffect(() => {
    if (albumId) setSelectedAlbumId(albumId);
  }, [albumId]);

  return {
    isLoading,
    inputValue,
    isVisibility,
    mediaOptions,
    dispatchAlbum,
    selectedAlbumId,
    handleSearchEvent,
    handleSearchOption,
    mediaList: mediaListMap,
  };
};
