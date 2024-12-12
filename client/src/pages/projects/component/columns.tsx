import _ from "lodash";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { Control, FieldValues } from "react-hook-form";

import Switch from "@/components/switch";
import Button from "@/components/button";
import Tooltip from "@/components/tooltip";

import editIcon from "@/assets/edit.svg";
import delIcon from "@/assets/del-icon.svg";

import { TableActionInterface } from "../project-interface";
import { TableColumns } from "@/components/table/table-interface";

import style from "../projects.module.scss";

const Columns = ({
  handleProcessingStatus,
  control,
}: {
  handleProcessingStatus: ({ id }: { id: string }) => void;
  control: Control<FieldValues, any>;
}): TableColumns[] => [
  {
    key: "projectName",
    title: "Project Name",
    render: ({ value }) => {
      return value as string;
    },
  },
  {
    key: "yourName",
    title: "Your Name",
    render: ({ value }) => {
      return value as string;
    },
  },
  {
    key: "updatedAt",
    title: "Updated at",
    render: ({ value }) => {
      return moment(value as string).format("YYYY-MM-DD");
    },
  },
  {
    key: "edit",
    title: "Editing in Progress",
    render: ({ row }) => {
      const handleRowId = () => {
        handleProcessingStatus({ id: row?._id });
      };
      return (
        <div className={style.swtichProjectClass}>
          <Tooltip
            backClass=""
            text={`${
              !row?.isEditingProcess && row?.videoProjectId?.status === "in-post-production"
                ? "Editing in Progress is enable"
                : row?.videoProjectId?.status === "cancelled"
                  ? "Editing in cancelled"
                  : row?.videoProjectId?.status === "closed"
                    ? "Editing in closed"
                    : row?.videoProjectId?.status != "in-post-production"
                      ? "This project is not in post production"
                      : "Editing in Progress"
            }`}
          >
            <Switch
              control={control}
              disabled={row?.videoProjectId?.status != "in-post-production" ? true : false}
              defaultValue={row?.isEditingProcess}
              name={`${row._id}`}
              mainClass={style.switch}
              handleSwitchChange={handleRowId}
            />
          </Tooltip>
        </div>
      );
    },
  },
  {
    key: "status",
    title: "Status",
    render: ({ row }) => {
      return (
        <div className={style?.status}>
          {row?.videoProjectId?.status?.replace(/-/g, " ") as string}
        </div>
      );
    },
  },
  { key: "actions", title: "Action" },
];

const TableActions = ({
  row,
  watch,
  isDeleting,
  handleDelete,
  handleProjectStatusClick,
}: TableActionInterface) => {
  const navigate = useNavigate();

  return (
    <td className={style.iconRow} key={row?._id}>
      <Button
        title={watch("projectStatus") ? "Close" : "Open"}
        handleClick={async () => {
          handleProjectStatusClick({ projectStatus: watch("projectStatus"), row });
        }}
      />
      <Button
        icon={editIcon}
        loaderClass={style.loading}
        handleClick={() => {
          navigate(`/project/${row?._id}`);
        }}
      />
      {!row?.videoProjectId && (
        <Button
          icon={delIcon}
          loaderClass={style.loading}
          isLoading={isDeleting === row?._id}
          handleClick={() => {
            handleDelete({ _id: row?._id });
          }}
        />
      )}
    </td>
  );
};

export { TableActions, Columns };
