import _ from "lodash";
import moment from "moment";
import { NavigateFunction, useNavigate } from "react-router-dom";

import { TableColumnRenderProps, TableColumns } from "@/components/table/table-interface";

import Switch from "@/components/switch";
import Button from "@/components/button";

import { RowsInterface } from "@/interface/tables-interface";
import { ActionInterface, ColumnInterface } from "./clients-interface";

import editIcon from "@/assets/edit.svg";
import NoImage from "@/assets/noImage.png";
import delIcon from "@/assets/del-icon.svg";

import style from "./clients.module.scss";

const Columns = ({ control, handleStatusChange }: ColumnInterface): TableColumns[] => [
  {
    key: "url",
    title: "",
    render: ({ row }: TableColumnRenderProps) => {
      const rows = row as RowsInterface;
      return (
        <div className={style.thumbnailContainer}>
          <div className={style.iconDiv}>
            {(row as RowsInterface)?.url ? (
              <img height={50} src={rows?.url} alt="themeVideoThumbnailUrl" />
            ) : (
              <img height={50} src={NoImage} alt="NoImage" />
            )}
          </div>
        </div>
      );
    },
  },
  {
    key: "name",
    title: "School Name",
    sortKey: "name",
    render: ({ value }) => {
      return (value as string) || ("" as string);
    },
  },
  {
    key: "website",
    title: "Website",
    render: ({ value }) => {
      return value as string;
    },
  },
  {
    key: "active",
    title: "Active",
    render: ({ row }) => {
      return (
        <div className={style.active}>
          <Switch
            control={control}
            defaultValue={row?.status}
            name={`active=${row._id}`}
            handleSwitchChange={() => handleStatusChange({ id: row?._id, status: row?.status })}
          />
        </div>
      );
    },
  },
  {
    key: "updatedAt",
    title: "Updated at",
    render: ({ value }) => {
      return moment(value as string).format("YYYY-MM-DD") as string;
    },
  },
  { key: "actions", title: "Action" },
];

const Actions = ({ row, handleDeleteActionActive, isDeleting }: ActionInterface) => {
  const navigate: NavigateFunction = useNavigate();
  return (
    <td className={style.iconRow} key={row?._id}>
      <Button
        icon={editIcon}
        loaderClass={style.loading}
        handleClick={() => {
          navigate(`/clients/${row?._id}`);
        }}
      />
      <Button
        icon={delIcon}
        isLoading={isDeleting}
        loaderClass={style.loading}
        handleClick={() =>
          handleDeleteActionActive({ action: true, id: row?._id, name: row?.name as string })
        }
      />
    </td>
  );
};

export { Columns, Actions };
