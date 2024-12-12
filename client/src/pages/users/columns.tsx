import _ from "lodash";
import moment from "moment/moment";
import { useNavigate } from "react-router-dom";

import { TableColumnRenderProps, TableColumns } from "@/components/table/table-interface";
import { ActionInterface, ColumnInterface } from "./interface";
import { RowsInterface } from "@/interface/tables-interface";

import Switch from "@/components/switch";
import Button from "@/components/button";

import editIcon from "@/assets/edit.svg";
import delIcon from "@/assets/del-icon.svg";
import tempDeleteIcon from "@/assets/cross-red.svg";
import changeIcon from "@/assets/change-password.png";

import style from "./users.module.scss";

const Columns = ({ control, handleStatusChange }: ColumnInterface): TableColumns[] => [
  {
    key: "fullName",
    title: "Full Name",
    sortKey: "fullName",
    render: ({ value }: TableColumnRenderProps) => {
      return (value ? value : "-") as string;
    },
  },
  {
    key: "username",
    title: "User Name",
    render: ({ value }: TableColumnRenderProps) => {
      return value as string;
    },
  },
  {
    key: "email",
    title: "Email",
    render: ({ value }: TableColumnRenderProps) => {
      return value as string;
    },
  },
  {
    key: "role",
    title: "Role",
    render: ({ value }: TableColumnRenderProps) => {
      return value as string;
    },
  },
  {
    key: "status",
    title: "Active",
    render: ({ row }: TableColumnRenderProps) => {
      return (
        <div className={style.active}>
          <Switch
            control={control}
            defaultValue={row?.status}
            name={`active=${row._id}`}
            handleSwitchChange={() => handleStatusChange({ id: row?._id })}
          />
        </div>
      );
    },
  },
  {
    key: "updatedAt",
    title: "Updated at",
    render: ({ value }: TableColumnRenderProps) => {
      return moment(value as string).format("YYYY-MM-DD") as string;
    },
  },
  { key: "actions", title: "Action" },
];

const TableActions = ({
  row,
  isDeleting,
  setDeleteAction,
  setChangeAction,
  setPermanentDelete,
  permanentDeleteLoading,
}: {
  row: RowsInterface;
  isDeleting: string;
  permanentDeleteLoading: ActionInterface;
  setDeleteAction: (data: ActionInterface) => void;
  setChangeAction: (data: ActionInterface) => void;
  setPermanentDelete: (data: ActionInterface) => void;
}) => {
  const navigate = useNavigate();

  return (
    <td className={style.iconRow} key={row?._id}>
      <Button
        tooltip="edit user"
        icon={editIcon}
        loaderClass={style.loading}
        handleClick={() => {
          navigate(`/users/${row?._id}`);
        }}
      />
      <Button
        tooltip="Temporary delete"
        icon={tempDeleteIcon}
        loaderClass={style.loading}
        isLoading={isDeleting === row?._id ? true : false}
        handleClick={() =>
          setDeleteAction({
            action: true,
            id: row?._id,
            name: row?.fullName || row?.username || "",
          })
        }
      />
      <Button
        tooltip="update password"
        icon={changeIcon}
        loaderClass={style.loading}
        handleClick={() => {
          setChangeAction({
            action: true,
            id: row?._id,
            name: row?.fullName || row?.username || "",
          });
        }}
      />
      <Button
        tooltip="Permanent delete"
        icon={delIcon}
        loaderClass={style.loading}
        isLoading={permanentDeleteLoading?._id === row?._id ? true : false}
        handleClick={() =>
          setPermanentDelete({
            action: true,
            id: row?._id,
            name: row?.fullName || row?.username || "",
          })
        }
      />
    </td>
  );
};

export { Columns, TableActions };
