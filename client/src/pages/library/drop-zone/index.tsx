import { addWidgetMedia } from "@/api-services/library";

import { LibraryWidgetMediaInterface } from "../main/widgetList/drop-zone/drop-zone-interface";

import styles from "./index.module.scss";

interface DropDownInterface {
  library: LibraryWidgetMediaInterface;
  setLibrary: (prev: any) => void;
}

const DropDown: React.FC<DropDownInterface> = ({ library, setLibrary }) => {
  const onDragOver = (e: React.DragEvent) => {
    // Prevent the default behavior (usually not allowing drops)
    e.preventDefault();
  };
  const onDrop = async (e: React.DragEvent) => {
    // Prevent the default behavior (usually open as a link)
    e.preventDefault();

    // Get the data that was transferred during the drag operation
    const dragMedia = JSON.parse(e.dataTransfer.getData("video_data"));

    const media = library.selectedWidget.media;
    const newOrder = media.length + 1;
    // Place video in the selected template field
    await addWidgetMedia({
      id: library?.selectedWidget?._id,
      data: {
        media: [
          ...media.map(({ order, _id }) => ({ order, _id: _id?._id })),
          { order: newOrder, _id: dragMedia?._id },
        ],
      },
      cb: () => {
        setLibrary((prev: any) => {
          prev.media = prev.media?.filter((x: any) => x?._id !== dragMedia?._id);
          prev.selectedWidget.media?.push({
            order: newOrder,
            _id: dragMedia,
          });
          return { ...prev };
        });
      },
    });
  };

  return (
    <div
      className={styles.dropDownBox}
      {...{
        onDrop,
        onDragOver,
      }}
    >
      <span>Drop Video Here</span>
    </div>
  );
};

export default DropDown;
