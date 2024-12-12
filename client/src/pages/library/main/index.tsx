import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

import Header from "./header";
import VideoCard from "./video-card";
import WidgetList from "./widgetList";

import { getAllLibrary } from "@/api-services/library";

import { MediaInterface } from "@/interface/album-interface";
import { ClientsStateInterface } from "@/interface/user-selector-interface";
import { DragMediainterface } from "./widgetList/drop-zone/drop-zone-interface";
import {
  LibraryFieldSchema,
  LibraryMediaInterface,
  SelectedWidgetInterface,
} from "./library-interface";

import styles from "./index.module.scss";

const Library: React.FC = () => {
  const { control, register, setValue, watch } = useForm<LibraryFieldSchema>({
    defaultValues: { active: 1, search: "", selectedWidgetId: "" },
  });
  const { selectedClient } = useSelector((state: ClientsStateInterface) => state.clients);

  const [library, setLibrary] = useState<LibraryMediaInterface>({} as LibraryMediaInterface);
  const { media } = library;

  const getAllLibraryMedia = async () => {
    try {
      const res = await getAllLibrary({
        params: {
          ...watch(),
          clientId: selectedClient || "",
          active: activeTypes[watch("active")],
        },
      });
      if (res?.status === 200) {
        setLibrary((prev) => ({
          ...prev,
          widgets: res.data.allWidgets,
          media: res.data.allLibraries,
          selectedWidget: res?.data?.selectedWidget
            ? {
                ...res?.data?.selectedWidget,
                media: res?.data?.selectedWidget?.media || [],
              }
            : {},
        }));
        !res?.data?.selectedWidget && setValue("selectedWidgetId", "");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const setnewLibraryMedia = (newLibraryMedia: MediaInterface) => {
    setLibrary((prev: any) => {
      prev.media.push(...(newLibraryMedia as any));
      return { ...prev };
    });
  };

  const handleEmbedModal = ({ modalValue }: { modalValue: boolean }) => {
    setLibrary((prev: any) => {
      prev.embedModal = modalValue;
      return { ...prev };
    });
  };

  const handelSetLibrary = ({ updatedWidget }: { updatedWidget: SelectedWidgetInterface }) => {
    setLibrary((prevState: any) => ({
      ...prevState,
      selectedWidget: updatedWidget,
    }));
  };

  const handleSelectedWidgetId = ({ updatedWidget }: { updatedWidget: undefined }) => {
    setLibrary((prev: any) => {
      prev.selectedWidget = updatedWidget;
      return prev;
    });
  };

  const handleRemoveWidgetMediaLibrary = ({ widgetID }: { widgetID: string }) => {
    setLibrary((prev: any) => {
      const removedMedia = prev?.selectedWidget?.media?.find(
        ({ _id }: any) => _id?._id === widgetID,
      )?._id;
      prev.selectedWidget.media = prev?.selectedWidget?.media?.filter(
        ({ _id }: any) => _id?._id !== widgetID,
      );
      prev?.media?.push(removedMedia);
      return { ...prev };
    });
  };

  const handleMoveWidgetMediaLibrary = ({ order }: { order: number }) => {
    setLibrary((prev: any) => {
      const updatedMedia = prev?.selectedWidget?.media ? [...prev.selectedWidget.media] : [];
      const orderNumber = order - 1;

      updatedMedia?.splice(orderNumber, 0, { order: orderNumber, type: "mediaDrop" });

      for (let i = 0; i < updatedMedia.length; i++) {
        updatedMedia[i].order = i + 1;
      }
      return {
        ...prev,
        selectedWidget: {
          ...prev.selectedWidget,
          media: updatedMedia,
        },
      };
    });
  };

  const handleAddWidgetMediaOrder = ({
    dragMedia,
    newOrder,
  }: {
    dragMedia: DragMediainterface;
    newOrder: number;
  }) => {
    setLibrary((prev: any) => {
      prev.media = prev.media?.filter((x: any) => x._id !== dragMedia?._id);
      prev.selectedWidget.media = prev.selectedWidget.media?.filter(
        (x: any) => x.order !== newOrder && x.type !== "mediaDrop",
      );
      prev.selectedWidget.media.push({
        order: newOrder,
        _id: dragMedia,
      });

      return { ...prev };
    });
  };

  const handleAddWidgetMediaNewOrder = ({
    dragMedia,
    newOrder,
  }: {
    dragMedia: DragMediainterface;
    newOrder: number;
  }) => {
    setLibrary((prev: any) => {
      prev.media = prev.media?.filter((x: any) => x._id !== dragMedia?._id);
      prev.selectedWidget.media?.unshift({
        order: newOrder,
        _id: dragMedia,
      });

      return { ...prev };
    });
  };

  const handleRemove = ({ order }: { order: number }) => {
    setLibrary((prev: any) => {
      const updatedMedia = (prev.selectedWidget?.media || [])?.filter(
        (item: any) => item.order !== order || item.type !== "mediaDrop",
      );
      for (let i = 0; i < updatedMedia.length; i++) {
        updatedMedia[i].order = i + 1;
      }

      return {
        ...prev,
        selectedWidget: {
          ...prev.selectedWidget,
          media: updatedMedia,
        },
      };
    });
  };

  useEffect(() => {
    selectedClient && getAllLibraryMedia();
  }, [watch("search"), watch("active"), watch("selectedWidgetId"), selectedClient]);

  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <Header {...{ setValue, watch, control, register, setnewLibraryMedia }} />
        <div className={styles.cardContainer}>
          {media?.map((media, index) => {
            return <VideoCard key={index} {...media} />;
          })}
        </div>
      </div>
      <div className={styles.sideWidget}>
        <WidgetList
          watch={watch}
          control={control}
          library={library}
          handleRemove={handleRemove}
          handelSetLibrary={handelSetLibrary}
          handleEmbedModal={handleEmbedModal}
          handleSelectedWidgetId={handleSelectedWidgetId}
          handleAddWidgetMediaOrder={handleAddWidgetMediaOrder}
          handleAddWidgetMediaNewOrder={handleAddWidgetMediaNewOrder}
          handleMoveWidgetMediaLibrary={handleMoveWidgetMediaLibrary}
          handleRemoveWidgetMediaLibrary={handleRemoveWidgetMediaLibrary}
        />
      </div>
    </div>
  );
};

export default Library;

const activeTypes: { 1: boolean; 2: boolean; 3: undefined; [key: string]: string | any } = {
  1: true,
  2: false,
  3: undefined,
};
