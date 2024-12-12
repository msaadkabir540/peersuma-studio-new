import { addWidgetMedia } from "@/api-services/library";

import removeIcon from "@/assets/del-icon.svg";

import { DropZOneInterface } from "./drop-zone-interface";
import { SelectedWidgetInterface } from "../widget-list-interface";

import styles from "./index.module.scss";

const DropZone: React.FC<DropZOneInterface> = ({
  order,
  library,
  handleRemove,
  handleAddWidgetMediaOrder,
  handleAddWidgetMediaNewOrder,
}) => {
  const onDragOver = (e: React.DragEvent) => {
    // Prevent the default behavior (usually not allowing drops)
    e.preventDefault();
  };
  const onDrop = async (e: React.DragEvent) => {
    // Prevent the default behavior (usually open as a link)
    e.preventDefault();

    // Get the data that was transferred during the drag operation
    const dragMedia = JSON.parse(e.dataTransfer.getData("video_data"));

    const media = library.selectedWidget.media?.filter(({ type }) => type !== "mediaDrop");
    // Check if order is provided

    try {
      const widgetId = library?.selectedWidget?._id;
      const existingMedia = media?.map(({ order, _id }: SelectedWidgetInterface) => ({
        order,
        _id: _id,
      }));
      const newOrder = order ? order : 1;

      let res;
      if (!order) {
        res = await addWidgetMedia({
          id: widgetId,
          data: {
            media: [{ order: newOrder, _id: dragMedia?._id }, ...existingMedia],
          } as any,
        });
      } else {
        existingMedia?.splice(order - 1, 0, {
          order: newOrder,
          _id: dragMedia?._id,
        });
        res = await addWidgetMedia({
          id: widgetId,
          data: {
            media: [...existingMedia],
          } as any,
        });
      }

      if (res.status === 200) {
        const updatedMedia = res.data.updatedWidget.media.find(
          (x: any) => x._id === dragMedia?._id,
        );
        if (!order) {
          handleAddWidgetMediaNewOrder && handleAddWidgetMediaNewOrder({ dragMedia, newOrder });
        } else {
          handleAddWidgetMediaOrder &&
            handleAddWidgetMediaOrder({ dragMedia: dragMedia, newOrder: updatedMedia.order });
        }
      }
    } catch (error) {
      console.error(error);
    }
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
      {order && (
        <img
          aria-hidden="true"
          src={removeIcon}
          alt="removeIcon"
          className={styles.removeBtn}
          onClick={() => handleRemove && handleRemove({ order })}
        />
      )}
    </div>
  );
};

export default DropZone;
