import moment from "moment/moment";
import _ from "lodash";

import { TableColumns } from "@/components/table/table-interface";
import { ActionInterface, ColumnsCategoryInterface } from "./categories-interface";

import Input from "@/components/input";
import DeleteModal from "./delete-modal";
import Button from "@/components/button";

import cross from "@/assets/cross.svg";
import editIcon from "@/assets/edit.svg";
import delIcon from "@/assets/del-icon.svg";

import styles from "./index.module.scss";

const Columns = ({ register }: ColumnsCategoryInterface): TableColumns[] => [
  {
    title: "Tag Name",
    key: "name",
    sortKey: "name",
    render: ({ row, value, editing }) => {
      return editing === row?._id ? (
        <Input
          className={styles.categoryNameInput}
          label="Tag Name"
          name="name"
          register={register}
        />
      ) : (
        (value as string) || "-"
      );
    },
  },
  {
    title: "Files Count",
    key: "count",
    sortKey: "count",
    render: ({ value }) => {
      return (value as number) || 0;
    },
  },
  {
    key: "updatedAt",
    title: "Changed On",
    sortKey: "updatedAt",
    render: ({ value }) => {
      return value ? moment(value as string).format("YYYY-MM-DD") : "-";
    },
  },
  {
    key: "actions",
    title: "Action",
  },
];

const Actions = ({
  del,
  row,
  editing,
  handleEditClick,
  deleteCategoryId,
  hanldeCancelClick,
  handleDeleteClick,
  handleCreateUpdate,
  createUpdateCategory,
  handleSetDelModalClose,
}: ActionInterface) => {
  const { _id, name, count } = row;
  return (
    <td className={styles.iconRow} key={_id}>
      {editing !== _id ? (
        <>
          <Button
            type="button"
            ariaLabel="Edit button"
            icon={editIcon}
            handleClick={() => {
              handleEditClick(_id, name as string);
            }}
            loaderClass={styles.loading}
          />
          <Button
            type="button"
            ariaLabel="Delete "
            icon={delIcon}
            loaderClass={styles.loading}
            isLoading={deleteCategoryId === _id}
            handleClick={async () => {
              handleSetDelModalClose(_id);
            }}
          />
          {/*  delete Modal  */}
          <DeleteModal
            del={del}
            _id={_id}
            count={count}
            handleSetDelModalClose={() => handleSetDelModalClose()}
            hanldeCancelClick={() => hanldeCancelClick()}
            handleDeleteClick={() => handleDeleteClick({ _id })}
            deleteCategoryId={deleteCategoryId}
          />
        </>
      ) : (
        <>
          <Button
            icon={cross}
            type="button"
            ariaLabel="Cancel "
            handleClick={async () => hanldeCancelClick()}
          />
          <Button
            title="Save"
            type="button"
            ariaLabel="Save"
            loaderClass={styles.loading}
            isLoading={createUpdateCategory}
            handleClick={async () => {
              handleCreateUpdate();
            }}
          />
        </>
      )}
    </td>
  );
};

export { Columns, Actions };
