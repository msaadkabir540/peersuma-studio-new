import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Table from "@/components/table";
import Button from "@/components/button";
import Pagination from "@/components/pagination";
import DeleteModal from "./component/delete-modal";
import createNotification from "@/common/create-notification";

import { setAllClientsInStore } from "@/reducers/clients";
import { deleteClient, getAllClients, updateClientStatus } from "@/api-services/clients";

import { Actions, Columns } from "./columns-actions";
import { ClientInterface } from "@/interface/client-interface";
import { ClientsStateInterface } from "@/interface/user-selector-interface";
import { SortColumnInterface, deleteActionInterface } from "./clients-interface";

import style from "./clients.module.scss";

const Clients: React.FC = () => {
  const { watch, control, setValue } = useForm();
  const pageSizeWatch = watch("pageSize");
  const pageWatch = watch("page");

  const navigate: NavigateFunction = useNavigate();
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [sortColumn, setSortColumn] = useState<SortColumnInterface>({
    sortBy: "",
    sortOrder: "asc",
  });
  const [deleteAction, setDeleteAction] = useState<deleteActionInterface>({
    action: false,
    id: "",
    name: "",
  });
  const [clientLoading, setClientLoading] = useState<boolean>(false);
  const { clients } = useSelector((state: ClientsStateInterface) => state.clients);

  const dispatch = useDispatch();

  const handleGetAllClients: () => Promise<void> = async () => {
    setClientLoading(true);
    try {
      const response = await getAllClients({
        params: {
          ...(sortColumn || { sortBy: "name", sortOrder: "asc" }),
          ...watch(),
        },
      });
      if (response.status === 200) {
        dispatch(setAllClientsInStore({ clients: response?.data?.allClients }));
        setValue("totalCount", response?.data.count);
      } else {
        createNotification("error", response?.data?.error || "Could not fetch clients!", 5000);
      }
      setClientLoading(false);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error(error);
      }
    }
  };

  const handleStatusChange = async ({
    id,
    status,
  }: {
    id: string;
    status: boolean | undefined;
  }) => {
    await updateClientStatus({ id, data: { status: status } });
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    const res = await deleteClient({ id: id });
    if (res.status === 200) {
      const newData = clients?.filter(({ _id }: ClientInterface) => _id !== id);
      dispatch(setAllClientsInStore({ clients: newData }));
      createNotification("success", "Client deleted successfully!", 5000);
    } else {
      createNotification("error", res?.data?.error || "Client Deletion Failed!", 5000);
    }
    setIsDeleting(false);
  };

  useEffect(() => {
    handleGetAllClients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortColumn, pageSizeWatch, pageWatch]);

  const handleDeleteAction = () => {
    setDeleteAction({ action: false, id: "", name: "" });
  };

  const handleDeleteActionActive = ({
    action,
    id,
    name,
  }: {
    action: boolean;
    id: string;
    name: string;
  }) => {
    setDeleteAction({ action, id, name });
  };

  return (
    <div>
      <div className={style.cBtn}>
        <Button
          title="Create School"
          handleClick={() => {
            navigate("/create-client");
          }}
        />
      </div>
      <Table
        rows={clients}
        columns={Columns({ control, handleStatusChange })}
        sortColumn={sortColumn}
        handleSort={(sort) => setSortColumn(sort)}
        isLoading={clientLoading}
        actions={({ row }) => {
          return (
            <Actions
              row={row}
              isDeleting={isDeleting}
              handleDeleteActionActive={handleDeleteActionActive}
            />
          );
        }}
      />
      <Pagination
        page={watch("page")}
        pageSize={watch("pageSize")}
        totalCount={watch("totalCount")}
        control={control}
        setValue={setValue}
        perPageText="Records per page"
      />
      <DeleteModal {...{ deleteAction, handleDelete, handleDeleteAction }} />
    </div>
  );
};

export default Clients;
