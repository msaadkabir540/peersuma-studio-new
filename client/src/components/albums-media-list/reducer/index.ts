import { AlbumDataInterface, MediaType, StateInterface } from "../media-list-interface";
import { ActionInterface } from "./reducer-interface";

const updateMediaData = ({
  albumData,
  updatedData,
  selectionId,
}: {
  albumData: AlbumDataInterface[];
  updatedData: MediaType[];
  selectionId: string;
}) => {
  const albumId = selectionId;
  const updatedAlbumData = albumData?.map((album) => {
    if (album._id === albumId) {
      const updatedAlbumshots = album.albumshots?.map((shot) => ({
        ...shot,
        media: shot.media?.map((mediaItem) => {
          const updatedItem = updatedData?.find(
            (updatedMediaItem: MediaType) => updatedMediaItem._id === mediaItem._id,
          );
          return updatedItem ? { ...mediaItem, ...updatedItem } : mediaItem;
        }),
      }));
      return { ...album, albumshots: updatedAlbumshots };
    }
    return album;
  });
  return updatedAlbumData;
};

export const reducer = (state: StateInterface, action: ActionInterface) => {
  const { payload, isVisibility, selectionId, visibilityResponse } = action;
  switch (action.type) {
    case "ADD_ALBUM_DATA":
      const mediaOptions = payload.albumsData?.map(
        ({ _id, name, description }: { _id: string; name: string; description: string }) => ({
          label: name,
          value: _id,
          description,
        }),
      );
      return { ...state, ...payload, mediaOptions };
    case "IS_VISIBILITY_STATE":
      return { ...state, isVisibility: isVisibility };
    case "SET_SELECTED_ID":
      return { ...state, selectionId: selectionId };
    case "EVENT_ALBUM_VISIBILITY":
      const updatedAlbumData = updateMediaData({
        albumData: state.albumsData as AlbumDataInterface[],
        updatedData: visibilityResponse,
        selectionId: action?.visibilityId as string,
      });
      return { ...state, albumsData: updatedAlbumData };
    default:
      return state;
  }
};
