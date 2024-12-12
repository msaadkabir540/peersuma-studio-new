import moment from "moment";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

import Table from "@/components/table";
import Modal from "@/components/modal";
import Input from "@/components/input";
import Button from "@/components/button";
import Loading from "@/components/loading";

import {
  deleteTemplateCategory,
  createTemplateMediaCategory,
  updateTemplateMediaCategory,
  getAllTemplateMediaCategories,
} from "@/api-services/template-media-category";

import cross from "@/assets/cross.svg";
import editIcon from "@/assets/edit.svg";
import delIcon from "@/assets/del-icon.svg";

import styles from "./index.module.scss";
import { CategoriesInterface, CategoryLoader } from "./categories-interface";
import { Actions, Columns } from "./columns";
import DeleteModal from "./delete-modal";
import createNotification from "@/common/create-notification";

const Categories: React.FC = () => {
  const { reset, watch, register } = useForm({});

  const [del, setDel] = useState<string>("");
  const [loader, setLoader] = useState<CategoryLoader>({
    deleteCategoryId: "",
    createTemplateLoader: false,
    createUpdateCategory: false,
    deleteCategoryLoading: false,
    getAllLoading: false,
  });
  const [editing, setEditing] = useState<string>("");
  const [categories, setCategories] = useState<CategoriesInterface[]>([]);
  const [sortColumn, setSortColumn] = useState<{
    sortBy: string;
    sortOrder: "asc" | "desc";
  }>({
    sortBy: "",
    sortOrder: "asc",
  });

  const { deleteCategoryId, createUpdateCategory } = loader;

  const handleCreateUpdate = async () => {
    setLoader((prev) => ({ ...prev, createUpdateCategory: true }));
    try {
      let res;
      if (editing === "new") {
        res = await createTemplateMediaCategory({
          name: watch("name"),
        });
      } else if (editing) {
        res = await updateTemplateMediaCategory({
          _id: editing,
          name: watch("name"),
        });
      }

      if (res && res.status === 200) {
        const updatedCategory = editing === "new" ? res.data.newCategory : res.data.updatedCategory;

        setCategories((prev) => {
          const filteredMedia = prev.filter((category) => category?._id !== updatedCategory?._id);
          return [updatedCategory, ...filteredMedia];
        });

        reset({});
        createNotification("success", res?.data?.msg || "Tag Created Successfully!");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setEditing("");
      setLoader((prev) => ({ ...prev, createUpdateCategory: false }));
    }
  };

  const handleSort = ({ sortBy, sortOrder }: { sortBy: string; sortOrder: "asc" | "desc" }) => {
    setCategories((prev) => {
      const sorted = prev.sort((a, b) => {
        const key = sortOrder as keyof CategoriesInterface;
        const aValue = String(a[key]);
        const bValue = String(b[key]);
        if (sortOrder === "asc") {
          return aValue.localeCompare(bValue);
        } else {
          return bValue.localeCompare(aValue);
        }
      });
      return [...sorted];
    });
    setSortColumn((prev) => ({ ...prev, sortBy, sortOrder }));
  };

  const handleGetAll = async () => {
    setLoader((prev) => ({ ...prev, getAllLoading: true }));
    try {
      const res = await getAllTemplateMediaCategories();
      if (res.status === 200) {
        setCategories(res.data.categories);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoader((prev) => ({ ...prev, getAllLoading: false }));
    }
  };

  useEffect(() => {
    handleGetAll();
  }, []);

  const handleSetDelModalClose = (_id?: string) => {
    if (_id) {
      setDel(_id);
    } else {
      setDel("");
    }
  };

  const hanldeCancelClick = () => {
    setDel("");
    setEditing("");
    reset({});
  };

  const handleTemplateDelete = async ({ _id }: { _id: string }) => {
    try {
      const res = await deleteTemplateCategory({ _id });
      if (res.status === 200) {
        setCategories((prev) => {
          const filteredMedia = prev.filter((category) => category?._id !== _id);
          return [...filteredMedia];
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteClick = ({ _id }: { _id: string }) => {
    setLoader((prev) => ({ ...prev, deleteCategoryId: _id, deleteCategoryLoading: true }));
    handleTemplateDelete({ _id });
    setLoader((prev) => ({ ...prev, deleteCategoryId: "", deleteCategoryLoading: false }));
    setDel("");
  };

  const handleEditClick = (_id: string, name: string) => {
    setEditing(_id);
    reset({ name });
  };
  return (
    <>
      <div
        className={styles.activeTab}
        style={{
          width: "100%",
        }}
      >
        <div className={styles.uploadBtn}>
          <div className={styles.createCategory}>
            {editing === "new" && (
              <>
                <Input
                  className={styles.categoryName}
                  label="Tag Name"
                  name="name"
                  register={register}
                />
                <Button
                  type="button"
                  className={styles.createBtn}
                  handleClick={handleCreateUpdate}
                  title={editing === "new" ? "Save" : "Update"}
                  isLoading={loader.createTemplateLoader}
                />
              </>
            )}
            {editing !== "new" && (
              <Button
                title="Add Tag"
                type="button"
                handleClick={() => {
                  reset({});
                  setEditing("new");
                }}
              />
            )}

            {editing === "new" && (
              <img
                className={styles.closeIcon}
                src={cross}
                alt="cross"
                width={30}
                height={30}
                aria-hidden="true"
                onClick={() => {
                  categories?.length > 0 && setCategories([...(categories || [])]);
                  setEditing("");
                  reset({});
                }}
              />
            )}
          </div>
        </div>
        {loader?.getAllLoading ? (
          <Loading pageLoader={true} />
        ) : (
          <Table
            rows={categories}
            editing={editing}
            sortColumn={sortColumn}
            isLoading={loader.getAllLoading}
            handleSort={handleSort}
            columns={Columns({ register })}
            actions={({ row }) => {
              return (
                <Actions
                  {...{
                    row,
                    del,
                    editing,
                    handleEditClick,
                    deleteCategoryId,
                    hanldeCancelClick,
                    handleDeleteClick,
                    handleCreateUpdate,
                    createUpdateCategory,
                    handleSetDelModalClose,
                  }}
                />
              );
            }}
          />
        )}
      </div>
    </>
  );
};

export default Categories;
