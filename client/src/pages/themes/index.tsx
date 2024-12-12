import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Columns } from "./columns";

import Table from "@/components/table";
import Button from "@/components/button";

import { deleteThemeById, getAllThemesData } from "@/api-services/themes";

import { SortColumnInterface, ThemesRowInterface } from "./themes-interface";

import editIcon from "@/assets/edit.svg";
import delIcon from "@/assets/del-icon.svg";

import styles from "./index.module.scss";

const Themes: React.FC = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState<ThemesRowInterface[]>([]);
  const [isDeleting, setIsDeleting] = useState<string>("");
  const [sortColumn, setSortColumn] = useState<SortColumnInterface>({
    sortBy: "",
    sortOrder: "asc", // or provide a default value
  });
  const [templateLoading, setTemplateLoading] = useState<boolean>(false);
  const { sortBy, sortOrder } = sortColumn;

  const handleGetAllTemplates = async (): Promise<void> => {
    setTemplateLoading(true);
    try {
      const res = await getAllThemesData({ params: { sortBy, sortOrder } });
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
      const res = await deleteThemeById({ id });
      if (res?.length !== 0) {
        setRows((prev) => [...(prev?.filter(({ _id }) => _id !== id) || [])]);
      }
    } catch (error) {
      console.error(error);
    }
    setIsDeleting("");
  };

  useEffect(() => {
    handleGetAllTemplates();
  }, [sortColumn]);

  return (
    <div>
      <div className={styles.templateBtn}>
        <Button
          type="button"
          title="Create Themes"
          handleClick={() => {
            navigate("/create-themes");
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
                  navigate(`/themes/${row?._id}`);
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
export default Themes;
