import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

import Button from "@/components/button";
import Table from "@/components/table";

import { Columns } from "./columns";

import { deleteTemplateById, getAllTemplates } from "@/api-services/templates";

import { TemplatesInterface, SortColumnInterface } from "./template-interface";
import { WedgetRowInterface } from "@/interface/tables-interface";

import editIcon from "@/assets/edit.svg";
import delIcon from "@/assets/del-icon.svg";

import style from "./templates.module.scss";

const Templates: React.FC<TemplatesInterface> = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState<WedgetRowInterface[]>([]);
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
      const res = await getAllTemplates({ params: { sortBy, sortOrder } });
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
      const res = await deleteTemplateById({ id });
      if (res?.length !== 0) {
        setRows((prev) => [...(prev?.filter(({ _id }) => _id !== id) || [])]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleGetAllTemplates();
  }, [sortColumn]);

  return (
    <div>
      <div className={style.templateBtn}>
        <Button
          type="button"
          title="Create Template"
          handleClick={() => {
            navigate("/create-template");
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
            <td className={style.iconRow} key={row?._id}>
              <Button
                type="button"
                icon={editIcon}
                loaderClass={style.loading}
                handleClick={() => {
                  navigate(`/template/${row?._id}`);
                }}
              />
              <Button
                type="button"
                icon={delIcon}
                loaderClass={style.loading}
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

export default Templates;
