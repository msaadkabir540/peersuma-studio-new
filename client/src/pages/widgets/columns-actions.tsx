import { useNavigate } from "react-router-dom";
import { writeText } from "clipboard-polyfill";

import Modal from "@/components/modal";
import Button from "@/components/button";
import Switch from "@/components/switch";
import createNotification from "@/common/create-notification";

import { deleteWidget } from "@/api-services/widget";

import { ColumnInterface } from "./interface";
import { RowsInterface } from "@/interface/tables-interface";
import { TableColumns } from "@/components/table/table-interface";

import copyIcon from "@/assets/copy.png";
import editIcon from "@/assets/edit.svg";
import delIcon from "@/assets/del-icon.svg";

import styles from "./index.module.scss";

const Columns = ({ control, handleStatusChange }: ColumnInterface): TableColumns[] => [
  {
    title: "Name",
    key: "name",
    render: ({ value }) => {
      return (value || "-") as string;
    },
  },
  {
    key: "active",
    title: "Active",
    render: ({ row }) => {
      return (
        <div className={styles.active}>
          <Switch
            control={control}
            defaultValue={row?.active}
            name={`widget_status[${row._id}]`}
            handleSwitchChange={() => handleStatusChange({ row })}
          />
        </div>
      );
    },
  },
  {
    key: "actions",
    title: "Action",
  },
];

const TableActions = ({
  row,
  setDeleteAction,
  deleteWidgetsId,
  removeDeletedWidget,
}: {
  row: RowsInterface;
  setDeleteAction: ({ id }: { id: string }) => void;
  deleteWidgetsId: string;
  removeDeletedWidget: (id: string) => void;
}) => {
  const navigate = useNavigate();

  return (
    <td className={styles.iconRow} key={row?._id}>
      <>
        <Button
          type="button"
          ariaLabel="Copy Link Button"
          icon={copyIcon}
          disabled={!row?._id}
          handleClick={() => {
            // copy to clipboard
            writeText(`${window.location.origin}/widget/${row?._id}`);
            createNotification("success", "Showcase Link copied!");
          }}
        />
        <Button
          type="button"
          ariaLabel="Edit Button"
          icon={editIcon}
          handleClick={() => {
            navigate(`/widget/${row?._id}`);
          }}
          loaderClass={styles.loading}
        />
        <Button
          type="button"
          ariaLabel="Delete Button"
          icon={delIcon}
          loaderClass={styles.loading}
          isLoading={false}
          handleClick={async () => {
            // setWidget((prev) => ({ ...prev, del: _id }));
            setDeleteAction({ id: row?._id });
          }}
        />
        <Modal
          {...{
            open: deleteWidgetsId === row?._id,
            handleClose: () => setDeleteAction({ id: "" }),
          }}
          className={styles.bodyModal}
          modalWrapper={styles.opacityModal}
        >
          <div className={styles.deleteModal}>
            <img src={delIcon} alt={"Delete widget"} height={50} />
            <h2>Delete widget?</h2>
            <p>Are you sure you want to delete this widget.</p>
            <div className={styles.buttonContainer}>
              <Button
                type="button"
                title="Cancel"
                ariaLabel="Cancel button"
                handleClick={() => {
                  setDeleteAction({ id: "" });
                }}
                className={styles.cancelBtn}
              />
              <Button
                type="button"
                title="Delete button"
                ariaLabel="Delete Widget"
                className={styles.delBtn}
                loaderClass={styles.loading}
                // isLoading={deleteWidgetsId === row?._id}
                handleClick={async () => {
                  await deleteWidget({ _id: row?._id });
                  setDeleteAction({ id: "" });
                  removeDeletedWidget(row?._id);
                }}
              />
            </div>
          </div>
        </Modal>
      </>
    </td>
  );
};

export { Columns, TableActions };
