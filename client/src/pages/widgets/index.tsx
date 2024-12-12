import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Table from "@/components/table";
import Button from "@/components/button";
import Loading from "@/components/loading";

import { Columns, TableActions } from "./columns-actions";

import { getAllWidgets, updateWidget } from "@/api-services/widget";

import { RowsInterface, WidgetTableRows } from "@/interface/tables-interface";

import styles from "./index.module.scss";

const Widgets: React.FC = () => {
  const navigate = useNavigate();
  const { control } = useForm({});
  const { selectedClient } = useSelector((state: any) => state.clients);

  const [loader, setLoader] = useState<boolean>(true);
  const [widgetLists, setWidgetLists] = useState<WidgetTableRows[]>([]);
  const [deleteWidgetsId, setDeleteWidgetsId] = useState<string>("");

  const handleStatusChange = async ({ row }: { row: RowsInterface }) => {
    await updateWidget({
      _id: row._id,
      data: { active: !row?.active },
    });
  };

  const handleGetWidgets = async () => {
    setLoader(true);
    const response = await getAllWidgets({ params: { clientId: selectedClient } });
    if (response?.allWidgets)
      setWidgetLists(
        response?.allWidgets?.map((x: any) => {
          return {
            name: x?.name || "",
            active: x?.active || false,
            _id: x?._id,
            id: x?._id,
          };
        }),
      );
    setLoader(false);
  };

  useEffect(() => {
    handleGetWidgets();
  }, [selectedClient]);

  return (
    <div className={styles.activeTab} style={{ width: "100%" }}>
      <div className={styles.create}>
        <Button
          title="Add Widget"
          type="button"
          ariaLabel="Add Widget"
          handleClick={() => {
            navigate("/widget/create");
          }}
        />
      </div>
      {loader ? (
        <Loading pageLoader={true} />
      ) : (
        <Table
          rows={widgetLists}
          columns={Columns({ handleStatusChange, control })}
          isLoading={loader}
          actions={({ row }) => {
            return (
              <TableActions
                row={row}
                setDeleteAction={({ id }) => {
                  setDeleteWidgetsId(id);
                }}
                deleteWidgetsId={deleteWidgetsId}
                removeDeletedWidget={(id: string) => {
                  let widgetListsCopy = [...widgetLists];
                  widgetListsCopy = widgetListsCopy?.filter((x) => x?._id !== id);
                  setWidgetLists(widgetListsCopy);
                }}
              />
            );
          }}
        />
      )}
    </div>
  );
};

export default Widgets;
