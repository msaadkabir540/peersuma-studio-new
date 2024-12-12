import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";

import Header from "./header/index";
import Loading from "@/components/loading";
import AlbumCards from "./album-cards/index";

import { getAllAlbums } from "@/api-services/album";

import { GetAllAlbumsInterface } from "@/interface/album-interface";
import { ClientsStateInterface } from "@/interface/user-selector-interface";

import styles from "./index.module.scss";

const Album: React.FC = () => {
  const { selectedClient } = useSelector((state: ClientsStateInterface) => state.clients);
  const [albums, setAlbums] = useState<GetAllAlbumsInterface>({} as GetAllAlbumsInterface);
  const [updatePage, setUpdatePage] = useState<number>(0);

  const { control, register, setValue, watch } = useForm({});

  const { data, loading } = albums;

  const sortOrder = useMemo(() => {
    const selectedSortOrder = watch("sortOrder");

    switch (selectedSortOrder) {
      case "Last Modified":
        return { sortBy: "updatedAt", sortOrder: "desc" };
      case "Oldest":
        return { sortBy: "createdAt", sortOrder: "asc" };
      case "Alphabetical ascending":
        return { sortBy: "name", sortOrder: "asc" };
      case "Alphabetical descending":
        return { sortBy: "name", sortOrder: "desc" };
      default:
        return { sortBy: "updatedAt", sortOrder: "desc" };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch("sortOrder")]);

  const handleGetAlbums = async () => {
    setAlbums((prev) => ({ ...prev, loading: true }));
    let data = structuredClone(watch());
    data = { ...data, ...sortOrder };
    try {
      const res = await getAllAlbums({
        params: {
          ...data,
          clientId: selectedClient,
        },
      });
      if (res.status === 200) {
        setAlbums((prev) => ({ ...prev, data: res.data.data }));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setAlbums((prev) => ({ ...prev, loading: false }));
    }
  };
  const updateAlbums = () => setUpdatePage((prev) => prev + 1);

  useEffect(() => {
    selectedClient && handleGetAlbums();
  }, [watch("search"), watch("status"), watch("producer"), sortOrder, selectedClient, updatePage]);

  return (
    <>
      <Header {...{ control, register, setValue, watch, albums, setAlbums, updateAlbums }} />
      {loading ? (
        <Loading pageLoader={true} />
      ) : (
        <div className={styles.ContainerAlbum}>
          {data
            ?.filter(
              ({ isDeleted }: any) => !isDeleted || isDeleted === null || isDeleted === undefined,
            )
            ?.map((document, index) => <AlbumCards key={index} {...document} />)}
        </div>
      )}
    </>
  );
};

export default Album;
