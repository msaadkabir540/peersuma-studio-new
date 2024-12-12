import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Columns } from "./columns";

import Input from "@/components/input";
import Table from "@/components/table";
import Button from "@/components/button";

import { deleteInventoryById, getAllInventoryData } from "@/api-services/inventory";

import { ClientsStateInterface } from "@/interface/user-selector-interface";
import { SortColumnInterface, InventoryRowInterface } from "./inventory-interface";

import { useDebounce } from "@/custom-hook/debounce";

import editIcon from "@/assets/edit.svg";
import delIcon from "@/assets/del-icon.svg";
import crossFat from "@/assets/cross-fat.svg";

import styles from "./index.module.scss";

const Inventory: React.FC = () => {
  const navigate = useNavigate();
  const { selectedClient } = useSelector((state: ClientsStateInterface) => state.clients);
  const [rows, setRows] = useState<InventoryRowInterface[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState<string>("");
  const [sortColumn, setSortColumn] = useState<SortColumnInterface>({
    sortBy: "",
    sortOrder: "asc", // or provide a default value
  });

  const searchValueDebounce = useDebounce({ value: searchValue, milliSeconds: 2000 });

  const handleChangeSearch = (e: any) => {
    setSearchValue(e.target.value);
  };

  const [templateLoading, setTemplateLoading] = useState<boolean>(false);

  const handleGetAllInventory = async (): Promise<void> => {
    setTemplateLoading(true);
    const { sortBy, sortOrder } = sortColumn;
    try {
      const res = await getAllInventoryData({
        sortBy,
        sortOrder,
        search: searchValueDebounce,
      });
      if (res) {
        setRows(res as any);
      }
    } catch (error) {
      // Handle any errors here if needed
      console.error("Error fetching templates:", error);
    } finally {
      setTemplateLoading(false);
    }
  };

  const handleDelete: (id: string) => void = async (id) => {
    setIsDeleting(id);
    try {
      const res = await deleteInventoryById({ id });
      if (res?.length !== 0) {
        setRows((prev) => [...(prev?.filter(({ _id }) => _id !== id) || [])]);
      }
    } catch (error) {
      console.error(error);
    }
    setIsDeleting("");
  };

  useEffect(() => {
    sortColumn && handleGetAllInventory();
  }, [sortColumn, searchValueDebounce]);

  return (
    <div>
      <div className={styles.templateBtn}>
        <Input
          name="search"
          label="Search"
          value={searchValue}
          className={styles.inputClassInventory}
          onChange={handleChangeSearch}
          iconClass={styles.iconClassInventory}
          {...{
            ...(searchValue && {
              icon: crossFat,
              onClick: () => {
                setSearchValue("");
              },
            }),
          }}
        />
        <Button
          type="button"
          title="Create Inventory"
          handleClick={() => {
            navigate("/create-inventory");
          }}
        />
      </div>
      <Table
        rows={rows}
        columns={Columns}
        sortColumn={sortColumn}
        handleSort={(sort) => setSortColumn(sort)}
        isLoading={templateLoading}
        actions={({ row }) => {
          return (
            <td className={styles.iconRow} key={row?._id}>
              <Button
                type="button"
                icon={editIcon}
                loaderClass={styles.loading}
                handleClick={() => {
                  navigate(`/inventory/${row?._id}`);
                }}
              />
              <Button
                type="button"
                icon={delIcon}
                loaderClass={styles.loading}
                isLoading={isDeleting === row?._id}
                handleClick={() => handleDelete(row?._id)}
              />
            </td>
          );
        }}
      />
    </div>
  );
};
export default Inventory;
